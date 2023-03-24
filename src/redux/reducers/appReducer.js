import * as actionTypes from '../actions/appActionTypes';
import * as reducerLogic from './appReducerLogic';
import {
  generalModalData,
} from '../../utils/helpers';
import {shouldUserThrowHand} from "./appReducerLogic";

const initialState = {
  gameState: 'init',
  teams: ['Us', 'Them'],
  players: ['You', 'Steven', 'Ellen', 'Jessica'],
  playerDisplaySettings: [],
  discardPiles: [],
  discardDisplaySettings: [],
  showHands: [],
  handFanOut: -1,
  hands: [],
  bids: [],
  tookBid: 0,
  bidAmount: 0,
  tookHand: 0,
  bidModals: [],
  bidOffset: 21,
  trumpSuit: '',
  mebDisplaySettings: [],
  mebs: [],
  miscDisplaySettings: {
    scorePad: {},
    playArea: {},
    playerModal: {},
    promptModal: {},
    gameBidModals: [],
  },
  movingCards: [],
  zoomRatio: 1,
  dealer: 0,
  dealToPlayer: 0,
  playPile: {shown: false},
  playPileShown: true,
  playScore: [],
  gameWon: '',
  playerModal: {shown: false},
  promptModal: {shown: false},
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
        state.playPile
      );
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
        newShowHands.push(false);
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
      );
      const ninesShowHands = [];
      for(let i = 0; i < state.players.length; i++) {
        ninesShowHands.push(i === 0);
      }
      let ninesState = {
        ...state,
        showHands: ninesShowHands,
        gameState: ninesGameState,
        dealToPlayer: state.dealer,
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
      );
      return {
        ...state,
        gameState: postNinesGameState,
        promptModal: postNinesPromptModal,
        playerModal: postNinesPlayerModal
      }
    case actionTypes.NEXT_BID:
      const nextBid = (state.dealToPlayer + 1) % (state.players.length);
      const {
        nextBidPrompt
      } = reducerLogic.nextBid(
        state.players,
        nextBid,
      );
      const allBids = state.bids.reduce((a, b) => a + b, 0);
      if (nextBid === state.dealer && allBids === 0)  {
        const forcedBid = [...state.bids];
        forcedBid[nextBid] = 20;
        const shownForcedBid = state.bidModals;
        shownForcedBid[nextBid] = generalModalData('', {
          header: '20',
          width: 80,
          height: 44,
        });
        return {
          ...state,
          gameState: 'biddingComplete',
          bids: [...forcedBid],
          promptModal: nextBidPrompt,
          bidModals: [...shownForcedBid]
        };
      }
      return {
        ...state,
        dealToPlayer: nextBid,
        promptModal: nextBidPrompt,
        gameState: (nextBid === 0) ? 'userBid' : 'computerBid',
      };
    case actionTypes.GET_USER_BID:
      let initialBidOffset = state.bidOffset;
      if (action.selection !== '') {
        const splitBid = action.selection.split('bid_')[1];
        if (splitBid !== 'left' && splitBid !== 'right') {
          const userBids = state.bids;
          userBids[0] = Number(splitBid);
          const userBidGameState = (state.dealToPlayer === state.dealer)
            ? 'biddingComplete' : 'nextBid';
          const userBidPlayerModal = state.playerModal;
          userBidPlayerModal.shown = false;
          const shownUserBid = state.bidModals;
          shownUserBid[0] = generalModalData('', {
            header: (splitBid === '0') ? 'Pass' : splitBid,
            width: 80,
            height: 44,
          });
          return {
            ...state,
            gameState: userBidGameState,
            bids: [...userBids],
            playerModal: {...userBidPlayerModal},
            bidModels: [...shownUserBid],
          };
        }
        initialBidOffset = initialBidOffset + (splitBid === 'left' ? -5 : 5);
      }
      const {
        bidPlayerModal,
        maxedBidOffset
      } = reducerLogic.configureUserBidModal(
        state.bids,
        initialBidOffset,
        state.dealToPlayer,
        state.dealer,
      );
      return {
        ...state,
        gameState: 'waitForUserBid',
        bidOffset: maxedBidOffset,
        playerModal: bidPlayerModal,
      };
    case actionTypes.RESOLVE_COMPUTER_BID:
      let computerBid = reducerLogic.computerBid(
        state.hands,
        state.dealToPlayer,
        state.players,
        state.bids
      );
      if (state.dealToPlayer === state.dealer && computerBid > 0) {
        computerBid = 0;
        state.bids.forEach(bid => {
          if (bid + 1 > computerBid) {
            computerBid = bid + 1;
          }
        });
      }
      const shownComputerBid = state.bidModals;
      shownComputerBid[state.dealToPlayer] =
        generalModalData('', {
          header: (computerBid === 0) ? 'Pass' : String(computerBid),
          width: 80,
          height: 44,
        });
      const newBids = [...state.bids];
      newBids[state.dealToPlayer] = computerBid;
      const bidGameState = (state.dealToPlayer === state.dealer)
        ? 'biddingComplete' : 'nextBid';
      return {
        ...state,
        bids: [...newBids],
        gameState: bidGameState,
        bidModals: [...shownComputerBid],
      };
    case 'DECIDE_BID_WINNER':
      const {
        tookBidPlayerModal,
        tookBidPromptModal,
        wonTheBid,
        wonBidWith,
        updatedBidScore
      } = reducerLogic.resolveBidding(
        state.bids,
        state.players,
        state.teams,
        state.playScore,
      );
      return {
        ...state,
        playerModal: tookBidPlayerModal,
        promptModal: tookBidPromptModal,
        playScore: [...updatedBidScore],
        tookBid: wonTheBid,
        tookHand: wonTheBid,
        bidAmount: wonBidWith,
        gameState: 'waitDisplayWidow'
      };
    case 'SHOW_THE_WIDOW':
      if (action.widowCardIndex === state.players.length) {
        const widowContinueModal = generalModalData('', {
          hasBox: false,
          buttons: [{
            label: 'Continue',
            returnMessage: 'widowContinue'
          }],
        });
        return {
          ...state,
          playerModal: widowContinueModal,
          gameState: 'waitMoveWidowToHand',
        }
      }
      const widowGameState = action.widowCardIndex === -1 ? 'showWidow' : 'widowWait';
      const widowBidModels = [];
      for(let i = 0; i <state.players.length; i++) {
        widowBidModels.push({shown:false});
      }
      const widowPlayerPrompt = {shown:false};
      const widowPlayPile = reducerLogic.displayWidow(
        state.playPile,
        action.widowCardIndex,
        state.players
      );
      return {
        ...state,
        playerModal: widowPlayerPrompt,
        bidModals: widowBidModels,
        gameState: widowGameState,
        playPile: widowPlayPile,
        playPileShown: true,
      };
    case 'MOVE_WIDOW_TO_HAND':
      const widowMovingCards = reducerLogic.movingWidow(state);
      return {
        ...state,
        gameState: 'widowMoving',
        movingCards: [...widowMovingCards],
        playPile: [],
      };
    case 'DECIDE_THROW_HAND':
      if (state.tookBid === 0) {
        const {
          throwPlayerModal,
          throwGameState
        } = reducerLogic.shouldUserThrowHand(
          state.hands,
          state.bidAmount,
          state.players
        );
        return {
          ...state,
          gameState: throwGameState,
          playerModal: throwPlayerModal,
          movingCards: [],
        };
      }
      return {
        ...state,
      };
    case 'AGREE_THROW_HAND':
      if (state.players === 4 && state.tookBid === 2) {
        const throwModal = generalModalData(
          (<span><b>{state.players[2]}</b> wants to throw the hand</span>) ,
          {
            width: 500,
            height: 155,
            buttons: [
              {
                label: 'Play Hand',
                returnMessage: 'throwHandContinue',
              },
              {
                label: 'Throw Hand',
                returnMessage: 'throwHand',
              }
            ]
          }
        );
        return {
          ...state,
          gameState: 'waitAgreeThrowHand',
          playerModal: throwModal,
        };
      }

      return {
        ...state,
      };
    default:
        return state;
  }
};
export default appReducer;