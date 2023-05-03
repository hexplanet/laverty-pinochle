import * as bidMeldLogic from './gameReducerBidMeldLogic';
import * as helpers from '../../utils/helpers';

describe('gameReducerBidMeldLogic', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('nextBid', () => {
    it('Informs who has next bid in modal', () => {
      const returned = bidMeldLogic.nextBid(['a','b','c'],1);
      expect(returned).toEqual({
        "nextBidPrompt": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": (<div><div>Players now make their bids.<br /><span><b>b</b> is now bidding</span></div></div>),
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
    });
  });
  describe('computerBid', () => {
    it('Computer has good enough cards to bid', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 20,
        nearMiss: 6,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        projectedCounts: 12
      });
      const hands = [
        [],
        [{suit: 'S', value: '10'}],
        [],
        []
      ];
      const returned = bidMeldLogic.computerBid(hands, 1, ['a','b','c','d'],[23,25,0,0]);
      expect(returned).toEqual(28);
      expect(spiedGetHandMeld).toBeCalledTimes(4);
      expect(spiedGetProjectedCount).toBeCalledTimes(4);
    });
    it('Computer does not have good enough cards to bid', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 6,
        nearMiss: 3,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        projectedCounts: 12
      } );
      const hands = [
        [],
        [{suit: 'S', value: '10'}],
        [],
        []
      ];
      const returned = bidMeldLogic.computerBid(hands, 1, ['a','b','c','d'],[23,25,0,0]);
      expect(returned).toEqual(0);
      expect(spiedGetHandMeld).toBeCalledTimes(4);
      expect(spiedGetProjectedCount).toBeCalledTimes(4);
    });
  });
  describe('configureUserBidModal', () => {
    it('Set up user bid modal if not the last bid', () => {
      const returned = bidMeldLogic.configureUserBidModal([0, 0, 0, 0], 21, 0,1);
      expect(returned).toEqual( {
        "bidPlayerModal": {
          "buttons": [
            {"label": "Pass", "returnMessage": "bid_0"},
            {"label": "<", "returnMessage": "bid_left", "status": "inactive"},
            {"label": "21", "returnMessage": "bid_21"},
            {"label": "22", "returnMessage": "bid_22"},
            {"label": "23", "returnMessage": "bid_23"},
            {"label": "24", "returnMessage": "bid_24"},
            {"label": "25", "returnMessage": "bid_25"},
            {"label": ">", "returnMessage": "bid_right", "status": ""}
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
        "maxedBidOffset": 21
      });
    });
    it('Set up user bid modal if the last bid', () => {
      const returned = bidMeldLogic.configureUserBidModal([0, 0, 34, 0], 21, 0,0);
      expect(returned).toEqual( {
        "bidPlayerModal": {
          "buttons": [
            {"label": "Pass", "returnMessage": "bid_0"},
            {"label": "35", "returnMessage": "bid_35"},
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
        "maxedBidOffset": 21
      });
    });
  });
  describe('resolveBidding', () => {
    it('Resolves bids for winner', () => {
      const bids = [0,23,26,27];
      const returned = bidMeldLogic.resolveBidding(
        bids,
        ['a', 'b', 'c', 'd'],
        ['e', 'f'],
        [[{}],[{}]]
      );
      expect(returned).toEqual({
        "tookBidPlayerModal": {
          "buttons": [
            {"label": "Continue", "returnMessage": "postBidContinue"}
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
        },
        "tookBidPromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 210,
          "zoom": 100
        },
        "updatedBidScore": [
          [
            {},
            {"bid": "", "counts": "", "gotSet": false, "meld": "", "score": ""}
          ],
          [
            {},
            {"bid": "27", "counts": "", "gotSet": false, "meld": "", "score": ""}
          ]
        ],
        "wonBidWith": 27,
        "wonTheBid": 3
      });
    });
  });
  describe('displayWidow', () => {
    it('Modify play pile to display widow card by index', () => {
      const playPile = [
        {},
        {},
        {}
      ];
      const returned = bidMeldLogic.displayWidow(playPile, 1, ['a', 'b' , 'c']);
      expect(returned).toEqual( [{}, {"rotation": 0, "shown": true, "xOffset": 10, "yOffset": 150}, {}]);
    });
    it('Do not change play pile if widow index is -1', () => {
      const returned = bidMeldLogic.displayWidow([{},{},{}], -1, ['a', 'b' , 'c']);
      expect(returned).toEqual( [{}, {}, {}]);
    });
  });
  describe('displayWidow', () => {
    it('Starts all widow cards moving to bid winners hand', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const state = {
        playPile: [
          {suit: 'S', value: '10'},
          {suit: 'S', value: 'K'},
          {suit: 'S', value: 'A'}
        ],
        tookBid: 0,
        players: ['a', 'b', 'c']
      };
      const returned = bidMeldLogic.movingWidow(state);
      expect(JSON.stringify(returned)).toEqual( "{\"widowMovingCards\":[{\"id\":\"P0toH0\",\"keyId\":\"P0toH0-1\",\"suit\":\"S\",\"value\":\"10\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"P1toH0\",\"keyId\":\"P1toH0-1\",\"suit\":\"S\",\"value\":\"K\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"P2toH0\",\"keyId\":\"P2toH0-1\",\"suit\":\"S\",\"value\":\"A\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]}],\"widowSeen\":[\"S10\",\"SK\",\"SA\"],\"widowEmptyPlayPile\":[null,null,null]}");
      expect(spiedGetCardLocation).toBeCalledTimes( 6);
      expect(spiedGetRandomRange).toBeCalledTimes( 3);
    });
  });
  describe('shouldComputerThrowHand', () => {
    it('3 handed will fail', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 0,
        nearMiss: 0,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        projectedCounts: 0
      });
      const returned = bidMeldLogic.shouldComputerThrowHand([[],[],[]], 1, 35, ['a', 'b', 'c']);
      expect(returned).toEqual({"computerThrowGameState": "throwHand"});
      expect(spiedGetHandMeld).toBeCalledTimes(4);
      expect(spiedGetProjectedCount).toBeCalledTimes(4);
    });
    it('4 handed may fail', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 20,
        nearMiss: 6,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        projectedCounts: 6
      });
      const returned = bidMeldLogic.shouldComputerThrowHand([[],[],[],[]], 1, 35, ['a', 'b', 'c', 'd']);
      expect(returned).toEqual( {"computerThrowGameState": "computerWantsToThrowHand"});
      expect(spiedGetHandMeld).toBeCalledTimes(4);
      expect(spiedGetProjectedCount).toBeCalledTimes(4);
    });
    it('No failure detected', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 20,
        nearMiss: 6,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        projectedCounts: 12
      });
      const returned = bidMeldLogic.shouldComputerThrowHand([[],[],[]], 1, 35, ['a', 'b', 'c']);
      expect(returned).toEqual( {"computerThrowGameState": "throwHandContinue"});
      expect(spiedGetHandMeld).toBeCalledTimes(4);
      expect(spiedGetProjectedCount).toBeCalledTimes(4);
    });
  });
  describe('shouldComputerAgreeThrowHand', () => {
    it('Declines redeal for too many points', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 12,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        totalWins: []
      });
      const returned = bidMeldLogic.shouldComputerAgreeThrowHand([[],[],[]], 1,  ['a', 'b', 'c']);
      expect(returned).toEqual({"computerAgreeThrowHand": "throwHandDisagree"});
      expect(spiedGetHandMeld).toBeCalledTimes(1);
      expect(spiedGetProjectedCount).toBeCalledTimes(1);
    });
    it('Declines redeal for too many wins', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 0,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        totalWins: ['', '', '', '', '', '']
      });
      const returned = bidMeldLogic.shouldComputerAgreeThrowHand([[],[],[]], 1,  ['a', 'b', 'c']);
      expect(returned).toEqual({"computerAgreeThrowHand": "throwHandDisagree"});
      expect(spiedGetHandMeld).toBeCalledTimes(1);
      expect(spiedGetProjectedCount).toBeCalledTimes(1);
    });
    it('Agrees redeal because has nothing', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 0,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        totalWins: []
      });
      const returned = bidMeldLogic.shouldComputerAgreeThrowHand([[],[],[]], 1,  ['a', 'b', 'c']);
      expect(returned).toEqual( {"computerAgreeThrowHand": "throwHand"});
      expect(spiedGetHandMeld).toBeCalledTimes(1);
      expect(spiedGetProjectedCount).toBeCalledTimes(1);
    });
  });
  describe('shouldUserThrowHand', () => {
    it('3 handed will fail', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 0,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        projectedCounts: 0
      });
      const returned = bidMeldLogic.shouldUserThrowHand([[],[],[]], 35,  ['a', 'b', 'c']);
      expect(returned).toEqual({
        "throwGameState": "waitUserThrowHand",
        "throwPlayerModal": {
          "buttons": [
            {"label": "Play Hand", "returnMessage": "throwHandContinue"},
            {"label": "Throw Hand", "returnMessage": "throwHand"}
          ],
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 105,
          "message": (<div>You can't make the bid. Throw hand?</div>),
          "shown": true,
          "width": 500,
          "zoom": 100
        }
      });
      expect(spiedGetHandMeld).toBeCalledTimes(4);
      expect(spiedGetProjectedCount).toBeCalledTimes(4);
    });
    it('4 handed may fail', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 4,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        projectedCounts: 10
      });
      const returned = bidMeldLogic.shouldUserThrowHand([[],[],[],[]], 35,  ['a', 'b', 'c','d']);
      expect(returned).toEqual({
        "throwGameState": "waitUserThrowHand",
        "throwPlayerModal": {
          "buttons": [
            {"label": "Play Hand", "returnMessage": "throwHandContinue"},
            {"label": "Throw Hand", "returnMessage": "userThrowHand"}
          ],
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 105,
          "message": (<div>You might not make the bid. Throw hand?</div>),
          "shown": true,
          "width": 500,
          "zoom": 100
        }
      });
      expect(spiedGetHandMeld).toBeCalledTimes(4);
      expect(spiedGetProjectedCount).toBeCalledTimes(4);
    });
    it('No fail option given', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 20,
      });
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        projectedCounts: 10
      });
      const returned = bidMeldLogic.shouldUserThrowHand([[],[],[]], 20,  ['a', 'b', 'c']);
      expect(returned).toEqual({"throwGameState": "throwHandContinue", "throwPlayerModal": {"shown": false}});
      expect(spiedGetHandMeld).toBeCalledTimes(4);
      expect(spiedGetProjectedCount).toBeCalledTimes(4);
    });
  });
  describe('setUpDiscards', () => {
    it('computer discards', () => {
      const spiedGetTrumpBidHeader = jest.spyOn(helpers, 'getTrumpBidHeader').mockReturnValue({'header': 'trumpHeader'});
      const returned = bidMeldLogic.setUpDiscards(
        [[],[],[]],
        1,
        ['a', 'b', 'c'],
        'S',
        22
      );
      expect(returned).toEqual({
        "discardGameState": "computerDiscard",
        "discardHands": [[], [], []],
        "discardPlayerModal": {
          "shown": false
        },
        "discardPromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "trumpHeader",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
      expect(spiedGetTrumpBidHeader).toBeCalledTimes(1);
    });
    it('user discards', () => {
      const spiedGetTrumpBidHeader = jest.spyOn(helpers, 'getTrumpBidHeader')
        .mockReturnValue({'header': 'trumpHeader'});
      const spiedGetHandMeld= jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        cardsUsed: ['SK', 'SQ']
      });
      const hands = [
        [
          {value: 'A', suit: 'S'},
          {value: 'A', suit: 'S'},
          {value: 'K', suit: 'S'},
          {value: 'Q', suit: 'S'},
          {value: 'A', suit: 'C'},
          {value: 'A', suit: 'S'}
        ],
        [],
        []
      ];
      const returned = bidMeldLogic.setUpDiscards(
        hands,
        0,
        ['a', 'b', 'c'],
        'C',
        22
      );
      expect(returned).toEqual({
        "discardGameState": "waitUserDiscard",
        "discardHands": [
          [
            {"active": true, "clickable": true, "raised": false, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "A"},
            {"active": true, "clickable": true, "raised": false, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "A"},
            {"active": true, "clickable": true,  "frontColor": "#eea", "raised": false, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "K"},
            {"active": true, "clickable": true,  "frontColor": "#eea", "raised": false, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "Q"},
            {"active": true, "clickable": true, "frontColor": "#ffaf7a", "raised": false, "rolloverColor": "#0f0", "shown": true, "suit": "C", "value": "A"},
            {"active": true, "clickable": true, "raised": false, "rolloverColor": "#0f0", "shown": true, "suit": "S", "value": "A"}
          ],
          [],
          []
        ],
        "discardPlayerModal": {
          "buttons": [
            {"label": "Discard", "returnMessage": "userDiscard", "status": "inactive"}
          ],
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 105,
          "message": <div><span>Cards: Meld = yellow, Trump = orange</span></div>,
          "shown": true,
          "width": 450,
          "zoom": 100
        },
        "discardPromptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "trumpHeader",
          "height": 140,
          "message": expect.any(Object),
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
      expect(spiedGetTrumpBidHeader).toBeCalledTimes(1);
      expect(spiedGetHandMeld).toBeCalledTimes(1);
    });
  });
  describe('userSelectDiscard', () => {
    it('Toggles selecting a card and actives button', () => {
      const returned = bidMeldLogic.userSelectDiscard([[{}, {}]], {buttons:[{}]}, 1);
      expect(returned).toEqual({
        "discardUserHands": [
          [
            {},
            {"raised": true}
          ]
        ],
        "discardUserModal": {
          "buttons": [
            {"status": ""}
          ]
        }
      });
    });
    it('Toggles selecting a card and deactivates button', () => {
      const returned = bidMeldLogic.userSelectDiscard([[{}, {}], []], {buttons:[{}]}, 1);
      expect(returned).toEqual({
        "discardUserHands": [
          [
            {},
            {"raised": true}
          ],
          []
        ],
        "discardUserModal": {
          "buttons": [
            {"status": "inactive"}
          ]
        }
      });
    });
  });
  describe('removeUserDiscard', () => {
    it('starts user discarded cards to discard pile', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const state = {
        hands: [[{},{raised: true,},{raised: true,},{},{},{raised: true,}]],
        tookBid: 0,
        players: ['a', 'b', 'c']
      };
      const returned = bidMeldLogic.removeUserDiscard(state);
      expect(JSON.stringify(returned)).toEqual("{\"removeUserHands\":[[{\"frontColor\":\"#eee\",\"clickable\":false,\"rolloverColor\":\"\"},{\"frontColor\":\"#eee\",\"clickable\":false,\"rolloverColor\":\"\"},{\"frontColor\":\"#eee\",\"clickable\":false,\"rolloverColor\":\"\"}]],\"removeUserMovingCards\":[{\"id\":\"H05toD0\",\"keyId\":\"H05toD0-1\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"H02toD0\",\"keyId\":\"H02toD0-1\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"H01toD0\",\"keyId\":\"H01toD0-1\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]}],\"removeUserPrompt\":{\"shown\":true,\"width\":210,\"height\":140,\"message\":{\"type\":\"div\",\"key\":null,\"ref\":null,\"props\":{\"children\":{\"type\":\"span\",\"key\":null,\"ref\":null,\"props\":{\"children\":[{\"type\":\"b\",\"key\":null,\"ref\":null,\"props\":{\"children\":\"a\"},\"_owner\":null,\"_store\":{}},\" have discarded the required cards\"]},\"_owner\":null,\"_store\":{}}},\"_owner\":null,\"_store\":{}},\"zoom\":100,\"hasCloseButton\":false,\"header\":\"\",\"hasHeaderSeparator\":false}}");
      expect(spiedGetCardLocation).toBeCalledTimes(6);
      expect(spiedGetRandomRange).toBeCalledTimes(3);
    });
  });
  describe('calculateComputerDiscard', () => {
    it('makes discard decisions', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        cardsUsed: []
      });
      const spiedGetTrumpSuit = jest.spyOn(helpers, 'getTrumpSuit').mockReturnValue('S');
      const spiedGetProjectedCount = jest.spyOn(helpers, 'getProjectedCount').mockReturnValue({
        projectedCounts: 10
      });
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const state = {
        playerModal: {},
        hands: [[],[
          {suit:'S',value:'A'},
          {suit:'S',value:'10'},
          {suit:'S',value:'K'},
          {suit:'S',value:'Q'},
          {suit:'S',value:'J'},
          {suit:'S',value:'9'},
          {suit:'D',value:'A'},
          {suit:'D',value:'J'},
          {suit:'C',value:'A'},
          {suit:'C',value:'K'},
          {suit:'C',value:'Q'},
          {suit:'H',value:'A'},
          {suit:'H',value:'K'},
          {suit:'H',value:'Q'},
          {suit:'H',value:'9'}
        ]],
        tookBid: 1,
        players: ['a','b','c'],
      };
      const returned = bidMeldLogic.calculateComputerDiscard(state);
      expect(JSON.stringify(returned)).toEqual("{\"removeComputerHands\":[[],[{\"suit\":\"S\",\"value\":\"A\"},{\"suit\":\"S\",\"value\":\"10\"},{\"suit\":\"S\",\"value\":\"K\"},{\"suit\":\"S\",\"value\":\"Q\"},{\"suit\":\"S\",\"value\":\"J\"},{\"suit\":\"S\",\"value\":\"9\"},{\"suit\":\"D\",\"value\":\"A\"},{\"suit\":\"D\",\"value\":\"J\"},{\"suit\":\"C\",\"value\":\"A\"},{\"suit\":\"C\",\"value\":\"Q\"},{\"suit\":\"H\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"Q\"},{\"suit\":\"H\",\"value\":\"9\"}]],\"removeComputerMovingCards\":[{\"id\":\"H10toD1\",\"keyId\":\"H10toD1-1\",\"suit\":\"C\",\"value\":\"K\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"H11toD1\",\"keyId\":\"H11toD1-1\",\"suit\":\"H\",\"value\":\"K\",\"shown\":false,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]}],\"removeComputerGameState\":\"waitRemoveDiscards\",\"removeComputerPlayer\":{}}");
      expect(spiedGetHandMeld).toBeCalledTimes(1);
      expect(spiedGetTrumpSuit).toBeCalledTimes(1);
      expect(spiedGetProjectedCount).toBeCalledTimes(0);
      expect(spiedGetCardLocation).toBeCalledTimes(4);
      expect(spiedGetRandomRange).toBeCalledTimes(2);
    });
  });
  describe('userSelectTrump', () => {
    it('Sets up modal to select trump ', () => {
      const spiedSuitIconSelector = jest.spyOn(helpers, 'suitIconSelector').mockReturnValue('suit');
      const returned = bidMeldLogic.userSelectTrump([[{suit: 'S'}, {suit: 'D'}, {suit: 'H'}]], ['a','b','c']);
      expect(returned).toEqual({
        "userTrumpPlayer": {
          "buttons": [
            {"height": 30, "icon": 'suit', "returnMessage": "trumpIs_S", "width": 30},
            {"height": 30, "icon": 'suit', "returnMessage": "trumpIs_D", "width": 30},
            {"height": 30, "icon": 'suit', "returnMessage": "trumpIs_H", "width": 30}
          ],
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 105,
          "message": <div><span>Select Trump Suit</span></div>,
          "shown": true,
          "width": 400,
          "zoom": 100
        },
        "userTrumpPrompt": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": <div><span><b>a</b> have to select a trump suit</span></div>,
          "shown": true,
          "width": 210,
          "zoom": 100
        }
      });
      expect(spiedSuitIconSelector).toHaveBeenCalledTimes(3);
    });
  });
  describe('computerSelectTrump', () => {
    it('Comuter selects a trump suit', () => {
      const spiedGetTrumpSuit = jest.spyOn(helpers, 'getTrumpSuit').mockReturnValue('S');
      const spiedSuitIconSelector = jest.spyOn(helpers, 'suitIconSelector').mockReturnValue('suit');
      const spiedGetTrumpBidHeader = jest.spyOn(helpers, 'getTrumpBidHeader').mockReturnValue({'header': 'trumpHeader'});
      const returned = bidMeldLogic.computerSelectTrump([[],[],[]], 1, ['a','b','c'], 23);
      expect(returned).toEqual({
        "computerTrumpPlayer": {
          "buttons": [
            {"label": "Continue", "returnMessage": "postTrumpSuitContinue"}
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
        },
        "computerTrumpPrompt": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "trumpHeader",
          "height": 140,
          "message": <div><span><b>b</b> selected<br /><div style={{"width": "100%"}}><div style={{"marginLeft": "auto", "marginRight": "auto", "width": 30}}>suit</div></div></span></div>,
          "shown": true,
          "width": 210,
          "zoom": 100
        },
        "computerTrumpSuit": "S"
      });
      expect(spiedGetTrumpSuit).toHaveBeenCalledTimes(1);
      expect(spiedSuitIconSelector).toHaveBeenCalledTimes(1);
      expect(spiedGetTrumpBidHeader).toHaveBeenCalledTimes(1);
    });
  });
  describe('startMeldMessage', () => {
    it('Gives start meld lay out message in modal', () => {
      const spiedGetTrumpBidHeader = jest.spyOn(helpers, 'getTrumpBidHeader').mockReturnValue({'header': 'trumpHeader'});
      const returned = bidMeldLogic.startMeldMessage('H', 1, 28, ['a','b','c']);
      expect(returned).toEqual({
        "hasCloseButton": false,
        "hasHeaderSeparator": false,
        "header": "trumpHeader",
        "height": 140,
        "message": <div>Lay down meld</div>,
        "shown": true,
        "width": 210,
        "zoom": 100
      });
      expect(spiedGetTrumpBidHeader).toHaveBeenCalledTimes(1);
    });
  });
  describe('meldCards', () => {
    it('Displays meld for a given hand', () => {
      const spiedGetHandMeld = jest.spyOn(helpers, 'getHandMeld').mockReturnValue({
        points: 39,
        cardsUsed: ['DA','D10','DK','DQ','DJ','SK','SQ','HK','HQ','CK','CQ']
      });
      const state = {
        hands: [
          [
            {suit:'D',value:'A'},
            {suit:'D',value:'10'},
            {suit:'D',value:'K'},
            {suit:'D',value:'Q'},
            {suit:'D',value:'J'},
            {suit:'S',value:'K'},
            {suit:'S',value:'Q'},
            {suit:'H',value:'K'},
            {suit:'H',value:'Q'},
            {suit:'C',value:'K'},
            {suit:'C',value:'Q'}
          ],
          [],
          []
        ],
        dealToPlayer: 0,
        melds: [[],[],[]],
        meldScores: [0,0,0],
        trumpSuit: 'D',
        seenCards: [[],[],[]],
        tookBid: 0,
        seenWidow: ['DA','CA','HA'],
      };
      const returned = bidMeldLogic.meldCards(state);
      expect(returned).toEqual({
        "meldHands": [[], [], []],
        "meldPlaceScores": [39, 0, 0],
        "meldPlacedCards": [
          [
            {"shown": true, "suit": "C", "value": "K", "xOffset": -25, "yOffset": -315},
            {"shown": true, "suit": "C", "value": "Q", "xOffset": 25, "yOffset": -315},
            {"shown": true, "suit": "H", "value": "K", "xOffset": -25, "yOffset": -245},
            {"shown": true, "suit": "H", "value": "Q", "xOffset": 25, "yOffset": -245},
            {"shown": true, "suit": "S", "value": "K", "xOffset": -25, "yOffset": -175},
            {"shown": true, "suit": "S", "value": "Q", "xOffset": 25, "yOffset": -175},
            {"shown": true, "suit": "D", "value": "A", "xOffset": -125, "yOffset": -105},
            {"shown": true, "suit": "D", "value": "10", "xOffset": -75, "yOffset": -105},
            {"shown": true, "suit": "D", "value": "K", "xOffset": -25, "yOffset": -105},
            {"shown": true, "suit": "D", "value": "Q", "xOffset": 25, "yOffset": -105},
            {"shown": true, "suit": "D", "value": "J", "xOffset": 75, "yOffset": -105}
          ],
          [],
          []
        ],
        "meldSeenCards": [
          ["DA", "D10", "DK", "DQ", "DJ", "SK", "SQ", "HK", "HQ", "CK", "CQ", "CA", "HA"],
          [],
          []
        ]
      });
      expect(spiedGetHandMeld).toHaveBeenCalledTimes(1);
    });
  });
  describe('postMeldLaydown', () => {
    it('Move to display the next players meld', () => {
      const returned = bidMeldLogic.postMeldLaydown(
        0,
        false,
        0,
        [0,0,0,0],
        [[{}],[{}]],
        ['','','',''],
        {},
        'S',
        28,
        ['','']
      );
      expect(returned).toEqual({
        "meldDealToPlayer": 1,
        "meldGameState": "displayMeld",
        "meldPlayScore": [[{}], [{}]],
        "meldPlayerModal": {"shown": false},
        "meldPromptModal": {}
      });
    });
    it('Display of final player, not thrown hand, 4 handed', () => {
      const returned = bidMeldLogic.postMeldLaydown(
        0,
        false,
        1,
        [20,10,8,4],
        [[{}],[{}]],
        ['','','',''],
        {},
        'S',
        28,
        ['','']
      );
      expect(returned).toEqual({
        "meldDealToPlayer": 1,
        "meldGameState": "startGamePlayWait",
        "meldPlayScore": [
          [
            {
              "meld": 28
            }
          ],
          [
            {
              "meld": 14
            }
          ]
        ],
        "meldPlayerModal": {
          "buttons": [
            {"label": "Start Play", "returnMessage": "startGamePlay"}
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
        },
        "meldPromptModal": {
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
    it('Display of final player, thrown hand, 3 handed', () => {
      const returned = bidMeldLogic.postMeldLaydown(
        0,
        true,
        1,
        [20,10,8],
        [[{}],[{}],[{}]],
        ['','',''],
        {},
        'S',
        28,
        ['','','']
      );
      expect(returned).toEqual({
        "meldDealToPlayer": 1,
        "meldGameState": "finalThrownHandWait",
        "meldPlayScore": [
          [{"meld": 20, "score": 20}],
          [{"score": -28}],
          [{"meld": 8, "score": 8}]
        ],
        "meldPlayerModal": {
          "buttons": [
            {"label": "End Hand", "returnMessage": "endOfHand", "status": "warning"}
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
        },
        "meldPromptModal": {
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
});