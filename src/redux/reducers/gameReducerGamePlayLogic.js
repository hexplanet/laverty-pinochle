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

/**
 * Moves all meld pile cards back the the player's hands. Clear outs meld pile. Clear prompt down to trump header.
 * @param state {object} Pointer to reducer state
 * @returns {{startMelds: *[], startMovingCards: *[], startGameState: string, startPromptModal:
 *          {hasCloseButton: boolean, shown: boolean, width: number, header: string, zoom: number,
 *          message: *, hasHeaderSeparator: boolean, height: number}, startBidModals: *[]}}
 *          Replacements for movingCards, gameState, promptModal, bidModals, melds in the reducer
 */
export const startGamePlay = (state) => {
  const startBidModals = [];
  let startMovingCards = [];
  let startMelds = [];
  // set gameState in case of no meld cards
  let startGameState = GAME_STATE.MOVING_MELD_CARDS_BACK_COMPLETE;
  // clear prompt header
  const trumpHeader = getTrumpBidHeader(state.trumpSuit, state.tookBid, state.bidAmount, state.players);
  const startPromptModal = generalModalData('', { ...trumpHeader });
  // below loops create move cards for all meld pile cards to send to player's hands
  for (let i = 0; i < state.players.length; i++) {
    state.melds[i].forEach((card, cardIndex) => {
      // set gameState for the card moving
      startGameState = GAME_STATE.MOVING_MELD_CARDS_BACK;
      // get move card source
      const sourceCardId = `M${i}${cardIndex}`;
      const sourceCard = getCardLocation(sourceCardId, state);
      // get move card target
      const targetCardId = `H${i}${cardIndex}`;
      const targetCard = getCardLocation(targetCardId, state);
      targetCard.zoom = sourceCard.zoom * 2;
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
      startMovingCards = [...startMovingCards, newMovingCard];
    });
    // hide player bid modals
    startBidModals.push({shown: false});
    // clear player meld pile
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
/**
 * Moves all cards left in all hands to the winners discard pile.
 * @param state {object} Pointer to reducer state
 * @returns {{restDiscardMovingCards: *[], restDiscardHands: *[], restDiscardShowHands: *[]}}
 *          Replacements for movingCards, showHands, and hands in the reducer
 */
export const moveRestToDiscardPile = (state) => {
  const restDiscardShowHands = [];
  let restDiscardMovingCards = [];
  const restDiscardHands = [];
  // calculates which discard pile to move the cards to
  let discardPile = state.winningPlay;
  if (state.players.length === 4) {
    if (state.winningPlay % 2 === state.tookBid % 2) {
      discardPile = state.tookBid;
    } else {
      discardPile = (state.tookBid + 1) % 4;
    }
  }
  // below loops create the move cards for all hand cards to target proper discard pile
  for (let i = 0; i < state.players.length; i++) {
    // re-hides the computer player's hand
    restDiscardShowHands.push(i === 0);
    // clears out the player's hand
    restDiscardHands.push([]);
    const cards = state.hands[i].length;
    for (let c = 0; c < cards; c++) {
      // select card to move
      const selectedCard = state.hands[i][c];
      // get move card source
      const sourceCardId = `H${i}${c}`;
      const sourceCard = getCardLocation(sourceCardId, state);
      // get move card target
      const targetCardId = `D${discardPile}`;
      const targetCard = getCardLocation(targetCardId, state);
      // create new moving card
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
/**
 * Checks to see if all players have all trump left and no other trump is not played. If so, show all hands
 * and start that the player has the rest of the tricks and give the user UI to continue on from here.
 * @param state {object} Pointer to reducer state
 * @returns {{gotRestShowHands: *[], gotRestPromptModal, gotRestGameState: string, gotRestPlayerModal:
 *          {shown: boolean}, gotRestWinningPlay: number}}
 *          Replacements for gameState, playerModal, promptModal, showHands, and winningPlay in the reducer
 */
export const gotTheRest = (state) => {
  let gotRestGameState = '';
  let gotRestPlayerModal = {shown: false};
  let gotRestPromptModal = {...state.promptModal};
  const gotRestShowHands = [];
  let gotRestWinningPlay = -1;
  // below loop check for if each play will win the remaining tricks with the only trump remaining
  for(let p = 0; p < state.players.length; p++) {
    const validHand = [...state.hands[p]];
    if (gotRestGameState === '') {
      const widowDiscards = [];
      if (p === state.tookBid) {
        // below loop adds widow to known cards if the player took the bid
        for (let i = 0; i < state.players.length; i++) {
          widowDiscards.push(state.discardPiles[p][i]);
        }
      }
      // get cards sets for evaluation of remaining hands
      const unplayedCards = getUnplayedCards(validHand, state.playedCards, widowDiscards);
      const unplayedTrump = unplayedCards.filter(card => card.suit === state.trumpSuit);
      const trumpInHand = validHand.filter(card => card.suit === state.trumpSuit);
      if (unplayedTrump.length === 0 && trumpInHand.length === validHand.length) {
        gotRestWinningPlay = p;
        // below loop makes all player's hands visible
        for (let i = 0; i < state.players.length; i++) {
          gotRestShowHands.push(true);
        }
        gotRestGameState = GAME_STATE.GOT_REST_CONTINUE;
        // generate modal to tell user that a player has the rest and give then a continue button to move on
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
/**
 * Gives the user a prompt to play a card (rules for play) and sets card props in hand to limit selections.
 * @param hands {array} array, by player, for the cards in the player's hands
 * @param trumpSuit {string} Trump suit for this hand
 * @param firstPlay {boolean} Is this the first trick of the hand?
 * @param promptModal {object} The prompt modal object. See Modal component for more information.
 * @param players {array} Player names
 * @returns {{userLeadPromptModal, userLeadPlayHands: *[], userLeadPlayerModal: {hasCloseButton: boolean,
 *          shown: boolean, width: number, header: string, zoom: number, message: *,
 *          hasHeaderSeparator: boolean, height: number}}}
 *          Replacements for playerModal, promptModal, and hands in the reducer
 */
export const userLeadPlay = (hands, trumpSuit, firstPlay, promptModal, players) => {
  const userLeadPlayHands = [...hands];
  let userLeadPlayerModal = {shown: false};
  // Modifies prompt modal to tell who leads
  const userLeadPromptModal = {...promptModal};
  userLeadPromptModal.message = (<span><b>{players[0]}</b> lead play</span>);
  // Get valid cards that can be played
  const validHand = [...hands[0]];
  const validCards = setValidCardIndexes(validHand, '', trumpSuit, firstPlay);
  // below loop modifies card prop in the hand for either can play or can't play
  validHand.forEach((card, cardIndex) => {
    validHand[cardIndex].shown = true;
    if (validCards.indexOf(cardIndex) > -1) {
      // Card that can be played
      validHand[cardIndex].active = true;
      validHand[cardIndex].clickable = true;
      validHand[cardIndex].rolloverColor = colors.cardDefaultRolloverColor;
    } else {
      // Card that can't be played
      validHand[cardIndex].active = false;
      validHand[cardIndex].clickable = false;
      validHand[cardIndex].rolloverColor = '';
    }
  });
  userLeadPlayHands[0] = [...validHand];
  // Updates the player modal with a message of which cards can be played
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
/**
 * Determines what cards can be played, modifies the user hand for that, and instructs why cards can't be played.
 * @param hands {array} array, by player, for the cards in the player's hands
 * @param trumpSuit {string} Trump suit for this hand
 * @param players {array} Player names
 * @param playPile {array} Cards in the play pile
 * @param winningPlay {number} index into players, which player is winning the trick
 * @param tookPlay {number} Winner of the last trick
 * @returns {{userFollowPlayerModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, userFollowPlayHands: *[]}}
 *          Replacements for playerModal and hands in the reducer
 */
export const userFollowPlay = (hands, trumpSuit, players, playPile, winningPlay, tookPlay) => {
  const userFollowPlayHands = [...hands];
  let userFollowPlayerModal = {shown: false};
  // get which cards can be played
  const ledCard = playPile[tookPlay];
  const winningCard = playPile[winningPlay];
  const ledSuit = ledCard.suit;
  const ledValue = (ledSuit === trumpSuit) ? winningCard.value : '';
  const validHand = [...hands[0]];
  const validCards = setValidCardIndexes(validHand, ledSuit, trumpSuit, false, ledValue);
  const validSuits = {};
  // below loop modifies card prop in the hand for either can play or can't play
  validHand.forEach((card, cardIndex) => {
    validHand[cardIndex].shown = true;
    if (validCards.indexOf(cardIndex) > -1) {
      // can be played
      validHand[cardIndex].active = true;
      validHand[cardIndex].clickable = true;
      validHand[cardIndex].rolloverColor = colors.cardDefaultRolloverColor;
      validSuits[validHand[cardIndex].suit] = true;
    } else {
      // can't be played
      validHand[cardIndex].active = false;
      validHand[cardIndex].clickable = false;
      validHand[cardIndex].rolloverColor = '';
    }
  });
  // get proper message for player modal
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
  // build player modal
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
/**
 * Moves the user selected hand card into the play pile, makes user hand non-selectable,
 * and clears message on prompt modal.
 * @param state {object} Pointer to reducer state
 * @param selectedIndex {number} index into hand cards for which card the user played
 * @returns {{userPlayMovingCards: {shown: boolean, keyId: string, id: string, suit, source: WorkerLocation | Location,
 *          value, speed: number, target: WorkerLocation | Location}[], userPlayHands: *[], userPlayPromptModal}}
 *          Replacements for hands, movingCards, promptModal in the reducer
 */
export const userPlay = (state, selectedIndex) => {
  // Prompt modal message cleared
  const userPlayPromptModal = {...state.promptModal};
  userPlayPromptModal.message = '';
  // select card to move
  const selectedCard = state.hands[0][selectedIndex];
  // get move card source
  const sourceCardId = `H0${selectedIndex}`;
  const sourceCard = getCardLocation(sourceCardId, state);
  sourceCard.zoom = sourceCard.zoom * 2;
  // get move card target
  const targetCardId = `P0`;
  const targetCard = getCardLocation(targetCardId, state);
  // create new moving card
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
  // remove selected card from hand
  const userPlayHands = [...state.hands];
  const userHand = userPlayHands[0];
  userHand.splice(selectedIndex, 1);
  // reset user hand cards to non-selectable
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
/**
 * Selects lead card for computer and starts its movement to the play pile
 * @param state {object} Pointer to reducer state
 * @returns {{computerPlayMovingCards: *[], computerLeadPlayHands: *[]}}
 *          Replacements for hands and moving cards in the reducer
 */
export const computerLeadPlay = (state) => {
  const computerLeadPlayHands = [...state.hands];
  const validHand = computerLeadPlayHands[state.tookPlay];
  let computerPlayMovingCards = [];
  const widowDiscards = [];
  if (state.tookPlay === state.tookBid) {
    // adds discards to known cards if player took bid
    for (let i = 0; i <state.players.length; i++) {
      widowDiscards.push(state.discardPiles[state.tookBid][i]);
    }
  }
  // get card setup for later AI usage
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
    // First play
    if (winningCards.length > 0) {
      // Play required trump for win
      playCard = winningCards[0];
    } else {
      // Play required trump for lose
      playCard = getHighestNonCount(validHand, state.trumpSuit);
    }
  } else {
    // Non-first play
    const trumpLeft = unplayedCards.filter(card => card.suit === state.trumpSuit);
    const trumpInHand = validHand.filter(card => card.suit === state.trumpSuit);
    const trumpWin = winningCards.filter(card => card.suit === state.trumpSuit);
    if (trumpWin.length === 1) {
      if (trumpLeft.length < trumpInHand.length && trumpInHand.length + 2 >= validHand.length && trumpLeft.length > 0 ) {
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
          // There is a suit(s) to pull trump, do it
          suitIndex = getRandomRange(0, trumpPullingSuits.length - 1, 1);
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
      const pullWithTrump = trumpLeft.length > 0 &&
        ((trumpInHand.length > trumpLeft.length) || (trumpInHand.length + 2) >= validHand.length);
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
        // Pass suit exists, use it
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
  if (playCard !== null) {
    // start selected card moving to the play pile and remove it from the player's hand
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

const giveUnitTestVariables = (state, nextPlayer, unplayedCards) => {
  console.log('---------------------');
  console.log(JSON.stringify({
    hands: state.hands,
    players: state.players,
    playPile: state.playPile,
    tookPlay: state.tookPlay,
    tookBid: state.tookBid,
    offSuits: state.offSuits,
    trumpSuit: state.trumpSuit,
    winningPlay: state.winningPlay,
    playedCards: state.playedCards,
    discardPiles: state.discardPiles
  }));
  console.log(nextPlayer);
  console.log(JSON.stringify(unplayedCards));
  console.log('---------------------');
};


/**
 * Calculates the card the computer player should follow with and starts its movement to the play pile
 * @param state {object} Pointer to reducer state
 * @param nextPlayer {number} index into players for the active player
 * @returns {{computerFollowMovingCards: *[], computerFollowHands: *[]}}
 *          Replacements for hands and moving cards in the reducer
 */
export const computerFollowPlay = (state, nextPlayer) => {
  const computerFollowHands = [...state.hands];
  const validHand = computerFollowHands[nextPlayer];
  let computerFollowMovingCards = [];
  // get values for later AI usage
  const ledCard = state.playPile[state.tookPlay];
  const ledHand = validHand.filter(card => card.suit === ledCard.suit);
  const trumpHand = validHand.filter(card => card.suit === state.trumpSuit);
  const winningCard = state.playPile[state.winningPlay];
  const beenTrumped = (winningCard.suit === state.trumpSuit && ledCard.suit !== state.trumpSuit);
  const widowDiscards = [];
  const values = CARD_ORDER.LOW_TO_HIGH;
  if (nextPlayer === state.tookBid) {
    // below loop adds discards to know cards if player took bid
    for (let i = 0; i < state.players.length; i++) {
      widowDiscards.push(state.discardPiles[state.tookBid][i]);
    }
  }
  // get values and card sets for later AI usage
  const unplayedCards = getUnplayedCards(validHand, state.playedCards, widowDiscards);
  const highLedCard = unplayedCards.find(card => card.suit === ledCard.suit);
  const highLedIndex = highLedCard ? values.indexOf(highLedCard.value) : -1;
  const blocker = ((nextPlayer + 1) % state.players.length);
  const blockerPlayer = (blocker === state.tookPlay) ? -1 : blocker;
  let likelyBlockerWin = false;
  if (blockerPlayer > -1) {
    // if another team player still has to play
    if (state.offSuits[blockerPlayer].indexOf(ledCard.suit) > -1) {
      if (state.offSuits[blockerPlayer].indexOf(state.trumpSuit) === -1) {
        if (beenTrumped) {
          if (values.indexOf(winningCard.value) < highLedIndex) {
            // The other team player will likely win
            likelyBlockerWin = true;
          }
        } else {
          // The other team player will likely win
          likelyBlockerWin = true;
        }
      }
    } else {
      if (values.indexOf(winningCard.value) < highLedIndex) {
        // The other team player will likely win
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
    // Is there a friendly play to still play
    if (state.offSuits[friendlyPlayer].indexOf(ledCard.suit) > -1) {
      if (state.offSuits[friendlyPlayer].indexOf(state.trumpSuit) === -1) {
        if (beenTrumped) {
          if (values.indexOf(winningCard.value) < highLedIndex) {
            // friendly player is likely to win
            likelyBlockerWin = false;
          }
        } else {
          // friendly player is likely to win
          likelyBlockerWin = false;
        }
      }
    } else {
      if (values.indexOf(winningCard.value) < highLedIndex) {
        // friendly player is likely to win
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
      // below follows trump suit
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
    // move selected card to the play pile and remove it from the player's hand
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
/**
 * Resolves what happens when a card played reaches the play pile, added to seen cards, sets who is winning the trick,
 * and updates the modals to prompt modal to display who is winning.
 * @param players {array} player names
 * @param playPile {array} cards in the play pile
 * @param trumpSuit {string} The current trump suit for the hand
 * @param dealToPlayer {number} index into players for who the active player is
 * @param tookPlay {number} index into players for the player who won the last trick
 * @param winningPlay {number} index into players for who is winning the current trick
 * @param tookBid {number} index into players for who took the bid
 * @param bidAmount {number} The amount the bid was taken for
 * @param playedCards {array} array, by player, of the cards the player has played this hand
 * @returns {{resolvePromptModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, resolvePlayedCards: *[],
 *          resolveWinningPlay}}
 *          Replacements for winningPlay, promptModal, and playedCards in the reducer
 */
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
    // if first card of the trick, automatically winning
    resolveWinningPlay = tookPlay;
  } else {
    const winningCard = playPile[winningPlay];
    if (playedCard.suit === trumpSuit && winningCard.suit !== trumpSuit) {
      // If trumped other suit, winning
      resolveWinningPlay = dealToPlayer;
    } else if (playedCard.suit === winningCard.suit
      && values.indexOf(playedCard.value) > values.indexOf(winningCard.value)) {
      // If following and higher, winning
      resolveWinningPlay = dealToPlayer;
    }
  }
  // Display winning messing in the prompt modal
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
/**
 * This updates off suits by player, high lights the winning card on the play pile,
 * and update the prompt modal with winning message.
 * @param trumpSuit {string} The trump suit of the current hand
 * @param players {array} player names
 * @param playPile {array} cards in the play pile
 * @param winningPlay {number} index into players for who is winning the trick
 * @param promptModal {object} The prompt modal. See Modal component for more information.
 * @param tookPlay {number} index into players for who won the last trick
 * @param offSuits {array} array, by players, of what suits that player has shown they don't have
 * @returns {{calculateWinnerPromptModal, calculateWinnerPlayPile: *[], calculateWinnerOffSuits: *[]}}
 *          Replacements for playPile, promptModal, and offSuits in the reducer
 */
export const displayPlayWinner = (trumpSuit, players, playPile, winningPlay, promptModal, tookPlay, offSuits) => {
  const calculateWinnerOffSuits = [...offSuits];
  // This loop updates offSuit basic on the cards played
  for (let i = 0; i < players.length; i++) {
    if (playPile[i].suit !== playPile[tookPlay].suit) {
      if (calculateWinnerOffSuits[i].indexOf(playPile[tookPlay].suit) === -1) {
        calculateWinnerOffSuits[i].push(playPile[tookPlay].suit);
      }
    }
  }
  // high light winning card
  const calculateWinnerPlayPile = [...playPile];
  calculateWinnerPlayPile[winningPlay].frontColor = colors.countPointColor;
  // displays the win in the prompt modal
  const winCard = calculateWinnerPlayPile[winningPlay];
  const calculateWinnerPromptModal = {...promptModal};
  calculateWinnerPromptModal.message = getHandWinMessage(winCard.suit , winCard.value , players, winningPlay);
  return {
    calculateWinnerPlayPile,
    calculateWinnerPromptModal,
    calculateWinnerOffSuits
  };
};
/**
 * Either resets the game play for the next trick, or starts the tally counts phase of the game
 * with message for +1 point for last trick taken
 * @param hands {array} array, by player, for the cards in the player's hands
 * @param promptModal {object} The prompt modal. See Modal component for more information.
 * @param tookBid {number} index into players for who took the bid
 * @param winningPlay {number} index into players for who is winning the current trick
 * @returns {{nextPlayGameState: string, nextPlayPromptMessage, nextPlayDealToPlayer: number}}
 *          Replacements for sameState, promptModal, and dealToPlayer in the reducer
 */
export const setUpNextPlay = (hands, promptModal, tookBid, winningPlay) => {
  let nextPlayDealToPlayer = winningPlay;
  // start new play gameState
  let nextPlayGameState = GAME_STATE.START_NEXT_PLAY;
  const nextPlayPromptMessage = {...promptModal};
  if (hands[0].length === 0) {
    // Out of cards in the hand, start the tall counts phase of game
    nextPlayGameState = GAME_STATE.TALLY_COUNTS;
    // Declare who got the extra point for last trick.
    nextPlayPromptMessage.message = (<div>{nextPlayPromptMessage.message}<br/><div>+1 for last trick</div></div>);
    nextPlayDealToPlayer = (tookBid + 1) % hands.length;
  }
  return {
    nextPlayGameState,
    nextPlayPromptMessage,
    nextPlayDealToPlayer
  };
};
/**
 * Starts movement of cards in play pile to winning team's discard pile and resets play pile for next trick
 * @param state {object} Pointer to the reducer state
 * @returns {{playToDiscardMovingCards: *[], playToDiscardPlayPile: *[]}}
 *          Replacements for movingCards and Play Pile in the reducer
 */
export const movePlayPileToDiscard = (state) => {
  let playToDiscardMovingCards = [];
  // calculate the discard pile for the winning team
  let discardPile = state.winningPlay;
  if (state.players.length === 4) {
    if (state.winningPlay % 2 === state.tookBid % 2) {
      discardPile = state.tookBid;
    } else {
      discardPile = (state.tookBid + 1) % 4;
    }
  }
  // loop moves cards for the play pile to the proper discard pile
  for(let i = 0; i < state.players.length; i++) {
    // set move card source
    const sourceCardId = `P${i}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    // set move card target
    const targetCardId = `D${discardPile}`;
    const targetCard = getCardLocation(targetCardId, state);
    targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
    // create moving card
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
  // reset play pile for next trick
  const playToDiscardPlayPile = [];
  for(let i = 0; i < state.players.length; i++) {
    playToDiscardPlayPile.push(null);
  }
  return {
    playToDiscardMovingCards,
    playToDiscardPlayPile
  };
}
/**
 * Moves a card from a player's discard pile to their meld pile for tally. High lights card that are counts.
 * @param state {object} Pointer to the reducer state
 * @returns {{tallyDealToPlayer: (*|number), tallyMovingCards: *[], tallyDiscardPiles: *[], tallyGameState: string}}
 *          Replacements for movingCards, discardPiles, dealToPlayer, and gameState in the reducer
 */
export const discardToMeldTally = (state) => {
  const tallyDiscardPiles = [...state.discardPiles];
  const valuePile = tallyDiscardPiles[state.dealToPlayer];
  let tallyMovingCards = [];
  let tallyGameState = GAME_STATE.MOVE_DISCARD_TO_MELD_TALLY;
  let tallyDealToPlayer = state.dealToPlayer;
  if (valuePile.length === 0) {
    // Moves onto the next player if the current player is out of cards to tally
    tallyGameState = GAME_STATE.NEXT_TALLY;
    if (state.players.length === 3) {
      tallyDealToPlayer = (state.dealToPlayer + 1) % state.players.length;
      if (tallyDealToPlayer === (state.tookBid + 1) % 3) {
        // All players tallied
        tallyGameState = GAME_STATE.DONE_COUNTING;
      }
    } else {
      if (state.dealToPlayer === (state.tookBid + 1) % 4) {
        tallyDealToPlayer = state.tookBid;
      } else {
        // All players tallied
        tallyGameState = GAME_STATE.DONE_COUNTING;
      }
    }
  } else {
    // Get move to move
    const selectedCard = valuePile.pop();
    // get move card source
    const sourceCardId = `D${state.dealToPlayer}${valuePile.length}`;
    const sourceCard = getCardLocation(sourceCardId, state);
    sourceCard.zoom = sourceCard.zoom * 2;
    // get move card target
    const targetCardId = `M${state.dealToPlayer}`;
    const targetCard = getCardLocation(targetCardId, state);
    // is the card a count to be high lighted?
    const isCount = CARD_ORDER.COUNTS.indexOf(selectedCard.value) > -1;
    // Create moving card
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
/**
 * Calculates the current counts in the teams meld pile and displays that in their bid modal
 * @param bidModals {array} array, by player, for bid modal. See Modal component for more information.
 * @param melds {array} array, by player, for the cards in the player's meld pile.
 * @param tookPlay {number} index into players for who won the last trick
 * @param dealToPlayer {number} index into players for who is the current active player
 * @returns {{addCountBidModals: *[]}} Replacement for bidModal in the reducer
 */
export const addCountToTally = (bidModals, melds, tookPlay, dealToPlayer) => {
  const addCountBidModals = [...bidModals];
  // calculates who gets the point for last trick
  let counts = (melds.length === 3 && dealToPlayer === tookPlay) ? 1 : 0;
  counts = (melds.length === 4 && dealToPlayer % 2 === tookPlay % 2) ? 1 : counts;
  const countValues = CARD_ORDER.COUNTS;
  // below loop adds a point for each count in the meld pile
  melds[dealToPlayer].forEach(card => {
    if (countValues.indexOf(card.value) > -1) {
      counts = counts + 1;
    }
  });
  // This displays the tallied points in the bid modal for the player by team
  addCountBidModals[dealToPlayer] = generalModalData('', {
    header: String(counts),
    width: 80,
    height: 44,
  });
  return {
    addCountBidModals
  };
};
/**
 * Adds the count to the score pad. States if a team got cabbaged and adjusts score pad. Figures out and states if
 * the player made or missed their bid with score pad adjustment for that.
 * @param teams {array} team names
 * @param players {array} player names
 * @param playScore {array} array by team of arrays of row scores. See ScorePad component for more information.
 * @param melds {array} array, by player, for the cards in the players meld pile
 * @param bidModals {array} array, by player, for the bid modals. See Modal component for more information.
 * @param tookBid {number} index into players for who took the bid
 * @param bidAmount {number} The amount the bid was taken for
 * @returns {{addScorePromptModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, addScoreGameWon: (*|string),
 *          addScorePlayerModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, addScorePlayScore: *[]}}
 *          Replacements for playScore, playerModal, promptModal, and gameWon in the reducer
 */
export const addCountToScore = (teams, players, playScore, melds, bidModals, tookBid, bidAmount) => {
  const addScorePlayScore = [...playScore];
  let cabbageMessage = '';
  let hasBox = false;
  // below loop adds tally points to the score pad and does cabbage things
  for(let i = 0; i < teams.length; i++) {
    // figure out the pile we are counter from
    const pile = (tookBid + i) % players.length;
    // figure out the team for the pile
    const team = pile % teams.length;
    const scoreRows = addScorePlayScore[team].length;
    let counts = 0;
    // get the count score
    let countScore = Number(scoreRows > 1 ? addScorePlayScore[team][scoreRows - 2].score : 0);
    if (melds[pile].length === 0) {
      // cabbaged
      if (cabbageMessage === '') {
        // Team is cabbaged
        cabbageMessage = (<span><b>{teams[team]}</b></span>);
      } else {
        // multiple teams are cabbaged
        cabbageMessage = cabbageMessage + ' and ' + (<span><b>{teams[team]}</b></span>);
      }
      addScorePlayScore[team][scoreRows - 1].gotSet = true;
      addScorePlayScore[team][scoreRows - 1].counts = "";
    } else {
      // no cabbage, add points
      counts = Number(bidModals[pile].header) + addScorePlayScore[team][scoreRows - 1].meld;
      addScorePlayScore[team][scoreRows - 1].counts = bidModals[pile].header;
    }
    // add and display points
    countScore = countScore + counts;
    addScorePlayScore[team][scoreRows - 1].score = String(countScore);
  }
  if (cabbageMessage !== '') {
    // display cabbage message if it happened
    hasBox = true;
    cabbageMessage = (<span>{cabbageMessage} was cabbaged.</span>);
  }
  // generate end hand button for user to move on to the next hand or end of game
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
  // calculate the total value of the hand for the team
  const teamIndex = tookBid % teams.length;
  const bidRows = addScorePlayScore[teamIndex].length;
  let amount = Number(bidModals[tookBid].header) + Number(addScorePlayScore[teamIndex][bidRows - 1].meld);
  if (Number.isNaN(amount)) {
    // safety check to set score to zero if cabbaged
    amount = 0;
  }
  // generate prompt message
  let message = (<div><b>{players[tookBid]}</b> has made there bid of {bidAmount} with {amount}.</div>);
  if (amount < bidAmount) {
    // player failed bid, create message and dock team score
    message = (<div><b>{players[tookBid]}</b> failed to make the bid of {bidAmount} with {amount}.</div>);
    const whoGotSet = (players.length === 4) ? tookBid % 2 : tookBid;
    const gotSetRows = addScorePlayScore[whoGotSet].length;
    const gotSetScore = gotSetRows > 1 ? addScorePlayScore[whoGotSet][gotSetRows - 2].score - bidAmount : -bidAmount;
    addScorePlayScore[whoGotSet][gotSetRows - 1].gotSet = true;
    addScorePlayScore[whoGotSet][gotSetRows - 1].score = gotSetScore;
  }
  // check for game winner
  const hasWinner = getWinner(addScorePlayScore, tookBid);
  // Set Big W for win on scorepad if there is a winner
  const addScoreGameWon = hasWinner > -1 ? teams[hasWinner] : '';
  // create prompt modal
  const addScorePromptModal = generalModalData(message);
  return {
    addScorePlayScore,
    addScorePlayerModal,
    addScorePromptModal,
    addScoreGameWon
  };
};
/**
 * Start new hand, or if the game is over, display the win and give the user UI to end the game
 * @param teams {array} team names
 * @param players {array} player names
 * @param playScore {array} array, by team, of arrays of score rows. See ScorePad component for more information.
 * @param tookBid {number} index into players for which player took the bid
 * @param dealer {number} index into players for who is the dealer
 * @returns {{endHandPromptModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, endHandPlayerModal:
 *          {shown: boolean}, endHandDealer: number, endHandGameState: string, endHandGameWon: string}}
 *          Replacements for gameState, playerModal, promptModal, dealer, and gameWon in the reducer
 */
export const resolveEndHand = (teams, players, playScore, tookBid, dealer) => {
  // game is not over, start new hand
  let endHandGameState = GAME_STATE.MOVE_DECK_TO_DEALER;
  let endHandGameWon = '';
  // clear player modal for now
  let endHandPlayerModal = {shown: false};
  // clear prompt modal for now
  let endHandPromptModal = generalModalData('');
  let message = '';
  const endHandDealer = (dealer + 1) % players.length;
  const scores = [];
  // below loop gets each team's score
  playScore.forEach(teamScore => {
    scores.push(Number(teamScore[teamScore.length -1].score));
  });
  const winners = [];
  let won = -1;
  let highest = 0;
  // below loop figures out who the highest team score is above 120
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
      // if more than one team is above 120, award win to the bid taker
      message = (<span><b>{teams[won]}</b> won by taking the bid.</span>);
    }
  }
  if (won === -1 && winners.length > 0) {
    if (winners.length === 2) {
      // multiple winning teams
      if (winners[0] > winners[1]) {
        // First winning team is higher, they win
        won = winners[0];
      } else if (winners[1] > winners[0]) {
        // Second winning team is higher, they win
        won = winners[1];
      } else {
        // Teams are tied, have to play another hand
        message = 'Tied, play another hand.';
      }
    } else {
      // single winning team, they won
      won = winners[0];
    }
  }
  if (won > -1) {
    // somebody won, display UI for user end the game
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
    // display which team won the game
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