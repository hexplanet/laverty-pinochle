import React from "react";
import PropTypes from "prop-types";
import * as colors from '../../../utils/colors.js';

function BackOfCard({ color, borderColor }) {
  const strokeSize = (borderColor === colors.cardBorderColor) ? "4" : "12";
  return (
    <svg width="100" height="140" viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
      <g>
        <rect width="100" height="140" fill={color} rx="10px" ry="10px" />
        <rect width="100" height="140" fill="none" strokeWidth={strokeSize} stroke={borderColor} rx="10px" ry="10px" />
      </g>
    </svg>
  );
};

BackOfCard.propTypes = {
  color: PropTypes.string,
  borderColor: PropTypes.string,
};

BackOfCard.defaultProps = {
  color: colors.cardBackDefaultColor,
  borderColor: colors.cardBorderColor,
};

export default BackOfCard;