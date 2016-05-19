import { CARDS_SHUFFLE, CARDS_MOVE_CARD, CARDS_SHOW_FACE, CARDS_CLICK } from '../constants';

export function shuffle(key) {
  return {
    type: CARDS_SHUFFLE,
    payload: key,
  };
};

export function moveCard(from, index, to) {
  return {
    type: CARDS_MOVE_CARD,
    payload: {
    	from,
    	index,
    	to
    },
  };
}

export function showFace(faceUp, key) {
  return {
    type: CARDS_SHOW_FACE,
    payload: {
      faceUp,
      key
    },
  };
}

export function cardClick(key, index) {
  return {
    type: CARDS_CLICK,
    payload: {
    	key,
    	index
    },
  };
}

export default {
	shuffle,
  moveCard,
	cardClick,
	showFace
}
