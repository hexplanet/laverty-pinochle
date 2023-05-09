import * as actionType from "../actions/appActionTypes";

const initialState = {
  appState: 'init',
  teams: ['Us', 'Them'],
  playerName: 'You',
  playersThreeHanded: ['Jack', 'Millie'],
  playersFourHanded: ['Steven', 'Ellen', 'Jessica'],
};
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_APP_STATE:
      return {
        ...state,
        appState: action.appState
      };
    default:
      return state;
  }
};

export default appReducer;