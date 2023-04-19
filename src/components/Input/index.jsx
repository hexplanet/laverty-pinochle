import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './index.scss';

/**
 * This displays and operates and input element for text input. The text can be returned to the parent via callback
 * funtions for either just the value or the entered value. A character limit can be applied to the input element.
 *
 * @prop id {string} This is the unique id which this input and its output are known by.
 * @prop inputType {string} This the type of input element this is. Default is 'text'
 * @prop inputCLass {string} This is an optional additional class name that maybe applied to this input component.
 * @prop width {number} This is the width of the input box. Default value is 200 pixels.
 * @prop maxChars {number} This is the maximum characts allowed in the input box. Default value is 15.
 * @prop label {string} This is an option label that can appear before the input element.
 * @prop labelWidth {number} This is an optional width to be given to the display of the label.
 * @prop value {string} This is the starting value of the input element.
 * @prop prompt {string} This is the placeholder to appear in the input element if nothing is entered.
 * @prop status {string} This is the status of the input element. Valid values are inactive, active, and ''.
 *                       If the value is inactive then the input element is disabled.
 * @prop handleChange {any} This is either null or a callback function. If not null, it sends back the value.
 * @prop handleEnter {any} This is either null or a callback function. If not null, it sends back the value as entered.
 * @prop handleFocus {any} This is a callback function that sends the id and the focus state of the input element.
 */
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
  /**
   * Handles the keyEvent from keydown listener for enter key to send callback function for entered value
   *
   * @param {keyEvent} event The keyEvent from the document keydown listener
   */
  const handleEnterKey = (event) => {
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
  /**
   * Handles the keyEvent from the input element and trims it to the maximum allowed characters
   * before sending it in a callback function to the parent
   *
   * @param {keyEvent} event The keyEvent for the input element
   */
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