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
            continue itemLoop
          }
        }
      }
    }
    if(findFirst){
      return item;
    }
    if( item && item.constructor === Array ){
      result = [...result, ...item ];
    } else {
      item && result.push(item);
    }
  }
  return result
};

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
  card.type === "unit" && card.movesLeft > 0 && card.owner !== "enemy"
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
            !moveCard && selectedCard.movement > 0 && { movesLeft: 0 }
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
    bank: returnResourcesToBank(state.bank, spentResources)
  }
};

const cardActionHandler = (state, clickedDeck, clickedIndex, clickedCard) => {
  const { selectedDeck, selectedCard, selectedIndex} = findSelected(state);
  const splitClickedIndex = clickedIndex.toString().split("-").map( (item) => ( parseInt(item) ) );
  const clickedStackIndex = splitClickedIndex[0];
  const clickedCardIndex = splitClickedIndex[1];
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
};

const removeResourcesFromBank = (bank, resources) => {
  console.log("removeResourcesFromBank", resources);
  return Object.keys(resources).reduce( (output, resourceKey) => {
    // if resources of resourceKey are left in the bank
    resources[resourceKey] > 0 &&
      bank[resourceKey].length > 0 &&
      ( output.bank[resourceKey] = output.bank[resourceKey].slice() )
    ;
    // remove them and add them to drawnCards
    for (var i = 0; i < Math.min( bank[resourceKey].length, resources[resourceKey] ); i++) {
      output.drawnCards = output.drawnCards.concat( output.bank[resourceKey].splice(0, 1) );
    }
    return output
  }, { bank: {...bank}, drawnCards: [] } );
};

const returnResourcesToBank = (bank, cards) => (
  cards.reduce( (bank, card) => ({
    ...bank,
    [card.card]: [
      ...bank[card.card],
      card,
    ],
  }), bank )
);

const produceResources = (state) => {
  console.log("produceResources");
  let resourceGain = state.board.reduce( (resources, stack) => {
    // find all serfs (of active owner?) on board
    return stack.reduce( (resources, card, index) => {
      if(card.card === "serf"){
        // get all cards below
        // find closest land or building
        let productionCard = stack.slice(0, index).reverse().find( (cardBelow) => ( cardBelow.type === "land" || cardBelow.type === "production" || cardBelow.type === "building" ) );
        console.log("productionCard", productionCard);
        if (productionCard && productionCard.production){
          return Object.keys(productionCard.production).reduce( (total, resourceKey) => (
            { ...total, [resourceKey]: total[resourceKey] + productionCard.production[resourceKey] }
          ) ,resources );
        }
      }
      return resources;
    }, resources );
  }, { wood: 0, stone: 0, iron: 0 } );
  console.log("resourceGain", resourceGain );
  // TODO for each take resources from the bank and to the new players hand
  let producedCards = [];
  console.log("state.bank.wood.length", state.bank.wood.length);
  let { bank, drawnCards } = removeResourcesFromBank(state.bank, resourceGain);
  console.log("state.bank.wood.length", state.bank.wood.length);
  console.log("drawnCards", drawnCards);
  return { ...state, bank, hand: [ ...state.hand, ...drawnCards ] };
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
      // deselect a selected card (if any)
      const { selectedDeck, selectedCard, selectedIndex} = findSelected(state);
      let newState = selectedCard ? {
        ...state,
        [selectedDeck]: updateCardByIndex( state[selectedDeck], selectedIndex, { selected: false } ),
      } : state;
      //reset movement
      newState = {
        ...newState,
        board: newState.board.map( (stack) => ( stack.map( (card) => (
          card.movement ? {
            ...card,
            movesLeft: card.owner === nextPlayerIndex ? card.movement : 0,
          } : card
        ) ) ) ),
      };
      return updateHighlights(
        produceResources({
          ...newState,
          // save previous players hand
          players: state.players.map( (player, index) => ( index === state.activePlayer ? { ...player, hand: state.hand } : player ) ),
          // load new players hand
          hand: state.players[nextPlayerIndex].hand,
          activePlayer: nextPlayerIndex,
          round: state++,
        })
      );

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