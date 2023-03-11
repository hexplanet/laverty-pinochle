import * as actionTypes from './appActionTypes';

export const setCardTableLayout = (width, height, players) => {
  return {
    type: actionTypes.SET_CARD_TABLE_LAYOUT,
    width,
    height,
    players,
  };
};