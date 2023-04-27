import gameReducer from './gameReducer';
import * as preBidLogic from './gameReducerPreBidLogic';
import * as actionTypes from "../actions/gameActionTypes";

describe('gameReducer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  test('SET_CARD_TABLE_LAYOUT', ()=> {
    const action = {type: actionTypes.SET_CARD_TABLE_LAYOUT, width: 1000, height: 2000};
    const spied = jest.spyOn(preBidLogic, 'playerDisplaySettingsLogic')
      .mockReturnValue({
        playerHandLocations: 'a',
        playerDiscardLocations: 'b',
        playerMeldLocations: 'c',
        miscLocations: 'd',
        zoomRatio: 'e'
      });
    const newState = gameReducer(undefined, action);
    expect(newState.playerDisplaySettings).toEqual('a');
    expect(newState.discardDisplaySettings).toEqual('b');
    expect(newState.meldDisplaySettings).toEqual('c');
    expect(newState.miscDisplaySettings).toEqual('d');
    expect(newState.zoomRatio).toEqual('e');
    expect(spied).toHaveBeenCalled();
  });
  test('STORE_GAME_STATE', ()=> {
    const action = {type: actionTypes.STORE_GAME_STATE, gameState: 'test'};
    const newState = gameReducer(undefined, action);
    expect(newState.gameState).toEqual('test');
  });
  test('CLEAR_PLAYER_MODAL with not modal hidden', ()=> {
    const action = {type: actionTypes.CLEAR_PLAYER_MODAL, hide: false};
    const newState = gameReducer(undefined, action);
    expect(newState.playerModal).toEqual({shown: false});
  });
  test('CLEAR_PLAYER_MODAL with modal hidden', ()=> {
    const action = {type: actionTypes.CLEAR_PLAYER_MODAL, hide: true};
    const newState = gameReducer(undefined, action);
    expect(newState.playerModal).toEqual({
      shown: false,
      message: '',
      textInputs: [],
      buttons: [],
    });
  });
  test('CLEAR_PROMPT_MODAL', ()=> {
    const action = {type: actionTypes.CLEAR_PROMPT_MODAL, hide: true};
    const newState = gameReducer(undefined, action);
    expect(newState.promptModal).toEqual({
      shown: false,
      message: '',
      textInputs: [],
      buttons: [],
    });
  });
});

/*

 */