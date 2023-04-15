import * as actionTypes from '../actions/gameActionTypes';
const appMiddleware =
  ({dispatch, getState}) =>
    (next) =>
      (action) => {
  switch (action.type) {
    case actionTypes.SET_CARD_TABLE_LAYOUT:
      return next(action);
    default:
      return next(action);
  }
};
export default appMiddleware;