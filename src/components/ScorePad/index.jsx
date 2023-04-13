import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import RuledPaper from "./svg/RuledPaper";

function ScorePad({
  xLocation,
  yLocation,
  zoom,
  teams,
  won,
  scores,
  handleClick,
  hasBlocker
}) {
  const scoreElements = [];
  useMemo(() => {
    const columnWidth = 600 / teams.length;
    const columns = teams.length;
    const columnClassName = `score-column of-${columns}-columns`;
    teams.forEach((team, index) => {
      const leftColumn = { left: `${columnWidth * index}px`, width: `${columnWidth}px`};
      const columnSize = { width: `${columnWidth}px`};
      const totalSize = {
        width: `${columnWidth}px`,
        height: `${scores[index].length * 50}px`
      };
      const scoreLines = [];
      scoreLines.push(<div className='team-name' style={columnSize} key={`teamName${index}`}>{team}</div>);
      const points = scores[index];
      points.forEach((point, pointIndex) => {
        const topRowStyle = { top: ((pointIndex + 1) * 50) - 5};
        scoreLines.push(<div className='bid' style={topRowStyle} key={`bid${index}${pointIndex}`}>{point.bid}</div>);
        if (point.bid !== "" && point.gotSet) {
          scoreLines.push(<div className='set' style={topRowStyle} key={`set${index}${pointIndex}`}>X</div>);
        }
        const meldClass = point.gotSet ? 'meld erased': 'meld';
        scoreLines.push(<div className={meldClass} style={topRowStyle} key={`meld${index}${pointIndex}`}>{point.meld}</div>);
        if (point.counts !== "") {
          const plusClass = point.gotSet ? 'plus erased': 'plus';
          const countsClass = point.gotSet ? 'counts erased': 'counts';
          scoreLines.push(<div className={plusClass} style={topRowStyle} key={`plus${index}${pointIndex}`}>+</div>);
          scoreLines.push(<div className={countsClass} style={topRowStyle} key={`counts${index}${pointIndex}`}>{point.counts}</div>);
        }
        scoreLines.push(<div className='score' style={topRowStyle} key={`score${index}${pointIndex}`}>{point.score}</div>);
      });
      if (team === won) {
        scoreLines.push(<div className='won-game' style={totalSize} key={`wonGame${index}`}><div className='big-w'>W</div></div>);
      }
      scoreElements.push(<div className={columnClassName} style={leftColumn} key={`scoreColumn${index}`}>{scoreLines}</div>);
    });
    return scoreElements;
  }, [teams, won, scores, scoreElements]);
  const blockAll = (event) => {
    event.stopPropagation();
  }
  const location = {
    left: `${xLocation}px`,
    top: `${yLocation}px`
  };
  const blockedLocation = {
    left: '50%',
    top: '50%'
  };
  const transformStyle = {
    transform: `scale(${zoom/100})`,
  };
  const blockedTransformStyle = {
    transform: `scale(${(zoom * 4)/100})`,
  };
  if (hasBlocker) {
    return (
      <div className='lavpin-global-score-pad'>
        <button className='scorepad-blocker' onClick={blockAll} />
        <div className='lavpin-score-pad' style={blockedLocation}>
          <button onClick={handleClick} className={'score-pad-transform'} style={blockedTransformStyle}>
            <RuledPaper columns = { teams.length } />
            <div className='score-pad-container'>
              {scoreElements}
            </div>
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className='lavpin-score-pad' style={location}>
      <button onClick={handleClick} className={'score-pad-transform'} style={transformStyle}>
        <RuledPaper columns = { teams.length } />
        <div className='score-pad-container'>
          {scoreElements}
        </div>
      </button>
    </div>
  );
}

ScorePad.propTypes = {
  xLocation: PropTypes.number,
  yLocation: PropTypes.number,
  zoom: PropTypes.number,
  teams: PropTypes.array.isRequired,
  won: PropTypes.string,
  scores: PropTypes.array.isRequired,
  handleClick: PropTypes.func,
  hasBlocker: PropTypes.bool,
};

ScorePad.defaultProps = {
  xLocation: 0,
  yLocation: 0,
  zoom: 100,
  won: '',
  handleClick: () => {},
  hasBlocker: false
};

export default ScorePad;