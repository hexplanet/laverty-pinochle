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
import './index.scss';

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
      case 'init':
        dispatch(gameActions.setupForNewGame());
        break;
      case 'choseDealer':
        dispatch(gameActions.throwForAce());
        break;
      case 'waitForAce:complete':
        if (melds[dealer][melds[dealer].length - 1].value === "A") {
          dispatch(gameActions.selectedDealer());
        } else {
          dispatch(gameActions.throwForAce());
        }
        break;
      case 'preMoveDeckToDealer':
        dispatch(gameActions.storeGameState('waiting'));
        setTimeout(() => {
          dispatch(gameActions.storeGameState('moveDeckToDealer'));
        }, 500);
        break;
      case 'moveDeckToDealer':
        dispatch(gameActions.moveCardsToDealer());
        const cardsToDealer = () => { dispatch(gameActions.moveCardsToDealer()); };
        setActionTimer(
          setInterval(
            cardsToDealer,
            50
          )
        );
        break;
      case 'moveDeckToDealer:complete':
        clearInterval(actionTimer);
        setActionTimer(null);
        dispatch(gameActions.preDeal());
        setTimeout(() => {
          dispatch(gameActions.storeGameState('deal'));
        }, 500);
        break;
      case 'deal':
        dispatch(gameActions.moveCardsToDealer());
        const dealingCards = () => { dispatch(gameActions.dealCards()); };
        setActionTimer(
          setInterval(
            dealingCards,
            250
          )
        );
        break;
      case 'deal:complete':
        clearInterval(actionTimer);
        setActionTimer(null);
        dispatch(gameActions.storeGameState('fanningOut'));
        for (let i = 0; i < 3.25; i = i + 0.25) {
          setTimeout(() => {
            dispatch(gameActions.setHandFanOut(i));
          }, 125 * i);
        }
        setTimeout(() => {
          dispatch(gameActions.checkForNines());
        }, 500);
        break;
      case 'ninesContinue':
      case 'nextBid':
        dispatch(gameActions.nextBid());
        break;
      case 'computerBid':
        dispatch(gameActions.storeGameState('waitingOnBid'));
        timedDelay(getRandomRange(250, 2000, 1), () => {
          dispatch(gameActions.resolveComputerBid());
        });
        break;
      case 'userBid':
        dispatch(gameActions.getUserBid());
        break;
      case 'biddingComplete':
        setTimeout(() => {
          dispatch(gameActions.decideBidWinner());
        }, 1000);
        break;
      case 'showWidow':
        for(let i = 0; i < hands.length + 1; i++) {
          setTimeout(() => {
            dispatch(gameActions.showTheWidow(i));
          }, 1000 * i);
        }
        break;
      case 'widowMoving:complete':
        dispatch(gameActions.decideThrowHand());
        break;
      case 'computerWantsToThrowHand':
        dispatch(gameActions.agreeThrowHand());
        break;
      case 'throwHandDisagree':
        dispatch(gameActions.disagreeThrowHand());
        break;
      case 'throwHand':
        dispatch(gameActions.throwHand());
        break;
      case 'startDiscards':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.startDiscards());
        break;
      case 'computerDiscard':
        dispatch(gameActions.computerDiscards());
        break;
      case 'throwHandContinue':
      case 'selectTrumpSuit':
        dispatch(gameActions.declareTrumpSuit());
        break;
      case 'waitRemoveDiscards:complete':
      case 'startMeld':
        dispatch(gameActions.startMeld());
        break;
      case 'displayMeld':
        dispatch(gameActions.displayMeld());
        break;
      case 'meldDelay':
        timedDelay(getRandomRange(250, 2000, 1), () => {
          dispatch(gameActions.nextMeld());
        });
        break;
      case 'movingMeldCardsBack:complete':
      case 'startNextPlay':
        dispatch(gameActions.playLead());
        break;
      case 'cardToPlayPile:complete':
        dispatch(gameActions.resolvePlay());
        break;
      case 'waitToClearPlayPile':
        timedDelay(getRandomRange(250, 1000, 1), () => {
          dispatch(gameActions.playFollow());
        });
        break;
      case 'waitMovePlayPileToDiscard':
        timedDelay(2500, () => {
          dispatch(gameActions.movePlayPileToDiscard());
        });
        break;
      case 'restMoveToDiscard:complete':
      case 'playPileToDiscard:complete':
        dispatch(gameActions.startNextPlay());
        break;
      case 'tallyCounts':
      case 'nextTally':
        dispatch(gameActions.tallyCounts());
        break;
      case 'moveDiscardToMeldTally:complete':
        dispatch(gameActions.addCountToTally());
        break;
      case 'doneCounting':
        dispatch(gameActions.addCountToScore())
        break;
      default:
    }
  }, [gameState]);
  const handleModalInput = (type, event, message) => {
    switch(message) {
      case 'ninesUserRedeal':
        if (hands.length === 4) {
          dispatch(gameActions.partnerConfirmNinesRedeal());
        } else {
          dispatch(gameActions.clearPlayerModal());
          dispatch(gameActions.clearPromptModal());
          dispatch(gameActions.storeGameState('preMoveDeckToDealer'));
        }
        break;
      case 'ninesContinue':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.storeGameState('nextBid'));
        break;
      case 'ninesRedeal':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.clearPromptModal());
        dispatch(gameActions.storeGameState('preMoveDeckToDealer'));
        break;
      case 'postBidContinue':
        dispatch(gameActions.showTheWidow());
        break;
      case 'widowContinue':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.clearPromptModal());
        dispatch(gameActions.moveWidowToHand());
        break;
      case 'throwHandContinue':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.storeGameState('selectTrumpSuit'));
        break;
      case 'userThrowHand':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.agreeThrowHand());
        break;
      case 'throwHandDisagree':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.disagreeThrowHand());
        break;
      case 'throwHand':
        dispatch(gameActions.throwHand());
        break;
      case 'userDiscard':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.removeUserDiscards());
        break;
      case 'nameTrumpSuit':
        dispatch(gameActions.storeGameState('selectTrumpSuit'));
        break;
      case 'startGamePlay':
        dispatch(gameActions.startGamePlay());
        break;
      case 'postTrumpSuitContinue':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.startDiscards());
        break;
      case 'postDiscardTrump':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.storeGameState('waitRemoveDiscards:complete'));
        break;
      case 'endOfHand':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.endHand());
        break;
      case 'winRestContinue':
        dispatch(gameActions.clearPlayerModal());
        dispatch(gameActions.moveRestToDiscard());
        break;
      default:
        if (message.substr(0,4) === 'bid_') {
          dispatch(gameActions.getUserBid(message));
        }
        if (message.substr(0,8) === 'trumpIs_') {
          dispatch(gameActions.clearPlayerModal());
          dispatch(gameActions.setTrumpSuit(message.split('trumpIs_')[1]));
        }
    }
  };
  const handleClickedCard = (id, index, suitValue) => {
    if (gameState === 'waitUserDiscard') {
      dispatch(gameActions.userSelectDiscard(index));
    }
    if (gameState === 'waitUserPlay') {
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