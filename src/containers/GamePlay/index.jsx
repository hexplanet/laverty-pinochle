import React, {useState, useEffect} from 'react';
import CardTable from '../CardTable';
import { useDispatch, useSelector } from "react-redux";
import * as gameActions from '../../redux/actions/gameActions';
import Hand from "../../components/Hand";
import MoveCard from "../../components/MoveCard";
import Pile from "../../components/Pile";
import ScorePad from "../../components/ScorePad";
import Modal from "../../components/Modal";
import { getRandomRange }  from "../../utils/helpers";
import * as CONSTANT from "../../utils/constants";
import * as GAME_STATE from "../../utils/gameStates";

/**
 * This houses the game state based router for actions, the click actions from UI,
 * and construction of component to be displayed.
 */
function GamePlay() {
  const dispatch = useDispatch();
  const {
    hands,
    playerDisplaySettings,
    discardPiles,
    discardDisplaySettings,
    melds,
    meldDisplaySettings,
    playPile,
    miscDisplaySettings,
    playPileShown,
    teams,
    playScore,
    gameWon,
    playerModal,
    promptModal,
    gameState,
    movingCards,
    dealer,
    showHands,
    handFanOut,
    bidModals
  } = useSelector((state) => state.game);
  const [windowWidth, setWindowWidth]   = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [gameHands, setGameHands] = useState([]);
  const [gameDiscards, setGameDiscards] = useState([]);
  const [gameMelds, setGameMelds] = useState([]);
  const [gamePlayArea, setGamePlayArea] = useState([]);
  const [gameScorePad, setScorePad] = useState([]);
  const [gamePlayerModal, setGamePlayerModal] = useState([]);
  const [gameMovingCard, setGameMovingCard] = useState([]);
  const [actionTimer, setActionTimer] = useState(null);
  const [expandScoreCard, setExpandScoreCard] = useState(false);
  /**
   * Function to update locations of components on the browser display
   */
  const updateDimensions = () => {
    if (window.innerWidth !== windowWidth || window.innerHeight !== windowHeight) {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      dispatch(gameActions.setCardTableLayout(
        window.innerWidth,
        window.innerHeight,
      ));
    }
  }
  // useEffect for the initial of compnent to set and dispose resize listener and do initial display locations
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    dispatch(gameActions.setCardTableLayout(
      window.innerWidth,
      window.innerHeight,
    ));
    return () => window.removeEventListener("resize", updateDimensions);
  }, [dispatch]);

  /**
   * Sets a setTimeout to delay the next step of the game.
   * @param howLong {number} How many milliseconds to delay the game by.
   * @param completionFunction {function} Function that is executed after setTimeout is done
   */
  const timedDelay = (howLong, completionFunction) => {
    const newTimeout = setTimeout(tableClicked, howLong);
    window.delayWait = completionFunction;
    window.delayWaitTimeout = newTimeout;
  };
  /**
   * Skips the timeout if the user clicked anywhere on the browser display
   * @param event {mouseEvent} The mouse event from the user click
   */
  const tableClicked = (event) => {
    if (window.delayWaitTimeout !== null) {
      clearTimeout(window.delayWaitTimeout);
      window.delayWaitTimeout = null;
    }
    if (window.delayWait !== null) {
      (window.delayWait)();
      window.delayWait = null;
    }
  };
  // This sets the click listener to drive the delay click through
  useEffect(() => {
    window.delayWaitTimeout = null;
    window.delayWait = null;
    window.addEventListener("click", tableClicked);
    return () => window.removeEventListener("click", tableClicked);
  }, []);
  // This massive switch statement drives the dispatched actions of the game based on the gameState
  useEffect(() => {
    switch(gameState) {
      case GAME_STATE.INIT:
        // Generates data in gameReducer for a new game
        dispatch(gameActions.setupForNewGame());
        break;
      case GAME_STATE.CHOSE_DEALER:
        // Throws a card from the discard pile to each player in order
        dispatch(gameActions.throwForAce());
        break;
      case GAME_STATE.WAIT_FOR_ACE_COMPLETE:
        if (melds[dealer][melds[dealer].length - 1].value === "A") {
          // Selects player receiving ace to be the dealer
          dispatch(gameActions.selectedDealer());
        } else {
          // Continues to throw cards to players for the ace
          dispatch(gameActions.throwForAce());
        }
        break;
      case GAME_STATE.PRE_MOVE_DECK_TO_DEALER:
        // waits an amount of time before starting the card move to dealer process
        dispatch(gameActions.storeGameState(GAME_STATE.WAITING));
        setTimeout(() => {
          dispatch(gameActions.storeGameState(GAME_STATE.MOVE_DECK_TO_DEALER));
        }, CONSTANT.PREDEAL_DELAY);
        break;
      case GAME_STATE.MOVE_DECK_TO_DEALER:
        // Moves all cards to dealers until no more can be moved
        dispatch(gameActions.moveCardsToDealer());
        const cardsToDealer = () => { dispatch(gameActions.moveCardsToDealer()); };
        setActionTimer(
          setInterval(
            cardsToDealer,
            CONSTANT.DECK_TO_DEALER_DELAY
          )
        );
        break;
      case GAME_STATE.MOVE_DECK_TO_DEALER_COMPLETE:
        // waits for an amount of time when all cards reach dealer before starting the deal
        clearInterval(actionTimer);
        setActionTimer(null);
        dispatch(gameActions.preDeal());
        setTimeout(() => {
          dispatch(gameActions.storeGameState(GAME_STATE.DEAL));
        }, CONSTANT.POST_DECK_TO_DEALER_DELAY);
        break;
      case GAME_STATE.DEAL:
        // Deals cards to players and widow until all cards are sent
        dispatch(gameActions.moveCardsToDealer());
        const dealingCards = () => { dispatch(gameActions.dealCards()); };
        setActionTimer(
          setInterval(
            dealingCards,
            CONSTANT.DEAL_DELAY
          )
        );
        break;
      case GAME_STATE.DEAL_COMPLETE:
        // Ends the deal and operates the fan out of the cards in the hand then checks for redeal level nines in hand
        clearInterval(actionTimer);
        setActionTimer(null);
        dispatch(gameActions.storeGameState(GAME_STATE.FANNING_OUT));
        for (let i = 0; i < 3.25; i = i + 0.25) {
          setTimeout(() => {
            dispatch(gameActions.setHandFanOut(i));
          }, CONSTANT.FANOUT_DELAY * i);
        }
        setTimeout(() => {
          dispatch(gameActions.checkForNines());
        }, CONSTANT.NINE_CHECK_DELAY);
        break;
      case GAME_STATE.NINES_CONTINUE:
      case GAME_STATE.NEXT_BID:
        // Advances the biding player and passes either to computer or user bid
        dispatch(gameActions.nextBid());
        break;
      case GAME_STATE.COMPUTER_BID:
        // Waits and then makes bid for computer
        dispatch(gameActions.storeGameState(GAME_STATE.WAITING_ON_BID));
        timedDelay(getRandomRange(CONSTANT.COMPUTER_BID_MIN_DELAY, CONSTANT.COMPUTER_BID_MAX_DELAY, 1), () => {
          dispatch(gameActions.resolveComputerBid());
        });
        break;
      case GAME_STATE.USER_BID:
        // Sets up UI for user bid
        dispatch(gameActions.getUserBid());
        break;
      case GAME_STATE.BIDDING_COMPLETE:
        // After a delay, figures out who won the bid and displays that
        setTimeout(() => {
          dispatch(gameActions.decideBidWinner());
        }, CONSTANT.BID_COMPLETE_DELAY);
        break;
      case GAME_STATE.SHOW_WIDOW:
        // On a delay, shows the widow cards the bid winner gets and then moves those cards to the bid winner's hand
        for(let i = 0; i < hands.length + 1; i++) {
          setTimeout(() => {
            dispatch(gameActions.showTheWidow(i));
          }, CONSTANT.WIDOW_FLIP_DELAY * i);
        }
        break;
      case GAME_STATE.WIDOW_MOVING_COMPLETE:
        // Upon the widow cards reaching the bid winners hand, throwing the hand is calculated and maybe displayed
        dispatch(gameActions.decideThrowHand());
        break;
      case GAME_STATE.COMPUTER_WANTS_TO_THROW_HAND:
        // If the agreeing party for the thrown hand is a computer player, and it agrees, this displays that
        dispatch(gameActions.agreeThrowHand());
        break;
      case GAME_STATE.THROW_HAND_DISAGREE:
        // If the agreeing party for the thrown hand is a computer player, and it disagrees, this displays that
        dispatch(gameActions.disagreeThrowHand());
        break;
      case GAME_STATE.THROW_HAND:
        // If the hand was throw, this displays that, and sets that the hand was thrown
        dispatch(gameActions.throwHand());
        break;
      case GAME_STATE.START_DISCARDS:
        // This clears the player modal and starts the discard process and UI if the discarding player is the user
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.startDiscards());
        break;
      case GAME_STATE.COMPUTER_DISCARD:
        // This calculates the displays for the computer player
        dispatch(gameActions.computerDiscards());
        break;
      case GAME_STATE.THROW_HAND_CONTINUE:
      case GAME_STATE.SELECT_TRUMP_SUIT:
        // This either start the computer calculation of the trump suit, or sets up the UI for the user
        dispatch(gameActions.declareTrumpSuit());
        break;
      case GAME_STATE.WAIT_REMOVE_DISCARDS_COMPLETE:
      case GAME_STATE.START_MELD:
        // This starts the meld display process
        dispatch(gameActions.startMeld());
        break;
      case GAME_STATE.DISPLAY_MELD:
        // This displays meld for both computer and user players
        dispatch(gameActions.displayMeld());
        break;
      case GAME_STATE.MELD_DELAY:
        // After a delay, this advances meld display
        timedDelay(getRandomRange(CONSTANT.MELD_MIN_DELAY, CONSTANT.MELD_MAX_DELAY, 1), () => {
          dispatch(gameActions.nextMeld());
        });
        break;
      case GAME_STATE.MOVING_MELD_CARDS_BACK_COMPLETE:
      case GAME_STATE.START_NEXT_PLAY:
        // This triggers game play for the last trick winner or the bid winner
        dispatch(gameActions.playLead());
        break;
      case GAME_STATE.CARD_TO_PLAY_PILE_COMPLETE:
        // This calculates the winner of the trick
        dispatch(gameActions.resolvePlay());
        break;
      case GAME_STATE.WAIT_TO_CLEAR_PLAY_PILE:
        // After a delay, this either sets up UI for the user or calculates the follow card for the computer
        timedDelay(getRandomRange(CONSTANT.PLAY_PILE_CLEAR_MIN_DELAY, CONSTANT.PLAY_PILE_CLEAR_MAX_DELAY, 1), () => {
          dispatch(gameActions.playFollow());
        });
        break;
      case GAME_STATE.WAIT_MOVE_PLAY_PILE_TO_DISCARD:
        // After a delay, this moves the play cards to the discard pile of the trick winning team
        timedDelay(CONSTANT.PLAY_PILE_TO_DISCARD_DELAY, () => {
          dispatch(gameActions.movePlayPileToDiscard());
        });
        break;
      case GAME_STATE.REST_MOVE_TO_DISCARD_COMPLETE:
      case GAME_STATE.PLAY_PILE_TO_DISCARD_COMPLETE:
        // This start the play for the next trick
        dispatch(gameActions.startNextPlay());
        break;
      case GAME_STATE.TALLY_COUNTS:
      case GAME_STATE.NEXT_TALLY:
        // This starts the tally of the count at the end of the hand game play
        dispatch(gameActions.tallyCounts());
        break;
      case GAME_STATE.MOVE_DISCARD_TO_MELD_TALLY_COMPLETE:
        // This adds a point to the tally if the card moved was a count (A, 10, K)
        dispatch(gameActions.addCountToTally());
        break;
      case GAME_STATE.DONE_COUNTING:
        // This adds the score for the counts to the scorepad after all discards are counted and calculate final score
        dispatch(gameActions.addCountToScore())
        break;
      default:
        if (gameState.indexOf(GAME_STATE.NEXT_TALLY) > -1) {
          // This tallies of the next player count at the end of the hand game play
          dispatch(gameActions.tallyCounts());
        }
    }
  }, [gameState]);
  const handleModalInput = (type, event, message) => {
    switch(message) {
      case GAME_STATE.NINES_USER_REDEAL:
        // This for if the user chooses to redeal if they have too many 9s
        if (hands.length === 4) {
          // Ask partner for redeal if 4 handed
          dispatch(gameActions.partnerConfirmNinesRedeal());
        } else {
          // clear modals and move cards back to dealer for redeal
          dispatch(gameActions.clearPlayerModal());
          dispatch(gameActions.clearPromptModal());
          dispatch(gameActions.storeGameState(GAME_STATE.PRE_MOVE_DECK_TO_DEALER));
        }
        break;
      case GAME_STATE.NINES_CONTINUE:
        // Clear player modal and continue to bid if user chooses to play with too many 9s
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.storeGameState(GAME_STATE.NEXT_BID));
        break;
      case GAME_STATE.NINES_REDEAL:
        // clear modals and move cards back to dealer for redeal if user agrees to partner request for redeal
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.clearPromptModal());
        dispatch(gameActions.storeGameState(GAME_STATE.PRE_MOVE_DECK_TO_DEALER));
        break;
      case GAME_STATE.POST_BID_CONTINUE:
        // Show the widow when the user click on the continue button after bid
        dispatch(gameActions.showTheWidow());
        break;
      case GAME_STATE.WIDOW_CONTINUE:
        // Clear modals and start widow movement to bid winners hand when user clicks continue after widow reveal
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.clearPromptModal());
        dispatch(gameActions.moveWidowToHand());
        break;
      case GAME_STATE.THROW_HAND_CONTINUE:
        // Clear player modal and start trump suit selection after user clicks continue after thrown hand
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.storeGameState(GAME_STATE.SELECT_TRUMP_SUIT));
        break;
      case GAME_STATE.USER_THROW_HAND:
        // Clear player modal and user agress to throw hand
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.agreeThrowHand());
        break;
      case GAME_STATE.THROW_HAND_DISAGREE:
        // Clear player modal and user disagress to throw hand
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.disagreeThrowHand());
        break;
      case GAME_STATE.THROW_HAND:
        // User throws hand in 3 handed game
        dispatch(gameActions.throwHand());
        break;
      case GAME_STATE.USER_DISCARD:
        // Clears player modal and executes removal of discards from user hand
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.removeUserDiscards());
        break;
      case GAME_STATE.NAME_TRUMP_SUIT:
        // Starts the trump suit selection
        dispatch(gameActions.storeGameState(GAME_STATE.SELECT_TRUMP_SUIT));
        break;
      case GAME_STATE.START_GAME_PLAY:
        // Starts game play after meld continue
        dispatch(gameActions.startGamePlay());
        break;
      case GAME_STATE.POST_TRUMP_SUIT_CONTINUE:
        // Clears player modal and starts discards after trump suit selection
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.startDiscards());
        break;
      case GAME_STATE.POST_DISCARD_TRUMP:
        // Clear player modal and starts removal of trump cards after computer discard completion
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.storeGameState(GAME_STATE.WAIT_REMOVE_DISCARDS_COMPLETE));
        break;
      case GAME_STATE.END_OF_HAND:
        // Clear player modal and start end of hand process
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.endHand());
        break;
      case GAME_STATE.WIN_REST_CONTINUE:
        // Clear player modal and start movement of rest of cards to winner's discard pile after user clicks continue
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.moveRestToDiscard());
        break;
      default:
        if (message.substring(0,4) === 'bid_') {
          // Records user bid
          dispatch(gameActions.getUserBid(message));
        }
        if (message.substring(0,8) === 'trumpIs_') {
          // Clear player modal and records user selection of trump suit
          dispatch(gameActions.clearPlayerModal());
          dispatch(gameActions.setTrumpSuit(message.split('trumpIs_')[1]));
        }
    }
  };
  /**
   * Dispatches clicked card to proper action for current gameState
   * @param id {string} Unique Id for the card
   * @param index {number} Index position inside of its container
   * @param suitValue {string} The suit value combination for the card. Suits are H, C, D, S. Values A, 10, K, Q, J, 9
   */
  const handleClickedCard = (id, index, suitValue) => {
    if (gameState === GAME_STATE.WAIT_USER_DISCARD) {
      // Dispatch selected card for user discards
      dispatch(gameActions.userSelectDiscard(index));
    }
    if (gameState === GAME_STATE.WAIT_USER_PLAY) {
      // Dispatch selected card for
      dispatch(gameActions.userSelectPlay(index));
    }
  };
  /**
   * Toggles the large display of the score pad
   */
  const handleScoreCardCLick = () => {
    setExpandScoreCard(!expandScoreCard);
  };
  /**
   * Generates a modal component based on location on screen and modal data
   * @param location {object} This object holds the location on screen for the modal with properties:
   *                          x {number} The global left position of modal center. If -10000 then it is auto centered.
   *                          y {number} The global top position of modal center. If -10000 then it is auto centered.
   *                          z {number} The z-index of the modal
   * @param data {object} This object holds the data to be displayed for the modal with properties:
   *                      zoom {number} This is the percentage at which the hand is scaled. Normal is 100.
   *                      width {number} This is the width of the modal in pixels. 400 is the default.
   *                      height {number} This is the height of the modal in pixels. 200 is the default.
   *                      hasBlocker {booolean} Is a full screen click blocking element under the modal.
   *                                            Default is false.
   *                      hasCloseButton {boolean} Does the modal have an x close button in the upper right corner.
   *                                               Default is true.
   *                      hasBox {boolean} Does the modal have a visible background box? Default is true.
   *                      boxStyleClass {string} An additional class name that can be applied to the modal.
   *                      header {any} This can be a string or HTML that is displayed as the header.
   *                                   If value is "", no header is displayed.
   *                      hasHeaderSeparator {boolean} Is there a line between the header and the message?
   *                                                   Default is false.
   *                      message {any} This can be a string or HTML that is displayed as the message.
   *                                    If value is "", no message is displayed.
   *                      textInputs {array} This is an optional array of Input Components.
   *                                         No callback, these are operated elsewhere.
   *                      buttons {array} This is an optional array of Button Components.
   *                                      If array is empty, no Button components shown.
   *                      handleCloseModal {function} This is a callback function to let the parent know the close
   *                                                  button was clicked.
   * @param key {string} This is the unique key for the modal for the array for display
   * @returns {JSX.Element} This is a single to add to the modal array for display
   */
  const applyObjectToModal = (location, data, key) => {
    return (
      <Modal
        key={key}
        xLocation={location.x}
        yLocation={location.y}
        zLocation={playerModal.z}
        zoom={(data.zoom / 100) * location.zoom}
        width={data.width}
        height={data.height}
        hasBlocker={data.hasBlocker}
        hasCloseButton={data.hasCloseButton}
        hasBox={data.hasBox}
        boxStyleClass={data.boxStyleClass}
        header={data.header}
        hasHeaderSeparator={data.hasHeaderSeparator}
        message={data.message}
        textInputs={data.textInputs}
        buttons={data.buttons}
        handleCloseModal={data.handleCloseModal}
        handleModalInput={handleModalInput}
      />
    );
  }
  useEffect(() => {
    const newGameHands = [];
    // The below loop generate all hands and hand locations for display
    hands.forEach((hand, index) => {
      const newHand = [...hand];
      if (playerDisplaySettings[index]) {
        newGameHands.push(
          <Hand
            id={`player${index}`}
            key={`player${index}`}
            xLocation={playerDisplaySettings[index].x}
            yLocation={playerDisplaySettings[index].y}
            rotation={playerDisplaySettings[index].rotation}
            zoom={playerDisplaySettings[index].zoom}
            cards={newHand}
            fanOut={handFanOut}
            shown={showHands[index]}
            cardClicked={handleClickedCard}
          />
        );
      }
    });
    setGameHands([...newGameHands]);
  }, [hands, playerDisplaySettings, showHands, handFanOut]);
  useEffect(() => {
    const newGameDiscards = [];
    // The below loop generate all discard pile and discard pile locations for display
    discardPiles.forEach((discard, index) => {
      if (discardDisplaySettings[index]) {
        newGameDiscards.push(
          <Pile
            key={`discard${index}`}
            xLocation={discardDisplaySettings[index].x}
            yLocation={discardDisplaySettings[index].y}
            rotation={discardDisplaySettings[index].rotation}
            zoom={discardDisplaySettings[index].zoom}
            cards={discard}
          />
        );
      }
    });
    setGameDiscards(newGameDiscards);
  }, [discardPiles, discardDisplaySettings]);
  useEffect(() => {
    const newGameMelds = [];
    // The below loop generate all meld discard pile and meld discard pile locations for display
    melds.forEach((meld, index) => {
      if (meldDisplaySettings[index]) {
        newGameMelds.push(
          <Pile
            key={`meld${index}`}
            xLocation={meldDisplaySettings[index].x}
            yLocation={meldDisplaySettings[index].y}
            rotation={meldDisplaySettings[index].rotation}
            zoom={meldDisplaySettings[index].zoom}
            cards={meld}
            shown={true}
          />
        );
      }
    });
    setGameMelds(newGameMelds);
  }, [melds, meldDisplaySettings]);
  useEffect(() => {
    // This useEffect creates the play pile and it's location
    const newGamePlayArea = [];
    if (miscDisplaySettings.playArea.x !== undefined) {
      newGamePlayArea.push(
        <Pile
          key={`GamePlayArea`}
          xLocation={miscDisplaySettings.playArea.x}
          yLocation={miscDisplaySettings.playArea.y}
          zoom={miscDisplaySettings.playArea.zoom}
          cards={playPile}
          shown={playPileShown}
        />
      );
    }
    setGamePlayArea(newGamePlayArea);
  }, [miscDisplaySettings, playPile]);
  useEffect(() => {
    // This useEffect generates the ScorePad component and sets its location
    const newGameScorePad = [];
    if (miscDisplaySettings.scorePad.x !== undefined) {
      newGameScorePad.push(
        <ScorePad
          key={`GameScorePad`}
          xLocation={miscDisplaySettings.scorePad.x}
          yLocation={miscDisplaySettings.scorePad.y}
          zoom={miscDisplaySettings.scorePad.zoom}
          teams={teams}
          scores={playScore}
          won={gameWon}
          handleClick={handleScoreCardCLick}
          hasBlocker={expandScoreCard}
        />
      );
    }
    setScorePad(newGameScorePad);
  }, [teams, playScore, gameWon, miscDisplaySettings, expandScoreCard]);
  useEffect(() => {
    const newGamePlayerModal = [];
    // The below loop creates and set the location of the bid modals
    for (let i = 0; i < hands.length; i++) {
      if (miscDisplaySettings.gameBidModals[i]?.x !== undefined) {
        if (bidModals[i].shown) {
          newGamePlayerModal.push(
            applyObjectToModal(miscDisplaySettings.gameBidModals[i], bidModals[i], `bidModal_${i}`)
          );
        }
      }
    }
    if (miscDisplaySettings.playerModal.x !== undefined) {
      // This creates and locates the player modal if shown
      if (playerModal.shown) {
        newGamePlayerModal.push(applyObjectToModal(miscDisplaySettings.playerModal, playerModal, 'PlayerModal'));
      }
    }
    if (miscDisplaySettings.promptModal.x !== undefined) {
      // This creates and locates the prompt modal if shown
      if (promptModal.shown) {
        newGamePlayerModal.push(applyObjectToModal(miscDisplaySettings.promptModal, promptModal, 'PromptModal'));
      }
    }
    setGamePlayerModal(newGamePlayerModal);
  }, [
    playerModal,
    promptModal,
    bidModals,
    miscDisplaySettings,
  ]);
  /**
   * This function dispatches any move card that reaches its destination to resolveCardMovement action with data
   * @param id {string} The unique id of the card that reached its destination
   * @param keyId {string} The unique keyId of the card that reached its destination
   */
  const cardFinishedMovement = (id, keyId) => {
    dispatch(gameActions.resolveCardMovement(id, keyId));
  };
  useEffect(() => {
    const newGameMovingCards = [];
    let uniqueKey;
    // The below loop sets up all moving cards
    movingCards.forEach((movingCard) => {
      uniqueKey = `${movingCard.id}${Date.now()}`;
      newGameMovingCards.push(
        <MoveCard
          id={movingCard.id}
          key={uniqueKey}
          keyId={movingCard.keyId}
          suit={movingCard.suit}
          value={movingCard.value}
          shown={movingCard.shown}
          speed={movingCard.speed}
          frontColor={movingCard.frontColor}
          travelTime={movingCard.travelTime}
          source={movingCard.source}
          target={movingCard.target}
          movementDone={cardFinishedMovement}
        />
      );
    });
    setGameMovingCard([...newGameMovingCards]);
  }, [movingCards]);
  // Renders all game components through the CardTable component
  return (
    <div>
      <CardTable
        displayDiscards={gameDiscards}
        displayHands={gameHands}
        displayMelds={gameMelds}
        displayGameArea={gamePlayArea}
        displayScorePad={gameScorePad}
        displayMovingCards={gameMovingCard}
        displayPlayerModal={gamePlayerModal}
      />
    </div>
  );
}
export default GamePlay;