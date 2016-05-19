import { CARDS_SHUFFLE, CARDS_MOVE_CARD, CARDS_SHOW_FACE, CARDS_CLICK } from '../constants';

const shuffle = (arr) => {
  let unshuffled = arr.slice();
  let shuffled = [];
  while(unshuffled.length > 0){
    let randomIndex = Math.floor( Math.random()*unshuffled.length );
    let randomItem = shuffled.push( unshuffled[randomIndex] );
    unshuffled = [
      ...unshuffled.slice(0,randomIndex),
      ...unshuffled.slice(randomIndex+1,unshuffled.length)
    ];
  }
  return shuffled;
}

const updateLast = (arr, updateWith) => {
  return arr.map( (item, index) => (
    index === arr.length-1 ? Object.assign({}, item, updateWith) : item
  ) );
}

const cardTypes = {
  resources: {
    wood: {
      name: "Wood",
      type: "resource"
    },
    stone: {
      name: "Stone",
      type: "resource"
    },
    iron: {
      name: "Iron",
      type: "resource"
    },
    serf: {
      name: "Serf",
      type: "resource"
    },
    gold: {
      name: "Gold",
      type: "resource"
    }
  },
  lands: {
    forest: {
      name: "Forest",
      type: "land"
    },
    plains: {
      name: "Plains",
      type: "land"
    },
    hills: {
      name: "Hills",
      type: "land"
    },
    mountains: {
      name: "Mountains",
      type: "land"
    }
  },
  buildings: {
    "tower": {
      name: "Tower",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "wall": {
      name: "Wall",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "gate": {
      name: "Gate",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "living quarters": {
      name: "Living Quarters",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "armory": {
      name: "Armory",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "barracks": {
      name: "Barracks",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "hall": {
      name: "Hall",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "blacksmith": {
      name: "Blacksmith",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "stables": {
      name: "Stables",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "mine": {
      name: "Mine",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "chapel": {
      name: "Chapel",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "sawmill": {
      name: "Sawmill",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "quary": {
      name: "Quary",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "marketplace": {
      name: "Marketplace",
      type: "building",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []

    },
  },
  units: {
    guards: {
      name: "Guards",
      type: "unit",
      cost: { wood: 0, iron: 0, stone: 0 }
    },
    marksmen: {
      name: "Marksmen",
      type: "unit",
      cost: { wood: 0, iron: 0, stone: 0 }
    },
    horsemen: {
      name: "Horsemen",
      type: "unit",
      cost: { wood: 0, iron: 0, stone: 0 }
    },
    bandits: {
      name: "Bandits",
      type: "unit",
      cost: { wood: 0, iron: 0, stone: 0 }
    },
    footman: {
      name: "Footman",
      type: "unit",
      cost: { wood: 0, iron: 0, stone: 0 }
    }
  }
};

const cardDecks = {
  "supply": [
    ...Object.keys(cardTypes.buildings).map( (key) => ( { card: cardTypes.buildings[key], amount: 10, stack: true } ) ),
    ...Object.keys(cardTypes.units).map( (key) => ( { card: cardTypes.units[key], amount: 10, stack: true } ) )
  ],
  "board": Object.keys(cardTypes.lands).map( (key) => ( { card: cardTypes.lands[key], amount: 3 } ) ),
  "resources": Object.keys(cardTypes.resources).map( (key) => ( { card: cardTypes.resources[key], amount: 20 } ) ),
  "hand": Object.keys(cardTypes.resources).map( (key) => ( { card: cardTypes.resources[key], amount: 1, extendBy: { hover: true } } ) ),
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


const decks = deckFactory();

decks.board = shuffle(decks.board);
decks.supply = decks.supply.map( (item, index) => (
  updateLast( item, { hover: true } )
) );

// console.log("decks", decks.supply);

export default function cards(state = decks, action) {
  console.log("cards reducer", action);
  switch (action.type) {
    case CARDS_CLICK:
      console.log(CARDS_CLICK, action.payload);
      return state;
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
      return state;
  }
}