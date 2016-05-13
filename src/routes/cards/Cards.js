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
import actions, { shuffle, moveCard, showFace } from '../../actions/cards';
import configureStore from '../../store/configureStore';

const title = 'Cards';

function Cards(props, context) {
  console.log("Cards render");
  context.setTitle(title);

  const clickAction = (index, key) => (
    props.moveCard(key, index, key == "hand" ? "drawDeck" : "hand" )
  )

  const changeShowFace = (faceUp, key) => (
    props.showFace(faceUp, key)
  )

  const doShuffle = (key) => (
    props.shuffle(key)
  )

  const mapStoreToCards = (item, index, key) => (
    <Card
      name={item.name}
      type={item.type}
      faceUp={item.faceUp}
      description={item.description}
      clickAction={ () => ( clickAction(index, key) ) }
      footer={item.footter}
    />
  );

  const cardsInDeck = props.cards.drawDeck.map( (item, index) => (mapStoreToCards(item, index, "drawDeck") ) );
  const cardsInHand = props.cards.hand.map( (item, index) => (mapStoreToCards(item, index, "hand") ) );

  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title}</h1>
        <CardDeck title="Draw deck" cards={cardsInDeck} key="drawDeck" ></CardDeck>
        <button onClick={ () => ( changeShowFace(true, "drawDeck") ) } >Face Up</button>
        {" "}| <button onClick={ () => ( changeShowFace(false, "drawDeck") ) } >Face Down</button>
        {" "}| <button onClick={ () => ( doShuffle("drawDeck") ) } >Shuffle</button>
        <CardDeck title="Hand" cards={cardsInHand} key="hand" ></CardDeck>
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
  shuffle, moveCard, showFace
})( withStyles(s)(Cards) );