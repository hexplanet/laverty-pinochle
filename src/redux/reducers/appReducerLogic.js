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
  getWinValue, getFormedSuitIcon,
} from '../../utils/helpers';
import { Diamonds } from "../../components/PlayingCard/svg/Diamonds";
import { Hearts } from "../../components/PlayingCard/svg/Hearts";
import { Clubs } from "../../components/PlayingCard/svg/Clubs";
import { Spades } from "../../components/PlayingCard/svg/Spades";
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
    melds: [],
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
    initedValues.melds.push([]);
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
  const toDealerMelds = [...state.melds];
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
      speed: 1,
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
  let bidColumn = wonTheBid;
  if (teams.length === 4) {
    bidColumn = wonTheBid % 2;
  }
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
  let widowCards = [];
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
    widowCards = [...widowCards, newMovingCard];
  });
  return widowCards;
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
  if (points >= 8 || totalWins >= 4) {
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

export const setUpDiscards = (hands, tookBid, players) => {
  const discardHands = [...hands];
  let discardGameState = 'computerDiscard';
  let discardPlayerModal = {shown: false};
  const flexWord = (tookBid === 0) ? 'have' : 'has';
  const discardMessage = (<span><b>{players[tookBid]}</b> {flexWord} to discard {players.length} cards</span>);
  const discardPromptModal = generalModalData(discardMessage, {});
  if (tookBid === 0) {
    const userDiscardMessage = (<span>Discard {players.length} cards. Meld cards are yellowed.</span>)
    discardPlayerModal = generalModalData(userDiscardMessage, {
      width: 500,
      height: 105,
      buttons: [{ label: 'Discard', status: 'inactive', returnMessage: 'userDiscard' }],
    });
    discardGameState = 'waitUserDiscard';
    const { cardsUsed } = getHandMeld(hands[0], '');
    discardHands[0].forEach((card, cardIndex) => {
      const suitValue = `${discardHands[0][cardIndex].suit}${discardHands[0][cardIndex].value}`;
      const whereMatch = cardsUsed.findIndex(usedCard => usedCard === suitValue);
      if (whereMatch > -1) {
        cardsUsed.splice(whereMatch, 1);
        discardHands[0][cardIndex].frontColor = '#eea';
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
    let lowestValue = 999;
    let lowestIndex = -1;
    heldCards.forEach((held, heldIndex) => {
      const checkSuitValue = `${held.suit}${held.value}`;
      const checkHand = [...state.hands[state.tookBid]];
      const checkIndex = checkHand.findIndex(check => checkSuitValue === `${check.suit}${check.value}`);
      if (checkIndex > -1) {
        checkHand.splice(checkIndex, 1);
        const { points } = getHandMeld(checkHand, trumpSuit);
        const { projectedCounts } = getProjectedCount(checkHand, trumpSuit, state.players, false);
        if (points + projectedCounts < lowestValue) {
          lowestValue = points + projectedCounts;
          lowestIndex = heldIndex;
        }
      }
    });
    if (lowestIndex > -1) {
      const unheldCard = heldCards.splice(lowestIndex, 1);
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
  possibleDiscards.forEach((source, disIndex) => {
    const sourceIndex =
      replaceHand.findIndex(
        findCard => findCard.value === source.value && findCard.value === source.value
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
    replaceHand.splice(sourceIndex, 1);
  });
  removeComputerHands[state.tookBid] = replaceHand;
  const computerDiscardMessage =
    (<span><b>{state.players[state.tookBid]}</b> has discarded {state.hands.count} cards</span>);
  const removeComputerPrompt = generalModalData(computerDiscardMessage, {});
  return {
    removeComputerHands,
    removeComputerMovingCards,
    removeComputerPrompt
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
    let suitIcon;
    switch(suit) {
      case 'H':
        suitIcon = (<Hearts />);
        break;
      case 'D':
        suitIcon = (<Diamonds />);
        break;
      case 'C':
        suitIcon = (<Clubs />);
        break;
      default:
        suitIcon = (<Spades />);
    }
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

export const showTrumpPrompt = (trumpSuit, tookBid, bidAmount, players) => {
  const trumpIcon = getFormedSuitIcon(trumpSuit);
  const trumpStyle = {
    marginTop: '3px',
    width: '100%'
  };
  const bidStyle = {
    position: 'absolute',
    right: '3px',
    top: '3px',
  };
  const line =
    (<div style={trumpStyle}>{trumpIcon} <b>{players[tookBid]}</b> <div style={bidStyle}>{bidAmount}</div></div>);
  const userTrumpPrompt = generalModalData('', {
    header: line,
  });
  return userTrumpPrompt;
};
