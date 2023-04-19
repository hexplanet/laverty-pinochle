import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

/**
 * Displays and operates a button. The button may show icon and/or label inside of it.
 * Button will send a callback message if clicked and not inactive status.
 *
 * @prop icon {object} Optional icon svg to be shown on the button
 * @prop buttonClass {string} Additional class name placed on the button.
 * @prop status {string} Status of button. Valid values (inactive, active, '')
 * @prop label {string} Optional label should in button
 * @prop returnMessage {string} Message sent back via callback when button is clicked.
 * @prop handleClick {function} REQUIRED. Callback function for click on button.
 */
function Button({
  icon,
  buttonClass,
  status,
  label,
  returnMessage,
  handleClick
}) {
  const buttonName = `lavpin-button ${buttonClass}`;
  const innerButtonNames = `inner-button ${status}`;
  /**
   * Handles click on button and relays that to the parent with prop returnMessage if not inactive.
   */
  const relayClick = () => {
    if (status.indexOf('inactive') === -1) {
      handleClick(returnMessage);
    }
  };
  return (
    <div className={buttonName}>
        <button className={innerButtonNames} onClick={relayClick}>
          <span>
            {icon !== null && icon}
            {label}
          </span>
        </button>
    </div>
  );
}

Button.propTypes = {
  icon: PropTypes.object,
  buttonClass: PropTypes.string,
  status: PropTypes.string,
  label: PropTypes.string,
  returnMessage: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  icon: null,
  buttonClass: '',
  status: '',
  label: '',
  returnMessage: '',
};

export default Button;