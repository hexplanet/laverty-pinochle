import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlayingCard from "../PlayingCard";
import './index.scss';

/**
 * Displays and operates a hand which is a collection of PlayingCard components. The hand can be displayed
 * as a pile of cards or a neetly fanned out hand. It can either take clicks or not from its cards based
 * on card properties.
 *
 * @prop id {string} REQUIRED. This is the id which is unique to this hand.
 * @prop xLocation {number} This is the global left location of the hand within the browser.
 * @prop yLocation {number} This is the global top location of the hand within the browser.
 * @prop zLocation {number} This is the z-index of the hand.
 * @prop cards {array} This is an array of cards as objects with the following properties:
 *                     suit {string} Suit of the card. Valid values are: H, S, D, C
 *                     value {string} Value of the card. Valid values are: A, 10, K, Q, J, 9
 *                     frontColor {string} This is hex color value of the card front. Example #11ef7c
 *                     rolloverColor {string} This is the rollover border color. Example #0f0
 *                     active {boolean} Is the card active?
 *                     clickable {boolean} Is the card clickable?
 * @prop fanOut {number} The number of degrees the cards in hand are fanned out. If -1, no fan out.
 * @prop shown {boolean} Are the front of the cards shown?
 * @prop zoom {number} This is the percentage at which the hand is scaled. Normal is 100.
 * @prop rotation {number} This is the rotation applied to the hand. 0 to 360 are valid values.
 * @prop hidden {boolean} Is the hand visible?
 * @prop cardClicked {function} This is the callback function to relay if a card in the hand was clicked.
 *                              If clicked the callback gets the card id, index, and suit value combination.
 */
function Hand({
  id,
  xLocation,
  yLocation,
  zLocation,
  cards,
  fanOut,
  shown,
  zoom,
  rotation,
  hidden,
  cardClicked,
}) {
  const [cardsToDisplay, setCardsToDisplay] = useState([]);
  /**
   * Handles card click and send via callback the id, index, and suit value of the card clicked.
   *
   * @param {number} index The index of the card in prop cards that was clicked
   * @param {string} suitValue The suit and value of the card clicked. Example "SA" is the Ace of Spades.
   */
  const handCardClick = (index, suitValue) => {
    cardClicked(id, index, suitValue);
  };
  useEffect(() => {
    const totalCards = cards.length;
    const midCard = (totalCards - 1) / 2;
    let xCard;
    let yCard;
    let spinCard;
    let rads;
    let distance;
    const newCards = [];
    // The below loop creates and arranges the card of the hand for display
    cards.forEach((card, index) => {
      xCard = 400;
      yCard = 90;
      if (fanOut > -1) {
        // generate fanned out display
        distance = 750 + (card.raised ? 20 : 0);
        spinCard = (index - midCard) * fanOut;
        rads = ((spinCard - 90) * Math.PI) / 180;
        xCard = 400 + (distance * Math.cos(rads));
        yCard = 840 + (distance * Math.sin(rads));
      } else {
        // generate loose pile display
        spinCard = 0;
        if (card.xOffset !== undefined) {
          xCard += card.xOffset;
          yCard += card.yOffset;
          spinCard = card.rotation;
        }
      }
      newCards.push(
        <PlayingCard
          key={`Card${index}`}
          index={index}
          xLocation={xCard}
          yLocation={yCard}
          suit={card.suit}
          value={card.value}
          frontColor={card.frontColor}
          shown={shown}
          rotation={spinCard}
          rolloverColor={card.rolloverColor}
          active={card.active}
          clickable={card.clickable}
          handleClick={handCardClick}
        />
      );
    });
    setCardsToDisplay(newCards);
  }, [cards, shown, fanOut]);
  const location = {
    left: xLocation,
    top: yLocation,
    zIndex: zLocation,
  };
  const transformedStyle = {
    transform: `scale(${zoom/100})`,
  };
  const handRotation = {
    rotate: `${rotation}deg`,
  };
  if (hidden) { return (<div />); }
  return (
    <div className='lavpin-hand' style={location}>
      <div className='hand-transformer' style={transformedStyle}>
        <div className='hand-container' style={handRotation}>
          {cardsToDisplay}
        </div>
      </div>
    </div>
  );
}

Hand.propTypes = {
  id: PropTypes.string.isRequired,
  xLocation: PropTypes.number,
  yLocation: PropTypes.number,
  zLocation: PropTypes.number,
  cards: PropTypes.array,
  fanOut: PropTypes.number,
  shown: PropTypes.bool,
  zoom: PropTypes.number,
  rotation: PropTypes.number,
  hidden: PropTypes.bool,
  cardClicked: PropTypes.func,
}

Hand.defaultProps = {
  xLocation: 1000,
  yLocation: 1000,
  zLocation: 0,
  cards: [],
  fanOut: 3,
  shown: true,
  zoom: 100,
  rotation: 0,
  hidden: false,
  cardClicked: () => {},
}
export default Hand;