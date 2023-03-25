import * as actionTypes from './appActionTypes';

export const setCardTableLayout = (width, height, players) => {
  return {
    type: actionTypes.SET_CARD_TABLE_LAYOUT,
    width,
    height,
    players,
  };
};

export const resolveCardMovement = (id, keyId) => {
  return {
    type: actionTypes.RESOLVE_CARD_MOVEMENT,
    id,
    keyId
  };
};

export const storeGameState = (gameState) => {
  return {
    type: actionTypes.STORE_GAME_STATE,
    gameState
  };
}

export const setupForNewGame = () => {
  return {
    type: actionTypes.SETUP_FOR_NEW_GAME,
  };
};

export const throwForAce = () => {
  return {
    type: actionTypes.THROW_FOR_ACE,
  };
};

export const selectedDealer = () => {
  return {
    type: actionTypes.SELECTED_DEALER,
  };
};

export const moveCardsToDealer = () => {
  return {
    type: actionTypes.MOVE_CARD_TO_DEALER,
  };
};

export const preDeal = () => {
  return {
    type: actionTypes.PRE_DEAL,
  }
}
export const dealCards = () => {
  return {
    type: actionTypes.DEAL_CARDS,
  }
};

export const setHandFanOut = (fanOut) => {
  return {
    type: actionTypes.SET_HAND_FAN_OUT,
    fanOut
  };
}

export const checkForNines = () => {
  return {
    type: actionTypes.CHECK_FOR_NINES,
  };
};

export const nextBid = () => {
  return {
    type: actionTypes.NEXT_BID,
  };
}

export const resolveComputerBid = () => {
  return {
    type: actionTypes.RESOLVE_COMPUTER_BID,
  };
};

export const getUserBid = (selection = '') => {
  return {
    type: actionTypes.GET_USER_BID,
    selection
  }
};


export const partnerConfirmNinesRedeal = () => {
  return {
    type: actionTypes.PARTNER_CONFIRM_NINES_REDEAL,
  };
};

export const clearPlayerModal = (hide) => {
  return {
    type: actionTypes.CLEAR_PLAYER_MODAL,
    hide
  };
};

export const clearPromptModal = (hide = true) => {
  return {
    type: actionTypes.CLEAR_PROMPT_MODAL,
    hide
  };
};

export const decideBidWinner = () => {
  return {
    type: actionTypes.DECIDE_BID_WINNER,
  };
};

export const showTheWidow = (widowCardIndex = -1) => {
  return {
    type: actionTypes.SHOW_THE_WIDOW,
    widowCardIndex
  };
};

export const moveWidowToHand = () => {
  return {
    type: actionTypes.MOVE_WIDOW_TO_HAND,
  };
};

export const decideThrowHand = () => {
  return {
    type: actionTypes.DECIDE_THROW_HAND,
  };
};

export const startDiscards = () => {
  return {
    type: actionTypes.START_DISCARDS,
  };
};

export const agreeThrowHand = () => {
  return {
    type: actionTypes.AGREE_THROW_HAND,
  };
};

export const disagreeThrowHand = () => {
  return {
    type: actionTypes.DISAGREE_THROW_HAND,
  };
};

export const throwHand = () => {
  return {
    type: actionTypes.THROW_HAND,
  };
};
