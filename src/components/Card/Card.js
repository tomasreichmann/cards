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
  const cardClick = () => ( console.log("cardClick") );
  return (
    <div className={ cx(s.card, props.className, s["card--" + ( props.faceUp ? "faceUp" : "faceDown")], s["card--"+props.type], { [s["card--hover"]]: props.hover }) } onClick={ props.clickAction } >
      <div className={s["card-frontFace"]} >
        { props.labels.length && 
          <div className={s["card-frontFace-labels"]} >
            {props.labels.map( (item) => ( <span className={s["card-frontFace-labels-"+item.type]} ></span> ) )}
          </div> || null
        }
        { props.tokenSlots.length && 
          <div className={s["card-frontFace-tokens"]} >
            {props.tokenSlots.map( (item) => ( item.token === null ? <span className={s["card-frontFace-labels-empty"+item.type]} ></span> : <span className={s["card-frontFace-labels-"+item.token.type]} ></span> ) )}
          </div> || null
        }
        <div className={s["card-frontFace-graphics"]} >
          { <img src={ props.graphics } />}
        </div>
        <div className={s["card-frontFace-footer"]} >
          <div className={s["card-frontFace-name"]} >{props.name}</div>
          { Object.keys(props.cost).reduce( (previous = 0, item) => ( previous + item.amount ), 0 ) && 
            <div className={s["card-frontFace-cost"]} >
              {props.cost.map( (item) => ( <span className={s["card-frontFace-cost-"+item.resource]} >{item.amount}x {item.resource}</span> ) )}
            </div> || null
          }
        </div>
      </div>
      <div className={s["card-backFace"]} >
        {props.backFace}
      </div>
    </div>
  );
}

Card.propTypes = {
  name: React.PropTypes.string.isRequired,
  labels: React.PropTypes.array,
  cost: React.PropTypes.object,
  tokenSlots: React.PropTypes.arrayOf(React.PropTypes.object),
  graphics: React.PropTypes.string,
  faceUp: React.PropTypes.bool,
  hover: React.PropTypes.bool,
  
};
Card.defaultProps = {
  backFace: <div className={s["card-backFace-symbol"]} >&#5801;</div>,
  labels: [],
  tokenSlots: [],
  cost: {},
  graphics: "",
  faceUp: true,
  hover: false,
};

export default withStyles(s)(Card);
