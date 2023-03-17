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

export const generalModalData = (lines, buttons) => {
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
    header: false,
    hasHeaderSeparator: false,
  };
  return promptModal;
};

export const getCardLocation = (id, state) => {
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
      baseLocation = state.mebDisplaySettings[playerIndex];
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
  xLocation = baseLocation.x;
  yLocation = baseLocation.y;
  zoom = baseLocation.zoom;
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

export const createBidButtons = (bidOffset) => {

};

export const getHandMeb = (hand, trump) => {
  const fullSuit = {
    'H': 'Hearts',
    'C': 'Clubs',
    'D': 'Diamonds',
    'S': 'Spades',
  };
  const mebCombinations = [
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
  let runs = 0;
  let textDisplay = '';
  let points = 0;
  let matches = [];
  let mebCards;
  let handCard;
  let totalMatches;
  let displayLine;
  mebCombinations.forEach((mebCombination, mebIndex) => {
    matches = [];
    mebCards = mebCombination.cards.length;
    for (let i = 0; i < mebCards; i ++) {
      matches.push(0);
    }
    hand.forEach(card => {
      handCard = `${card.suit}${card.value}`;
      mebCombination.cards.forEach((mebCard, index) => {
        if (mebCard === handCard) {
          matches[index] = matches[index] + 1;
        }
      });
    });
    totalMatches =
      Math.floor(matches.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / mebCards);
    if (mebIndex === 0) {
      runs = totalMatches;
    }
    if (totalMatches > 0) {
      if (mebIndex > 6 && mebCombination.cards[0][0] === trump) {
        if (totalMatches - runs > 0) {
          points = points + ((totalMatches - runs) * 4);
          displayLine = (totalMatches - runs > 1)
            ? `2 Royal Marriages in ${fullSuit[trump]}` : `Royal Marriage in ${fullSuit[trump]}`;
          textDisplay = `${textDisplay}<br/>${displayLine}`;
        }

      } else {
        displayLine = (totalMatches > 1) ? `2 ${mebCombination.title}` : mebCombination.title;
        points = points + (totalMatches * mebCombination.value);
        textDisplay = `${textDisplay}<br/>${displayLine}`;
      }
    }
  });
  return {
    points,
    textDisplay
  };
};