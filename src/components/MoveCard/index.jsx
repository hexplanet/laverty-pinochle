import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import PlayingCard from "../PlayingCard";

const keyTimes = {};
function MoveCard({
  id,
  keyId,
  suit,
  value,
  shown,
  speed,
  travelTime,
  zLocation,
  source,
  target,
  movementDone,
  }) {
  const [location, setLocation] = useState({
    left: `${source.x}px`,
    top: `${source.y}px`,
  });
  const [rotationNow, setRotationNow] = useState(source.rotation);
  const [zoomNow, setZoomNow] = useState(source.zoom);
  if (!keyTimes[keyId]) {
    keyTimes[keyId] = Date.now();
  }
  const xDifference = target.x - source.x;
  const yDifference = target.y - source.y;
  let timeEnd = travelTime;
  if (speed > 0) {
    const distance = Math.sqrt((xDifference * xDifference) + (yDifference * yDifference));
    timeEnd = (distance / speed);
  }
  const rotationDifference = target.rotation - source.rotation;
  const zoomDifference = target.zoom - source.zoom;
  const calculateCardMovement = () => {
    const timeNow = Date.now();
    const timeDifference = timeNow - keyTimes[keyId];
    const timeRatio = (timeDifference > timeEnd) ? 1 : (timeDifference / timeEnd);
    const xNow = source.x + (xDifference * timeRatio);
    const yNow = source.y + (yDifference * timeRatio);
    setRotationNow(source.rotation + (rotationDifference * timeRatio));
    setZoomNow(source.zoom + (zoomDifference * timeRatio));
    setLocation({
      left: `${xNow}px`,
      top: `${yNow}px`,
      zIndex: zLocation,
    });
    if (timeRatio >= 1) {
      movementDone(id, keyId);
    }
  };
  useEffect(() => {
    calculateCardMovement();
    const movementInterval = setInterval(calculateCardMovement, 20);
    return () => clearInterval(movementInterval);
  }, []);
  return (
    <div className="lavpin-move-card" style={location}>
      <PlayingCard
        xLocation={0}
        yLocation={0}
        suit={suit}
        value={value}
        shown={shown}
        rotation={rotationNow}
        zoom={zoomNow}
        rolloverColor=''
        clickable={false}
      />
    </div>
  );

}

MoveCard.propTypes = {
  id: PropTypes.string,
  keyId: PropTypes.string,
  suit: PropTypes.string,
  value: PropTypes.string,
  shown: PropTypes.bool,
  speed: PropTypes.number,
  travelTime: PropTypes.number,
  zLocation: PropTypes.number,
  source: PropTypes.object.isRequired,
  target: PropTypes.object.isRequired,
  movementDone: PropTypes.func.isRequired,
};

MoveCard.defaultProps = {
  id: '',
  keyId: '',
  suit: 'H',
  value: '8',
  shown: false,
  speed: 1,
  travelTime: 0,
  zLocation: 0,
};

export default MoveCard;
