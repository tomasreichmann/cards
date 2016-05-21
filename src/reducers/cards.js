import { CARDS_SHUFFLE, CARDS_MOVE_CARD, CARDS_SHOW_FACE, CARDS_CLICK, WOOD, IRON, SERF, STONE, GOLD, MAX_BUILDING_LEVEL } from '../constants';
import cardTypes from './cardTypes';

const shuffle = (arr) => {
  let unshuffled = arr.slice();
  let shuffled = [];
  while(unshuffled.length > 0){
    let randomIndex = Math.floor( Math.random()*unshuffled.length );
    let randomItem = shuffled.push( unshuffled[randomIndex] );
    unshuffled = [
      ...unshuffled.slice(0,randomIndex),
      ...unshuffled.slice(randomIndex+1)
    ];
  }
  return shuffled;
}

const updateLast = (arr, updateWith) => {
  return arr.map( (item, index) => (
    index === arr.length-1 ? Object.assign({}, item, updateWith) : item
  ) );
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

const updateAffordable = (supply, resources, extendAffordableBy, extendUnaffordableBy) => (
  supply.map( (stack) => {
    let lastCard = stack[stack.length-1];
    return [
      ...stack.slice(0, stack.length-1),
      Object.assign( {}, lastCard, isAffordable(lastCard, resources) ? extendAffordableBy : extendUnaffordableBy)
    ];
  } )
);

const updateHighlights = (state) => (
  {
    ...state,
    supply: updateAffordable(state.supply, countResources(state.hand), { highlighted: true }, { highlighted: false } )
  }
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
  console.log("isValidPlacement", supplyCard, boardCard);
  // no placement on enemies
  if( boardCard.type === "unit" && boardCard.owner === "enemy" ){
    console.warn("no placement on enemies", boardCard.level, MAX_BUILDING_LEVEL);
    return false
  }
  // no placement of buildings on units
  if( boardCard.type === "unit" && supplyCard.type === "building" ){
    console.warn("no placement of buildings on units", boardCard.level, MAX_BUILDING_LEVEL);
    return false
  }
  // max 2 military units
  if( supplyCard.type === "unit" && boardCard.type === "unit" && (boardStack[ boardStack.length-2 ] || {})["type"] == "unit" ){
    console.warn("max 2 military units", boardCard.level, MAX_BUILDING_LEVEL);
    return false;
  }
  // global building max level limit
  if( boardCard.type === "building" && boardCard.level > MAX_BUILDING_LEVEL ){
    console.warn("global building max level limit", boardCard.level, MAX_BUILDING_LEVEL);
    return false;
  }
  return supplyCard.placement.reduce( (isValid, condition) => (
    isValid || Object.keys(condition).reduce( (isConditionValid, key) => (
      console.log( "isConditionValid", isConditionValid, key, boardCard[key], condition[key] ) &&
      isConditionValid && 
      key === "level" ?
      boardCard[key] <= condition[key] :
      boardCard[key] === condition[key]
    ), true )
  ), false )
};

const cancelSupplyCardSelection = (state) => (
  {
    ...state,
    supply: state.supply.map( (stack) => (
      stack.map( (item) => ( Object.assign({}, item, { selected: false }) ) )
    ) ),
    board: state.board.map( (stack) => (
      stack.map( (item) => ( Object.assign({}, item, { highlight: false }) ) )
    ) ),
  }
);

const handCardClickHandler = (state, key, index) => {
  console.log("cardClickHandlers", key, index);
  console.log( "countResources", countResources( state.hand ) );
  let selectedCard = state.hand[index];
  let stateUpdate = {};
  if( selectedCard.type === "unit"){
    stateUpdate = {
      board: state.board.map( (stack, stackIndex) => (
        stack.map( (item, index) => {
          let lastIndex = stack.length-1;
          let isLastFromStack = index === lastIndex;
          let isSelectedValidPlacement = isValidPlacement(selectedCard, item, stack);
          console.log("isSelectedValidPlacement", isSelectedValidPlacement);
          let highlighted = isLastFromStack && isSelectedValidPlacement;
          return Object.assign({}, item, { highlighted: highlighted })
        } )
      ) )
    }
  }
  return {
    ...state,
    ...stateUpdate,
    hand: [
      ...state.hand.slice(0,index),
      Object.assign( {}, selectedCard, { selected: !selectedCard.selected } ),
      ...state.hand.slice(index+1),
    ],
  }
};

const supplyCardClickHandler = (state, key, index) => {
  console.log("cardClickHandlers", key, index);
  console.log( "countResources", countResources( state.hand ) );
  let isSelectedCardAffordable = false;
  let selectedCard;
  let cardIsAlreadySelected = false;
  
  return {
    ...state,
    // select the clicked card from supply if it is affordable
    // deselect if already selected
    supply: state.supply.map( (stack, stackIndex) => {
      let lastIndex = stack.length-1;
      let lastCard = stack[lastIndex];
      let isSelectedCard = index === stackIndex + "-" + lastIndex;
      if(isSelectedCard){
        selectedCard = lastCard;
        cardIsAlreadySelected = lastCard.selected === true;
        isSelectedCardAffordable = isAffordable(lastCard, countResources( state.hand ) );
      }
      return [
        ...stack.slice(0, lastIndex),
        Object.assign(
          {},
          lastCard,
          ( isSelectedCard && isSelectedCardAffordable && !cardIsAlreadySelected ) ?
          { selected: true, highlighted: false } : { selected: false }
        )
      ]
    } ),
    // TODO select cards from hand that will be used as a payment for the selected card
    // watch for cardIsAlreadySelected
    hand: state.hand, 
    // highlight possible card placements
    board: state.board.map( (stack, stackIndex) => (
      stack.map( (item, index) => {
        let lastIndex = stack.length-1;
        let isLastFromStack = index === lastIndex;
        let isSelectedValidPlacement = isValidPlacement(selectedCard, item, stack);
        console.log("isSelectedValidPlacement", isSelectedValidPlacement);
        let highlighted = isLastFromStack && !cardIsAlreadySelected && isSelectedCardAffordable && isSelectedValidPlacement;
        return Object.assign({}, item, { highlighted: highlighted })
      } )
    ) )
  }
};

const placeCardOnBoard = (state, clickedStackIndex, clickedCardIndex, selectedSourceCard, sourceDeck) => {
  let spentResources = [];
  
  return {
    ...state,
    supply: 
      sourceDeck == "supply" ?
      state.supply.map( (stack) => (
        updateLast( 
          stack.filter( (item, index) => (!item.selected) ),
          { hover: true }
        )
      ) ) :
      state.supply
    ,
    board: state.board.map( (stack, stackIndex) => {
      let newStack = stack.map( (item) => ( Object.assign({}, item, { highlighted: false }) ) );
      // if target stack, add selected supply card
      if (stackIndex === clickedStackIndex){
        newStack = [
          ...updateLast(newStack, { hover: false }),
          // add selected card to the board and reset it`s selection and highlights
          Object.assign({}, selectedSourceCard, { selected: false, highlighted: false })
        ];
      }
      return newStack;
    } ),
    // remove resources from hand and return them to the bank if selected card comes from supply
    // or remove selected card from hand
    hand: sourceDeck == "supply" ?
      Object.keys(selectedSourceCard.cost).reduce( (reducedHand, resourceType) => {
        let remainingCost = selectedSourceCard.cost[resourceType];
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
      state.hand.filter( (item) => ( item !== selectedSourceCard ) ),
    bank: [
      ...state.bank,
      spentResources
    ]
  }
}
const boardCardClickHandler = (state, key, index) => {
  console.log("cardClickHandlers", key, index);
  console.log( "countResources", countResources( state.hand ) );
  // find selected supply card
  // remove the supply card from the stack
  let clickedStackIndex = parseInt(index.split("-")[0]);
  let clickedCardIndex = parseInt(index.split("-")[1]);
  let clickedBoardCard = state.board[clickedStackIndex][clickedCardIndex];
  console.log( "clickedBoardCard", clickedBoardCard );

  // look for the selected card
  // check hand
  let selectedSourceCard;
  const selectedFilter = (item) => ( item.selected && (selectedSourceCard = item) );
  let sourceDeck = state.hand.filter( selectedFilter ).length ? "hand" : undefined;
  // check supply
  sourceDeck = 
    sourceDeck ||
    state.supply.filter( (stack) => ( stack.filter( selectedFilter ).length ) ).length && "supply" ||
    undefined
  ;
  console.log( "sourceDeck", sourceDeck, "selectedSourceCard", selectedSourceCard);

  // check if clicked card is highlighted and there is a selected card => place card on board
  if( clickedBoardCard.highlighted && selectedSourceCard){
    return placeCardOnBoard(state, clickedStackIndex, clickedCardIndex, selectedSourceCard, sourceDeck);
  }
  // check if clicked card is highlighted and a unit => move unit
  if( clickedBoardCard.highlighted ){
    return placeCardOnBoard(state, clickedStackIndex, clickedCardIndex, clickedBoardCard);
  }
  return state
};

const cardClickHandlers = {
  hand: handCardClickHandler,
  supply: supplyCardClickHandler,
  board: boardCardClickHandler
};

const cardDecks = {
  "supply": [
    ...Object.keys(cardTypes.buildings).map( (key) => ( { card: cardTypes.buildings[key], amount: 10, stack: true } ) ),
    ...Object.keys(cardTypes.units).map( (key) => ( { card: cardTypes.units[key], amount: 10, stack: true } ) )
  ],
  "board": Object.keys(cardTypes.lands).map( (key) => ( { card: cardTypes.lands[key], amount: 3 } ) ),
  "bank": Object.keys(cardTypes.resources).map( (key) => ( { card: cardTypes.resources[key], amount: 20 } ) ),
  "hand": [
    ...Object.keys(cardTypes.resources).map( (key) => ( { card: cardTypes.resources[key], amount: 10, extendBy: { hover: true } } ) ),
    { card: cardTypes.units.serf, amount: 2, extendBy: { hover: true } }
  ],
};

const deckFactory = () => (
  Object.keys(cardDecks).reduce( (prev, key) => (
    Object.assign({}, prev,
      { // deck key
        [key]: cardDecks[key].reduce( (prev, item) => {
          let cards = [];
          for (var i = 0 ; i < item.amount ; i++) {
            cards.push( Object.assign({}, item.card, item.extendBy));
          }
          return item.stack ? [
            ...prev,
            cards
          ] : [
            ...prev,
            ...cards
          ]
        }, [] )
      }
    )
  ) , {})
);

const initializeDecks = () => {
  let decks = deckFactory();
  // shuffle and wrap board into stacks
  decks.board = shuffle(decks.board).map( (item) => ( [item] ) );
  decks.supply = decks.supply.map( (item, index) => (
    updateLast( item, { hover: true } )
  ) );
  return decks;
}

export default function cards(state = initializeDecks(), action) {
  switch (action.type) {
    case CARDS_CLICK:
    let key = action.payload.key;
      console.log(CARDS_CLICK, action.payload);
      return key in cardClickHandlers ? updateHighlights( cardClickHandlers[key](state, key, action.payload.index) ) : state;

    case CARDS_SHUFFLE:
      return {
        ...state,
        [action.payload]: shuffle( state[action.payload] ),
      };

    case CARDS_MOVE_CARD:
      return {
        ...state,
        [action.payload.from]: [
          ...state[action.payload.from].slice(0, action.payload.index),
          ...state[action.payload.from].slice(action.payload.index+1)
        ],
        [action.payload.to]: [
          ...state[action.payload.to],
          state[action.payload.from][action.payload.index]
        ],
      };

    case CARDS_SHOW_FACE:
      let index = action.payload.key;
      return {
        ...state,
        [action.payload.key]: state[action.payload.key].map( (item) => ( {
          ...item,
          faceUp: action.payload.faceUp
        } ) ),
      };

    default:
      return updateHighlights(state);
  }
}