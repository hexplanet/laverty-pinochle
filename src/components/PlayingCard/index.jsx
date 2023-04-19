import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import BackOfCard from "./svg/BackOfCard";
import {Hearts} from "./svg/Hearts";
import {Spades} from "./svg/Spades";
import {Diamonds} from "./svg/Diamonds";
import {Clubs} from "./svg/Clubs";
import * as colors from '../../utils/colors.js';
import './index.scss';
/**
 * Displays and operates a playing card. This can either show the front or back of the card. The suit and value
 * of the card are displayed on the front. You can enable clicking of the card which will return index and suit value
 * combination to the parent. You may move, rotate, and zoom the card to change its display.
 *
 * @prop index {number} This is an index to be used along with a container like a hand or pile.
 * @prop suit {string} This is the suit of the card. Valid values are "H", "D", "S", and "C".
 * @prop value {string} This is the value of the card. Valid values are "A", "10", "K", "Q", "J", and "9".
 * @prop shown {bool} Is the front of the card shown?
 * @prop zoom {number} This is the percentage at which the card is scaled. Normal is 100.
 * @prop rotation {number} This is the rotation applied to the card. 0 to 360 are valid values.
 * @prop xLocation {number} This is the global left location of the card within the browser or within container.
 * @prop yLocation {number} This is the global top location of the hand within the browser or within container.
 * @prop zLocation {number} This the z-index of the card.
 * @prop hidden {boolean} Is the card visible?
 * @prop rolloverColor {string} This is the hex rollover color of the card.
 * @prop frontColor {string} This is the hex front color of the card.
 * @prop active {boolean} Is the card displayed as active?
 * @prop clickable {boolean} Is the card clickable?
 * @prop handleClick {function} This is the click handler for the card if clickable. If clicked this will send
 *                              to the parent the index and combination suit and value of the card.
 */
function PlayingCard({
  index,
  suit,
  value,
  shown,
  zoom,
  rotation,
  xLocation,
  yLocation,
  zLocation,
  hidden,
  rolloverColor,
  frontColor,
  active,
  clickable,
  handleClick,
}) {
  const [borderColor, setBorderColor] = useState(colors.cardBorderColor);
  useEffect(() => {
    // reset border color on rollover reset
    if (rolloverColor === '') {
      setBorderColor(colors.cardBorderColor);
    }
  }, [rolloverColor]);
  if (hidden) {
    return (<div/>);
  }
  const suits = {
    'H': <Hearts myWidth={24} myHeight={24}/>,
    'D': <Diamonds myWidth={24} myHeight={24}/>,
    'C': <Clubs myWidth={24} myHeight={24}/>,
    'S': <Spades myWidth={24} myHeight={24}/>,
  };
  const valueColor = (suit === 'H' || suit === 'D') ? 'value-red' : 'value-black';
  const cardFrontColor = active ? frontColor : colors.cardInactiveFrontColor;
  const cardBodyClass = `card-body${clickable ? ' clickable': '' }`;
  /**
   * Handles card click and returns index and suit value combination if card is clickable
   */
  const cardClicked = () => {
    if (clickable) {
      const suitValue = `${suit}${value}`;
      handleClick(index, suitValue);
    }
  };
  /**
   * Handles mouse enter and sets the border color for rollover if present
   */
  const enterCard = () => {
    if (rolloverColor !== '' && borderColor !== rolloverColor) {
      setBorderColor(rolloverColor);
    }
  };
  /**
   * Handles mouse exit and resets the rollover color
   */
  const exitCard= () => {
    if (borderColor === rolloverColor) {
      setBorderColor(colors.cardBorderColor);
    }
  };
  const cardFront = (
    <div
      className={cardBodyClass}
      type={"button"}
      onClick={() => cardClicked()}
      onMouseEnter={enterCard}
      onMouseLeave={exitCard}
    >
      <BackOfCard color={cardFrontColor} borderColor={borderColor} />
      <div className='top-left-suit'>{suits[suit]}</div>
      <div className='bottom-right-suit'>{suits[suit]}</div>
      <div className='top-left-value unselectableText'>
        <span className={valueColor}>{value}</span>
      </div>
      <div className='bottom-right-value unselectableText'>
        <span className={valueColor}>{value}</span>
      </div>
    </div>
  );
  const location = {
    left: xLocation,
    top: yLocation,
    zIndex: zLocation,
  };
  const displayStyle = {
    rotate: `${rotation}deg`,
    transform: `scale(${zoom/100})`,
  };
  return (
    <div className='lavpin-playing-card' style={location}>
      <div className='card-container'>
        <div className='card-display' style={displayStyle}>
        {
          shown ? cardFront :
            (<div className='card-body'> <BackOfCard color={colors.cardBackColor}/> </div>)
        }
        </div>
      </div>
    </div>
  );
}

PlayingCard.propTypes = {
  index: PropTypes.number,
  suit: PropTypes.string,
  value: PropTypes.string,
  shown: PropTypes.bool,
  zoom: PropTypes.number,
  rotation: PropTypes.number,
  xLocation: PropTypes.number,
  yLocation: PropTypes.number,
  zLocation: PropTypes.number,
  hidden: PropTypes.bool,
  rolloverColor: PropTypes.string,
  frontColor: PropTypes.string,
  active: PropTypes.bool,
  clickable: PropTypes.bool,
  handleClick: PropTypes.func,
};

PlayingCard.defaultProps = {
  index: 0,
  suit: 'H',
  value: '9',
  shown: true,
  zoom: 100,
  rotation: 0,
  xLocation: 0,
  yLocation: 0,
  zLocation: 0,
  hidden: false,
  rolloverColor: colors.cardDefaultRolloverColor,
  frontColor: colors.cardDefaultFrontColor,
  active: true,
  clickable: true,
  handleClick: () => {}
};

export default PlayingCard;
