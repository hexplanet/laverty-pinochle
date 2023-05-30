import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
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
 * @prop handleQuitGame {function} Callback for when the player quits the game.
 */
function CardTable({
  displayHands,
  displayDiscards,
  displayMelds,
  displayGameArea,
  displayScorePad,
  displayPlayerModal,
  displayMovingCards,
  handleQuitGame
}) {
  const [showQuitModal, setShowQuitModal] = useState(false);
  const toggleQuitModal = () => {
    setShowQuitModal(!showQuitModal);
  };
  const handleModalButtons = (object, action, message) => {
    if (message === 'quit') {
      handleQuitGame();
    } else {
      toggleQuitModal();
    }
  };
  const quitModal = (
    <Modal
      zLocation={2000}
      hasBlocker={true}
      hasCloseButton={true}
      zoom={100}
      message={'Quit the current game?'}
      buttons={[
        {label:'Continue Playing', returnMessage: 'continue'},
        {label:'Quit Playing', returnMessage: 'quit'}
      ]}
      boxStyleClass={'quit-modal'}
      handleCloseModal={toggleQuitModal}
      handleModalInput={handleModalButtons}
    />
  );
  return (
    <div className={'lavpin-card-table'}>
      {displayDiscards}
      {displayMelds}
      {displayGameArea}
      {displayScorePad}
      {displayPlayerModal}
      {displayHands}
      {displayMovingCards}
      <div className={'quit-button-container'}>
        <Button
          label={'X'}
          handleClick={toggleQuitModal}
        />
      </div>
      {showQuitModal && quitModal}
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
  handleQuitGame: PropTypes.func,
};

CardTable.defaultProps = {
  displayHands: [],
  displayDiscards: [],
  displayMelds: [],
  displayGameArea: [],
  displayScorePad: [],
  displayPlayerModal: [],
  displayMovingCards: [],
  handleQuitGame: () => {}
};

export default CardTable;