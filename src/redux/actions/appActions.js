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

export const openBidding = () => {
  return {
    type: actionTypes.OPEN_BIDDING,
  };
}

export const resolveComputerBid = () => {
  return {
    type: actionTypes.RESOLVE_COMPUTER_BID,
  };
};
