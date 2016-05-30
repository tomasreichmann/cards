import { CARDS_SHUFFLE, CARDS_END_TURN, CARDS_MOVE_CARD, CARDS_SHOW_FACE, CARDS_CLICK, WOOD, IRON, SERF, STONE, GOLD, MAX_BUILDING_LEVEL } from '../constants';
import gameInitialization from './gameInitialization';
import { shuffle, updateLast } from './utils';

const findCardByIndex = (arr, matchIndex) => (
  matchIndex.toString().split("-")
    .reduce( (arr, matchIndex) => (
      arr[parseInt(matchIndex)]
    ), arr )
);

const findByContent = (arr, matchObject, findFirst) => {
  // console.log("findByContent", matchObject);
  let result = findFirst ? false : [];
  itemLoop: for (var index = 0; index < arr.length; index++) {
    let item = arr[index];

    if( item && item.constructor === Array ){
        item = findByContent( item, matchObject, findFirst );
        if( !item || item.length == 0){
          continue itemLoop
        }
    } else {
      for( let property in matchObject ){
        if( matchObject.hasOwnProperty(property) ){
          if(item[property] !== matchObject[property]){
            // console.log("item didnt match")
            continue itemLoop
          }
        }
      }
      //console.log("item matched")
    }
    if(findFirst){
      console.log("findByContent result", item);
      return item;
    }
    if( item && item.constructor === Array ){
      result = [...result, ...item ];
    } else {
      item && result.push(item);
    }
  }
  //console.log("findByContent result", result);
  return result
};
let testArray = [{a: 1}, {b: 2}, {b: 2}, {b: 3}];
// console.log("findByContent #1 b", findByContent(testArray, { b: 2 }, true) );
// console.log("findByContent #2 [b,b]", findByContent(testArray, { b: 2 }, false) );
// console.log("findByContent #3 b", findByContent([testArray, testArray], { b: 2 }, true) );
// console.log("findByContent #4 [b,b,b,b]", findByContent([testArray, testArray], { b: 2 }, false) );

const updateCardByIndex = (arr, matchIndex, updateWith) => {
  let indexPartials = matchIndex.toString().split("-")
    .map( (item) => ( parseInt(item) ) )
  ;
  return [
    ...arr.slice( 0, indexPartials[0] ),
    (indexPartials.length === 1) ?
      Object.assign({}, arr[ indexPartials[0] ], updateWith) :
      updateCardByIndex( arr[ indexPartials[0] ], indexPartials.slice(1), updateWith )
    ,
    ...arr.slice( indexPartials[0] + 1 ),
  ];
};

const removeObjectByIndex = (arr, matchIndex) => {
  let indexPartials = matchIndex.toString().split("-")
    .map( (item) => ( parseInt(item) ) )
  ;
  return (indexPartials.length === 1) ? [
    ...arr.slice( 0, indexPartials[0] ),
    ...arr.slice( indexPartials[0] + 1 ),
  ] : [
    ...arr.slice( 0, indexPartials[0] ),
    removeObjectByIndex( arr[ indexPartials[0] ], indexPartials.slice(1) ),
    ...arr.slice( indexPartials[0] + 1 ),
  ];
};

const findSelected = (state) => {
  let reduceArray = (match, item, index) => (
    match || (() => {
      if(item.constructor === Array){
        let matchedResult = item.reduce( reduceArray, match );
        return matchedResult && { ...matchedResult, selectedIndex: index + "-" + matchedResult.selectedIndex }
      } else {
        return item.selected === true && { selectedCard: item, selectedIndex: index }
      }
    } )() // maybe there should be false/true?
  );
  let output = [ "supply", "hand", "board" ].reduce( (match, deckKey) => (
    match || (() => {
      let matchedResult = state[deckKey].reduce( reduceArray, match );
      return matchedResult && { ...matchedResult, selectedDeck: deckKey }
    })()
  ), false );
  //console.log("findSelected output", output);
  return output
};

const countResources = (arr) => (
  arr.reduce(
    (prev, item) => {
      if(item.resource){
        return Object.keys(item.resource).reduce(
          (prev, key) => ( { ...prev, [key]: prev[key] + item.resource[key] } ),
          prev
        );
      } else {
        return prev
      }
    },
    { wood: 0, stone: 0, iron: 0, gold: 0 }
  )
);

// return spare resources after deducting card cost or false if not enough resources are available
const isAffordable = (card, resources) => (
  Object.keys(card.cost).reduce(
    (spareResources, key) => {
      return spareResources &&
      (spareResources[key] - card.cost[key] >= 0) &&
      { ...spareResources, [key]: spareResources[key] - card.cost[key] }
    },
    Object.assign({}, resources )
  )
);

const hasSatisfiedRequirements = (card, state) => {
  for ( let requiredKey in (card.prerequisites || {}) ) {
    let requiredValues = card.prerequisites[requiredKey];
    let requirementIsSatisfied = requiredValues.reduce( (match, requiredValue) => ( match && findByContent(state.board, { [requiredKey]: requiredValue }, true) ), true );
    if( !requirementIsSatisfied ){ return false }
  }
  return true;
};

// returns new supply with cards extended according to their affordability and satisfied requirements 
const updateAffordableSupply = (state, resources, extendAffordableBy, extendUnaffordableBy) => (
  state.supply.map( (stack) => {
    let lastCard = stack[stack.length-1];
    return [
      ...stack.slice(0, stack.length-1),
      Object.assign( {}, lastCard, isAffordable(lastCard, resources) && hasSatisfiedRequirements(lastCard, state) ? extendAffordableBy : extendUnaffordableBy)
    ];
  } )
);

const isActiveBoardCard = (card, owner) => (
  // unit with moves left
  // TODO filter by owner
  card.type === "unit" && card.movesLeft > 0 && card.owner === owner
);

const updateActiveBoardCards = (board, activePlayer, extendActiveBy, extendInactiveBy) => (
  board.map( (stack) => (
    stack.map( (item, index) => (
      Object.assign({}, item, index === stack.length-1 && isActiveBoardCard(item, activePlayer) ? extendActiveBy : extendInactiveBy)
    ) )
  ) )
);

const isActiveHandCard = (card, owner) => (
  // unit with moves left
  card.type === "unit"
);

const updateActiveHandCards = (hand, extendActiveBy, extendInactiveBy) => (
  hand.map( (card) => (
    Object.assign( {}, card, isActiveHandCard(card) ? extendActiveBy : extendInactiveBy)
  ) )
);

const unHighlightHand = (hand) => (
  hand.map( (item, index) => (
    Object.assign({}, item, { highlighted: false })
  ) )
);

const unHighlightSupply = (supply) => (
  supply.map( (stack, stackIndex) => (
    stack.map( (item, index) => (
      Object.assign({}, item, { highlighted: false })
    ) )
  ) )
);

const updateHighlights = (state) => {
  //console.log("updateHighlights", state);
  const { selectedDeck, selectedCard, selectedIndex} = findSelected(state);

  if(selectedCard){
    // if selected supply card or hand unit, highlight placement
    if( selectedDeck === "supply" || (selectedDeck === "hand" && selectedCard.type === "unit" ) ){
      // console.log("updateHighlights if selected supply card or hand unit, highlight placement")
      return {
        ...state,
        board: state.board.map( (stack, stackIndex) => (
          stack.map( (item, index) => {
            let lastIndex = stack.length-1;
            let isLastFromStack = index === lastIndex;
            let isSelectedValidPlacement = isValidPlacement(selectedCard, item, stack);
            // console.log("isSelectedValidPlacement", isSelectedValidPlacement);
            let highlighted = isLastFromStack && isSelectedValidPlacement;
            return item.highlighted !== highlighted ? Object.assign({}, item, { highlighted: highlighted }) : item
          } )
        ) ),
        // unhighlight supply
        supply: unHighlightSupply(state.supply),
        // unhighlight hand
        hand: unHighlightHand(state.hand),
      } 
    }
    // if selected board unit, highlight movement options
    if( selectedDeck === "board" || selectedCard.type === "unit" ){
      const selectedStackIndex = parseInt(selectedIndex.toString().split("-")[0]);
      return {
        ...state,
        board: state.board.map( (stack, stackIndex) => {
          // console.log(
          //   "item position",
          //   selectedStackIndex,
          //   "board position",
          //   stackIndex,
          //   "not too far left",
          //   stackIndex >= (selectedStackIndex - selectedCard.movesLeft),
          //   "not too far right",
          //   stackIndex <= (selectedStackIndex + selectedCard.movesLeft)
          // );
          return stack.map( (item, index) => {
            let lastIndex = stack.length-1;
            let isLastFromStack = index === lastIndex;
            let highlighted = isLastFromStack &&
              (stackIndex >= (selectedStackIndex - selectedCard.movesLeft)) &&
              (stackIndex <= (selectedStackIndex + selectedCard.movesLeft)) &&
              (stackIndex !== selectedStackIndex) &&
              // not more than 2 units on top of each other
              (stack[ stack.length-2 ] || {})["type"] !== "unit"
            ;
            return item.highlighted !== highlighted ? Object.assign({}, item, { highlighted: highlighted }) : item
          } );
        }),
        // unhighlight supply
        supply: unHighlightSupply(state.supply),
        // unhighlight hand
        hand: unHighlightHand(state.hand),
      } 
    }
  }
  // if no card selected,
  // highlight affordable supply cards
  // highlight placeable units from hand
  // highlight movable units on board
  return {
    ...state,
    board: updateActiveBoardCards(state.board, state.activePlayer, { highlighted: true }, { highlighted: false } ),
    supply: updateAffordableSupply(state, countResources(state.hand), { highlighted: true }, { highlighted: false } ),
    hand: updateActiveHandCards(state.hand, { highlighted: true }, { highlighted: false } ),
  }
};

const deselect = (state, deckKey, index, selectedValue) => (
  index ? {
    ...state,
    [deckKey]: updateCardByIndex( state[deckKey], index, { selected: !!selectedValue })
  } : state
);

const select = (state, deckKey, index) => (
  deselect(state, deckKey, index, true)
);

const isValidPlacement = (supplyCard, boardCard, boardStack) => {
  // can only be placed on last card
  if( boardStack[boardStack.length-1] !== boardCard ){
    return false;
  }
  // fallback for no placement restrictions (any)
  supplyCard = Object.assign({ placement: [{}] }, supplyCard);
  // add level to boardCard
  boardCard = Object.assign({}, boardCard, { level: boardStack.indexOf(boardCard) });
  // no placement on enemies
  if( boardCard.type === "unit" && boardCard.owner === "enemy" ){
    return false
  }
  // no placement of buildings on units
  if( boardCard.type === "unit" && supplyCard.type === "building" ){
    return false
  }
  // max 2 military units
  if( supplyCard.type === "unit" && boardCard.type === "unit" && (boardStack[ boardStack.length-2 ] || {})["type"] === "unit" ){
    return false;
  }
  // global building max level limit
  if( boardCard.type === "building" && boardCard.level > MAX_BUILDING_LEVEL ){
    return false;
  }
  return supplyCard.placement.reduce( (isValid, condition) => (
    isValid || Object.keys(condition).reduce( (isConditionValid, key) => (
      isConditionValid && 
      key === "level" ?
      boardCard[key] <= condition[key] :
      boardCard[key] === condition[key]
    ), true )
  ), false )
};

const placeCardOnBoard = (state, clickedStackIndex, clickedCardIndex, selectedDeck, selectedCard, selectedIndex, moveCard) => {
  let spentResources = [];
  const selectedStackIndex = parseInt(selectedIndex.toString().split("-")[0]);
  
  return {
    ...state,
    supply: 
      selectedDeck == "supply" ?
      state.supply.map( (stack) => (
        updateLast( 
          stack.filter( (item, index) => (!item.selected) ),
          { hover: true }
        )
      ) ) :
      state.supply
    ,
    board: state.board.map( (stack, stackIndex) => {
      let newStack = stack;
      // if target stack, add selected supply card, place supply card
      if (stackIndex === clickedStackIndex){
        newStack = [
          ...updateLast(newStack, { hover: false }),
          // add selected card to the board and reset it
          Object.assign({},
            selectedCard,
            { selected: false, hover: true, owner: state.activePlayer },
            moveCard && { movesLeft: selectedCard.movesLeft - Math.abs(selectedStackIndex - clickedStackIndex) },
            !moveCard && selectedCard.movement > 0 && { movesLeft: selectedCard.movement }
          ),
        ];
      }
      // remove card from the original position
      if(moveCard && stackIndex === selectedStackIndex){
        newStack = newStack.slice(0, -1);
      }
      return newStack;
    } ),
    // remove resources from hand and return them to the bank if selected card comes from supply
    // or remove selected card from hand
    hand: selectedDeck == "supply" ?
      Object.keys(selectedCard.cost).reduce( (reducedHand, resourceType) => {
        let remainingCost = selectedCard.cost[resourceType];
        // filter cards from hand until cost is paid
        return reducedHand.filter( (item) => {
          // filter out if correct type and card not fully paid
          let filterIn = remainingCost <= 0 || item.type !== "resource" || (item.resource[resourceType] || 0) === 0;
          // save filtered out cards
          if(!filterIn) {
            spentResources.push( item );
            remainingCost -= item.resource[resourceType]
          }
          return filterIn;
        } )
      }, state.hand ) :
      state.hand.filter( (item) => ( item !== selectedCard ) ),
    bank: [
      ...state.bank,
      spentResources
    ]
  }
};

const cardActionHandler = (state, clickedDeck, clickedIndex, clickedCard) => {
  const { selectedDeck, selectedCard, selectedIndex} = findSelected(state);
  const splitClickedIndex = clickedIndex.toString().split("-").map( (item) => ( parseInt(item) ) );
  const clickedStackIndex = splitClickedIndex[0];
  const clickedCardIndex = splitClickedIndex[1];
  // console.log("cardActionHandler", "state", state, "clickedDeck", clickedDeck, "clickedIndex", clickedIndex, "clickedCard", clickedCard, "selectedDeck", selectedDeck, "selectedCard", selectedCard, "selectedIndex", selectedIndex);
  // console.log("updateSelection", "selectedDeck", selectedDeck, "clickedDeck", clickedDeck );
  // deselect if already selected
  if( clickedCard === selectedCard ){
    return deselect( state, clickedDeck, clickedIndex );
  }
  // do nothing if clicked card is not highlighted
  if( !clickedCard.highlighted ){ return state }
  // select if no selected card and highlighted in supply, hand, selected card and clicked card are both on board
  if( !selectedCard && clickedCard.highlighted && (clickedDeck === "supply" || clickedDeck === "hand" || (clickedDeck === "board") ) ){
    // select highlighted card
    return select( 
      // deselect previously selected
      deselect(state, selectedDeck, selectedIndex)
      , clickedDeck, clickedIndex
    );
  };
  // if selected card is in supply or hand and clicked card on board and is highlighted, move card to board
  if( (selectedDeck === "supply" || selectedDeck === "hand") && clickedDeck == "board" && clickedCard.highlighted ){
    return placeCardOnBoard(state, clickedStackIndex, clickedCardIndex, selectedDeck, selectedCard, selectedIndex);
  }
  // move a selected card to highlighted card on board
  if( selectedDeck === "board" && clickedDeck == "board" && clickedCard.highlighted && !clickedCard.selected){
    return placeCardOnBoard(state, clickedStackIndex, clickedCardIndex, selectedDeck, selectedCard, selectedIndex, true);
  }
  return state;
};


const getNextPlayerIndex = (activePlayer, players) => {
  console.log("getNextPlayerIndex", activePlayer, players, activePlayer+1 % players.length);
  return (activePlayer+1) % players.length;
}

export default function cards(state = gameInitialization(), action) {
  const { key, index } = (action || {})["payload"] || {};
  switch (action.type) {
    case CARDS_CLICK:
      let clickedCard = findCardByIndex(state[key], index );
      return updateHighlights(
        cardActionHandler( state, key, index, clickedCard )
      );

    case CARDS_SHUFFLE:
      return {
        ...state,
        [action.payload]: shuffle( state[action.payload] ),
      };

    case CARDS_END_TURN:
      let nextPlayerIndex = getNextPlayerIndex(state.activePlayer, state.players);
      console.log("CARDS_END_TURN", nextPlayerIndex, state.players, state.players[nextPlayerIndex]);
      // deselect a card
      const { selectedDeck, selectedCard, selectedIndex} = findSelected(state);
      let newState = selectedCard ? {
        ...state,
        [selectedDeck]: updateCardByIndex( state[selectedDeck], selectedIndex, { selected: false } ),
      } : state;
      return updateHighlights({
        ...newState,
        // save previous players hand
        players: state.players.map( (player, index) => ( index === state.activePlayer ? { ...player, hand: state.hand } : player ) ),
        // load new players hand
        hand: state.players[nextPlayerIndex].hand,
        activePlayer: nextPlayerIndex,
        round: state++,
      });

    case CARDS_SHOW_FACE:
      return {
        ...state,
        [key]: state[key].map( (item) => ( {
          ...item,
          faceUp: action.payload.faceUp
        } ) ),
      };

    default:
      return updateHighlights(state);
  }
}