import {Hearts} from '../components/PlayingCard/svg/Hearts';
import {Diamonds} from '../components/PlayingCard/svg/Diamonds';
import {Clubs} from '../components/PlayingCard/svg/Clubs';
import {Spades} from '../components/PlayingCard/svg/Spades';
import * as CARD_ORDER from './cardOrder';

/**
 * create a pinochle deck of card and shuffles it a give amount of times.
 * @param shuffles {number} How many times to shuffle cards. Default is 1000.
 * @returns {*[]} Array of 48 cards with normal pinocle suits of D, H, S, C and values of A, 10, K, Q, J, and 9
 */
export const generateShuffledDeck = (shuffles = 1000) => {
  const cards = [];
  const suits = CARD_ORDER.SUITS;
  const values = CARD_ORDER.HIGH_TO_LOW;
  // below loops create pinocle deck
  suits.forEach(suit => {
    values.forEach(value => {
      cards.push({ suit, value});
      cards.push({ suit, value});
    });
  });
  let cut1;
  let cut2;
  let holdCard;
  // below loop shuffles the deck
  for (let i = 0; i < shuffles; i++) {
    cut1 = Math.floor(Math.random() * 48);
    cut2 = Math.floor(Math.random() * 48);
    if (cut1 !== cut2) {
      holdCard = {suit: cards[cut1].suit, value: cards[cut1].value};
      cards[cut1].value = cards[cut2].value;
      cards[cut1].suit = cards[cut2].suit;
      cards[cut2].value = holdCard.value;
      cards[cut2].suit = holdCard.suit;
    }
  }
  return cards;
};
/**
 * Takes lines of message and props to create props to build a modal component
 * @param lines {array|string|element} The body message displayed by the modal
 * @param props {object} props to overwrite the defaulted props for the modal
 * @returns {{hasCloseButton: boolean, shown: boolean, width: number, header: string, zoom: number,
 *          message: JSX.Element, hasHeaderSeparator: boolean, height: number}}
 *          Returns modal properties to be used to build a modal. See Modal component for more information.
 */
export const generalModalData = (lines, props = {}) => {
  let displayed;
  if (Array.isArray(lines)) {
    let displayedLines = '';
    // below loop creates the modal message if incoming param was an array
    lines.forEach(line => {
      displayedLines = `${displayedLines}${line}</br>`;
    });
    displayed = (<div>{displayedLines}</div>);
  } else {
    // diaplays message as single div if string or html
    displayed = (<div>{lines}</div>);
  }
  return {
    shown: true,
    width: 210,
    height: 140,
    message: displayed,
    zoom: 100,
    hasCloseButton: false,
    header: '',
    hasHeaderSeparator: false,
    ...props
  };
};
/**
 * Gets the global position, zoom, and rotation of the given card
 * @param id {string} Id containing the source and target of the card
 * @param state {object} Pointer to the reducer state
 * @param xAdjust {number} Zoom adjusted left offset of card
 * @param yAdjust {number} Zoom adjusted top offset of card
 * @returns {object} Return the location of the card with the properties:
 *                   x {number} The global left location of the card
 *                   y {number} The global top location of the card
 *                   xOffset {number} Offset on the x-axis from the true card location
 *                   yOffset {number} Offset on the y-axis from the true card location
 *                   rotation {number} rotation of the card. Value values are from 0 to 360.
 *                   zoom {number} Zoom level of the card. 100 is normal.
 */
export const getCardLocation = (id, state, xAdjust = 0, yAdjust = 0) => {
  const threeHandPlayOffsets = [
    {x: 0, y: 150, r: 0},
    {x: -106, y: -106, r: 135},
    {x: 106, y: -106, r:45},
  ];
  const location = {};
  const objectType = id[0];
  const playerIndex = id.length > 1 ? Number(id[1]) : -1;
  let rotation = 0;
  let zoom = 0;
  let xLocation = 0;
  let yLocation = 0;
  let xOffset = 0;
  let yOffset = 0;
  let baseLocation;
  switch(objectType) {
    case 'H':
      baseLocation = state.playerDisplaySettings[playerIndex];
      break;
    case 'D':
      baseLocation = state.discardDisplaySettings[playerIndex];
      break;
    case 'M':
      baseLocation = state.meldDisplaySettings[playerIndex];
      break;
    default:
      baseLocation = state.miscDisplaySettings.playArea;
      if (playerIndex >= 0) {
        if (state.players.length === 3) {
          xOffset = threeHandPlayOffsets[playerIndex].x;
          yOffset = threeHandPlayOffsets[playerIndex].y;
          rotation = threeHandPlayOffsets[playerIndex].r;
        } else {
          xOffset = ((playerIndex === 0) ? 0 : playerIndex - 2) * 150;
          yOffset = ((playerIndex === 3) ? 0 : playerIndex - 1) * -150;
          rotation = playerIndex * 90;
        }
      }
  }
  zoom = baseLocation.zoom;
  xLocation = baseLocation.x + (zoom * xAdjust);
  yLocation = baseLocation.y + (zoom * yAdjust);
  if (objectType !== 'P') {
    rotation = baseLocation.rotation;
  }
  location.x = xLocation + xOffset;
  location.y = yLocation + yOffset;
  location.xOffset = xOffset;
  location.yOffset = yOffset;
  location.rotation = rotation;
  location.zoom = zoom;
  return location;
};
/**
 * Returns a random number between a min and a max value stepped by an amount
 * @param min {number} The minimum possible return value
 * @param max {number} The maximum possible return value
 * @param step {number} The step of the numbers between min and mox
 * @returns {number} The randomized number
 */
export const getRandomRange = (min, max, step) => {
  if (min === max) {
    // if min and max are the same, return min
    return min;
  }
  const range = ((max - min) + 1) * (step / 1);
  let randomNumber = Math.floor(Math.random() * range);
  // safety checks to make sure range is not overstepped
  if (randomNumber < min) { randomNumber = min; }
  if (randomNumber > max) { randomNumber = max; }
  // return final random number
  return (min + (randomNumber * step));
};
/**
 * Creates a card that can be used in a hand or pile from a moving card.
 * @param stoppedCard {object} Has card properties for card to be created. See PlayingCard component for more info.
 * @param objectType {string} The type of container the card is being created for.
 *                            P(pile), M(meld), D(discards), or P(Play Pile) are valid values.
 * @returns {{shown, clickable: boolean, suit, value, rolloverColor: string}} Card object for global usage
 */
export const createLandingCard = (stoppedCard, objectType) => {
  const returnedCard = {
    suit: stoppedCard.suit,
    value: stoppedCard.value,
    shown: stoppedCard.shown,
    clickable: false,
    rolloverColor: '',
  };
  if (objectType === 'P' || objectType === 'M') {
    if (stoppedCard.target.xOffset !== undefined) {
      returnedCard.xOffset = stoppedCard.target.xOffset;
    }
    if (stoppedCard.target.yOffset !== undefined) {
      returnedCard.yOffset = stoppedCard.target.yOffset;
    }
    if (stoppedCard.target.rotation) {
      returnedCard.rotation = stoppedCard.target.rotation;
    }
  }
  if (objectType === 'D' || objectType === 'H') {
    returnedCard.xOffset = getRandomRange(-8, 8, 1);
    returnedCard.yOffset = getRandomRange(-8, 8, 1);
    returnedCard.rotation = getRandomRange(-10, 10, 1);
  }
  returnedCard.frontColor = stoppedCard.frontColor;
  return returnedCard;
};
/**
 * Sorts hand card data by suit and value.
 * @param hand {array} The cards in the hand
 * @returns {array} The hand cards sorted
 */
export const sortCardHand = (hand) => {
  const suitOrder = CARD_ORDER.SUITS;
  const valueOrder = CARD_ORDER.HIGH_TO_LOW;
  const sortedHand = [];
  const cardOrdering = [];
  // below loop creates sorting strings with the index after the delimiter
  hand.forEach((card, index) => {
    cardOrdering.push(`${suitOrder.indexOf(card.suit)}${valueOrder.indexOf(card.value)}:${index}`);
  });
  // sort hand
  cardOrdering.sort();
  let splitOrder;
  // below loop reassembles the hand based on the sorted indexes
  cardOrdering.forEach(order => {
    splitOrder = Number(order.split(':')[1]);
    sortedHand.push(hand[splitOrder]);
  });
  return sortedHand;
};
/**
 * This return meld information about a given hand and trump suit used to calculate hand worth and meld layout
 * @param hand {array} The cards of the hand which meld is going to be decided for
 * @param trump {string} The trump suit for meld calculation
 * @returns {{cardsUsed: *[], textDisplay: string, nearMiss: number, points: number}} Returns an object with properties:
 *          points {number} The point value of the meld in the hand
 *          nearMiss {number} The meld that was almost had (missing one card) for bidding purposes
 *          cardsUsed {array} Which cards in the hand were used to make the meld
 *          textDisplay {array} The text tiles of the different meld found
 */
export const getHandMeld = (hand, trump) => {
  const cardsUsed = [];
  let nearMiss = 0;
  let cardsRequired;
  let runs = 0;
  let textDisplay = '';
  let points = 0;
  let matches = [];
  let meldCards;
  let handCard;
  let totalMatches;
  let displayLine;
  let misses;
  let pinochleIndex = 999;
  // below loop looks for the meld data for a given trump suit
  CARD_ORDER.MELD_COMBINATIONS.forEach((meldCombination, meldIndex) => {
    if (meldCombination.title === 'Pinochle') {
      // If the combination title is Pinochle, set the index and all other combinations after that are marriages
      pinochleIndex = meldIndex;
    }
    const combinationCards = [...meldCombination.cards];
    // Below loop replaces the * with the trump suit for combination calculation
    combinationCards.forEach((card, cardIndex) => {
      combinationCards[cardIndex] = card.replace('*', trump);
    });
    matches = [];
    meldCards = combinationCards.length;
    // below loop builds empty array positions for matching cards
    for (let i = 0; i < meldCards; i ++) {
      matches.push(0);
    }
    // below loop fills in matching cards for the meld
    hand.forEach(card => {
      handCard = `${card.suit}${card.value}`;
      combinationCards.forEach((meldCard, index) => {
        if (meldCard === handCard) {
          matches[index] = matches[index] + 1;
        }
      });
    });
    totalMatches = 2;
    misses = 0;
    // below loop determines the number of matches made of the combination
    matches.forEach(match => {
      if (match === 0) {
        misses++;
      }
      if (match < totalMatches) {
        totalMatches = match;
      }
    });
    if (totalMatches === 0 && misses === 1 && (meldIndex < 6 || meldIndex !== 1)) {
      // calculate near miss value for bidding
      nearMiss = nearMiss + (meldCombination.value * .125);
    }
    if (meldIndex === 0) {
      // store number of runs
      runs = totalMatches;
    }
    if (totalMatches > 0) {
      cardsRequired = [];
      if (meldIndex > pinochleIndex && combinationCards[0][0] === trump) {
        if (totalMatches > runs) {
          // add to meld for a royal marriage or two
          points = points + ((totalMatches - runs) * 4);
          displayLine = (totalMatches - runs > 1)
            ? `2 Royal Marriages in ${CARD_ORDER.FULL_SUIT_NAMES[trump]}`
            : `Royal Marriage in ${CARD_ORDER.FULL_SUIT_NAMES[trump]}`;
          textDisplay = `${textDisplay}<br/>${displayLine}`;
        }
      } else {
        // add to meld for a marriage
        displayLine = (totalMatches > 1) ? `2 ${meldCombination.title}` : meldCombination.title;
        points = points + (totalMatches * meldCombination.value);
        textDisplay = `${textDisplay}<br/>${displayLine}`;
      }
      if (totalMatches > 0) {
        // add to meld for any non-marriage
        combinationCards.forEach(card => {
          cardsRequired = cardsUsed.filter(usedCard => usedCard === card);
          for (let c = 0; c < totalMatches - cardsRequired.length; c++) {
            cardsUsed.push(card);
          }
        });
      }
    }
  });
  // round near miss for bidding
  nearMiss = Math.round(nearMiss);
  return {
    points,
    nearMiss,
    cardsUsed,
    textDisplay
  };
};
/**
 * Returns data on the projected count and strength of the hand for evaluation purposes.
 * @param hand {array} Cards in the hand
 * @param trump {string} Trump suit to be used in the hand
 * @param players {array} player names
 * @param preWidow {boolean} Is this check taking place before the widow is added?
 * @returns {{totalWins: *[], howManyTrump, projectedCounts: (number|number)}} Object for properties:
 *          projectedCounts {number} How many out of the 25 count the hand is projected to get
 *          howManyTrump {number} How many trump cards are in the hand
 *          totalWins {number} Total number of tricks the hand is projected to take
 */
export const getProjectedCount = (hand, trump, players, preWidow = true) => {
  const numPlayers = players.length;
  const winAdjustment = (25 / ((numPlayers === 3) ?  15 : 11));
  const suits = CARD_ORDER.SUITS;
  const valueStrength = CARD_ORDER.HIGH_TO_LOW;
  let isTrump;
  let projectedCounts = 0;
  let lostCounts = 0;
  let howMany
  let wins;
  let losses;
  let whichCards;
  let howManyTrump;
  let totalWins = [];
  // below loop calculates strength of hand for each suit
  suits.forEach(suit => {
    isTrump = (suit === trump);
    wins = 0;
    howMany = 0;
    whichCards = {};
    CARD_ORDER.HIGH_TO_LOW.forEach(value => { whichCards[value] = 0; });
    // below loop gets how many trump cards
    hand.forEach(card => {
      if (suit === card.suit) {
        whichCards[card.value] = whichCards[card.value] + 1;
        howMany++;
      }
    });
    losses = 0;
    if (suit === trump) {
      howManyTrump = howMany;
    }
    if (howMany > 0) {
      // below loop figures out how many winners and losers the suit should have
      valueStrength.forEach((strength, valueIndex) => {
        losses = losses + (2 - whichCards[strength]);
        if (whichCards[strength] > 0 && howMany > losses) {
          wins = wins + whichCards[strength];
          totalWins.push(`${suit}${strength}`);
          if (whichCards[strength] > 1) {
            totalWins.push(`${suit}${strength}`);
          }
        } else {
          if (strength === '10' || strength === 'K') {
            lostCounts = lostCounts + whichCards[strength];
          }
        }
      });
      // Projected counts formula applied
      projectedCounts = projectedCounts + (wins * winAdjustment * (isTrump ? 1.5 : 1));
    } else {
      projectedCounts = projectedCounts + 2;
    }
  })
  if (preWidow) {
    // Pre widow adjustment applied
    lostCounts = lostCounts < numPlayers ? 0 : lostCounts - numPlayers;
  }
  // Project counts formaula applied
  projectedCounts = Math.round(projectedCounts - lostCounts);
  projectedCounts = projectedCounts > 25 ? 25 : projectedCounts;
  return {
    projectedCounts,
    howManyTrump,
    totalWins,
  };
};
/**
 * Calculates the bid for the hand
 * @param hand {array} Card in the player's hand
 * @param players {array} player names
 * @returns {number} The projected high bid
 */
export const getHandBid = (hand, players) => {
  const suits = CARD_ORDER.SUITS;
  let highBid = 0;
  // below loop gets the highest bid trying each suit as trump
  suits.forEach(suit => {
    const { points, nearMiss } = getHandMeld(hand, suit);
    const { projectedCounts } = getProjectedCount(hand, suit, players);
    const currentBid = Math.round((points / 2) + nearMiss + projectedCounts);
    if (currentBid > highBid) {
      highBid = currentBid;
    }
  });
  return highBid;
};
/**
 * Calculates the trump suit to set for the hand
 * @param hand {array} Card in the player's hand
 * @param players {array} player names
 * @returns {string} The trump suit
 */
export const getTrumpSuit = (hand, players) => {
  const suits = CARD_ORDER.SUITS;
  let highSuit = 0;
  let trumpSuit = 'H';
  // below loop figures out the best trump suit by strength of hand
  suits.forEach(suit => {
    const { points } = getHandMeld(hand, suit);
    const { projectedCounts } = getProjectedCount(hand, suit, players, false);
    const currentTotal = Math.round(points + projectedCounts);
    if (currentTotal > highSuit) {
      highSuit = currentTotal;
      trumpSuit = suit;
    }
  });
  return trumpSuit;
};
/**
 * Selects a card from the hand by the index and return the likelihood of winning with the card
 * and the number of total cards in the hand of the same suit
 * @param hand {array} Cards in the hand
 * @param index {number} index into the Cards in the Hand for the card to use
 * @returns {{cardsInSuit: number, winValue: number}} An object with these properties:
 *          winValue {number} Win value of the card (0, 0.5, or 1) for AI usage
 *          cardsInSuit {number} The number of cards in a hand of the suit of the selected hand card
 */
export const getWinValue = (hand, index) => {
  const filterSuit = hand[index].suit;
  const targetValue = hand[index].value;
  const checkHand = [...hand];
  const suitCards = checkHand.filter(check => check.suit === filterSuit);
  const cardsInSuit = suitCards.length;
  const winValues = CARD_ORDER.FULL_SUIT_HIGH_TO_LOW;
  let win = 0;
  let lose = 0;
  let isDone = false;
  // Calculates the individual card win value
  winValues.forEach(winValue => {
    if (!isDone) {
      const matchIndex = suitCards.findIndex(match => match.value === winValue);
      if (matchIndex > -1) {
        win = win + 1;
        suitCards.splice(matchIndex, 1);
      } else {
        lose = lose + 1;
      }
      if (winValue === targetValue) {
        isDone = true;
      }
    }
  });
  // Sets the win value based on the win lose values
  let winValue = 0;
  if (win > lose) { winValue = 1; }
  if (win === lose) { winValue = .5; }
  return {
    winValue,
    cardsInSuit
  };
};
/**
 * Gets the icon for a given suit
 * @param suit {string} The suit to get the icon of. Valid values are H, C, S, D
 * @returns {JSX.Element} The proper suit Component for the suit given.
 */
export const suitIconSelector = (suit) => {
  let suitIcon;
  // switch to pick the proper component
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
  return suitIcon;
};
/**
 * Gets the test formatted icon for the given suit
 * @param suit {string} The suit to get the icon of. Valid values are H, C, S, D
 * @returns {JSX.Element} The proper suit Component for the suit given with formatting to use in text.
 */
export const getFormedSuitIcon = (suit) => {
  let suitIcon = suitIconSelector(suit);
  // icon in-line style
  const iconStyle = {
    width: '24px',
    height: '24px',
    display: 'inline-block',
    margin: '3px'
  };
  return (<div style={iconStyle}>{suitIcon}</div>);
};
/**
 * Returns a formatted header for the prompt modal to show trump suit, player how won bid, and the bid amount.
 * @param trumpSuit {string} The trump suit
 * @param tookBid {number} index into players for the player who took the bid
 * @param bidAmount {number} The amount the bid was taken for
 * @param players {array} player names
 * @returns {{header: JSX.Element, hasHeaderSeparator: boolean}} Returns these properties to be added to modal props:
 *                                                               header {object} Formatted header to display
 *                                                               hasHeaderSeparator {boolean} true to show divider
 */
export const getTrumpBidHeader = (trumpSuit, tookBid, bidAmount, players) => {
  const trumpIcon = getFormedSuitIcon(trumpSuit);
  // trump icon in-line style
  const trumpStyle = {
    width: '34px',
    position: 'absolute',
    left: '3px',
    top: '3px',
  };
  // Player name in-line style
  const userStyle = {
    marginTop: '2px',
    width: 'calc(100% - 24px)',
    textAlign: 'center',
  };
  // Bid amount in-line style
  const bidStyle = {
    position: 'absolute',
    right: '3px',
    top: '3px',
  };
  // construct formatted header
  const line = (
    <div><div style={trumpStyle}>{trumpIcon}</div><div style={userStyle}><b>{players[tookBid]}</b></div><div style={bidStyle}>{bidAmount}</div></div>
  );
  return {
    header: line,
    hasHeaderSeparator: true
  };
};
/**
 * Modal body message to display what player and card led and what player and card is currently winning
 * @param suitLed {string} The suit that was led
 * @param ledValue {string} The value that was led
 * @param suitWin {string} The suit that is the current winning card
 * @param winValue {string} The value this is the current winning card
 * @param players {array} player names
 * @param tookPlay {number} index into players for the player the lead a card
 * @param winningPlayer {number} index into players for the player that is currently winning the trick
 * @returns {JSX.Element} Formatting body message for a modal
 */
export const getHandLeaderMessage = (suitLed, ledValue, suitWin, winValue, players, tookPlay, winningPlayer) => {
  const ledSuit = suitIconSelector(suitLed);
  const winSuit = suitIconSelector(suitWin);
  const suitStyle = {width: 24, display: 'inline-flex'};
  const messageStyle = {display: 'inline-flex'};
  const line1 = (<div style={messageStyle}><b>{players[tookPlay]}</b>&nbsp;leads&nbsp;<b>{ledValue}</b><span style={suitStyle}>{ledSuit}</span></div>);
  const line2 =
    (<div style={messageStyle}><b>{players[winningPlayer]}</b>&nbsp;with&nbsp;<b>{winValue}</b><span style={suitStyle}>{winSuit}</span></div>);
  return (<div>{line1}<br/>{line2}</div>);
}
/**
 * Modal body message to display when a player wins the trick
 * @param suitWin {string} The suit of the card that won the hand
 * @param winValue {string} The value of the card that won the hand
 * @param players {array} player names
 * @param winningPlayer {number} index into players for the trick winning player
 * @returns {JSX.Element}
 */
export const getHandWinMessage = (suitWin, winValue, players, winningPlayer) => {
  const winSuit = suitIconSelector(suitWin);
  const suitStyle = {width: 24, display: 'inline-flex'};
  const messageStyle = {display: 'inline-flex'};
  return (<div style={messageStyle}><b>{players[winningPlayer]}</b>&nbsp;wins&nbsp;<b>{winValue}</b><span style={suitStyle}>{winSuit}</span></div>);
}
/**
 * Return an array with all the indexes of the cards that can be legally played
 * @param hand {array} the cards in the players hand
 * @param ledSuit {string} The suit that was led on this trick
 * @param trumpSuit {string} The trump suit for this hand
 * @param firstPlay {boolean} Is this the first trick of the hand?
 * @param ledValue {string} The value that was led on this trick. Default is '' which means this is led play.
 * @returns {array} All the indexes into the hand of valid cards to be played
 */
export const setValidCardIndexes = (
  hand,
  ledSuit,
  trumpSuit,
  firstPlay,
  ledValue = ''
) => {
  const values = CARD_ORDER.LOW_TO_HIGH;
  const validHand = [...hand];
  // figure out the valid suit to play
  let validSuit = (ledSuit === '' && firstPlay) ? trumpSuit : ledSuit;
  if (validSuit !== '') {
    const matchedSuit = hand.filter(card => card.suit === validSuit);
    if (matchedSuit.length === 0) {
      validSuit = trumpSuit;
      const matchedTrump = hand.filter(card => card.suit === validSuit);
      if (matchedTrump.length === 0) {
        validSuit = '';
      }
    }
  }
  const validIndexes = [];
  if (ledSuit === trumpSuit && validSuit === trumpSuit) {
    const ledIndex = values.indexOf(ledValue);
    // below loop figures out which trump card indexes can be played if trump led (must play higher value if possible)
    validHand.forEach((card, cardIndex) => {
      if (card.suit === validSuit && values.indexOf(card.value) > ledIndex) {
        validIndexes.push(cardIndex);
      }
    });
  }
  if (validIndexes.length === 0) {
    // below loop gets all card indexes that can be played if trump is not led, or no high trump exists
    validHand.forEach((card, cardIndex) => {
      if (card.suit === validSuit || validSuit === '') {
        validIndexes.push(cardIndex);
      }
    });
  }
  return validIndexes;
};
/**
 * Return all cards the player believes have not been played
 * @param validHand {array} Cards in a hand
 * @param playedCards {array} array, by player, of the cards that have been played
 * @param widowDiscards {array} The cards that were discarded after the widow was picked up
 * @returns {array} All of the cards that have not been played, for AI usage
 */
export const getUnplayedCards = (validHand, playedCards, widowDiscards) => {
  // create unshuffled deck to be the base
  const cards = generateShuffledDeck(0);
  // below loop removes all cards in the hand for the unplayed cards
  validHand.forEach(handCard => {
    const foundIndex = cards.findIndex(card => card.suit === handCard.suit && card.value === handCard.value);
    if (foundIndex > -1) {
      cards.splice(foundIndex, 1);
    }
  });
  // below loops removes all played cards from the unplayed cards
  playedCards.forEach(hand => {
    hand.forEach(playedCard => {
      const foundIndex = cards.findIndex(card => playedCard.suit === card.suit && playedCard.value === card.value);
      if (foundIndex > -1) {
        cards.splice(foundIndex, 1);
      }
    });
  });
  // below loop removes the widow discards from the unplayed cards
  widowDiscards.forEach(widowCard => {
    const foundIndex = cards.findIndex(card => widowCard.suit === card.suit && widowCard.value === card.value);
    if (foundIndex > -1) {
      cards.splice(foundIndex, 1);
    }
  });
  // return unplayed cards
  return [...cards];
};
/**
 * Returns all of the cards in the players hand that they expect to win with, for AI usage
 * @param hands {array} array, by player, of the cards in the player's hands
 * @param unplayedCards {array} All the cards believed the be unplayed
 * @param offSuits {array} array, by player, of the suits that a player is known not to have
 * @param trumpSuit {string} The trump suit for the hand
 * @param tookPlay {number} index into players for the player who won the last trick
 * @param firstPlay {boolean} Is this the first trick of the hand?
 * @returns {array} Cards that the player expects to win with, for AI usage
 */
export const getWinningCards = (hands, unplayedCards, offSuits, trumpSuit, tookPlay, firstPlay) => {
  const winners = [];
  const suits = CARD_ORDER.SUITS;
  const values = CARD_ORDER.LOW_TO_HIGH;
  // below loop looks through each suit for winners
  suits.forEach(suit => {
    if (suit === trumpSuit || !firstPlay) {
      let highUnplayed = -1;
      // below loop finds the highest unplayed card value for the suit
      unplayedCards.forEach(card => {
        if (card.suit === suit) {
          if (values.indexOf(card.value) > highUnplayed) {
            highUnplayed = values.indexOf(card.value);
          }
        }
      });
      let lowestWin = -1;
      // below loop finds the lowest card in hand that the player can win with
      hands[tookPlay].forEach(card => {
        if (card.suit === suit) {
          const cardIndex = values.indexOf(card.value);
          if (cardIndex >= highUnplayed) {
            if (lowestWin === -1) {
              lowestWin = cardIndex;
            } else if (cardIndex < lowestWin) {
              lowestWin = cardIndex;
            }
          }
        }
      });
      if (lowestWin > -1) {
        // This code finds winners based on off suits
        let addWinner = true;
        if (suit !== trumpSuit) {
          for(let i = 0; i < hands.length; i++) {
            if (i !== tookPlay) {
              if (offSuits[i].indexOf(suit) > -1) {
                if (offSuits[i].indexOf(trumpSuit) === -1) {
                  addWinner = false;
                }
              }
            }
          }
        }
        if (addWinner) {
          winners.push({suit, value: values[lowestWin]});
        }
      }
    }
  });
  return winners;
};
/**
 * Return the highest non count in a given suit in the hand
 * @param hand {array} Cards in the hand
 * @param suit {string} Suit value
 * @param limitToNonCount {boolean} Only return non-counts. Default is false.
 * @returns {object} Return an object with the suit and value of the selected card.
 */
export const getHighestNonCount = (hand, suit, limitToNonCount = false) => {
  const nonCounterValue = CARD_ORDER.HIGHEST_NON_COUNT;
  return getCardValueByArray(hand, suit, nonCounterValue, (limitToNonCount ? 2: -1));
};
/**
 * Return the lowest non count in a given suit in the hand
 * @param hand {array} Cards in the hand
 * @param suit {string} Suit value
 * @param limitToNonCount {boolean} Only return non-counts. Default is false.
 * @returns {object} Return an object with the suit and value of the selected card.
 */
export const getLowestNonCount = (hand, suit, limitToNonCount = false) => {
  const lowestCounterValue = CARD_ORDER.HIGH_TO_LOW;
  return getCardValueByArray(hand, suit, lowestCounterValue, (limitToNonCount ? 2: -1));
};
/**
 * Return the best counter for a given suit in the hand.
 * @param hand {array} Cards in the hand
 * @param suit {string} Suit value
 * @param limitToCount {boolean} Only return counts. Default is false.
 * @returns {object} Return an object with the suit and value of the selected card.
 */
export const getBestCounter = (hand, suit, limitToCount = false) => {
  const counterValue = CARD_ORDER.BEST_COUNTER;
  return getCardValueByArray(hand, suit, counterValue, (limitToCount ? 3 : -1));
};
/**
 *
 * @param hand {array} Cards in the Hand
 * @param suit {string} Suit Value
 * @param valueArray {array} given card order to select by
 * @param arrayLimit {number} The minimum number that the match index has to be over to be used. -1 is the default.
 * @returns {null|{suit: string, value: *}}
 */
export const getCardValueByArray = (hand, suit, valueArray, arrayLimit = -1) => {
  let bestIndex = -1;
  let selectedSuit = '';
  // below loop finds the card that best matches the suit and is the highest on the value array
  hand.forEach(card => {
    if (card.suit === suit || suit === '') {
      const valueIndex = valueArray.indexOf(card.value);
      if (valueIndex > bestIndex && valueIndex > arrayLimit) {
        bestIndex = valueIndex;
        selectedSuit = card.suit;
      }
    }
  });
  return (bestIndex === -1) ? null : {suit: selectedSuit, value: valueArray[bestIndex]};
};
/**
 * Returns the suits with which the player can pull an unfriendly players trump with
 * @param offSuits {array} array, by player, of the suits that the player is known not to have
 * @param trumpSuit {string} The trump suit for the hand
 * @param tookPlay {number} index into players for the player that won last trick
 * @returns {array} The suits with which a player can pull another players trump with
 */
export const getTrumpPullingSuits = (offSuits, trumpSuit, tookPlay) => {
  const pullSuits = [];
  const suits = CARD_ORDER.SUITS;
  // below loops finds a suit of an unfriendly player that they are out of to pull their trump
  offSuits.forEach((offSuit, player) => {
    if (player !== tookPlay && (offSuits.length === 3 || player !== (tookPlay + 2) % 4 )) {
      suits.forEach(suit => {
        if (suit !== trumpSuit) {
          if (offSuit.indexOf(trumpSuit) === -1 && offSuit.indexOf(suit) > -1) {
            pullSuits.push(suit);
          }
        }
      });
    }
  });
  return pullSuits;
};
/**
 * selects suits to try to pass control to their partner
 * @param offSuits {array} array, by player, of the suits that the player is known not to have
 * @param trumpSuit {string} The trump suit for the hand
 * @param tookPlay {number} index into players for the player that won last trick
 * @param unplayedCards {array} All cards the player believes to be unplayed
 * @param seenCards {array} array, by player, of cards of that player that have been seen on the table
 * @returns {array} The suits with which a player can try to pass to their partner with
 */
export const getPartnerPassSuits = (offSuits, trumpSuit, tookPlay, unplayedCards, seenCards) => {
  const partner = (tookPlay + 2) % 4;
  const blocker = (tookPlay + 1) % 4;
  const suits = CARD_ORDER.SUITS;
  let passSuits = [];
  let doneChecking = false;
  // below loop checks each suit to see if it is likely to get to their partner
  suits.forEach(suit => {
    if (suit !== trumpSuit && !doneChecking) {
      const remainingValues = unplayedCards.filter(card => card.suit === suit);
      if (remainingValues.length > 0) {
        const suitWinner = `${suit}${remainingValues[0].value}`;
        // Makes sure the suit winner has not been previously seend in the blocking player's hand
        if (offSuits[blocker].indexOf(suit) > -1 || seenCards[blocker].indexOf(suitWinner) === -1) {
          if (offSuits[partner].indexOf(suit) === -1) {
            if (seenCards[partner].indexOf(suitWinner) > -1) {
              passSuits = [suit];
              doneChecking = true;
            } else {
              passSuits.push(suit);
            }
          }
        }
      }
    }
  });
  return passSuits;
};
/**
 * Creates a moving card to be targeted to the player area for that player
 * @param state {object} Pointer to reducer state
 * @param player {array} player names
 * @param selectedIndex {nubmer} index of the card in hand to throw
 * @returns {{shown: boolean, keyId: string, id: string, suit, source: {}, value, speed: number, target: {}}}
 *          Return the values required for a moving card
 */
export const throwCardIntoMiddle = (state, player, selectedIndex) => {
  // get selected card
  const selectedCard = state.hands[player][selectedIndex];
  // get the move card source
  const sourceCardId = `H${player}${selectedIndex}`;
  const sourceCard = getCardLocation(sourceCardId, state);
  sourceCard.zoom = sourceCard.zoom * 2;
  // get the move card target
  const targetCardId = `P${player}`;
  const targetCard = getCardLocation(targetCardId, state);
  // create the moving card
  return {
    id: `${sourceCardId}to${targetCardId}`,
    keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
    suit: selectedCard.suit,
    value: selectedCard.value,
    shown: true,
    speed: 1,
    source: sourceCard,
    target: targetCard,
  };
}
/**
 * Figures out if a team won the game.
 * @param playScore {array} array, in teams, of arrays of row score. See ScorePad component for more information.
 * @param tookBid {number} index into players for the player that took the bid
 * @returns {number} The index of the team that won. -1 means no winner.
 */
export const getWinner = (playScore, tookBid) => {
  const scores = [];
  playScore.forEach(teamScore => {
    scores.push(Number(teamScore[teamScore.length -1].score));
  });
  const winners = [];
  let won = -1;
  let highest = 0;
  // loop below gets the team index of all teams
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
  // get winners for over 120 list
  if (won === -1 && winners.length > 0) {
    if (winners.length === 2) {
      if (winners[0] > winners[1]) {
        won = winners[0];
      } else if (winners[1] > winners[0]) {
        won = winners[1];
      }
    } else {
      won = winners[0];
    }
  }
  return won;
};