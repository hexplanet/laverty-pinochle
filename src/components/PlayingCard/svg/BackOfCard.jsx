import React from "react";
import PropTypes from "prop-types";

function BackOfCard({ color, borderColor }) {
  return (
    <svg width="100" height="140" viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
      <g>
        <rect width="100" height="140" fill={color} rx="10px" ry="10px" />
        <rect width="100" height="140" fill="none" strokeWidth="4" stroke={borderColor} rx="10px" ry="10px" />
      </g>
    </svg>
  );
};

BackOfCard.propTypes = {
  color: PropTypes.string,
  borderColor: PropTypes.string,
};

BackOfCard.defaultProps = {
  color: '#231F20',
  borderColor: '#aaa',
};

export default BackOfCard;