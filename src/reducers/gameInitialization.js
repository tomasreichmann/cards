import cardTypes from './cardTypes';
import { shuffle, updateLast } from './utils';

const cardDecks = {
  "supply": [
    ...Object.keys(cardTypes.buildings).map( (key) => (
      { card: cardTypes.buildings[key], amount: 10, stack: true }
    ) ),
    ...Object.keys(cardTypes.units).filter( (card) => ( card !== "bandits" && card !== "footmen" ) ).map( (key) => (
      { card: cardTypes.units[key], amount: 10, stack: true }
    ) )
  ],
  "board": Object.keys(cardTypes.lands).map( (key) => (
    { card: cardTypes.lands[key], amount: 3 }
  ) ),
  "bank": Object.keys(cardTypes.resources).map( (key) => (
    { card: cardTypes.resources[key], amount: 20 }
  ) ),
  "bank-wood": [{ card: cardTypes.resources["wood"], amount: 20 }],
  "bank-stone": [{ card: cardTypes.resources["stone"], amount: 20 }],
  "bank-iron": [{ card: cardTypes.resources["iron"], amount: 20 }],
  "bank-gold": [{ card: cardTypes.resources["gold"], amount: 20 }],
  "drawDeck": [
    { card: cardTypes.events.noble, amount: 4, extendBy: { faceUp: false } },
    { card: cardTypes.events.bandits, amount: 4, extendBy: { faceUp: false } },
    { card: cardTypes.events.mercenaries, amount: 4, extendBy: { faceUp: false } },
  ],
  "discardDeck": [],
  "hand": [
    { card: cardTypes.resources.wood, amount: 4, extendBy: { hover: true } },
    { card: cardTypes.resources.stone, amount: 2, extendBy: { hover: true } },
    { card: cardTypes.resources.iron, amount: 1, extendBy: { hover: true } },
    { card: cardTypes.resources.gold, amount: 1, extendBy: { hover: true } },
    { card: cardTypes.units.serf, amount: 1, extendBy: { hover: true } },
  ],
};

const deckFactory = () => {
  let currentId = 0;
  return Object.keys(cardDecks).reduce( (prev, key) => (
    Object.assign({}, prev,
      { // deck key
        [key]: cardDecks[key].reduce( (prev, item) => {
          let cards = [];
          for (var i = 0 ; i < item.amount ; i++) {
            cards.push( Object.assign({}, item.card, item.extendBy, { id: currentId++ }));
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
};

const initializeDecks = () => {
  let decks = deckFactory();
  // shuffle and wrap board into stacks
  decks.board = shuffle(decks.board).map( (item) => ( [item] ) );
  decks.supply = decks.supply.map( (item, index) => (
    updateLast( item, { hover: true } )
  ) );
  decks.bank = {
    wood: decks["bank-wood"],
    stone: decks["bank-stone"],
    iron: decks["bank-iron"],
    gold: decks["bank-gold"],
  };
  delete decks["bank-wood"];
  delete decks["bank-stone"];
  delete decks["bank-iron"];
  delete decks["bank-gold"];
  return decks;
}

const initializePlayers = (players, hand) => (
  players.reduce( (state, player) => (
    {
      ...state,
      players: [ ...state.players, { name: player, hand: hand.map( (item) => ( Object.assign({}, item) ) ) } ]
    }
  ), {
    players: [],
    activePlayer: players.length-1,
    round: -1,
    phase: 0,
    hand: hand.map( (item) => ( Object.assign({}, item) ) ),
  } ) 
)

export default function gameInitialization(players = ["Player 1", "Player 2"]){
  let decks = initializeDecks();
  return {
    ...initializeDecks(),
    ...initializePlayers(players, decks.hand),
  }
}