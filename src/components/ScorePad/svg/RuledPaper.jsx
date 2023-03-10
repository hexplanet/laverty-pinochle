import React from "react";
import PropTypes from "prop-types";

function RuledPaper({ color, divisionColor, lineColor, columns }) {
  const majorDivisionStyle = {
    stroke: divisionColor,
    strokeWidth: 4,
  };
  const divisionStyle = {
    stroke: divisionColor,
    strokeWidth: 2,
  };
  const lineStyle = {
    stroke: lineColor,
    strokeWidth: 1,
  };
  let columnLines = (
    <g>
      <line x1="300" y1="0" x2="300" y2="800" style={majorDivisionStyle} />
      <line x1="350" y1="50" x2="350" y2="800" style={divisionStyle} />
    </g>
  );
  if (columns === 3) {
    columnLines = (
      <g>
        <line x1="200" y1="0" x2="200" y2="800" style={majorDivisionStyle} />
        <line x1="400" y1="0" x2="400" y2="800" style={majorDivisionStyle} />
        <line x1="250" y1="50" x2="250" y2="800" style={divisionStyle} />
        <line x1="450" y1="50" x2="450" y2="800" style={divisionStyle} />
      </g>
    );
  }
  return (
    <svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
      <g>
        <rect width="600" height="800" fill={color} />
        <line x1="0" y1="100" x2="600" y2="100" style={lineStyle} />
        <line x1="0" y1="150" x2="600" y2="150" style={lineStyle} />
        <line x1="0" y1="200" x2="600" y2="200" style={lineStyle} />
        <line x1="0" y1="250" x2="600" y2="250" style={lineStyle} />
        <line x1="0" y1="300" x2="600" y2="300" style={lineStyle} />
        <line x1="0" y1="350" x2="600" y2="350" style={lineStyle} />
        <line x1="0" y1="400" x2="600" y2="400" style={lineStyle} />
        <line x1="0" y1="450" x2="600" y2="450" style={lineStyle} />
        <line x1="0" y1="500" x2="600" y2="500" style={lineStyle} />
        <line x1="0" y1="550" x2="600" y2="550" style={lineStyle} />
        <line x1="0" y1="600" x2="600" y2="600" style={lineStyle} />
        <line x1="0" y1="650" x2="600" y2="650" style={lineStyle} />
        <line x1="0" y1="700" x2="600" y2="700" style={lineStyle} />
        <line x1="0" y1="750" x2="600" y2="750" style={lineStyle} />
        <line x1="0" y1="50" x2="600" y2="50" style={majorDivisionStyle} />
        <line x1="50" y1="50" x2="50" y2="800" style={divisionStyle} />
        {columnLines}
      </g>
    </svg>
  );
};

RuledPaper.propTypes = {
  color: PropTypes.string,
  divisionColor: PropTypes.string,
  lineColor: PropTypes.string,
  columns: PropTypes.number,
};

RuledPaper.defaultProps = {
  color: '#dd8',
  divisionColor: '#d88',
  lineColor: '#888',
  columns: 2
};

export default RuledPaper;