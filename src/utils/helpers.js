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
