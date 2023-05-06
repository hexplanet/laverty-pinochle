import gameReducer from './gameReducer';
import * as preBidLogic from './logic/gameReducerPreBidLogic';
import * as bidMeldLogic from './logic/gameReducerBidMeldLogic';
import * as gamePlayLogic from './logic/gameReducerGamePlayLogic';
import * as actionTypes from '../actions/gameActionTypes';
import * as GAME_STATE from '../../utils/gameStates';

describe('gameReducer', () => {
  afterEach(() => {
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
    const initState = {
      players: ['','','']
    };
    const newState = gameReducer(initState, action);
    expect(newState.playerDisplaySettings).toEqual('a');
    expect(newState.discardDisplaySettings).toEqual('b');
    expect(newState.meldDisplaySettings).toEqual('c');
    expect(newState.miscDisplaySettings).toEqual('d');
    expect(newState.zoomRatio).toEqual('e');
    expect(spied).toHaveBeenCalledWith(1000, 2000, 3);
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
  test('RESOLVE_CARD_MOVEMENT with complete', ()=> {
    const action = {type: actionTypes.RESOLVE_CARD_MOVEMENT, id: 'H0toP0', keyId: 'moveCard0'};
    const spied = jest.spyOn(preBidLogic, 'resolveCardMovement')
      .mockReturnValue({
        testValue: 'a',
        movingCards: []
      });
    const initState = {
      movingCards: [],
      hands: [],
      melds: [],
      discardPiles: [],
      playPile: [],
      gameState: 'test',
      testValue: ''
    };
    const newState = gameReducer(initState, action);
    expect(newState.testValue).toEqual('a');
    expect(newState.gameState).toEqual('test:complete');
    expect(spied).toHaveBeenCalledWith('H0toP0','moveCard0', [],[],[],[],[]);
  });
  test('RESOLVE_CARD_MOVEMENT with without complete', ()=> {
    const action = {type: actionTypes.RESOLVE_CARD_MOVEMENT, id: 'H0toP0', keyId: 'moveCard0'};
    const spied = jest.spyOn(preBidLogic, 'resolveCardMovement')
      .mockReturnValue({
        testValue: 'a',
        movingCards: ['a']
      });
    const initState = {
      movingCards: [],
      hands: [],
      melds: [],
      discardPiles: [],
      playPile: [],
      gameState: 'test',
      testValue: ''
    };
    const newState = gameReducer(initState, action);
    expect(newState.testValue).toEqual('a');
    expect(newState.gameState).toEqual('test');
    expect(spied).toHaveBeenCalledWith('H0toP0','moveCard0', [],[],[],[],[]);
  });
  test('SETUP_FOR_NEW_GAME', ()=> {
    const action = {type: actionTypes.SETUP_FOR_NEW_GAME};
    const spied = jest.spyOn(preBidLogic, 'setGameValuesForNewGame')
      .mockReturnValue({
        clearValue: 'a',
      });
    const initState = {
      players: ['players'],
      teams: ['teams']
    };
    const newState = gameReducer(initState, action);
    expect(newState.clearValue).toEqual('a');
    expect(spied).toHaveBeenCalledWith(['teams'],['players']);
  });
  test('THROW_FOR_ACE', ()=> {
    const action = {type: actionTypes.THROW_FOR_ACE};
    const spied = jest.spyOn(preBidLogic, 'throwCardForDeal')
      .mockReturnValue({
        newDealer: 3,
        newDiscards: ['a'],
        newMovingCard: 'b'
      });
    const initState = {
      movingCards: ['c'],
    };
    const newState = gameReducer(initState, action);
    expect(newState.dealer).toEqual(3);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_FOR_ACE);
    expect(newState.discardPiles).toEqual(['a']);
    expect(newState.movingCards).toEqual(['c','b']);
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('SELECTED_DEALER', ()=> {
    const action = {type: actionTypes.SELECTED_DEALER};
    const spied = jest.spyOn(preBidLogic, 'declareDealer')
      .mockReturnValue({
        dealerPromptModal: 'z'
      });
    const initState = {
      players: ['p'],
      dealer: 1,
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.PRE_MOVE_DECK_TO_DEALER);
    expect(newState.promptModal).toEqual('z');
    expect(spied).toHaveBeenCalledWith(['p'], 1);
  });
  test('MOVE_CARD_TO_DEALER', ()=> {
    const action = {type: actionTypes.MOVE_CARD_TO_DEALER};
    const spied = jest.spyOn(preBidLogic, 'passDeckToDealer')
      .mockReturnValue({
        toDealerMovingCards: 'a',
        toDealerMelds: 'b',
        toDealerDiscards:'c',
        toDealerHands:'d',
        toDealerPlayPile:'e',
        toDealerBidModels:'f'
      });
    const initState = {};
    const newState = gameReducer(initState, action);
    expect(newState.movingCards).toEqual('a');
      expect(newState.melds).toEqual('b');
      expect(newState.discardPiles).toEqual('c');
      expect(newState.hands).toEqual('d');
      expect(newState.playPile).toEqual('e');
      expect(newState.bidModals).toEqual(['f']);
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('PRE_DEAL', ()=> {
    const action = {type: actionTypes.PRE_DEAL};
    const spied = jest.spyOn(preBidLogic, 'preDealing')
      .mockReturnValue({
        shuffledCards: 'deck',
        clearPlayerPrompt: 'prompt'
      });
    const initState = {
      dealer: 0,
      players: ['a','b','c'],
      discardPiles: [],
    };
    const newState = gameReducer(initState, action);
    expect(newState.discardPiles).toEqual('deck');
    expect(newState.dealToPlayer).toEqual(1);
    expect(newState.showHands).toEqual([false,false,false]);
    expect(newState.promptModal).toEqual('prompt');
    expect(newState.handFanOut).toEqual(-1);
    expect(newState.offSuits).toEqual([[],[],[]]);
    expect(spied).toHaveBeenCalledWith([], 0);
  });
  test('DEAL_CARDS', ()=> {
    const action = {type: actionTypes.DEAL_CARDS};
    const spied = jest.spyOn(preBidLogic, 'dealing')
      .mockReturnValue({
        dealDeck: 'deck',
        dealCards: 'cards'
      });
    const initState = {
      players: ['a','b','c'],
      dealToPlayer: 1,
    };
    const newState = gameReducer(initState, action);
    expect(newState.discardPiles).toEqual('deck');
    expect(newState.movingCards).toEqual('cards');
    expect(newState.dealToPlayer).toEqual(2);
    expect(newState.bidOffset).toEqual(21);
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('SET_HAND_FAN_OUT', ()=> {
    const action = {type: actionTypes.SET_HAND_FAN_OUT, fanOut: 2};
    const newState = gameReducer(undefined, action);
    expect(newState.handFanOut).toEqual(2);
  });
  test('CHECK_FOR_NINES with no modals', ()=> {
    const action = {type: actionTypes.CHECK_FOR_NINES};
    const spied = jest.spyOn(preBidLogic, 'checkForNines')
      .mockReturnValue({
        ninesPromptModal: undefined,
        ninesPlayerModal: undefined,
        ninesGameState: 'gameState'
      });
    const initState = {
      hands: 'hands',
      players: ['a','b','c'],
      dealer: 2,
    };
    const newState = gameReducer(initState, action);
    expect(newState.showHands).toEqual([true, false, false]);
    expect(newState.gameState).toEqual('gameState');
    expect(newState.dealToPlayer).toEqual(2);
    expect(newState.promptModal).toEqual(undefined);
    expect(newState.playerModal).toEqual(undefined);
    expect(spied).toHaveBeenCalledWith('hands', ['a','b','c']);
  });
  test('CHECK_FOR_NINES with with modals', ()=> {
    const action = {type: actionTypes.CHECK_FOR_NINES};
    const spied = jest.spyOn(preBidLogic, 'checkForNines')
      .mockReturnValue({
        ninesPromptModal: 'd',
        ninesPlayerModal: 'e',
        ninesGameState: 'gameState'
      });
    const initState = {
      hands: 'hands',
      players: ['a','b','c'],
      dealer: 2,
    };
    const newState = gameReducer(initState, action);
    expect(newState.showHands).toEqual([true, false, false]);
    expect(newState.gameState).toEqual('gameState');
    expect(newState.dealToPlayer).toEqual(2);
    expect(newState.promptModal).toEqual('d');
    expect(newState.playerModal).toEqual('e');
    expect(spied).toHaveBeenCalledWith('hands', ['a','b','c']);
  });
  test('PARTNER_CONFIRM_NINES_REDEAL', ()=> {
    const action = {type: actionTypes.PARTNER_CONFIRM_NINES_REDEAL};
    const spied = jest.spyOn(preBidLogic, 'checkPostNines')
      .mockReturnValue({
        postNinesPromptModal: 'd',
        postNinesPlayerModal: 'e',
        postNinesGameState: 'f'
      });
    const initState = {
      hands: 'hands',
      players: ['a','b','c']
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual('f');
    expect(newState.promptModal).toEqual('d');
    expect(newState.playerModal).toEqual('e');
    expect(spied).toHaveBeenCalledWith('hands', ['a','b','c']);
  });
  test('NEXT_BID with forced to take bid', ()=> {
    const action = {type: actionTypes.NEXT_BID};
    const spied = jest.spyOn(bidMeldLogic, 'nextBid')
      .mockReturnValue({
        nextBidPrompt: 'g'
      });
    const initState = {
      dealToPlayer: 2,
      hands: 'hands',
      players: ['a','b','c'],
      dealer: 0,
      bids: [0,0,0],
      bidModals: [{}]
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.BIDDING_COMPLETE);
    expect(newState.bids).toEqual([20, 0, 0]);
    expect(newState.promptModal).toEqual('g');
    expect(newState.bidModals).toEqual([{
      hasCloseButton: false,
      hasHeaderSeparator: false,
      header: "20",
      height: 44,
      message: expect.any(Object),
      shown: true,
      width: 80,
      zoom: 100
    }]);
    expect(spied).toHaveBeenCalledWith(['a','b','c'], 0);
  });
  test('NEXT_BID for the user', ()=> {
    const action = {type: actionTypes.NEXT_BID};
    const spied = jest.spyOn(bidMeldLogic, 'nextBid')
      .mockReturnValue({
        nextBidPrompt: 'g'
      });
    const initState = {
      dealToPlayer: 2,
      hands: 'hands',
      players: ['a','b','c'],
      dealer: 0,
      bids: [0,22,0],
      bidModals: [{}]
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.USER_BID);
    expect(newState.promptModal).toEqual('g');
    expect(spied).toHaveBeenCalledWith(['a','b','c'], 0);
  });
  test('NEXT_BID for the computer', ()=> {
    const action = {type: actionTypes.NEXT_BID};
    const spied = jest.spyOn(bidMeldLogic, 'nextBid')
      .mockReturnValue({
        nextBidPrompt: 'g'
      });
    const initState = {
      dealToPlayer: 1,
      hands: 'hands',
      players: ['a','b','c'],
      dealer: 0,
      bids: [0,0,0],
      bidModals: [{}]
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.COMPUTER_BID);
    expect(newState.promptModal).toEqual('g');
    expect(spied).toHaveBeenCalledWith(['a','b','c'], 2);
  });
  test('GET_USER_BID scroll bids left', ()=> {
    const action = {type: actionTypes.GET_USER_BID, selection: 'bid_left'};
    const spied = jest.spyOn(bidMeldLogic, 'configureUserBidModal')
      .mockReturnValue({
        bidPlayerModal: 'playerModal',
        maxedBidOffset: 35
      });
    const initState = {
      bids: [0],
      bidOffset: 30,
      dealToPlayer: 0,
      dealer: 1,
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_FOR_USER_BID);
    expect(newState.playerModal).toEqual('playerModal');
    expect(newState.bidOffset).toEqual(35);
    expect(spied).toHaveBeenCalledWith([0], 25, 0, 1);
  });
  test('GET_USER_BID scroll bids right', ()=> {
    const action = {type: actionTypes.GET_USER_BID, selection: 'bid_right'};
    const spied = jest.spyOn(bidMeldLogic, 'configureUserBidModal')
      .mockReturnValue({
        bidPlayerModal: 'playerModal',
        maxedBidOffset: 45
      });
    const initState = {
      bids: [0],
      bidOffset: 30,
      dealToPlayer: 0,
      dealer: 1,
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_FOR_USER_BID);
    expect(newState.playerModal).toEqual('playerModal');
    expect(newState.bidOffset).toEqual(45);
    expect(spied).toHaveBeenCalledWith([0], 35, 0, 1);
  });
  test('GET_USER_BID set-up', ()=> {
    const action = {type: actionTypes.GET_USER_BID, selection: ''};
    const spied = jest.spyOn(bidMeldLogic, 'configureUserBidModal')
      .mockReturnValue({
        bidPlayerModal: 'playerModal',
        maxedBidOffset: 23
      });
    const initState = {
      bids: [0],
      bidOffset: 22,
      dealToPlayer: 0,
      dealer: 1,
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_FOR_USER_BID);
    expect(newState.playerModal).toEqual('playerModal');
    expect(newState.bidOffset).toEqual(23);
    expect(spied).toHaveBeenCalledWith([0], 22, 0, 1);
  });
  test('GET_USER_BID user bid with sending to the next bid', ()=> {
    const action = {type: actionTypes.GET_USER_BID, selection: 'bid_40'};
    const initState = {
      bids: [0],
      bidOffset: 30,
      dealToPlayer: 0,
      dealer: 1,
      playerModal: {},
      bidModals: [{}]
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.NEXT_BID);
    expect(newState.playerModal).toEqual({shown: false});
    expect(newState.bids).toEqual([40]);
    expect(newState.bidModels).toEqual([{
      "hasCloseButton": false,
      "hasHeaderSeparator": false,
      "header": "40",
      "height": 44,
      "message": expect.any(Object),
      "shown": true,
      "width": 80,
      "zoom": 100
    }]);
  });
  test('GET_USER_BID user bid with bidding complete', ()=> {
    const action = {type: actionTypes.GET_USER_BID, selection: 'bid_40'};
    const initState = {
      bids: [0],
      bidOffset: 30,
      dealToPlayer: 0,
      dealer: 0,
      playerModal: {},
      bidModals: [{}]
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.BIDDING_COMPLETE);
    expect(newState.playerModal).toEqual({shown: false});
    expect(newState.bids).toEqual([40]);
    expect(newState.bidModels).toEqual([{
      "hasCloseButton": false,
      "hasHeaderSeparator": false,
      "header": "40",
      "height": 44,
      "message": expect.any(Object),
      "shown": true,
      "width": 80,
      "zoom": 100
    }]);
  });
  test('RESOLVE_COMPUTER_BID not last bid', ()=> {
    const action = {type: actionTypes.RESOLVE_COMPUTER_BID};
    const spied = jest.spyOn(bidMeldLogic, 'computerBid')
      .mockReturnValue(34);
    const initState = {
      hands: [[],[],[]],
      dealToPlayer: 1,
      players: ['a','b','c'],
      bids: [20, 0, 0],
      dealer: 2,
      bidModals: [{}, {}, {}]
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.NEXT_BID);
    expect(newState.bids).toEqual([20,34,0]);
    expect(newState.bidModals).toEqual([
      {},
      {
        "hasCloseButton": false,
        "hasHeaderSeparator": false,
        "header": "34",
        "height": 44,
        "message": expect.any(Object),
        "shown": true,
        "width": 80,
        "zoom": 100,
      },
      {}
    ]);
    expect(spied).toHaveBeenCalledWith([[],[],[]], 1, ['a','b','c'], [20, 0, 0]);
  });
  test('RESOLVE_COMPUTER_BID as last bid', ()=> {
    const action = {type: actionTypes.RESOLVE_COMPUTER_BID};
    const spied = jest.spyOn(bidMeldLogic, 'computerBid')
      .mockReturnValue(34);
    const initState = {
      hands: [[],[],[]],
      dealToPlayer: 1,
      players: ['a','b','c'],
      bids: [20, 0, 0],
      dealer: 1,
      bidModals: [{}, {}, {}]
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.BIDDING_COMPLETE);
    expect(newState.bids).toEqual([20,21,0]);
    expect(newState.bidModals).toEqual([
      {},
      {
        "hasCloseButton": false,
        "hasHeaderSeparator": false,
        "header": "21",
        "height": 44,
        "message": expect.any(Object),
        "shown": true,
        "width": 80,
        "zoom": 100,
      },
      {}
    ]);
    expect(spied).toHaveBeenCalledWith([[],[],[]], 1, ['a','b','c'], [20, 0, 0]);
  });
  test('DECIDE_BID_WINNER', ()=> {
    const action = {type: actionTypes.DECIDE_BID_WINNER};
    const spied = jest.spyOn(bidMeldLogic, 'resolveBidding')
      .mockReturnValue({
        tookBidPlayerModal: 'a',
        tookBidPromptModal: 'b',
        wonTheBid:'c',
        wonBidWith:'d',
        updatedBidScore:'e'
      });
    const initState = {
      bids: 'f',
      players: 'g',
      teams: 'h',
      playScore: 'i'
    };
    const newState = gameReducer(initState, action);
    expect(newState.playerModal).toEqual('a');
    expect(newState.promptModal).toEqual('b');
    expect(newState.playScore).toEqual(['e']);
    expect(newState.tookBid).toEqual('c');
    expect(newState.tookPlay).toEqual('c');
    expect(newState.bidAmount).toEqual('d');
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_DISPLAY_WIDOW);
    expect(newState.thrownHand).toEqual(false);
    expect(spied).toHaveBeenCalledWith('f','g','h','i');
  });
  test('SHOW_THE_WIDOW set up modal', ()=> {
    const action = {type: actionTypes.SHOW_THE_WIDOW, widowCardIndex: -1};
    const spied = jest.spyOn(bidMeldLogic, 'displayWidow')
      .mockReturnValue('a');
    const initState = {
      playPile: 'b',
      players: ['c','d','e']
    };
    const newState = gameReducer(initState, action);
    expect(newState.playerModal).toEqual({shown:false});
    expect(newState.bidModals).toEqual([{shown:false},{shown:false},{shown:false}]);
    expect(newState.gameState).toEqual(GAME_STATE.SHOW_WIDOW);
    expect(newState.playPile).toEqual('a');
    expect(newState.playPileShown).toEqual(true);
    expect(spied).toHaveBeenCalledWith('b',-1,['c','d','e']);
  });
  test('SHOW_THE_WIDOW wait after show card', ()=> {
    const action = {type: actionTypes.SHOW_THE_WIDOW, widowCardIndex: 0};
    const spied = jest.spyOn(bidMeldLogic, 'displayWidow')
      .mockReturnValue('a');
    const initState = {
      playPile: 'b',
      players: ['c','d','e']
    };
    const newState = gameReducer(initState, action);
    expect(newState.playerModal).toEqual({shown:false});
    expect(newState.bidModals).toEqual([{shown:false},{shown:false},{shown:false}]);
    expect(newState.gameState).toEqual(GAME_STATE.WIDOW_WAIT);
    expect(newState.playPile).toEqual('a');
    expect(newState.playPileShown).toEqual(true);
    expect(spied).toHaveBeenCalledWith('b',0,['c','d','e']);
  });
  test('SHOW_THE_WIDOW continue modal', ()=> {
    const action = {type: actionTypes.SHOW_THE_WIDOW, widowCardIndex: 3};
    const initState = {
      players: ['c','d','e']
    };
    const newState = gameReducer(initState, action);
    expect(newState.playerModal).toEqual({
      "buttons": [
        {
          "label": "Continue",
          "returnMessage": "widowContinue",
        },
      ],
      "hasBox": false,
      "hasCloseButton": false,
      "hasHeaderSeparator": false,
      "header": "",
      "height": 140,
      "message": expect.any(Object),
      "shown": true,
      "width": 210,
      "zoom": 100
    });
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_MOVE_WIDOW_TO_HAND);
  });
  test('MOVE_WIDOW_TO_HAND', ()=> {
    const action = {type: actionTypes.MOVE_WIDOW_TO_HAND};
    const spied = jest.spyOn(bidMeldLogic, 'movingWidow')
      .mockReturnValue({
        widowMovingCards: 'a',
        widowSeen: 'b',
        widowEmptyPlayPile: 'c'
      });
    const initState = {};
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WIDOW_MOVING);
    expect(newState.movingCards).toEqual(['a']);
    expect(newState.playPile).toEqual(['c']);
    expect(newState.seenWidow).toEqual(['b']);
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('DECIDE_THROW_HAND user throw hand?', ()=> {
    const action = {type: actionTypes.DECIDE_THROW_HAND};
    const spied = jest.spyOn(bidMeldLogic, 'shouldUserThrowHand')
      .mockReturnValue({
        throwPlayerModal: 'a',
        throwGameState: 'b'
      });
    const initState = {
      tookBid: 0,
      hands: 'c',
      bidAmount: 'd',
      players: 'e'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual('b');
    expect(newState.playerModal).toEqual('a');
    expect(spied).toHaveBeenCalledWith('c','d','e');
  });
  test('DECIDE_THROW_HAND computer throw hand?', ()=> {
    const action = {type: actionTypes.DECIDE_THROW_HAND};
    const spied = jest.spyOn(bidMeldLogic, 'shouldComputerThrowHand')
      .mockReturnValue({
        computerThrowGameState: 'a'
      });
    const initState = {
      tookBid: 'b',
      hands: 'c',
      bidAmount: 'd',
      players: 'e'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual('a');
    expect(spied).toHaveBeenCalledWith('c','b','d','e');
  });
  test('AGREE_THROW_HAND user asked', ()=> {
    const action = {type: actionTypes.AGREE_THROW_HAND};
    const initState = {
      tookBid: 2,
      players: ['a','b','c','d']
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_AGREE_THROW_HAND);
    expect(newState.playerModal).toEqual({
      "buttons": [
        {
          "label": "Play Hand",
          "returnMessage": "throwHandDisagree",
        },
        {
          "label": "Throw Hand",
          "returnMessage": "throwHand",
        },
      ],
      "hasCloseButton": false,
      "hasHeaderSeparator": false,
      "header": "",
      "height": 105,
      "message": (
        <div>
          <span>
            <b>
              c
            </b> wants to throw the hand
          </span>
        </div>),
      "shown": true,
      "width": 500,
      "zoom": 100,
    });
  });
  test('AGREE_THROW_HAND computer asked', ()=> {
    const action = {type: actionTypes.AGREE_THROW_HAND};
    const spied = jest.spyOn(bidMeldLogic, 'shouldComputerAgreeThrowHand')
      .mockReturnValue({
        computerAgreeThrowHand: 'throwHand'
      });
    const initState = {
      tookBid: 1,
      players: ['a','b','c'],
      hands: 'd',
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual('throwHand');
    expect(newState.thrownHand).toEqual(true);
    expect(spied).toHaveBeenCalledWith("d", 1, ["a", "b", "c"]);
  });
  test('DISAGREE_THROW_HAND user continue button', ()=> {
    const action = {type: actionTypes.DISAGREE_THROW_HAND};
    const initState = {
      tookBid: 1,
      players: ['a','b','c','d'],

    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_AFTER_THROW_DISAGREE);
    expect(newState.promptModal).toEqual( {
      "hasCloseButton": false,
      "hasHeaderSeparator": false,
      "header": "",
      "height": 140,
      "message": (<div><span><b>b</b> wanted to thrown the hand, but <b>d</b> disagreed</span></div>),
      "shown": true,
      "width": 210,
      "zoom": 100
    });
    expect(newState.playerModal).toEqual({
      "buttons": [{"label": "Continue", "returnMessage": "throwHandContinue"}],
      "hasBox": false,
      "hasCloseButton": false,
      "hasHeaderSeparator": false,
      "header": "",
      "height": 140,
      "message": expect.any(Object),
      "shown": true,
      "width": 210,
      "zoom": 100
    });
  });
  test('DISAGREE_THROW_HAND straight to select trump', ()=> {
    const action = {type: actionTypes.DISAGREE_THROW_HAND};
    const initState = {
      tookBid: 2,
      players: ['a','b','c','d'],

    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.SELECT_TRUMP_SUIT);
    expect(newState.promptModal).toEqual( {
      "hasCloseButton": false,
      "hasHeaderSeparator": false,
      "header": "",
      "height": 140,
      "message": (<div><span><b>c</b> wanted to thrown the hand, but <b>a</b> disagreed</span></div>),
      "shown": true,
      "width": 210,
      "zoom": 100
    });
    expect(newState.playerModal).toEqual({
      "shown": false
    });
  });
  test('THROW_HAND continue button', ()=> {
    const action = {type: actionTypes.THROW_HAND};
    const initState = {
      tookBid: 1,
      players: ['a','b','c','d'],
      playScore: [[{}], [{}]]
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_AFTER_THROW_HAND);
    expect(newState.thrownHand).toEqual(true);
    expect(newState.playScore).toEqual( [[{}], [{"gotSet": true}]]);
    expect(newState.promptModal).toEqual({
      "hasCloseButton": false,
      "hasHeaderSeparator": false,
      "header": "",
      "height": 140,
      "message": (<div><span><b>b</b> throws the hand</span></div>),
      "shown": true,
      "width": 210,
      "zoom": 100
    });
    expect(newState.playerModal).toEqual( {
      "buttons": [{"label": "Continue", "returnMessage": "nameTrumpSuit"}],
      "hasBox": false,
      "hasCloseButton": false,
      "hasHeaderSeparator": false,
      "header": "",
      "height": 140,
      "message": expect.any(Object),
      "shown": true,
      "width": 210,
      "zoom": 100
    });
  });
  test('THROW_HAND straight to select trump suit', ()=> {
    const action = {type: actionTypes.THROW_HAND};
    const initState = {
      tookBid: 2,
      players: ['a','b','c','d'],
      playScore: [[{}], [{}]]
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.SELECT_TRUMP_SUIT);
    expect(newState.thrownHand).toEqual(true);
    expect(newState.playScore).toEqual( [[{"gotSet": true}], [{}]]);
    expect(newState.promptModal).toEqual({
      "hasCloseButton": false,
      "hasHeaderSeparator": false,
      "header": "",
      "height": 140,
      "message": (<div><span><b>c</b> throws the hand</span></div>),
      "shown": true,
      "width": 210,
      "zoom": 100
    });
    expect(newState.playerModal).toEqual( {
      "shown": false
    });
  });
  test('START_DISCARDS', ()=> {
    const action = {type: actionTypes.START_DISCARDS};
    const spied = jest.spyOn(bidMeldLogic, 'setUpDiscards')
      .mockReturnValue({
        discardGameState: 'a',
        discardPlayerModal: 'b',
        discardPromptModal: 'c',
        discardHands: 'd',
      });
    const initState = {
      hands: 'e',
      tookBid: 'f',
      players: 'g',
      trumpSuit: 'h',
      bidAmount: 'i'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual('a');
    expect(newState.playerModal).toEqual('b');
    expect(newState.promptModal).toEqual('c');
    expect(newState.hands).toEqual(['d']);
    expect(spied).toHaveBeenCalledWith('e','f', 'g', 'h', 'i');
  });
  test('USER_SELECT_DISCARD', ()=> {
    const action = {type: actionTypes.USER_SELECT_DISCARD, index: 1};
    const spied = jest.spyOn(bidMeldLogic, 'userSelectDiscard')
      .mockReturnValue({
        discardUserHands: 'a',
        discardUserModal: 'b'
      });
    const initState = {
      hands: 'c',
      playerModal: 'd'
    };
    const newState = gameReducer(initState, action);
    expect(newState.hands).toEqual(['a']);
    expect(newState.playerModal).toEqual('b');
    expect(spied).toHaveBeenCalledWith('c','d', 1);
  });
  test('REMOVE_USER_DISCARDS', ()=> {
    const action = {type: actionTypes.REMOVE_USER_DISCARDS};
    const spied = jest.spyOn(bidMeldLogic, 'removeUserDiscard')
      .mockReturnValue({
        removeUserHands: 'a',
        removeUserMovingCards: 'b',
        removeUserPrompt: 'c',
      });
    const initState = {};
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_REMOVE_DISCARDS);
    expect(newState.hands).toEqual(['a']);
    expect(newState.movingCards).toEqual('b');
    expect(newState.promptModal).toEqual('c');
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('COMPUTER_DISCARDS', ()=> {
    const action = {type: actionTypes.COMPUTER_DISCARDS};
    const spied = jest.spyOn(bidMeldLogic, 'calculateComputerDiscard')
      .mockReturnValue({
        removeComputerHands: 'a',
        removeComputerMovingCards: 'b',
        removeComputerPrompt: 'c',
        removeComputerPlayer: 'd',
        removeComputerGameState: 'e'
      });
    const initState = {};
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual('e');
    expect(newState.hands).toEqual(['a']);
    expect(newState.movingCards).toEqual('b');
    expect(newState.promptModal).toEqual('c');
    expect(newState.playerModal).toEqual('d');
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('DECLARE_TRUMP_SUIT by user', ()=> {
    const action = {type: actionTypes.DECLARE_TRUMP_SUIT};
    const spied = jest.spyOn(bidMeldLogic, 'userSelectTrump')
      .mockReturnValue({
        userTrumpPrompt: 'c',
        userTrumpPlayer: 'd'
      });
    const initState = {
      tookBid: 0,
      hands: 'a',
      players: 'b'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.USER_TRUMP_WAIT);
    expect(newState.promptModal).toEqual('c');
    expect(newState.playerModal).toEqual('d');
    expect(spied).toHaveBeenCalledWith('a', 'b');
  });
  test('DECLARE_TRUMP_SUIT by comouter', ()=> {
    const action = {type: actionTypes.DECLARE_TRUMP_SUIT};
    const spied = jest.spyOn(bidMeldLogic, 'computerSelectTrump')
      .mockReturnValue({
        computerTrumpSuit: 'a',
        computerTrumpPlayer: 'b',
        computerTrumpPrompt: 'c'
      });
    const initState = {
      hands: 'd',
      tookBid: 1,
      players: 'e',
      bidAmount: 'f'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.USER_TRUMP_WAIT);
    expect(newState.trumpSuit).toEqual('a');
    expect(newState.promptModal).toEqual('c');
    expect(newState.playerModal).toEqual('b');
    expect(spied).toHaveBeenCalledWith('d', 1, 'e','f');
  });
  test('SET_TRUMP_SUIT for not thrown hand', ()=> {
    const action = {type: actionTypes.SET_TRUMP_SUIT, suit: 'S'};
    const initState = {
      thrownHand: false
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.START_DISCARDS);
    expect(newState.trumpSuit).toEqual('S');
  });
  test('SET_TRUMP_SUIT for thrown hand', ()=> {
    const action = {type: actionTypes.SET_TRUMP_SUIT, suit: 'S'};
    const initState = {
      thrownHand: true
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.START_MELD);
    expect(newState.trumpSuit).toEqual('S');
  });
  test('START_MELD', ()=> {
    const action = {type: actionTypes.START_MELD};
    const spied = jest.spyOn(bidMeldLogic, 'startMeldMessage')
      .mockReturnValue('a');
    const initState = {
      trumpSuit: 'b',
      tookBid: 'c',
      bidAmount: 'd',
      players: ['e']
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.DISPLAY_MELD);
    expect(newState.meldScores).toEqual([0]);
    expect(newState.dealToPlayer).toEqual('c');
    expect(newState.promptModal).toEqual('a');
    expect(spied).toHaveBeenCalledWith('b', 'c', 'd', ['e']);
  });
  test('DISPLAY_MELD thrown hand took bid', ()=> {
    const action = {type: actionTypes.DISPLAY_MELD};
    const initState = {
      thrownHand: true,
      bidModals: [{}, {}, {}, {}],
      players: ['a','b','c','d'],
      dealToPlayer: 2,
      tookBid: 2
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.MELD_DELAY);
    expect(newState.bidModals).toEqual(
      [
        {},
        {},
        {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "X",
          "height": 44,
          "message": expect.any(Object),
          "shown": true,
          "width": 80,
          "zoom": 100
        },
        {}
      ]
    );
  });
  test('DISPLAY_MELD thrown hand took bid partner', ()=> {
    const action = {type: actionTypes.DISPLAY_MELD};
    const initState = {
      thrownHand: true,
      bidModals: [{}, {}, {}, {}],
      players: ['a','b','c','d'],
      dealToPlayer: 0,
      tookBid: 2
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.MELD_DELAY);
    expect(newState.bidModals).toEqual(
      [
        {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "X",
          "height": 44,
          "message": expect.any(Object),
          "shown": true,
          "width": 80,
          "zoom": 100
        },
        {},
        {},
        {}
      ]
    );
  });
  test('DISPLAY_MELD hand not thrown', ()=> {
    const action = {type: actionTypes.DISPLAY_MELD};
    const spied = jest.spyOn(bidMeldLogic, 'meldCards')
      .mockReturnValue({
        meldHands: 'a',
        meldPlacedCards: 'b',
        meldPlaceScores: 'c',
        meldSeenCards: 'd'
      });
    const initState = {
      dealToPlayer: 3,
      bidModals: [{}, {}, {}, {}],
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.MELD_DELAY);
    expect(newState.hands).toEqual(['a']);
    expect(newState.meldScores).toEqual(['c']);
    expect(newState.seenCards).toEqual(['d']);
    expect(newState.bidModals).toEqual([
      {},
      {},
      {},
      {
        "hasCloseButton": false,
        "hasHeaderSeparator": false,
        "header": undefined,
        "height": 44,
        "message": expect.any(Object),
        "shown": true,
        "width": 80,
        "zoom": 100
      }
    ]);
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('NEXT_MELD', ()=> {
    const action = {type: actionTypes.NEXT_MELD};
    const spied = jest.spyOn(bidMeldLogic, 'postMeldLaydown')
      .mockReturnValue({
        meldDealToPlayer: 'a',
        meldGameState: 'b',
        meldPlayScore: 'c',
        meldPlayerModal: 'd',
        meldPromptModal: 'e'
      });
    const initState = {
      dealToPlayer: 'f',
      thrownHand: 'g',
      tookBid: 'h',
      meldScores: 'i',
      playScore: 'j',
      players: 'k',
      promptModal: 'l',
      trumpSuit: 'm',
      bidAmount: 'n',
      teams: 'o'
    };
    const newState = gameReducer(initState, action);
    expect(newState.dealToPlayer).toEqual('a');
    expect(newState.playScore).toEqual(['c']);
    expect(newState.gameState).toEqual('b');
    expect(newState.playerModal).toEqual('d');
    expect(newState.promptModal).toEqual('e');
    expect(spied).toHaveBeenCalledWith('f','g','h','i','j','k','l','m','n','o');
  });
  test('START_GAME_PLAY', ()=> {
    const action = {type: actionTypes.START_GAME_PLAY};
    const spied = jest.spyOn(gamePlayLogic, 'startGamePlay')
      .mockReturnValue({
        startMovingCards: 'a',
        startGameState: 'b',
        startPromptModal: 'c',
        startBidModals: 'd',
        startMelds: 'e'
      });
    const initState = {};
    const newState = gameReducer(initState, action);
    expect(newState.firstPlay).toEqual(true);
    expect(newState.movingCards).toEqual(['a']);
    expect(newState.gameState).toEqual('b');
    expect(newState.playerModal).toEqual({shown: false});
    expect(newState.promptModal).toEqual({"0": "c"});
    expect(newState.bidModals).toEqual(['d']);
    expect(newState.melds).toEqual(['e']);
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('MOVE_REST_TO_DISCARD', ()=> {
    const action = {type: actionTypes.MOVE_REST_TO_DISCARD};
    const spied = jest.spyOn(gamePlayLogic, 'moveRestToDiscardPile')
      .mockReturnValue({
        restDiscardMovingCards: 'a',
        restDiscardShowHands: 'b',
        restDiscardHands: 'c'
      });
    const initState = {};
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.REST_MOVE_TO_DISCARD);
    expect(newState.movingCards).toEqual(['a']);
    expect(newState.showHands).toEqual(['b']);
    expect(newState.hands).toEqual(['c']);
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('PLAY_LEAD player has the rest of the tricks', ()=> {
    const action = {type: actionTypes.PLAY_LEAD};
    const spied = jest.spyOn(gamePlayLogic, 'gotTheRest')
      .mockReturnValue({
        gotRestGameState: 'a',
        gotRestPlayerModal: 'b',
        gotRestPromptModal: 'c',
        gotRestShowHands: 'd',
        gotRestWinningPlay: 'e'
      });
    const initState = {};
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual('a');
    expect(newState.playerModal).toEqual({"0": "b"});
    expect(newState.promptModal).toEqual({"0": "c"});
    expect(newState.winningPlay).toEqual('e');
    expect(newState.tookPlay).toEqual('e');
    expect(newState.showHands).toEqual(['d']);
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('PLAY_LEAD player does not have rest, user lead play', ()=> {
    const action = {type: actionTypes.PLAY_LEAD};
    const spied = jest.spyOn(gamePlayLogic, 'gotTheRest')
      .mockReturnValue({
        gotRestGameState: '',
        gotRestPlayerModal: '',
        gotRestPromptModal: '',
        gotRestShowHands: '',
        gotRestWinningPlay: ''
      });
    const spiedLeadPlay = jest.spyOn(gamePlayLogic, 'userLeadPlay')
      .mockReturnValue({
        userLeadPlayerModal: 'f',
        userLeadPromptModal: 'g',
        userLeadPlayHands: 'h',
      });
    const initState = {
      dealToPlayer: 0,
      hands: 'a',
      trumpSuit: 'b',
      firstPlay: 'c',
      promptModal: 'd',
      players: 'e',
      tookPlay: 0,
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_USER_PLAY);
    expect(newState.playerModal).toEqual({"0": "f"});
    expect(newState.promptModal).toEqual({"0": "g"});
    expect(newState.hands).toEqual(['h']);
    expect(newState.winningPlay).toEqual(0);
    expect(spied).toHaveBeenCalledWith(initState);
    expect(spiedLeadPlay).toHaveBeenCalledWith('a', 'b', 'c', 'd', 'e');
  });
  test('PLAY_LEAD player does not have rest, computer lead play', ()=> {
    const action = {type: actionTypes.PLAY_LEAD};
    const spied = jest.spyOn(gamePlayLogic, 'gotTheRest')
      .mockReturnValue({
        gotRestGameState: '',
        gotRestPlayerModal: '',
        gotRestPromptModal: '',
        gotRestShowHands: '',
        gotRestWinningPlay: ''
      });
    const spiedLeadPlay = jest.spyOn(gamePlayLogic, 'computerLeadPlay')
      .mockReturnValue({
        computerLeadPlayHands: 'f',
        computerPlayMovingCards: 'g'
      });
    const initState = {
      dealToPlayer: 1,
      hands: 'a',
      trumpSuit: 'b',
      firstPlay: 'c',
      promptModal: 'd',
      players: 'e',
      tookPlay: 1,
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.CARD_TO_PLAY_PILE);
    expect(newState.hands).toEqual(['f']);
    expect(newState.movingCards).toEqual(['g']);
    expect(newState.winningPlay).toEqual(1);
    expect(spied).toHaveBeenCalledWith(initState);
    expect(spiedLeadPlay).toHaveBeenCalledWith(initState);
  });
  test('PLAY_FOLLOW display play winner', ()=> {
    const action = {type: actionTypes.PLAY_FOLLOW};
    const spied = jest.spyOn(gamePlayLogic, 'displayPlayWinner')
      .mockReturnValue({
        calculateWinnerPlayPile: 'i',
        calculateWinnerPromptModal: 'j',
        calculateWinnerOffSuits: 'k',
      });
    const initState = {
      dealToPlayer: 0,
      trumpSuit: 'a',
      players: ['b','c','d'],
      playPile: 'e',
      winningPlay: 'f',
      promptModal: 'g',
      tookPlay: 1,
      offSuits: 'h'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_MOVE_PLAY_PILE_TO_DISCARD);
    expect(newState.playPile).toEqual(['i']);
    expect(newState.promptModal).toEqual({"0": "j"});
    expect(newState.offSuits).toEqual(['k']);
    expect(spied).toHaveBeenCalledWith("a", ["b", "c", "d"], "e", "f", "g", 1, "h");
  });
  test('PLAY_FOLLOW user follow', ()=> {
    const action = {type: actionTypes.PLAY_FOLLOW};
    const spied = jest.spyOn(gamePlayLogic, 'userFollowPlay')
      .mockReturnValue({
        userFollowPlayerModal: 'i',
        userFollowPlayHands: 'j',
      });
    const initState = {
      dealToPlayer: 2,
      hands: 'a',
      trumpSuit: 'b',
      players: ['c','d','e'],
      playPile: 'f',
      winningPlay: 'g',
      tookPlay: 'h'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_USER_PLAY);
    expect(newState.dealToPlayer).toEqual(0);
    expect(newState.playerModal).toEqual({"0": "i"});
    expect(newState.hands).toEqual(['j']);
    expect(spied).toHaveBeenCalledWith( "a", "b", ["c", "d", "e"], "f", "g", "h");
  });
  test('PLAY_FOLLOW computer follow', ()=> {
    const action = {type: actionTypes.PLAY_FOLLOW};
    const spied = jest.spyOn(gamePlayLogic, 'computerFollowPlay')
      .mockReturnValue({
        computerFollowHands: 'a',
        computerFollowMovingCards: 'b'
      });
    const initState = {
      dealToPlayer: 1,
      players: ['c','d','e'],
      tookPlay: 0,
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.CARD_TO_PLAY_PILE);
    expect(newState.dealToPlayer).toEqual(2);
    expect(newState.hands).toEqual(['a']);
    expect(newState.movingCards).toEqual(['b']);
    expect(spied).toHaveBeenCalledWith( initState, 2);
  });
  test('USER_PLAY', ()=> {
    const action = {type: actionTypes.USER_PLAY, cardIndex: 3};
    const spied = jest.spyOn(gamePlayLogic, 'userPlay')
      .mockReturnValue({
        userPlayHands: 'a',
        userPlayMovingCards: 'b',
        userPlayPromptModal: 'c'
      });
    const initState = {};
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.CARD_TO_PLAY_PILE);
    expect(newState.hands).toEqual(['a']);
    expect(newState.movingCards).toEqual(['b']);
    expect(newState.playerModal).toEqual({shown: false});
    expect(newState.promptModal).toEqual({"0": "c"});
    expect(spied).toHaveBeenCalledWith( initState, 3);
  });
  test('RESOLVE_PLAY', ()=> {
    const action = {type: actionTypes.RESOLVE_PLAY};
    const spied = jest.spyOn(gamePlayLogic, 'resolvePlay')
      .mockReturnValue({
        resolveWinningPlay: 'j',
        resolvePromptModal: 'k',
        resolvePlayedCards: 'l'
      });
    const initState = {
      players: 'a',
      playPile: 'b',
      trumpSuit: 'c',
      dealToPlayer: 'd',
      tookPlay: 'e',
      winningPlay: 'f',
      tookBid: 'g',
      bidAmount: 'h',
      playedCards: 'i'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.WAIT_TO_CLEAR_PLAY_PILE);
    expect(newState.winningPlay).toEqual('j');
    expect(newState.promptModal).toEqual('k');
    expect(newState.firstPlay).toEqual(false);
    expect(newState.playedCards).toEqual(['l']);
    expect(spied).toHaveBeenCalledWith(  "a", "b", "c", "d", "e", "f", "g", "h", "i");
  });
  test('MOVE_PLAY_PILE_TO_DISCARD', ()=> {
    const action = {type: actionTypes.MOVE_PLAY_PILE_TO_DISCARD};
    const spied = jest.spyOn(gamePlayLogic, 'movePlayPileToDiscard')
      .mockReturnValue({
        playToDiscardMovingCards: 'a',
        playToDiscardPlayPile: 'b'
      });
    const initState = {};
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.PLAY_PILE_TO_DISCARD);
    expect(newState.playPile).toEqual(['b']);
    expect(newState.movingCards).toEqual(['a']);
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('START_NEXT_PLAY', ()=> {
    const action = {type: actionTypes.START_NEXT_PLAY};
    const spied = jest.spyOn(gamePlayLogic, 'setUpNextPlay')
      .mockReturnValue({
        nextPlayGameState: 'e',
        nextPlayPromptMessage: 'f',
        nextPlayDealToPlayer: 'g'
      });
    const initState = {
      hands: 'a',
      promptModal: 'b',
      tookBid: 'c',
      winningPlay: 'd'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual('e');
    expect(newState.tookPlay).toEqual('d');
    expect(newState.dealToPlayer).toEqual('g');
    expect(newState.promptModal).toEqual({"0": "f"});
    expect(spied).toHaveBeenCalledWith("a", "b", "c", "d");
  });
  test('TALLY_COUNTS', ()=> {
    const action = {type: actionTypes.TALLY_COUNTS};
    const spied = jest.spyOn(gamePlayLogic, 'discardToMeldTally')
      .mockReturnValue({
        tallyMovingCards: 'a',
        tallyDiscardPiles: 'b',
        tallyDealToPlayer: 'c',
        tallyGameState: 'd'
      });
    const initState = {};
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual('d');
    expect(newState.dealToPlayer).toEqual('c');
    expect(newState.movingCards).toEqual(['a']);
    expect(newState.discardPiles).toEqual(['b']);
    expect(spied).toHaveBeenCalledWith(initState);
  });
  test('ADD_COUNT_TO_TALLY', ()=> {
    const action = {type: actionTypes.ADD_COUNT_TO_TALLY};
    const spied = jest.spyOn(gamePlayLogic, 'addCountToTally')
      .mockReturnValue({
        addCountBidModals: 'a',
      });
    const initState = {
      bidModals: 'b',
      melds: 'c',
      tookPlay: 'd',
      dealToPlayer: 'e'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual(GAME_STATE.TALLY_COUNTS);
    expect(newState.bidModals).toEqual(['a']);
    expect(spied).toHaveBeenCalledWith('b', 'c', 'd', 'e');
  });
  test('ADD_COUNT_TO_SCORE', ()=> {
    const action = {type: actionTypes.ADD_COUNT_TO_SCORE};
    const spied = jest.spyOn(gamePlayLogic, 'addCountToScore')
      .mockReturnValue({
        addScorePlayScore: 'i',
        addScorePlayerModal: 'j',
        addScorePromptModal: 'k',
        addScoreGameWon: 'l'
      });
    const spiedNew = jest.spyOn(preBidLogic, 'setGameValuesForNewHand')
      .mockReturnValue({
        newData: 'h'
      });
    const initState = {
      teams: 'a',
      players: 'b',
      playScore: 'c',
      melds: 'd',
      bidModals: 'e',
      tookBid: 'f',
      bidAmount: 'g'
    };
    const newState = gameReducer(initState, action);
    expect(newState.playScore).toEqual(['i']);
    expect(newState.playerModal).toEqual({"0": "j"});
    expect(newState.promptModal).toEqual({"0": "k"});
    expect(newState.gameWon).toEqual('l');
    expect(newState.newData).toEqual('h');
    expect(spied).toHaveBeenCalledWith("a", "b", "c", "d", "e", "f", "g");
    expect(spiedNew).toHaveBeenCalledWith("b");
  });
  test('END_HAND', ()=> {
    const action = {type: actionTypes.END_HAND};
    const spied = jest.spyOn(gamePlayLogic, 'resolveEndHand')
      .mockReturnValue({
        endHandGameState: 'f',
        endHandPlayerModal: 'g',
        endHandPromptModal: 'h',
        endHandDealer: 'i',
        endHandGameWon: 'j'
      });
    const initState = {
      teams: 'a',
      players: 'b',
      playScore: 'c',
      tookBid: 'd',
      dealer: 'e'
    };
    const newState = gameReducer(initState, action);
    expect(newState.gameState).toEqual('f');
    expect(newState.playerModal).toEqual({"0": "g"});
    expect(newState.promptModal).toEqual({"0": "h"});
    expect(newState.dealer).toEqual('i');
    expect(newState.gameWon).toEqual('j');
    expect(spied).toHaveBeenCalledWith("a", "b", "c", "d", "e");
  });
});
