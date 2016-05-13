import { CARDS_SHUFFLE, CARDS_MOVE_CARD, CARDS_SHOW_FACE } from '../constants';

export default function cards(state = {
  drawDeck: [
    {
      name: "Attack!",
      type: "action",
      faceUp: true,
      description: "Try clicking and doubleclicking me!",
      footer: "Action"
    },
    {
      name: "Wood",
      type: "resource",
      faceUp: true,
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ex magni corporis neque earum, reiciendis sequi tenetur dolores sunt, ipsa voluptatibus, laboriosam. Nesciunt tempora nobis minus eos architecto obcaecati fugit!",
      footer: "Resource"
    },
    {
      name: "XXX",
      type: "resource",
      faceUp: true,
      description: "description",
      footer: "Resource"
    },
  ],
  hand: []
}, action) {
  switch (action.type) {
    case CARDS_SHUFFLE:
      let unshuffled = state[action.payload].slice();
      let shuffled = [];
      let failsafe = 100;
      while(unshuffled.length > 0 && failsafe--){
        let randomIndex = Math.floor( Math.random()*unshuffled.length );
        let randomItem = shuffled.push( unshuffled[randomIndex] );
        unshuffled = [
          ...unshuffled.slice(0,randomIndex),
          ...unshuffled.slice(randomIndex+1,unshuffled.length)
        ];
      }

      return {
        ...state,
        [action.payload]: shuffled,
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