import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

/**
 * This displays all components that make up the game play card table display.
 *
 * @prop displayHands {array} This is all of the Hand components to display.
 * @prop displayDiscards {array} This is all of the discard Pile components to display.
 * @prop displayMelds {array} This is all of the meld Pile components to display.
 * @prop displayGameArea {array} This is the game area Pile component to display.
 * @prop displayScorePad {array} This is the scarePad component to display.
 * @prop displayPlayerModal {array} This is all of the Modal components to display.
 * @prop displayMovingCards {array} This is all of the moving cards to display.
 */
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