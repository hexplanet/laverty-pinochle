import * as actionTypes from '../actions/appActionTypes';
import * as reducerLogic from './appReducerLogic';
import Button from '../../components/Button';

//////////////////////////////////// start mocks ///////////////////////////////////////////

const deckOfCards = [];
for(let i = 0; i < 48; i++) {
  deckOfCards.push(
    {suit:"H", value: "10", shown: false, }
  );
}

const mockHand = [];
for(let i = 0; i < 18; i++) {
  mockHand.push(
    {suit:"H", value: "10"}
  );
}

const mockMeb = [
  {xOffset: -150, yOffset: -280, suit:"H", value: "A"},
  {xOffset: -105, yOffset: -140, suit:"H", value: "10"},
  {xOffset: -60, yOffset: -140, suit:"H", value: "K"},
  {xOffset: -15, yOffset: -140, suit:"H", value: "Q"},
  {xOffset: 30, yOffset: -140, suit:"H", value: "J"},
  {xOffset: 75, yOffset: -280, suit:"H", value: "9"},
  {xOffset: -150, yOffset: -70, suit:"S", value: "A"},
  {xOffset: -110, yOffset: -70, suit:"S", value: "10"},
  {xOffset: -70, yOffset: -70, suit:"S", value: "K"},
  {xOffset: -30, yOffset: -70, suit:"S", value: "Q"},
  {xOffset: 10, yOffset: -70, suit:"S", value: "J"},
  {xOffset: 50, yOffset: -70, suit:"S", value: "9"},
];

const mockPlayArea = [
  {xOffset: 0, yOffset: 150, suit:"H", value: "A", rotation: 0, shown: true},
  {xOffset: -150, yOffset: 0, suit:"H", value: "10",  rotation: 90, shown: true},
  {xOffset: 0, yOffset: -150, suit:"H", value: "K",  rotation: 180, shown: true},
  {xOffset: 150, yOffset: 0, suit:"H", value: "Q",  rotation: 270, shown: true},
];

const mockScore = [
  [
    { bid: '', gotSet: false, meb: 5, counts: 7, score: 12},
    { bid: '29', gotSet: true, meb: 15, counts: 13, score: -17},
    { bid: '', gotSet: false, meb: 5, counts: 7, score: 12},
    { bid: '29', gotSet: true, meb: 15, counts: 13, score: -17},
  ],
  [
    { bid: '25', gotSet: false, meb: 12, counts: 18, score: 30},
    { bid: '', gotSet: false, meb: 3, counts: 12, score: 45},
    { bid: '25', gotSet: false, meb: 12, counts: 18, score: 30},
    { bid: '', gotSet: false, meb: 3, counts: 12, score: 45},
  ]
];

const centerText = {
  textAlign: 'center',
  marginTop: '5px',
};

const clickedButton = () => {
  console.log('ClickedMe!');
};

const mockPlayerModal = {
  shown: true,
  width: 500,
  height: 100,
  message: (<div style={centerText}><b>Bid</b></div>),
  zoom: 100,
  hasCloseButton: false,
  header: false,
  hasHeaderSeparator: false,
  buttons: [
    <Button label='Pass' handleClick={clickedButton}/>,
    <Button label='<' status='inactive' handleClick={clickedButton}/>,
    <Button label='21' handleClick={clickedButton}/>,
    <Button label='22' handleClick={clickedButton}/>,
    <Button label='23' handleClick={clickedButton}/>,
    <Button label='24' handleClick={clickedButton}/>,
    <Button label='25' handleClick={clickedButton}/>,
    <Button label='>'  handleClick={clickedButton}/>,
  ],
};

const mockPromptModal = {
  shown: true,
  width: 210,
  height: 140,
  message: (<div>Bid: <b>25</b><br/>Player:<br/><b>Jessica</b><br/>Trump: <b>Hearts</b></div>),
  zoom: 100,
  hasCloseButton: false,
  header: false,
  hasHeaderSeparator: false,
};

//////////////////////////////////// end mocks ///////////////////////////////////////////

const initialState = {
  gameState: 'init',
  teams: ['Us', 'Them'],
  players: ['You', 'Steven', 'Ellen', 'Jessica'],
  playerDisplaySettings: [],
  discardPiles: [
    deckOfCards,
    deckOfCards,
    deckOfCards,
    deckOfCards,
  ],
  discardDisplaySettings: [],
  hands: [
    mockHand,
    mockHand,
    mockHand,
    mockHand,
  ],
  mebDisplaySettings: [],
  mebs: [
    mockMeb,
    mockMeb,
    mockMeb,
    mockMeb,
  ],
  miscDisplaySettings: {
    scorePad: {},
    playArea: {},
    playerModal: {},
    promptModal: {},
  },
  movingCards: [],
  dealer: 0,
  playPile: mockPlayArea,
  playPileShown: true,
  playScore: mockScore,
  gameWon: '',
  playerModal: mockPlayerModal,
  promptModal: mockPromptModal,
};

const appReducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.SET_CARD_TABLE_LAYOUT:
        const {
          playerHandLocations,
          playerDiscardLocations,
          playerMebLocations,
          miscLocations
        } = reducerLogic.playerDisplaySettingsLogic(
          action.width,
          action.height,
          state.players.length,
        );
      return {
        ...state,
        playerDisplaySettings: playerHandLocations,
        discardDisplaySettings: playerDiscardLocations,
        mebDisplaySettings: playerMebLocations,
        miscDisplaySettings: miscLocations,
      }
    case actionTypes.SETUP_FOR_NEW_GAME:
      const clearedValues = reducerLogic.setGameValuesForNewGame(state.teams, state.players);
      return {
        ...state,
        ...clearedValues
      };
    case actionTypes.THROW_FOR_ACE:
      console.log('throw card for ace');
      const dealtCard = state.discardPiles[0][state.discardPiles[0].length -1];
      const newDiscard0 = state.discardPiles[0];
      newDiscard0.pop();
      const newDiscards = state.discardPiles;
      newDiscards[0] = newDiscard0;
      const newDealer = (state.dealer + 1) % state.players.length;
      const newMovingCards = [...state.movingCards,
        {
          id: `D0${state.discardPiles[0].length}toM${newDealer}`,
          suit: dealtCard.suit,
          value: dealtCard.value,
          shown: false,
          speed: 1,
          source:{x: 1000, y: 1000, rotation: 0, zoom: 100 },
          target:{x: 100, y: 800, rotation: -720, zoom: 200 },
        }
      ];
      return {
        ...state,
        dealer: newDealer,
        gameState: 'waitForAce',
        discardPiles: newDiscards,
        movingCards: newMovingCards
      };
    default:
      return state;
  }
}

export default appReducer;