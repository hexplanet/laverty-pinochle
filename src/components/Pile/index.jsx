import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import PlayingCard from "../PlayingCard";
import {CARD_PILE_X_DEPTH, CARD_PILE_Y_DEPTH} from "../../utils/constants";
import './index.scss';

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