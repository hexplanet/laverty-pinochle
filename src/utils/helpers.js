import {Hearts} from "../components/PlayingCard/svg/Hearts";
import {Diamonds} from "../components/PlayingCard/svg/Diamonds";
import {Clubs} from "../components/PlayingCard/svg/Clubs";
import {Spades} from "../components/PlayingCard/svg/Spades";

export const generateShuffledDeck = () => {
  const cards = [];
  const suits = ['H', 'S', 'D', 'C'];
  const values = ['9', 'J', 'Q', 'K', '10', 'A'];
  suits.forEach(suit => {
    values.forEach(value => {
      cards.push({ suit, value});
      cards.push({ suit, value});
    });
  });
  let cut1;
  let cut2;
  let holdCard;
  for (let i = 0; i < 1000; i++) {
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

export const generalModalData = (lines, props = {}) => {
  let displayed;
  if (Array.isArray(lines)) {
    let displayedLines = '';
    lines.forEach(line => {
      displayedLines = `${displayedLines}${line}</br>`;
    });
    displayed = (<div>{displayedLines}</div>);
  } else {
    displayed = (<div>{lines}</div>);
  }
  const promptModal = {
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
  return promptModal;
};

export const getCardLocation = (id, state, xAdjust = 0, yAdjust = 0) => {
  // id char(0): H, D, M, P,
  // id char(1): player
  // id char(2+): index
  const threeHandPlayOffsets = [
    {x: 0, y: 150, r: 0},
    {x: -106, y: -106, r: 135},
    {x: 106, y: -106, r:45},
  ];
  const location = {};
  const objectType = id[0];
  const playerIndex = id.length > 1 ? Number(id[1]) : -1;
  const subIndex = id.length > 2 ? Number(id.substring(2)) : -1;
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
        if (state.players === 3) {
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

export const getRandomRange = (min, max, step) => {
  const range = (max - min) * (step / 1);
  const randomNumber = Math.floor(Math.random() * range);
  return (min + (randomNumber * step));
};

export const createLandingCard = (stoppedCard, objectType, playerIndex, subIndex) => {
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
  return returnedCard;
};

export const sortCardHand = (hand) => {
  const suitOrder = ['S', 'H', 'C', 'D'];
  const valueOrder = ['A','10','K','Q','J','9'];
  const sortedHand = [];
  const cardOrdering = [];
  hand.forEach((card, index) => {
    cardOrdering.push(`${suitOrder.indexOf(card.suit)}${valueOrder.indexOf(card.value)}:${index}`);
  });
  cardOrdering.sort();
  let splitOrder;
  cardOrdering.forEach(order => {
    splitOrder = Number(order.split(':')[1]);
    sortedHand.push(hand[splitOrder]);
  });
  return sortedHand;
};
export const getHandMeld = (hand, trump) => {
  const fullSuit = {
    'H': 'Hearts',
    'C': 'Clubs',
    'D': 'Diamonds',
    'S': 'Spades',
  };
  const meldCombinations = [
    { cards: [`${trump}A`,`${trump}10`,`${trump}K`,`${trump}Q`,`${trump}J`], value: 15, title: 'Run'},
    { cards: [`${trump}9`], value: 1, title: '9 of Trump'},
    { cards: ['HA', 'DA', 'SA', 'CA'], value: 10, title: 'Aces'},
    { cards: ['HK', 'DK', 'SK', 'CK'], value: 8, title: 'Kings'},
    { cards: ['HQ', 'DQ', 'SQ', 'CQ'], value: 6, title: 'Queens'},
    { cards: ['HJ', 'DJ', 'SJ', 'CJ'], value: 4, title: 'Jacks'},
    { cards: ['SQ', 'DJ'], value: 4, title: 'Pinochle'},
    { cards: ['HK', 'HQ'], value: 2, title: 'Marriage in Hearts'},
    { cards: ['DK', 'DQ'], value: 2,title: 'Marriage in Diamonds'},
    { cards: ['CK', 'CQ'], value: 2,title: 'Marriage in Clubs'},
    { cards: ['SK', 'SQ'], value: 2,title: 'Marriage in Spades'},
  ];
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
  meldCombinations.forEach((meldCombination, meldIndex) => {
    matches = [];
    meldCards = meldCombination.cards.length;
    for (let i = 0; i < meldCards; i ++) {
      matches.push(0);
    }
    hand.forEach(card => {
      handCard = `${card.suit}${card.value}`;
      meldCombination.cards.forEach((meldCard, index) => {
        if (meldCard === handCard) {
          matches[index] = matches[index] + 1;
        }
      });
    });
    totalMatches = 2;
    misses = 0;
    matches.forEach(match => {
      if (match === 0) {
        misses++;
      }
      if (match < totalMatches) {
        totalMatches = match;
      }
    });
    if (totalMatches === 0 && misses === 1 && (meldIndex < 6 || meldIndex !== 1)) {
      nearMiss = nearMiss + (meldCombination.value * .125);
    }
    if (meldIndex === 0) {
      runs = totalMatches;
    }
    if (totalMatches > 0) {
      cardsRequired = [];
      if (meldIndex > 6 && meldCombination.cards[0][0] === trump) {
        totalMatches = totalMatches - runs;
        if (totalMatches > 0) {
          points = points + ((totalMatches - runs) * 4);
          displayLine = (totalMatches - runs > 1)
            ? `2 Royal Marriages in ${fullSuit[trump]}` : `Royal Marriage in ${fullSuit[trump]}`;
          textDisplay = `${textDisplay}<br/>${displayLine}`;
        }
      } else {
        displayLine = (totalMatches > 1) ? `2 ${meldCombination.title}` : meldCombination.title;
        points = points + (totalMatches * meldCombination.value);
        textDisplay = `${textDisplay}<br/>${displayLine}`;
      }
      if (totalMatches > 0) {
        meldCombination.cards.forEach(card => {
          cardsRequired = cardsUsed.filter(usedCard => usedCard === card);
          for (let c = 0; c < totalMatches - cardsRequired; c++) {
            cardsUsed.push(card);
          }
        });
      }
    }
  });
  nearMiss = Math.round(nearMiss);
  return {
    points,
    nearMiss,
    cardsUsed,
    textDisplay
  };
};

export const getProjectedCount = (hand, trump, players, preWidow = true) => {
  const numPlayers = players.length;
  const winAdjustment = (25 / ((numPlayers === 3) ?  15 : 11));
  const suits = ['H', 'C', 'D', 'S'];
  const valueStrength = ['A','10','K','Q','J','9'];
  let isTrump;
  let projectedCounts = 0;
  let lostCounts = 0;
  let howMany
  let wins;
  let losses;
  let whichCards;
  let howManyTrump;
  let totalWins = 0;
  suits.forEach(suit => {
    isTrump = (suit === trump);
    wins = 0;
    howMany = 0;
    whichCards = {'A': 0, '10': 0, 'K': 0, 'Q': 0, 'J': 0, '9': 0};
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
      valueStrength.forEach((strength, valueIndex) => {
        losses = losses + (2 - whichCards[strength]);
        if (whichCards[strength] > 0 && howMany > losses) {
          wins = wins + whichCards[strength];
        } else {
          if (strength === '10' || strength === 'K') {
            lostCounts = lostCounts + whichCards[strength];
          }
        }
      });
      projectedCounts = projectedCounts + (wins * winAdjustment * (isTrump ? 1.5 : 1));
    } else {
      projectedCounts = projectedCounts + 2;
    }
    totalWins = totalWins + wins;
  })
  if (preWidow) {
    lostCounts = lostCounts < numPlayers ? 0 : lostCounts - numPlayers;
  }
  projectedCounts = Math.round(projectedCounts - lostCounts);
  projectedCounts = projectedCounts > 25 ? 25 : projectedCounts;
  return {
    projectedCounts,
    howManyTrump,
    totalWins,
  };
};

export const getHandBid = (hand, players) => {
  const suits = ['S','D','C','H']
  let highBid = 0;
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

export const getTrumpSuit = (hand, players) => {
  const suits = ['S','D','C','H']
  let highSuit = 0;
  let trumpSuit = 'H';
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

export const getWinValue = (hand, index) => {
  const filterSuit = hand[index].suit;
  const targetValue = hand[index].value;
  const checkHand = [...hand];
  const suitCards = checkHand.filter(check => check.suit === filterSuit);
  const cardsInSuit = suitCards.length;
  const winValues = ['A', 'A', '10', '10', 'K', 'K', 'Q', 'Q', 'J', '10', '9', '9'];
  let win = 0;
  let lose = 0;
  let isDone = false;
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
  let winValue = 0;
  if (win > lose) { winValue = 1; }
  if (win === lose) { winValue = .5; }
  return {
    winValue,
    cardsInSuit
  };
};

export const getFormedSuitIcon = (suit) => {
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
  const iconStyle = {
    width: '24px',
    height: '24px',
    display: 'inline-block',
    margin: '3px'
  };
  return (<div style={iconStyle}>{suitIcon}</div>);
};

export const getTrumpBidHeader = (trumpSuit, tookBid, bidAmount, players) => {
  const trumpIcon = getFormedSuitIcon(trumpSuit);
  const trumpStyle = {
    width: '34px',
    position: 'absolute',
    left: '3px',
    top: '3px',
  };
  const userStyle = {
    marginTop: '2px',
    width: 'calc(100% - 24px)',
    textAlign: 'center',
  };
  const bidStyle = {
    position: 'absolute',
    right: '3px',
    top: '3px',
  };
  const line = (
    <div><div style={trumpStyle}>{trumpIcon}</div><div style={userStyle}><b>{players[tookBid]}</b></div><div style={bidStyle}>{bidAmount}</div></div>
  );
  return {
    header: line,
    hasHeaderSeparator: true
  };
};