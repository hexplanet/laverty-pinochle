import React, {useState, useEffect} from 'react';
import CardTable from '../CardTable';
import { useDispatch, useSelector } from "react-redux";
import * as appActions from '../../redux/actions/appActions';
import Hand from "../../components/Hand";
import MoveCard from "../../components/MoveCard";
import Pile from "../../components/Pile";
import ScorePad from "../../components/ScorePad";
import Modal from "../../components/Modal";
import './index.scss';

function GamePlay() {
  const dispatch = useDispatch();
  const {
    hands,
    playerDisplaySettings,
    discardPiles,
    discardDisplaySettings,
    mebs,
    mebDisplaySettings,
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
    dealer
  } = useSelector((state) => state.app);
  const [windowWidth, setWindowWidth]   = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [gameHands, setGameHands] = useState([]);
  const [gameDiscards, setGameDiscards] = useState([]);
  const [gameMebs, setGameMebs] = useState([]);
  const [gamePlayArea, setGamePlayArea] = useState([]);
  const [gameScorePad, setScorePad] = useState([]);
  const [gamePlayerModal, setGamePlayerModal] = useState([]);
  const [gameMovingCard, setGameMovingCard] = useState([]);
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
  }, []);
  useEffect(() => {
    switch(gameState) {
      case 'init':
        dispatch(appActions.setupForNewGame());
        break;
      case 'choseDealer':
        dispatch(appActions.throwForAce());
        break;
      case 'waitForAce:complete':
        if (mebs[dealer][mebs[dealer].length -1].value === "A") {
          dispatch(appActions.selectedDealer());
        } else {
          dispatch(appActions.throwForAce());
        }
        break;
      default:
        console.log('uncovered gameState: ', gameState);
    }
  }, [gameState, mebs, dealer]);
  const HandleClickedCard = (id, card) => {
    console.log(id, card);
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
      />
    );
  }
  useEffect(() => {
    const newGameHands = [];
    const newGameDiscards = [];
    const newGameMebs = [];
    const newGamePlayArea = [];
    const newGameScorePad = [];
    const newGamePlayerModal = [];
    hands.forEach((hand, index) => {
      if (playerDisplaySettings[index]) {
        newGameHands.push(
          <Hand
            id={`player${index}`}
            key={`player${index}`}
            xLocation={playerDisplaySettings[index].x}
            yLocation={playerDisplaySettings[index].y}
            rotation={playerDisplaySettings[index].rotation}
            zoom={playerDisplaySettings[index].zoom}
            cards={hand}
            cardClicked={HandleClickedCard}
          />
        );
      }
    });
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
    mebs.forEach((meb, index) => {
      if (mebDisplaySettings[index]) {
        newGameMebs.push(
          <Pile
            key={`meb${index}`}
            xLocation={mebDisplaySettings[index].x}
            yLocation={mebDisplaySettings[index].y}
            rotation={mebDisplaySettings[index].rotation}
            zoom={mebDisplaySettings[index].zoom}
            cards={meb}
            shown={true}
          />
        );
      }
    });
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
    if (miscDisplaySettings.playerModal.x !== undefined) {
      if (playerModal.shown) {
        newGamePlayerModal.push(applyObjectToModal(miscDisplaySettings.playerModal, playerModal, 'PlayerModal'));
      }
    }
    if (miscDisplaySettings.promptModal.x !== undefined) {
      if (promptModal.shown) {
        newGamePlayerModal.push(applyObjectToModal(miscDisplaySettings.promptModal, promptModal, 'PlayerModal'));
      }
    }
    setGamePlayerModal(newGamePlayerModal);
    setScorePad(newGameScorePad);
    setGameHands(newGameHands);
    setGameDiscards(newGameDiscards);
    setGameMebs(newGameMebs);
    setGamePlayArea(newGamePlayArea);
  }, [
    hands,
    playerDisplaySettings,
    setGameHands,
    discardPiles,
    discardDisplaySettings,
    mebs,
    mebDisplaySettings,
    playPile,
    playPileShown,
    miscDisplaySettings,
    teams,
    playScore,
    gameWon,
    playerModal,
    promptModal,
  ]);
  const cardFinishedMovement = (id) => {
    dispatch(appActions.resolveCardMovement(id));
  };
  useEffect(() => {
    const newGameMovingCards = [];
    movingCards.forEach((movingCard) => {
      newGameMovingCards.push(
        <MoveCard
          id={movingCard.id}
          key={movingCard.id}
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
    setGameMovingCard(newGameMovingCards);
  }, [movingCards]);
  return (
    <div>
      <CardTable
        displayDiscards={gameDiscards}
        displayHands={gameHands}
        displayMebs={gameMebs}
        displayGameArea={gamePlayArea}
        displayScorePad={gameScorePad}
        displayMovingCards={gameMovingCard}
        displayPlayerModal={gamePlayerModal}
      />
    </div>
  );
}
export default GamePlay;