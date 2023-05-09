import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import { MODAL_AUTO_CENTER_VALUE } from '../../utils/constants';
import './index.scss';

/**
 * This will display and operate a modal with an optional blocking matte under it. The modal can have a header message,
 * header separator, close x button, main message, input components, and button components. If opted for the modal can
 * either show its background box or not. This allows you to use this as a quick way to arrange UI if wanted.
 *
 * @prop xLocation {number} This is the global left position of the modal in the browser.
 * @prop yLocation {number} This is the global top position of the modal in the browser.
 * @prop zLocation {number} This is the z-index of the modal. Default value is 1000.
 * @prop zoom {number} This is the percentage at which the hand is scaled. Normal is 100.
 * @prop width {number} This is the width of the modal in pixels. 400 is the default.
 * @prop height {number} This is the height of the modal in pixels. 200 is the default.
 * @prop hasBlocker {boolean} Is a full screen click blocking element under the modal. Default is false.
 * @prop hasCloseButton {boolean} Does the modal have an x close button in the upper right corner. Default is true.
 * @prop hasBox {boolean} Does the modal have a visible background box? Default is true.
 * @prop boxStyleClass {string} An additional class name that can be applied to the modal.
 * @prop header {any} This can be a string or HTML that is displayed as the header.
 *                    If value is "", no header is displayed.
 * @prop hasHeaderSeparator {boolean} Is there a line between the header and the message? Default is false.
 * @prop message {any} This can be a string or HTML that is displayed as the message.
 *                     If value is "", no message is displayed.
 * @prop textInputs {array} This is an optional array of Input Components. No callback, these are operated elsewhere.
 * @prop buttons {array} This is an optional array of Button Components. If array is empty, no Button components shown.
 * @prop handleCloseModal {function} This is a callback function to let the parent know the close button was clicked.
 * @prop handleModalInput {function} This is a callback function to let the parent know a button was clicked.
 *                                   It returns the 'button', 'click', and then the button returnMessage prop.
 */
function Modal({
  xLocation,
  yLocation,
  zLocation,
  zoom,
  width,
  height,
  hasBlocker,
  hasCloseButton,
  hasBox,
  boxStyleClass,
  header,
  hasHeaderSeparator,
  message,
  textInputs,
  buttons,
  handleCloseModal,
  handleModalInput
}) {
  // below code is used to update the location of the modal when the browser is resized.
  const [windowWidth, setWindowWidth]   = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const modalClassNames = `lavpin-modal ${boxStyleClass}`;
  const boxClassNames = `modal-box${hasBox ? '' : ' transparent-box'}`;
  const headerClassNames = `header-line${hasHeaderSeparator ? '' : ' without-separator'}`;
  const modalStyle = { height,
    width,
  };
  const blockerStyle = { zIndex: zLocation };
  const containerStyle = {
    zIndex: zLocation,
    height,
    width,
    left: `${xLocation}px`,
    top: `${yLocation}px`,
  };
  // code for auto centering the modal
  if (xLocation === MODAL_AUTO_CENTER_VALUE) {
    containerStyle.left = windowWidth / 2;
  }
  if (yLocation === MODAL_AUTO_CENTER_VALUE) {
    containerStyle.top = windowHeight / 2;
  }
  const transitionStyle = {
    transform: `scale(${zoom/100})`,
  };
  const boxStyle = {
    left: `${-width / 2}px`,
    top: `${-height / 2}px`,
    height,
    width,
  };
  /**
   * Stops mouse clicks from bubbling up from the modal
   *
   * @param {mouseEvent} event The mouseEvent to be blocked via stopPropagation.
   */
  const blockAllEvents = (event) => {
    event.stopPropagation();
  }
  /**
   * Handles button click and send parent callback function with type (button), action (click), and message.
   *
   * @param {string} message The button message to be sent to the parent for the clicked button.
   */
  const handleModalButton = (message) => {
    handleModalInput('button', 'click', message);
  };
  const generatedButtons = [];
  const baseTime = Date.now();
  // Below function generates all the Button Components for display and operation
  buttons.forEach((modalButton, buttonIndex) => {
    generatedButtons.push(
      <Button
        key={`modalButton_${baseTime}${buttonIndex}`}
        icon={modalButton.icon}
        buttonClass={modalButton.buttonClass}
        status={modalButton.status}
        label={modalButton.label}
        returnMessage={modalButton.returnMessage}
        handleClick={handleModalButton}
      />
    );
  });
  return (
    <div className={modalClassNames} style={modalStyle}>
      {
        hasBlocker && <div className={'blocker'} onClick={blockAllEvents} style={blockerStyle}></div>
      }
      <div className={'box-container'} style={containerStyle}>
        <div className={'box-transition'} style={transitionStyle}>
          <div className={boxClassNames} style={boxStyle}>
            {hasCloseButton &&
              <div className={'x-button'}>
                <Button
                  label={'X'}
                  status={'transparent'}
                  handleClick={handleCloseModal}
                />
              </div>
            }
            <div className={headerClassNames}>{header}</div>
            {hasHeaderSeparator &&
              <div className={'header-separator'}><hr/></div>}
            <div className={'message-area'}>{message}</div>
            {
              textInputs.length > 0 && <div className={'text-inputs'}>{textInputs}</div>
            }
            {
              buttons.length > 0 && <div className={'buttons-line'}>{generatedButtons}</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  xLocation: PropTypes.number,
  yLocation: PropTypes.number,
  zLocation: PropTypes.number,
  zoom: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  hasBlocker: PropTypes.bool,
  hasCloseButton: PropTypes.bool,
  hasBox: PropTypes.bool,
  boxStyleClass: PropTypes.string,
  header: PropTypes.any,
  hasHeaderSeparator: PropTypes.bool,
  message: PropTypes.any,
  textInputs: PropTypes.array,
  buttons: PropTypes.array,
  handleCloseModal: PropTypes.func,
  handleModalInput: PropTypes.func,
};

Modal.defaultProps = {
  xLocation: MODAL_AUTO_CENTER_VALUE,
  yLocation: MODAL_AUTO_CENTER_VALUE,
  zLocation: 1000,
  zoom: 50,
  width: 400,
  height: 200,
  hasBlocker: false,
  hasCloseButton: true,
  hasBox: true,
  boxStyleClass: '',
  header: '',
  hasHeaderSeparator: false,
  message: '',
  textInputs: [],
  buttons: [],
  handleCloseModal: () => {},
  handleModalInput: PropTypes.func,
};

export default Modal;