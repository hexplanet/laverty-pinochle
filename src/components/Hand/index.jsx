import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlayingCard from "../PlayingCard";
import './index.scss';

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
    cards.forEach((card, index) => {
      xCard = 400;
      yCard = 90;
      if (fanOut > -1) {
        distance = 750 + (card.raised ? 20 : 0);
        spinCard = (index - midCard) * fanOut;
        rads = ((spinCard - 90) * Math.PI) / 180;
        xCard = 400 + (distance * Math.cos(rads));
        yCard = 840 + (distance * Math.sin(rads));
      } else {
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