import {
  generateShuffledDeck,
  generalModalData,
  getCardLocation,
  getRandomRange,
  createLandingCard,
  sortCardHand,
  getHandMeb,
  getProjectedCount,
  getHandBid,
} from '../../utils/helpers';
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
    playerMebLocations,
    miscLocations,
    zoomRatio: ratio,
  };
};

export const resolveCardMovement = (
  id,
  keyId,
  movingCards,
  hands,
  mebs,
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
    generalModalData('Dealer is chosen by the first player to get an ace');
  const initedValues = {
    gameState: 'choseDealer',
    discardPiles: [],
    showHands: [],
    hands: [],
    mebs: [],
    playPile: [],
    movingCards: [],
    playPileShown: false,
    playScore: [],
    gameWon: '',
    playerModal: {shown: false},
    promptModal: throwAcesForDealerModal,
    bids: [],
    bidModals: [],
  };
  for(let i = 0; i < players.length; i++) {
    initedValues.discardPiles.push([]);
    initedValues.hands.push([]);
    initedValues.mebs.push([]);
    initedValues.showHands.push(i === 0);
    initedValues.bids.push(0);
    initedValues.bidModals.push({shown: false})
  }
  for(let i = 0; i < teams.length; i++) {
    initedValues.playScore.push([]);
  }
  initedValues.discardPiles[0] = generateShuffledDeck();
  return initedValues;
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
  const toDealerMebs = [...state.mebs];
  const toDealerHands = [...state.hands];
  let toDealerPlayPile = [...state.playPile];
  const targetCardId = `D${state.dealer}`;
  const targetCard = getCardLocation(targetCardId, state);
  for(let i = 0 ; i < state.players.length; i++) {
    if (i !== state.dealer && state.discardPiles[i].length > 0) {
      cardsToMove.push(`D${i}${state.discardPiles[i].length - 1}`);
      const newDiscard = state.discardPiles[i];
      newDiscard.pop();
      toDealerDiscards[i] = [...newDiscard];
    }
    if (state.mebs[i].length > 0) {
      cardsToMove.push(`M${i}${state.mebs[i].length - 1}`);
      const newMeb = state.mebs[i];
      newMeb.pop();
      toDealerMebs[i] = [...newMeb];
    }
    if (state.hands[i].length > 0) {
      cardsToMove.push(`H${i}${state.hands[i].length - 1}`);
      const newHand = state.hands[i];
      newHand.pop();
      toDealerHands[i] = [...newHand];
    }
  }
  if (state.playPile.length > 0) {
    cardsToMove.push(`P`);
    toDealerPlayPile.pop();
    toDealerPlayPile=[...toDealerPlayPile];
  }
  cardsToMove.forEach(cardToMove => {
    sourceCard = getCardLocation(cardToMove, state);
    newMovingCard = {
      id: `${cardToMove}to${targetCardId}`,
      keyId: `${cardToMove}to${targetCardId}${Date.now()}`,
      shown: false,
      speed: 1,
      source: sourceCard,
      target: targetCard,
    };
    toDealerMovingCards = [...toDealerMovingCards, newMovingCard];
  });
  return ({
    toDealerMovingCards,
    toDealerMebs,
    toDealerDiscards,
    toDealerHands,
    toDealerPlayPile,
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
        speed: 1,
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
    const { points, nearMiss } = getHandMeb(hands[dealToPlayer], suit);
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
  let bidColumn = wonTheBid;
  if (teams.length === 4) {
    bidColumn = wonTheBid % 2;
  }
  const updatedBidScore = [...playScore];
  for(let i = 0; i < teams.length; i++) {
    updatedBidScore[i].push({
      bid: (bidColumn === i) ? String(wonBidWith) : '',
      gotSet: false,
      meb: '',
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
    const adjustedCard = newPlayPile[widowCardIndex];
    adjustedCard.shown = true;
    adjustedCard.rotation = 0;
    adjustedCard.xOffset = -(60 * (players.length - 1)) + (120 * widowCardIndex) + 10;
    adjustedCard.yOffset = 150;
    newPlayPile[widowCardIndex] = {...adjustedCard};
  }
  return [...newPlayPile];
};

export const movingWidow = (state) => {
  let widowCards = [];
  state.playPile.forEach(card => {
    const sourceCardId = 'P-1';
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
    widowCards = [...widowCards, newMovingCard];
  });
  return widowCards;
};

export const shouldComputerThrowHand = (hands, tookBid, bidAmount, players) => {
  let computerThrowGameState = 'throwHandContinue';
  const suits = ['D', 'S', 'C', 'H'];
  let high = 0;
  let meb = 0;
  suits.forEach(suit => {
    const { points } = getHandMeb(hands[tookBid], suit);
    const { projectedCounts } = getProjectedCount(hands[tookBid], suit, players, false);
    if (points + projectedCounts > high) {
      high = points + projectedCounts;
      meb = points;
    }
  });
  const willFail = (hands.length === 3 && meb + 25 < bidAmount);
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
  const { points } = getHandMeb(hands[tookBid], '');
  const { totalWins } = getProjectedCount(hands[tookBid], '', players, false);
  if (points >= 8 || totalWins >= 4) {
    computerAgreeThrowHand = 'throwHandDisagree';
  }
  return { computerAgreeThrowHand };
};

export const shouldUserThrowHand = (hands, bidAmount, players) => {
  let throwPlayerModal = {shown: false};
  const suits = ['D', 'S', 'C', 'H'];
  let high = 0;
  let meb = 0;
  suits.forEach(suit => {
    const { points } = getHandMeb(hands[0], suit);
    const { projectedCounts } = getProjectedCount(hands[0], suit, players, false);
    if (points + projectedCounts > high) {
      high = points + projectedCounts;
      meb = points;
    }
  });
  const willFail = (hands.length === 3 && meb + 25 < bidAmount);
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

export const setUpDiscards = (hands, tookBid, players) => {
  let discardGameState = 'computerDiscard';
  let discardPlayerModal = {shown: false};
  const flexWord = (tookBid === 0) ? 'have' : 'has';
  const discardMessage = (<span><b>{players[tookBid]}</b> {flexWord} to discard {players.length} cards</span>);
  const discardPromptModal = generalModalData(discardMessage, {});
  if (tookBid === 0) {
    const userDiscardMessage = (<span>Discard {players.length} cards. Meb cards are yellowed.</span>)
    discardPlayerModal = generalModalData(userDiscardMessage, {
      width: 500,
      height: 105,
      buttons: [{ label: 'Discard', status: 'inactive', returnMessage: 'userDiscard' }],
    });
    discardGameState = 'waitUserDiscard';
  }
  return {
    discardGameState,
    discardPlayerModal,
    discardPromptModal
  };
};