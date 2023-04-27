import * as actionTypes from '../actions/gameActionTypes';
import * as preBidLogic from './gameReducerPreBidLogic';
import * as bidMeldLogic from './gameReducerBidMeldLogic';
import * as gamePlayLogic from './gameReducerGamePlayLogic';
import * as GAME_STATE from '../../utils/gameStates';
import { generalModalData } from '../../utils/helpers';

// Initial values for the gameReducer
const initialState = {
  gameState: 'init', /* This is a string that holds the game state that drives the state based part of the app */
  teams: ['Us', 'Them', 'Jessica'], /* This is an array of team names. There can either 2 or 3 teams */
  players: ['You', 'Steven', 'Ellen'], /* This is an array of player names. There can either 3 or 4 teams */
  playerDisplaySettings: [], /* array, by player, of locations to place the hand components */
  discardPiles: [], /* array, by player, of cards that are in the discard pile components */
  discardDisplaySettings: [], /* array, by player, of locations to place discard piles */
  showHands: [], /* array, by player, of booleans. If boolean is true, player hand is shown face up */
  handFanOut: -1, /* number, this is the degrees of fan out in all hands. If -1, no fan out. */
  hands: [], /* array, by player, of cards for the hand components */
  seenWidow: [], /* array that holds the seen widow cards for AI usage */
  seenCards: [], /* array, by player, that holds all cards seen as meld for AI usage */
  playedCards: [], /* array that holds all card suit/values that have been played in this hand */
  offSuits: [], /* array, by player, that stores all suits that the player is know to be out of, for AI usage */
  bids: [], /* array, by player, of the bids for this hand */
  tookBid: 0, /* number, index into players for who took the bid this hand */
  bidAmount: 0, /* number, amount of the winning bid */
  thrownHand: false, /* boolean, did the bid winner throw the hand? */
  firstPlay: true, /* boolean, is this the first trick of the hand? */
  tookPlay: 0, /* number, index into players for who took the last trick */
  winningPlay: 0, /* number, index into players for who currently is winning the trick */
  bidModals: [], /* array, by player, properties for the modal components that display either the bid or the count */
  bidOffset: 21, /* number, the offset in bid value for the paginated user bidding */
  trumpSuit: '', /* string, this is the trump suit selected for the current hand */
  meldDisplaySettings: [], /* array, by player, of the locations of the pile components used to display meld */
  melds: [], /* array, by player, cards in the pile components used to display meld */
  meldScores: [], /* array, by player, of the score recorded for the meld */
  miscDisplaySettings: { /* object, locations of one-off components */
    scorePad: {}, /* object, locations of the scorepad component */
    playArea: {}, /* object, location of the pile component used for the trick play area */
    playerModal: {}, /* object, location of the player modal component */
    promptModal: {}, /* object, location of the prompt modal component */
    gameBidModals: [], /* array, by player, location of the bid modal components */
  },
  movingCards: [], /* array of props for MoveCard components for animation */
  zoomRatio: 1, /* number, global zoom level of the game page */
  dealer: 0, /* number, index into players for who the current dealer is */
  dealToPlayer: 0, /* number, index into players for who the current target player is */
  playPile: [], /* array, cards that are currently displayed in the play pile component */
  playPileShown: true, /* boolean, is the play pile currently visible? */
  playScore: [], /* array, by team, of arrays of object that make up the game score. See ScorePad component for more */
  gameWon: '', /* string, the name of the team that won the game */
  playerModal: {shown: false}, /* modal properties for player modal components */
  promptModal: {shown: false},/* modal properties for prompt modal components */
};

const gameReducer = (state = initialState, action) => {
  // The below massive switch statement operates all actions for the gameReducer
  switch (action.type) {
    case actionTypes.SET_CARD_TABLE_LAYOUT:
      // This action sets the layout of the card table for the given width and height
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
      // This action will update the gameState
      return {
        ...state,
        gameState: action.gameState,
      };
    case actionTypes.CLEAR_PLAYER_MODAL:
      // This action clears and may hide the player modal
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
      // This action clear the prompt modal
      const blankedPromptModal = {
        message: '',
        textInputs: [],
        buttons: [],
      };
      return {
        ...state,
        promptModal: {...state.promptModal, ...blankedPromptModal},
      };
    case actionTypes.RESOLVE_CARD_MOVEMENT:
      // This action places a moved card into a container based on it's id and adds :complete to the gameState
      // if all cards are done moving
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
      // This action sets up game values for a new game
      const clearedValues = preBidLogic.setGameValuesForNewGame(state.teams, state.players);
      return {
        ...state,
        ...clearedValues
      };
    case actionTypes.THROW_FOR_ACE:
      // This action moves cards to next player on the deal order
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
      // This action sets the dealer and display it in the prompt modal
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
      // This action starts the move of all cards to the dealer
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
      // This action sets data for the begining of the dealing. Also resets showHands and offSuits for all players.
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
      // This action sets up a deal of the cards to the players
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
      // This action fans out the cards in all hands
      return {
        ...state,
        handFanOut: action.fanOut,
      };
    case actionTypes.CHECK_FOR_NINES:
      // This action checks for too many nines in all hands. And then displays messages in modals if that exists
      // Also sets the showHands to display the user hand.
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
      // This action either sets up modals for user UI to confirm partner request to redeal for nines or the
      // computer calculation to allow redeal
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
      // This action will either continue bidding or force the dealer to take then bid for 20 if no one else has bid.
      // This will also channel the bid to the user or computer based on next seat.
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
      // This action executes the user UI selection to either scroll bid buttons, pass, or set bid.
      // If no UI input, then the display of the bidding button is done
      let initialBidOffset = state.bidOffset;
      if (action.selection !== '') {
        // UI select took place, execute user UI selection
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
      // Update the user UI
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
      // Action to save and display the computer generated bid
      let computerBid = bidMeldLogic.computerBid(
        state.hands,
        state.dealToPlayer,
        state.players,
        state.bids
      );
      if (state.dealToPlayer === state.dealer && computerBid > 0) {
        // Calculate computer bid if last bidder
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
      // Action to select and display bid winner
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
      // Action to display the widow cards and set up player modal for contiue if all cards displayed
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
      // Action to move all widow cards to the bid winners hand
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
      // Action to decide if the hand should be thrown
      if (state.tookBid === 0) {
        // Set up interface for user if throw formula if true
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
      // Calculate if the computer should throw the hand
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
      // Action to agree to throw the hand
      if (state.players.length === 4 && state.tookBid === 2) {
        // Set up UI for user if they have to agree to throw hand
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
      // Run calculation of computer if it has to agree to throw hand
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
      // Action for the display of the disagreement to throw the hand with player modal continue button
      let disagreeGameState = GAME_STATE.WAIT_AFTER_THROW_DISAGREE;
      const bidder = state.players[state.tookBid];
      const disagrees = state.players[(state.tookBid + 2) % 4];
      const throwText = (
        <span><b>{bidder}</b> wanted to thrown the hand, but <b>{disagrees}</b> disagreed</span>
      );
      const disagreeThrowPromptModal = generalModalData(throwText, {});
      let disagreeThrowPlayerModal = {shown:false};
      if (state.tookBid !== 2) {
        // Set up UI for user to continue
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
      // Action that displays that the hand was throw and either passes to trump suit selection or sets up user UI
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
        // User UI for continuing after the hand is thrown
        throwPlayerModal = generalModalData('', {
          hasBox: false,
          buttons: [{
            label: 'Continue',
            returnMessage: GAME_STATE.NAME_TRUMP_SUIT
          }],
        });
      } else {
        // Move to trump selection
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
      // Action to start discard phase
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
      // Action to set up UI and modals for the user discards
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
      // Action to move the cards from the bid winners hand to their discard pile.
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
      // Action to calculate the cards the computer should discard
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
      // Action that either sets up user UI for trump suit selection or has the computer select the trump suit
      if (state.tookBid === 0) {
        // Sets up UI for user to select the trump suit
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
      // Computer selects the trump suit
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
      // Action to take the user input and set trump suit from that
      const setTrumpGameState = state.thrownHand ? GAME_STATE.START_MELD : GAME_STATE.START_DISCARDS;
      return {
        ...state,
        gameState: setTrumpGameState,
        trumpSuit: action.suit,
      };
    case actionTypes.START_MELD:
      // Action to start the meld display process and the clearing of the meld values.
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
      // Action to display the meld on meld piles. Also reset bid modals for X if hand thrown for proper players.
      const shownMeld = state.bidModals;
      if (state.thrownHand) {
        if (state.dealToPlayer === state.tookBid ||
          (state.players.length === 4 && state.dealToPlayer === ((state.tookBid + 2) % 4))) {
          // Does not display meld and shows X for meld value if the hand was thrown, for the thrown team
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
      // Display meld cards on meld pile and the meld value in the bid modal for current player
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
      // Action to advance meld display to the next player, or finish the display of meld
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
      // Action that starts game play phase
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
      // Action that will start movement of all cards left in hands to the winners discard pile
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
      // Action that check if the lead player has the rest of the tricks, else sets up UI for user if they have the
      // lead, else calculates the lead card to play for the computer
      const {
        gotRestGameState,
        gotRestPlayerModal,
        gotRestPromptModal,
        gotRestShowHands,
        gotRestWinningPlay
      } = gamePlayLogic.gotTheRest(state);
      if (gotRestGameState !== '') {
        // If the lead player has the rest of the tricks, make statement in player modal
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
        // If the lead player is the user, set up the UI for their card selection
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
      // Computer calculates the card to lead from its hand
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
      // Action to advance the current player, calculate the winner and display that if the hand is done, else
      // set up the user UI for the follow card selection, else the computer calculates the follow card from hand
      const nextPlayer = (state.dealToPlayer + 1)  % state.players.length;
      if (nextPlayer === state.tookPlay) {
        // Trick is over, calculate the winner and display
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
        // The current player to follow is the user, set up UI for card selection
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
      // The following player is a computer player, calculate the proper following card.
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
      // Action to send the user selected card from hand to play pile
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
      // Action to resove the play by calculation of winner
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
      // Action that moves the cards in the play pile to the discard pile of the winning team
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
      // Action to start the next trick
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
      // Action to move the next card from the discard to the meld pile to tally count points
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
      // Action to add point to tally if the card finished moving to the meld pile was a counter
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
      // Action to add the count points to the score, calculate if the bid was made, and reset game play values
      // for the next hand
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
      // Action to end the hand for the next hand and figure out if the game was won
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