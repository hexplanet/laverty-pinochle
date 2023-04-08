import React, {useState, useEffect} from 'react';
import CardTable from '../CardTable';
import { useDispatch, useSelector } from "react-redux";
import * as appActions from '../../redux/actions/appActions';
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
  const updateDimensions = () => {
    if (window.innerWidth !== windowWidth || window.innerHeight !== windowHeight) {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      dispatch(appActions.setCardTableLayout(
        window.innerWidth,
        window.innerHeight,
      ));
    }
  }
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    dispatch(appActions.setCardTableLayout(
      window.innerWidth,
      window.innerHeight,
    ));
    return () => window.removeEventListener("resize", updateDimensions);
  }, [dispatch]);
  useEffect(() => {
    switch(gameState) {
      case 'init':
        dispatch(appActions.setupForNewGame());
        break;
      case 'choseDealer':
        dispatch(appActions.throwForAce());
        break;
      case 'waitForAce:complete':
        if (melds[dealer][melds[dealer].length - 1].value === "A") {
          dispatch(appActions.selectedDealer());
        } else {
          dispatch(appActions.throwForAce());
        }
        break;
      case 'preMoveDeckToDealer':
        dispatch(appActions.storeGameState('waiting'));
        setTimeout(() => {
          dispatch(appActions.storeGameState('moveDeckToDealer'));
        }, 500);
        break;
      case 'moveDeckToDealer':
        dispatch(appActions.moveCardsToDealer());
        const cardsToDealer = () => { dispatch(appActions.moveCardsToDealer()); };
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
        dispatch(appActions.preDeal());
        setTimeout(() => {
          dispatch(appActions.storeGameState('deal'));
        }, 500);
        break;
      case 'deal':
        dispatch(appActions.moveCardsToDealer());
        const dealingCards = () => { dispatch(appActions.dealCards()); };
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
        dispatch(appActions.storeGameState('fanningOut'));
        for (let i = 0; i < 3.25; i = i + 0.25) {
          setTimeout(() => {
            dispatch(appActions.setHandFanOut(i));
          }, 125 * i);
        }
        setTimeout(() => {
          dispatch(appActions.checkForNines());
        }, 500);
        break;
      case 'ninesContinue':
      case 'nextBid':
        dispatch(appActions.nextBid());
        break;
      case 'computerBid':
        dispatch(appActions.storeGameState('waitingOnBid'));
        setTimeout(() => {
          dispatch(appActions.resolveComputerBid());
        }, getRandomRange(250, 2000, 1));
        break;
      case 'userBid':
        dispatch(appActions.getUserBid());
        break;
      case 'biddingComplete':
        setTimeout(() => {
          dispatch(appActions.decideBidWinner());
        }, 1000);
        break;
      case 'showWidow':
        for(let i = 0; i < hands.length + 1; i++) {
          setTimeout(() => {
            dispatch(appActions.showTheWidow(i));
          }, 1000 * i);
        }
        break;
      case 'widowMoving:complete':
        dispatch(appActions.decideThrowHand());
        break;
      case 'computerWantsToThrowHand':

        dispatch(appActions.agreeThrowHand());
        break;
      case 'throwHandDisagree':
        dispatch(appActions.disagreeThrowHand());
        break;
      case 'throwHand':
        dispatch(appActions.throwHand());
        break;
      case 'startDiscards':
        dispatch(appActions.clearPlayerModal());
        dispatch(appActions.startDiscards());
        break;
      case 'computerDiscard':
        dispatch(appActions.computerDiscards());
        break;
      case 'throwHandContinue':
      case 'selectTrumpSuit':
        dispatch(appActions.declareTrumpSuit());
        break;
      case 'waitRemoveDiscards:complete':
      case 'startMeld':
        dispatch(appActions.startMeld());
        break;
      case 'displayMeld':
        dispatch(appActions.displayMeld());
        break;
      case 'meldDelay':
        setTimeout(() => {
          dispatch(appActions.nextMeld());
        }, getRandomRange(250, 2000, 1));
        break;
      case 'movingMeldCardsBack:complete':
        dispatch(appActions.playLead());
        break;
      case 'cardToPlayPile:complete':
        dispatch(appActions.resolvePlay());
        break;
      case 'waitToClearPlayPile':
        setTimeout(() => {
          dispatch(appActions.playFollow());
        }, getRandomRange(250, 1000, 1));
        break;
      default:
        console.log('uncovered gameState: ', gameState);
    }
  }, [gameState]);
  const handleModalInput = (type, event, message) => {
    console.log(type, event, message);
    switch(message) {
      case 'ninesUserRedeal':
        if (hands.length === 4) {
          dispatch(appActions.partnerConfirmNinesRedeal());
        } else {
          dispatch(appActions.clearPlayerModal());
          dispatch(appActions.clearPromptModal());
          dispatch(appActions.storeGameState('preMoveDeckToDealer'));
        }
        break;
      case 'ninesContinue':
        dispatch(appActions.clearPlayerModal());
        dispatch(appActions.storeGameState('nextBid'));
        break;
      case 'ninesRedeal':
        dispatch(appActions.clearPlayerModal());
        dispatch(appActions.clearPromptModal());
        dispatch(appActions.storeGameState('preMoveDeckToDealer'));
        break;
      case 'postBidContinue':
        dispatch(appActions.showTheWidow());
        break;
      case 'widowContinue':
        dispatch(appActions.clearPlayerModal());
        dispatch(appActions.clearPromptModal());
        dispatch(appActions.moveWidowToHand());
        break;
      case 'throwHandContinue':
        dispatch(appActions.clearPlayerModal());
        dispatch(appActions.storeGameState('selectTrumpSuit'));
        break;
      case 'userThrowHand':
        dispatch(appActions.clearPlayerModal());
        dispatch(appActions.agreeThrowHand());
        break;
      case 'throwHandDisagree':
        dispatch(appActions.clearPlayerModal());
        dispatch(appActions.disagreeThrowHand());
        break;
      case 'throwHand':
        dispatch(appActions.throwHand());
        break;
      case 'userDiscard':
        dispatch(appActions.clearPlayerModal());
        dispatch(appActions.removeUserDiscards());
        break;
      case 'nameTrumpSuit':
        dispatch(appActions.storeGameState('selectTrumpSuit'));
        break;
      case 'startGamePlay':
        dispatch(appActions.startGamePlay());
        break;
      case 'postTrumpSuitContinue':
        dispatch(appActions.clearPlayerModal());
        dispatch(appActions.startDiscards());
        break;
      case 'postDiscardTrump':
        dispatch(appActions.clearPlayerModal());
        dispatch(appActions.storeGameState('waitRemoveDiscards:complete'));
        break;
      default:
        if (message.substr(0,4) === 'bid_') {
          dispatch(appActions.getUserBid(message));
        }
        if (message.substr(0,8) === 'trumpIs_') {
          dispatch(appActions.clearPlayerModal());
          dispatch(appActions.setTrumpSuit(message.split('trumpIs_')[1]));
        }
    }
  };
  const handleClickedCard = (id, index, suitValue) => {
    if (gameState === 'waitUserDiscard') {
      dispatch(appActions.userSelectDiscard(index));
    }
    if (gameState === 'waitUserPlay') {
      dispatch(appActions.userSelectPlay(index));
    }
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
            shown={/*showHands[index]*/true}
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
        />
      );
    }
    setScorePad(newGameScorePad);
  }, [teams, playScore, gameWon, miscDisplaySettings]);
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
    dispatch(appActions.resolveCardMovement(id, keyId));
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