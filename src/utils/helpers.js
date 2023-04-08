import {Hearts} from "../components/PlayingCard/svg/Hearts";
import {Diamonds} from "../components/PlayingCard/svg/Diamonds";
import {Clubs} from "../components/PlayingCard/svg/Clubs";
import {Spades} from "../components/PlayingCard/svg/Spades";

export const generateShuffledDeck = (shuffles = 1000) => {
  const cards = [];
  const suits = ['H', 'S', 'D', 'C'];
  const values = ['A', '10', 'K', 'Q', 'J', '9'];
  suits.forEach(suit => {
    values.forEach(value => {
      cards.push({ suit, value});
      cards.push({ suit, value});
    });
  });
  let cut1;
  let cut2;
  let holdCard;
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
        if (totalMatches > runs) {
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
          for (let c = 0; c < totalMatches - cardsRequired.length; c++) {
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
  let totalWins = [];
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
      projectedCounts = projectedCounts + (wins * winAdjustment * (isTrump ? 1.5 : 1));
    } else {
      projectedCounts = projectedCounts + 2;
    }
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

export const suitIconSelector = (suit) => {
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
  return suitIcon;
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

export const setValidCardIndexes = (
  hand,
  ledSuit,
  trumpSuit,
  firstPlay,
  ledValue = ''
) => {
  const values = ['9', 'J', 'Q', 'K', '10', 'A'];
  const validHand = [...hand];
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
    validHand.forEach((card, cardIndex) => {
      if (card.suit === validSuit && values.indexOf(card.value) > ledIndex) {
        validIndexes.push(cardIndex);
      }
    });
  }
  if (validIndexes.length === 0) {
    validHand.forEach((card, cardIndex) => {
      if (card.suit === validSuit || validSuit === '') {
        validIndexes.push(cardIndex);
      }
    });
  }
  return validIndexes;
};

export const getUnplayedCards = (validHand, playedCards, widowDiscards) => {
  const cards = generateShuffledDeck(0);
  validHand.forEach(handCard => {
    const foundIndex = cards.findIndex(card => card.suit === handCard.suit && card.value === handCard.value);
    if (foundIndex > -1) {
      cards.splice(foundIndex, 1);
    }
  });
  playedCards.forEach(hand => {
    hand.forEach(playedCard => {
      const foundIndex = cards.findIndex(card => playedCard.suit === card.suit && playedCard.value === card.value);
      if (foundIndex > -1) {
        cards.splice(foundIndex, 1);
      }
    });
  });
  widowDiscards.forEach(widowCard => {
    const foundIndex = cards.findIndex(card => widowCard.suit === card.suit && widowCard.value === card.value);
    if (foundIndex > -1) {
      cards.splice(foundIndex, 1);
    }
  });
  return [...cards];
};

export const getWinningCards = (hands, unplayedCards, offSuits, trumpSuit, tookPlay, firstPlay) => {
  const winners = [];
  const suits = ['H','C','D','S'];
  const values = ['9','J','Q','K','10','A'];
  suits.forEach(suit => {
    if (suit === trumpSuit || !firstPlay) {
      let highUnplayed = -1;
      unplayedCards.forEach(card => {
        if (card.suit === suit) {
          if (values.indexOf(card.value) > highUnplayed) {
            highUnplayed = values.indexOf(card.value);
          }
        }
      });
      let lowestWin = -1;
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

export const getHighestNonCount = (hand, suit, limitToNonCount = false) => {
  const nonCounterValue = ['A', '10', 'K', '9', 'J', 'Q'];
  return getCardValueByArray(hand, suit, nonCounterValue, (limitToNonCount ? 2: -1));
};

export const getLowestNonCount = (hand, suit, limitToNonCount = false) => {
  const lowestCounterValue = ['A', '10', 'K', 'Q', 'J', '9'];
  return getCardValueByArray(hand, suit, lowestCounterValue, (limitToNonCount ? 2: -1));
};
export const getBestCounter = (hand, suit, limitToCount = false) => {
  const counterValue = ['A', 'Q', 'J', '9', '10', 'K'];
  return getCardValueByArray(hand, suit, counterValue, (limitToCount ? 3 : -1));
};

export const getCardValueByArray = (hand, suit, valueArray, arraylimit = -1) => {
  let bestIndex = -1;
  let selectedSuit = '';
  hand.forEach(card => {
    if (card.suit === suit || suit === '') {
      const valueIndex = valueArray.indexOf(card.value);
      if (valueIndex > bestIndex && valueIndex > arraylimit) {
        bestIndex = valueIndex;
        selectedSuit = card.suit;
      }
    }
  });
  return (bestIndex === -1) ? null : {suit: selectedSuit, value: valueArray[bestIndex]};
};

export const getTrumpPullingSuits = (offSuits, trumpSuit, tookPlay) => {
  const pullSuits = [];
  const suits = ['H', 'C', 'D', 'S'];
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

export const getPartnerPassSuits = (offSuits, trumpSuit, tookPlay, unplayedCards, seenCards) => {
  const partner = (tookPlay + 2) % 4;
  const blocker = (tookPlay + 1) % 4;
  const suits = ['H', 'C', 'D', 'S'];
  let passSuits = [];
  let doneChecking = false;
  suits.forEach(suit => {
    if (suit !== trumpSuit && !doneChecking) {
      const remainingValues = unplayedCards.filter(card => card.suit === suit);
      if (remainingValues.length > 0) {
        const suitWinner = `${suit}${remainingValues[0].value}`;
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

export const throwCardIntoMiddle = (state, player, selectedIndex) => {
  const selectedCard = state.hands[player][selectedIndex];
  const sourceCardId = `H${player}${selectedIndex}`;
  const sourceCard = getCardLocation(sourceCardId, state);
  sourceCard.zoom = sourceCard.zoom * 2;
  const targetCardId = `P${player}`;
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
  return newMovingCard;
}