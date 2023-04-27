import * as gameActions from './gameActions';
import * as actionTypes from './gameActionTypes';

describe('gameActions', () => {
  test('setCardTableLayout', () => { expect(gameActions.setCardTableLayout(12,34)).toEqual({
    type: actionTypes.SET_CARD_TABLE_LAYOUT,
    width: 12,
    height: 34
  })});
  test('resolveCardMovement', () => { expect(gameActions.resolveCardMovement('key','keyId')).toEqual({
    type: actionTypes.RESOLVE_CARD_MOVEMENT,
    id: 'key',
    keyId: 'keyId'
  })});
  test('storeGameState', () => { expect(gameActions.storeGameState('gameState')).toEqual({
    type: actionTypes.STORE_GAME_STATE,
    gameState: 'gameState'
  })});
  test('setupForNewGame', () => { expect(gameActions.setupForNewGame()).toEqual({
    type: actionTypes.SETUP_FOR_NEW_GAME
  })});
  test('throwForAce', () => { expect(gameActions.throwForAce()).toEqual({
    type: actionTypes.THROW_FOR_ACE
  })});
  test('selectedDealer', () => { expect(gameActions.selectedDealer()).toEqual({
    type: actionTypes.SELECTED_DEALER
  })});
  test('moveCardsToDealer', () => { expect(gameActions.moveCardsToDealer()).toEqual({
    type: actionTypes.MOVE_CARD_TO_DEALER
  })});
  test('preDeal', () => { expect(gameActions.preDeal()).toEqual({
    type: actionTypes.PRE_DEAL
  })});
  test('dealCards', () => { expect(gameActions.dealCards()).toEqual({
    type: actionTypes.DEAL_CARDS
  })});
  test('setHandFanOut', () => { expect(gameActions.setHandFanOut(3)).toEqual({
    type: actionTypes.SET_HAND_FAN_OUT,
    fanOut: 3
  })});
  test('checkForNines', () => { expect(gameActions.checkForNines()).toEqual({
    type: actionTypes.CHECK_FOR_NINES
  })});
  test('nextBid', () => { expect(gameActions.nextBid()).toEqual({
    type: actionTypes.NEXT_BID
  })});
  test('resolveComputerBid', () => { expect(gameActions.resolveComputerBid()).toEqual({
    type: actionTypes.RESOLVE_COMPUTER_BID
  })});
  test('getUserBid', () => { expect(gameActions.getUserBid('bid_31')).toEqual({
    type: actionTypes.GET_USER_BID,
    selection: 'bid_31'
  })});
  test('partnerConfirmNinesRedeal', () => { expect(gameActions.partnerConfirmNinesRedeal()).toEqual({
    type: actionTypes.PARTNER_CONFIRM_NINES_REDEAL
  })});
  test('clearPlayerModal hidden', () => { expect(gameActions.clearPlayerModal()).toEqual({
    type: actionTypes.CLEAR_PLAYER_MODAL,
    hide: undefined
  })});
  test('clearPlayerModal shown', () => { expect(gameActions.clearPlayerModal(false)).toEqual({
    type: actionTypes.CLEAR_PLAYER_MODAL,
    hide: false
  })});
  test('clearPromptModal', () => { expect(gameActions.clearPromptModal()).toEqual({
    type: actionTypes.CLEAR_PROMPT_MODAL,
    hide: true
  })});
  test('clearPromptModal hidden', () => { expect(gameActions.clearPromptModal(false)).toEqual({
    type: actionTypes.CLEAR_PROMPT_MODAL,
    hide: false
  })});
  test('decideBidWinner', () => { expect(gameActions.decideBidWinner()).toEqual({
    type: actionTypes.DECIDE_BID_WINNER
  })});
  test('showTheWidow', () => { expect(gameActions.showTheWidow(2)).toEqual({
    type: actionTypes.SHOW_THE_WIDOW,
    widowCardIndex: 2
  })});
  test('moveWidowToHand', () => { expect(gameActions.moveWidowToHand()).toEqual({
    type: actionTypes.MOVE_WIDOW_TO_HAND
  })});
  test('decideThrowHand', () => { expect(gameActions.decideThrowHand()).toEqual({
    type: actionTypes.DECIDE_THROW_HAND
  })});
  test('startDiscards', () => { expect(gameActions.startDiscards()).toEqual({
    type: actionTypes.START_DISCARDS
  })});
  test('agreeThrowHand', () => { expect(gameActions.agreeThrowHand()).toEqual({
    type: actionTypes.AGREE_THROW_HAND
  })});
  test('disagreeThrowHand', () => { expect(gameActions.disagreeThrowHand()).toEqual({
    type: actionTypes.DISAGREE_THROW_HAND
  })});
  test('throwHand', () => { expect(gameActions.throwHand()).toEqual({
    type: actionTypes.THROW_HAND
  })});
  test('userSelectDiscard', () => { expect(gameActions.userSelectDiscard(3)).toEqual({
    type: actionTypes.USER_SELECT_DISCARD,
    index: 3
  })});
  test('removeUserDiscards', () => { expect(gameActions.removeUserDiscards()).toEqual({
    type: actionTypes.REMOVE_USER_DISCARDS
  })});
  test('computerDiscards', () => { expect(gameActions.computerDiscards()).toEqual({
    type: actionTypes.COMPUTER_DISCARDS
  })});
  test('declareTrumpSuit', () => { expect(gameActions.declareTrumpSuit()).toEqual({
    type: actionTypes.DECLARE_TRUMP_SUIT
  })});
  test('setTrumpSuit', () => { expect(gameActions.setTrumpSuit('S')).toEqual({
    type: actionTypes.SET_TRUMP_SUIT,
    suit: 'S'
  })});
  test('startMeld', () => { expect(gameActions.startMeld()).toEqual({
    type: actionTypes.START_MELD
  })});
  test('displayMeld', () => { expect(gameActions.displayMeld()).toEqual({
    type: actionTypes.DISPLAY_MELD
  })});
  test('nextMeld', () => { expect(gameActions.nextMeld()).toEqual({
    type: actionTypes.NEXT_MELD
  })});
  test('startGamePlay', () => { expect(gameActions.startGamePlay()).toEqual({
    type: actionTypes.START_GAME_PLAY
  })});
  test('playLead', () => { expect(gameActions.playLead()).toEqual({
    type: actionTypes.PLAY_LEAD
  })});
  test('playFollow', () => { expect(gameActions.playFollow()).toEqual({
    type: actionTypes.PLAY_FOLLOW
  })});
  test('userSelectPlay', () => { expect(gameActions.userSelectPlay(4)).toEqual({
    type: actionTypes.USER_PLAY,
    cardIndex: 4
  })});
  test('resolvePlay', () => { expect(gameActions.resolvePlay()).toEqual({
    type: actionTypes.RESOLVE_PLAY
  })});
  test('movePlayPileToDiscard', () => { expect(gameActions.movePlayPileToDiscard()).toEqual({
    type: actionTypes.MOVE_PLAY_PILE_TO_DISCARD
  })});
  test('startNextPlay', () => { expect(gameActions.startNextPlay()).toEqual({
    type: actionTypes.START_NEXT_PLAY
  })});
  test('tallyCounts', () => { expect(gameActions.tallyCounts()).toEqual({
    type: actionTypes.TALLY_COUNTS
  })});
  test('addCountToTally', () => { expect(gameActions.addCountToTally()).toEqual({
    type: actionTypes.ADD_COUNT_TO_TALLY
  })});
  test('addCountToScore', () => { expect(gameActions.addCountToScore()).toEqual({
    type: actionTypes.ADD_COUNT_TO_SCORE
  })});
  test('endHand', () => { expect(gameActions.endHand()).toEqual({
    type: actionTypes.END_HAND
  })});
  test('moveRestToDiscard', () => { expect(gameActions.moveRestToDiscard()).toEqual({
    type: actionTypes.MOVE_REST_TO_DISCARD
  })});
});



