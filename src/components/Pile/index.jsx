import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import PlayingCard from "../PlayingCard";
import './index.scss';

function Pile({
  xLocation,
  yLocation,
  zLocation,
  cards,
  shown,
  zoom,
  hidden,
  hasHeight,
}) {
  const [cardsToDisplay, setCardsToDisplay] = useState([]);
  useEffect(() => {
    const newCards = [];
    cards.forEach((card, index) => {
      newCards.push(
        <PlayingCard
          key={`Pile${index}`}
          xLocation={110 + (hasHeight ? (index * 0.2) : 0) + (card.xOffset ? card.xOffset : 0)}
          yLocation={110 - (hasHeight ? (index * 0.5) : 0) + (card.yOffset ? card.yOffset : 0)}
          suit={card.suit}
          value={card.value}
          shown={shown}
          rotation={card.rotation}
          rolloverColor=''
          clickable={false}
        />
      );
    });
    setCardsToDisplay(newCards);
  }, [cards, shown, hasHeight]);
  if (hidden) { return (<div />); }
  const location = {
    left: xLocation,
    top: yLocation,
    zIndex: zLocation,
    transform: `scale(${zoom/100})`,
  };
  return (
    <div className="lavpin-pile" style={location}>
      <div className='pile-container'>
        {cardsToDisplay}
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
  zoom: 100,
  hidden: false,
  hasHeight: true,
}
export default Pile;