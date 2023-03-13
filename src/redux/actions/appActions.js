import * as actionTypes from './appActionTypes';
import {SETUP_FOR_NEW_GAME} from "./appActionTypes";

export const setCardTableLayout = (width, height, players) => {
  return {
    type: actionTypes.SET_CARD_TABLE_LAYOUT,
    width,
    height,
    players,
  };
};

export const setupForNewGame = () => {
  return {
    type: actionTypes.SETUP_FOR_NEW_GAME,
  };
};

export const throwForAce = () => {
  return {
    type: actionTypes.THROW_FOR_ACE,
  };
};

export const resolveCardMovement = () => {
  return {
    type: actionTypes.RESOLVE_CARD_MOVEMENT,
  };
};