import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import PlayingCard from "../PlayingCard";
import {CARD_PILE_X_DEPTH, CARD_PILE_Y_DEPTH} from "../../utils/constants";
import './index.scss';

/**
 * Displays a pile of cards. This pile may appear to get higher with more cards in the cards array.
 * The cards can appear neat or sloppy dependant upon the individual setting of the cards.
 *
 * @prop xLocation {number} This is the global left location of the pile within the browser.
 * @prop yLocation {number} This is the global top location of the pile within the browser.
 * @prop zLocation {number} This is the z-index of the hand.
 * @prop cards {array} This is an array of cards as objects with the following properties:
 *                     suit {string} Suit of the card. Valid values are: H, S, D, C
 *                     value {string} Value of the card. Valid values are: A, 10, K, Q, J, 9
 *                     frontColor {string} This is hex color value of the card front. Example #11ef7c
 *                     rotation {number} This is the rotation of the card. Valid values from 0 to 360.
 *                     xOffset {number} This is the value in pixels that the card is off center on x-axis.
 *                     yOffset {number} This is the value in pixels that the card is off center on y-axis.
 *                     shown {boolean} Optionally if the front of the card is shown. Overrides pile shown.
 * @prop shown {boolean} Are all the cards in the pile fronts are shown?
 * @prop rotation {number} This rotation of the card pile. Valid values are 0 to 360.
 * @prop zoom {number} This is the percentage at which the hand is scaled. Normal is 100.
 * @prop hidden {boolean} Is the card pile visible?
 * @prop hasHeight {boolean} Do the cards in the pile appear to get higher when more are there?
 */
function Pile({
  xLocation,
  yLocation,
  zLocation,
  cards,
  shown,
  rotation,
  zoom,
  hidden,
  hasHeight,
}) {
  const [cardsToDisplay, setCardsToDisplay] = useState([]);
  useEffect(() => {
    const newCards = [];
    // The below loop general the PLayingCard component that appear as the pile
    cards.forEach((card, index) => {
      if (card !== null) {
        const cardShown = (card.shown === undefined) ? shown : shown && card.shown;
        newCards.push(
          <PlayingCard
            key={`Pile${index}`}
            xLocation={110 + (hasHeight ? (index * CARD_PILE_X_DEPTH) : 0) + (card.xOffset ? card.xOffset : 0)}
            yLocation={110 - (hasHeight ? (index * CARD_PILE_Y_DEPTH) : 0) + (card.yOffset ? card.yOffset : 0)}
            suit={card.suit}
            value={card.value}
            frontColor={card.frontColor}
            shown={cardShown}
            rotation={card.rotation}
            rolloverColor=''
            clickable={false}
          />
        );
      }
    });
    setCardsToDisplay(newCards);
  }, [cards, shown, hasHeight]);
  if (hidden) { return (<div />); }
  const location = {
    left: xLocation,
    top: yLocation,
    zIndex: zLocation,
  };
  const transformerStyle = {
    transform: `scale(${zoom/100})`,
  };
  const pileStyle = {
    rotate: `${rotation}deg`,
  };
  return (
    <div className='lavpin-pile' style={location}>
      <div className='pile-transformer' style={transformerStyle}>
        <div className='pile-container' style={pileStyle}>
          {cardsToDisplay}
        </div>
      </div>
    </div>
  );
}

Pile.propTypes = {
  xLocation: PropTypes.number,
  yLocation: PropTypes.number,
  zLocation: PropTypes.number,
  cards: PropTypes.array,
  shown: PropTypes.bool,
  rotation: PropTypes.number,
  zoom: PropTypes.number,
  hidden: PropTypes.bool,
  hasHeight: PropTypes.bool,
}

Pile.defaultProps = {
  xLocation: 1000,
  yLocation: 1000,
  zLocation: 0,
  cards: [],
  shown: false,
  rotation: 0,
  zoom: 100,
  hidden: false,
  hasHeight: true,
}
export default Pile;