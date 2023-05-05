import * as gamePlayLogic from './gameReducerGamePLayLogic';
import * as helpers from '../../utils/helpers';
import {
  computerFollowPlayOffCounter,
  computerFollowUnplayOffCounter,
  computerFollowResultOffCounter,
  computerFollowUnplayOffNonCounter,
  computerFollowPlayOffNonCounter,
  computerFollowResultOffNonCounter,
  computerFollowPlayOverTrumped,
  computerFollowUnplayOverTrumped,
  computerFollowResultOverTrumped,
  computerFollowPlayNonOverTrump,
  computerFollowUnPlayNonOverTrump,
  computerFollowResultNonOverTrump,
  computerFollowPlayFollowTrump,
  computerFollowUnPlayFollowTrump,
  computerFollowResultFollowTrump,
  computerFollowPlayProjectedWinner,
  computerFollowUnplayProjectedWinner,
  computerFollowResultProjectedWinner,
  computerFollowPlayGiveCounter,
  computerFollowUnplayGiveCounter,
  computerFollowResultGiveCounter,
  computerFollowPlayGiveNonCount,
  computerFollowUnplayGiveNonCount,
  computerFollowResultGiveNonCount
} from './gameReducerGamePlayLogicTestData';
import { Clubs } from '../../components/PlayingCard/svg/Clubs';

describe('gameReducerGamePLayLogic', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('startGamePlay', () => {
    it('Sets up the game for the start of play', () => {
      const spiedGetTrumpBidHeader = jest.spyOn(helpers, 'getTrumpBidHeader').mockReturnValue({'header': 'trumpHeader'});
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const state = {
        trumpSuit: 'H',
        tookBid: 0,
        bidAmount: 28,
        players: ['a', 'b', 'c'],
        melds: [
          [{suit: 'H', value: '9'}],
          [],
          [{suit: 'S', value: 'K'}, {suit: 'S', value: 'Q'}, {suit: 'D', value: 'J'}]
        ]
      };
      const returned = gamePlayLogic.startGamePlay(state);
      expect(JSON.stringify(returned)).toEqual("{\"startMovingCards\":[{\"id\":\"M00toH00\",\"keyId\":\"M00toH00-1\",\"suit\":\"H\",\"value\":\"9\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"M20toH20\",\"keyId\":\"M20toH20-1\",\"suit\":\"S\",\"value\":\"K\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"M21toH21\",\"keyId\":\"M21toH21-1\",\"suit\":\"S\",\"value\":\"Q\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"M22toH22\",\"keyId\":\"M22toH22-1\",\"suit\":\"D\",\"value\":\"J\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]}],\"startGameState\":\"movingMeldCardsBack\",\"startPromptModal\":{\"shown\":true,\"width\":210,\"height\":140,\"message\":{\"type\":\"div\",\"key\":null,\"ref\":null,\"props\":{\"children\":\"\"},\"_owner\":null,\"_store\":{}},\"zoom\":100,\"hasCloseButton\":false,\"header\":\"trumpHeader\",\"hasHeaderSeparator\":false},\"startBidModals\":[{\"shown\":false},{\"shown\":false},{\"shown\":false}],\"startMelds\":[[],[],[]]}");
      expect(spiedGetTrumpBidHeader).toBeCalledTimes(1);
      expect(spiedGetCardLocation).toBeCalledTimes(8);
    });
  });
  describe('moveRestToDiscardPile', () => {
    it('Moves all hand cards to the winners discard pile for user team', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const state = {
        winningPlay: 0,
        players: ['a', 'b', 'c', 'd'],
        tookBid: 0,
        hands: [
          [{suit: 'S', value: 'K'}],
          [{suit: 'H', value: '9'}],
          [{suit: 'D', value: 'J'}],
          [{suit: 'H', value: '9'}]
        ]
      };
      const returned = gamePlayLogic.moveRestToDiscardPile(state);
      expect(returned).toEqual({
        "restDiscardHands": [
          [], [], [], []
        ],
        "restDiscardMovingCards": [
          {"id": "H00toD0", "keyId": "H00toD0-1", "shown": true, "source": ["a"], "speed": 10, "suit": "S", "target": ["a"], "value": "K"},
          {"id": "H10toD0", "keyId": "H10toD0-1", "shown": true, "source": ["a"], "speed": 10, "suit": "H", "target": ["a"], "value": "9"},
          {"id": "H20toD0", "keyId": "H20toD0-1", "shown": true, "source": ["a"], "speed": 10, "suit": "D", "target": ["a"], "value": "J"},
          {"id": "H30toD0", "keyId": "H30toD0-1", "shown": true, "source": ["a"], "speed": 10, "suit": "H", "target": ["a"], "value": "9"}
        ],
        "restDiscardShowHands": [true, false, false, false]
      });
      expect(spiedGetCardLocation).toBeCalledTimes(8);
    });
    it('Moves all hand cards to the winners discard pile for non-user team', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const state = {
        winningPlay: 1,
        players: ['a', 'b', 'c', 'd'],
        tookBid: 0,
        hands: [
          [{suit: 'S', value: 'K'}],
          [{suit: 'H', value: '9'}],
          [{suit: 'D', value: 'J'}],
          [{suit: 'H', value: '9'}]
        ]
      };
      const returned = gamePlayLogic.moveRestToDiscardPile(state);
      expect(returned).toEqual( {
        "restDiscardHands": [[],[],[],[]],
        "restDiscardMovingCards": [
          {"id": "H00toD1", "keyId": "H00toD1-1", "shown": true, "source": ["a"], "speed": 10, "suit": "S", "target": ["a"], "value": "K"},
          {"id": "H10toD1", "keyId": "H10toD1-1", "shown": true, "source": ["a"], "speed": 10, "suit": "H", "target": ["a"], "value": "9"},
          {"id": "H20toD1", "keyId": "H20toD1-1", "shown": true, "source": ["a"], "speed": 10, "suit": "D", "target": ["a"], "value": "J"},
          {"id": "H30toD1", "keyId": "H30toD1-1", "shown": true, "source": ["a"], "speed": 10, "suit": "H", "target": ["a"], "value": "9"}
        ],
        "restDiscardShowHands": [true, false, false, false]
      });
      expect(spiedGetCardLocation).toBeCalledTimes(8);
    });
  });
  describe('gotTheRest', () => {
    it('No player has the rest', () => {
      const state = {
        promptModal: {},
        players: ['a', 'b', 'c', 'd'],
        hands: [
          [{suit: 'S', value: 'K'}],
          [{suit: 'H', value: '9'}],
          [{suit: 'D', value: 'J'}],
          [{suit: 'H', value: '9'}]
        ],
        tookBid: 0,
        discardPiles: [
          [{suit: 'S', value: 'K'},{suit: 'S', value: 'K'},{suit: 'S', value: 'K'},{suit: 'S', value: 'K'}],
          [],
          [],
          []
        ],
        playedCards: [],
        trumpSuit: 'S'
      };
      const returned = gamePlayLogic.gotTheRest(state);
      expect(returned).toEqual({
        "gotRestGameState": "",
        "gotRestPlayerModal": {"shown": false},
        "gotRestPromptModal": {},
        "gotRestShowHands": [],
        "gotRestWinningPlay": -1
      });
    });
    it('Bidder has the rest', () => {
      const state = {
        promptModal: {},
        players: ['a', 'b', 'c', 'd'],
        hands: [
          [{suit: 'S', value: 'K'}],
          [{suit: 'H', value: '9'}],
          [{suit: 'D', value: 'J'}],
          [{suit: 'H', value: '9'}]
        ],
        tookBid: 0,
        discardPiles: [
          [{suit: 'S', value: 'K'},{suit: 'S', value: 'K'},{suit: 'S', value: 'K'},{suit: 'S', value: 'K'}],
          [],
          [],
          []
        ],
        playedCards: [
          [
            {suit: 'S', value: 'A'},
            {suit: 'S', value: 'A'},
            {suit: 'S', value: '10'},
            {suit: 'S', value: '10'},
            {suit: 'S', value: 'K'},
            {suit: 'S', value: 'K'},
            {suit: 'S', value: 'Q'},
            {suit: 'S', value: 'Q'},
            {suit: 'S', value: 'J'},
            {suit: 'S', value: 'J'},
            {suit: 'S', value: '9'},
            {suit: 'S', value: '9'},
          ],
          [],
          [],
          [],
        ],
        trumpSuit: 'S'
      };
      const returned = gamePlayLogic.gotTheRest(state);
      expect(returned).toEqual( {
        "gotRestGameState": "gotRestContinue",
        "gotRestPlayerModal": {
          "buttons": [
            {"label": "Continue", "returnMessage": "winRestContinue"}
          ],
          "hasBox": true,
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 105,
          "message": <div><span><b>a</b> wins the rest</span></div>,
          "shown": true,
          "width": 400,
          "zoom": 100
        },
        "gotRestPromptModal": {
          "message": <span><b>a</b> wins rest</span>
        },
        "gotRestShowHands": [true, true, true, true],
        "gotRestWinningPlay": 0
      });
    });
    it('Non-bidder has the rest', () => {
      const state = {
        promptModal: {},
        players: ['a', 'b', 'c', 'd'],
        hands: [
          [{suit: 'S', value: 'K'}],
          [{suit: 'H', value: '9'}],
          [{suit: 'D', value: 'J'}],
          [{suit: 'H', value: '9'}]
        ],
        tookBid: 1,
        discardPiles: [
          [{suit: 'S', value: 'K'},{suit: 'S', value: 'K'},{suit: 'S', value: 'K'},{suit: 'S', value: 'K'}],
          [],
          [],
          []
        ],
        playedCards: [
          [
            {suit: 'S', value: 'A'},
            {suit: 'S', value: 'A'},
            {suit: 'S', value: '10'},
            {suit: 'S', value: '10'},
            {suit: 'S', value: 'K'},
            {suit: 'S', value: 'K'},
            {suit: 'S', value: 'Q'},
            {suit: 'S', value: 'Q'},
            {suit: 'S', value: 'J'},
            {suit: 'S', value: 'J'},
            {suit: 'S', value: '9'},
            {suit: 'S', value: '9'},
          ],
          [],
          [],
          [],
        ],
        trumpSuit: 'S'
      };
      const returned = gamePlayLogic.gotTheRest(state);
      expect(returned).toEqual( {
        "gotRestGameState": "gotRestContinue",
        "gotRestPlayerModal": {
          "buttons": [
            {"label": "Continue", "returnMessage": "winRestContinue"}
          ],
          "hasBox": true,
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 105,
          "message": <div><span><b>a</b> wins the rest</span></div>,
          "shown": true,
          "width": 400,
          "zoom": 100
        },
        "gotRestPromptModal": {
          "message": <span><b>a</b> wins rest</span>
        },
        "gotRestShowHands": [true, true, true, true],
        "gotRestWinningPlay": 0
      });
    });
  });
  describe('userLeadPlay', () => {
    it('Format user hand for cards that can be played as a lead, for first play', () => {
      const hands = [[
        {suit: 'H', value: '9'},
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'Q'},
        {suit: 'D', value: '9'},
      ]];
      const returned = gamePlayLogic.userLeadPlay(hands, 'S', true, {}, ['a','b','c','d']);
      expect(returned).toEqual( {
        "userLeadPlayHands": [
          [
            {"active": false, "clickable": false, "rolloverColor": "", "shown": true, "suit": "H", "value": "9"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "A"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "Q"},
            {"active": false, "clickable": false, "rolloverColor": "", "shown": true, "suit": "D", "value": "9"}
          ]
        ],
        "userLeadPlayerModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 40,
          "message": <div>You must lead trump suit on first play</div>,
          "shown": true,
          "width": 425,
          "zoom": 100
        },
        "userLeadPromptModal": {
          "message": <span><b>a</b> lead play</span>
        }
      });
    });
    it('Format user hand for cards that can be played as a lead, for non-first play', () => {
      const hands = [[
        {suit: 'H', value: '9'},
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'Q'},
        {suit: 'D', value: '9'},
      ]];
      const returned = gamePlayLogic.userLeadPlay(hands, 'S', false, {}, ['a','b','c','d']);
      expect(returned).toEqual( {
        "userLeadPlayHands": [
          [
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "H", "value": "9"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "A"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "Q"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "D", "value": "9"}
          ]
        ],
        "userLeadPlayerModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 40,
          "message": <div>You took the play, please led a card</div>,
          "shown": true,
          "width": 425,
          "zoom": 100
        },
        "userLeadPromptModal": {
          "message": <span><b>a</b> lead play</span>
        }
      });
    });
  });
  describe('userFollowPlay', () => {
    it('Follow play set up for user for trump suit where it can be beat', () => {
      const hands = [[
        {suit: 'H', value: '9'},
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'Q'},
        {suit: 'S', value: '9'},
      ]];
      const playPile = [null, null,{suit: 'S', value: '9'},{suit: 'S', value: 'J'}];
      const returned = gamePlayLogic.userFollowPlay(
        hands,
        'S',
        ['a','b','c','d'],
        playPile,
        2,
        2
      );
      expect(returned).toEqual( {
        "userFollowPlayHands": [
          [
            {"active": false, "clickable": false, "rolloverColor": "", "shown": true, "suit": "H", "value": "9"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "A"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "Q"},
            {"active": false, "clickable": false, "rolloverColor": "", "shown": true, "suit": "S", "value": "9"}
          ]
        ],
        "userFollowPlayerModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 40,
          "message": <div>You must play higher trump if you can</div>,
          "shown": true,
          "width": 425,
          "zoom": 100
        }
      });
    });
    it('Follow play set up for user for trump suit where it can not be beat', () => {
      const hands = [[
        {suit: 'H', value: '9'},
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'Q'},
        {suit: 'S', value: '9'},
      ]];
      const playPile = [null, null,{suit: 'S', value: 'A'},{suit: 'S', value: 'J'}];
      const returned = gamePlayLogic.userFollowPlay(
        hands,
        'S',
        ['a','b','c','d'],
        playPile,
        2,
        2
      );
      expect(returned).toEqual( {
        "userFollowPlayHands": [
          [
            {"active": false, "clickable": false, "rolloverColor": "", "shown": true, "suit": "H", "value": "9"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "A"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "Q"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "9"}
          ]
        ],
        "userFollowPlayerModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 40,
          "message": <div>You must play higher trump if you can</div>,
          "shown": true,
          "width": 425,
          "zoom": 100
        }
      });
    });
    it('Follow play set up for user when must trump', () => {
      const hands = [[
        {suit: 'H', value: '9'},
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'Q'},
        {suit: 'S', value: '9'},
      ]];
      const playPile = [null, null,{suit: 'D', value: 'A'},{suit: 'D', value: 'J'}];
      const returned = gamePlayLogic.userFollowPlay(
        hands,
        'S',
        ['a','b','c','d'],
        playPile,
        2,
        2
      );
      expect(returned).toEqual( {
        "userFollowPlayHands": [
          [
            {"active": false, "clickable": false, "rolloverColor": "", "shown": true, "suit": "H", "value": "9"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "A"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "Q"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "9"}
          ]
        ],
        "userFollowPlayerModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 40,
          "message": <div>You must play trump if off suit</div>,
          "shown": true,
          "width": 425,
          "zoom": 100
        }
      });
    });
    it('Follow play set up for user when must follow lead suit', () => {
      const hands = [[
        {suit: 'H', value: '9'},
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'Q'},
        {suit: 'S', value: '9'},
      ]];
      const playPile = [null, null,{suit: 'H', value: 'A'},{suit: 'H', value: 'J'}];
      const returned = gamePlayLogic.userFollowPlay(
        hands,
        'S',
        ['a','b','c','d'],
        playPile,
        2,
        2
      );
      expect(returned).toEqual(  {
        "userFollowPlayHands": [
          [
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "H", "value": "9"},
            {"active": false, "clickable": false, "rolloverColor": "", "shown": true, "suit": "S", "value": "A"},
            {"active": false, "clickable": false, "rolloverColor": "", "shown": true, "suit": "S", "value": "Q"},
            {"active": false, "clickable": false, "rolloverColor": "", "shown": true, "suit": "S", "value": "9"}
          ]
        ],
        "userFollowPlayerModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": expect.any(Object),
          "shown": false,
          "width": 210,
          "zoom": 100
        }
      });
    });
    it('Follow play set up for user when can play any card because off suit with no trump', () => {
      const hands = [[
        {suit: 'H', value: '9'},
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'Q'},
        {suit: 'S', value: '9'},
      ]];
      const playPile = [null, null,{suit: 'D', value: 'A'},{suit: 'D', value: 'J'}];
      const returned = gamePlayLogic.userFollowPlay(
        hands,
        'C',
        ['a','b','c','d'],
        playPile,
        2,
        2
      );
      expect(returned).toEqual(  {
        "userFollowPlayHands": [
          [
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "H", "value": "9"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "A"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "Q"},
            {"active": true, "clickable": true, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "9"}
          ]
        ],
        "userFollowPlayerModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 40,
          "message": <div>Off suit and trump, play any card</div>,
          "shown": true,
          "width": 425,
          "zoom": 100
        }
      });
    });
  });
  describe('userPlay', () => {
    it('Executing user play', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const state = {
        promptModal: {},
        hands: [
          [
            {suit: 'H', value: '9'},
            {suit: 'S', value: 'A'},
            {suit: 'S', value: 'Q'},
            {suit: 'S', value: '9'},
          ]
        ]
      };
      const returned = gamePlayLogic.userPlay(state, 1);
      expect(JSON.stringify(returned)).toEqual( "{\"userPlayHands\":[[{\"suit\":\"H\",\"value\":\"9\",\"active\":true,\"clickable\":false,\"rolloverColor\":\"\"},{\"suit\":\"S\",\"value\":\"Q\",\"active\":true,\"clickable\":false,\"rolloverColor\":\"\"},{\"suit\":\"S\",\"value\":\"9\",\"active\":true,\"clickable\":false,\"rolloverColor\":\"\"}]],\"userPlayMovingCards\":[{\"id\":\"H01toP0\",\"keyId\":\"H01toP0-1\",\"suit\":\"S\",\"value\":\"A\",\"shown\":true,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]}],\"userPlayPromptModal\":{\"message\":\"\"}}");
      expect(spiedGetCardLocation).toBeCalledTimes(2);
    });
  });
  describe('computerLeadPlay', () => {
    const defaultState = {
      hands: [[], [], []],
      tookPlay: 1,
      tookBid: 1,
      players: ['a','b','c'],
      discardPiles: [[], [{suit: 'H', value: 'Q'},{suit: 'H', value: 'J'},{suit: 'H', value: '9'}], []],
      playedCards: [[],[],[]],
      offSuits: [[],[],[]],
      trumpSuit: 'S',
      firstPlay: false,
      seenCards: []
    };
    it('Pick computer lead card for first play with power', () => {
      const spiedThrowCardIntoMiddle = jest.spyOn(helpers, 'throwCardIntoMiddle').mockReturnValue('card');
      const computerHand = [
        {suit: 'H', value: '9'},
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'Q'},
        {suit: 'S', value: '9'},
      ];
      const state = {
        ...defaultState,
        hands: [[], computerHand, []],
        firstPlay: true,
      };
      const returned = gamePlayLogic.computerLeadPlay(state);
      expect(returned).toEqual({
        "computerLeadPlayHands": [
          [],
          [{"suit": "H", "value": "9"},
            {"suit": "S", "value": "Q"},
            {"suit": "S", "value": "9"}
          ],
          []
        ],
        "computerPlayMovingCards": ["card"]
      });
      expect(spiedThrowCardIntoMiddle).toHaveBeenCalledTimes(1);
    });
    it('Pick computer lead card for first play without power', () => {
      const spiedThrowCardIntoMiddle = jest.spyOn(helpers, 'throwCardIntoMiddle').mockReturnValue('card');
      const computerHand = [
        {suit: 'H', value: '9'},
        {suit: 'S', value: 'K'},
        {suit: 'S', value: 'Q'},
        {suit: 'S', value: '9'},
      ];
      const state = {
        ...defaultState,
        hands: [[], computerHand, []],
        firstPlay: true,
      };
      const returned = gamePlayLogic.computerLeadPlay(state);
      expect(returned).toEqual({
        "computerLeadPlayHands": [
          [],
          [
            {"suit": "H", "value": "9"},
            {"suit": "S", "value": "K"},
            {"suit": "S", "value": "9"}
          ],
          []
        ],
        "computerPlayMovingCards": ["card"]
      });
      expect(spiedThrowCardIntoMiddle).toHaveBeenCalledTimes(1);
    });
    it('Pick computer lead card for non-first play to control trump', () => {
      const spiedThrowCardIntoMiddle = jest.spyOn(helpers, 'throwCardIntoMiddle').mockReturnValue('card');
      const spiedGetWinningCards = jest.spyOn(helpers, 'getWinningCards').mockReturnValue([
        {suit: 'S', value: 'A'}
      ]);
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards').mockReturnValue([
        {suit: 'S', value: '9'}
      ]);
      const computerHand = [
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'K'},
        {suit: 'S', value: 'Q'},
        {suit: 'D', value: '9'},
        {suit: 'D', value: '9'},
      ];
      const state = {
        ...defaultState,
        hands: [[], computerHand, []],
      };
      const returned = gamePlayLogic.computerLeadPlay(state);
      expect(returned).toEqual({
        "computerLeadPlayHands": [
          [],
          [
            {"suit": "S", "value": "K"},
            {"suit": "S", "value": "Q"},
            {"suit": "D", "value": "9"},
            {"suit": "D", "value": "9"}
          ],
          []
        ],
        "computerPlayMovingCards": ["card"]
      });
      expect(spiedThrowCardIntoMiddle).toHaveBeenCalledTimes(1);
      expect(spiedGetWinningCards).toHaveBeenCalledTimes(1);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
    });
    it('Pick computer lead card for non-first play non-trump winner', () => {
      const spiedThrowCardIntoMiddle = jest.spyOn(helpers, 'throwCardIntoMiddle').mockReturnValue('card');
      const spiedGetWinningCards = jest.spyOn(helpers, 'getWinningCards').mockReturnValue([
        {suit: 'D', value: 'A'}
      ]);
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards').mockReturnValue([
        {suit: 'S', value: '9'}
      ]);
      const computerHand = [
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'K'},
        {suit: 'S', value: 'Q'},
        {suit: 'D', value: 'A'},
        {suit: 'D', value: '9'},
      ];
      const state = {
        ...defaultState,
        hands: [[], computerHand, []],
      };
      const returned = gamePlayLogic.computerLeadPlay(state);
      expect(returned).toEqual({
        "computerLeadPlayHands": [
          [],
          [
            {"suit": "S", "value": "A"},
            {"suit": "S", "value": "K"},
            {"suit": "S", "value": "Q"},
            {"suit": "D", "value": "9"}
          ],
          []
        ],
        "computerPlayMovingCards": ["card"]
      });
      expect(spiedThrowCardIntoMiddle).toHaveBeenCalledTimes(1);
      expect(spiedGetWinningCards).toHaveBeenCalledTimes(1);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
    });
    it('Pick computer lead card for non-first play 3 handed loser pulling trump', () => {
      const spiedThrowCardIntoMiddle = jest.spyOn(helpers, 'throwCardIntoMiddle').mockReturnValue('card');
      const spiedGetWinningCards = jest.spyOn(helpers, 'getWinningCards').mockReturnValue([]);
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards').mockReturnValue([
        {suit: 'S', value: '9'}
      ]);
      const spiedGetTrumpPullingSuits = jest.spyOn(helpers, 'getTrumpPullingSuits').mockReturnValue(['D']);
      const computerHand = [
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'K'},
        {suit: 'S', value: 'Q'},
        {suit: 'D', value: '9'},
      ];
      const state = {
        ...defaultState,
        hands: [[], computerHand, []],
      };
      const returned = gamePlayLogic.computerLeadPlay(state);
      expect(returned).toEqual({
        "computerLeadPlayHands": [
          [],
          [
            {"suit": "S", "value": "A"},
            {"suit": "S", "value": "K"},
            {"suit": "S", "value": "Q"}
          ],
          []
        ],
        "computerPlayMovingCards": ["card"]
      });
      expect(spiedThrowCardIntoMiddle).toHaveBeenCalledTimes(1);
      expect(spiedGetWinningCards).toHaveBeenCalledTimes(1);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
      expect(spiedGetTrumpPullingSuits).toHaveBeenCalledTimes(1);
    });
    it('Pick computer lead card for non-first play 4 handed loser pulling trump', () => {
      const spiedThrowCardIntoMiddle = jest.spyOn(helpers, 'throwCardIntoMiddle').mockReturnValue('card');
      const spiedGetWinningCards = jest.spyOn(helpers, 'getWinningCards').mockReturnValue([]);
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards').mockReturnValue([
        {suit: 'S', value: '9'}
      ]);
      const spiedGetTrumpPullingSuits = jest.spyOn(helpers, 'getTrumpPullingSuits').mockReturnValue(['D']);
      const computerHand = [
        {suit: 'S', value: 'A'},
        {suit: 'S', value: 'K'},
        {suit: 'S', value: 'Q'},
        {suit: 'D', value: '9'},
      ];
      const state = {
        ...defaultState,
        hands: [[], computerHand, []],
        tookBid: 0,
        tookPlay: 1,
        players: ['a','b','c','d'],
      };
      const returned = gamePlayLogic.computerLeadPlay(state);
      expect(returned).toEqual({
        "computerLeadPlayHands": [
          [],
          [
            {"suit": "S", "value": "A"},
            {"suit": "S", "value": "K"},
            {"suit": "S", "value": "Q"}
          ],
          []
        ],
        "computerPlayMovingCards": ["card"]
      });
      expect(spiedThrowCardIntoMiddle).toHaveBeenCalledTimes(1);
      expect(spiedGetWinningCards).toHaveBeenCalledTimes(1);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
      expect(spiedGetTrumpPullingSuits).toHaveBeenCalledTimes(1);
    });
    it('Pick computer lead card for non-first play loser pulling trump with trump', () => {
      const spiedThrowCardIntoMiddle = jest.spyOn(helpers, 'throwCardIntoMiddle').mockReturnValue('card');
      const spiedGetWinningCards = jest.spyOn(helpers, 'getWinningCards').mockReturnValue([]);
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards').mockReturnValue([
        {suit: 'S', value: 'A'}
      ]);
      const spiedGetTrumpPullingSuits = jest.spyOn(helpers, 'getTrumpPullingSuits').mockReturnValue([]);
      const computerHand = [
        {suit: 'S', value: 'J'},
        {suit: 'S', value: 'K'},
        {suit: 'S', value: 'Q'},
        {suit: 'D', value: '9'},
      ];
      const state = {
        ...defaultState,
        hands: [[], computerHand, []],
      };
      const returned = gamePlayLogic.computerLeadPlay(state);
      expect(returned).toEqual({
        "computerLeadPlayHands": [
          [],
          [
            {"suit": "S", "value": "J"},
            {"suit": "S", "value": "K"},
            {"suit": "D", "value": "9"}
          ],
          []
        ],
        "computerPlayMovingCards": ["card"]
      });
      expect(spiedThrowCardIntoMiddle).toHaveBeenCalledTimes(1);
      expect(spiedGetWinningCards).toHaveBeenCalledTimes(1);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
      expect(spiedGetTrumpPullingSuits).toHaveBeenCalledTimes(1);
    });
    it('Pick computer lead card for non-first play loser pass to partner', () => {
      const spiedThrowCardIntoMiddle = jest.spyOn(helpers, 'throwCardIntoMiddle').mockReturnValue('card');
      const spiedGetWinningCards = jest.spyOn(helpers, 'getWinningCards').mockReturnValue([]);
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards').mockReturnValue([
        {suit: 'S', value: 'A'}
      ]);
      const spiedGetPartnerPassSuits = jest.spyOn(helpers, 'getPartnerPassSuits').mockReturnValue(['D']);
      const computerHand = [
        {suit: 'S', value: 'J'},
        {suit: 'S', value: 'K'},
        {suit: 'S', value: 'Q'},
        {suit: 'D', value: '9'},
      ];
      const state = {
        ...defaultState,
        hands: [[], computerHand, []],
        players: ['a','b','c','d'],
        trumpSuit: 'H'
      };
      const returned = gamePlayLogic.computerLeadPlay(state);
      expect(returned).toEqual({
        "computerLeadPlayHands": [
          [],
          [
            {"suit": "S", "value": "J"},
            {"suit": "S", "value": "K"},
            {"suit": "S", "value": "Q"}
          ],
          []
        ],
        "computerPlayMovingCards": ["card"]
      });
      expect(spiedThrowCardIntoMiddle).toHaveBeenCalledTimes(1);
      expect(spiedGetWinningCards).toHaveBeenCalledTimes(1);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
      expect(spiedGetPartnerPassSuits).toHaveBeenCalledTimes(1);
    });
    it('Pick computer lead card for non-first play lowest loser', () => {
      const spiedThrowCardIntoMiddle = jest.spyOn(helpers, 'throwCardIntoMiddle').mockReturnValue('card');
      const spiedGetWinningCards = jest.spyOn(helpers, 'getWinningCards').mockReturnValue([]);
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards').mockReturnValue([
        {suit: 'S', value: 'A'}
      ]);
      const spiedGetPartnerPassSuits = jest.spyOn(helpers, 'getPartnerPassSuits').mockReturnValue([]);
      const computerHand = [
        {suit: 'S', value: 'J'},
        {suit: 'S', value: 'K'},
        {suit: 'S', value: 'Q'},
        {suit: 'D', value: '9'},
      ];
      const state = {
        ...defaultState,
        hands: [[], computerHand, []],
        players: ['a','b','c','d'],
        trumpSuit: 'H'
      };
      const returned = gamePlayLogic.computerLeadPlay(state);
      expect(returned).toEqual({
        "computerLeadPlayHands": [
          [],
          [
            {"suit": "S", "value": "J"},
            {"suit": "S", "value": "K"},
            {"suit": "S", "value": "Q"}
          ],
          []
        ],
        "computerPlayMovingCards": ["card"]
      });
      expect(spiedThrowCardIntoMiddle).toHaveBeenCalledTimes(1);
      expect(spiedGetWinningCards).toHaveBeenCalledTimes(1);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
      expect(spiedGetPartnerPassSuits).toHaveBeenCalledTimes(1);
    });
  });
  describe('computerFollowPlay', () => {
    it('Pick computer follow card for off suit counter needed', () => {
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards')
        .mockReturnValue(computerFollowUnplayOffCounter);
      const returned = gamePlayLogic.computerFollowPlay(computerFollowPlayOffCounter, 1);
      expect(JSON.stringify(returned)).toEqual(computerFollowResultOffCounter);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
    });
    it('Pick computer follow card for off suit non-counter needed', () => {
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards')
        .mockReturnValue(computerFollowUnplayOffNonCounter);
      const returned = gamePlayLogic.computerFollowPlay(computerFollowPlayOffNonCounter, 1);
      expect(JSON.stringify(returned)).toEqual(computerFollowResultOffNonCounter);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
    });
    it('Pick computer follow card to over trump the current trump', () => {
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards')
        .mockReturnValue(computerFollowUnplayOverTrumped);
      const returned = gamePlayLogic.computerFollowPlay(computerFollowPlayOverTrumped, 1);
      expect(JSON.stringify(returned)).toEqual(computerFollowResultOverTrumped);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
    });
    it('Pick computer follow card to not over trump the current trump', () => {
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards')
        .mockReturnValue(computerFollowUnPlayNonOverTrump);
      const returned = gamePlayLogic.computerFollowPlay(computerFollowPlayNonOverTrump, 2);
      expect(JSON.stringify(returned)).toEqual(computerFollowResultNonOverTrump);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
    });
    it('Pick computer follow card to follow trump', () => {
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards')
        .mockReturnValue(computerFollowUnPlayFollowTrump);
      const returned = gamePlayLogic.computerFollowPlay(computerFollowPlayFollowTrump, 1);
      expect(JSON.stringify(returned)).toEqual(computerFollowResultFollowTrump);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
    });
    it('Pick computer follow card to play projected winner', () => {
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards')
        .mockReturnValue(computerFollowUnplayProjectedWinner);
      const spiedGetWinningCards = jest.spyOn(helpers, 'getWinningCards')
        .mockReturnValue([{"suit":"H","value":"A"},{"suit":"D","value":"A"}]);
      const returned = gamePlayLogic.computerFollowPlay(computerFollowPlayProjectedWinner, 1);
      expect(JSON.stringify(returned)).toEqual(computerFollowResultProjectedWinner);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
      expect(spiedGetWinningCards).toHaveBeenCalledTimes(1);
    });
    it('Pick computer follow card to throw counter', () => {
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards')
        .mockReturnValue(computerFollowUnplayGiveCounter);
      const spiedGetWinningCards = jest.spyOn(helpers, 'getWinningCards')
        .mockReturnValue([]);
      const returned = gamePlayLogic.computerFollowPlay(computerFollowPlayGiveCounter, 2);
      expect(JSON.stringify(returned)).toEqual(computerFollowResultGiveCounter);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
      expect(spiedGetWinningCards).toHaveBeenCalledTimes(1);
    });
    it('Pick computer follow card to throw non-counter', () => {
      const spiedGetUnplayedCards = jest.spyOn(helpers, 'getUnplayedCards')
        .mockReturnValue(computerFollowUnplayGiveNonCount);
      const spiedGetWinningCards = jest.spyOn(helpers, 'getWinningCards')
        .mockReturnValue([]);
      const returned = gamePlayLogic.computerFollowPlay(computerFollowPlayGiveNonCount, 2);
      expect(JSON.stringify(returned)).toEqual(computerFollowResultGiveNonCount);
      expect(spiedGetUnplayedCards).toHaveBeenCalledTimes(1);
      expect(spiedGetWinningCards).toHaveBeenCalledTimes(1);
    });
  });
  describe('resolvePlay', () => {
    it('Current player wins with on suit higher card', () => {
      const spiedGetTrumpBidHeader = jest.spyOn(helpers, 'getTrumpBidHeader')
        .mockReturnValue({'header': 'trumpHeader'});
      const spiedGetHandLeaderMessage = jest.spyOn(helpers, 'getHandLeaderMessage')
        .mockReturnValue('HandLeaderMessage');
      const returned = gamePlayLogic.resolvePlay(
        ['a','b','c'],
        [{suit: 'C', value: 'Q'}, {suit: 'C', value: 'A'}, null],
        'H',
        1,
        0,
        0,
        0,
        28,
        [[],[],[]]
      );
      expect(returned).toEqual({
        "resolvePlayedCards": [
          [],
          [
            {"suit": "C", "value": "A"}
          ],
          []
        ],
        "resolvePromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "trumpHeader",
          "height": 140,
          "message": <div>HandLeaderMessage</div>,
          "shown": true,
          "width": 210,
          "zoom": 100
        },
        "resolveWinningPlay": 1
      });
      expect(spiedGetTrumpBidHeader).toHaveBeenCalledTimes(1);
      expect(spiedGetHandLeaderMessage).toHaveBeenCalledTimes(1);
    });
    it('Current player wins with trump', () => {
      const spiedGetTrumpBidHeader = jest.spyOn(helpers, 'getTrumpBidHeader')
        .mockReturnValue({'header': 'trumpHeader'});
      const spiedGetHandLeaderMessage = jest.spyOn(helpers, 'getHandLeaderMessage')
        .mockReturnValue('HandLeaderMessage');
      const returned = gamePlayLogic.resolvePlay(
        ['a','b','c'],
        [{suit: 'C', value: 'A'}, {suit: 'H', value: '9'}, null],
        'H',
        1,
        0,
        0,
        0,
        28,
        [[],[],[]]
      );
      expect(returned).toEqual({
        "resolvePlayedCards": [
          [],
          [
            {"suit": "H", "value": "9"}
          ],
          []
        ],
        "resolvePromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "trumpHeader",
          "height": 140,
          "message": <div>HandLeaderMessage</div>,
          "shown": true,
          "width": 210,
          "zoom": 100
        },
        "resolveWinningPlay": 1
      });
      expect(spiedGetTrumpBidHeader).toHaveBeenCalledTimes(1);
      expect(spiedGetHandLeaderMessage).toHaveBeenCalledTimes(1);
    });
    it('Current player loses with lower card in suit', () => {
      const spiedGetTrumpBidHeader = jest.spyOn(helpers, 'getTrumpBidHeader')
        .mockReturnValue({'header': 'trumpHeader'});
      const spiedGetHandLeaderMessage = jest.spyOn(helpers, 'getHandLeaderMessage')
        .mockReturnValue('HandLeaderMessage');
      const returned = gamePlayLogic.resolvePlay(
        ['a','b','c'],
        [{suit: 'C', value: 'A'}, {suit: 'C', value: '9'}, null],
        'H',
        1,
        0,
        0,
        0,
        28,
        [[],[],[]]
      );
      expect(returned).toEqual({
        "resolvePlayedCards": [
          [],
          [
            {"suit": "C", "value": "9"}
          ],
          []
        ],
        "resolvePromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "trumpHeader",
          "height": 140,
          "message": <div>HandLeaderMessage</div>,
          "shown": true,
          "width": 210,
          "zoom": 100
        },
        "resolveWinningPlay": 0
      });
      expect(spiedGetTrumpBidHeader).toHaveBeenCalledTimes(1);
      expect(spiedGetHandLeaderMessage).toHaveBeenCalledTimes(1);
    });
    it('Current player loses off suit', () => {
      const spiedGetTrumpBidHeader = jest.spyOn(helpers, 'getTrumpBidHeader')
        .mockReturnValue({'header': 'trumpHeader'});
      const spiedGetHandLeaderMessage = jest.spyOn(helpers, 'getHandLeaderMessage')
        .mockReturnValue('HandLeaderMessage');
      const returned = gamePlayLogic.resolvePlay(
        ['a','b','c'],
        [{suit: 'C', value: 'J'}, {suit: 'S', value: 'A'}, null],
        'H',
        1,
        0,
        0,
        0,
        28,
        [[],[],[]]
      );
      expect(returned).toEqual({
        "resolvePlayedCards": [
          [],
          [
            {"suit": "S", "value": "A"}
          ],
          []
        ],
        "resolvePromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "trumpHeader",
          "height": 140,
          "message": <div>HandLeaderMessage</div>,
          "shown": true,
          "width": 210,
          "zoom": 100
        },
        "resolveWinningPlay": 0
      });
      expect(spiedGetTrumpBidHeader).toHaveBeenCalledTimes(1);
      expect(spiedGetHandLeaderMessage).toHaveBeenCalledTimes(1);
    });
  });
  describe('displayPlayWinner', () => {
    it('Calculates and displays winner', () => {
      const returned = gamePlayLogic.displayPlayWinner(
        'H',
        ['a', 'b', 'c'],
        [{suit: 'C', value: 'A'}, {suit: 'C', value: '9'}, {suit: 'S', value: '9'}],
        0,
        {},
        0,
        [[],[],[]]
      );
      expect(returned).toEqual({
        "calculateWinnerOffSuits": [
          [],
          [],
          ["C"]
        ],
        "calculateWinnerPlayPile": [
          {"frontColor": "#eea", "suit": "C", "value": "A"},
          {"suit": "C", "value": "9"},
          {"suit": "S", "value": "9"}
        ],
        "calculateWinnerPromptModal": {
          "message": <div style={{"display": "inline-flex"}}><b>a</b> wins <b>A</b><span style={{"display": "inline-flex", "width": 24}}><Clubs /></span></div>
        }
      });
    });
  });
  describe('setUpNextPlay', () => {
    it('Sets up next play', () => {
      const returned = gamePlayLogic.setUpNextPlay(
        [[{value:'A', suit: 'S'}], [], []],
        {},
        0,
        0
      );
      expect(returned).toEqual({
        "nextPlayDealToPlayer": 0,
        "nextPlayGameState": "startNextPlay",
        "nextPlayPromptMessage": {}
      });
    });
    it('Set up end of hand', () => {
      const returned = gamePlayLogic.setUpNextPlay(
        [[], [], []],
        {},
        0,
        0
      );
      expect(JSON.stringify(returned)).toEqual( "{\"nextPlayGameState\":\"tallyCounts\",\"nextPlayPromptMessage\":{\"message\":{\"type\":\"div\",\"key\":null,\"ref\":null,\"props\":{\"children\":[null,{\"type\":\"br\",\"key\":null,\"ref\":null,\"props\":{},\"_owner\":null,\"_store\":{}},{\"type\":\"div\",\"key\":null,\"ref\":null,\"props\":{\"children\":\"+1 for last trick\"},\"_owner\":null,\"_store\":{}}]},\"_owner\":null,\"_store\":{}}},\"nextPlayDealToPlayer\":1}");
    });
  });
  describe('movePlayPileToDiscard', () => {
    it('Team one winner', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const state = {
        winningPlay: 0,
        players: ['a','b','c','d'],
        tookBid: 0,
        playPile: [{suit: 'H', value: 'Q'}, {suit: 'H', value: 'A'}, {suit: 'H', value: '9'}, {suit: 'H', value: '9'}]
      };
      const returned = gamePlayLogic.movePlayPileToDiscard(state);
      expect(JSON.stringify(returned)).toEqual(  "{\"playToDiscardMovingCards\":[{\"id\":\"P0toD0\",\"keyId\":\"P0toD0undefined\",\"suit\":\"H\",\"value\":\"Q\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"P1toD0\",\"keyId\":\"P1toD0undefined\",\"suit\":\"H\",\"value\":\"A\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"P2toD0\",\"keyId\":\"P2toD0undefined\",\"suit\":\"H\",\"value\":\"9\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"P3toD0\",\"keyId\":\"P3toD0undefined\",\"suit\":\"H\",\"value\":\"9\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]}],\"playToDiscardPlayPile\":[null,null,null,null]}");
      expect(spiedGetCardLocation).toBeCalledTimes(8);
    });
    it('Team two winner', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const state = {
        winningPlay: 1,
        players: ['a','b','c','d'],
        tookBid: 0,
        playPile: [{suit: 'H', value: 'Q'}, {suit: 'H', value: 'A'}, {suit: 'H', value: '9'}, {suit: 'H', value: 'Q'}]
      };
      const returned = gamePlayLogic.movePlayPileToDiscard(state);
      expect(JSON.stringify(returned)).toEqual( "{\"playToDiscardMovingCards\":[{\"id\":\"P0toD1\",\"keyId\":\"P0toD1undefined\",\"suit\":\"H\",\"value\":\"Q\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"P1toD1\",\"keyId\":\"P1toD1undefined\",\"suit\":\"H\",\"value\":\"A\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"P2toD1\",\"keyId\":\"P2toD1undefined\",\"suit\":\"H\",\"value\":\"9\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"P3toD1\",\"keyId\":\"P3toD1undefined\",\"suit\":\"H\",\"value\":\"Q\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]}],\"playToDiscardPlayPile\":[null,null,null,null]}");
      expect(spiedGetCardLocation).toBeCalledTimes(8);
    });
  });
  describe('discardToMeldTally', () => {
    it('Move tally to meb pile for 3 handed', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const state = {
        discardPiles: [
          [],
          [],
          [{suit: 'H', value: 'Q'}, {suit: 'H', value: 'A'}, {suit: 'H', value: '9'}, {suit: 'H', value: 'Q'}]
        ],
        dealToPlayer: 2,
        players: ['a','b','c'],
        tookBid: 2
      };
      const returned = gamePlayLogic.discardToMeldTally(state);
      expect(JSON.stringify(returned)).toEqual("{\"tallyMovingCards\":[{\"id\":\"D23toM2\",\"keyId\":\"D23toM2undefined\",\"suit\":\"H\",\"value\":\"Q\",\"shown\":true,\"frontColor\":\"#eee\",\"speed\":2,\"source\":[\"a\"],\"target\":[\"a\"]}],\"tallyDiscardPiles\":[[],[],[{\"suit\":\"H\",\"value\":\"Q\"},{\"suit\":\"H\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"9\"}]],\"tallyDealToPlayer\":2,\"tallyGameState\":\"moveDiscardToMeldTally\"}");
      expect(spiedGetCardLocation).toBeCalledTimes(2);
    });
    it('Move tally to meb pile for 4 handed bid taker', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const state = {
        discardPiles: [
          [],
          [],
          [{suit: 'H', value: 'Q'}, {suit: 'H', value: 'A'}, {suit: 'H', value: '9'}, {suit: 'H', value: 'Q'}],
          []
        ],
        dealToPlayer: 2,
        players: ['a','b','c','d'],
        tookBid: 2
      };
      const returned = gamePlayLogic.discardToMeldTally(state);
      expect(JSON.stringify(returned)).toEqual("{\"tallyMovingCards\":[{\"id\":\"D23toM2\",\"keyId\":\"D23toM2undefined\",\"suit\":\"H\",\"value\":\"Q\",\"shown\":true,\"frontColor\":\"#eee\",\"speed\":2,\"source\":[\"a\"],\"target\":[\"a\"]}],\"tallyDiscardPiles\":[[],[],[{\"suit\":\"H\",\"value\":\"Q\"},{\"suit\":\"H\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"9\"}],[]],\"tallyDealToPlayer\":2,\"tallyGameState\":\"moveDiscardToMeldTally\"}");
      expect(spiedGetCardLocation).toBeCalledTimes(2);
    });
    it('Move tally to meb pile for 4 handed non-bid taker', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const state = {
        discardPiles: [
          [],
          [],
          [{suit: 'H', value: 'Q'}, {suit: 'H', value: 'A'}, {suit: 'H', value: '9'}, {suit: 'H', value: 'Q'}],
          []
        ],
        dealToPlayer: 2,
        players: ['a','b','c','d'],
        tookBid: 1
      };
      const returned = gamePlayLogic.discardToMeldTally(state);
      expect(JSON.stringify(returned)).toEqual( "{\"tallyMovingCards\":[{\"id\":\"D23toM2\",\"keyId\":\"D23toM2undefined\",\"suit\":\"H\",\"value\":\"Q\",\"shown\":true,\"frontColor\":\"#eee\",\"speed\":2,\"source\":[\"a\"],\"target\":[\"a\"]}],\"tallyDiscardPiles\":[[],[],[{\"suit\":\"H\",\"value\":\"Q\"},{\"suit\":\"H\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"9\"}],[]],\"tallyDealToPlayer\":2,\"tallyGameState\":\"moveDiscardToMeldTally\"}");
      expect(spiedGetCardLocation).toBeCalledTimes(2);
    });
    it('On a skip for tally', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const state = {
        discardPiles: [
          [],
          [],
          [{suit: 'H', value: 'Q'}, {suit: 'H', value: 'A'}, {suit: 'H', value: '9'}, {suit: 'H', value: 'Q'}],
          []
        ],
        dealToPlayer: 3,
        players: ['a','b','c','d'],
        tookBid: 1
      };
      const returned = gamePlayLogic.discardToMeldTally(state);
      expect(JSON.stringify(returned)).toEqual("{\"tallyMovingCards\":[],\"tallyDiscardPiles\":[[],[],[{\"suit\":\"H\",\"value\":\"Q\"},{\"suit\":\"H\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"9\"},{\"suit\":\"H\",\"value\":\"Q\"}],[]],\"tallyDealToPlayer\":3,\"tallyGameState\":\"doneCounting\"}");
      expect(spiedGetCardLocation).toBeCalledTimes(0);
    });
  });
  describe('addCountToTally', () => {
    it('Tally 3 handed with tally player wins last', () => {
      const returned = gamePlayLogic.addCountToTally(
        [{},{},{}],
        [[{value: 'K'},{value: 'Q'},{value: 'K'},{value: 'K'}], [], []],
        0,
        0
      );
      expect(returned).toEqual({
        "addCountBidModals": [
          {
            "hasCloseButton": false,
            "hasHeaderSeparator": false,
            "header": "4",
            "height": 44,
            "message": expect.any(Object),
            "shown": true,
            "width": 80,
            "zoom": 100
          },
          {},
          {}
        ]
      });
    });
    it('Tally 3 handed with tally player does not wins last', () => {
      const returned = gamePlayLogic.addCountToTally(
        [{},{},{}],
        [[{value: 'K'},{value: 'Q'},{value: 'K'},{value: 'K'}], [], []],
        1,
        0
      );
      expect(returned).toEqual({
        "addCountBidModals": [
          {
            "hasCloseButton": false,
            "hasHeaderSeparator": false,
            "header": "3",
            "height": 44,
            "message": expect.any(Object),
            "shown": true,
            "width": 80,
            "zoom": 100
          },
          {},
          {}
        ]
      });
    });
    it('Tally 4 handed with tally team wins last', () => {
      const returned = gamePlayLogic.addCountToTally(
        [{},{},{},{}],
        [[{value: 'K'},{value: 'Q'},{value: 'K'},{value: 'K'}], [], [], []],
        2,
        0
      );
      expect(returned).toEqual({
        "addCountBidModals": [
          {
            "hasCloseButton": false,
            "hasHeaderSeparator": false,
            "header": "4",
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
      });
    });
    it('Tally 4 handed with tally player does not wins last', () => {
      const returned = gamePlayLogic.addCountToTally(
        [{},{},{},{}],
        [[{value: 'K'},{value: 'Q'},{value: 'K'},{value: 'K'}], [], []],
        1,
        0
      );
      expect(returned).toEqual({
        "addCountBidModals": [
          {
            "hasCloseButton": false,
            "hasHeaderSeparator": false,
            "header": "3",
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
      });
    });
  });
  describe('addCountToScore', () => {
    it('Bidder fails bid and player gets cabbageed', () => {
      const returned = gamePlayLogic.addCountToScore(
        ['a','b'],
        ['c','d','e','f'],
        [[{meld:5}],[{meld: 2}]],
        [[],[],[],[]],
        [{},{},{},{}],
        0,
        28
      );
      expect(returned).toEqual({
        "addScoreGameWon": "",
        "addScorePlayScore": [
          [
            {"counts": "", "gotSet": true, meld: 5, "score": -28}
          ],
          [
            {"counts": "", "gotSet": true, meld: 2, "score": "0"}
          ]
        ],
        "addScorePlayerModal": {
          "buttons": [
            {"label": "End Hand", "returnMessage": "endOfHand", "status": "warning"}
          ],
          "hasBox": true,
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 105,
          "message":  expect.any(Object),
          "shown": true,
          "width": 500,
          "zoom": 100
        },
        "addScorePromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
    });
    it('Bidder makes bid and player gets cabbaged', () => {
      const returned = gamePlayLogic.addCountToScore(
        ['a','b'],
        ['c','d','e','f'],
        [[{meld:5}],[{meld: 2}]],
        [[{}],[{}],[{}],[{}]],
        [{header: "28"},{header: "2"},{},{}],
        0,
        28
      );
      expect(returned).toEqual({
        "addScoreGameWon": "",
        "addScorePlayScore": [
          [{"counts": "28", "meld": 5, "score": "33"}],
          [{"counts": "2", "meld": 2, "score": "4"}]
        ],
        "addScorePlayerModal": {
          "buttons": [
            {"label": "End Hand", "returnMessage": "endOfHand", "status": "warning"}
          ],
          "hasBox": false,
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 105,
          "message": expect.any(Object),
          "shown": true,
          "width": 500,
          "zoom": 100
        },
        "addScorePromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
    });
  });
  describe('resolveEndHand', () => {
    it('Resolve hand and continue game', () => {
      const returned = gamePlayLogic.resolveEndHand(
        ['a','b'],
        ['c','d','e','f'],
        [[{score:78}],[{score: 79}]],
        0,
        0
      );
      expect(returned).toEqual({
        "endHandDealer": 1,
        "endHandGameState": "moveDeckToDealer",
        "endHandGameWon": "",
        "endHandPlayerModal": {"shown": false},
        "endHandPromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
    });
    it('Team 1 won', () => {
      const returned = gamePlayLogic.resolveEndHand(
        ['a','b'],
        ['c','d','e','f'],
        [[{score:128}],[{score: 79}]],
        0,
        0
      );
      expect(returned).toEqual( {
        "endHandDealer": 1,
        "endHandGameState": "waitEndOfGame",
        "endHandGameWon": "a",
        "endHandPlayerModal": {
          "buttons": [
            {"label": "End Game", "returnMessage": "endOfGame", "status": "warning"}
          ],
          "hasBox": false,
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 500,
          "zoom": 100
        },
        "endHandPromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": (<div><span><b>a</b> won the game!</span></div>),
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
    });
    it('Team 2 won because of bid', () => {
      const returned = gamePlayLogic.resolveEndHand(
        ['a','b'],
        ['c','d','e','f'],
        [[{score:138}],[{score: 129}]],
        1,
        0
      );
      expect(returned).toEqual( {
        "endHandDealer": 1,
        "endHandGameState": "waitEndOfGame",
        "endHandGameWon": "b",
        "endHandPlayerModal": {
          "buttons": [
            {"label": "End Game", "returnMessage": "endOfGame", "status": "warning"}
          ],
          "hasBox": true,
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": <div><span><b>b</b> won by taking the bid.</span></div>,
          "shown": true,
          "width": 500,
          "zoom": 100
        },
        "endHandPromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": <div><span><b>b</b> won the game!</span></div>,
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
    });
    it('3 handed non-bidding team wins', () => {
      const returned = gamePlayLogic.resolveEndHand(
        ['a','b','c'],
        ['c','d','e'],
        [[{score:138}],[{score: 60}],[{score: 129}]],
        1,
        0
      );
      expect(returned).toEqual( {
        "endHandDealer": 1,
        "endHandGameState": "waitEndOfGame",
        "endHandGameWon": "a",
        "endHandPlayerModal": {
          "buttons": [
            {"label": "End Game", "returnMessage": "endOfGame", "status": "warning"}
          ],
          "hasBox": false,
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 500,
          "zoom": 100
        },
        "endHandPromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": <div><span><b>a</b> won the game!</span></div>,
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
    });
    it('3 handed non-bidding team wins, second team', () => {
      const returned = gamePlayLogic.resolveEndHand(
        ['a','b','c'],
        ['c','d','e'],
        [[{score:138}],[{score: 60}],[{score: 149}]],
        1,
        0
      );
      expect(returned).toEqual( {
        "endHandDealer": 1,
        "endHandGameState": "waitEndOfGame",
        "endHandGameWon": "c",
        "endHandPlayerModal": {
          "buttons": [
            {"label": "End Game", "returnMessage": "endOfGame", "status": "warning"}
          ],
          "hasBox": false,
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 500,
          "zoom": 100
        },
        "endHandPromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": <div><span><b>c</b> won the game!</span></div>,
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
    });
    it('3 handed non-bidding teams tie', () => {
      const returned = gamePlayLogic.resolveEndHand(
        ['a', 'b', 'c'],
        ['c', 'd', 'e'],
        [[{score: 140}], [{score: 60}], [{score: 140}]],
        1,
        0
      );
      expect(returned).toEqual({
        "endHandDealer": 1,
        "endHandGameState": "moveDeckToDealer",
        "endHandGameWon": "",
        "endHandPlayerModal": {"shown": false},
        "endHandPromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
    });
    it('3 handed non-bidding team wins', () => {
      const returned = gamePlayLogic.resolveEndHand(
        ['a', 'b', 'c'],
        ['c', 'd', 'e'],
        [[{score: 140}], [{score: 60}], [{score: 70}]],
        1,
        0
      );
      expect(returned).toEqual( {
        "endHandDealer": 1,
        "endHandGameState": "waitEndOfGame",
        "endHandGameWon": "a",
        "endHandPlayerModal": {
          "buttons": [
            {"label": "End Game", "returnMessage": "endOfGame", "status": "warning"}
          ],
          "hasBox": false,
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 500,
          "zoom": 100
        },
        "endHandPromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": <div><span><b>a</b> won the game!</span></div>,
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
    });
  });
});
