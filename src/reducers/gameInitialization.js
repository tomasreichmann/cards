import cardTypes from './cardTypes';
import { shuffle, updateLast } from './utils';

const cardDecks = {
  "supply": [
    ...Object.keys(cardTypes.buildings).map( (key) => (
      { card: cardTypes.buildings[key], amount: 10, stack: true }
    ) ),
    ...Object.keys(cardTypes.units).map( (key) => (
      { card: cardTypes.units[key], amount: 10, stack: true }
    ) )
  ],
  "board": Object.keys(cardTypes.lands).map( (key) => (
    { card: cardTypes.lands[key], amount: 3 }
  ) ),
  "bank": Object.keys(cardTypes.resources).map( (key) => (
    { card: cardTypes.resources[key], amount: 20 }
  ) ),
  "hand": [
    ...Object.keys(cardTypes.resources).map( (key) => (
      { card: cardTypes.resources[key], amount: 10, extendBy: { hover: true } }
    ) ),
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

const initializePlayers = (players, hand) => (
  players.reduce( (state, player) => (
    {
      ...state,
      players: [ ...state.players, { name: player, hand: hand.map( (item) => ( Object.assign({}, item) ) ) } ]
    }
  ), {
    players: [],
    activePlayer: 0,
    round: 0,
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