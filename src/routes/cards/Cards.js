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
import { PLAYER_COLORS } from '../../constants';
import { connect } from 'react-redux';
import actions, { shuffle, moveCard, showFace, cardClick, endTurn } from '../../actions/cards';

const title = 'Cards';

function Cards({...props, cards}, context) {
  context.setTitle(title);

  const clickAction = (index, key) => {
    console.log("clickAction", key, index);
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

  const cardsInSupply = cards.supply.map( (item, index) => (mapStoreToCards(item, index, "supply") ) );
  const cardsInBoard = cards.board.map( (item, index) => (mapStoreToCards(item, index, "board") ) );
  const cardsInHand = cards.hand.map( (item, index) => (mapStoreToCards(item, index, "hand") ) );
  const cardsInDrawDeck = cards.drawDeck.map( (item, index) => (mapStoreToCards(item, index, "drawDeck") ) );
  const cardsInDiscardDeck = cards.discardDeck.map( (item, index) => (mapStoreToCards(item, index, "discardDeck") ) );
  const activePlayerName = <span><span className={s.circle} style={ { backgroundColor: PLAYER_COLORS[cards.activePlayer] } } ></span>&emsp;{cards.players[cards.activePlayer].name}</span>;

  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title} - Round {cards.round}</h1>
        <CardDeck title="Supply" cards={cardsInSupply} key="supply" type="supply" ></CardDeck>
        <CardDeck title="Board" cards={cardsInBoard} key="board" type="board" ></CardDeck>
        <div className={s.cols}>
          <div className={s["col-hand"]}><CardDeck title={ activePlayerName } cards={cardsInHand} key="hand" type="hand" ></CardDeck></div>
          <div className={s["col-draw-deck"]}>
            <CardDeck title="Draw deck" cards={cardsInDrawDeck} key="drawDeck" type="drawDeck" ></CardDeck>
            <CardDeck title="Discard deck" cards={cardsInDiscardDeck} key="discardDeck" type="discardDeck" ></CardDeck>
          </div>
        </div>
        <button onClick={ () => ( changeShowFace(true, "hand") ) } >Face Up</button>
        {" "}| <button onClick={ () => ( changeShowFace(false, "hand") ) } >Face Down</button>
        {" "}| <button onClick={ () => ( doShuffle("hand") ) } >Shuffle</button>
        {" "}| <button onClick={ props.endTurn } >End turn</button>
      </div>
    </div>
  );
}

Cards.contextTypes = { setTitle: PropTypes.func.isRequired };

export default connect(state => ({
  cards: state.cards
}), actions )( withStyles(s)(Cards) );