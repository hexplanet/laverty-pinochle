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
  } = useSelector((state) => state.app);
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
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    dispatch(gameActions.setCardTableLayout(
      window.innerWidth,
      window.innerHeight,
    ));
    return () => window.removeEventListener("resize", updateDimensions);
  }, [dispatch]);

  const timedDelay = (howLong, completionFunction) => {
    const newTimeout = setTimeout(tableClicked, howLong);
    window.delayWait = completionFunction;
    window.delayWaitTimeout = newTimeout;
  };
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
  useEffect(() => {
    window.delayWaitTimeout = null;
    window.delayWait = null;
    window.addEventListener("click", tableClicked);
    return () => window.removeEventListener("click", tableClicked);
  }, []);
  useEffect(() => {
    switch(gameState) {
      case CONSTANT.GS_INIT:
        dispatch(gameActions.setupForNewGame());
        break;
      case CONSTANT.GS_CHOSE_DEALER:
        dispatch(gameActions.throwForAce());
        break;
      case CONSTANT.GS_WAIT_FOR_ACE_COMPLETE:
        if (melds[dealer][melds[dealer].length - 1].value === "A") {
          dispatch(gameActions.selectedDealer());
        } else {
          dispatch(gameActions.throwForAce());
        }
        break;
      case CONSTANT.GS_PRE_MOVE_DECK_TO_DEALER:
        dispatch(gameActions.storeGameState(CONSTANT.GS_WAITING));
        setTimeout(() => {
          dispatch(gameActions.storeGameState(CONSTANT.GS_MOVE_DECK_TO_DEALER));
        }, CONSTANT.PREDEAL_DELAY);
        break;
      case CONSTANT.GS_MOVE_DECK_TO_DEALER:
        dispatch(gameActions.moveCardsToDealer());
        const cardsToDealer = () => { dispatch(gameActions.moveCardsToDealer()); };
        setActionTimer(
          setInterval(
            cardsToDealer,
            CONSTANT.DECK_TO_DEALER_DELAY
          )
        );
        break;
      case CONSTANT.GS_MOVE_DECK_TO_DEALER_COMPLETE:
        clearInterval(actionTimer);
        setActionTimer(null);
        dispatch(gameActions.preDeal());
        setTimeout(() => {
          dispatch(gameActions.storeGameState(CONSTANT.GS_DEAL));
        }, CONSTANT.POST_DECK_TO_DEALER_DELAY);
        break;
      case CONSTANT.GS_DEAL:
        dispatch(gameActions.moveCardsToDealer());
        const dealingCards = () => { dispatch(gameActions.dealCards()); };
        setActionTimer(
          setInterval(
            dealingCards,
            CONSTANT.DEAL_DELAY
          )
        );
        break;
      case CONSTANT.GS_DEAL_COMPLETE:
        clearInterval(actionTimer);
        setActionTimer(null);
        dispatch(gameActions.storeGameState(CONSTANT.GS_FANNING_OUT));
        for (let i = 0; i < 3.25; i = i + 0.25) {
          setTimeout(() => {
            dispatch(gameActions.setHandFanOut(i));
          }, CONSTANT.FANOUT_DELAY * i);
        }
        setTimeout(() => {
          dispatch(gameActions.checkForNines());
        }, CONSTANT.NINE_CHECK_DELAY);
        break;
      case CONSTANT.GS_NINES_CONTINUE:
      case CONSTANT.GS_NEXT_BID:
        dispatch(gameActions.nextBid());
        break;
      case CONSTANT.GS_COMPUTER_BID:
        dispatch(gameActions.storeGameState(CONSTANT.GS_WAITING_ON_BID));
        timedDelay(getRandomRange(CONSTANT.COMPUTER_BID_MIN_DELAY, CONSTANT.COMPUTER_BID_MAX_DELAY, 1), () => {
          dispatch(gameActions.resolveComputerBid());
        });
        break;
      case CONSTANT.GS_USER_BID:
        dispatch(gameActions.getUserBid());
        break;
      case CONSTANT.GS_BIDDING_COMPLETE:
        setTimeout(() => {
          dispatch(gameActions.decideBidWinner());
        }, CONSTANT.BID_COMPLETE_DELAY);
        break;
      case CONSTANT.GS_SHOW_WIDOW:
        for(let i = 0; i < hands.length + 1; i++) {
          setTimeout(() => {
            dispatch(gameActions.showTheWidow(i));
          }, CONSTANT.WIDOW_FLIP_DELAY * i);
        }
        break;
      case CONSTANT.GS_WIDOW_MOVING_COMPLETE:
        dispatch(gameActions.decideThrowHand());
        break;
      case CONSTANT.GS_COMPUTER_WANTS_TO_THROW_HAND:
        dispatch(gameActions.agreeThrowHand());
        break;
      case CONSTANT.GS_THROW_HAND_DISAGREE:
        dispatch(gameActions.disagreeThrowHand());
        break;
      case CONSTANT.GS_THROW_HAND:
        dispatch(gameActions.throwHand());
        break;
      case CONSTANT.GS_START_DISCARDS:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.startDiscards());
        break;
      case CONSTANT.GS_COMPUTER_DISCARD:
        dispatch(gameActions.computerDiscards());
        break;
      case CONSTANT.GS_THROW_HAND_CONTINUE:
      case CONSTANT.GS_SELECT_TRUMP_SUIT:
        dispatch(gameActions.declareTrumpSuit());
        break;
      case CONSTANT.GS_WAIT_REMOVE_DISCARDS_COMPLETE:
      case CONSTANT.GS_START_MELD:
        dispatch(gameActions.startMeld());
        break;
      case CONSTANT.GS_DISPLAY_MELD:
        dispatch(gameActions.displayMeld());
        break;
      case CONSTANT.GS_MELD_DELAY:
        timedDelay(getRandomRange(CONSTANT.MELD_MIN_DELAY, CONSTANT.MELD_MAX_DELAY, 1), () => {
          dispatch(gameActions.nextMeld());
        });
        break;
      case CONSTANT.GS_MOVING_MELD_CARDS_BACK_COMPLETE:
      case CONSTANT.GS_START_NEXT_PLAY:
        dispatch(gameActions.playLead());
        break;
      case CONSTANT.GS_CARD_TO_PLAY_PILE_COMPLETE:
        dispatch(gameActions.resolvePlay());
        break;
      case CONSTANT.GS_WAIT_TO_CLEAR_PLAY_PILE:
        timedDelay(getRandomRange(CONSTANT.PLAY_PILE_CLEAR_MIN_DELAY, CONSTANT.PLAY_PILE_CLEAR_MAX_DELAY, 1), () => {
          dispatch(gameActions.playFollow());
        });
        break;
      case CONSTANT.GS_WAIT_MOVE_PLAY_PILE_TO_DISCARD:
        timedDelay(CONSTANT.PLAY_PILE_TO_DISCARD_DELAY, () => {
          dispatch(gameActions.movePlayPileToDiscard());
        });
        break;
      case CONSTANT.GS_REST_MOVE_TO_DISCARD_COMPLETE:
      case CONSTANT.GS_PLAY_PILE_TO_DISCARD_COMPLETE:
        dispatch(gameActions.startNextPlay());
        break;
      case CONSTANT.GS_TALLY_COUNTS:
      case CONSTANT.GS_NEXT_TALLY:
        dispatch(gameActions.tallyCounts());
        break;
      case CONSTANT.GS_MOVE_DISCARD_TO_MELD_TALLY_COMPLETE:
        dispatch(gameActions.addCountToTally());
        break;
      case CONSTANT.GS_DONE_COUNTING:
        dispatch(gameActions.addCountToScore())
        break;
      default:
    }
  }, [gameState]);
  const handleModalInput = (type, event, message) => {
    switch(message) {
      case CONSTANT.GS_NINES_USER_REDEAL:
        if (hands.length === 4) {
          dispatch(gameActions.partnerConfirmNinesRedeal());
        } else {
          dispatch(gameActions.clearPlayerModal());
          dispatch(gameActions.clearPromptModal());
          dispatch(gameActions.storeGameState(CONSTANT.GS_PRE_MOVE_DECK_TO_DEALER));
        }
        break;
      case CONSTANT.GS_NINES_CONTINUE:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.storeGameState(CONSTANT.GS_NEXT_BID));
        break;
      case CONSTANT.GS_NINES_REDEAL:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.clearPromptModal());
        dispatch(gameActions.storeGameState(CONSTANT.GS_PRE_MOVE_DECK_TO_DEALER));
        break;
      case CONSTANT.GS_POST_BID_CONTINUE:
        dispatch(gameActions.showTheWidow());
        break;
      case CONSTANT.GS_WIDOW_CONTINUE:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.clearPromptModal());
        dispatch(gameActions.moveWidowToHand());
        break;
      case CONSTANT.GS_THROW_HAND_CONTINUE:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.storeGameState(CONSTANT.GS_SELECT_TRUMP_SUIT));
        break;
      case CONSTANT.GS_USER_THROW_HAND:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.agreeThrowHand());
        break;
      case CONSTANT.GS_THROW_HAND_DISAGREE:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.disagreeThrowHand());
        break;
      case CONSTANT.GS_THROW_HAND:
        dispatch(gameActions.throwHand());
        break;
      case CONSTANT.GS_USER_DISCARD:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.removeUserDiscards());
        break;
      case CONSTANT.GS_NAME_TRUMP_SUIT:
        dispatch(gameActions.storeGameState(CONSTANT.GS_SELECT_TRUMP_SUIT));
        break;
      case CONSTANT.GS_START_GAME_PLAY:
        dispatch(gameActions.startGamePlay());
        break;
      case CONSTANT.GS_POST_TRUMP_SUIT_CONTINUE:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.startDiscards());
        break;
      case CONSTANT.GS_POST_DISCARD_TRUMP:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.storeGameState(CONSTANT.GS_WAIT_REMOVE_DISCARDS_COMPLETE));
        break;
      case CONSTANT.GS_END_OF_HAND:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.endHand());
        break;
      case CONSTANT.GS_WIN_REST_CONTINUE:
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.moveRestToDiscard());
        break;
      default:
        if (message.substring(0,4) === 'bid_') {
          dispatch(gameActions.getUserBid(message));
        }
        if (message.substring(0,8) === 'trumpIs_') {
          dispatch(gameActions.clearPlayerModal());
          dispatch(gameActions.setTrumpSuit(message.split('trumpIs_')[1]));
        }
    }
  };
  const handleClickedCard = (id, index, suitValue) => {
    if (gameState === CONSTANT.GS_WAIT_USER_DISCARD) {
      dispatch(gameActions.userSelectDiscard(index));
    }
    if (gameState === CONSTANT.GS_WAIT_USER_PLAY) {
      dispatch(gameActions.userSelectPlay(index));
    }
  };
  const handleScoreCardCLick = () => {
    setExpandScoreCard(!expandScoreCard);
  };
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
      if (playerModal.shown) {
        newGamePlayerModal.push(applyObjectToModal(miscDisplaySettings.playerModal, playerModal, 'PlayerModal'));
      }
    }
    if (miscDisplaySettings.promptModal.x !== undefined) {
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
  const cardFinishedMovement = (id, keyId) => {
    dispatch(gameActions.resolveCardMovement(id, keyId));
  };
  useEffect(() => {
    const newGameMovingCards = [];
    let uniqueKey;
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