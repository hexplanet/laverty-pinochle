import * as actionTypes from '../actions/appActionTypes';
import * as reducerLogic from './appReducerLogic';
import {
  generalModalData,
} from '../../utils/helpers';

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
  seenWidow: [],
  seenCards: [],
  playedCards: [],
  offSuits: [],
  bids: [],
  tookBid: 0,
  bidAmount: 0,
  thrownHand: false,
  firstPlay: true,
  tookPlay: 0,
  winningPlay: 0,
  bidModals: [],
  bidOffset: 21,
  trumpSuit: '',
  meldDisplaySettings: [],
  melds: [],
  meldScores: [],
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
  playPile: [],
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
        playerMeldLocations,
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
        meldDisplaySettings: playerMeldLocations,
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
        state.melds,
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
        toDealerMelds,
        toDealerDiscards,
        toDealerHands,
        toDealerPlayPile
      } = reducerLogic.passDeckToDealer(state);
      return {
        ...state,
        movingCards: toDealerMovingCards,
        melds: toDealerMelds,
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
      const newOffSuits = [];
      for(let i = 0; i < state.players.length; i++) {
        newShowHands.push(false);
        newOffSuits.push([]);
      }
      return {
        ...state,
        discardPiles: shuffledCards,
        dealToPlayer: (state.dealer + 1) % (state.players.length),
        showHands: newShowHands,
        promptModal: clearPlayerPrompt,
        handFanOut: -1,
        offSuits: newOffSuits
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
    case actionTypes.DECIDE_BID_WINNER:
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
        tookPlay: wonTheBid,
        bidAmount: wonBidWith,
        gameState: 'waitDisplayWidow',
        thrownHand: false,
      };
    case actionTypes.SHOW_THE_WIDOW:
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
    case actionTypes.MOVE_WIDOW_TO_HAND:
      const {
        widowMovingCards,
        widowSeen,
        widowEmptyPlayPile
      }= reducerLogic.movingWidow(state);
      return {
        ...state,
        gameState: 'widowMoving',
        movingCards: [...widowMovingCards],
        playPile: [...widowEmptyPlayPile],
        seenWidow: [...widowSeen],
      };
    case actionTypes.DECIDE_THROW_HAND:
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
        };
      }
      const {
        computerThrowGameState
      } = reducerLogic.shouldComputerThrowHand(
        state.hands,
        state.tookBid,
        state.bidAmount,
        state.players
      );
      return {
        ...state,
        gameState: computerThrowGameState,
      };
    case actionTypes.AGREE_THROW_HAND:
      if (state.players.length === 4 && state.tookBid === 2) {
        const throwModal = generalModalData(
          (<span><b>{state.players[2]}</b> wants to throw the hand</span>) ,
          {
            width: 500,
            height: 105,
            buttons: [
              {
                label: 'Play Hand',
                returnMessage: 'throwHandDisagree',
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
      const {
        computerAgreeThrowHand
      } = reducerLogic.shouldComputerAgreeThrowHand(
        state.hands,
        state.tookBid,
        state.players
      );
      return {
        ...state,
        gameState: computerAgreeThrowHand,
        thrownHand: (computerAgreeThrowHand === 'throwHand')
      };
    case actionTypes.DISAGREE_THROW_HAND:
      let disagreeGameState = 'waitAfterThrowDisagree';
      const bidder = state.players[state.tookBid];
      const disagrees = state.players[(state.tookBid + 2) % 4];
      const throwText = (
        <span><b>{bidder}</b> wanted to thrown the hand, but <b>{disagrees}</b> disagreed</span>
      );
      const disagreeThrowPromptModal = generalModalData(throwText, {});
      let disagreeThrowPlayerModal = {shown:false};
      if (state.tookBid !== 2) {
        disagreeThrowPlayerModal = generalModalData('', {
          hasBox: false,
          buttons: [{
            label: 'Continue',
            returnMessage: 'throwHandContinue'
          }],
        });
      } else {
        disagreeGameState = 'selectTrumpSuit';
      }
      return {
        ...state,
        gameState: disagreeGameState,
        promptModal: disagreeThrowPromptModal,
        playerModal: disagreeThrowPlayerModal
      };
    case actionTypes.THROW_HAND:
      let throwGameState = 'waitAfterThrowHand';
      const throwHandText = (
        <span><b>{state.players[state.tookBid]}</b> throws the hand</span>
      );
      const throwPromptModal = generalModalData(throwHandText, {});
      const throwPlayScore = state.playScore;
      const playTeamIndex = state.players.length === 4 ? state.tookBid % 2 : state.tookBid;
      throwPlayScore[playTeamIndex][throwPlayScore[playTeamIndex].length - 1].gotSet = true;
      let throwPlayerModal = {shown: false};
      if (state.tookBid !== 2) {
        throwPlayerModal = generalModalData('', {
          hasBox: false,
          buttons: [{
            label: 'Continue',
            returnMessage: 'nameTrumpSuit'
          }],
        });
      } else {
        throwGameState = 'selectTrumpSuit';
      }
      return {
        ...state,
        gameState: throwGameState,
        thrownHand: true,
        promptModal: throwPromptModal,
        playerModal: throwPlayerModal,
        playScore: [...throwPlayScore],
      };
    case actionTypes.START_DISCARDS:
      const {
        discardGameState,
        discardPlayerModal,
        discardPromptModal,
        discardHands,
      } = reducerLogic.setUpDiscards(
        state.hands,
        state.tookBid,
        state.players,
        state.trumpSuit,
        state.bidAmount
      );
      return {
        ...state,
        gameState: discardGameState,
        playerModal: discardPlayerModal,
        promptModal: discardPromptModal,
        hands: [...discardHands],
      };
    case actionTypes.USER_SELECT_DISCARD:
      const {
        discardUserHands,
        discardUserModal
      } = reducerLogic.userSelectDiscard(
        state.hands,
        state.playerModal,
        action.index
      );
      return {
        ...state,
        playerModal: discardUserModal,
        hands: [...discardUserHands],
      };
    case actionTypes.REMOVE_USER_DISCARDS:
      const {
        removeUserHands,
        removeUserMovingCards,
        removeUserPrompt,
      } = reducerLogic.removeUserDiscard(state);
      return {
        ...state,
        gameState: 'waitRemoveDiscards',
        hands: [...removeUserHands],
        movingCards: removeUserMovingCards,
        promptModal: removeUserPrompt
      };
    case actionTypes.COMPUTER_DISCARDS:
      const {
        removeComputerHands,
        removeComputerMovingCards,
        removeComputerPrompt,
        removeComputerPlayer,
        removeComputerGameState
      } = reducerLogic.calculateComputerDiscard(state);
      return {
        ...state,
        gameState: removeComputerGameState,
        hands: [...removeComputerHands],
        movingCards: removeComputerMovingCards,
        promptModal: removeComputerPrompt,
        playerModal: removeComputerPlayer
      };
    case actionTypes.DECLARE_TRUMP_SUIT:
      if (state.tookBid === 0) {
        const {
          userTrumpPrompt,
          userTrumpPlayer
        } = reducerLogic.userSelectTrump(
          state.hands,
          state.players
        );
        return {
          ...state,
          gameState: 'userTrumpWait',
          playerModal: userTrumpPlayer,
          promptModal: userTrumpPrompt
        };
      }
      const {
        computerTrumpSuit,
        computerTrumpPlayer,
        computerTrumpPrompt
      } = reducerLogic.computerSelectTrump(
        state.hands,
        state.tookBid,
        state.players,
        state.bidAmount
      );
      return {
        ...state,
        trumpSuit: computerTrumpSuit,
        gameState: 'userTrumpWait',
        playerModal: computerTrumpPlayer,
        promptModal: computerTrumpPrompt
      };
    case actionTypes.SET_TRUMP_SUIT:
      const setTrumpGameState = state.thrownHand ? 'startMeld' : 'startDiscards';
      return {
        ...state,
        gameState: setTrumpGameState,
        trumpSuit: action.suit,
      };
    case actionTypes.START_MELD:
      const meldMessage = reducerLogic.startMeldMessage(
        state.trumpSuit,
        state.tookBid,
        state.bidAmount,
        state.players
      );
      const newMeldScores = [];
      for(let i = 0; i < state.players.length; i++) {
        newMeldScores.push(0);
      }
      return {
        ...state,
        meldScores: [...newMeldScores],
        dealToPlayer: state.tookBid,
        promptModal: meldMessage,
        gameState: 'displayMeld'
      };
    case actionTypes.DISPLAY_MELD:
      const shownMeld = state.bidModals;
      if (state.thrownHand) {
        if (state.dealToPlayer === state.tookBid ||
          (state.players.length === 4 && state.dealToPlayer === ((state.tookBid + 2) % 4))) {
          shownMeld[state.dealToPlayer] =
            generalModalData('', {
              header: 'X',
              width: 80,
              height: 44,
            });
          return {
            ...state,
            gameState: 'meldDelay',
            bidModals: [...shownMeld],
          };
        }
      }
      const {
        meldHands,
        meldPlacedCards,
        meldPlaceScores,
        meldSeenCards
      } = reducerLogic.meldCards(state);
      shownMeld[state.dealToPlayer] =
        generalModalData('', {
          header: meldPlaceScores[state.dealToPlayer],
          width: 80,
          height: 44,
        });
      return {
        ...state,
        hands: [...meldHands],
        melds: [...meldPlacedCards],
        meldScores: [...meldPlaceScores],
        gameState: 'meldDelay',
        bidModals: [...shownMeld],
        seenCards: [...meldSeenCards]
      };
    case actionTypes.NEXT_MELD:
      const {
        meldDealToPlayer,
        meldGameState,
        meldPlayScore,
        meldPlayerModal,
        meldPromptModal
      } = reducerLogic.postMeldLaydown(
        state.dealToPlayer,
        state.thrownHand,
        state.tookBid,
        state.meldScores,
        state.playScore,
        state.players,
        state.promptModal,
        state.trumpSuit,
        state.bidAmount,
        state.teams
      );
      return {
        ...state,
        dealToPlayer: meldDealToPlayer,
        playScore: [...meldPlayScore],
        gameState: meldGameState,
        playerModal: meldPlayerModal,
        promptModal: meldPromptModal
      };
    case actionTypes.START_GAME_PLAY:
      const {
        startMovingCards,
        startGameState,
        startPromptModal,
        startBidModals,
        startMelds
      } = reducerLogic.startGamePlay(state);
      return {
        ...state,
        firstPlay: true,
        movingCards: [...startMovingCards],
        gameState: startGameState,
        playerModal: {shown: false},
        promptModal: {...startPromptModal},
        bidModals: [...startBidModals],
        melds: [...startMelds]
      };
    case actionTypes.PLAY_LEAD:
      if (state.dealToPlayer === 0) {
        const {
          userLeadPlayerModal,
          userLeadPromptModal,
          userLeadPlayHands,
        } = reducerLogic.userLeadPlay(
          state.hands,
          state.trumpSuit,
          state.firstPlay,
          state.promptModal,
          state.players
        );
        return {
          ...state,
          playerModal: {...userLeadPlayerModal},
          promptModal: {...userLeadPromptModal},
          hands: [...userLeadPlayHands],
          winningPlay: state.tookPlay,
          gameState: 'waitUserPlay',
        };
      }
      const {
        computerLeadPlayHands,
        computerPlayMovingCards
      } = reducerLogic.computerLeadPlay(state);
      return {
        ...state,
        hands: [...computerLeadPlayHands],
        movingCards: [...computerPlayMovingCards],
        winningPlay: state.tookPlay,
        gameState: 'cardToPlayPile'
      };
    case actionTypes.PLAY_FOLLOW:
      const nextPlayer = (state.dealToPlayer + 1)  % state.players.length;
      if (nextPlayer === state.tookPlay) {
        return {
          ...state,
          gameState: 'calculatePlayWinner'
        };
      }
      if (nextPlayer === 0) {
        const {
          userFollowPlayerModal,
          userFollowPromptModal,
          userFollowPlayHands,
        } = reducerLogic.userFollowPlay(
          state.hands,
          state.trumpSuit,
          state.players,
          state.playPile,
          state.winningPlay,
          state.tookPlay
        );
        return {
          ...state,
          playerModal: {...userFollowPlayerModal},
          hands: [...userFollowPlayHands],
          gameState: 'waitUserPlay',
          dealToPlayer: nextPlayer,
        }
      }
      const {
        computerFollowHands,
        computerFollowMovingCards
      } = reducerLogic.computerFollowPlay(state, nextPlayer);
      return {
        ...state,
        hands: [...computerFollowHands],
        movingCards: [...computerFollowMovingCards],
        gameState: 'cardToPlayPile',
        dealToPlayer: nextPlayer,
      };
    case actionTypes.USER_PLAY:
      const {
        userPlayHands,
        userPlayMovingCards,
        userPlayPromptModal
      } = reducerLogic.userPlay(state, action.cardIndex);
      return {
        ...state,
        hands: [...userPlayHands],
        movingCards: [...userPlayMovingCards],
        playerModal: {shown: false},
        promptModal: {...userPlayPromptModal},
        gameState: 'cardToPlayPile'
      };
    case actionTypes.RESOLVE_PLAY:
      const {
        resolveWinningPlay,
        resolvePromptModal,
        resolvePlayedCards
      } = reducerLogic.resolvePlay(
        state.players,
        state.playPile,
        state.trumpSuit,
        state.dealToPlayer,
        state.tookPlay,
        state.winningPlay,
        state.tookBid,
        state.bidAmount,
        state.playedCards
      );
      return {
        ...state,
        gameState: 'waitToClearPlayPile',
        winningPlay: resolveWinningPlay,
        promptModal: resolvePromptModal,
        firstPlay: false,
        playedCards: [...resolvePlayedCards]
      };
    default:
        return state;
  }
};
export default appReducer;