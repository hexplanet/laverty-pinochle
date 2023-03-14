import {
  generateShuffledDeck,
  generatePromptModal,
  getCardLocation,
  getRandomRange,
  createLandingCard,
}  from '../../utils/helpers';
export const playerDisplaySettingsLogic = (width, height, players) => {
  const playerHandLocations = [];
  const playerDiscardLocations = [];
  const playerMebLocations = [];
  const miscLocations = {};
  const ratio = (width < height ? width : height) / 1250;
  const zoomFactor = ratio * 100;
  playerHandLocations.push({
    x: width / 2,
    y: height - (135 * ratio),
    zoom: zoomFactor,
    rotation: 0,
  });
  playerDiscardLocations.push({
    x: (width / 2) - (415 * ratio),
    y: height - (80 * ratio),
    zoom: zoomFactor * .75,
    rotation: 0,
  });
  playerMebLocations.push({
    x: width / 2,
    y: height - (270 * ratio),
    zoom: zoomFactor * .75,
    rotation: 0,
  });
  if (players === 3) {
    playerHandLocations.push({
      x: 320 * ratio,
      y: 320 * ratio,
      zoom: zoomFactor,
      rotation: 135,
    });
    playerDiscardLocations.push({
      x: 160 * ratio,
      y: 160 * ratio,
      zoom: zoomFactor * .75,
      rotation: 315,
    });
    playerMebLocations.push({
      x: 200 * ratio,
      y: 600 * ratio,
      zoom: zoomFactor * .75,
      rotation: 135,
    });
    playerHandLocations.push({
      x: width - (320 * ratio),
      y: 320 * ratio,
      zoom: zoomFactor,
      rotation: 225,
    });
    playerDiscardLocations.push({
      x: width - (160 * ratio),
      y: 160 * ratio,
      zoom: zoomFactor * .75,
      rotation: 45,
    });
    playerMebLocations.push({
      x: width - (200 * ratio),
      y: 600 * ratio,
      zoom: zoomFactor * .75,
      rotation: 225,
    });
  }
  if (players === 4) {
    playerHandLocations.push({
      x: 135 * ratio,
      y: height / 2,
      zoom: zoomFactor,
      rotation: 90,
    });
    playerDiscardLocations.push({
      x: 100 * ratio,
      y: (height / 2) - (415 * ratio),
      zoom: zoomFactor * .75,
      rotation: 270,
    });
    playerMebLocations.push({
      x: (270 * ratio),
      y: height / 2,
      zoom: zoomFactor * .75,
      rotation: 90,
    });
    playerHandLocations.push({
      x: width / 2,
      y: 135 * ratio,
      zoom: zoomFactor,
      rotation: 180,
    });
    playerDiscardLocations.push({
      x: (width / 2) + (415 * ratio),
      y: 100 * ratio,
      zoom: zoomFactor * .75,
      rotation: 0,
    });
    playerMebLocations.push({
      x: width / 2,
      y: 270 * ratio,
      zoom: zoomFactor * .75,
      rotation: 180,
    });
    playerHandLocations.push({
      x: width - (135 * ratio),
      y: height / 2,
      zoom: zoomFactor,
      rotation: 270,
    });
    playerDiscardLocations.push({
      x: width - (80 * ratio),
      y: (height / 2) + (415 * ratio),
      zoom: zoomFactor * .75,
      rotation: 270,
    });
    playerMebLocations.push({
      x: width - (270 * ratio),
      y: height / 2,
      zoom: zoomFactor * .75,
      rotation: 270,
    });
  }
  miscLocations.scorePad = {
    x: 85 * ratio,
    y: height - (110 * ratio),
    zoom: zoomFactor * .25,
  };
  miscLocations.playArea = {
    x: width / 2,
    y: height / 2,
    zoom: zoomFactor * .75,
  };
  miscLocations.playerModal = {
    x: width / 2,
    y: height - (70 * ratio),
    zoom: zoomFactor,
  };
  miscLocations.promptModal = {
    x: width - (120 * ratio),
    y: height - (90 * ratio),
    zoom: zoomFactor,
  };
  return {
    playerHandLocations,
    playerDiscardLocations,
    playerMebLocations,
    miscLocations,
    zoomRatio: ratio,
  };
};

export const resolveCardMovement = (
  id,
  movingCards,
  hands,
  mebs,
  discardPiles,
  playPile
) => {
  const changedValues = {};
  const moveCardIndex = movingCards.findIndex((moveCard) => moveCard.id === id);
  if (moveCardIndex > -1) {
    const stoppedCard = {...movingCards[moveCardIndex]};
    const landingSpot = id.split('to')[1];
    const objectType = landingSpot[0];
    const playerIndex = landingSpot.length > 1 ? Number(landingSpot[1]) : -1;
    const subIndex = landingSpot.length > 2 ? Number(landingSpot.substring(2)) : -1;
    const newMovingCards = [...movingCards];
    changedValues.movingCards = newMovingCards;
    newMovingCards.splice(moveCardIndex, 1);
    changedValues.movingCards = newMovingCards;
    const landingCard = createLandingCard(stoppedCard, objectType, playerIndex, subIndex);
    switch(objectType) {
      case 'H':
        const newHands = [...hands];
        newHands[playerIndex] = [...hands[playerIndex], landingCard];
        changedValues.hands = newHands;
        break;
      case 'M':
        const newMebs = [...mebs];
        newMebs[playerIndex] = [...mebs[playerIndex], landingCard];
        changedValues.mebs = newMebs;
        break;
      case 'D':
        const newDiscardPiles = [...discardPiles];
        newDiscardPiles[playerIndex] = [...discardPiles[playerIndex], landingCard];
        changedValues.discardPiles = newDiscardPiles;
        break;
      default:
        const newPlayPile = [...playPile, landingCard];
        changedValues.playPile = newPlayPile;
    }
  }
  return changedValues;
};

export const setGameValuesForNewGame = (teams, players) => {
  const throwAcesForDealerModal =
    generatePromptModal('Dealer is chosen by the first player to get an ace');
  const initedValues = {
    gameState: 'choseDealer',
    discardPiles: [],
    hands: [],
    mebs: [],
    playPile: [],
    movingCards: [],
    playPileShown: false,
    playScore: [],
    gameWon: '',
    playerModal: {shown: false},
    promptModal: throwAcesForDealerModal,
  };
  for(let i = 0; i < players.length; i++) {
    initedValues.discardPiles.push([]);
    initedValues.hands.push([]);
    initedValues.mebs.push([]);
  }
  for(let i = 0; i < teams.length; i++) {
    initedValues.playScore.push([]);
  }
  initedValues.discardPiles[0] = generateShuffledDeck();
  return initedValues;
};

export const throwCardForDeal = (state) => {
  const sourceCardId = `D0${state.discardPiles[0].length}`;
  const sourceCard = getCardLocation(sourceCardId, state);
  sourceCard.zoom = sourceCard.zoom * 2;
  const newDealer = (state.dealer + 1) % state.players.length;
  const targetCardId = `M${newDealer}`;
  const targetCard = getCardLocation(targetCardId, state);
  targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
  const dealtCard = state.discardPiles[0][state.discardPiles[0].length -1];
  const newDiscard0 = state.discardPiles[0];
  newDiscard0.pop();
  const newDiscards = state.discardPiles;
  newDiscards[0] = [...newDiscard0];
  const newMovingCard = {
    id: `${sourceCardId}to${targetCardId}`,
    suit: dealtCard.suit,
    value: dealtCard.value,
    shown: false,
    speed: 1,
    source: sourceCard,
    target: targetCard,
  };
  return {
    newDiscards,
    newDealer,
    newMovingCard
  };
}




export const passDeckToDealer = (
  discardPiles,
  mebs,
  players,
  dealer
) => {
  const dealerPromptModal =
    generatePromptModal((<div>The dealer is<br/><b>{players[dealer]}</b></div>));
  const moveCardsToDealer = [];
  return {
    dealerPromptModal,
    moveCardsToDealer
  };
};
