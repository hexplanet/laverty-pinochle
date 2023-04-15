import {
  generateShuffledDeck,
  generalModalData,
  getCardLocation,
  getRandomRange,
  createLandingCard,
  sortCardHand,
  getHandMeld,
  getProjectedCount,
  getHandBid,
  getTrumpSuit,
  getWinValue,
  getTrumpBidHeader,
  setValidCardIndexes,
  suitIconSelector,
  getUnplayedCards,
  getWinningCards,
  getHighestNonCount,
  getHandLeaderMessage,
  getTrumpPullingSuits,
  getPartnerPassSuits,
  throwCardIntoMiddle,
  getBestCounter,
  getLowestNonCount,
  getHandWinMessage,
  getWinner
} from '../../utils/helpers';

export const playerDisplaySettingsLogic = (width, height, players) => {
  const playerHandLocations = [];
  const playerDiscardLocations = [];
  const playerMeldLocations = [];
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
  playerMeldLocations.push({
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
    playerMeldLocations.push({
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
    playerMeldLocations.push({
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
    playerMeldLocations.push({
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
    playerMeldLocations.push({
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
    playerMeldLocations.push({
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
  let newBidLocations = [];
  let newBidLocation;
  for(let i = 0; i < players; i++) {
    if (players === 4) {
      newBidLocation = { x: width / 2, y: height / 2, zoom: zoomFactor };
      if (i % 2 === 0) {
        newBidLocation.y = (i === 0) ? height - (135 * ratio) : (52 * ratio);
      } else {
        newBidLocation.x = (i === 3) ? width - (52 * ratio) : (44 * ratio);
      }
      newBidLocations = [...newBidLocations, newBidLocation];
    } else {
      newBidLocation = { x: width / 2, y: (110 * ratio), zoom: zoomFactor };
      switch (i) {
        case 1:
          newBidLocation.x = (110 * ratio);
          break;
        case 2:
          newBidLocation.x = width - (110 * ratio);
          break;
        default:
          newBidLocation.y = height - (135 * ratio);
      }
      newBidLocations = [...newBidLocations, newBidLocation];
    }
  }
  miscLocations.gameBidModals = newBidLocations;
  return {
    playerHandLocations,
    playerDiscardLocations,
    playerMeldLocations,
    miscLocations,
    zoomRatio: ratio,
  };
};

export const resolveCardMovement = (
  id,
  keyId,
  movingCards,
  hands,
  melds,
  discardPiles,
  playPile
) => {
  const changedValues = {};
  const moveCardIndex = movingCards.findIndex((moveCard) => moveCard.keyId === keyId);
  if (moveCardIndex > -1) {
    const stoppedCard = movingCards[moveCardIndex];
    const landingSpot = id.split('to')[1];
    const objectType = landingSpot[0];
    const playerIndex = landingSpot.length > 1 ? Number(landingSpot[1]) : -1;
    const subIndex = landingSpot.length > 2 ? Number(landingSpot.substring(2)) : -1;
    const newMovingCards = [...movingCards];
    changedValues.movingCards = newMovingCards;
    newMovingCards.splice(moveCardIndex, 1);
    changedValues.movingCards = [...newMovingCards];
    const landingCard = createLandingCard(stoppedCard, objectType, playerIndex, subIndex);
    switch(objectType) {
      case 'H':
        const newHands = [...hands];
        newHands[playerIndex] = [...hands[playerIndex], landingCard];
        newHands[playerIndex] = sortCardHand(newHands[playerIndex]);
        changedValues.hands = newHands;
        break;
      case 'M':
        const newMelds = [...melds];
        newMelds[playerIndex] = [...melds[playerIndex], landingCard];
        changedValues.melds = newMelds;
        break;
      case 'D':
        const newDiscardPiles = [...discardPiles];
        newDiscardPiles[playerIndex] = [...discardPiles[playerIndex], landingCard];
        changedValues.discardPiles = newDiscardPiles;
        break;
      default:
        let newPlayPile =  [...playPile];
        if (landingSpot[1] !== '-') {
          newPlayPile[Number(landingSpot[1])] = landingCard;
        } else {
          newPlayPile = [...playPile, landingCard];
        }
        changedValues.playPile = newPlayPile;
    }
  }
  return changedValues;
};

export const setGameValuesForNewGame = (teams, players) => {
  const throwAcesForDealerModal =
    generalModalData('Dealer is chosen by the first player to get an ace');
  const initedValues = {
    gameState: 'choseDealer',
    discardPiles: [],
    showHands: [],
    hands: [],
    melds: [],
    meldScores: [],
    playPile: [],
    movingCards: [],
    playPileShown: false,
    playScore: [],
    gameWon: '',
    playerModal: {shown: false},
    promptModal: throwAcesForDealerModal,
    bidModals: [],
  };
  for(let i = 0; i < players.length; i++) {
    initedValues.discardPiles.push([]);
    initedValues.hands.push([]);
    initedValues.melds.push([]);
    initedValues.meldScores.push(0);
    initedValues.showHands.push(i === 0);
    initedValues.bidModals.push({shown: false});
  }
  for(let i = 0; i < teams.length; i++) {
    initedValues.playScore.push([]);
  }
  initedValues.discardPiles[0] = generateShuffledDeck();
  const gameValues = setGameValuesForNewHand(players);
  const newValues = {...initedValues, ...gameValues};
  return newValues;
};

export const setGameValuesForNewHand = (players) => {
  const initGameValues = {
    bids: [],
    seenWidow: [],
    seenCards: [],
    playedCards: [],
    offSuits: []
  };
  for(let i = 0; i < players.length; i++) {
    initGameValues.bids.push(0);
    initGameValues.seenCards.push([]);
    initGameValues.playedCards.push([]);
    initGameValues.offSuits.push([]);
  }
  return initGameValues;
};

export const throwCardForDeal = (state) => {
  const sourceCardId = `D0${state.discardPiles[0].length - 1}`;
  const sourceCard = getCardLocation(sourceCardId, state);
  sourceCard.zoom = sourceCard.zoom * 2;
  const newDealer = (state.dealer + 1) % state.players.length;
  const targetCardId = `M${newDealer}`;
  const targetCard = getCardLocation(targetCardId, state);
  targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
  const dealtCard = state.discardPiles[0][state.discardPiles[0].length -1];
  const newDiscard0 = state.discardPiles[0];
  newDiscard0.pop();
  const newDiscards = [...state.discardPiles];
  newDiscards[0] = [...newDiscard0];
  const newMovingCard = {
    id: `${sourceCardId}to${targetCardId}`,
    keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
    suit: dealtCard.suit,
    value: dealtCard.value,
    shown: true,
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
export const declareDealer = (
  players,
  dealer
) => {
  const dealerPromptModal =
    generalModalData((<div>The dealer is<br/><b>{players[dealer]}</b></div>));
  return {
    dealerPromptModal,
  };
};
export const passDeckToDealer = (state) => {
  let sourceCard;
  let newMovingCard;
  let cardsToMove = [];
  let toDealerMovingCards = state.movingCards;
  const toDealerDiscards = [...state.discardPiles];
  const toDealerMelds = [...state.melds];
  const toDealerHands = [...state.hands];
  let toDealerPlayPile = [...state.playPile];
  const targetCardId = `D${state.dealer}`;
  const targetCard = getCardLocation(targetCardId, state);
  const toDealerBidModels = [];
  for(let i = 0 ; i < state.players.length; i++) {
    toDealerBidModels.push({shown: false});
    if (i !== state.dealer && state.discardPiles[i].length > 0) {
      cardsToMove.push(`D${i}${state.discardPiles[i].length - 1}`);
      const newDiscard = state.discardPiles[i];
      newDiscard.pop();
      toDealerDiscards[i] = [...newDiscard];
    }
    if (state.melds[i].length > 0) {
      cardsToMove.push(`M${i}${state.melds[i].length - 1}`);
      const newMeld = state.melds[i];
      newMeld.pop();
      toDealerMelds[i] = [...newMeld];
    }
    if (state.hands[i].length > 0) {
      cardsToMove.push(`H${i}${state.hands[i].length - 1}`);
      const newHand = state.hands[i];
      newHand.pop();
      toDealerHands[i] = [...newHand];
    }
  }
  if (state.playPile.length > 0) {
    cardsToMove.push(`P${toDealerPlayPile.length - 1}`);
    toDealerPlayPile.pop();
    toDealerPlayPile=[...toDealerPlayPile];
  }
  cardsToMove.forEach(cardToMove => {
    sourceCard = getCardLocation(cardToMove, state);
    newMovingCard = {
      id: `${cardToMove}to${targetCardId}`,
      key: `${cardToMove}to${targetCardId}`,
      keyId: `${cardToMove}to${targetCardId}${Date.now()}`,
      shown: false,
      speed: 10,
      travelTime: 51,
      source: sourceCard,
      target: targetCard,
    };
    toDealerMovingCards = [...toDealerMovingCards, newMovingCard];
  });
  return ({
    toDealerMovingCards,
    toDealerMelds,
    toDealerDiscards,
    toDealerHands,
    toDealerPlayPile,
    toDealerBidModels
  });
};

export const preDealing = (discards, dealer) => {
  const shuffledCards = [...discards];
  shuffledCards[dealer] = [...generateShuffledDeck()];
  const clearPlayerPrompt =
    generalModalData("");
  return { shuffledCards, clearPlayerPrompt };
};

export const dealing = (state) => {
  const dealDeck = [...state.discardPiles];
  let dealCards = [...state.movingCards];
  const newDiscardDeck = state.discardPiles[state.dealer];
  if (newDiscardDeck.length > 0) {
    const cardsToThrow = (newDiscardDeck.length > 48 - state.players.length * 3) ? 3 : 4;
    const targets = [];
    if (state.dealer === state.dealToPlayer) {
      if (state.players.length === 3 && state.hands[state.dealer].length > 0) {
        targets.push("P-1");
      }
      if (state.players.length === 4) {
        targets.push("P-1");
        if (state.hands[state.dealer].length === 0) {
          targets.push("P-1");
        }
      }
    }
    for (let i = 0; i < cardsToThrow; i++) {
      targets.push(`H${state.dealToPlayer}`);
    }
    targets.forEach(target => {
      const sourceCardId = `D${state.dealer}${newDiscardDeck.length - 1}`;
      const sourceCard = getCardLocation(sourceCardId, state);
      sourceCard.zoom = sourceCard.zoom * 2;
      const targetCard = getCardLocation(target, state);
      const targetCardId = target;
      targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
      const dealtCard = newDiscardDeck[newDiscardDeck.length -1];
      newDiscardDeck.pop();
      const newMovingCard = {
        id: `${sourceCardId}to${targetCardId}`,
        keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
        suit: dealtCard.suit,
        value: dealtCard.value,
        shown: false,
        travelTime: 300,
        source: sourceCard,
        target: targetCard,
      };
      dealCards = [...dealCards, newMovingCard];
    });
    dealDeck[state.dealer] = [...newDiscardDeck];
  }
  return {
    dealDeck,
    dealCards,
  };
};
export const checkForNines = (hands, players) => {
  let ninesPromptModal;
  let ninesPlayerModal;
  let ninesGameState = 'ninesContinue';
  let ninesPlayer = -1;
  let promptWording;
  let playerWording;
  let playerButtons = {};
  hands.forEach((hand, index) => {
    let nines = 0;
    hand.forEach(card => {
      if (card.value === '9') {
        nines++;
      }
    });
    if (nines > 9 - players.length) {
      ninesPlayer = index;
    }
  });
  if (ninesPlayer > -1) {
    const playerWordingChange = ninesPlayer === 0 ? 'have' : 'has';
    if (ninesPlayer > 0) {
      const bid = getHandBid(hands[ninesPlayer], players);
      ninesGameState = 'ninesContinue';
      if (bid < 21) {
        if (players.length === 4) {
          if (ninesPlayer === 2) {
            promptWording = (<div><b>{players[2]}</b> {playerWordingChange} nines for re-deal</div>);
            playerWording = (<div>Do you agree to a re-deal?</div>);
            playerButtons = { buttons: [{
                label: 'No',
                returnMessage: 'ninesContinue'
              },
                {
                  label: 'Yes',
                  status: 'warning',
                  returnMessage: 'ninesRedeal'
                }
              ]};
            ninesGameState = 'ninesUserAgree';
          } else {
            const ninesPartner = (ninesPlayer + 2) % 4;
            const partnerBid = getHandBid(hands[ninesPartner], players);
            if (partnerBid < 21) {
              promptWording = (
                <div>
                  <b>{players[ninesPlayer]}</b> {playerWordingChange} nines for re-deal<br/>
                  <b>{players[ninesPartner]}</b> agrees.
                </div>
              );
              playerButtons = {
                hasBox: false,
                buttons: [{
                  label: 'Re-deal',
                  status: 'warning',
                  returnMessage: 'ninesRedeal'
                }],
              };
              ninesGameState = 'waitRedeal';
            } else {
              promptWording = (
                <div>
                  <b>{players[ninesPlayer]}</b> {playerWordingChange} nines for re-deal<br/>
                  <b>{players[ninesPartner]}</b> disagrees with re-deal.
                </div>
              );
              ninesGameState = 'waitNinesContinue';
              playerButtons = {
                hasBox: false,
                buttons: [{
                  label: 'Continue',
                  returnMessage: 'ninesContinue'
                }],
              };
            }
          }
        } else {
          promptWording = (<div><b>{players[ninesPlayer]}</b> has enough nines for the re-deal</div>);
          playerButtons = {
            hasBox: false,
            buttons: [{
              label: 'Re-deal',
              status: 'warning',
              returnMessage: 'ninesRedeal'
            }],
          };
          ninesGameState = 'waitRedeal';
        }
      }
    } else {
      promptWording = (<div><b>{players[0]}</b> {playerWordingChange} enough nines for<br/>a re-deal.</div>);
      playerWording = (<div>Do you want a re-deal for 9s?</div>);
      playerButtons = { buttons: [{
          label: 'No',
          returnMessage: 'ninesContinue'
        },
        {
          label: 'Yes',
          status: 'warning',
          returnMessage: 'ninesUserRedeal'
        }
      ]};
      ninesGameState = 'ninesUserRedealWait';
    }
    if (promptWording) {
      ninesPromptModal = generalModalData(promptWording, {});
    }
    if (playerWording || Object.keys(playerButtons).length > 0) {
      ninesPlayerModal = generalModalData(playerWording, playerButtons);
    }
  }
  return {
    ninesPromptModal,
    ninesPlayerModal,
    ninesGameState
  };
};

export const checkPostNines = (
  hands,
  players,
) => {
  const bid = getHandBid(hands[2], players);
  let promptWording =
    (<div><b>{players[0]}</b> have enough nines for<br/>a re-deal.<br/><b>{players[2]}</b> agrees.</div>);
  let playerButtons = {
    hasBox: false,
    buttons: [{
      label: 'Re-deal',
      status: 'warning',
      returnMessage: 'ninesRedeal'
    }],
  };
  if (bid > 20) {
    promptWording =
      (<div><b>{players[0]}</b> have enough nines for<br/>a re-deal.<br/><b>{players[2]}</b> disagrees.</div>);
    playerButtons = {
      hasBox: false,
      buttons: [{
        label: 'Continue',
        returnMessage: 'ninesContinue'
      }],
    };
  }
  const postNinesGameState = 'postNinesWait';
  const postNinesPromptModal = generalModalData(promptWording, {});
  const postNinesPlayerModal = generalModalData('', playerButtons);
  return {
    postNinesPromptModal,
    postNinesPlayerModal,
    postNinesGameState
  };
};

export const nextBid = (players, firstBid) => {
  const secondLine = (firstBid === 0)
    ? (<span>Please make your bid.</span>) : (<span><b>{players[firstBid]}</b> is now bidding</span>);
  const nextBidPrompt =
    generalModalData(<div >Players now make their bids.<br/>{secondLine}</div>);
  return {
    nextBidPrompt,
  };
};

export const computerBid = (hands, dealToPlayer, players, bids) => {
  let maxBid = 0;
  bids.forEach(highBid => {
    if (highBid > maxBid) {
      maxBid = highBid;
    }
  });
  let bid = 0;
  const suits = ['H', 'S', 'D', 'C'];
  let suitBid;
  suits.forEach(suit => {
    const { points, nearMiss } = getHandMeld(hands[dealToPlayer], suit);
    const { projectedCounts } = getProjectedCount(hands[dealToPlayer], suit, players);
    suitBid = Math.round((points / 2) + projectedCounts + nearMiss);
    if (suitBid < 21) {
      suitBid = Math.round((points * .75) + projectedCounts + nearMiss);
    }
    if (suitBid > bid) {
      bid = suitBid;
    }
  });
  if (bid < 21 || bid <= maxBid) {
    bid = 0;
  }
  return bid;
}

export const configureUserBidModal = (bids, bidOffset, dealToPlayer, dealer) => {
  let maxBid = 0;
  let maxedBidOffset = bidOffset;
  let bidButtons;
  bids.forEach(bid => {
    if (bid > maxBid) {
      maxBid = bid;
    }
  });
  if (dealer === dealToPlayer) {
    bidButtons = [
      { label: 'Pass', returnMessage: 'bid_0' },
      { label: String(maxBid + 1), returnMessage: `bid_${maxBid + 1}` }
    ];
  } else {
    if (maxedBidOffset <= maxBid) {
      maxedBidOffset = maxBid + 1;
    }
    bidButtons = [
      {
        label: 'Pass',
        returnMessage: 'bid_0',
      },
      {
        label: '<',
        returnMessage: 'bid_left',
        status: (bidOffset === 21) ? 'inactive' : '',
      }
    ];
    for(let i = maxedBidOffset; i < maxedBidOffset + 5; i++) {
      if (i < 51) {
        bidButtons.push({
          label: String(i),
          returnMessage: `bid_${i}`
        });
      }
    }
    bidButtons.push({
      label: '>',
      returnMessage: 'bid_right',
      status: (maxedBidOffset < 46) ? '' : 'inactive',
    });
  }
  const bidPlayerModal = generalModalData(
    '',
    {
      hasBox: false,
      width: 500,
      buttons: bidButtons
    }
  );
  return {
    bidPlayerModal,
    maxedBidOffset
  };
};

export const resolveBidding = (
  bids,
  players,
  teams,
  playScore
) => {
  let wonTheBid = 0;
  let wonBidWith = 0;
  bids.forEach((bid, bidIndex) => {
    if (bid > wonBidWith) {
      wonBidWith = bid;
      wonTheBid = bidIndex;
    }
  });
  const tookBidPlayerModal = generalModalData('',{
    hasBox: false,
    buttons: [{
      label: 'Continue',
      returnMessage: 'postBidContinue',
    }]
  });
  const bidColumn = wonTheBid % teams.length;
  const updatedBidScore = [...playScore];
  for(let i = 0; i < teams.length; i++) {
    updatedBidScore[i].push({
      bid: (bidColumn === i) ? String(wonBidWith) : '',
      gotSet: false,
      meld: '',
      counts: '',
      score: '',
    });
  }
  const howWon = wonBidWith === 20 ? 'was forced to take the bid' : 'won the bid';
  const tookBidPromptModal =
    generalModalData((<div><b>{players[wonTheBid]}</b> {howWon} with <b>{wonBidWith}</b></div>),{});
  return {
    tookBidPlayerModal,
    tookBidPromptModal,
    wonTheBid,
    updatedBidScore,
    wonBidWith,
  };
};

export const displayWidow = (
  playPile,
  widowCardIndex,
  players
) => {
  const newPlayPile = playPile;
  if (widowCardIndex > -1) {
    const pileIndex = newPlayPile.length - widowCardIndex - 1;
    const adjustedCard = newPlayPile[pileIndex];
    adjustedCard.shown = true;
    adjustedCard.rotation = 0;
    adjustedCard.xOffset = -(60 * (players.length - 1)) + (120 * widowCardIndex) + 10;
    adjustedCard.yOffset = 150;
    newPlayPile[pileIndex] = {...adjustedCard};
  }
  return [...newPlayPile];
};

export const movingWidow = (state) => {
  let widowMovingCards = [];
  const widowSeen = [];
  state.playPile.forEach((card, cardIndex) => {
    const sourceCardId = `P${cardIndex}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    const targetCardId = `H${state.tookBid}`;
    const targetCard = getCardLocation(targetCardId, state);
    targetCard.zoom = targetCard.zoom * 2;
    targetCard.rotation = targetCard.rotation + getRandomRange(-5, 5, 1);
    const newMovingCard = {
      id: `${sourceCardId}to${targetCardId}`,
      keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
      suit: card.suit,
      value: card.value,
      shown: false,
      speed: 1,
      source: sourceCard,
      target: targetCard,
    };
    widowSeen.push(`${card.suit}${card.value}`);
    widowMovingCards = [...widowMovingCards, newMovingCard];
  });
  const widowEmptyPlayPile = [];
  for(let i = 0; i < state.players.length; i++) {
    widowEmptyPlayPile.push(null);
  }
  return {
    widowMovingCards,
    widowSeen,
    widowEmptyPlayPile
  };
};
export const shouldComputerThrowHand = (hands, tookBid, bidAmount, players) => {
  let computerThrowGameState = 'throwHandContinue';
  const suits = ['D', 'S', 'C', 'H'];
  let high = 0;
  let meld = 0;
  suits.forEach(suit => {
    const { points } = getHandMeld(hands[tookBid], suit);
    const { projectedCounts } = getProjectedCount(hands[tookBid], suit, players, false);
    if (points + projectedCounts > high) {
      high = points + projectedCounts;
      meld = points;
    }
  });
  const willFail = (hands.length === 3 && meld + 25 < bidAmount);
  let mayFail;
  if (hands.length === 3) {
    mayFail = (high < bidAmount - 4);
  } else {
    mayFail = (high < bidAmount - 8);
  }
  if (mayFail || willFail) {
    computerThrowGameState =
      (hands.length === 4) ? 'computerWantsToThrowHand' : 'throwHand';
  }
  return { computerThrowGameState };
};

export const shouldComputerAgreeThrowHand = (hands, tookBid, players) => {
  let computerAgreeThrowHand = 'throwHand';
  const { points } = getHandMeld(hands[tookBid], '');
  const { totalWins } = getProjectedCount(hands[tookBid], '', players, false);
  if (points >= 12 || totalWins.length >= 6) {
    computerAgreeThrowHand = 'throwHandDisagree';
  }
  return { computerAgreeThrowHand };
};

export const shouldUserThrowHand = (hands, bidAmount, players) => {
  let throwPlayerModal = {shown: false};
  const suits = ['D', 'S', 'C', 'H'];
  let high = 0;
  let meld = 0;
  suits.forEach(suit => {
    const { points } = getHandMeld(hands[0], suit);
    const { projectedCounts } = getProjectedCount(hands[0], suit, players, false);
    if (points + projectedCounts > high) {
      high = points + projectedCounts;
      meld = points;
    }
  });
  const willFail = (hands.length === 3 && meld + 25 < bidAmount);
  let mayFail;
  if (hands.length === 3) {
    mayFail = (high < bidAmount - 4);
  } else {
    mayFail = (high < bidAmount - 8);
  }
  let prompt = '';
  if (willFail) {
    prompt = "You can't make the bid. Throw hand?";
  } else if (mayFail) {
    prompt = "You might not make the bid. Throw hand?";
  }
  if (prompt !== '') {
    throwPlayerModal = generalModalData(
      prompt,
      {
        width: 500,
        height: 105,
        buttons: [
          {
            label: 'Play Hand',
            returnMessage: 'throwHandContinue',
          },
          {
            label: 'Throw Hand',
            returnMessage: (players.length === 4) ? 'userThrowHand' : 'throwHand',
          }
        ]
      }
    );
  }
  const throwGameState = (mayFail || willFail) ? 'waitUserThrowHand' : 'throwHandContinue';
  return {
    throwPlayerModal,
    throwGameState
  }
};

export const setUpDiscards = (hands, tookBid, players, trumpSuit, bidAmount) => {
  const discardHands = [...hands];
  let discardGameState = 'computerDiscard';
  let discardPlayerModal = {shown: false};
  const trumpHeader = getTrumpBidHeader(trumpSuit, tookBid, bidAmount, players);
  const flexWord = (tookBid === 0) ? 'have' : 'has';
  const discardMessage = (<span><b>{players[tookBid]}</b> {flexWord} to discard {players.length} cards</span>);
  const discardPromptModal = generalModalData(discardMessage, {...trumpHeader});
  if (tookBid === 0) {
    const userDiscardMessage = (<span>Cards: Meld = yellow, Trump = orange</span>)
    discardPlayerModal = generalModalData(userDiscardMessage, {
      width: 450,
      height: 105,
      buttons: [{ label: 'Discard', status: 'inactive', returnMessage: 'userDiscard' }],
    });
    discardGameState = 'waitUserDiscard';
    const { cardsUsed } = getHandMeld(hands[0], trumpSuit);
    discardHands[0].forEach((card, cardIndex) => {
      const suitValue = `${discardHands[0][cardIndex].suit}${discardHands[0][cardIndex].value}`;
      const whereMatch = cardsUsed.findIndex(usedCard => usedCard === suitValue);
      if (whereMatch > -1) {
        cardsUsed.splice(whereMatch, 1);
        discardHands[0][cardIndex].frontColor = '#eea';
      } else if (card.suit === trumpSuit) {
        discardHands[0][cardIndex].frontColor = '#ffaf7a';
      }
      discardHands[0][cardIndex].shown = true;
      discardHands[0][cardIndex].active = true;
      discardHands[0][cardIndex].clickable = true;
      discardHands[0][cardIndex].raised = false;
      discardHands[0][cardIndex].rolloverColor = '#0f0';
    });
  }
  return {
    discardGameState,
    discardPlayerModal,
    discardPromptModal,
    discardHands
  };
};

export const userSelectDiscard = (hands, playerModal, index) => {
  const discardUserHands = [...hands];
  const discardUserModal = {...playerModal};
  discardUserHands[0][index].raised = !discardUserHands[0][index].raised;
  let totalRaised = 0;
  discardUserHands[0].forEach(card => {
    if (card.raised) {
      totalRaised++;
    }
  });
  discardUserModal.buttons[0].status = (totalRaised === hands.length) ? '' : 'inactive';
  return {
    discardUserHands,
    discardUserModal
  };
};

export const removeUserDiscard = (state) => {
  const removeUserHands = [...state.hands];
  let removeUserMovingCards = [];
  const sources = [];
  for (let i = state.hands[0].length - 1; i >= 0; i = i - 1) {
    if (state.hands[0][i].raised) {
      sources.push(state.hands[0][i]);
      sources[sources.length - 1].index = i;
      removeUserHands[0].splice(i, 1);
    } else {
      state.hands[0][i].frontColor = '#eee';
      state.hands[0][i].clickable = false;
      state.hands[0][i].rolloverColor = '';
    }
  }
  removeUserHands[0] = [...removeUserHands[0]];
  sources.forEach(source => {
    const sourceCardId = `H${state.tookBid}${source.index}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    sourceCard.zoom = sourceCard.zoom * 2;
    const targetCardId = `D${state.tookBid}`;
    const targetCard = getCardLocation(targetCardId, state);
    targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
    const newMovingCard = {
      id: `${sourceCardId}to${targetCardId}`,
      keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
      suit: source.suit,
      value: source.value,
      shown: false,
      speed: 1,
      source: sourceCard,
      target: targetCard,
    };
    removeUserMovingCards = [...removeUserMovingCards, newMovingCard];
  });
  const userDiscardMessage = (<span><b>{state.players[0]}</b> have discarded the required cards</span>);
  const removeUserPrompt = generalModalData(userDiscardMessage, {});
  return {
    removeUserHands,
    removeUserMovingCards,
    removeUserPrompt
  };
};

export const calculateComputerDiscard = (state) => {
  let removeComputerGameState = 'waitRemoveDiscards';
  let removeComputerPlayer = state.playerModal;
  let removeComputerHands = [...state.hands];
  let removeComputerMovingCards = [];
  const trumpSuit = getTrumpSuit(state.hands[state.tookBid], state.players);
  const { cardsUsed } = getHandMeld(state.hands[state.tookBid], trumpSuit);
  const possibleDiscards = [...state.hands[state.tookBid]];
  const heldCards = [];
  cardsUsed.forEach(usedCard => {
    const matchIndex = possibleDiscards.findIndex(card => usedCard === `${card.suit}${card.value}` );
    if (matchIndex > -1) {
      const heldCard = possibleDiscards.splice(matchIndex, 1);
      heldCards.push(heldCard[0]);
    }
  });
  for(let i = possibleDiscards.length - 1; i >= 0; i = i -1) {
    if (possibleDiscards[i].suit === trumpSuit) {
      const heldCard = possibleDiscards.splice(i, 1);
      heldCards.push(heldCard[0]);
    }
  }
  while (possibleDiscards.length < state.hands.length) {
    let highestValue = -1;
    let highestIndex = -1;
    heldCards.forEach((held, heldIndex) => {
      const checkHand = [...state.hands[state.tookBid]];
      const checkIndex = checkHand.findIndex(check => check.suit === held.suit && check.value === held.value);
      if (checkIndex > -1) {
        checkHand.splice(checkIndex, 1);
        const { points } = getHandMeld(checkHand, trumpSuit);
        const { projectedCounts } = getProjectedCount(checkHand, trumpSuit, state.players, false);
        if (points + projectedCounts > highestValue) {
          highestValue = points + projectedCounts;
          highestIndex = heldIndex;
        }
      }
    });
    if (highestIndex > -1) {
      const unheldCard = heldCards.splice(highestIndex, 1);
      possibleDiscards.push(unheldCard[0]);
    }
  }
  const valueKeepRanking = ['K', '10', '9', 'J', 'Q', 'A'];
  while (possibleDiscards.length > state.hands.length) {
    let highest = 0;
    let highestIndex = 0;
    possibleDiscards.forEach((possible, possibleIndex) => {
      const { winValue, cardsInSuit } = getWinValue(possibleDiscards, possibleIndex);
      const possibleScore = (100 * winValue) + (valueKeepRanking.indexOf(possible.value) * 10) + cardsInSuit;
      if (possibleScore > highest) {
        highest = possibleScore;
        highestIndex = possibleIndex;
      }
    });
    possibleDiscards.splice(highestIndex, 1);
  }
  const replaceHand = [...state.hands[state.tookBid]];
  let discardedTrump = 0;
  possibleDiscards.forEach((source, disIndex) => {
    const sourceIndex =
      replaceHand.findIndex(
        findCard => findCard.suit === source.suit && findCard.value === source.value
      );
    const sourceCardId = `H${state.tookBid}${disIndex}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    sourceCard.zoom = sourceCard.zoom * 2;
    const targetCardId = `D${state.tookBid}`;
    const targetCard = getCardLocation(targetCardId, state);
    targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
    const newMovingCard = {
      id: `${sourceCardId}to${targetCardId}`,
      keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
      suit: source.suit,
      value: source.value,
      shown: false,
      speed: 1,
      source: sourceCard,
      target: targetCard,
    };
    removeComputerMovingCards = [...removeComputerMovingCards, newMovingCard];
    if (source.suit === state.trumpSuit) {
      discardedTrump = discardedTrump + 1;
    }
    replaceHand.splice(sourceIndex, 1);
  });
  removeComputerHands[state.tookBid] = replaceHand;
  let removeComputerPrompt = state.promptModal;
  if (discardedTrump > 0) {
    const cardText = discardedTrump > 1 ? 's' : '';
    const computerDiscardMessage =
      (<span><b>{state.players[state.tookBid]}</b> discards {discardedTrump} trump card{cardText}</span>);
    const trumpHeader = getTrumpBidHeader(state.computerTrumpSuit, state.tookBid, state.bidAmount, state.players);
    removeComputerPrompt = generalModalData(computerDiscardMessage, {...trumpHeader});
    removeComputerPlayer = generalModalData('', {
      hasBox: false,
      buttons: [{ label: 'Continue', returnMessage: 'postDiscardTrump'}],
    });
    removeComputerGameState = 'waitRemoveDiscardsWithMessage';
  }
  return {
    removeComputerHands,
    removeComputerMovingCards,
    removeComputerPrompt,
    removeComputerGameState,
    removeComputerPlayer
  };
};

export const userSelectTrump = (hands, players) => {
  const validSuits = [];
  hands[0].forEach(card => {
    if (validSuits.indexOf(card.suit) === -1) {
      validSuits.push(card.suit);
    }
  });
  const trumpButtons = [];
  validSuits.forEach(suit => {
    const suitIcon = suitIconSelector(suit);
    trumpButtons.push({
      returnMessage: `trumpIs_${suit}`,
      icon: suitIcon,
      height: 30,
      width: 30
    });
  });
  const userTrumpPlayer = generalModalData((<span>Select Trump Suit</span>), {
    width: 400,
    height: 105,
    buttons: trumpButtons,
  });
  const userTrumpMessage = (<span><b>{players[0]}</b> have to select a trump suit</span>);
  const userTrumpPrompt = generalModalData(userTrumpMessage, {});
  return {
    userTrumpPrompt,
    userTrumpPlayer
  };
};

export const computerSelectTrump = (hands, tookBid, players, bidAmount) => {
  const computerTrumpSuit = getTrumpSuit(hands[tookBid], players);
  const computerTrumpPlayer = generalModalData('', {
    hasBox: false,
    buttons: [{ label: 'Continue', returnMessage: 'postTrumpSuitContinue'}],
  });
  const suitIcon = suitIconSelector(computerTrumpSuit);
  const messageStyle = {
    width: 30,
    marginLeft: 'auto',
    marginRight: 'auto'
  };
  const iconStyle = {
    width: '100%',
  };
  const trumpSuitMessage = (
    <span><b>{players[tookBid]}</b> selected<br/>
    <div style={iconStyle}><div style={messageStyle}>{suitIcon}</div></div></span>
  );
  const trumpHeader = getTrumpBidHeader(computerTrumpSuit, tookBid, bidAmount, players);
  const computerTrumpPrompt = generalModalData(trumpSuitMessage, {...trumpHeader});
  return {
    computerTrumpSuit,
    computerTrumpPlayer,
    computerTrumpPrompt
  };
};

export const startMeldMessage = (trumpSuit, tookBid, bidAmount, players) => {
  const trumpHeader = getTrumpBidHeader(trumpSuit, tookBid, bidAmount, players);
  const meldMessage = generalModalData('Lay down meld', {
    ...trumpHeader
  });
  return meldMessage;
};

export const meldCards = (state) => {
  let meldHands = [...state.hands];
  let meldHand = meldHands[state.dealToPlayer];
  let meldPlacedCards = [...state.melds];
  let meldPile = meldPlacedCards[state.dealToPlayer];
  const meldPlaceScores = [...state.meldScores];
  const { points, cardsUsed } = getHandMeld(state.hands[state.dealToPlayer], state.trumpSuit);
  meldPlaceScores[state.dealToPlayer] = points;
  const meldSeenCards = [...state.seenCards];
  meldSeenCards[state.dealToPlayer] = [...cardsUsed];
  if (state.dealToPlayer === state.tookBid) {
    state.seenWidow.forEach(widow => {
      if (widow[0] === state.trumpSuit || widow[1] === 'A') {
        if (cardsUsed.indexOf(widow) === -1) {
          meldSeenCards[state.dealToPlayer] = [...meldSeenCards[state.dealToPlayer], widow];
        }
      }
    });
  }
  const values = ['A', '10', 'K', 'Q', 'J', '9'];
  const suits = ['C', 'H', 'S', 'D'];
  const valueColumns = {'A':0, '10':0, 'K':0, 'Q':0, 'J':0, '9':0};
  const suitRows = {'C':0, 'H':0, 'S':0, 'D':0};
  suits.forEach(suit => {
    const suitMatches = cardsUsed.filter(cardUsed => cardUsed[0] === suit);
    suitRows[suit] = suitMatches.length;
    values.forEach(value => {
      const valueMatches = cardsUsed.filter(cardUsed => cardUsed === `${suit}${value}`);
      if (valueMatches.length > valueColumns[value]) {
        valueColumns[value] = valueMatches.length;
      }
    });
  });
  const columns = [];
  values.forEach(value => {
    for (let i = 0; i < valueColumns[value]; i++) {
      columns.push(value);
    }
  });
  const rows = [];
  suits.forEach(suit => {
    if (suitRows[suit] > 0) {
      rows.push(suit);
    }
  });
  const leftEdge = columns.length * -25;
  const topEdge = -35 + (rows.length * -70);
  rows.forEach((row, rowIndex) => {
    columns.forEach((column, columnIndex) => {
      const usedIndex = cardsUsed.indexOf(`${row}${column}`);
      if (usedIndex > -1) {
        const cardIndex = meldHand.findIndex(card => card.suit === row && card.value === column);
        if (cardIndex > -1) {
          meldPile = [...meldPile, {
            suit: row,
            value: column,
            shown: true,
            xOffset: leftEdge + (columnIndex * 50),
            yOffset: topEdge + (rowIndex * 70)
          }];
          meldHand.splice(cardIndex, 1);
          cardsUsed.splice(usedIndex, 1);
        }
      }
    });
  });
  meldHands[state.dealToPlayer] = meldHand;
  meldPlacedCards[state.dealToPlayer] = meldPile;
  return {
    meldHands,
    meldPlacedCards,
    meldPlaceScores,
    meldSeenCards
  };
};

export const postMeldLaydown = (
  dealToPlayer,
  thrownHand,
  tookBid,
  meldScores,
  playScore,
  players,
  promptModal,
  trumpSuit,
  bidAmount,
  teams
) => {
  const meldDealToPlayer = (dealToPlayer + 1) % players.length;
  let meldGameState = 'displayMeld';
  const meldPlayScore = playScore;
  let meldPlayerModal = { shown:false };
  let meldPromptModal = promptModal;
  if (meldDealToPlayer === tookBid) {
    const blankTeam = (!thrownHand ? -1 : (players.length === 4 ? tookBid % 2 : tookBid));
    for(let i = 0; i < teams.length; i++) {
      const previousScore = meldPlayScore[i].length === 1 ? 0 : meldPlayScore[i][meldPlayScore[i].length - 2].score;
      if (blankTeam !== i) {
        const meldScore = meldScores[i] + (teams.length === 2 ? meldScores[i + 2] : 0);
        meldPlayScore[i][meldPlayScore[i].length - 1].meld = meldScore;
        if (blankTeam > -1) {
          meldPlayScore[i][meldPlayScore[i].length - 1].score = previousScore + meldScore;
        }
      } else {
        meldPlayScore[i][meldPlayScore[i].length - 1].score = previousScore - bidAmount;
      }
    }
    const trumpHeader = getTrumpBidHeader(trumpSuit, tookBid, bidAmount, players);
    if (blankTeam > -1) {
      meldGameState = 'finalThrownHandWait';
      meldPlayerModal = generalModalData(
        '',
        {
          hasBox: false,
          buttons: [{
            label: 'End Hand',
            status: 'warning',
            returnMessage: 'endOfHand'
          }],
        }
      );
      meldPromptModal = generalModalData((<div><b>{teams[blankTeam]}</b> has thrown the hand</div>), {
        ...trumpHeader
      });
    } else {
      meldGameState = 'startGamePlayWait';
      meldPlayerModal = generalModalData(
        '',
        {
          hasBox: false,
          buttons: [{
            label: 'Start Play',
            returnMessage: 'startGamePlay'
          }],
        }
      );
      let message = '';
      if (players.length === 4) {
        message = (
          <div>
            <span><b>{teams[0]}</b>: {meldScores[0] + meldScores[2]}</span><br/>
            <span><b>{teams[1]}</b>: {meldScores[1] + meldScores[3]}</span>
          </div>
        );
      }
      meldPromptModal = generalModalData(message, {
        ...trumpHeader
      });
    }
  }
  return {
    meldDealToPlayer,
    meldGameState,
    meldPlayScore,
    meldPlayerModal,
    meldPromptModal
  };
};

export const startGamePlay = (state) => {
  const startBidModals = [];
  let startMovingCards = [];
  let startMelds = [];
  let startGameState = 'movingMeldCardsBack:complete';
  const trumpHeader = getTrumpBidHeader(state.trumpSuit, state.tookBid, state.bidAmount, state.players);
  const startPromptModal = generalModalData('', { ...trumpHeader });
  for (let i = 0; i < state.players.length; i++) {
    state.melds[i].forEach((card, cardIndex) => {
      startGameState = 'movingMeldCardsBack';
      const sourceCardId = `M${i}${cardIndex}`;
      const sourceCard = getCardLocation(sourceCardId, state);
      const targetCardId = `H${i}${cardIndex}`;
      const targetCard = getCardLocation(targetCardId, state);
      targetCard.zoom = sourceCard.zoom * 2;
      const newMovingCard = {
        id: `${sourceCardId}to${targetCardId}`,
        keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
        suit: card.suit,
        value: card.value,
        shown: false,
        speed: 1,
        source: sourceCard,
        target: targetCard,
      };
      startMovingCards = [...startMovingCards, newMovingCard];
    });
    startBidModals.push({shown: false});
    startMelds.push([]);
  }
  return {
    startMovingCards,
    startGameState,
    startPromptModal,
    startBidModals,
    startMelds
  };
};

export const moveRestToDiscardPile = (state) => {
  const restDiscardShowHands = [];
  let restDiscardMovingCards = [];
  const restDiscardHands = [];
  let discardPile = state.winningPlay;
  if (state.players.length === 4) {
    if (state.winningPlay % 2 === state.tookBid % 2) {
      discardPile = state.tookBid;
    } else {
      discardPile = (state.tookBid + 1) % 4;
    }
  }
  for (let i = 0; i < state.players.length; i++) {
    restDiscardShowHands.push(i === 0);
    restDiscardHands.push([]);
    const cards = state.hands[i].length;
    for (let c = 0; c < cards; c++) {
      const selectedCard = state.hands[i][c];
      const sourceCardId = `H${i}${c}`;
      const sourceCard = getCardLocation(sourceCardId, state);
      const targetCardId = `D${discardPile}`;
      const targetCard = getCardLocation(targetCardId, state);
      const newMovingCard = {
        id: `${sourceCardId}to${targetCardId}`,
        keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
        suit: selectedCard.suit,
        value: selectedCard.value,
        shown: true,
        speed: 10,
        source: sourceCard,
        target: targetCard,
      };
      restDiscardMovingCards = [...restDiscardMovingCards, newMovingCard];
    }
  }
  return {
    restDiscardMovingCards,
    restDiscardShowHands,
    restDiscardHands
  };
};

export const gotTheRest = (state) => {
  let gotRestGameState = '';
  let gotRestPlayerModal = {shown: false};
  let gotRestPromptModal = {...state.promptModal};
  const gotRestShowHands = [];
  let gotRestWinningPlay = -1;
  for(let p = 0; p < state.players.length; p++) {
    const validHand = [...state.hands[p]];
    if (gotRestGameState === '') {
      const widowDiscards = [];
      if (p === state.tookBid) {
        for (let i = 0; i < state.players.length; i++) {
          widowDiscards.push(state.discardPiles[p][i]);
        }
      }
      const unplayedCards = getUnplayedCards(validHand, state.playedCards, widowDiscards);
      const unplayedTrump = unplayedCards.filter(card => card.suit === state.trumpSuit);
      const trumpInHand = validHand.filter(card => card.suit === state.trumpSuit);
      if (unplayedTrump.length === 0 && trumpInHand.length === validHand.length) {
        gotRestWinningPlay = p;
        for (let i = 0; i < state.players.length; i++) {
          gotRestShowHands.push(true);
        }
        gotRestGameState = 'gotRestContinue';
        gotRestPromptModal.message = (<span><b>{state.players[p]}</b> wins rest</span>);
        const message = (<span><b>{state.players[p]}</b> wins the rest</span>);
        gotRestPlayerModal = generalModalData(message, {
          hasBox: true,
          width: 400,
          height: 105,
          buttons: [{
            label: 'Continue',
            returnMessage: 'winRestContinue'
          }],
        });
      }
    }
  }
  return {
    gotRestGameState,
    gotRestPlayerModal,
    gotRestPromptModal,
    gotRestShowHands,
    gotRestWinningPlay
  };
};

export const userLeadPlay = (hands, trumpSuit, firstPlay, promptModal, players) => {
  const userLeadPlayHands = [...hands];
  let userLeadPlayerModal = {shown: false};
  const userLeadPromptModal = {...promptModal};
  userLeadPromptModal.message = (<span><b>{players[0]}</b> lead play</span>);
  const validHand = [...hands[0]];
  const validCards = setValidCardIndexes(validHand, '', trumpSuit, firstPlay);
  validHand.forEach((card, cardIndex) => {
    validHand[cardIndex].shown = true;
    if (validCards.indexOf(cardIndex) > -1) {
      validHand[cardIndex].active = true;
      validHand[cardIndex].clickable = true;
      validHand[cardIndex].rolloverColor = '#0f0';
    } else {
      validHand[cardIndex].active = false;
      validHand[cardIndex].clickable = false;
      validHand[cardIndex].rolloverColor = '';
    }
  });
  userLeadPlayHands[0] = [...validHand];
  let message = 'You took the play, please led a card';
  if (firstPlay) {
    message = 'You must lead trump suit on first play';
  }
  userLeadPlayerModal = generalModalData(message, {
    width: 425,
    height: 40,
  });
  return {
    userLeadPlayerModal,
    userLeadPromptModal,
    userLeadPlayHands
  };
};

export const userFollowPlay = (hands, trumpSuit, players, playPile, winningPlay, tookPlay) => {
  const userFollowPlayHands = [...hands];
  let userFollowPlayerModal = {shown: false};
  const ledCard = playPile[tookPlay];
  const winningCard = playPile[winningPlay];
  const ledSuit = ledCard.suit;
  const ledValue = (ledSuit === trumpSuit) ? winningCard.value : '';
  const validHand = [...hands[0]];
  const validCards = setValidCardIndexes(validHand, ledSuit, trumpSuit, false, ledValue);
  const validSuits = {};
  validHand.forEach((card, cardIndex) => {
    validHand[cardIndex].shown = true;
    if (validCards.indexOf(cardIndex) > -1) {
      validHand[cardIndex].active = true;
      validHand[cardIndex].clickable = true;
      validHand[cardIndex].rolloverColor = '#0f0';
      validSuits[validHand[cardIndex].suit] = true;
    } else {
      validHand[cardIndex].active = false;
      validHand[cardIndex].clickable = false;
      validHand[cardIndex].rolloverColor = '';
    }
  });
  const legalSuits = Object.keys(validSuits);
  userFollowPlayHands[0] = [...validHand];
  let message = '';
  if (ledSuit === trumpSuit && validHand[validCards[0]].suit === trumpSuit) {
    message = 'You must play higher trump if you can';
  }
  if (ledSuit !== trumpSuit && validHand[validCards[0]].suit === trumpSuit) {
    message = 'You must play trump if off suit';
  }
  if (legalSuits.indexOf(ledSuit) === -1 && legalSuits.indexOf(trumpSuit) === -1) {
    if (ledSuit === trumpSuit) {
      message = 'You have no trump, play any card';
    } else {
      message = 'Off suit and trump, play any card';
    }
  }
  if (message === '') {
    userFollowPlayerModal = generalModalData(message, {
      shown: false,
    });
  } else {
    userFollowPlayerModal = generalModalData(message, {
      width: 425,
      height: 40,
    });
  }
  return {
    userFollowPlayerModal,
    userFollowPlayHands,
  };
};

export const userPlay = (state, selectedIndex) => {
  const userPlayPromptModal = {...state.promptModal};
  userPlayPromptModal.message = '';
  const selectedCard = state.hands[0][selectedIndex];
  const sourceCardId = `H0${selectedIndex}`;
  const sourceCard = getCardLocation(sourceCardId, state);
  sourceCard.zoom = sourceCard.zoom * 2;
  const targetCardId = `P0`;
  const targetCard = getCardLocation(targetCardId, state);
  const newMovingCard = {
    id: `${sourceCardId}to${targetCardId}`,
    keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
    suit: selectedCard.suit,
    value: selectedCard.value,
    shown: true,
    speed: 1,
    source: sourceCard,
    target: targetCard,
  };
  const userPlayMovingCards = [newMovingCard];
  const userPlayHands = [...state.hands];
  const userHand = userPlayHands[0];
  userHand.splice(selectedIndex, 1);
  userHand.forEach((card, cardIndex) => {
    userHand[cardIndex].active = true;
    userHand[cardIndex].clickable = false;
    userHand[cardIndex].rolloverColor = '';
  });
  userPlayHands[0] = userHand;
  return {
    userPlayHands,
    userPlayMovingCards,
    userPlayPromptModal
  };
};

export const computerLeadPlay = (state) => {
  const computerLeadPlayHands = [...state.hands];
  const validHand = computerLeadPlayHands[state.tookPlay];
  let computerPlayMovingCards = [];
  const widowDiscards = [];
  if (state.tookPlay === state.tookBid) {
    for (let i = 0; i <state.players.length; i++) {
      widowDiscards.push(state.discardPiles[state.tookBid][i]);
    }
  }
  const unplayedCards = getUnplayedCards(validHand, state.playedCards, widowDiscards);
  const winningCards = getWinningCards(
    state.hands,
    unplayedCards,
    state.offSuits,
    state.trumpSuit,
    state.tookPlay,
    state.firstPlay
  );
  let playCard = null;
  if (state.firstPlay) {
    if (winningCards.length > 0) {
      // Play required trump for win
      playCard = winningCards[0];
    } else {
      // Play required trump for lose
      playCard = getHighestNonCount(validHand, state.trumpSuit);
    }
  } else {
    const trumpLeft = unplayedCards.filter(card => card.suit === state.trumpSuit);
    const trumpInHand = validHand.filter(card => card.suit === state.trumpSuit);
    const trumpWin = winningCards.filter(card => card.suit === state.trumpSuit);
    if (trumpWin.length === 1) {
      if (trumpLeft < trumpInHand && trumpInHand > validHand.length + 2 && trumpLeft > 0 ) {
        // Control Trump Cards
        playCard = trumpWin[0];
      }
    }

    if (playCard === null) {
      if (winningCards.length > trumpWin.length) {
        // Play winning card
        while(playCard === null) {
          const winIndex = getRandomRange(0, winningCards.length - 1, 1);

          if (winningCards[winIndex].suit !== state.trumpSuit) {
            playCard = {...winningCards[winIndex]};
          }
        }
      }
    }
    let suitIndex;
    let stepIndex;
    let stopCheck;
    // Losing cards
    if (playCard === null) {
      // Pull trump in an off suit if not on bid team
      if (state.players.length === 3 || (state.players.length === 4 && state.tookBid % 2 !== state.tookPlay % 2)) {
        const trumpPullingSuits = getTrumpPullingSuits(state.offSuits, state.trumpSuit, state.tookPlay);
        if (trumpPullingSuits.length > 0) {
          suitIndex = getRandomRange(0, getTrumpPullingSuits.length - 1, 1);
          stepIndex = suitIndex;
          stopCheck = false;
          while (playCard === null && !stopCheck) {
            playCard = getHighestNonCount(validHand, trumpPullingSuits[stepIndex], true);
            stepIndex = (stepIndex + 1) % getTrumpPullingSuits.length;
            stopCheck = (stepIndex === suitIndex);
          }
        }
      }
    }
    if (playCard === null) {
      // Pull trump with Trump
      const pullWithTrump = (trumpInHand > trumpLeft) || (trumpInHand + 2) >= validHand.length;
      if (pullWithTrump) {
        playCard = getHighestNonCount(validHand, state.trumpSuit, true);
      }
    }
    if (playCard === null && state.players.length === 4) {
      // Attempt to pass lead to partner
      const partnerPassSuits = getPartnerPassSuits(
        state.offSuits,
        state.trumpSuit,
        state.tookPlay,
        unplayedCards,
        state.seenCards
      );
      if (partnerPassSuits.length > 0) {
        suitIndex = getRandomRange(0, partnerPassSuits.length - 1, 1);
        stepIndex = suitIndex;
        stopCheck = false;
        while(playCard === null && !stopCheck) {
          playCard = getHighestNonCount(validHand, partnerPassSuits[stepIndex], true);
          stepIndex = (stepIndex + 1) % state.players.length;
          stopCheck = (stepIndex === suitIndex);
        }
      }
    }
    if (playCard === null) {
      // give and just play lowest card with a preference to non-trump
      const lowValues = ['A', '10', 'K', 'Q', 'J', '9'];
      let isTrump = true;
      let lowIndex = -1;
      validHand.forEach(card => {
        if (card.suit !== state.trumpSuit && isTrump) {
          isTrump = false;
          lowIndex = -1;
        }
        if ((card.suit === state.trumpSuit && isTrump) || card.suit !== state.trumpSuit) {
          const cardValueIndex = lowValues.indexOf(card.value);
          if (cardValueIndex > lowIndex) {
            lowIndex = cardValueIndex;
            playCard = card;
          }
        }
      });
    }
  }
  if (playCard === null) {
    // No logical play, throw random card
    const randomCard = getRandomRange(0, validHand.length, 1);
    playCard = validHand[randomCard];
  }
  if (playCard !== null) {
    const selectedIndex = validHand.findIndex(card => playCard.suit === card.suit && playCard.value === card.value);
    if (selectedIndex > -1) {
      computerPlayMovingCards = [throwCardIntoMiddle(state, state.tookPlay, selectedIndex)];
      validHand.splice(selectedIndex, 1);
    }
  }
  return {
    computerLeadPlayHands,
    computerPlayMovingCards
  };
};

export const computerFollowPlay = (state, nextPlayer) => {
  const computerFollowHands = [...state.hands];
  const validHand = computerFollowHands[nextPlayer];
  let computerFollowMovingCards = [];
  const ledCard = state.playPile[state.tookPlay];
  const ledHand = validHand.filter(card => card.suit === ledCard.suit);
  const trumpHand = validHand.filter(card => card.suit === state.trumpSuit);
  const winningCard = state.playPile[state.winningPlay];
  const beenTrumped = (winningCard.suit === state.trumpSuit && ledCard.suit !== state.trumpSuit);
  const widowDiscards = [];
  const values = ['9', 'J', 'Q', 'K', '10', 'A'];
  if (nextPlayer === state.tookBid) {
    for (let i = 0; i < state.players.length; i++) {
      widowDiscards.push(state.discardPiles[state.tookBid][i]);
    }
  }
  const unplayedCards = getUnplayedCards(validHand, state.playedCards, widowDiscards);
  const highLedCard = unplayedCards.find(card => card.suit === ledCard.suit);
  const highLedIndex = highLedCard ? values.indexOf(highLedCard.value) : -1;
  const blocker = ((nextPlayer + 1) % state.players.length);
  const blockerPlayer = (blocker === state.tookPlay) ? -1 : blocker;
  let likelyBlockerWin = false;
  if (blockerPlayer > -1) {
    if (state.offSuits[blockerPlayer].indexOf(ledCard.suit) > -1) {
      if (state.offSuits[blockerPlayer].indexOf(state.trumpSuit) === -1) {
        if (beenTrumped) {
          if (values.indexOf(winningCard.value) < highLedIndex) {
            likelyBlockerWin = true;
          }
        } else {
          likelyBlockerWin = true;
        }
      }
    } else {
      if (values.indexOf(winningCard.value) < highLedIndex) {
        likelyBlockerWin = true;
      }
    }
  }
  const friendlyPlayer = (state.players.length === 4) ? (nextPlayer + 2) % 4 : -1;
  const friendlyWinner = (state.winningPlay === friendlyPlayer);
  const friendlySeat =
    (friendlyPlayer > -1 && friendlyPlayer !== state.tookPlay && ((nextPlayer + 1) % 4) !== state.tookPlay)
      ? friendlyPlayer : -1;
  if (friendlySeat > -1) {
    if (state.offSuits[friendlyPlayer].indexOf(ledCard.suit) > -1) {
      if (state.offSuits[friendlyPlayer].indexOf(state.trumpSuit) === -1) {
        if (beenTrumped) {
          if (values.indexOf(winningCard.value) < highLedIndex) {
            likelyBlockerWin = false;
          }
        } else {
          likelyBlockerWin = false;
        }
      }
    } else {
      if (values.indexOf(winningCard.value) < highLedIndex) {
        likelyBlockerWin = false;
      }
    }
  }
  let playCard = null;
  if (ledHand.length === 0) {
    if (trumpHand.length === 0) {
      // Play Off
      if (friendlyWinner && !likelyBlockerWin) {
        playCard = getBestCounter(validHand, '');
      }
      if (playCard === null) {
        playCard = getLowestNonCount(validHand, '');
      }
    } else {
      // Trump Play
      if (beenTrumped) {
        validHand.forEach(card => {
          if (card.suit === state.trumpSuit) {
            const valueIndex = values.indexOf(card.value);
            if (valueIndex > values.indexOf(winningCard.value)) {
              if (playCard === null || values.indexOf(playCard.value) > valueIndex) {
                playCard = {suit: state.trumpSuit, value: card.value};
              }
            }
          }
        });
      }
      if (playCard === null) {
        playCard = getLowestNonCount(validHand, state.trumpSuit);
      }
    }
  } else {
    if (ledCard.suit === state.trumpSuit) {
      validHand.forEach(card => {
        if (card.suit === state.trumpSuit) {
          const valueIndex = values.indexOf(card.value);
          if (valueIndex > values.indexOf(winningCard.value)) {
            if (playCard === null || values.indexOf(playCard.value) > valueIndex) {
              playCard = {suit: state.trumpSuit, value: card.value};
            }
          }
        }
      });
    }
    if (playCard === null) {
      const winningCards = getWinningCards(
        state.hands,
        unplayedCards,
        state.offSuits,
        state.trumpSuit,
        nextPlayer,
        false
      );
      const winCard = winningCards.find(card => card.suit === ledCard.suit);
      if (winCard && !beenTrumped) {
        if (values.indexOf(winCard.value) > values.indexOf(winningCard.value)) {
          // Projected Winning Card
          playCard = winCard;
        }
      }
    }
    if (playCard === null) {
      // All losers from here
      if (friendlyWinner && !likelyBlockerWin) {
        playCard = getBestCounter(validHand, ledCard.suit);
      } else {
        playCard = getLowestNonCount(validHand, ledCard.suit);
      }
    }
  }
  if (playCard !== null) {
    const selectedIndex = validHand.findIndex(card => playCard.suit === card.suit && playCard.value === card.value);
    if (selectedIndex > -1) {
      computerFollowMovingCards = [throwCardIntoMiddle(state, nextPlayer, selectedIndex)];
      validHand.splice(selectedIndex, 1);
    }
  }
  return {
    computerFollowHands,
    computerFollowMovingCards
  };
};

export const resolvePlay = (
  players,
  playPile,
  trumpSuit,
  dealToPlayer,
  tookPlay,
  winningPlay,
  tookBid,
  bidAmount,
  playedCards
) => {

  const resolvePlayedCards = [...playedCards];
  const values = ['9', 'J', 'Q', 'K', '10', 'A'];
  let resolveWinningPlay = winningPlay;
  const playedCard = playPile[dealToPlayer];
  if (dealToPlayer === tookPlay) {
    resolveWinningPlay = tookPlay;
  } else {
    const winningCard = playPile[winningPlay];
    if (playedCard.suit === trumpSuit && winningCard.suit !== trumpSuit) {
      resolveWinningPlay = dealToPlayer;
    } else if (playedCard.suit === winningCard.suit
      && values.indexOf(playedCard.value) > values.indexOf(winningCard.value)) {
      resolveWinningPlay = dealToPlayer;
    }
  }
  const totalMessage = getHandLeaderMessage(
    playPile[tookPlay].suit,
    playPile[tookPlay].value,
    playPile[resolveWinningPlay].suit,
    playPile[resolveWinningPlay].value,
    players,
    tookPlay,
    resolveWinningPlay
  );
  const trumpHeader = getTrumpBidHeader(trumpSuit, tookBid, bidAmount, players);
  const resolvePromptModal = generalModalData(totalMessage, {...trumpHeader});
  resolvePlayedCards[dealToPlayer] = [...resolvePlayedCards[dealToPlayer],
    {suit: playedCard.suit, value: playedCard.value}
  ];
  return {
    resolveWinningPlay,
    resolvePromptModal,
    resolvePlayedCards
  };
};

export const displayPlayWinner = (trumpSuit, players, playPile, winningPlay, promptModal, tookPlay, offSuits) => {
  const calculateWinnerOffSuits = [...offSuits];
  for (let i = 0; i < players.length; i++) {
    if (playPile[i].suit !== playPile[tookPlay].suit) {
      if (calculateWinnerOffSuits[i].indexOf(playPile[tookPlay].suit) === -1) {
        calculateWinnerOffSuits[i].push(playPile[tookPlay].suit);
      }
    }
  }
  const calculateWinnerPlayPile = [...playPile];
  calculateWinnerPlayPile[winningPlay].frontColor = '#eea';
  const winCard = calculateWinnerPlayPile[winningPlay];
  const calculateWinnerPromptModal = {...promptModal};
  calculateWinnerPromptModal.message = getHandWinMessage(winCard.suit , winCard.value , players, winningPlay);
  return {
    calculateWinnerPlayPile,
    calculateWinnerPromptModal,
    calculateWinnerOffSuits
  };
};

export const setUpNextPlay = (hands, promptModal, tookBid, winningPlay) => {
  let nextPlayDealToPlayer = winningPlay;
  let nextPlayGameState = 'startNextPlay';
  const nextPlayPromptMessage = {...promptModal};
  if (hands[0].length === 0) {
    nextPlayGameState = 'tallyCounts';
    const newMessage = (<div>{nextPlayPromptMessage.message}<br/><div>+1 for last trick</div></div>);
    nextPlayPromptMessage.message = newMessage;
    nextPlayDealToPlayer = (tookBid + 1) % hands.length;
  }
  return {
    nextPlayGameState,
    nextPlayPromptMessage,
    nextPlayDealToPlayer
  };
};

export const movePlayPileToDiscard = (state) => {
  let playToDiscardMovingCards = [];
  let discardPile = state.winningPlay;
  if (state.players.length === 4) {
    if (state.winningPlay % 2 === state.tookBid % 2) {
      discardPile = state.tookBid;
    } else {
      discardPile = (state.tookBid + 1) % 4;
    }
  }
  for(let i = 0; i < state.players.length; i++) {
    const sourceCardId = `P${i}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    const targetCardId = `D${discardPile}`;
    const targetCard = getCardLocation(targetCardId, state);
    targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
    const newMovingCard = {
      id: `${sourceCardId}to${targetCardId}`,
      keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
      suit: state.playPile[i].suit,
      value: state.playPile[i].value,
      shown: false,
      speed: 1,
      source: sourceCard,
      target: targetCard,
    };
    playToDiscardMovingCards = [...playToDiscardMovingCards, newMovingCard];
  }
  const playToDiscardPlayPile = [];
  for(let i = 0; i < state.players.length; i++) {
    playToDiscardPlayPile.push(null);
  }
  return {
    playToDiscardMovingCards,
    playToDiscardPlayPile
  };
}

export const discardToMeldTally = (state) => {
  const tallyDiscardPiles = [...state.discardPiles];
  const valuePile = tallyDiscardPiles[state.dealToPlayer];
  let tallyMovingCards = [];
  let tallyGameState = 'moveDiscardToMeldTally';
  let tallyDealToPlayer = state.dealToPlayer;
  if (valuePile.length === 0) {
    tallyGameState = 'nextTally';
    if (state.players.length === 3) {
      tallyDealToPlayer = (state.dealToPlayer + 1) % state.players.length;
      if (tallyDealToPlayer === state.tookBid) {
        tallyGameState = 'doneCounting';
      }
    } else {
      if (state.dealToPlayer === (state.tookBid + 1) % 4) {
        tallyDealToPlayer = state.tookBid;
      } else {
        tallyGameState = 'doneCounting';
      }
    }
  } else {
    const selectedCard = valuePile.pop();
    const sourceCardId = `D${state.dealToPlayer}${valuePile.length}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    sourceCard.zoom = sourceCard.zoom * 2;
    const targetCardId = `M${state.dealToPlayer}`;
    const targetCard = getCardLocation(targetCardId, state);
    const isCount = (selectedCard.value === 'K' || selectedCard.value === '10' ||selectedCard.value === 'A');
    const newMovingCard = {
      id: `${sourceCardId}to${targetCardId}`,
      keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
      suit: selectedCard.suit,
      value: selectedCard.value,
      shown: true,
      frontColor: (isCount ? '#eea' : '#eee'),
      speed: 2,
      source: sourceCard,
      target: targetCard,
    };
    tallyMovingCards = [newMovingCard];
    tallyDiscardPiles[state.dealToPlayer] = [...valuePile];
  }
  return {
    tallyMovingCards,
    tallyDiscardPiles,
    tallyDealToPlayer,
    tallyGameState
  };
};

export const addCountToTally = (bidModals, melds, tookPlay, dealToPlayer) => {
  const addCountBidModals = [...bidModals];
  let counts = (melds.length === 3 && dealToPlayer === tookPlay) ? 1 : 0;
  counts = (melds.length === 4 && dealToPlayer % 2 === tookPlay % 2) ? 1 : counts;
  const countValues = ['A', '10', 'K'];
  melds[dealToPlayer].forEach(card => {
    if (countValues.indexOf(card.value) > -1) {
      counts = counts + 1;
    }
  });
  addCountBidModals[dealToPlayer] = generalModalData('', {
      header: String(counts),
      width: 80,
      height: 44,
    });
  return {
    addCountBidModals
  };
};

export const addCountToScore = (teams, players, playScore, melds, bidModals, tookBid, bidAmount) => {
  const addScorePlayScore = [...playScore];
  let cabbageMessage = '';
  let hasBox = false;
  for(let i = 0; i < teams.length; i++) {
    const pile = (tookBid + i) % players.length;
    const team = pile % teams.length;
    const scoreRows = addScorePlayScore[team].length;
    let counts = 0;
    let countScore = Number(scoreRows > 1 ? addScorePlayScore[team][scoreRows - 2].score : 0);
    if (melds[pile].length === 0) {
      if (cabbageMessage === '') {
        cabbageMessage = (<span><b>{teams[team]}</b></span>);
      } else {
        cabbageMessage = cabbageMessage + ' and ' + (<span><b>{teams[team]}</b></span>);
      }
      addScorePlayScore[team][scoreRows - 1].gotSet = true;
      addScorePlayScore[team][scoreRows - 1].counts = "";
    } else {
      counts = Number(bidModals[pile].header) + addScorePlayScore[team][scoreRows - 1].meld;
      addScorePlayScore[team][scoreRows - 1].counts = bidModals[pile].header;
    }
    countScore = countScore + counts;
    addScorePlayScore[team][scoreRows - 1].score = String(countScore);
  }
  if (cabbageMessage !== '') {
    hasBox = true;
    cabbageMessage = (<span>{cabbageMessage} was cabbaged.</span>);
  }
  const addScorePlayerModal = generalModalData(cabbageMessage, {
    hasBox,
    width: 500,
    height: 105,
    buttons: [{
      label: 'End Hand',
      status: 'warning',
      returnMessage: 'endOfHand'
    }],
  });
  const teamIndex = tookBid % teams.length;
  const bidRows = addScorePlayScore[teamIndex].length;
  const amount = Number(bidModals[tookBid].header) + Number(addScorePlayScore[teamIndex][bidRows - 1].meld);
  let message = (<div><b>{players[tookBid]}</b> has made there bid of {bidAmount} with {amount}.</div>);
  if (amount < bidAmount) {
    message = (<div><b>{players[tookBid]}</b> failed to make the bid of {bidAmount} with {amount}.</div>);
    const whoGotSet = (players.length === 4) ? tookBid % 2 : tookBid;
    const gotSetRows = addScorePlayScore[whoGotSet].length;
    const gotSetScore = gotSetRows > 1 ? addScorePlayScore[whoGotSet][gotSetRows - 2].score - bidAmount : -bidAmount;
    addScorePlayScore[whoGotSet][gotSetRows - 1].gotSet = true;
    addScorePlayScore[whoGotSet][gotSetRows - 1].score = gotSetScore;
  }
  const hasWinner = getWinner(addScorePlayScore, tookBid);
  const addScoreGameWon = hasWinner > -1 ? teams[hasWinner] : '';
  const addScorePromptModal = generalModalData(message);
  return {
    addScorePlayScore,
    addScorePlayerModal,
    addScorePromptModal,
    addScoreGameWon
  };
};

export const resolveEndHand = (teams, players, playScore, tookBid, dealer) => {
  let endHandGameState = 'moveDeckToDealer';
  let endHandGameWon = '';
  let endHandPlayerModal = {shown: false};
  let endHandPromptModal = generalModalData('');
  let message = '';
  const endHandDealer = (dealer + 1) % players.length;
  const scores = [];
  playScore.forEach(teamScore => {
    scores.push(Number(teamScore[teamScore.length -1].score));
  });
  const winners = [];
  let won = -1;
  let highest = 0;
  scores.forEach((score, scoreIndex) => {
    if (score >= 120) {
      winners.push(scoreIndex);
      if (scoreIndex === tookBid) {
        won = scoreIndex;
      }
      if (score > highest) {
        highest = score;
      }
    }
  });
  if (won > -1 && winners.length > 1) {
    if (scores[won] < highest) {
      message = (<span><b>{teams[won]}</b> won by taking the bid.</span>);
    }
  }
  if (won === -1 && winners.length > 0) {
    if (winners.length === 2) {
      if (winners[0] > winners[1]) {
        won = winners[0];
      } else if (winners[1] > winners[0]) {
        won = winners[1];
      } else {
        message = 'Tied, play another hand.';
      }
    } else {
      won = winners[0];
    }
  }
  if (won > -1) {
    endHandGameState = 'waitEndOfGame';
    endHandGameWon = teams[won];
    endHandPlayerModal = generalModalData(message, {
      hasBox: (message !== ''),
      width: 500,
      buttons: [{
        label: 'End Game',
        status: 'warning',
        returnMessage: 'endOfGame'
      }],
    });
    endHandPromptModal = generalModalData((<span><b>{teams[won]}</b> won the game!</span>));
  }
  return {
    endHandGameState,
    endHandPlayerModal,
    endHandPromptModal,
    endHandDealer,
    endHandGameWon
  };
};
