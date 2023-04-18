export const KEEP_RANKING = ['K', '10', '9', 'J', 'Q', 'A'];
export const HIGH_TO_LOW = ['A', '10', 'K', 'Q', 'J', '9'];
export const LOW_TO_HIGH = ['9', 'J', 'Q', 'K', '10', 'A'];
export const FULL_SUIT_HIGH_TO_LOW = ['A', 'A', '10', '10', 'K', 'K', 'Q', 'Q', 'J', '10', '9', '9'];
export const COUNTS = ['A', '10', 'K'];
export const HIGHEST_NON_COUNT = ['A', '10', 'K', '9', 'J', 'Q'];
export const BEST_COUNTER = ['A', 'Q', 'J', '9', '10', 'K'];
export const SUITS = ['S', 'H', 'C', 'D'];
export const MELD_SUITS = ['C', 'H', 'S', 'D'];
export const FULL_SUIT_NAMES = {
  'H': 'Hearts',
  'C': 'Clubs',
  'D': 'Diamonds',
  'S': 'Spades',
};
export const MELD_COMBINATIONS = [
  { cards: ['*A','*10','*K','*Q','*J'], value: 15, title: 'Run'},
  { cards: ['*9'], value: 1, title: '9 of Trump'},
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