import * as preBidLogic from './gameReducerPreBidLogic';
import * as helpers from '../../../utils/helpers';
import {SUITS, HIGH_TO_LOW} from "../../../utils/cardOrder";

describe('gameReducerPreBidLogic', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('playerDisplaySettingsLogic', () => {
    it('locations for 3 player on 1000 by 750 browser window', () => {
      const returned = preBidLogic.playerDisplaySettingsLogic(1000, 750, 3);
      expect(returned).toEqual({
        "miscLocations": {
          "gameBidModals": [
            {"x": 500, "y": 669, "zoom": 60},
            {"x": 66, "y": 66, "zoom": 60},
            {"x": 934, "y": 66, "zoom": 60}
          ],
          "playArea": {"x": 500, "y": 375, "zoom": 45},
          "playerModal": {"x": 500, "y": 708, "zoom": 60},
          "promptModal": {"x": 928, "y": 696, "zoom": 60},
          "scorePad": {"x": 51, "y": 684, "zoom": 15}
        },
        "playerDiscardLocations": [
          {"rotation": 0, "x": 251, "y": 702, "zoom": 45},
          {"rotation": 315, "x": 96, "y": 96, "zoom": 45},
          {"rotation": 45, "x": 904, "y": 96, "zoom": 45}
        ],
        "playerHandLocations": [
          {"rotation": 0, "x": 500, "y": 669, "zoom": 60},
          {"rotation": 135, "x": 192, "y": 192, "zoom": 60},
          {"rotation": 225, "x": 808, "y": 192, "zoom": 60}
        ],
        "playerMeldLocations": [
          {"rotation": 0, "x": 500, "y": 588, "zoom": 45},
          {"rotation": 135, "x": 120, "y": 360, "zoom": 45},
          {"rotation": 225, "x": 880, "y": 360, "zoom": 45}
        ],
        "zoomRatio": 0.6
      });
    });
    it('locations for 3 player on 500 by 2000 browser window', () => {
      const returned = preBidLogic.playerDisplaySettingsLogic(500, 2000, 3);
      expect(returned).toEqual({
        "miscLocations": {
          "gameBidModals": [
            {"x": 250, "y": 1946, "zoom": 40},
            {"x": 44, "y": 44, "zoom": 40},
            {"x": 456, "y": 44, "zoom": 40}
          ],
          "playArea": {"x": 250, "y": 1000, "zoom": 30},
          "playerModal": {"x": 250, "y": 1972, "zoom": 40},
          "promptModal": {"x": 452, "y": 1964, "zoom": 40},
          "scorePad": {"x": 34, "y": 1956, "zoom": 10}
        },
        "playerDiscardLocations": [
          {"rotation": 0, "x": 84, "y": 1968, "zoom": 30},
          {"rotation": 315, "x": 64, "y": 64, "zoom": 30},
          {"rotation": 45, "x": 436, "y": 64, "zoom": 30}
        ],
        "playerHandLocations": [
          {"rotation": 0, "x": 250, "y": 1946, "zoom": 40},
          {"rotation": 135, "x": 128, "y": 128, "zoom": 40},
          {"rotation": 225, "x": 372, "y": 128, "zoom": 40}
        ],
        "playerMeldLocations": [
          {"rotation": 0, "x": 250, "y": 1892, "zoom": 30},
          {"rotation": 135, "x": 80, "y": 240, "zoom": 30},
          {"rotation": 225, "x": 420, "y": 240, "zoom": 30}
        ],
        "zoomRatio": 0.4
      });
    });

    it('locations for 4 player on 1250 by 600 browser window', () => {
      const returned = preBidLogic.playerDisplaySettingsLogic(1250, 600, 4);
      expect(returned).toEqual({
        "miscLocations": {
          "gameBidModals": [
            {"x": 625, "y": 535.2, "zoom": 48},
            {"x": 21.119999999999997, "y": 300, "zoom": 48},
            {"x": 625, "y": 24.96, "zoom": 48},
            {"x": 1225.04, "y": 300, "zoom": 48}
          ],
          "playArea": {"x": 625, "y": 300, "zoom": 36},
          "playerModal": {"x": 625, "y": 566.4, "zoom": 48},
          "promptModal": {"x": 1192.4, "y": 556.8, "zoom": 48},
          "scorePad": {"x": 40.8, "y": 547.2, "zoom": 12}
        },
        "playerDiscardLocations": [
          {"rotation": 0, "x": 425.8, "y": 561.6, "zoom": 36},
          {"rotation": 270, "x": 48, "y": 100.80000000000001, "zoom": 36},
          {"rotation": 0, "x": 824.2, "y": 48, "zoom": 36},
          {"rotation": 270, "x": 1211.6, "y": 499.2, "zoom": 36}
        ],
        "playerHandLocations": [
          {"rotation": 0, "x": 625, "y": 535.2, "zoom": 48},
          {"rotation": 90, "x": 64.8, "y": 300, "zoom": 48},
          {"rotation": 180, "x": 625, "y": 64.8, "zoom": 48},
          {"rotation": 270, "x": 1185.2, "y": 300, "zoom": 48}
        ],
        "playerMeldLocations": [
          {"rotation": 0, "x": 625, "y": 470.4, "zoom": 36},
          {"rotation": 90, "x": 129.6, "y": 300, "zoom": 36},
          {"rotation": 180, "x": 625, "y": 129.6, "zoom": 36},
          {"rotation": 270, "x": 1120.4, "y": 300, "zoom": 36}
        ],
        "zoomRatio": 0.48
      });
    });
    it('locations for 4 player on 750 by 1500 browser window', () => {
      const returned = preBidLogic.playerDisplaySettingsLogic(750, 1500, 4);
      expect(returned).toEqual({
        "miscLocations": {
          "gameBidModals": [
            {"x": 375, "y": 1419, "zoom": 60},
            {"x": 26.4, "y": 750, "zoom": 60},
            {"x": 375, "y": 31.2, "zoom": 60},
            {"x": 718.8, "y": 750, "zoom": 60}
          ],
          "playArea": {"x": 375, "y": 750, "zoom": 45},
          "playerModal": {"x": 375, "y": 1458, "zoom": 60},
          "promptModal": {"x": 678, "y": 1446, "zoom": 60},
          "scorePad": {"x": 51, "y": 1434, "zoom": 15}
        },
        "playerDiscardLocations": [
          {"rotation": 0, "x": 126, "y": 1452, "zoom": 45},
          {"rotation": 270, "x": 60, "y": 501, "zoom": 45},
          {"rotation": 0, "x": 624, "y": 60, "zoom": 45},
          {"rotation": 270, "x": 702, "y": 999, "zoom": 45}
        ],
        "playerHandLocations": [
          {"rotation": 0, "x": 375, "y": 1419, "zoom": 60},
          {"rotation": 90, "x": 81, "y": 750, "zoom": 60},
          {"rotation": 180, "x": 375, "y": 81, "zoom": 60},
          {"rotation": 270, "x": 669, "y": 750, "zoom": 60}
        ],
        "playerMeldLocations": [
          {"rotation": 0, "x": 375, "y": 1338, "zoom": 45},
          {"rotation": 90, "x": 162, "y": 750, "zoom": 45},
          {"rotation": 180, "x": 375, "y": 162, "zoom": 45},
          {"rotation": 270, "x": 588, "y": 750, "zoom": 45}
        ],
        "zoomRatio": 0.6
      });
    });
  });
  describe('resolveCardMovement', () => {
    it('card not found', () => {
      const id = 'D1toP1';
      const keyId = 'abc';
      const movingCards= [];
      const hands = [[],[],[]];
      const melds = [[],[],[]];
      const discardPiles = [[],[],[]];
      const playPile = [null, null, null];
      const returned = preBidLogic.resolveCardMovement(
        id,
        keyId,
        movingCards,
        hands,
        melds,
        discardPiles,
        playPile
      );
      expect(returned).toEqual({});
    });
    it('card resolved into hand', () => {
      const spiedCreateLandingCard = jest.spyOn(helpers, 'createLandingCard').mockReturnValue('a');
      const spiedSortCardHand = jest.spyOn(helpers, 'sortCardHand').mockReturnValue('b');
      const id = 'D1toH1';
      const keyId = 'abc';
      const movingCards= [{keyId: 'unknown'}, {keyId: 'abc'}, {keyId: 'unknown2'}];
      const hands = [[],[],[]];
      const melds = [[],[],[]];
      const discardPiles = [[],[],[]];
      const playPile = [null, null, null];
      const returned = preBidLogic.resolveCardMovement(
        id,
        keyId,
        movingCards,
        hands,
        melds,
        discardPiles,
        playPile
      );
      expect(returned).toEqual({
        "hands": [
          [],
          "b",
          []
        ],
        "movingCards": [
          {"keyId": "unknown"},
          {
             "doneMoving": true,
             "keyId": "abc",
           },
          {"keyId": "unknown2"}
        ]
      });
      expect(spiedCreateLandingCard).toBeCalledWith( {"keyId": "abc", "doneMoving": true}, "H");
      expect(spiedSortCardHand).toBeCalledWith(['a']);
    });
    it('card resolved into meld', () => {
      const spiedCreateLandingCard = jest.spyOn(helpers, 'createLandingCard').mockReturnValue('a');
      const id = 'D1toM2';
      const keyId = 'abc';
      const movingCards= [{keyId: 'unknown'}, {keyId: 'abc'}, {keyId: 'unknown2'}];
      const hands = [[],[],[]];
      const melds = [[],[],[]];
      const discardPiles = [[],[],[]];
      const playPile = [null, null, null];
      const returned = preBidLogic.resolveCardMovement(
        id,
        keyId,
        movingCards,
        hands,
        melds,
        discardPiles,
        playPile
      );
      expect(returned).toEqual({
        "melds": [
          [],
          [],
          ["a"]
        ],
        "movingCards": [
          {"keyId": "unknown"},
          {
            "doneMoving": true,
            "keyId": "abc"
          },
          {"keyId": "unknown2"}
        ]
      });
      expect(spiedCreateLandingCard).toBeCalledWith( {"keyId": "abc", "doneMoving": true}, "M");
    });
    it('card resolved into discard piles', () => {
      const spiedCreateLandingCard = jest.spyOn(helpers, 'createLandingCard').mockReturnValue('a');
      const id = 'D1toD0';
      const keyId = 'abc';
      const movingCards= [{keyId: 'unknown'}, {keyId: 'abc'}, {keyId: 'unknown2'}];
      const hands = [[],[],[]];
      const melds = [[],[],[]];
      const discardPiles = [[],[],[]];
      const playPile = [null, null, null];
      const returned = preBidLogic.resolveCardMovement(
        id,
        keyId,
        movingCards,
        hands,
        melds,
        discardPiles,
        playPile
      );
      expect(returned).toEqual({
        "discardPiles": [
          ["a"],
          [],
          []
        ],
        "movingCards": [
          {"keyId": "unknown"},
          {
            "doneMoving": true,
            "keyId": "abc"
          },
          {"keyId": "unknown2"}
        ]
      });
      expect(spiedCreateLandingCard).toBeCalledWith( {"keyId": "abc", "doneMoving": true}, "D");
    });
    it('card resolved into play pile at player location', () => {
      const spiedCreateLandingCard = jest.spyOn(helpers, 'createLandingCard').mockReturnValue('a');
      const id = 'D1toP1';
      const keyId = 'abc';
      const movingCards= [{keyId: 'unknown'}, {keyId: 'abc'}, {keyId: 'unknown2'}];
      const hands = [[],[],[]];
      const melds = [[],[],[]];
      const discardPiles = [[],[],[]];
      const playPile = [null, null, null];
      const returned = preBidLogic.resolveCardMovement(
        id,
        keyId,
        movingCards,
        hands,
        melds,
        discardPiles,
        playPile
      );
      expect(returned).toEqual({
        "playPile": [null, 'a', null],
        "movingCards": [
          {"keyId": "unknown"},
          {
            "doneMoving": true,
            "keyId": "abc"
          },
          {"keyId": "unknown2"}
        ]
      });
      expect(spiedCreateLandingCard).toBeCalledWith( {"keyId": "abc", "doneMoving": true}, "P");
    });
    it('card resolved into play pile at generic location', () => {
      const spiedCreateLandingCard = jest.spyOn(helpers, 'createLandingCard').mockReturnValue('a');
      const id = 'D1toP-1';
      const keyId = 'abc';
      const movingCards= [{keyId: 'unknown'}, {keyId: 'abc'}, {keyId: 'unknown2'}];
      const hands = [[],[],[]];
      const melds = [[],[],[]];
      const discardPiles = [[],[],[]];
      const playPile = ['b'];
      const returned = preBidLogic.resolveCardMovement(
        id,
        keyId,
        movingCards,
        hands,
        melds,
        discardPiles,
        playPile
      );
      expect(returned).toEqual({
        "playPile": ['b', 'a'],
        "movingCards": [
          {"keyId": "unknown"},
          {
            "doneMoving": true,
            "keyId": "abc"
          },
          {"keyId": "unknown2"}
        ]
      });
      expect(spiedCreateLandingCard).toBeCalledWith( {"keyId": "abc", "doneMoving": true}, "P");
    });
  });
  describe('setGameValuesForNewGame', () => {
    it('Proper reset values returned', () => {
      const spied = jest.spyOn(helpers, 'generateShuffledDeck').mockReturnValue(['a']);
      const returned = preBidLogic.setGameValuesForNewGame(['a', 'b'], ['c', 'd', 'e', 'f']);
      expect(returned).toEqual({
        "bidModals": [{"shown": false}, {"shown": false}, {"shown": false}, {"shown": false}],
        "bids": [0, 0, 0, 0],
        "discardPiles": [["a"], [], [], []],
        "gameState": "choseDealer",
        "gameWon": "",
        "hands": [[], [], [], []],
        "meldScores": [0, 0, 0, 0],
        "melds": [[], [], [], []],
        "movingCards": [],
        "offSuits": [[], [], [], []],
        "playPile": [],
        "playPileShown": false,
        "playScore": [[], []],
        "playedCards": [[], [], [], []],
        "playerModal": {"shown": false},
        "promptModal": {
          "hasCloseButton": false,
          "hasHeaderSeparator": false,
          "header": "",
          "height": 140,
          "message": (<div>Dealer is chosen by the first player to get an ace</div>),
          "shown": true, "width": 210, "zoom": 100
        },
        "seenCards": [[], [], [], []],
        "seenWidow": [],
        "showHands": [true, false, false, false]
      });
      spied.mockClear();
    });

  });
  describe('setGameValuesForNewHand', () => {
    it('Proper reset values returned', () => {
      const returned = preBidLogic.setGameValuesForNewHand(['c', 'd', 'e', 'f']);
      expect(returned).toEqual({
        "bids": [0, 0, 0, 0],
        "offSuits": [[], [], [], []],
        "playedCards": [[], [], [], []],
        "seenCards": [[], [], [], []],
        "seenWidow": []
      });
    });
  });
  describe('throwCardForDeal', () => {
    it('moving card created for ace check', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      jest.spyOn(Date, 'now').mockReturnValue(123456789);
      const state = {
        discardPiles: [[
          {thisStays: true},
          {
            suit: 'S',
            value: 'A'
          }
        ],[],[]],
        dealer: 1,
        players: ['c','d','e']
      };
      const returned = preBidLogic.throwCardForDeal(state);
      expect(JSON.stringify(returned)).toEqual( "{\"newDiscards\":[[{\"thisStays\":true}],[],[]],\"newDealer\":2,\"newMovingCard\":{\"id\":\"D01toM2\",\"keyId\":\"D01toM2123456789\",\"suit\":\"S\",\"value\":\"A\",\"shown\":true,\"speed\":1,\"source\":[\"a\"],\"target\":[\"a\"]}}");
      expect(spiedGetCardLocation).toBeCalledTimes( 2);
      expect(spiedGetRandomRange).toBeCalledTimes( 1);
    });
  });
  describe('declareDealer', () => {
    it('dealer is declared in modal', () => {
      const spied = jest.spyOn(helpers, 'generalModalData').mockReturnValue(['a']);
      const returned = preBidLogic.declareDealer(['a','b','c'], 1);
      expect(returned).toEqual({"dealerPromptModal": ["a"]});
      expect(spied).toBeCalledWith( (<div>The dealer is<br /><b>b</b></div>));
    });
  });
  describe('passDeckToDealer', () => {
    it('cards are thrown to dealer discard from all piles', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const state = {
        players: ['a','b','c'],
        dealer: 2,
        movingCards: [{id:'previousMovingCard'}],
        discardPiles: [
          ['d'],
          ['e'],
          ['f']
        ],
        melds: [
          ['g'],
          ['h'],
          ['i']
        ],
        hands: [
          ['j'],
          ['k'],
          ['l']
        ],
        playPile: ['m']
      };
      const returned = preBidLogic.passDeckToDealer(state);
      expect(returned).toEqual({
        "toDealerBidModels": [{"shown": false}, {"shown": false}, {"shown": false}],
        "toDealerDiscards": [[], [], ["f"]],
        "toDealerHands": [[], [], []],
        "toDealerMelds": [[], [], []],
        "toDealerMovingCards": [
          {"id": "previousMovingCard"},
          {"id": "D00toD2", "key": "D00toD2", "keyId": "D00toD2-1", "shown": false, "source": ["a"], "speed": 10, "target": ["a"], "travelTime": 51},
          {"id": "M00toD2", "key": "M00toD2", "keyId": "M00toD2-1", "shown": false, "source": ["a"], "speed": 10, "target": ["a"], "travelTime": 51},
          {"id": "H00toD2", "key": "H00toD2", "keyId": "H00toD2-1", "shown": false, "source": ["a"], "speed": 10, "target": ["a"], "travelTime": 51},
          {"id": "D10toD2", "key": "D10toD2", "keyId": "D10toD2-1", "shown": false, "source": ["a"], "speed": 10, "target": ["a"], "travelTime": 51},
          {"id": "M10toD2", "key": "M10toD2", "keyId": "M10toD2-1", "shown": false, "source": ["a"], "speed": 10, "target": ["a"], "travelTime": 51},
          {"id": "H10toD2", "key": "H10toD2", "keyId": "H10toD2-1", "shown": false, "source": ["a"], "speed": 10, "target": ["a"], "travelTime": 51},
          {"id": "M20toD2", "key": "M20toD2", "keyId": "M20toD2-1", "shown": false, "source": ["a"], "speed": 10, "target": ["a"], "travelTime": 51},
          {"id": "H20toD2", "key": "H20toD2", "keyId": "H20toD2-1", "shown": false, "source": ["a"], "speed": 10, "target": ["a"], "travelTime": 51},
          {"id": "P0toD2", "key": "P0toD2", "keyId": "P0toD2-1", "shown": false, "source": ["a"], "speed": 10, "target": ["a"], "travelTime": 51}
        ],
        "toDealerPlayPile": []
      });
      expect(spiedGetCardLocation).toBeCalledTimes( 10);
    });
    it('cards are not thrown because piles are empty', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      jest.spyOn(Date, 'now').mockReturnValue(8);
      const state = {
        players: ['a','b','c'],
        dealer: 2,
        movingCards: [{id:'previousMovingCard'}],
        discardPiles: [[], [], []],
        melds: [[], [], []],
        hands:  [[], [], []],
        playPile: []
      };
      const returned = preBidLogic.passDeckToDealer(state);
      expect(returned).toEqual({
        "toDealerBidModels": [{"shown": false}, {"shown": false}, {"shown": false}],
        "toDealerDiscards": [[], [], []],
        "toDealerHands": [[], [], []],
        "toDealerMelds": [[], [], []],
        "toDealerMovingCards": [{"id": "previousMovingCard"}],
        "toDealerPlayPile": []
      });
      expect(spiedGetCardLocation).toBeCalledTimes( 1);
    });
  });
  describe('preDealing', () => {
    it('generates shuffled deck and clears prompt', () => {
      const spiedGenerateShuffledDeck = jest.spyOn(helpers, 'generateShuffledDeck').mockReturnValue(['a']);
      const spiedGeneralModalData = jest.spyOn(helpers, 'generalModalData').mockReturnValue('b');
      const returned = preBidLogic.preDealing([],0);
      expect(returned).toEqual( {"clearPlayerPrompt": "b", "shuffledCards": [["a"]]});
      expect(spiedGenerateShuffledDeck).toBeCalledTimes( 1);
      expect(spiedGeneralModalData).toBeCalledWith( "");
      spiedGenerateShuffledDeck.mockClear();
    });
  });
  describe('dealing', () => {
    it('does not deal if no cards are left to deal', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      const dealCards = [];
      const state = {
        dealer: 0,
        dealToPlayer: 0,
        players: ['a','b','c'],
        discardPiles: [dealCards, [], []],
        hands: [[],[],[]],
        movingCards: [{id:'previous'}],
      };
      const returned = preBidLogic.dealing(state);
      expect(returned).toEqual({"dealCards": [{"id": "previous"}], "dealDeck": [[], [], []]});
      expect(spiedGetCardLocation).toBeCalledTimes(0);
      expect(spiedGetRandomRange).toBeCalledTimes(0);
    });
    it('3 handed: deals to not the dealer, thus no widow, and is first round', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const dealCards = [];
      for(let i = 0; i < 24; i++) {
        dealCards.push({suit:SUITS[i % 4], value: HIGH_TO_LOW[i % 6]});
      }
      for(let i = 0; i < 24; i++) {
        dealCards.push({suit:SUITS[i % 4], value: HIGH_TO_LOW[i % 6]});
      }
      const state = {
        dealer: 0,
        dealToPlayer: 1,
        players: ['a','b','c'],
        discardPiles: [dealCards, [], []],
        hands: [[],[],[]],
        movingCards: [{id:'previous'}],
      };
      const returned = preBidLogic.dealing(state);
      expect(JSON.stringify(returned)).toEqual("{\"dealDeck\":[[{\"suit\":\"S\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"10\"},{\"suit\":\"C\",\"value\":\"K\"},{\"suit\":\"D\",\"value\":\"Q\"},{\"suit\":\"S\",\"value\":\"J\"},{\"suit\":\"H\",\"value\":\"9\"},{\"suit\":\"C\",\"value\":\"A\"},{\"suit\":\"D\",\"value\":\"10\"},{\"suit\":\"S\",\"value\":\"K\"},{\"suit\":\"H\",\"value\":\"Q\"},{\"suit\":\"C\",\"value\":\"J\"},{\"suit\":\"D\",\"value\":\"9\"},{\"suit\":\"S\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"10\"},{\"suit\":\"C\",\"value\":\"K\"},{\"suit\":\"D\",\"value\":\"Q\"},{\"suit\":\"S\",\"value\":\"J\"},{\"suit\":\"H\",\"value\":\"9\"},{\"suit\":\"C\",\"value\":\"A\"},{\"suit\":\"D\",\"value\":\"10\"},{\"suit\":\"S\",\"value\":\"K\"},{\"suit\":\"H\",\"value\":\"Q\"},{\"suit\":\"C\",\"value\":\"J\"},{\"suit\":\"D\",\"value\":\"9\"},{\"suit\":\"S\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"10\"},{\"suit\":\"C\",\"value\":\"K\"},{\"suit\":\"D\",\"value\":\"Q\"},{\"suit\":\"S\",\"value\":\"J\"},{\"suit\":\"H\",\"value\":\"9\"},{\"suit\":\"C\",\"value\":\"A\"},{\"suit\":\"D\",\"value\":\"10\"},{\"suit\":\"S\",\"value\":\"K\"},{\"suit\":\"H\",\"value\":\"Q\"},{\"suit\":\"C\",\"value\":\"J\"},{\"suit\":\"D\",\"value\":\"9\"},{\"suit\":\"S\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"10\"},{\"suit\":\"C\",\"value\":\"K\"},{\"suit\":\"D\",\"value\":\"Q\"},{\"suit\":\"S\",\"value\":\"J\"},{\"suit\":\"H\",\"value\":\"9\"},{\"suit\":\"C\",\"value\":\"A\"},{\"suit\":\"D\",\"value\":\"10\"},{\"suit\":\"S\",\"value\":\"K\"}],[],[]],\"dealCards\":[{\"id\":\"previous\"},{\"id\":\"D047toH1\",\"keyId\":\"D047toH1-1\",\"suit\":\"D\",\"value\":\"9\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D046toH1\",\"keyId\":\"D046toH1-1\",\"suit\":\"C\",\"value\":\"J\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D045toH1\",\"keyId\":\"D045toH1-1\",\"suit\":\"H\",\"value\":\"Q\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]}]}");
      expect(spiedGetCardLocation).toBeCalledTimes(6);
      expect(spiedGetRandomRange).toBeCalledTimes(3);
    });
    it('3 handed: deals to not the dealer, thus no widow, and not first round', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const dealCards = [];
      for(let i = 0; i < 6; i++) {
        dealCards.push({suit:SUITS[i % 4], value: HIGH_TO_LOW[i % 6]});
      }
      const state = {
        dealer: 0,
        dealToPlayer: 1,
        players: ['a','b','c'],
        discardPiles: [dealCards, [], []],
        hands: [[],[],[]],
        movingCards: [{id:'previous'}],
      };
      const returned = preBidLogic.dealing(state);
      expect(JSON.stringify(returned)).toEqual(  "{\"dealDeck\":[[{\"suit\":\"S\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"10\"}],[],[]],\"dealCards\":[{\"id\":\"previous\"},{\"id\":\"D05toH1\",\"keyId\":\"D05toH1-1\",\"suit\":\"H\",\"value\":\"9\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D04toH1\",\"keyId\":\"D04toH1-1\",\"suit\":\"S\",\"value\":\"J\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D03toH1\",\"keyId\":\"D03toH1-1\",\"suit\":\"D\",\"value\":\"Q\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D02toH1\",\"keyId\":\"D02toH1-1\",\"suit\":\"C\",\"value\":\"K\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]}]}");
      expect(spiedGetCardLocation).toBeCalledTimes(8);
      expect(spiedGetRandomRange).toBeCalledTimes(4);
    });
    it('3 handed: deals to the dealer, no widow, as it is first round', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const dealCards = [];
      for(let i = 0; i < 6; i++) {
        dealCards.push({suit:SUITS[i % 4], value: HIGH_TO_LOW[i % 6]});
      }
      const state = {
        dealer: 0,
        dealToPlayer: 0,
        players: ['a','b','c'],
        discardPiles: [dealCards, [], []],
        hands: [[],[],[]],
        movingCards: [{id:'previous'}],
      };
      const returned = preBidLogic.dealing(state);
      expect(JSON.stringify(returned)).toEqual("{\"dealDeck\":[[{\"suit\":\"S\",\"value\":\"A\"},{\"suit\":\"H\",\"value\":\"10\"}],[],[]],\"dealCards\":[{\"id\":\"previous\"},{\"id\":\"D05toH0\",\"keyId\":\"D05toH0-1\",\"suit\":\"H\",\"value\":\"9\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D04toH0\",\"keyId\":\"D04toH0-1\",\"suit\":\"S\",\"value\":\"J\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D03toH0\",\"keyId\":\"D03toH0-1\",\"suit\":\"D\",\"value\":\"Q\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D02toH0\",\"keyId\":\"D02toH0-1\",\"suit\":\"C\",\"value\":\"K\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]}]}");
      expect(spiedGetCardLocation).toBeCalledTimes(8);
      expect(spiedGetRandomRange).toBeCalledTimes(4);
    });
    it('3 handed: deals to the dealer, no widow, as it is first round', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const dealCards = [];
      for(let i = 0; i < 6; i++) {
        dealCards.push({suit:SUITS[i % 4], value: HIGH_TO_LOW[i % 6]});
      }
      const state = {
        dealer: 0,
        dealToPlayer: 0,
        players: ['a','b','c'],
        discardPiles: [dealCards, [], []],
        hands: [['d'],[],[]],
        movingCards: [{id:'previous'}],
      };
      const returned = preBidLogic.dealing(state);
      expect(JSON.stringify(returned)).toEqual("{\"dealDeck\":[[{\"suit\":\"S\",\"value\":\"A\"}],[],[]],\"dealCards\":[{\"id\":\"previous\"},{\"id\":\"D05toP-1\",\"keyId\":\"D05toP-1-1\",\"suit\":\"H\",\"value\":\"9\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D04toH0\",\"keyId\":\"D04toH0-1\",\"suit\":\"S\",\"value\":\"J\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D03toH0\",\"keyId\":\"D03toH0-1\",\"suit\":\"D\",\"value\":\"Q\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D02toH0\",\"keyId\":\"D02toH0-1\",\"suit\":\"C\",\"value\":\"K\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D01toH0\",\"keyId\":\"D01toH0-1\",\"suit\":\"H\",\"value\":\"10\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]}]}");
      expect(spiedGetCardLocation).toBeCalledTimes(10);
      expect(spiedGetRandomRange).toBeCalledTimes(5);
    });
    it('4 handed: deals to the dealer, 2 cards to the widow on first round', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const dealCards = [];
      for(let i = 0; i < 6; i++) {
        dealCards.push({suit:SUITS[i % 4], value: HIGH_TO_LOW[i % 6]});
      }
      const state = {
        dealer: 0,
        dealToPlayer: 0,
        players: ['a','b','c','d'],
        discardPiles: [dealCards, [], []],
        hands: [[],[],[]],
        movingCards: [{id:'previous'}],
      };
      const returned = preBidLogic.dealing(state);
      expect(JSON.stringify(returned)).toEqual("{\"dealDeck\":[[],[],[]],\"dealCards\":[{\"id\":\"previous\"},{\"id\":\"D05toP-1\",\"keyId\":\"D05toP-1-1\",\"suit\":\"H\",\"value\":\"9\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D04toP-1\",\"keyId\":\"D04toP-1-1\",\"suit\":\"S\",\"value\":\"J\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D03toH0\",\"keyId\":\"D03toH0-1\",\"suit\":\"D\",\"value\":\"Q\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D02toH0\",\"keyId\":\"D02toH0-1\",\"suit\":\"C\",\"value\":\"K\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D01toH0\",\"keyId\":\"D01toH0-1\",\"suit\":\"H\",\"value\":\"10\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D00toH0\",\"keyId\":\"D00toH0-1\",\"suit\":\"S\",\"value\":\"A\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]}]}");
      expect(spiedGetCardLocation).toBeCalledTimes(12);
      expect(spiedGetRandomRange).toBeCalledTimes(6);
    });
    it('4 handed: deals to the dealer, 1 cards to the widow on non-first round', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      const spiedGetRandomRange = jest.spyOn(helpers, 'getRandomRange').mockReturnValue(['b']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const dealCards = [];
      for(let i = 0; i < 6; i++) {
        dealCards.push({suit:SUITS[i % 4], value: HIGH_TO_LOW[i % 6]});
      }
      const state = {
        dealer: 0,
        dealToPlayer: 0,
        players: ['a','b','c','d'],
        discardPiles: [dealCards, [], []],
        hands: [['e'],[],[]],
        movingCards: [{id:'previous'}],
      };
      const returned = preBidLogic.dealing(state);
      expect(JSON.stringify(returned)).toEqual("{\"dealDeck\":[[{\"suit\":\"S\",\"value\":\"A\"}],[],[]],\"dealCards\":[{\"id\":\"previous\"},{\"id\":\"D05toP-1\",\"keyId\":\"D05toP-1-1\",\"suit\":\"H\",\"value\":\"9\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D04toH0\",\"keyId\":\"D04toH0-1\",\"suit\":\"S\",\"value\":\"J\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D03toH0\",\"keyId\":\"D03toH0-1\",\"suit\":\"D\",\"value\":\"Q\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D02toH0\",\"keyId\":\"D02toH0-1\",\"suit\":\"C\",\"value\":\"K\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]},{\"id\":\"D01toH0\",\"keyId\":\"D01toH0-1\",\"suit\":\"H\",\"value\":\"10\",\"shown\":false,\"travelTime\":300,\"source\":[\"a\"],\"target\":[\"a\"]}]}");
      expect(spiedGetCardLocation).toBeCalledTimes(10);
      expect(spiedGetRandomRange).toBeCalledTimes(5);
    });
  });
  describe('checkForNines', () => {
    it('No player has enough nines to throw hand', () => {
      const hands = [
        [
          {value: '9'},
        ]
      ];
      const returned = preBidLogic.checkForNines(hands, ['a', 'b', 'c']);
      expect(returned).toEqual({
        "ninesGameState": "ninesContinue",
        "ninesPlayerModal": undefined,
        "ninesPromptModal": undefined
      });
    });
    it('users has enough 9s to chose to redeal', () => {
      const spied = jest.spyOn(helpers, 'generalModalData').mockReturnValue('a');
      const hands = [
        [
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'}
        ]
      ];
      const returned = preBidLogic.checkForNines(hands, ['a', 'b', 'c', 'd']);
      expect(returned).toEqual({
        "ninesGameState": "ninesUserRedealWait",
        "ninesPlayerModal": 'a',
        "ninesPromptModal": 'a'
      });
      expect(spied).toHaveBeenCalledTimes(2);
    });
    it('computer has enough 9s to chose to redeal but chooses not redeal', () => {
      const spiedGeneralModalData = jest.spyOn(helpers, 'generalModalData').mockReturnValue('a');
      const spiedGetHandBid = jest.spyOn(helpers, 'getHandBid').mockReturnValue(22);
      const hands = [
        [],
        [
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'}
        ]
      ];
      const returned = preBidLogic.checkForNines(hands, ['a', 'b', 'c', 'd']);
      expect(returned).toEqual({
        "ninesGameState": "ninesContinue",
        "ninesPlayerModal": undefined,
        "ninesPromptModal": undefined,
      });
      expect(spiedGeneralModalData).toHaveBeenCalledTimes(0);
      expect(spiedGetHandBid).toHaveBeenCalledWith(
        [
          {"value": "9"},
          {"value": "9"},
          {"value": "9"},
          {"value": "9"},
          {"value": "9"},
          {"value": "9"}
        ],
        ["a", "b", "c", "d"]
      );
    });
    it('computer has enough 9s to chose to redeal, chooses to redeal for 3-handed', () => {
      const spiedGeneralModalData = jest.spyOn(helpers, 'generalModalData').mockReturnValue('a');
      const spiedGetHandBid = jest.spyOn(helpers, 'getHandBid').mockReturnValue(2);
      const hands = [
        [],
        [
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'}
        ]
      ];
      const returned = preBidLogic.checkForNines(hands, ['a', 'b', 'c']);
      expect(returned).toEqual({
        "ninesGameState": "waitRedeal",
        "ninesPlayerModal": "a",
        "ninesPromptModal": "a",
      });
      expect(spiedGeneralModalData).toHaveBeenCalledTimes(2);
      expect(spiedGetHandBid).toHaveBeenCalledTimes(1);
    });
    it(
      'computer has enough 9s to chose to redeal, chooses to redeal for 4-handed, computer partner agrees',
      () => {
        const spiedGeneralModalData = jest.spyOn(helpers, 'generalModalData').mockReturnValue('a');
        const spiedGetHandBid = jest.spyOn(helpers, 'getHandBid').mockReturnValue(2);
        const hands = [
          [],
          [
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'}
          ]
        ];
        const returned = preBidLogic.checkForNines(hands, ['a', 'b', 'c', 'd']);
        expect(returned).toEqual({
          "ninesGameState": "waitRedeal",
          "ninesPlayerModal": "a",
          "ninesPromptModal": "a",
        });
        expect(spiedGeneralModalData).toHaveBeenCalledTimes(2);
        expect(spiedGetHandBid).toHaveBeenCalledTimes(2);
      });

    it(
      'computer has enough 9s to chose to redeal, chooses to redeal for 4-handed, computer partner disagrees',
      () => {
        const spiedGeneralModalData = jest.spyOn(helpers, 'generalModalData').mockReturnValue('a');
        const spiedGetHandBid = jest.spyOn(helpers, 'getHandBid')
          .mockReturnValueOnce(10)
          .mockReturnValueOnce(22);
        const hands = [
          [],
          [
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'}
          ]
        ];
        const returned = preBidLogic.checkForNines(hands, ['a', 'b', 'c', 'd']);
        expect(returned).toEqual({
          "ninesGameState": "waitNinesContinue",
          "ninesPlayerModal": "a",
          "ninesPromptModal": "a"
        });
        expect(spiedGeneralModalData).toHaveBeenCalledTimes(2);
        expect(spiedGetHandBid).toHaveBeenCalledTimes(2);
      });

    it(
      'computer has enough 9s to chose to redeal, chooses to redeal for 4-handed, user asked to agree',
      () => {
        const spiedGeneralModalData = jest.spyOn(helpers, 'generalModalData').mockReturnValue('a');
        const spiedGetHandBid = jest.spyOn(helpers, 'getHandBid').mockReturnValue(2);
        const hands = [
          [],
          [],
          [
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'},
            {value: '9'}
          ]
        ];
        const returned = preBidLogic.checkForNines(hands, ['a','b','c','d']);
        expect(returned).toEqual( {
          "ninesGameState": "ninesUserAgree",
          "ninesPlayerModal": "a",
          "ninesPromptModal": "a",
        });
        expect(spiedGeneralModalData).toHaveBeenCalledTimes(2);
        expect(spiedGetHandBid).toHaveBeenCalledTimes(1);
      });
  });
  describe('checkPostNines', () => {
    it('computer does not disagree with redeal', () => {
      const spiedGeneralModalData = jest.spyOn(helpers, 'generalModalData').mockReturnValue('a');
      const spiedGetHandBid = jest.spyOn(helpers, 'getHandBid').mockReturnValue(2);
      const hands = [
        [],
        [],
        [
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'}
        ]
      ];
      const returned = preBidLogic.checkPostNines(hands, ['a','b','c','d']);
      expect(returned).toEqual( {
        "postNinesGameState": "postNinesWait",
        "postNinesPlayerModal": "a",
        "postNinesPromptModal": "a"
      });
      expect(spiedGeneralModalData).toHaveBeenCalledTimes(2);
      expect(spiedGetHandBid).toHaveBeenCalledTimes(1);
    });
    it('computer disagree with redeal', () => {
      const spiedGeneralModalData = jest.spyOn(helpers, 'generalModalData').mockReturnValue('a');
      const spiedGetHandBid = jest.spyOn(helpers, 'getHandBid').mockReturnValue(22);
      const hands = [
        [],
        [],
        [
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'},
          {value: '9'}
        ]
      ];
      const returned = preBidLogic.checkPostNines(hands, ['a','b','c','d']);
      expect(returned).toEqual( {
        "postNinesGameState": "postNinesWait",
        "postNinesPlayerModal": "a",
        "postNinesPromptModal": "a"
      });
      expect(spiedGeneralModalData).toHaveBeenCalledTimes(2);
      expect(spiedGetHandBid).toHaveBeenCalledTimes(1);
    });
  });
});
