import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as colors from '../../utils/colors.js';
import PlayingCard from "../PlayingCard";
import './index.scss';

// The keyTimes keeps the card start times on the global scope so reseting the component does not reset the start times.
const keyTimes = {};

/**
 * Moves a PlayingCard component around the screen.
 *
 * @prop id {string} This is the unique id of the moving card with include the source location and the target location.
 *                   Format is 'SItoTI' where the SI is the store charaction and the index and then TI is the target
 *                   character and the index. So Hand 2 to Play Pile 1 would be "H2toP1"
 * @prop keyId {string} This a completely unique id, which is create by using the id and the millisecond when the move
 *                      card was created
 * @prop suit {string} This is the suit of the card. Valid values are "H", "D", "S", and "C".
 * @prop value {string} This is the value of the card. Valid values are "A", "10", "K", "Q", "J", and "9".
 * @prop shown {bool} Is the front of the card shown?
 * @prop speed {number} This is the speed in pixels that the card travels in a millisecond
 * @prop travelTime {number} The total number of milliseconds the move takes.
 *                           Either use speed or travelTime, but not both.
 * @prop zLocation {number} This the z-index of the card.
 * @prop source {object} This the source location of the moving card with these properties:
 *                       x: The global left location of the card start
 *                       y: The global top location of the card start
 *                       rotation: The rotation of the card at the start (0-359)
 *                       zoom: The zoom of the card at the start (100 is normal)
 * @prop target {object} This the target location of the moving card with these properties:
 *                       x: The global left location of the card end
 *                       y: The global top location of the card end
 *                       rotation: The rotation of the card at the end (0-359)
 *                       zoom: The zoom of the card at the end (100 is normal)
 * @prop movementDone {function} Callback function to be called with id and keyid when card reaches target.
 * @prop frontColor {string} This is the hex front color of the card.
 * @prop doneMoving {boolean} Has the card reached its target?
 */
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
  frontColor,
  doneMoving
  }) {
  // The current location of the card, set to start at first
  const [location, setLocation] = useState({
    left: `${source.x}px`,
    top: `${source.y}px`,
  });
  // The current rotation of the card
  const [rotationNow, setRotationNow] = useState(source.rotation);
  // The current zoon of the card
  const [zoomNow, setZoomNow] = useState(source.zoom);
  // Get the difference of the travel distances
  const xDifference = target.x - source.x;
  const yDifference = target.y - source.y;
  // Calculates the total time of the travel of the card
  let timeEnd = travelTime;
  if (speed > 0) {
    const distance = Math.sqrt((xDifference * xDifference) + (yDifference * yDifference));
    timeEnd = (distance / speed);
    if (travelTime > 0 && timeEnd < travelTime) {
      timeEnd = travelTime;
    }
  }
  // Get the difference in rotation during travel
  const rotationDifference = target.rotation - source.rotation;
  // Get the difference in zoom during travel
  const zoomDifference = target.zoom - source.zoom;
  // Calculates card movement for current time and executes callback if travel is done
  const calculateCardMovement = () => {
    if (keyTimes[keyId] !== null) {
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
      if (timeRatio >= 1 && !doneMoving) {
        movementDone(id, keyId);
        keyTimes[keyId] = null;
      }
    }
  };
  // Set the start time if not previously set
  if (!keyTimes[keyId]) {
    keyTimes[keyId] = Date.now();
    calculateCardMovement();
  }
  // Sets interval for card movement
  useEffect(() => {
    calculateCardMovement();
    const movementInterval = setInterval(calculateCardMovement, 20);
    return () => clearInterval(movementInterval);
  }, []);
  // Does not render if done moving
  if (doneMoving || keyTimes[keyId] === null) {
    return (<div />);
  }
  // Renders Playing card at location of the moving card
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
        frontColor={frontColor}
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
  frontColor: PropTypes.string,
  doneMoving: PropTypes.bool,
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
  frontColor: colors.cardFrontColor,
  doneMoving: false,
};

export default MoveCard;
