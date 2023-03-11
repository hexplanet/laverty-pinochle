import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import './index.scss';

function Modal({
  xLocation,
  yLocation,
  zLocation,
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
  const boxStyle = { zIndex: zLocation,
    height,
    width,
    left: `${xLocation}px`,
    top: `${yLocation}px`,
  };
  if (xLocation === -10000) {
    boxStyle.left = (windowWidth - width) / 2;
  }
  if (yLocation === -10000) {
    boxStyle.top = (windowHeight - height) / 2;
  }
  const blockAllEvents = (event) => {
    event.stopPropagation();
  }
  return (
    <div className={modalClassNames} style={modalStyle}>
      {
        hasBlocker && <div className={'blocker'} onClick={blockAllEvents} style={blockerStyle}></div>
      }
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
          buttons.length > 0 && <div className={'buttons-line'}>{buttons}</div>
        }
      </div>
    </div>
  );
}

Modal.propTypes = {
  xLocation: PropTypes.number,
  yLocation: PropTypes.number,
  zLocation: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  hasBlocker: PropTypes.bool,
  hasCloseButton: PropTypes.bool,
  hasBox: PropTypes.bool,
  boxStyleClass: PropTypes.string,
  header: PropTypes.string,
  hasHeaderSeparator: PropTypes.bool,
  message: PropTypes.string,
  textInputs: PropTypes.array,
  buttons: PropTypes.array,
  handleCloseModal: PropTypes.func,
};

Modal.defaultProps = {
  xLocation: -10000,
  yLocation: -10000,
  zLocation: 1000,
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
};

export default Modal;