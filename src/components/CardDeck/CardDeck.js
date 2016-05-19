/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CardDeck.scss';

function CardDeck(props) {
  const cardTemplate = (item, index) => (
  	<div className={ cx(s.card, { [s["card--noHover"]]: item.noHover }) } key={index} >{item}</div>
  )
  return (
    <div className={ cx(s.root, props.className, props.type && s["type-" + props.type ]) } >
      { props.title && <h2>{props.title}</h2> }
      {props.cards.map( (item, index) => ( item.constructor === Array ? <div className={s.stack} key={index} >{ item.map( (item, index) => ( cardTemplate(item, index) ) ) }</div> : cardTemplate(item, index) ) )}
    </div>
  );
}

CardDeck.propTypes = {

};

export default withStyles(s)(CardDeck);
