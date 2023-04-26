import * as actionTypes from './gameActionTypes';

/**
 * Returns action to set up the card table positions
 * @param width {number} Width of the browser display
 * @param height {number} Height of the browser display
 * @returns {{players, width, type: string, height}} The action with data
 */
export const setCardTableLayout = (width, height) => {
  return {
    type: actionTypes.SET_CARD_TABLE_LAYOUT,
    width,
    height
  };
};
/**
 * Returns action to place moved card in the proper container
 * @param id {string} Id of the card that states source and target codes
 * @param keyId {string} Unique keyId of the card for identification
 * @returns {{keyId, id, type: string}} The action with data
 */
export const resolveCardMovement = (id, keyId) => {
  return {
    type: actionTypes.RESOLVE_CARD_MOVEMENT,
    id,
    keyId
  };
};
/**
 * Sets the gameState in gameReducer
 * @param gameState {string} New value fot the gameState
 * @returns {{type: string, gameState}} The action with its data
 */
export const storeGameState = (gameState) => {
  return {
    type: actionTypes.STORE_GAME_STATE,
    gameState
  };
}
/**
 * Inits all data for a new game
 * @returns {{type: string}} The action
 */
export const setupForNewGame = () => {
  return {
    type: actionTypes.SETUP_FOR_NEW_GAME,
  };
};
/**
 * Throw for ace action
 * @returns {{type: string}} The action
 */
export const throwForAce = () => {
  return {
    type: actionTypes.THROW_FOR_ACE,
  };
};
/**
 * Selected Dealer action
 * @returns {{type: string}} The action
 */
export const selectedDealer = () => {
  return {
    type: actionTypes.SELECTED_DEALER,
  };
};
/**
 * Move all cards to dealer action
 * @returns {{type: string}} The action
 */
export const moveCardsToDealer = () => {
  return {
    type: actionTypes.MOVE_CARD_TO_DEALER,
  };
};
/**
 * Pre deal set up action
 * @returns {{type: string}} The action
 */
export const preDeal = () => {
  return {
    type: actionTypes.PRE_DEAL,
  }
}
/**
 * Deal cards action
 * @returns {{type: string}} The action
 */
export const dealCards = () => {
  return {
    type: actionTypes.DEAL_CARDS,
  }
};
/**
 * Fan out cards in hand action
 * @param fanOut {number} Degress of fan out for the hands. -1 is no fan out.
 * @returns {{fanOut, type: string}} The action with data
 */
export const setHandFanOut = (fanOut) => {
  return {
    type: actionTypes.SET_HAND_FAN_OUT,
    fanOut
  };
}
/**
 * Check for Nines action
 * @returns {{type: string}} The action
 */
export const checkForNines = () => {
  return {
    type: actionTypes.CHECK_FOR_NINES,
  };
};
/**
 * Start next bid action
 * @returns {{type: string}} The action
 */
export const nextBid = () => {
  return {
    type: actionTypes.NEXT_BID,
  };
}
/**
 * Resolving of the computer bid action
 * @returns {{type: string}} The action
 */
export const resolveComputerBid = () => {
  return {
    type: actionTypes.RESOLVE_COMPUTER_BID,
  };
};
/**
 * User bid selection action with amount.
 * @param selection {string} left and right are scroll directions. 0 is pass and numbers greater than 19 are the bid.
 * @returns {{selection: string, type: string}} The action with data
 */
export const getUserBid = (selection = '') => {
  return {
    type: actionTypes.GET_USER_BID,
    selection
  }
};
/**
 * Start partner confimation of nines redeal action
 * @returns {{type: string}} The action
 */
export const partnerConfirmNinesRedeal = () => {
  return {
    type: actionTypes.PARTNER_CONFIRM_NINES_REDEAL,
  };
};
/**
 * Action to clear the player modal with a hiding option
 * @param hide {boolean} Is the player modal hidden?
 * @returns {{hide, type: string}} The action with data
 */
export const clearPlayerModal = (hide) => {
  return {
    type: actionTypes.CLEAR_PLAYER_MODAL,
    hide
  };
};
/**
 * Action to clear the prompt modal with a hiding option
 * @param hide {boolean} Is the prompt modal hidden?
 * @returns {{hide: boolean, type: string}} The action with data
 */
export const clearPromptModal = (hide = true) => {
  return {
    type: actionTypes.CLEAR_PROMPT_MODAL,
    hide
  };
};
/**
 * Action to decide bid winner
 * @returns {{type: string}} The action
 */
export const decideBidWinner = () => {
  return {
    type: actionTypes.DECIDE_BID_WINNER,
  };
};
/**
 * Action to display a widow card
 * @param widowCardIndex {number} Index of widow card to display. If value is -1, widow is done displaying.
 * @returns {{type: string, widowCardIndex: number}} The action with data
 */
export const showTheWidow = (widowCardIndex = -1) => {
  return {
    type: actionTypes.SHOW_THE_WIDOW,
    widowCardIndex
  };
};
/**
 * Action to move the widow cards to the bid winners hand
 * @returns {{type: string}} The action
 */
export const moveWidowToHand = () => {
  return {
    type: actionTypes.MOVE_WIDOW_TO_HAND,
  };
};
/**
 * Action to decide to throw the hand
 * @returns {{type: string}} The action
 */
export const decideThrowHand = () => {
  return {
    type: actionTypes.DECIDE_THROW_HAND,
  };
};
/**
 * Action to start discards phase
 * @returns {{type: string}} The action
 */
export const startDiscards = () => {
  return {
    type: actionTypes.START_DISCARDS,
  };
};
/**
 * Action to agree to throw the hand
 * @returns {{type: string}} The action
 */
export const agreeThrowHand = () => {
  return {
    type: actionTypes.AGREE_THROW_HAND,
  };
};
/**
 * Action to disagree to throw the hand
 * @returns {{type: string}} The action
 */
export const disagreeThrowHand = () => {
  return {
    type: actionTypes.DISAGREE_THROW_HAND,
  };
};
/**
 * Action to throw the hand
 * @returns {{type: string}} The action
 */
export const throwHand = () => {
  return {
    type: actionTypes.THROW_HAND,
  };
};
/**
 * Action to select card for discard by user
 * @param index {number} The index of the card within the user's hand
 * @returns {{index, type: string}} The action with data
 */
export const userSelectDiscard = (index) => {
  return {
    type: actionTypes.USER_SELECT_DISCARD,
    index
  };
};
/**
 * Action to remove the user discards to the discard pile
 * @returns {{type: string}} The action
 */
export const removeUserDiscards = () => {
  return {
    type: actionTypes.REMOVE_USER_DISCARDS,
  };
};
/**
 * Action to do computer discards
 * @returns {{type: string}} The action
 */
export const computerDiscards = () => {
  return {
    type: actionTypes.COMPUTER_DISCARDS,
  };
}
/**
 * Action to start declaration of the trump suit
 * @returns {{type: string}} The action
 */
export const declareTrumpSuit = () => {
  return {
    type: actionTypes.DECLARE_TRUMP_SUIT,
  };
};
/**
 * An action that sets the trump suit
 * @param suit {string} The trump suit selected. Valid values are H, S, D, C.
 * @returns {{suit, type: string}} The action with data
 */
export const setTrumpSuit = (suit) => {
  return {
    type: actionTypes.SET_TRUMP_SUIT,
    suit
  };
};
/**
 * Action to init meld display
 * @returns {{type: string}} The action
 */
export const startMeld = () => {
  return {
    type: actionTypes.START_MELD
  };
};
/**
 * Action to display meld
 * @returns {{type: string}} The action
 */
export const displayMeld = () => {
  return {
    type: actionTypes.DISPLAY_MELD
  };
};
/**
 * Action to move to the next player to display meld
 * @returns {{type: string}} The action
 */
export const nextMeld = () => {
  return {
    type: actionTypes.NEXT_MELD
  };
};
/**
 * Action to start the game play phase
 * @returns {{type: string}} The action
 */
export const startGamePlay = () => {
  return {
    type: actionTypes.START_GAME_PLAY
  };
};
/**
 * Action to trigger the lead play of the trick
 * @returns {{type: string}} The action
 */
export const playLead = () => {
  return {
    type: actionTypes.PLAY_LEAD
  };
};
/**
 * Action to trigger the follow plays of the trick
 * @returns {{type: string}} The action
 */
export const playFollow = () => {
  return {
    type: actionTypes.PLAY_FOLLOW
  };
};
/**
 * Action to give the user selected card for game play
 * @param cardIndex {number} The index of the card in the users hand
 * @returns {{type: string, cardIndex}} The action with data
 */
export const userSelectPlay = (cardIndex) => {
  return {
    type: actionTypes.USER_PLAY,
    cardIndex
  };
};
/**
 * Action to resolve the trick
 * @returns {{type: string}} The action
 */
export const resolvePlay = () => {
  return {
    type: actionTypes.RESOLVE_PLAY
  };
};
/**
 * Action to move the cards in the play pile to the winning team's discard pile
 * @returns {{type: string}} The action
 */
export const movePlayPileToDiscard = () => {
  return {
    type: actionTypes.MOVE_PLAY_PILE_TO_DISCARD
  };
};
/**
 * Action to start the play of the next trick
 * @returns {{type: string}} The action
 */
export const startNextPlay = () => {
  return {
    type: actionTypes.START_NEXT_PLAY
  };
};
/**
 * Action to tally all count cards at the end of game play
 * @returns {{type: string}} The action
 */
export const tallyCounts = () => {
  return {
    type: actionTypes.TALLY_COUNTS
  };
};
/**
 * Action to add the tallied count cards to the teams scores
 * @returns {{type: string}} The action
 */
export const addCountToTally = () => {
  return {
    type: actionTypes.ADD_COUNT_TO_TALLY
  };
};
/**
 * Action to add the count scores to the score pad
 * @returns {{type: string}} The action
 */
export const addCountToScore = () => {
  return {
    type: actionTypes.ADD_COUNT_TO_SCORE
  };
};
/**
 * Action to end the hand
 * @returns {{type: string}} The action
 */
export const endHand = () => {
  return {
    type: actionTypes.END_HAND
  };
};
/**
 * Action to move the rest of the cards in all hands to the winners discard pile
 * @returns {{type: string}} The action
 */
export const moveRestToDiscard = () => {
  return {
    type: actionTypes.MOVE_REST_TO_DISCARD
  };
}