import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import RuledPaper from "./svg/RuledPaper";

function ScorePad({
  xLocation,
  yLocation,
  zLocation,
  zoom,
  teams,
  won,
  scores,
}) {
  const location = {
    left: `${xLocation}px`,
    top: `${yLocation}px`,
    zIndex: zLocation,
    transform: `scale(${zoom/100})`,
  };
  const scoreElements = [];
  useMemo(() => {
    const columnWidth = 600 / teams.length;
    const columns = teams.length;
    const columnClassName = `score-column of-${columns}-columns`;
    teams.forEach((team, index) => {
      const leftColumn = { left: `${columnWidth * index}px`, width: `${columnWidth}px`};
      const columnSize = { width: `${columnWidth}px`};
      const scoreLines = [];
      scoreLines.push(<div className='team-name' style={columnSize} key={`teamName${index}`}>{team}</div>);
      const points = scores[index];
      points.forEach((point, pointIndex) => {
        const topRowStyle = { top: ((pointIndex + 1) * 50) - 5};
        scoreLines.push(<div className='bid' style={topRowStyle} key={`bid${index}${pointIndex}`}>{point.bid}</div>);
        if (point.bid !== "" && point.gotSet) {
          scoreLines.push(<div className='set' style={topRowStyle} key={`set${index}${pointIndex}`}>X</div>);
        }
        if (!point.gotSet) {
          scoreLines.push(<div className='meb' style={topRowStyle} key={`meb${index}${pointIndex}`}>{point.meb}</div>);
          if (point.counts !== "") {
            scoreLines.push(<div className='plus' style={topRowStyle} key={`plus${index}${pointIndex}`}>+</div>);
            scoreLines.push(<div className='counts' style={topRowStyle} key={`counts${index}${pointIndex}`}>{point.counts}</div>);
          }
        }
        scoreLines.push(<div className='score' style={topRowStyle} key={`score${index}${pointIndex}`}>{point.score}</div>);
      });
      scoreElements.push(<div className={columnClassName} style={leftColumn} key={`scoreColumn${index}`}>{scoreLines}</div>);
    });
    return scoreElements;
  }, [teams, won, scores, scoreElements]);
  return (<div className='lavpin-score-pad' style={location}>
    <RuledPaper columns = { teams.length } />
    <div className='score-pad-container'>
      {scoreElements}
    </div>
  </div>);
}

ScorePad.propTypes = {
  xLocation: PropTypes.number,
  yLocation: PropTypes.number,
  zLocation: PropTypes.number,
  zoom: PropTypes.number,
  teams: PropTypes.array.isRequired,
  won: PropTypes.string,
  scores: PropTypes.array.isRequired,
};

ScorePad.defaultProps = {
  xLocation: 100,
  yLocation: 100,
  zLocation: 0,
  zoom: 100,
  won: '',
};

export default ScorePad;