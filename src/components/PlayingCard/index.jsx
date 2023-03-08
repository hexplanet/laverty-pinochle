import React from 'react';
import PropTypes from 'prop-types';
import BackOfCard from "./svg/BackOfCard";
import {Hearts} from "./svg/Hearts";
import {Spades} from "./svg/Spades";
import {Diamonds} from "./svg/Diamonds";
import {Clubs} from "./svg/Clubs";
import './index.scss';
function PlayingCard({
  suit,
  value,
  shown,
  zoom,
  rotation,
  xLocation,
  yLocation,
  zLocation,
  hidden
}) {
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
  const cardFront = (
    <div className='card-body'>
      <BackOfCard color={'#eee'}/>
      <div className='top-left-suit'>{suits[suit]}</div>
      <div className='bottom-right-suit'>{suits[suit]}</div>
      <div className='top-left-value'>
        <span className={valueColor}>{value}</span>
      </div>
      <div className='bottom-right-value'>
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
    <div className='playing-card' style={location}>
      <div className='card-container'>
        <div className='card-display' style={displayStyle}>
        {
          shown ? cardFront :
            (<div className='card-body'> <BackOfCard color={'#228'}/> </div>)
        }
        </div>
      </div>
    </div>
  );
}

PlayingCard.propTypes = {
  suit: PropTypes.string,
  value: PropTypes.string,
  shown: PropTypes.bool,
  zoom: PropTypes.number,
  rotation: PropTypes.number,
  xLocation: PropTypes.number,
  yLocation: PropTypes.number,
  zLocation: PropTypes.number,
  hidden: PropTypes.bool
};

PlayingCard.defaultProps = {
  suit: 'H',
  value: '9',
  shown: true,
  zoom: 100,
  rotation: 0,
  xLocation: 0,
  yLocation: 0,
  zLocation: 0,
  hidden: false
};

export default PlayingCard;
