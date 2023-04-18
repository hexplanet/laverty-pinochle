import {
  generalModalData,
  getCardLocation,
  getRandomRange,
  getHandMeld,
  getProjectedCount,
  getTrumpSuit,
  getWinValue,
  getTrumpBidHeader,
  suitIconSelector,
} from '../../utils/helpers';
import * as colors from '../../utils/colors.js';
import * as GAME_STATE from '../../utils/gameStates';
import * as CARD_ORDER from '../../utils/cardOrder';

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
  const suits = CARD_ORDER.SUITS;
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
      returnMessage: GAME_STATE.POST_BID_CONTINUE,
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
  let computerThrowGameState = GAME_STATE.THROW_HAND_CONTINUE;
  const suits = CARD_ORDER.SUITS;
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
      (hands.length === 4) ? GAME_STATE.COMPUTER_WANTS_TO_THROW_HAND : GAME_STATE.THROW_HAND;
  }
  return { computerThrowGameState };
};

export const shouldComputerAgreeThrowHand = (hands, tookBid, players) => {
  let computerAgreeThrowHand = GAME_STATE.THROW_HAND;
  const { points } = getHandMeld(hands[tookBid], '');
  const { totalWins } = getProjectedCount(hands[tookBid], '', players, false);
  if (points >= 12 || totalWins.length >= 6) {
    computerAgreeThrowHand = GAME_STATE.THROW_HAND_DISAGREE;
  }
  return { computerAgreeThrowHand };
};

export const shouldUserThrowHand = (hands, bidAmount, players) => {
  let throwPlayerModal = {shown: false};
  const suits = CARD_ORDER.SUITS;
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
            returnMessage: GAME_STATE.THROW_HAND_CONTINUE,
          },
          {
            label: 'Throw Hand',
            returnMessage: (players.length === 4) ? GAME_STATE.USER_THROW_HAND : GAME_STATE.THROW_HAND,
          }
        ]
      }
    );
  }
  const throwGameState = (mayFail || willFail) ? GAME_STATE.WAIT_USER_THROW_HAND : GAME_STATE.THROW_HAND_CONTINUE;
  return {
    throwPlayerModal,
    throwGameState
  }
};

export const setUpDiscards = (hands, tookBid, players, trumpSuit, bidAmount) => {
  const discardHands = [...hands];
  let discardGameState = GAME_STATE.COMPUTER_DISCARD;
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
      buttons: [{ label: 'Discard', status: 'inactive', returnMessage: GAME_STATE.USER_DISCARD }],
    });
    discardGameState = GAME_STATE.WAIT_USER_DISCARD;
    const { cardsUsed } = getHandMeld(hands[0], trumpSuit);
    discardHands[0].forEach((card, cardIndex) => {
      const suitValue = `${discardHands[0][cardIndex].suit}${discardHands[0][cardIndex].value}`;
      const whereMatch = cardsUsed.findIndex(usedCard => usedCard === suitValue);
      if (whereMatch > -1) {
        cardsUsed.splice(whereMatch, 1);
        discardHands[0][cardIndex].frontColor = colors.discardMeldColor;
      } else if (card.suit === trumpSuit) {
        discardHands[0][cardIndex].frontColor = colors.discardTrumpColor;
      }
      discardHands[0][cardIndex].shown = true;
      discardHands[0][cardIndex].active = true;
      discardHands[0][cardIndex].clickable = true;
      discardHands[0][cardIndex].raised = false;
      discardHands[0][cardIndex].rolloverColor = colors.discardRolloverColor;
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
      state.hands[0][i].frontColor = colors.cardDefaultFrontColor;
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
  let removeComputerGameState = GAME_STATE.WAIT_REMOVE_DISCARDS;
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
  const valueKeepRanking = CARD_ORDER.KEEP_RANKING;
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
      buttons: [{ label: 'Continue', returnMessage: GAME_STATE.POST_DISCARD_TRUMP}],
    });
    removeComputerGameState = GAME_STATE.WAIT_REMOVE_DISCARDS_WITH_MESSAGE;
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
    buttons: [{ label: 'Continue', returnMessage: GAME_STATE.POST_TRUMP_SUIT_CONTINUE}],
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
  return generalModalData('Lay down meld', {
    ...trumpHeader
  });
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
  const values = CARD_ORDER.HIGH_TO_LOW;
  const suits = CARD_ORDER.MELD_SUITS;
  const valueColumns = {};
  const suitRows = {};
  values.forEach(value => { valueColumns[value] = 0; });
  suits.forEach(suit => { suitRows[suit] = 0; });
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
  let meldGameState = GAME_STATE.DISPLAY_MELD;
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
      meldGameState = GAME_STATE.FINAL_THROWN_HAND_WAIT;
      meldPlayerModal = generalModalData(
        '',
        {
          hasBox: false,
          buttons: [{
            label: 'End Hand',
            status: 'warning',
            returnMessage: GAME_STATE.END_OF_HAND
          }],
        }
      );
      meldPromptModal = generalModalData((<div><b>{teams[blankTeam]}</b> has thrown the hand</div>), {
        ...trumpHeader
      });
    } else {
      meldGameState = GAME_STATE.START_GAME_PLAY_WAIT;
      meldPlayerModal = generalModalData(
        '',
        {
          hasBox: false,
          buttons: [{
            label: 'Start Play',
            returnMessage: GAME_STATE.START_GAME_PLAY
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


