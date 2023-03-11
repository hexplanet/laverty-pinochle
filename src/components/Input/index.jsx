import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './index.scss';

function Input({
  id,
  inputType,
  inputCLass,
  width,
  maxChars,
  label,
  labelWidth,
  value,
  prompt,
  status,
  handleChange,
  handleEnter,
  handleFocus,
}) {
  const [currentValue, setCurrentValue] = useState(value);
  const [enterKeyListener, setEnterKeyListener] = useState(false);
  const inputClassNames = `lavpin-input ${inputCLass}}`;
  const inputBoxWidth={width:`${width}px`};
  let focused = false;
  const handleEnterKey = (event) => {
    console.log(event?.keyCode, focused);
    if (event?.keyCode === 13 && focused) {
      handleEnter(currentValue);
    }
  };
  useEffect(() => {
    if (handleEnter !== null) {
      document.addEventListener("keydown", handleEnterKey);
      setEnterKeyListener(true);
    }
    return (() => { if (enterKeyListener) {
      document.removeEventListener("keydown", handleEnterKey);
    } });
  }, []);
  const textChanged = (event) => {
    if (event.target.value.length <= maxChars) {
      setCurrentValue(event.target.value);
      if (handleChange !== null) {
        handleChange(event.target.value);
      }
    }
  };
  const labelStyle = labelWidth === 0 ? {} : { width: labelWidth };
  const onFocus = () => { handleFocus(id, true); };
  const onBlur = () => { handleFocus(id, false); };
  return (
    <div className={inputClassNames}>
      <div className={'input-container'}>
        {label && <div className={'input-label'} style={labelStyle}>{label} </div>}
        <div className={'input-element'}>
          <input
            type={inputType}
            placeholder={prompt}
            value={currentValue}
            disabled={status==='inactive'}
            style={inputBoxWidth}
            onChange={textChanged}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string,
  inputType: PropTypes.string,
  inputCLass: PropTypes.string,
  width: PropTypes.number,
  maxChars: PropTypes.number,
  label: PropTypes.string,
  labelWidth: PropTypes.number,
  value: PropTypes.string,
  prompt: PropTypes.string,
  status: PropTypes.string,
  handleChange: PropTypes.any,
  handleEnter: PropTypes.any,
  handleFocus: PropTypes.any,
};

Input.defaultProps = {
  id: '',
  inputType: 'text',
  inputCLass: '',
  width: 200,
  maxChars: 15,
  label: '',
  labelWidth: 0,
  value: '',
  prompt: '',
  status: 'active',
  handleChange: null,
  handleEnter: null,
  handleFocus: () => {},
};

export default Input;