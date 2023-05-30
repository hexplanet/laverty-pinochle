import * as actionTypes from "./appActionTypes";

/**
 * Action to add the tallied count cards to the teams scores
 * @param appState {string} The new application state
 * @returns {{type: string}} The action
 */
export const setAppState = (appState) => {
  return {
    type: actionTypes.SET_APP_STATE,
    appState
  };
};
