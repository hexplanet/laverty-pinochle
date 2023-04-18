import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import BackOfCard from "./svg/BackOfCard";
import {Hearts} from "./svg/Hearts";
import {Spades} from "./svg/Spades";
import {Diamonds} from "./svg/Diamonds";
import {Clubs} from "./svg/Clubs";
import * as colors from '../../utils/colors.js';
import './index.scss';
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
  const cardClicked = () => {
    if (clickable) {
      const suitValue = `${suit}${value}`;
      handleClick(index, suitValue);
    }
  };
  const enterCard = () => {
    if (rolloverColor !== '' && borderColor !== rolloverColor) {
      setBorderColor(rolloverColor);
    }
  };
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
