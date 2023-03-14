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
    cut1 = Math.floor(Math.random(1) * 48);
    cut2 = Math.floor(Math.random(1) * 48);
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

export const generatePromptModal = (lines, alignment = 'center') => {
  const lineStyle = {
    textAlign: alignment,
  };
  let displayed;
  if (Array.isArray(lines)) {
    let displayedLines = '';
    lines.forEach(line => {
      displayedLines = `${displayedLines}${line}</br>`;
    });
    displayed = (<div style={lineStyle}>{displayedLines}</div>);
  } else {
    displayed = (<div style={lineStyle}>{lines}</div>);
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
  if (objectType === 'D') {
    returnedCard.xOffset = getRandomRange(-8, 8, 1);
    returnedCard.yOffset = getRandomRange(-8, 8, 1);
    returnedCard.rotation = getRandomRange(-10, 10, 1);
  }
  return returnedCard;
};