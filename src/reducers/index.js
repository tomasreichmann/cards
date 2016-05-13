import { combineReducers } from 'redux';
import runtime from './runtime';
import cards from './cards';

export default combineReducers({
  runtime,
  cards,
});
