/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Cards.scss';
import CardDeck from '../../components/CardDeck';
import Card from '../../components/Card';
import { connect } from 'react-redux';
import actions, { shuffle, moveCard, showFace, cardClick } from '../../actions/cards';

const title = 'Cards';

function Cards(props, context) {
  context.setTitle(title);

  const clickAction = (index, key) => {
    console.log("clickAction", key, index, props.cardClick);
    props.cardClick(key, index);
  }

  const changeShowFace = (faceUp, key) => (
    props.showFace(faceUp, key)
  )

  const doShuffle = (key) => (
    props.shuffle(key)
  )

  const mapStoreToCards = (item, index, key) => (
    item.constructor === Array ? item.map( (item, stackIndex) => ( <Card {...item} clickAction={() => ( clickAction(index+"-"+stackIndex, key) )} /> ) ) : <Card {...item} clickAction={() => ( clickAction(index, key) )}  />
  );

  const cardsInSupply = props.cards.supply.map( (item, index) => (mapStoreToCards(item, index, "supply") ) );
  const cardsInBoard = props.cards.board.map( (item, index) => (mapStoreToCards(item, index, "board") ) );
  const cardsInHand = props.cards.hand.map( (item, index) => (mapStoreToCards(item, index, "hand") ) );

  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title}</h1>
        <CardDeck title="Supply" cards={cardsInSupply} key="supply" type="supply" ></CardDeck>

        <CardDeck title="Board" cards={cardsInBoard} key="board" type="board" ></CardDeck>

        <CardDeck title="Hand" cards={cardsInHand} key="hand" type="hand" ></CardDeck>
        <button onClick={ () => ( changeShowFace(true, "hand") ) } >Face Up</button>
        {" "}| <button onClick={ () => ( changeShowFace(false, "hand") ) } >Face Down</button>
        {" "}| <button onClick={ () => ( doShuffle("hand") ) } >Shuffle</button>
      </div>
    </div>
  );
}

Cards.contextTypes = { setTitle: PropTypes.func.isRequired };

export default connect(state => ({
  cards: state.cards
}), {
  shuffle, moveCard, showFace, cardClick
})( withStyles(s)(Cards) );