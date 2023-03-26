import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
function CardTable({
  displayHands,
  displayDiscards,
  displayMelds,
  displayGameArea,
  displayScorePad,
  displayPlayerModal,
  displayMovingCards
}) {
  return (
    <div className='lavpin-card-table'>
      {displayDiscards}
      {displayMelds}
      {displayGameArea}
      {displayScorePad}
      {displayPlayerModal}
      {displayHands}
      {displayMovingCards}
    </div>
  );
}

CardTable.propTypes = {
  displayHands: PropTypes.array,
  displayDiscards: PropTypes.array,
  displayMelds: PropTypes.array,
  displayGameArea: PropTypes.array,
  displayScorePad: PropTypes.array,
  displayPlayerModal: PropTypes.array,
  displayMovingCards: PropTypes.array,
};

CardTable.defaultProps = {
  displayHands: [],
  displayDiscards: [],
  displayMelds: [],
  displayGameArea: [],
  displayScorePad: [],
  displayPlayerModal: [],
  displayMovingCards: [],
};

export default CardTable;