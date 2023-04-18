import * as actionTypes from '../actions/gameActionTypes';
import * as preBidLogic from './gameReducerPreBidLogic';
import * as bidMeldLogic from './gameReducerBidMeldLogic';
import * as gamePlayLogic from './gameReducerGamePlayLogic';
import * as GAME_STATE from '../../utils/gameStates';
import { generalModalData } from '../../utils/helpers';

const initialState = {
  gameState: 'init',
  teams: ['Us', 'Them', 'Jessica'],
  players: ['You', 'Steven', 'Ellen'],
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

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CARD_TABLE_LAYOUT:
      const {
        playerHandLocations,
        playerDiscardLocations,
        playerMeldLocations,
        miscLocations,
        zoomRatio
      } = preBidLogic.playerDisplaySettingsLogic(
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
      const modifiedValues = preBidLogic.resolveCardMovement(
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
      const clearedValues = preBidLogic.setGameValuesForNewGame(state.teams, state.players);
      return {
        ...state,
        ...clearedValues
      };
    case actionTypes.THROW_FOR_ACE:
      const {
        newDealer,
        newDiscards,
        newMovingCard
      } = preBidLogic.throwCardForDeal(state);
      const newMovingCards = [...state.movingCards, newMovingCard];
      return {
        ...state,
        dealer: newDealer,
        gameState: GAME_STATE.WAIT_FOR_ACE,
        discardPiles: newDiscards,
        movingCards: newMovingCards
      };
    case actionTypes.SELECTED_DEALER:
      const {
        dealerPromptModal,
      } = preBidLogic.declareDealer(
        state.players,
        state.dealer
      );
      return {
        ...state,
        promptModal: dealerPromptModal,
        gameState: GAME_STATE.PRE_MOVE_DECK_TO_DEALER,
      };
    case actionTypes.MOVE_CARD_TO_DEALER:
      const {
        toDealerMovingCards,
        toDealerMelds,
        toDealerDiscards,
        toDealerHands,
        toDealerPlayPile,
        toDealerBidModels
      } = preBidLogic.passDeckToDealer(state);
      return {
        ...state,
        movingCards: toDealerMovingCards,
        melds: toDealerMelds,
        discardPiles: toDealerDiscards,
        hands: toDealerHands,
        playPile: toDealerPlayPile,
        bidModals: [...toDealerBidModels]
      };
    case actionTypes.PRE_DEAL:
      const {
        shuffledCards,
        clearPlayerPrompt
      } = preBidLogic.preDealing(
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
      } = preBidLogic.dealing(state);
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
      } = preBidLogic.checkForNines(
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
      } = preBidLogic.checkPostNines(
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
      } = bidMeldLogic.nextBid(
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
          gameState: GAME_STATE.BIDDING_COMPLETE,
          bids: [...forcedBid],
          promptModal: nextBidPrompt,
          bidModals: [...shownForcedBid]
        };
      }
      return {
        ...state,
        dealToPlayer: nextBid,
        promptModal: nextBidPrompt,
        gameState: (nextBid === 0) ? GAME_STATE.USER_BID : GAME_STATE.COMPUTER_BID,
      };
    case actionTypes.GET_USER_BID:
      let initialBidOffset = state.bidOffset;
      if (action.selection !== '') {
        const splitBid = action.selection.split('bid_')[1];
        if (splitBid !== 'left' && splitBid !== 'right') {
          const userBids = state.bids;
          userBids[0] = Number(splitBid);
          const userBidGameState = (state.dealToPlayer === state.dealer)
            ? GAME_STATE.BIDDING_COMPLETE : GAME_STATE.NEXT_BID;
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
      } = bidMeldLogic.configureUserBidModal(
        state.bids,
        initialBidOffset,
        state.dealToPlayer,
        state.dealer,
      );
      return {
        ...state,
        gameState: GAME_STATE.WAIT_FOR_USER_BID,
        bidOffset: maxedBidOffset,
        playerModal: bidPlayerModal,
      };
    case actionTypes.RESOLVE_COMPUTER_BID:
      let computerBid = bidMeldLogic.computerBid(
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
        ? GAME_STATE.BIDDING_COMPLETE : GAME_STATE.NEXT_BID;
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
      } = bidMeldLogic.resolveBidding(
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
        gameState: GAME_STATE.WAIT_DISPLAY_WIDOW,
        thrownHand: false,
      };
    case actionTypes.SHOW_THE_WIDOW:
      if (action.widowCardIndex === state.players.length) {
        const widowContinueModal = generalModalData('', {
          hasBox: false,
          buttons: [{
            label: 'Continue',
            returnMessage: GAME_STATE.WIDOW_CONTINUE
          }],
        });
        return {
          ...state,
          playerModal: widowContinueModal,
          gameState: GAME_STATE.WAIT_MOVE_WIDOW_TO_HAND,
        }
      }
      const widowGameState = action.widowCardIndex === -1 ? GAME_STATE.SHOW_WIDOW : GAME_STATE.WIDOW_WAIT;
      const widowBidModels = [];
      for(let i = 0; i <state.players.length; i++) {
        widowBidModels.push({shown:false});
      }
      const widowPlayerPrompt = {shown:false};
      const widowPlayPile = bidMeldLogic.displayWidow(
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
      }= bidMeldLogic.movingWidow(state);
      return {
        ...state,
        gameState: GAME_STATE.WIDOW_MOVING,
        movingCards: [...widowMovingCards],
        playPile: [...widowEmptyPlayPile],
        seenWidow: [...widowSeen],
      };
    case actionTypes.DECIDE_THROW_HAND:
      if (state.tookBid === 0) {
        const {
          throwPlayerModal,
          throwGameState
        } = bidMeldLogic.shouldUserThrowHand(
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
      } = bidMeldLogic.shouldComputerThrowHand(
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
                returnMessage: GAME_STATE.THROW_HAND_DISAGREE,
              },
              {
                label: 'Throw Hand',
                returnMessage: GAME_STATE.THROW_HAND,
              }
            ]
          }
        );
        return {
          ...state,
          gameState: GAME_STATE.WAIT_AGREE_THROW_HAND,
          playerModal: throwModal,
        };
      }
      const {
        computerAgreeThrowHand
      } = bidMeldLogic.shouldComputerAgreeThrowHand(
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
      let disagreeGameState = GAME_STATE.WAIT_AFTER_THROW_DISAGREE;
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
            returnMessage: GAME_STATE.THROW_HAND_CONTINUE
          }],
        });
      } else {
        disagreeGameState = GAME_STATE.SELECT_TRUMP_SUIT;
      }
      return {
        ...state,
        gameState: disagreeGameState,
        promptModal: disagreeThrowPromptModal,
        playerModal: disagreeThrowPlayerModal
      };
    case actionTypes.THROW_HAND:
      let throwGameState = GAME_STATE.WAIT_AFTER_THROW_HAND;
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
            returnMessage: GAME_STATE.NAME_TRUMP_SUIT
          }],
        });
      } else {
        throwGameState = GAME_STATE.SELECT_TRUMP_SUIT;
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
      } = bidMeldLogic.setUpDiscards(
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
      } = bidMeldLogic.userSelectDiscard(
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
      } = bidMeldLogic.removeUserDiscard(state);
      return {
        ...state,
        gameState: GAME_STATE.WAIT_REMOVE_DISCARDS,
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
      } = bidMeldLogic.calculateComputerDiscard(state);
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
        } = bidMeldLogic.userSelectTrump(
          state.hands,
          state.players
        );
        return {
          ...state,
          gameState: GAME_STATE.USER_TRUMP_WAIT,
          playerModal: userTrumpPlayer,
          promptModal: userTrumpPrompt
        };
      }
      const {
        computerTrumpSuit,
        computerTrumpPlayer,
        computerTrumpPrompt
      } = bidMeldLogic.computerSelectTrump(
        state.hands,
        state.tookBid,
        state.players,
        state.bidAmount
      );
      return {
        ...state,
        trumpSuit: computerTrumpSuit,
        gameState: GAME_STATE.USER_TRUMP_WAIT,
        playerModal: computerTrumpPlayer,
        promptModal: computerTrumpPrompt
      };
    case actionTypes.SET_TRUMP_SUIT:
      const setTrumpGameState = state.thrownHand ? GAME_STATE.START_MELD : GAME_STATE.START_DISCARDS;
      return {
        ...state,
        gameState: setTrumpGameState,
        trumpSuit: action.suit,
      };
    case actionTypes.START_MELD:
      const meldMessage = bidMeldLogic.startMeldMessage(
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
        gameState: GAME_STATE.DISPLAY_MELD
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
            gameState: GAME_STATE.MELD_DELAY,
            bidModals: [...shownMeld],
          };
        }
      }
      const {
        meldHands,
        meldPlacedCards,
        meldPlaceScores,
        meldSeenCards
      } = bidMeldLogic.meldCards(state);
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
        gameState: GAME_STATE.MELD_DELAY,
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
      } = bidMeldLogic.postMeldLaydown(
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
      } = gamePlayLogic.startGamePlay(state);
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
    case actionTypes.MOVE_REST_TO_DISCARD:
      const {
        restDiscardMovingCards,
        restDiscardShowHands,
        restDiscardHands
      } = gamePlayLogic.moveRestToDiscardPile(state);
      return {
        ...state,
        movingCards: [...restDiscardMovingCards],
        showHands: [...restDiscardShowHands],
        hands: [...restDiscardHands],
        gameState: GAME_STATE.REST_MOVE_TO_DISCARD
      };
    case actionTypes.PLAY_LEAD:
      const {
        gotRestGameState,
        gotRestPlayerModal,
        gotRestPromptModal,
        gotRestShowHands,
        gotRestWinningPlay
      } = gamePlayLogic.gotTheRest(state);
      if (gotRestGameState !== '') {
        return {
          ...state,
          playerModal: {...gotRestPlayerModal},
          promptModal: {...gotRestPromptModal},
          winningPlay: gotRestWinningPlay,
          tookPlay: gotRestWinningPlay,
          gameState: gotRestGameState,
          showHands: [...gotRestShowHands],
        };
      }
      if (state.dealToPlayer === 0) {
        const {
          userLeadPlayerModal,
          userLeadPromptModal,
          userLeadPlayHands,
        } = gamePlayLogic.userLeadPlay(
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
          gameState: GAME_STATE.WAIT_USER_PLAY,
        };
      }
      const {
        computerLeadPlayHands,
        computerPlayMovingCards
      } = gamePlayLogic.computerLeadPlay(state);
      return {
        ...state,
        hands: [...computerLeadPlayHands],
        movingCards: [...computerPlayMovingCards],
        winningPlay: state.tookPlay,
        gameState: GAME_STATE.CARD_TO_PLAY_PILE
      };
    case actionTypes.PLAY_FOLLOW:
      const nextPlayer = (state.dealToPlayer + 1)  % state.players.length;
      if (nextPlayer === state.tookPlay) {
        const {
          calculateWinnerPlayPile,
          calculateWinnerPromptModal,
          calculateWinnerOffSuits,
        } = gamePlayLogic.displayPlayWinner(
          state.trumpSuit,
          state.players,
          state.playPile,
          state.winningPlay,
          state.promptModal,
          state.tookPlay,
          state.offSuits
        );
        return {
          ...state,
          gameState: GAME_STATE.WAIT_MOVE_PLAY_PILE_TO_DISCARD,
          playPile: [...calculateWinnerPlayPile],
          promptModal: {...calculateWinnerPromptModal},
          offSuits: [...calculateWinnerOffSuits]
        };
      }
      if (nextPlayer === 0) {
        const {
          userFollowPlayerModal,
          userFollowPlayHands,
        } = gamePlayLogic.userFollowPlay(
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
          gameState: GAME_STATE.WAIT_USER_PLAY,
          dealToPlayer: nextPlayer,
        }
      }
      const {
        computerFollowHands,
        computerFollowMovingCards
      } = gamePlayLogic.computerFollowPlay(state, nextPlayer);
      return {
        ...state,
        hands: [...computerFollowHands],
        movingCards: [...computerFollowMovingCards],
        gameState: GAME_STATE.CARD_TO_PLAY_PILE,
        dealToPlayer: nextPlayer,
      };
    case actionTypes.USER_PLAY:
      const {
        userPlayHands,
        userPlayMovingCards,
        userPlayPromptModal
      } = gamePlayLogic.userPlay(state, action.cardIndex);
      return {
        ...state,
        hands: [...userPlayHands],
        movingCards: [...userPlayMovingCards],
        playerModal: {shown: false},
        promptModal: {...userPlayPromptModal},
        gameState: GAME_STATE.CARD_TO_PLAY_PILE
      };
    case actionTypes.RESOLVE_PLAY:
      const {
        resolveWinningPlay,
        resolvePromptModal,
        resolvePlayedCards
      } = gamePlayLogic.resolvePlay(
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
        gameState: GAME_STATE.WAIT_TO_CLEAR_PLAY_PILE,
        winningPlay: resolveWinningPlay,
        promptModal: resolvePromptModal,
        firstPlay: false,
        playedCards: [...resolvePlayedCards]
      };
    case actionTypes.MOVE_PLAY_PILE_TO_DISCARD:
      const {
        playToDiscardMovingCards,
        playToDiscardPlayPile
      } = gamePlayLogic.movePlayPileToDiscard(state);
      return {
        ...state,
        gameState: GAME_STATE.PLAY_PILE_TO_DISCARD,
        playPile: [...playToDiscardPlayPile],
        movingCards: [...playToDiscardMovingCards]
      };
    case actionTypes.START_NEXT_PLAY:
      const {
        nextPlayGameState,
        nextPlayPromptMessage,
        nextPlayDealToPlayer
      } = gamePlayLogic.setUpNextPlay(
        state.hands,
        state.promptModal,
        state.tookBid,
        state.winningPlay
      );
      return {
        ...state,
        gameState: nextPlayGameState,
        tookPlay: state.winningPlay,
        dealToPlayer: nextPlayDealToPlayer,
        promptModal: {...nextPlayPromptMessage},
      };
    case actionTypes.TALLY_COUNTS:
      const {
        tallyMovingCards,
        tallyDiscardPiles,
        tallyDealToPlayer,
        tallyGameState
      } = gamePlayLogic.discardToMeldTally(state);
      return {
        ...state,
        gameState: tallyGameState,
        dealToPlayer: tallyDealToPlayer,
        movingCards: [...tallyMovingCards],
        discardPiles: [...tallyDiscardPiles],
      };
    case actionTypes.ADD_COUNT_TO_TALLY:
      const {
        addCountBidModals
      } = gamePlayLogic.addCountToTally(
        state.bidModals,
        state.melds,
        state.tookPlay,
        state.dealToPlayer
      );
      return {
        ...state,
        gameState: GAME_STATE.TALLY_COUNTS,
        bidModals: [...addCountBidModals]
      };
    case actionTypes.ADD_COUNT_TO_SCORE:
      const {
        addScorePlayScore,
        addScorePlayerModal,
        addScorePromptModal,
        addScoreGameWon
      } = gamePlayLogic.addCountToScore(
        state.teams,
        state.players,
        state.playScore,
        state.melds,
        state.bidModals,
        state.tookBid,
        state.bidAmount
      );
      const addScoreNewHand = preBidLogic.setGameValuesForNewHand(state.players);
      return {
        ...state,
        playScore: [...addScorePlayScore],
        playerModal: {...addScorePlayerModal},
        promptModal: {...addScorePromptModal},
        gameWon: addScoreGameWon,
        ...addScoreNewHand
      };
    case actionTypes.END_HAND:
      const {
        endHandGameState,
        endHandPlayerModal,
        endHandPromptModal,
        endHandDealer,
        endHandGameWon
      } = gamePlayLogic.resolveEndHand(
        state.teams,
        state.players,
        state.playScore,
        state.tookBid,
        state.dealer
      );
      return {
        ...state,
        gameState: endHandGameState,
        playerModal: {...endHandPlayerModal},
        promptModal: {...endHandPromptModal},
        dealer: endHandDealer,
        gameWon: endHandGameWon
      };
    default:
        return state;
  }
};
export default gameReducer;