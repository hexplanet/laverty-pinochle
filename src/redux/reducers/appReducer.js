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
  players: ['You', 'Steven', 'Ellen'],
  playerDisplaySettings: [],
  discardPiles: [
    deckOfCards,
    deckOfCards,
    deckOfCards,
    deckOfCards,
  ],
  discardDisplaySettings: [],
  showHands: [],
  handFanOut: -1,
  hands: [
    mockHand,
    mockHand,
    mockHand,
    mockHand,
  ],
  bids: [],
  bidOffset: 21,
  trumpSuit: '',
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
  zoomRatio: 1,
  dealer: 0,
  dealToPlayer: 0,
  playPile: mockPlayArea,
  playPileShown: true,
  playScore: mockScore,
  gameWon: '',
  playerModal: mockPlayerModal,
  promptModal: mockPromptModal,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CARD_TABLE_LAYOUT:
      const {
        playerHandLocations,
        playerDiscardLocations,
        playerMebLocations,
        miscLocations,
        zoomRatio
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
        zoomRatio
      };
    case actionTypes.STORE_GAME_STATE:
      return {
        ...state,
        gameState: action.gameState,
      };
    case actionTypes.CLEAR_PLAYER_MODAL:
      if (!action.hide) {
        return {
          ...state,
          playerModal: {...state.playerModal, shown: false},
        };
      }
      const blankedPlayerModal = {
        message: '',
        textInputs: [],
        buttons: [],
      };
      return {
        ...state,
        playerModal: {...state.playerModal, ...blankedPlayerModal},
      };
    case actionTypes.CLEAR_PROMPT_MODAL:
      const blankedPromptModal = {
        message: '',
        textInputs: [],
        buttons: [],
      };
      return {
        ...state,
        playerModal: {...state.playerModal, ...blankedPromptModal},
      };
    case actionTypes.RESOLVE_CARD_MOVEMENT:
      const modifiedValues = reducerLogic.resolveCardMovement(
        action.id,
        action.keyId,
        state.movingCards,
        state.hands,
        state.mebs,
        state.discardPiles,
        state.playPile);
      if (modifiedValues.movingCards?.length === 0) {
        modifiedValues.gameState = `${state.gameState}:complete`;
      }
      return {
        ...state,
        ...modifiedValues,
      };
    case actionTypes.SETUP_FOR_NEW_GAME:
      const clearedValues = reducerLogic.setGameValuesForNewGame(state.teams, state.players);
      return {
        ...state,
        ...clearedValues
      };
    case actionTypes.THROW_FOR_ACE:
      const {
        newDealer,
        newDiscards,
        newMovingCard
      } = reducerLogic.throwCardForDeal(state);
      const newMovingCards = [...state.movingCards, newMovingCard];
      return {
        ...state,
        dealer: newDealer,
        gameState: 'waitForAce',
        discardPiles: newDiscards,
        movingCards: newMovingCards
      };
    case actionTypes.SELECTED_DEALER:
      const {
        dealerPromptModal,
      } = reducerLogic.declareDealer(
        state.players,
        state.dealer
      );
      return {
        ...state,
        promptModal: dealerPromptModal,
        gameState: 'preMoveDeckToDealer',
      };
    case actionTypes.MOVE_CARD_TO_DEALER:
      const {
        toDealerMovingCards,
        toDealerMebs,
        toDealerDiscards,
        toDealerHands,
        toDealerPlayPile
      } = reducerLogic.passDeckToDealer(state);
      return {
        ...state,
        movingCards: toDealerMovingCards,
        mebs: toDealerMebs,
        discardPiles: toDealerDiscards,
        hands: toDealerHands,
        playPile: toDealerPlayPile,
      };
    case actionTypes.PRE_DEAL:
      const {
        shuffledCards,
        clearPlayerPrompt
      } = reducerLogic.preDealing(
          state.discardPiles,
          state.dealer
      );
      const newShowHands = [];
      for(let i = 0; i < state.players.length; i++) {
        newShowHands.push(true); // (i === 0);
      }
      return {
        ...state,
        discardPiles: shuffledCards,
        dealToPlayer: (state.dealer + 1) % (state.players.length),
        showHands: newShowHands,
        promptModal: clearPlayerPrompt,
        handFanOut: -1,
      };
    case actionTypes.DEAL_CARDS:
      const {
        dealDeck,
        dealCards,
      } = reducerLogic.dealing(state);
      return {
        ...state,
        discardPiles: dealDeck,
        movingCards: dealCards,
        dealToPlayer: (state.dealToPlayer + 1) % (state.players.length),
        bidOffset: 21,
      };
    case actionTypes.SET_HAND_FAN_OUT:
      return {
        ...state,
        handFanOut: action.fanOut,
      };
    case actionTypes.CHECK_FOR_NINES:
      const {
        ninesPromptModal,
        ninesPlayerModal,
        ninesGameState
      } = reducerLogic.checkForNines(
        state.hands,
        state.players,
        state.promptModal,
        state.playerModal
      );
      let ninesState = {
        ...state,
        gameState: ninesGameState,
      };
      if (ninesPromptModal) {
        ninesState = {
          ...ninesState,
          promptModal: ninesPromptModal,
        };
      }
      if (ninesPlayerModal) {
        ninesState = {
          ...ninesState,
          playerModal: ninesPlayerModal,
        };
      }
      return ninesState;
    case actionTypes.PARTNER_CONFIRM_NINES_REDEAL:
      const {
        postNinesPromptModal,
        postNinesPlayerModal,
        postNinesGameState
      } = reducerLogic.checkPostNines(
        state.hands,
        state.players,
        state.promptModal,
        state.playerModal
      );
      return {
        ...state,
        gameState: postNinesGameState,
        promptModal: postNinesPromptModal,
        playerModal: postNinesPlayerModal
      }
    case actionTypes.OPEN_BIDDING:
      const firstBid = (state.dealer + 1) % (state.players.length);
      const {
        sortedHands,
        firstBidPrompt
      } = reducerLogic.openBidding(
        state.hands,
        state.players,
        firstBid,
        state.playerModal,
        state.bidOffset,
      );
      return {
        ...state,
        hands: sortedHands,
        dealToPlayer: firstBid,
        promptModal: firstBidPrompt,
        gameState: (firstBid === 0) ? 'userBid' : 'computerBid',
      };
    case actionTypes.RESOLVE_COMPUTER_BID:
      const { newComputerBid } = reducerLogic.computerBid(
        state.hands,
        state.dealToPlayer,
        state.players
      );
      return {
        ...state,
      };
    default:
        return state;
  }
};
export default appReducer;