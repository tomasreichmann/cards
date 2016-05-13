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
import s from './Card.scss';

function Card(props) {
  var image = props.graphics && <img src={ props.graphics } />;
  var extras = {};
  const cardClick = () => ( console.log("cardClick") );
  return (
    <div className={ cx(s.card, props.className, s["card--" + ( props.faceUp ? "faceUp" : "faceDown")], s["card--"+props.type]) } onClick={ props.clickAction } {...extras} >
      <div className={s["card-frontFace"]} >
        <div className={s["card-frontFace-header"]} >
          <div className={s["card-frontFace-header-title"]} >{props.name}</div>
        </div>
        <div className={s["card-frontFace-graphics"]} >{image}</div>
        <div className={s["card-frontFace-description"]} >{props.description}</div>
        <div className={s["card-frontFace-footer"]} >{props.footer}</div>
      </div>
      <div className={s["card-backFace"]} >
        <div className={s["card-backFace-symbol"]} >&#5801;</div>
      </div>
    </div>
  );
}

Card.propTypes = {

};

export default withStyles(s)(Card);
