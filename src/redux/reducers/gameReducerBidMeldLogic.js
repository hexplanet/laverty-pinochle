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

/**
 * Changes prompt modal for bidding message
 * @param players {array} Player names
 * @param firstBid {number} index into players, for who is bidding next
 * @returns {{nextBidPrompt: {hasCloseButton: boolean, shown: boolean, width: number, header: string, zoom: number,
 *          message: *, hasHeaderSeparator: boolean, height: number}}} Replacement for prompt modal in redux
 */
export const nextBid = (players, firstBid) => {
  const secondLine = (firstBid === 0)
    ? (<span>Please make your bid.</span>) : (<span><b>{players[firstBid]}</b> is now bidding</span>);
  const nextBidPrompt =
    generalModalData(<div >Players now make their bids.<br/>{secondLine}</div>);
  return {
    nextBidPrompt,
  };
};
/**
 * Calculates what value the computer player should bid
 * @param hands {array} array, by player, of the cards in the player's hands
 * @param dealToPlayer {number} index into players for which player is calculating the bid
 * @param players {array} player names
 * @param bids {array} array, by player, of the current bid amounts
 * @returns {number} The bid value
 */
export const computerBid = (hands, dealToPlayer, players, bids) => {
  let maxBid = 0;
  // below loop gets the highest current big
  bids.forEach(highBid => {
    if (highBid > maxBid) {
      maxBid = highBid;
    }
  });
  let bid = 0;
  const suits = CARD_ORDER.SUITS;
  let suitBid;
  // loop below get the projected bid amount for each suit and keeps the highest one
  suits.forEach(suit => {
    const { points, nearMiss } = getHandMeld(hands[dealToPlayer], suit);
    const { projectedCounts } = getProjectedCount(hands[dealToPlayer], suit, players);
    // calculate big amount
    suitBid = Math.round((points / 2) + projectedCounts + nearMiss);
    if (suitBid < 21) {
      // modify bid amount for lower bids/possiblities
      suitBid = Math.round((points * .75) + projectedCounts + nearMiss);
    }
    if (suitBid > bid) {
      bid = suitBid;
    }
  });
  if (bid < 21 || bid <= maxBid) {
    // Pass if highest projected bid is lower or equal to current highest bid
    bid = 0;
  }
  return bid;
}
/**
 * Builds the player modal for bidding for the user for inital usage
 * @param bids {array} array, by player, of the current bids
 * @param bidOffset {number} the bid offset for pagination of bids for the user UI
 * @param dealToPlayer {number} index into players, the current player bidding.
 * @param dealer {number} index into players, the dealer of the current hand.
 * @returns {{bidPlayerModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string, zoom: number,
 *          message: *, hasHeaderSeparator: boolean, height: number}, maxedBidOffset: number}}
 *          Replaces playerModal and bidOffset in reducer
 */
export const configureUserBidModal = (bids, bidOffset, dealToPlayer, dealer) => {
  let maxBid = 0;
  let maxedBidOffset = bidOffset;
  let bidButtons;
  // below loop gets the highest current bid
  bids.forEach(bid => {
    if (bid > maxBid) {
      maxBid = bid;
    }
  });
  if (dealer === dealToPlayer) {
    // User was the dealer, thus only pass and one higher that the current highest needed as bid options
    bidButtons = [
      { label: 'Pass', returnMessage: 'bid_0' },
      { label: String(maxBid + 1), returnMessage: `bid_${maxBid + 1}` }
    ];
  } else {
    if (maxedBidOffset <= maxBid) {
      // Resets the bid offset to the one plus the highest bid since you can bid equal to or below highest bid
      maxedBidOffset = maxBid + 1;
    }
    // Set pass and left pagination buttons
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
    // below loop sets the bid number buttons
    for(let i = maxedBidOffset; i < maxedBidOffset + 5; i++) {
      if (i < 51) {
        bidButtons.push({
          label: String(i),
          returnMessage: `bid_${i}`
        });
      }
    }
    // set the right pagination button
    bidButtons.push({
      label: '>',
      returnMessage: 'bid_right',
      status: (maxedBidOffset < 46) ? '' : 'inactive',
    });
  }
  // Build playerModal using help function
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
/**
 * This resolves the bidding, declares a winner and marks the bid amount on the scorepad.
 * @param bids {array} array, by player, of current bid values
 * @param players {array} player names
 * @param teams {array} team names
 * @param playScore {array} array, by team, of arrays of score rows. See ScorePad component for more information.
 * @returns {{tookBidPlayerModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, updatedBidScore: *[],
 *          wonTheBid: number, wonBidWith: number, tookBidPromptModal: {hasCloseButton: boolean, shown: boolean,
 *          width: number, header: string, zoom: number, message: *, hasHeaderSeparator: boolean, height: number}}}
 *          replacements for playerModal, promptModal, tookBid, bids, bidAmount in reducer
 */
export const resolveBidding = (
  bids,
  players,
  teams,
  playScore
) => {
  let wonTheBid = 0;
  let wonBidWith = 0;
  // below loop finds the winner bid
  bids.forEach((bid, bidIndex) => {
    if (bid > wonBidWith) {
      wonBidWith = bid;
      wonTheBid = bidIndex;
    }
  });
  // Set up continue button UI to move on from bidding
  const tookBidPlayerModal = generalModalData('',{
    hasBox: false,
    buttons: [{
      label: 'Continue',
      returnMessage: GAME_STATE.POST_BID_CONTINUE,
    }]
  });
  // Updates the score pad with bid
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
  // Give message of bid winner in prompt modal
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
/**
 * Displays a widow card
 * @param playPile {array} cards in the play pile
 * @param widowCardIndex {number} index into the widow of which card to show
 * @param players {array} player names
 * @returns {*[]} Replacement of the playPile in the reducer
 */
export const displayWidow = (
  playPile,
  widowCardIndex,
  players
) => {
  const newPlayPile = playPile;
  if (widowCardIndex > -1) {
    // File and set location of widow card
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
/**
 * Moves all cards in the widow (playPile) to the bid winner's hand. Records widow cards as being seen.
 * @param state {object} Pointer to the reducer state
 * @returns {{widowMovingCards: *[], widowEmptyPlayPile: *[], widowSeen: *[]}}
 *          Replacements for movingCards, widowSeen, and playPile in the reducer
 */
export const movingWidow = (state) => {
  let widowMovingCards = [];
  const widowSeen = [];
  // below loop gets source and target before creating a moving card
  state.playPile.forEach((card, cardIndex) => {
    // Get moving card source
    const sourceCardId = `P${cardIndex}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    // Get moving card target
    const targetCardId = `H${state.tookBid}`;
    const targetCard = getCardLocation(targetCardId, state);
    targetCard.zoom = targetCard.zoom * 2;
    targetCard.rotation = targetCard.rotation + getRandomRange(-5, 5, 1);
    // create new moving card
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
    // add card as seen
    widowSeen.push(`${card.suit}${card.value}`);
    // add card to moving cards
    widowMovingCards = [...widowMovingCards, newMovingCard];
  });
  const widowEmptyPlayPile = [];
  // below loop creates null cards in the play pile in place of the widow
  for(let i = 0; i < state.players.length; i++) {
    widowEmptyPlayPile.push(null);
  }
  return {
    widowMovingCards,
    widowSeen,
    widowEmptyPlayPile
  };
};
/**
 * Calculates if the computer should throw the hand after getting the widow cards
 * @param hands {array} array, by player, of cards in the player's hands
 * @param tookBid {number} index into players, for who took the bid
 * @param bidAmount {number} amount that the bid was token for
 * @param players {array} player names
 * @returns {{computerThrowGameState: string}} Replacement for gameState in reducer
 */
export const shouldComputerThrowHand = (hands, tookBid, bidAmount, players) => {
  let computerThrowGameState = GAME_STATE.THROW_HAND_CONTINUE;
  const suits = CARD_ORDER.SUITS;
  let high = 0;
  let meld = 0;
  // calculates the highest hand value from all 4 suits
  suits.forEach(suit => {
    const { points } = getHandMeld(hands[tookBid], suit);
    const { projectedCounts } = getProjectedCount(hands[tookBid], suit, players, false);
    if (points + projectedCounts > high) {
      high = points + projectedCounts;
      meld = points;
    }
  });
  // calculates if it thinks it will fail to get the bid
  const willFail = (hands.length === 3 && meld + 25 < bidAmount);
  let mayFail;
  if (hands.length === 3) {
    mayFail = (high < bidAmount - 4);
  } else {
    mayFail = (high < bidAmount - 8);
  }
  if (mayFail || willFail) {
    // Starts chain of throw hand gameStates
    computerThrowGameState =
      (hands.length === 4) ? GAME_STATE.COMPUTER_WANTS_TO_THROW_HAND : GAME_STATE.THROW_HAND;
  }
  return { computerThrowGameState };
};
/**
 * Calculates if the computer agrees the hand should be thrown
 * @param hands {array} array, by player, of cards in the player's hands
 * @param tookBid {number} index into players, for who took the bid
 * @param players {array} player names
 * @returns {{computerAgreeThrowHand: string}} Replacement for gameState in reducer
 */
export const shouldComputerAgreeThrowHand = (hands, tookBid, players) => {
  let computerAgreeThrowHand = GAME_STATE.THROW_HAND;
  const { points } = getHandMeld(hands[tookBid], '');
  const { totalWins } = getProjectedCount(hands[tookBid], '', players, false);
  if (points >= 12 || totalWins.length >= 6) {
    // Does not agree if the computer has meld or power
    computerAgreeThrowHand = GAME_STATE.THROW_HAND_DISAGREE;
  }
  return { computerAgreeThrowHand };
};
/**
 * Calculates if the user has a chance to lose bid and gives the user UI to opt for or against that.
 * @param hands {array} array, by player, of cards in the player's hands
 * @param bidAmount {number} The amount the bid was taken for
 * @param players {array} player names
 * @returns {{throwGameState: (string), throwPlayerModal: {shown: boolean}}}
 *          Replacement for gameState and playerModal in reducer
 */
export const shouldUserThrowHand = (hands, bidAmount, players) => {
  let throwPlayerModal = {shown: false};
  const suits = CARD_ORDER.SUITS;
  let high = 0;
  let meld = 0;
  // below loop calculates the highest projected value of the user hand
  suits.forEach(suit => {
    const { points } = getHandMeld(hands[0], suit);
    const { projectedCounts } = getProjectedCount(hands[0], suit, players, false);
    if (points + projectedCounts > high) {
      high = points + projectedCounts;
      meld = points;
    }
  });
  // Calculates if the user may fail given the bid amount and projected highest value
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
    // If projection of failure, gives the user UI to throus hand, or not
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
  // Either waits for usr response or continues on base of failure possibility
  const throwGameState = (mayFail || willFail) ? GAME_STATE.WAIT_USER_THROW_HAND : GAME_STATE.THROW_HAND_CONTINUE;
  return {
    throwPlayerModal,
    throwGameState
  }
};
/**
 * This sets up the UI for the user if they need to discard cards from their hand
 * @param hands {array} array, by player, of cards in the player's hands
 * @param tookBid {number} index by player of who took the bid
 * @param players {array} player names
 * @param trumpSuit {string} The trump suit for the current hand
 * @param bidAmount {number} The amount that the bid was taken for
 * @returns {{discardPlayerModal: {shown: boolean}, discardGameState: string,
 *          discardPromptModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, discardHands: *[]}}
 *          Replacements for gameState, playerModal, promptModal, and hands in reducer
 */
export const setUpDiscards = (hands, tookBid, players, trumpSuit, bidAmount) => {
  const discardHands = [...hands];
  let discardGameState = GAME_STATE.COMPUTER_DISCARD;
  // Make prompt modal message for how many cards to discard
  let discardPlayerModal = {shown: false};
  const trumpHeader = getTrumpBidHeader(trumpSuit, tookBid, bidAmount, players);
  const flexWord = (tookBid === 0) ? 'have' : 'has';
  const discardMessage = (<span><b>{players[tookBid]}</b> {flexWord} to discard {players.length} cards</span>);
  const discardPromptModal = generalModalData(discardMessage, {...trumpHeader});
  if (tookBid === 0) {
    // Make player modal message and discard button if the user has to discard
    const userDiscardMessage = (<span>Cards: Meld = yellow, Trump = orange</span>)
    discardPlayerModal = generalModalData(userDiscardMessage, {
      width: 450,
      height: 105,
      buttons: [{ label: 'Discard', status: 'inactive', returnMessage: GAME_STATE.USER_DISCARD }],
    });
    discardGameState = GAME_STATE.WAIT_USER_DISCARD;
    const { cardsUsed } = getHandMeld(hands[0], trumpSuit);
    // The below loop marks the user cards in hand for if they are meld or trump and makes them clickable
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
/**
 * Handles user selection of card for discard and toggles if the card is raised. Activates discard button on
 * player modal if the required number of cards have been selected.
 * @param hands {array} array, by player, of cards in the player's hands
 * @param playerModal {object} The currently displayed player modal
 * @param index {number} index into the user hand for which card was selected
 * @returns {{discardUserModal, discardUserHands: *[]}} Replacements for hands and playerModal in the reducer
 */
export const userSelectDiscard = (hands, playerModal, index) => {
  const discardUserHands = [...hands];
  const discardUserModal = {...playerModal};
  discardUserHands[0][index].raised = !discardUserHands[0][index].raised;
  let totalRaised = 0;
  // below loop counts selected cards
  discardUserHands[0].forEach(card => {
    if (card.raised) {
      totalRaised++;
    }
  });
  // set active level of discard button based on cards selected
  discardUserModal.buttons[0].status = (totalRaised === hands.length) ? '' : 'inactive';
  return {
    discardUserHands,
    discardUserModal
  };
};
/**
 * Moves the discards for the bid winner to their discard pile. Removes those cards for the hand.
 * Gives a message that the discards have happened in the prompt modal.
 * @param state {object} Pointer to the reducer state
 * @returns {{removeUserHands: *[], removeUserMovingCards: *[], removeUserPrompt: {hasCloseButton: boolean,
 *          shown: boolean, width: number, header: string, zoom: number, message: *, hasHeaderSeparator: boolean,
 *          height: number}}} Replacements for hands, movingCards, abd promptModal in the reducer
 */
export const removeUserDiscard = (state) => {
  const removeUserHands = [...state.hands];
  let removeUserMovingCards = [];
  const sources = [];
  // below loop removes raised cards, resets the user hand for normal color and to not be clickable
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
  // below loop creates a move card for each raised card from the above loop
  sources.forEach(source => {
    // get move card source
    const sourceCardId = `H${state.tookBid}${source.index}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    sourceCard.zoom = sourceCard.zoom * 2;
    // get move card target
    const targetCardId = `D${state.tookBid}`;
    const targetCard = getCardLocation(targetCardId, state);
    targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
    // create new move card
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
  // Set message that cards have been discarded
  const userDiscardMessage = (<span><b>{state.players[0]}</b> have discarded the required cards</span>);
  const removeUserPrompt = generalModalData(userDiscardMessage, {});
  return {
    removeUserHands,
    removeUserMovingCards,
    removeUserPrompt
  };
};
/**
 * Calculates what cards the computer should discard, informs the user if the computer discarded trump
 * and then finally give the user UI to continue past the discard phase
 * @param state {object} Pointer to the reducer state
 * @returns {{removeComputerPrompt: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number},
 *          removeComputerMovingCards: *[], removeComputerGameState: string,
 *          removeComputerPlayer: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, removeComputerHands: *[]}}
 *          Replacements for hands, movingCards, promptModal, gameState, and playerModel in the reducer
 */
export const calculateComputerDiscard = (state) => {
  let removeComputerGameState = GAME_STATE.WAIT_REMOVE_DISCARDS;
  let removeComputerPlayer = state.playerModal;
  let removeComputerHands = [...state.hands];
  let removeComputerMovingCards = [];
  const trumpSuit = getTrumpSuit(state.hands[state.tookBid], state.players);
  const { cardsUsed } = getHandMeld(state.hands[state.tookBid], trumpSuit);
  const possibleDiscards = [...state.hands[state.tookBid]];
  const heldCards = [];
  // below loop sets perference for cards involved in meld as held
  cardsUsed.forEach(usedCard => {
    const matchIndex = possibleDiscards.findIndex(card => usedCard === `${card.suit}${card.value}` );
    if (matchIndex > -1) {
      const heldCard = possibleDiscards.splice(matchIndex, 1);
      heldCards.push(heldCard[0]);
    }
  });
  // below loop adds trump cards to the ones that the computer whats to hold
  for(let i = possibleDiscards.length - 1; i >= 0; i = i -1) {
    if (possibleDiscards[i].suit === trumpSuit) {
      const heldCard = possibleDiscards.splice(i, 1);
      heldCards.push(heldCard[0]);
    }
  }
  // below loop will continue to loop through the cards until the number of required discard is met
  while (possibleDiscards.length < state.hands.length) {
    let highestValue = -1;
    let highestIndex = -1;
    // below loop checks each preferred held card to see which one has the last impact on projected hand value
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
      // will remove the card from held cards that has least impact
      const unheldCard = heldCards.splice(highestIndex, 1);
      possibleDiscards.push(unheldCard[0]);
    }
  }
  const valueKeepRanking = CARD_ORDER.KEEP_RANKING;
  // below loop will remove cards from the preferred discard until the it reaches the discard card amount
  while (possibleDiscards.length > state.hands.length) {
    let highest = 0;
    let highestIndex = 0;
    // below loop goes through each possible discard to figure out if that card adds the most to the hand
    possibleDiscards.forEach((possible, possibleIndex) => {
      const { winValue, cardsInSuit } = getWinValue(possibleDiscards, possibleIndex);
      const possibleScore = (100 * winValue) + (valueKeepRanking.indexOf(possible.value) * 10) + cardsInSuit;
      if (possibleScore > highest) {
        highest = possibleScore;
        highestIndex = possibleIndex;
      }
    });
    // Remove best card to keep from discards
    possibleDiscards.splice(highestIndex, 1);
  }
  const replaceHand = [...state.hands[state.tookBid]];
  let discardedTrump = 0;
  // below loop will move discarded cards from the hand to the discard pile
  possibleDiscards.forEach((source, disIndex) => {
    // get move card source
    const sourceIndex =
      replaceHand.findIndex(
        findCard => findCard.suit === source.suit && findCard.value === source.value
      );
    const sourceCardId = `H${state.tookBid}${disIndex}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    sourceCard.zoom = sourceCard.zoom * 2;
    // get move card taret
    const targetCardId = `D${state.tookBid}`;
    const targetCard = getCardLocation(targetCardId, state);
    targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
    // create new moving card
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
      // add one to discarded trump if card is trump suit
      discardedTrump = discardedTrump + 1;
    }
    // remove card from hand
    replaceHand.splice(sourceIndex, 1);
  });
  removeComputerHands[state.tookBid] = replaceHand;
  let removeComputerPrompt = state.promptModal;
  if (discardedTrump > 0) {
    // Inform the user that the computer discarded trump and create continue button to move on from that
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
/**
 * Sets up UI for the user to select the trump suit. Only allows player to select suits they have.
 * @param hands {array} array, by player, of cards in the player's hand
 * @param players {array} player names
 * @returns {{userTrumpPrompt: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number},
 *          userTrumpPlayer: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}}}
 *          Replacements for both playerModal and promptModal in the reducer.
 */
export const userSelectTrump = (hands, players) => {
  const validSuits = [];
  // below loop selects suits the user can select for trump from the cards in their hand
  hands[0].forEach(card => {
    if (validSuits.indexOf(card.suit) === -1) {
      validSuits.push(card.suit);
    }
  });
  const trumpButtons = [];
  // below loop creates suit buttons, using icons, for the user to select trump suit
  validSuits.forEach(suit => {
    const suitIcon = suitIconSelector(suit);
    trumpButtons.push({
      returnMessage: `trumpIs_${suit}`,
      icon: suitIcon,
      height: 30,
      width: 30
    });
  });
  // Creates modals for notification and selection of trump suit
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
/**
 * Calculates which suit the computer player should make trump and informs the user of the selection
 * and creates a continue button for the user to move on from the trump suit phase
 * @param hands {array} array, by player, of cards in the player's hand
 * @param tookBid {number} index into players for who took the bid
 * @param players {array} player names
 * @param bidAmount {number} The amount the bid was taken for
 * @returns {{computerTrumpPlayer: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, computerTrumpSuit,
 *          computerTrumpPrompt: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}}}
 *          Replacments for trumpSuit, playerModal, and promptModal in the reducer
 */
export const computerSelectTrump = (hands, tookBid, players, bidAmount) => {
  // calculate trump suit
  const computerTrumpSuit = getTrumpSuit(hands[tookBid], players);
  // create player modal for continue button
  const computerTrumpPlayer = generalModalData('', {
    hasBox: false,
    buttons: [{ label: 'Continue', returnMessage: GAME_STATE.POST_TRUMP_SUIT_CONTINUE}],
  });
  // create prompt modal to inform trump suit selection
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
/**
 * Give a message in the prompt modal that meld is being laid down
 * @param trumpSuit {string} The trump suit for the hand
 * @param tookBid {number} index into players for who took the bid
 * @param bidAmount {number} The amount the bid was taken for
 * @param players {array} play names
 * @returns {{hasCloseButton: boolean, shown: boolean, width: number, header: string, zoom: number,
 *          message: *, hasHeaderSeparator: boolean, height: number}}
 *          Replacement for the promptModal in the reducer
 */
export const startMeldMessage = (trumpSuit, tookBid, bidAmount, players) => {
  const trumpHeader = getTrumpBidHeader(trumpSuit, tookBid, bidAmount, players);
  return generalModalData('Lay down meld', {
    ...trumpHeader
  });
};
/**
 * Selects all cards that make up the meld and arranges them on the meld pile for display
 * @param state {object} Pointer to the reducer state
 * @returns {{meldPlacedCards: *[], meldSeenCards: *[], meldPlaceScores: *[], meldHands: *[]}}
 *          Replacements for hands, melds, meldScores, and seenCards in the reducer
 */
export const meldCards = (state) => {
  let meldHands = [...state.hands];
  let meldHand = meldHands[state.dealToPlayer];
  let meldPlacedCards = [...state.melds];
  let meldPile = meldPlacedCards[state.dealToPlayer];
  const meldPlaceScores = [...state.meldScores];
  const { points, cardsUsed } = getHandMeld(state.hands[state.dealToPlayer], state.trumpSuit);
  // updates meld score based on meld cards
  meldPlaceScores[state.dealToPlayer] = points;
  // updates seen cards based on meld cards
  const meldSeenCards = [...state.seenCards];
  meldSeenCards[state.dealToPlayer] = [...cardsUsed];
  if (state.dealToPlayer === state.tookBid) {
    // below loop adds likely kept cards from the widow to the seen cards
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
  // below loop finds all cards that are used for meld and creates rows and columns to house them
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
  // below loop sets column values for cards to be displayed
  values.forEach(value => {
    for (let i = 0; i < valueColumns[value]; i++) {
      columns.push(value);
    }
  });
  const rows = [];
  // below loop sets rows values for cards to be displayed
  suits.forEach(suit => {
    if (suitRows[suit] > 0) {
      rows.push(suit);
    }
  });
  const leftEdge = columns.length * -25;
  const topEdge = -35 + (rows.length * -70);
  // below loops places each card of the meld cards on the created grid at the proper spot
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
          // This adds the removes the card for the hand once it is on the meld pile
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
/**
 * Advances the player showing meld and if it comes back to the bid winner, adds the meld scores to the score pad.
 * Then either gives a start play button for the user or an end hand button if the hand was previously thrown.
 * @param dealToPlayer {number} current active player
 * @param thrownHand {boolean} Was the hand thrown by the bid winner?
 * @param tookBid {number} index into players for who took the bid
 * @param meldScores {array} array, by player, for the amount the meld was worth in the player's hand
 * @param playScore {array} array, by teams, of arrays of score rows. See ScorePad for more information.
 * @param players {array} Player names
 * @param promptModal {object} Properties for the prompt modal. See Modal for more information.
 * @param trumpSuit {string} The suit selected as trump for this hand
 * @param bidAmount {number} The amount the bid was taken for
 * @param teams {array} Team names
 * @returns {{meldPromptModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, meldPlayScore,
 *          meldPlayerModal: {shown: boolean}, meldDealToPlayer: number, meldGameState: string}}
 *          Replacement for dealToPlayer, gameState, playScore, playerModal, and promptModal in the reducer
 */
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
    // the below loop adds the meld to the scorepad if the team involved did not throw the hand
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
      // Creates player modal to have user end the hand and move on to the next one
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
      // creates player modal for game play phase to start
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


