import * as helpers from './helpers';
import { Clubs } from '../components/PlayingCard/svg/Clubs';
import { Diamonds } from '../components/PlayingCard/svg/Diamonds';
import { Spades } from '../components/PlayingCard/svg/Spades';
import { Hearts } from '../components/PlayingCard/svg/Hearts';
import * as CARD_ORDER from "./cardOrder";

describe('helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('generateShuffledDeck', () => {
    it('return unshuffled deck', () => {
      const returned = helpers.generateShuffledDeck(0);
      expect(returned).toEqual([
        {"suit": "S", "value": "A"}, {"suit": "S", "value": "A"}, {"suit": "S", "value": "10"},
        {"suit": "S", "value": "10"}, {"suit": "S", "value": "K"}, {"suit": "S", "value": "K"},
        {"suit": "S", "value": "Q"}, {"suit": "S", "value": "Q"}, {"suit": "S", "value": "J"},
        {"suit": "S", "value": "J"}, {"suit": "S", "value": "9"}, {"suit": "S", "value": "9"},
        {"suit": "H", "value": "A"}, {"suit": "H", "value": "A"}, {"suit": "H", "value": "10"},
        {"suit": "H", "value": "10"}, {"suit": "H", "value": "K"}, {"suit": "H", "value": "K"},
        {"suit": "H", "value": "Q"}, {"suit": "H", "value": "Q"}, {"suit": "H", "value": "J"},
        {"suit": "H", "value": "J"}, {"suit": "H", "value": "9"}, {"suit": "H", "value": "9"},
        {"suit": "C", "value": "A"}, {"suit": "C", "value": "A"}, {"suit": "C", "value": "10"},
        {"suit": "C", "value": "10"}, {"suit": "C", "value": "K"}, {"suit": "C", "value": "K"},
        {"suit": "C", "value": "Q"}, {"suit": "C", "value": "Q"}, {"suit": "C", "value": "J"},
        {"suit": "C", "value": "J"}, {"suit": "C", "value": "9"}, {"suit": "C", "value": "9"},
        {"suit": "D", "value": "A"}, {"suit": "D", "value": "A"}, {"suit": "D", "value": "10"},
        {"suit": "D", "value": "10"}, {"suit": "D", "value": "K"}, {"suit": "D", "value": "K"},
        {"suit": "D", "value": "Q"}, {"suit": "D", "value": "Q"}, {"suit": "D", "value": "J"},
        {"suit": "D", "value": "J"}, {"suit": "D", "value": "9"}, {"suit": "D", "value": "9"}
      ]);
    });
    it('return shuffled deck', () => {
      const returned = helpers.generateShuffledDeck();
      expect(returned.length).toEqual(48);
      expect(returned).not.toEqual([
        {"suit": "S", "value": "A"}, {"suit": "S", "value": "A"}, {"suit": "S", "value": "10"},
        {"suit": "S", "value": "10"}, {"suit": "S", "value": "K"}, {"suit": "S", "value": "K"},
        {"suit": "S", "value": "Q"}, {"suit": "S", "value": "Q"}, {"suit": "S", "value": "J"},
        {"suit": "S", "value": "J"}, {"suit": "S", "value": "9"}, {"suit": "S", "value": "9"},
        {"suit": "H", "value": "A"}, {"suit": "H", "value": "A"}, {"suit": "H", "value": "10"},
        {"suit": "H", "value": "10"}, {"suit": "H", "value": "K"}, {"suit": "H", "value": "K"},
        {"suit": "H", "value": "Q"}, {"suit": "H", "value": "Q"}, {"suit": "H", "value": "J"},
        {"suit": "H", "value": "J"}, {"suit": "H", "value": "9"}, {"suit": "H", "value": "9"},
        {"suit": "C", "value": "A"}, {"suit": "C", "value": "A"}, {"suit": "C", "value": "10"},
        {"suit": "C", "value": "10"}, {"suit": "C", "value": "K"}, {"suit": "C", "value": "K"},
        {"suit": "C", "value": "Q"}, {"suit": "C", "value": "Q"}, {"suit": "C", "value": "J"},
        {"suit": "C", "value": "J"}, {"suit": "C", "value": "9"}, {"suit": "C", "value": "9"},
        {"suit": "D", "value": "A"}, {"suit": "D", "value": "A"}, {"suit": "D", "value": "10"},
        {"suit": "D", "value": "10"}, {"suit": "D", "value": "K"}, {"suit": "D", "value": "K"},
        {"suit": "D", "value": "Q"}, {"suit": "D", "value": "Q"}, {"suit": "D", "value": "J"},
        {"suit": "D", "value": "J"}, {"suit": "D", "value": "9"}, {"suit": "D", "value": "9"}
      ]);
    });
  });
  describe('generalModalData', () => {
    it('returns default modal', () => {
      const returned = helpers.generalModalData('');
      expect(returned).toEqual({
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
    it('returns modal with multi-line message', () => {
      const returned = helpers.generalModalData(['one','two','three']);
      expect(returned.message.props.children).toEqual('one</br>two</br>three</br>');
      expect(returned).toEqual({
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
    it('returns modal with message, header, and buttons', () => {
      const returned = helpers.generalModalData(
        'This is a message',
        {
          header: 'This is a header',
          buttons: {
            label: 'myButton',
            returnMessage: 'myMessage'
          }
        }
      );
      expect(returned).toEqual({
        "buttons": {
          "label": "myButton",
          "returnMessage": "myMessage"
        },
        "hasCloseButton": false,
        "hasHeaderSeparator": false,
        "header": "This is a header",
        "height": 140,
        "message": (<div>This is a message</div>),
        "shown": true,
        "width": 210,
        "zoom": 100
      });
    });
  });
  describe('getCardLocation', () => {
    const getCardLocationState = {
      playerDisplaySettings: [{x: 1000, y: 1100, zoom: 99, rotation: 182}],
      discardDisplaySettings: [{}, {x: 800, y: 1400, zoom: 39, rotation: 22}],
      meldDisplaySettings: [{}, {}, {x: 1300, y: 800, zoom: 139, rotation: 322}],
      miscDisplaySettings: { playArea: {x: 500, y: 700, zoom: 90, rotation: 1}},
      players: ['a','b','c']
    };
    it('Get a hand location with no adjustment', () => {
      const returned = helpers.getCardLocation(
        'H0',
        getCardLocationState
      );
      expect(returned).toEqual( {
        "rotation": 182,
        "x": 1000,
        "xOffset": 0,
        "y": 1100,
        "yOffset": 0,
        "zoom": 99
      });
    });
    it('Get a discard location with no adjustment', () => {
      const returned = helpers.getCardLocation(
        'D1',
        getCardLocationState
      );
      expect(returned).toEqual( {
        "rotation": 22,
        "x": 800,
        "xOffset": 0,
        "y": 1400,
        "yOffset": 0,
        "zoom": 39
      });
    });
    it('Get a meld location with adjustment', () => {
      const returned = helpers.getCardLocation(
        'M2',
        getCardLocationState,
        -20,
        12
      );
      expect(returned).toEqual(  {
        "rotation": 322,
        "x": -1480,
        "xOffset": 0,
        "y": 2468,
        "yOffset": 0,
        "zoom": 139
      });
    });
    it('3 handed get a play pile location without adjustment', () => {
      const returned = helpers.getCardLocation(
        'P1',
        getCardLocationState
      );
      expect(returned).toEqual(   {
        "rotation": 135,
        "x": 394,
        "xOffset": -106,
        "y": 594,
        "yOffset": -106,
        "zoom": 90
      });
    });
    it('4 handed get a play pile location without adjustment', () => {
      const modifiedState = {...getCardLocationState, players: ['a','b','c','d']};
      const returned = helpers.getCardLocation(
        'P1',
        modifiedState
      );
      expect(returned).toEqual(    {
        "rotation": 90,
        "x": 350,
        "xOffset": -150,
        "y": 700,
        "yOffset": -0,
        "zoom": 90
      });
    });
  });
  describe('getRandomRange', () => {
    it('random with out range returns min', () => {
      const returned = helpers.getRandomRange(2, 2, 1);
      expect(returned).toEqual(2);
    });
    it('random returns middle of range', () => {
      jest.spyOn(Math, 'random').mockReturnValue(.5);
      const returned = helpers.getRandomRange(2, 4, 1);
      expect(returned).toEqual(3);
    });
    it('random returns 25% of range with .1 step', () => {
      jest.spyOn(Math, 'random').mockReturnValue(.25);
      const returned = helpers.getRandomRange(2, 15, 0.1);
      expect(returned).toEqual(5.5);
    });
  });

  describe('createLandingCard', () => {
    it('card landing on Play Pile', () => {
      const returned = helpers.createLandingCard(
        {
          suit: 'H',
          value: '10',
          shown: true,
          target: {
            xOffset: 12,
            yOffset: 23,
            rotation: 45
          },
          frontColor: '#abc'
        },
        'P'
      );
      expect(returned).toEqual( {
        suit: 'H',
        value: '10',
        shown: true,
        clickable: false,
        rolloverColor: '',
        xOffset: 12,
        yOffset: 23,
        rotation: 45,
        frontColor: '#abc'
      });
    });
    it('card landing on Meld Pile', () => {
      const returned = helpers.createLandingCard(
        {
          suit: 'H',
          value: '10',
          shown: true,
          target: {
            xOffset: 12,
            yOffset: 23,
            rotation: 45
          },
          frontColor: '#abc'
        },
        'M'
      );
      expect(returned).toEqual( {
        suit: 'H',
        value: '10',
        shown: true,
        clickable: false,
        rolloverColor: '',
        xOffset: 12,
        yOffset: 23,
        rotation: 45,
        frontColor: '#abc'
      });
    });
    it('card landing on Discard Pile', () => {
      jest.spyOn(Math, 'random').mockReturnValue(.75);
      const returned = helpers.createLandingCard(
        {
          suit: 'H',
          value: '10',
          shown: true,
          target: {
            xOffset: 12,
            yOffset: 23,
            rotation: 45
          },
          frontColor: '#abc'
        },
        'D'
      );
      expect(returned).toEqual( {
        suit: 'H',
        value: '10',
        shown: true,
        clickable: false,
        rolloverColor: '',
        xOffset: 4,
        yOffset: 4,
        rotation: 5,
        frontColor: '#abc'
      });
    });
    it('card landing on Hand', () => {
      jest.spyOn(Math, 'random').mockReturnValue(.25);
      const returned = helpers.createLandingCard(
        {
          suit: 'H',
          value: '10',
          shown: true,
          target: {
            xOffset: 12,
            yOffset: 23,
            rotation: 45
          },
          frontColor: '#abc'
        },
        'D'
      );
      expect(returned).toEqual( {
        suit: 'H',
        value: '10',
        shown: true,
        clickable: false,
        rolloverColor: '',
        xOffset: -4,
        yOffset: -4,
        rotation: -5,
        frontColor: '#abc'
      });
    });
  });
  describe('sortCardHand', () => {
    it('returns sorted cards', () => {
      const returned = helpers.sortCardHand([
        {suit: 'S', value: '9'},
        {suit: 'H', value: 'A'},
        {suit: 'S', value: 'K'},
        {suit: 'D', value: 'J'},
        {suit: 'S', value: 'Q'},
        {suit: 'C', value: '9'},
        {suit: 'S', value: '10'},
        {suit: 'C', value: '10'},
        {suit: 'D', value: 'A'},
        {suit: 'S', value: 'J'},
        {suit: 'S', value: 'A'},
      ]);
      expect(returned).toEqual( [
        { suit: 'S', value: 'A' },
        { suit: 'S', value: '10' },
        { suit: 'S', value: 'K' },
        { suit: 'S', value: 'Q' },
        { suit: 'S', value: 'J' },
        { suit: 'S', value: '9' },
        { suit: 'H', value: 'A' },
        { suit: 'C', value: '10' },
        { suit: 'C', value: '9' },
        { suit: 'D', value: 'A' },
        { suit: 'D', value: 'J' }
      ]);
    });
  });
  describe('getHandMeld', () => {
    it('returns basic meld', () => {
      const returned = helpers.getHandMeld([
        {suit: 'S', value: '9'},
        {suit: 'H', value: 'A'},
        {suit: 'S', value: 'K'},
        {suit: 'D', value: 'J'},
        {suit: 'S', value: 'Q'},
        {suit: 'C', value: '9'},
        {suit: 'S', value: '10'},
        {suit: 'C', value: '10'},
        {suit: 'D', value: 'A'},
        {suit: 'S', value: 'J'},
        {suit: 'S', value: 'A'},
      ],
        'S'
      );
      expect(returned).toEqual( {
        points: 20,
        nearMiss: 1,
        cardsUsed: ['SA', 'S10', 'SK', 'SQ', 'SJ', 'S9', 'DJ'],
        textDisplay: '<br/>Run<br/>9 of Trump<br/>Pinochle'
      });
    });
    it('returns roundhouse with pinocle', () => {
      const returned = helpers.getHandMeld([
          {suit: 'S', value: 'K'},
          {suit: 'S', value: 'Q'},
          {suit: 'D', value: 'K'},
          {suit: 'D', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'H', value: '10'},
          {suit: 'D', value: 'J'},
        ],
        'H'
      );
      expect(returned).toEqual({
        points: 28,
        nearMiss: 2,
        cardsUsed: [ 'HK', 'DK', 'SK', 'CK', 'HQ', 'DQ', 'SQ', 'CQ', 'DJ'],
        textDisplay: '<br/>Kings<br/>Queens<br/>Pinochle<br/>Royal Marriage in Hearts<br/>Marriage in Diamonds<br/>Marriage in Clubs<br/>Marriage in Spades'
      });
    });
    it('returns roundhouse ', () => {
      const returned = helpers.getHandMeld([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'H', value: '10'},
          {suit: 'H', value: 'J'},
        ],
        'H'
      );
      expect(returned).toEqual( {
        points: 23,
        nearMiss: 0,
        cardsUsed: ['HA', 'H10', 'HK', 'HQ', 'HJ',  'HK', 'HQ', 'CK',  'CK', 'CQ', 'CQ'],
        textDisplay: '<br/>Run<br/>Royal Marriage in Hearts<br/>2 Marriage in Clubs'
      });
    });
  });
  describe('getProjectedCount', () => {
    it('projected count for a 3 handed hand, pre-widow', () => {
      const returned = helpers.getProjectedCount([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'H', value: '10'},
          {suit: 'H', value: 'J'},
        ],
        'H',
        ['a','b','c']
      );
      expect(returned).toEqual( {
        projectedCounts: 22,
        howManyTrump: 7,
        totalWins: ['HA', 'H10', 'HK', 'HK', 'HQ', 'HQ', 'HJ']
      });
    });
    it('projected count for a 3 handed hand, not pre-widow', () => {
      const returned = helpers.getProjectedCount([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'H', value: '10'},
          {suit: 'H', value: 'J'},
        ],
        'H',
        ['a','b','c'],
        false
      );
      expect(returned).toEqual( {
        projectedCounts: 20,
        howManyTrump: 7,
        totalWins: ['HA', 'H10', 'HK', 'HK', 'HQ', 'HQ', 'HJ']
      });
    });
    it('projected count for a 4 handed hand, pre-widow', () => {
      const returned = helpers.getProjectedCount([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        'H',
        ['a', 'b', 'c', 'd']
      );
      expect(returned).toEqual({
        projectedCounts: 16,
        howManyTrump: 5,
        totalWins: [ 'HA', 'HK', 'HQ', 'HQ' ]
      });
    });
    it('projected count for a 4 handed hand, not pre-widow', () => {
      const returned = helpers.getProjectedCount([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        'H',
        ['a', 'b', 'c', 'd']
      );
      expect(returned).toEqual(  {
        projectedCounts: 16,
        howManyTrump: 5,
        totalWins: [ 'HA', 'HK', 'HQ', 'HQ' ]
      });
    });
    it('maximum projected counts', () => {
      const returned = helpers.getProjectedCount([
          {suit: 'C', value: 'A'},
          {suit: 'C', value: 'A'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'A'},
          {suit: 'C', value: 'A'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'H', value: '10'},
          {suit: 'H', value: 'J'},
        ],
        'H',
        ['a','b','c','d'],
        false
      );
      expect(returned).toEqual({
        projectedCounts: 25,
        howManyTrump: 7,
        totalWins: ['HA', 'H10', 'HK', 'HK', 'HQ',  'HQ', 'HJ', 'CA',  'CA']
      });
    });
  });
  describe('getHandBid', () => {
    it('get computer bid for a 4 handed hand', () => {
      const returned = helpers.getHandBid([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        ['a','b','c','d']
      );
      expect(returned).toEqual(22);
    });
    it('get computer bid for a 3 handed hand', () => {
      const returned = helpers.getHandBid([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        ['a','b','c']
      );
      expect(returned).toEqual(18);
    });
  });
  describe('getTrumpSuit', () => {
    it('get trump suit for computer', () => {
      const returned = helpers.getTrumpSuit([
        {suit: 'C', value: 'K'},
        {suit: 'C', value: 'Q'},
        {suit: 'H', value: 'K'},
        {suit: 'H', value: 'Q'},
        {suit: 'C', value: 'Q'},
        {suit: 'C', value: 'K'},
        {suit: 'S', value: '9'},
        {suit: 'H', value: 'Q'},
        {suit: 'H', value: 'A'},
        {suit: 'S', value: '9'},
        {suit: 'H', value: 'J'},
      ],
      ['a','b','c']
      );
      expect(returned).toEqual('H');
    });
  });
  describe('getWinValue', () => {
    it('get trump suit for computer', () => {
      const hand = [
        {suit: 'C', value: 'K'},
        {suit: 'C', value: 'Q'},
        {suit: 'H', value: '10'},
        {suit: 'H', value: 'A'},
        {suit: 'C', value: 'Q'},
        {suit: 'C', value: 'K'},
        {suit: 'S', value: '9'},
        {suit: 'H', value: 'Q'},
        {suit: 'H', value: 'A'},
        {suit: 'S', value: '9'},
        {suit: 'H', value: 'J'},
      ];
      const expectedReturns =  [
        { winValue: 0, cardsInSuit: 4 },
        { winValue: 0, cardsInSuit: 4 },
        { winValue: 1, cardsInSuit: 5 },
        { winValue: 1, cardsInSuit: 5 },
        { winValue: 0, cardsInSuit: 4 },
        { winValue: 0, cardsInSuit: 4 },
        { winValue: 0, cardsInSuit: 2 },
        { winValue: 1, cardsInSuit: 5 },
        { winValue: 1, cardsInSuit: 5 },
        { winValue: 0, cardsInSuit: 2 },
        { winValue: 1, cardsInSuit: 5 }
      ];
      hand.forEach((card, cardIndex) => {
        expect(helpers.getWinValue(hand, cardIndex)).toEqual(expectedReturns[cardIndex]);
      });
    });
  });
  describe('suitIconSelector', () => {
    it('get icon for Spades', () => {
      expect(helpers.suitIconSelector('S')).toEqual(<Spades />);
    });
    it('get icon for Clubs', () => {
      expect(helpers.suitIconSelector('C')).toEqual(<Clubs />);
    });
    it('get icon for Diamonds', () => {
      expect(helpers.suitIconSelector('D')).toEqual(<Diamonds />);
    });
    it('get icon for Hearts', () => {
      expect(helpers.suitIconSelector('H')).toEqual(<Hearts />);
    });
  });
  describe('getFormedSuitIcon', () => {
    it('get formatted icon for Spades', () => {
      const returned = helpers.getFormedSuitIcon('S');
      expect(returned.props.style).toEqual({
        width: '24px',
        height: '24px',
        display: 'inline-block',
        margin: '3px'
      });
    });
  });
  describe('getTrumpBidHeader', () => {
    it('returns formatted trump header', () => {
      const returned = helpers.getTrumpBidHeader('H', 0, 28, ['Keith']);
      expect(returned.hasHeaderSeparator).toEqual(true);
      expect(returned.header.props.children.length).toEqual(3);
    });
  });
  describe('getHandLeaderMessage', () => {
    it('Give leader of the hand', () => {
      const returned = helpers.getHandLeaderMessage(
        'S',
        'Q',
        'D',
        '10',
        ['a', 'b', 'c', 'd'],
        0,
        1
      );
      expect(returned.props.children[0].props.children[0].props.children).toEqual('a');
      expect(returned.props.children[2].props.children[0].props.children).toEqual('b');
      expect(returned.props.children[2].props.children[2].props.children).toEqual('10');
    });
  });
  describe('getHandWinMessage', () => {
    it('Give leader of the hand', () => {
      const returned = helpers.getHandWinMessage(
        'S',
        'Q',
        ['a', 'b', 'c', 'd'],
        1
      );
      expect(returned.props.children[0].props.children).toEqual('b');
      expect(returned.props.children[2].props.children).toEqual('Q');
      expect(returned.props.children[3].props.children).toEqual(<Spades />);
    });
  });
  describe('setValidCardIndexes', () => {
    const hand = [
      {suit: 'C', value: 'K'},
      {suit: 'C', value: 'Q'},
      {suit: 'H', value: '10'},
      {suit: 'H', value: 'A'},
      {suit: 'C', value: 'Q'},
      {suit: 'C', value: 'K'},
      {suit: 'S', value: '9'},
      {suit: 'H', value: 'Q'},
      {suit: 'H', value: 'A'},
      {suit: 'S', value: '9'},
      {suit: 'H', value: 'J'},
    ];
    it('Valid card index for the first lead', () => {
      const returned = helpers.setValidCardIndexes(
        hand,
        '',
        'H',
        true
      );
      expect(returned).toEqual([ 2, 3, 7, 8, 10 ]);
    });
    it('Valid card index for the non-first lead', () => {
      const returned = helpers.setValidCardIndexes(
        hand,
        '',
        'H',
        false
      );
      expect(returned).toEqual([  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
    });
    it('Valid card index for trump follow', () => {
      const returned = helpers.setValidCardIndexes(
        hand,
        'H',
        'H',
        false,
        'Q'
      );
      expect(returned).toEqual([ 2, 3, 8 ]);
    });
    it('Valid card index for follow', () => {
      const returned = helpers.setValidCardIndexes(
        hand,
        'C',
        'H',
        false
      );
      expect(returned).toEqual([  0, 1, 4, 5 ]);
    });
    it('Valid card for trumping', () => {
      const returned = helpers.setValidCardIndexes(
        hand,
        'D',
        'H',
        false
      );
      expect(returned).toEqual([ 2, 3, 7, 8, 10 ]);
    });
    it('Valid card for playing off suit', () => {
      const returned = helpers.setValidCardIndexes(
        hand,
        'D',
        'D',
        false
      );
      expect(returned).toEqual([  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
    });
  });
  describe('getUnplayedCards', () => {
    const hand = [
      {suit: 'C', value: 'K'},
      {suit: 'C', value: 'Q'},
      {suit: 'H', value: '10'},
      {suit: 'H', value: 'A'},
      {suit: 'C', value: 'Q'},
      {suit: 'C', value: 'K'},
      {suit: 'S', value: '9'},
      {suit: 'H', value: 'Q'},
      {suit: 'H', value: 'A'},
      {suit: 'S', value: '9'},
      {suit: 'H', value: 'J'},
    ];
    it('Get all cards outside of hand as unplayed', () => {
      const returned = helpers.getUnplayedCards(
        hand,
        [[],[],[],[]],
        []
      );
      expect(returned).toEqual([
        { suit: 'S', value: 'A' }, { suit: 'S', value: 'A' }, { suit: 'S', value: '10' },
        { suit: 'S', value: '10' }, { suit: 'S', value: 'K' }, { suit: 'S', value: 'K' },
        { suit: 'S', value: 'Q' }, { suit: 'S', value: 'Q' }, { suit: 'S', value: 'J' },
        { suit: 'S', value: 'J' }, { suit: 'H', value: '10' }, { suit: 'H', value: 'K' },
        { suit: 'H', value: 'K' }, { suit: 'H', value: 'Q' }, { suit: 'H', value: 'J' },
        { suit: 'H', value: '9' }, { suit: 'H', value: '9' }, { suit: 'C', value: 'A' },
        { suit: 'C', value: 'A' }, { suit: 'C', value: '10' }, { suit: 'C', value: '10' },
        { suit: 'C', value: 'J' }, { suit: 'C', value: 'J' }, { suit: 'C', value: '9' },
        { suit: 'C', value: '9' }, { suit: 'D', value: 'A' }, { suit: 'D', value: 'A' },
        { suit: 'D', value: '10' }, { suit: 'D', value: '10' }, { suit: 'D', value: 'K' },
        { suit: 'D', value: 'K' }, { suit: 'D', value: 'Q' }, { suit: 'D', value: 'Q' },
        { suit: 'D', value: 'J' }, { suit: 'D', value: 'J' }, { suit: 'D', value: '9' },
        { suit: 'D', value: '9' }
      ]);
    });
    it('Get all cards outside of hand and widow as unplayed', () => {
      const returned = helpers.getUnplayedCards(
        hand,
        [[],[],[],[]],
        [ { suit: 'D', value: '10' }, { suit: 'D', value: '10' }, { suit: 'D', value: 'K' }]
      );
      expect(returned).toEqual([
        { suit: 'S', value: 'A' }, { suit: 'S', value: 'A' }, { suit: 'S', value: '10' },
        { suit: 'S', value: '10' }, { suit: 'S', value: 'K' }, { suit: 'S', value: 'K' },
        { suit: 'S', value: 'Q' }, { suit: 'S', value: 'Q' }, { suit: 'S', value: 'J' },
        { suit: 'S', value: 'J' }, { suit: 'H', value: '10' }, { suit: 'H', value: 'K' },
        { suit: 'H', value: 'K' }, { suit: 'H', value: 'Q' }, { suit: 'H', value: 'J' },
        { suit: 'H', value: '9' }, { suit: 'H', value: '9' }, { suit: 'C', value: 'A' },
        { suit: 'C', value: 'A' }, { suit: 'C', value: '10' }, { suit: 'C', value: '10' },
        { suit: 'C', value: 'J' }, { suit: 'C', value: 'J' }, { suit: 'C', value: '9' },
        { suit: 'C', value: '9' }, { suit: 'D', value: 'A' }, { suit: 'D', value: 'A' },
        { suit: 'D', value: 'K' }, { suit: 'D', value: 'Q' }, { suit: 'D', value: 'Q' },
        { suit: 'D', value: 'J' }, { suit: 'D', value: 'J' }, { suit: 'D', value: '9' },
        { suit: 'D', value: '9' }
      ]);
    });
    it('Get all cards outside of hand and widow and played cards as unplayed', () => {
      const returned = helpers.getUnplayedCards(
        hand,
        [[
          { suit: 'S', value: 'Q' }, { suit: 'S', value: 'Q' }, { suit: 'S', value: 'J' }
        ],[
          { suit: 'H', value: '9' }, { suit: 'H', value: '9' }, { suit: 'C', value: 'A' }
        ],[
          { suit: 'C', value: 'J' }, { suit: 'C', value: 'J' }, { suit: 'C', value: '9' }
        ],[
          { suit: 'D', value: 'K' }, { suit: 'D', value: 'Q' }, { suit: 'D', value: 'Q' }
        ]],
        [ { suit: 'D', value: '10' }, { suit: 'D', value: '10' }, { suit: 'D', value: 'K' }]
      );
      expect(returned).toEqual([
        { suit: 'S', value: 'A' }, { suit: 'S', value: 'A' }, { suit: 'S', value: '10' },
        { suit: 'S', value: '10' }, { suit: 'S', value: 'K' }, { suit: 'S', value: 'K' },
        { suit: 'S', value: 'J' }, { suit: 'H', value: '10' }, { suit: 'H', value: 'K' },
        { suit: 'H', value: 'K' }, { suit: 'H', value: 'Q' }, { suit: 'H', value: 'J' },
        { suit: 'C', value: 'A' }, { suit: 'C', value: '10' }, { suit: 'C', value: '10' },
        { suit: 'C', value: '9' }, { suit: 'D', value: 'A' }, { suit: 'D', value: 'A' },
        { suit: 'D', value: 'J' }, { suit: 'D', value: 'J' }, { suit: 'D', value: '9' },
        { suit: 'D', value: '9' }
      ]);
    });
  });
  describe('getWinningCards', () => {
    const hand = [
      {suit: 'C', value: 'K'},
      {suit: 'C', value: 'Q'},
      {suit: 'H', value: '10'},
      {suit: 'H', value: 'A'},
      {suit: 'C', value: 'Q'},
      {suit: 'C', value: 'K'},
      {suit: 'S', value: '9'},
      {suit: 'H', value: 'Q'},
      {suit: 'H', value: 'A'},
      {suit: 'S', value: '9'},
      {suit: 'H', value: 'J'},
    ];
    it('Get all winning cards in the hand on first play', () => {
      const returned = helpers.getWinningCards(
        [hand, [], []],
        [
          {suit: 'H', value: 'A'},
          {suit: 'H', value: '10'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'J'},
          {suit: 'H', value: '9'},
          {suit: 'H', value: '9'},
        ],
        [[],[],[]],
        'H',
        0,
        true
      );
      expect(returned).toEqual([ { suit: 'H', value: 'A' } ]);
    });
    it('Get all winning cards in the hand on first play', () => {
      const returned = helpers.getWinningCards(
        [hand, [], []],
        [
          {suit: 'H', value: 'A'},
          {suit: 'H', value: '10'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'J'},
          {suit: 'H', value: '9'},
          {suit: 'H', value: '9'},
        ],
        [[],[],[]],
        'H',
        0,
        false
      );
      expect(returned).toEqual([
        { suit: 'S', value: '9' },
        { suit: 'H', value: 'A' },
        { suit: 'C', value: 'Q' }
      ]);
    });
  });
  describe('getHighestNonCount', () => {
    it('Get Highest Non-Count in all suits, not limited to non-count', () => {
      const returned = helpers.getHighestNonCount([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        '',
        false
      );
      expect(returned).toEqual({ suit: 'C', value: 'Q' });
    });
    it('Get Highest Non-Count in all suits, not limited to non-count', () => {
      const returned = helpers.getHighestNonCount([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        'C',
        false
      );
      expect(returned).toEqual({ suit: 'C', value: 'Q' });
    });
    it('Get Highest Non-Count in all suits, limited to non-count', () => {
      const returned = helpers.getHighestNonCount([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        'C',
        true
      );
      expect(returned).toEqual({ suit: 'C', value: 'Q' });
    });
  });
  describe('getLowestNonCount', () => {
    it('Get Lowest Non-Count in all suits, not limited to non-count', () => {
      const returned = helpers.getLowestNonCount([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        '',
        false
      );
      expect(returned).toEqual({ suit: 'S', value: '9' });
    });
    it('Get Lowest Non-Count in all suits, not limited to non-count', () => {
      const returned = helpers.getLowestNonCount([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        'C',
        false
      );
      expect(returned).toEqual({ suit: 'C', value: 'Q' });
    });
    it('Get Lowest Non-Count in all suits, limited to non-count', () => {
      const returned = helpers.getLowestNonCount([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        'C',
        true
      );
      expect(returned).toEqual({ suit: 'C', value: 'Q' });
    });
  });
  describe('getBestCounter', () => {
    it('Get Best Counter in all suits, not limited to non-count', () => {
      const returned = helpers.getBestCounter([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        '',
        false
      );
      expect(returned).toEqual({ suit: 'C', value: 'K' });
    });
    it('Get Best Counter in all suits, not limited to non-count', () => {
      const returned = helpers.getBestCounter([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        'C',
        false
      );
      expect(returned).toEqual({ suit: 'C', value: 'K' });
    });
    it('Get Best Counter in all suits, limited to non-count', () => {
      const returned = helpers.getBestCounter([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        'C',
        true
      );
      expect(returned).toEqual({ suit: 'C', value: 'K' });
    });
  });
  describe('getCardValueByArray', () => {
    it('Find cards by value and suit', () => {
      const returned = helpers.getCardValueByArray([
          {suit: 'C', value: 'K'},
          {suit: 'C', value: 'Q'},
          {suit: 'H', value: 'K'},
          {suit: 'H', value: 'Q'},
          {suit: 'C', value: 'Q'},
          {suit: 'C', value: 'K'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'Q'},
          {suit: 'H', value: 'A'},
          {suit: 'S', value: '9'},
          {suit: 'H', value: 'J'},
        ],
        'C',
        CARD_ORDER.BEST_COUNTER,
        2
      );
      expect(returned).toEqual({ suit: 'C', value: 'K' });
    });
  });
  describe('getTrumpPullingSuits', () => {
    it('Find suits to pull trump in 3 handed', () => {
      const returned = helpers.getTrumpPullingSuits(
        [[],['H'],[]],
        'C',
        0
      );
      expect(returned).toEqual(['H']);
    });
    it('Find suits to pull trump in 4 handed', () => {
      const returned = helpers.getTrumpPullingSuits(
        [[],['H'],[],[]],
        'C',
        0
      );
      expect(returned).toEqual(['H']);
    });
  });
  describe('getPartnerPassSuits', () => {
    it('Find no suits to pass', () => {
      const returned = helpers.getPartnerPassSuits(
        [[],[],[],[]],
        'H',
        0,
        [],
        [[],[],[],[]]
      );
      expect(returned).toEqual([]);
    });
    it('Find suits to pass', () => {
      const returned = helpers.getPartnerPassSuits(
        [[],[],[],[]],
        'H',
        0,
        [{value: 'A', suit: 'S'}],
        [[],[],[{value: 'A', suit: 'S'}],[]]
      );
      expect(returned).toEqual([ 'S' ]);
    });
  });
  describe('throwCardIntoMiddle', () => {
    it('Creates a move card to go to the play pile', () => {
      const spiedGetCardLocation = jest.spyOn(helpers, 'getCardLocation').mockReturnValue(['a']);
      jest.spyOn(Date, 'now').mockReturnValue(-1);
      const state = {
        hands: [
          [
            {suit: 'C', value: 'K'},
            {suit: 'C', value: 'Q'},
            {suit: 'S', value: 'A'},
            {suit: 'H', value: 'Q'},
            {suit: 'C', value: 'Q'},
            {suit: 'C', value: 'K'},
            {suit: 'S', value: '9'},
            {suit: 'H', value: 'Q'},
            {suit: 'H', value: 'A'},
            {suit: 'S', value: '9'},
            {suit: 'H', value: 'J'},
          ],
          [],
          []
        ],
        playerDisplaySettings: [{x: 1000, y: 1100, zoom: 99, rotation: 182}],
        discardDisplaySettings: [{}, {x: 800, y: 1400, zoom: 39, rotation: 22}],
        meldDisplaySettings: [{}, {}, {x: 1300, y: 800, zoom: 139, rotation: 322}],
        miscDisplaySettings: { playArea: {x: 500, y: 700, zoom: 90, rotation: 1}},
        players: ['a','b','c']
      };
      const returned = helpers.throwCardIntoMiddle(state, 0, 2);
      expect(returned).toEqual({
        id: 'H02toP0',
        keyId: 'H02toP0-1',
        suit: 'S',
        value: 'A',
        shown: true,
        speed: 1,
        source: {
          x: 1000,
          y: 1100,
          xOffset: 0,
          yOffset: 0,
          rotation: 182,
          zoom: 198
        },
        target: { x: 500, y: 850, xOffset: 0, yOffset: 150, rotation: 0, zoom: 90 }
      });
    });
  });
  describe('getWinner', () => {
    it('finds no winner', () => {
      const playScore = [
        [{score:89}],
        [{score:89}]
      ];
      const returned = helpers.getWinner(playScore, 0);
      expect(returned).toEqual(-1);
    });
    it('finds team 1 the winner', () => {
      const playScore = [
        [{score:121}],
        [{score:89}]
      ];
      const returned = helpers.getWinner(playScore, 0);
      expect(returned).toEqual(0);
    });
    it('finds team 2 the winner', () => {
      const playScore = [
        [{score:89}],
        [{score:121}]
      ];
      const returned = helpers.getWinner(playScore, 0);
      expect(returned).toEqual(1);
    });
    it('finds a tie', () => {
      const playScore = [
        [{score:89}],
        [{score:121}],
        [{score:121}]
      ];
      const returned = helpers.getWinner(playScore, 0);
      expect(returned).toEqual(-1);
    });
    it('finds a team 2 wins over team 3 with team 1 having taken the bid', () => {
      const playScore = [
        [{score:89}],
        [{score:123}],
        [{score:121}]
      ];
      const returned = helpers.getWinner(playScore, 0);
      expect(returned).toEqual(1);
    });
    it('finds a team 3 wins over team 2 with team 1 having taken the bid', () => {
      const playScore = [
        [{score:89}],
        [{score:121}],
        [{score:124}]
      ];
      const returned = helpers.getWinner(playScore, 0);
      expect(returned).toEqual(2);
    });
  });
});