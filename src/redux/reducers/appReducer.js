import * as actionTypes from '../actions/appActionTypes';
import * as reducerLogic from './appReducerLogic';

const initialState = {
  players: ['You', 'Steven', 'Ellen'],
  playerDisplaySettings: [],
  hands: [
    [
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
    ],
    [
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
    ],
    [
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
    ],
    [
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
      {suit:"H", value: "10", },
    ],
  ],
};

const appReducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.SET_CARD_TABLE_LAYOUT:
        const newPlayerDisplaySettings = reducerLogic.playerDisplaySettingsLogic(
          action.width,
          action.height,
          state.players.length,
        );
      return {
        ...state,
        playerDisplaySettings: newPlayerDisplaySettings,
      }
    default:
      return state;
  }
}

export default appReducer;