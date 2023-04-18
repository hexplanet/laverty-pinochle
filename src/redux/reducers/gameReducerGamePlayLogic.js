import {
  generalModalData,
  getBestCounter,
  getCardLocation,
  getHandLeaderMessage,
  getHandWinMessage,
  getHighestNonCount,
  getLowestNonCount,
  getPartnerPassSuits,
  getRandomRange,
  getTrumpBidHeader,
  getTrumpPullingSuits,
  getUnplayedCards,
  getWinner,
  getWinningCards,
  setValidCardIndexes,
  throwCardIntoMiddle
} from "../../utils/helpers";
import * as GAME_STATE from "../../utils/gameStates";
import * as colors from "../../utils/colors";
import * as CARD_ORDER from "../../utils/cardOrder";

export const startGamePlay = (state) => {
  const startBidModals = [];
  let startMovingCards = [];
  let startMelds = [];
  let startGameState = GAME_STATE.MOVING_MELD_CARDS_BACK_COMPLETE;
  const trumpHeader = getTrumpBidHeader(state.trumpSuit, state.tookBid, state.bidAmount, state.players);
  const startPromptModal = generalModalData('', { ...trumpHeader });
  for (let i = 0; i < state.players.length; i++) {
    state.melds[i].forEach((card, cardIndex) => {
      startGameState = GAME_STATE.MOVING_MELD_CARDS_BACK;
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
        gotRestGameState = GAME_STATE.GOT_REST_CONTINUE;
        gotRestPromptModal.message = (<span><b>{state.players[p]}</b> wins rest</span>);
        const message = (<span><b>{state.players[p]}</b> wins the rest</span>);
        gotRestPlayerModal = generalModalData(message, {
          hasBox: true,
          width: 400,
          height: 105,
          buttons: [{
            label: 'Continue',
            returnMessage: GAME_STATE.WIN_REST_CONTINUE
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
      validHand[cardIndex].rolloverColor = colors.cardDefaultRolloverColor;
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
      validHand[cardIndex].rolloverColor = colors.cardDefaultRolloverColor;
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
      const lowValues = CARD_ORDER.HIGH_TO_LOW;
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
  const values = CARD_ORDER.LOW_TO_HIGH;
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
  const values = CARD_ORDER.LOW_TO_HIGH;
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
  calculateWinnerPlayPile[winningPlay].frontColor = colors.countPointColor;
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
  let nextPlayGameState = GAME_STATE.START_NEXT_PLAY;
  const nextPlayPromptMessage = {...promptModal};
  if (hands[0].length === 0) {
    nextPlayGameState = GAME_STATE.TALLY_COUNTS;
    nextPlayPromptMessage.message = (<div>{nextPlayPromptMessage.message}<br/><div>+1 for last trick</div></div>);
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
  let tallyGameState = GAME_STATE.MOVE_DISCARD_TO_MELD_TALLY;
  let tallyDealToPlayer = state.dealToPlayer;
  if (valuePile.length === 0) {
    tallyGameState = GAME_STATE.NEXT_TALLY;
    if (state.players.length === 3) {
      tallyDealToPlayer = (state.dealToPlayer + 1) % state.players.length;
      if (tallyDealToPlayer === (state.tookBid + 1) % 3) {
        tallyGameState = GAME_STATE.DONE_COUNTING;
      }
    } else {
      if (state.dealToPlayer === (state.tookBid + 1) % 4) {
        tallyDealToPlayer = state.tookBid;
      } else {
        tallyGameState = GAME_STATE.DONE_COUNTING;
      }
    }
  } else {
    const selectedCard = valuePile.pop();
    const sourceCardId = `D${state.dealToPlayer}${valuePile.length}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    sourceCard.zoom = sourceCard.zoom * 2;
    const targetCardId = `M${state.dealToPlayer}`;
    const targetCard = getCardLocation(targetCardId, state);
    const isCount = CARD_ORDER.COUNTS.indexOf(selectedCard.value) > -1;
    const newMovingCard = {
      id: `${sourceCardId}to${targetCardId}`,
      keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
      suit: selectedCard.suit,
      value: selectedCard.value,
      shown: true,
      frontColor: (isCount ? colors.countPointColor : colors.cardDefaultFrontColor),
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
  const countValues = CARD_ORDER.COUNTS;
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
      returnMessage: GAME_STATE.END_OF_HAND
    }],
  });
  const teamIndex = tookBid % teams.length;
  const bidRows = addScorePlayScore[teamIndex].length;
  let amount = Number(bidModals[tookBid].header) + Number(addScorePlayScore[teamIndex][bidRows - 1].meld);
  if (Number.isNaN(amount)) {
    amount = 0;
  }
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
  let endHandGameState = GAME_STATE.MOVE_DECK_TO_DEALER;
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
    endHandGameState = GAME_STATE.WAIT_END_OF_GAME;
    endHandGameWon = teams[won];
    endHandPlayerModal = generalModalData(message, {
      hasBox: (message !== ''),
      width: 500,
      buttons: [{
        label: 'End Game',
        status: 'warning',
        returnMessage: GAME_STATE.END_OF_GAME
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