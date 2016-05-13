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
  return (
    <div className={s.root} >
      { props.title && <h2>{props.title}</h2> }
      {props.cards.map( (item, index) => ( <div className={s.card} key={index} >{item}</div> ) )}
    </div>
  );
}

CardDeck.propTypes = {

};

export default withStyles(s)(CardDeck);
