import * as actionTypes from '../actions/gameActionTypes';
const appMiddleware =
  ({dispatch, getState}) =>
    (next) =>
      (action) => {
  // The below switch statement drives all middleware intercepts
  switch (action.type) {
    case actionTypes.SET_CARD_TABLE_LAYOUT:
      // example middleware action type intercept until real endpoints are required
      return next(action);
    default:
      return next(action);
  }
};
export default appMiddleware;