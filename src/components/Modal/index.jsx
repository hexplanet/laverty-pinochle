import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import './index.scss';

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
  const modalClassNames = `lavpin-modal ${boxStyleClass}}`;
  const boxClassNames = `modal-box${hasBox ? '' : ' transparent-box'}`;
  const headerClassNames = `header-line${hasHeaderSeparator ? '' : ' without-separator'}`;
  const modalStyle = { height,
    width,
  };
  const blockerStyle = { zIndex: zLocation };
  const containerStyle = { zIndex: zLocation,
    height,
    width,
    left: `${xLocation}px`,
    top: `${yLocation}px`,
  };
  if (xLocation === -10000) {
    containerStyle.left = windowWidth / 2;
  }
  if (yLocation === -10000) {
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
  const blockAllEvents = (event) => {
    event.stopPropagation();
  }
  const handleModalButton = (message) => {
    handleModalInput('button', 'click', message);
  };
  const generatedButtons = [];
  const baseTime = Date.now();
  buttons.forEach((modalButton, buttonIndex) => {
    generatedButtons.push(
      <Button
        key={`modalButton_${baseTime + buttonIndex}`}
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
  xLocation: -10000,
  yLocation: -10000,
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