import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

function Button({
  icon,
  buttonClass,
  status,
  label,
  handleClick
}) {
  const buttonName = `lavpin-button ${buttonClass}`;
  const innerButtonNames = `inner-button ${status}`;
  const relayClick = () => {
    if (status.indexOf('inactive') === -1) {
      handleClick();
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
  handleClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  icon: null,
  buttonClass: '',
  status: '',
  label: '',
  buttonStyle: null,
};

export default Button;