import {
  generateShuffledDeck,
  generalModalData,
  getCardLocation,
  getRandomRange,
  createLandingCard,
  sortCardHand,
  getHandBid,
} from '../../utils/helpers';
import * as GAME_STATE from '../../utils/gameStates';

/**
 * Returns the location of the game components based on width, height, and number of players.
 * Also, determines what the overall zoom ratio of the game should be and returns that.
 * @param width {number} The width of the browser display area
 * @param height {number} The height of the browser display area
 * @param players (array) The players in the game, used for the length to get type of game
 * @returns {{playerHandLocations: *[], miscLocations: {}, playerMeldLocations: *[],
 *          zoomRatio: number, playerDiscardLocations: *[]}} Return screen locations and global zoom ratio
 */
export const playerDisplaySettingsLogic = (width, height, players) => {
  const playerHandLocations = [];
  const playerDiscardLocations = [];
  const playerMeldLocations = [];
  const miscLocations = {};
  // Generate the global zoom ratio
  const ratio = (width < height ? width : height) / 1250;
  const zoomFactor = ratio * 100;
  // Hand Location for the user
  playerHandLocations.push({
    x: width / 2,
    y: height - (135 * ratio),
    zoom: zoomFactor,
    rotation: 0,
  });
  // Discard pile locations for the user
  playerDiscardLocations.push({
    x: (width / 2) - (415 * ratio),
    y: height - (80 * ratio),
    zoom: zoomFactor * .75,
    rotation: 0,
  });
  // Meld pile locations for the user
  playerMeldLocations.push({
    x: width / 2,
    y: height - (270 * ratio),
    zoom: zoomFactor * .75,
    rotation: 0,
  });
  if (players === 3) {
    // Hand location for the 3 handed NW computer player
    playerHandLocations.push({
      x: 320 * ratio,
      y: 320 * ratio,
      zoom: zoomFactor,
      rotation: 135,
    });
    // Discard pile location for the 3 handed NW computer player
    playerDiscardLocations.push({
      x: 160 * ratio,
      y: 160 * ratio,
      zoom: zoomFactor * .75,
      rotation: 315,
    });
    // Meld pile location for the 3 handed NW computer player
    playerMeldLocations.push({
      x: 200 * ratio,
      y: 600 * ratio,
      zoom: zoomFactor * .75,
      rotation: 135,
    });
    // Hand location for the 3 handed NE computer player
    playerHandLocations.push({
      x: width - (320 * ratio),
      y: 320 * ratio,
      zoom: zoomFactor,
      rotation: 225,
    });
    // Discard pile location for the 3 handed NE computer player
    playerDiscardLocations.push({
      x: width - (160 * ratio),
      y: 160 * ratio,
      zoom: zoomFactor * .75,
      rotation: 45,
    });
    // Meld pile location for the 3 handed NE computer player
    playerMeldLocations.push({
      x: width - (200 * ratio),
      y: 600 * ratio,
      zoom: zoomFactor * .75,
      rotation: 225,
    });
  }
  if (players === 4) {
    // Hand location for the 4 handed W computer player
    playerHandLocations.push({
      x: 135 * ratio,
      y: height / 2,
      zoom: zoomFactor,
      rotation: 90,
    });
    // Discard pile location for the 4 handed W computer player
    playerDiscardLocations.push({
      x: 100 * ratio,
      y: (height / 2) - (415 * ratio),
      zoom: zoomFactor * .75,
      rotation: 270,
    });
    // Meld pile location for the 4 handed W computer player
    playerMeldLocations.push({
      x: (270 * ratio),
      y: height / 2,
      zoom: zoomFactor * .75,
      rotation: 90,
    });
    // Hand location for the 4 handed N computer player
    playerHandLocations.push({
      x: width / 2,
      y: 135 * ratio,
      zoom: zoomFactor,
      rotation: 180,
    });
    // Discard pile location for the 4 handed N computer player
    playerDiscardLocations.push({
      x: (width / 2) + (415 * ratio),
      y: 100 * ratio,
      zoom: zoomFactor * .75,
      rotation: 0,
    });
    // Meld pile location for the 4 handed N computer player
    playerMeldLocations.push({
      x: width / 2,
      y: 270 * ratio,
      zoom: zoomFactor * .75,
      rotation: 180,
    });
    // Hand location for the 4 handed E computer player
    playerHandLocations.push({
      x: width - (135 * ratio),
      y: height / 2,
      zoom: zoomFactor,
      rotation: 270,
    });
    // Discard pile location for the 4 handed E computer player
    playerDiscardLocations.push({
      x: width - (80 * ratio),
      y: (height / 2) + (415 * ratio),
      zoom: zoomFactor * .75,
      rotation: 270,
    });
    // Meld pile location for the 4 handed E computer player
    playerMeldLocations.push({
      x: width - (270 * ratio),
      y: height / 2,
      zoom: zoomFactor * .75,
      rotation: 270,
    });
  }
  // Score Pad location
  miscLocations.scorePad = {
    x: 85 * ratio,
    y: height - (110 * ratio),
    zoom: zoomFactor * .25,
  };
  // Play Pile location
  miscLocations.playArea = {
    x: width / 2,
    y: height / 2,
    zoom: zoomFactor * .75,
  };
  // Player modal location
  miscLocations.playerModal = {
    x: width / 2,
    y: height - (70 * ratio),
    zoom: zoomFactor,
  };
  // Prompt modal location
  miscLocations.promptModal = {
    x: width - (120 * ratio),
    y: height - (90 * ratio),
    zoom: zoomFactor,
  };
  let newBidLocations = [];
  let newBidLocation;
  // below loop calculates the locations for the bid modals
  for(let i = 0; i < players; i++) {
    if (players === 4) {
      newBidLocation = { x: width / 2, y: height / 2, zoom: zoomFactor };
      if (i % 2 === 0) {
        newBidLocation.y = (i === 0) ? height - (135 * ratio) : (52 * ratio);
      } else {
        newBidLocation.x = (i === 3) ? width - (52 * ratio) : (44 * ratio);
      }
      newBidLocations = [...newBidLocations, newBidLocation];
    } else {
      newBidLocation = { x: width / 2, y: (110 * ratio), zoom: zoomFactor };
      switch (i) {
        case 1:
          newBidLocation.x = (110 * ratio);
          break;
        case 2:
          newBidLocation.x = width - (110 * ratio);
          break;
        default:
          newBidLocation.y = height - (135 * ratio);
      }
      newBidLocations = [...newBidLocations, newBidLocation];
    }
  }
  miscLocations.gameBidModals = newBidLocations;
  return {
    playerHandLocations,
    playerDiscardLocations,
    playerMeldLocations,
    miscLocations,
    zoomRatio: ratio,
  };
};
/**
 * This takes a card that has stopped moving and adds it the target container and then deletes it from moving cards
 * @param id {string} This is the card id that contains the target container
 * @param keyId {string} This is the unique keyId used to select the moving cards
 * @param movingCards {array} reducer movingCards array
 * @param hands {array} reducer hands array
 * @param melds {array} reducer melds array
 * @param discardPiles {array} reducer discardPiles array
 * @param playPile reducer playPile array
 * @returns {{}} This is an object with all modified arrays that will overwrite the reducer
 */
export const resolveCardMovement = (
  id,
  keyId,
  movingCards,
  hands,
  melds,
  discardPiles,
  playPile
) => {
  // Find moving card
  const changedValues = {};
  const moveCardIndex = movingCards.findIndex((moveCard) => moveCard.keyId === keyId);
  if (moveCardIndex > -1) {
    // Get target of the stopped card
    const stoppedCard = movingCards[moveCardIndex];
    const landingSpot = id.split('to')[1];
    const objectType = landingSpot[0];
    const playerIndex = landingSpot.length > 1 ? Number(landingSpot[1]) : -1;
    // remove the moving card from the array
    const newMovingCards = [...movingCards];
    changedValues.movingCards = newMovingCards;
    newMovingCards.splice(moveCardIndex, 1);
    changedValues.movingCards = [...newMovingCards];
    // Create new card to the added to a container
    const landingCard = createLandingCard(stoppedCard, objectType);
    switch(objectType) {
      case 'H':
        // Add card to hands for indexed player
        const newHands = [...hands];
        newHands[playerIndex] = [...hands[playerIndex], landingCard];
        newHands[playerIndex] = sortCardHand(newHands[playerIndex]);
        changedValues.hands = newHands;
        break;
      case 'M':
        // Add card to melds for indexed player
        const newMelds = [...melds];
        newMelds[playerIndex] = [...melds[playerIndex], landingCard];
        changedValues.melds = newMelds;
        break;
      case 'D':
        // Add card to discard pile for indexed player
        const newDiscardPiles = [...discardPiles];
        newDiscardPiles[playerIndex] = [...discardPiles[playerIndex], landingCard];
        changedValues.discardPiles = newDiscardPiles;
        break;
      default:
        // Add card to play pile
        let newPlayPile =  [...playPile];
        if (landingSpot[1] !== '-') {
          // set index of card add if landing spot is negative
          newPlayPile[Number(landingSpot[1])] = landingCard;
        } else {
          newPlayPile = [...playPile, landingCard];
        }
        changedValues.playPile = newPlayPile;
    }
  }
  return changedValues;
};
/**
 * This sets up all reducer data for the beginning of a new game.
 * @param teams {array} Names of the teams, length used for number of teams.
 * @param players {array} Names of the players, length used for number of players.
 * @returns {{promptModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string, zoom: number,
 *          message: *, hasHeaderSeparator: boolean, height: number}, hands: [], offSuits: [],
 *          seenWidow: [], showHands: [], melds: [], meldScores: [], bidModals: [], playedCards: [],
 *          gameWon: string, seenCards: [], playPileShown: boolean, movingCards: [], playScore: [], bids: [],
 *          playerModal: {shown: boolean}, gameState: string, discardPiles: [], playPile: []}}
 *          object of reset values to start a new game
 */
export const setGameValuesForNewGame = (teams, players) => {
  // Display opening message
  const throwAcesForDealerModal =
    generalModalData('Dealer is chosen by the first player to get an ace');
  // Initial values to clear
  const initedValues = {
    gameState: GAME_STATE.CHOSE_DEALER,
    discardPiles: [],
    showHands: [],
    hands: [],
    melds: [],
    meldScores: [],
    playPile: [],
    movingCards: [],
    playPileShown: false,
    playScore: [],
    gameWon: '',
    playerModal: {shown: false},
    promptModal: throwAcesForDealerModal,
    bidModals: [],
  };
  // below loop adds defaults for the proper number of players
  for(let i = 0; i < players.length; i++) {
    initedValues.discardPiles.push([]);
    initedValues.hands.push([]);
    initedValues.melds.push([]);
    initedValues.meldScores.push(0);
    initedValues.showHands.push(i === 0);
    initedValues.bidModals.push({shown: false});
  }
  // below loop sets default for the proper number of teams
  for(let i = 0; i < teams.length; i++) {
    initedValues.playScore.push([]);
  }
  // Creates the deck of cards for the user discard pile to start
  initedValues.discardPiles[0] = generateShuffledDeck();
  // Get an array of reset values to start a new hand
  const gameValues = setGameValuesForNewHand(players);
  return {...initedValues, ...gameValues};
};
/**
 * This function resets values to start a new hand
 * @param players {array} Names of the players, length used for number of players.
 * @returns {{offSuits: *[], seenCards: *[], seenWidow: *[], bids: *[], playedCards: *[]}} Object of reset game data
 */
export const setGameValuesForNewHand = (players) => {
  // Initial values to clear
  const initGameValues = {
    bids: [],
    seenWidow: [],
    seenCards: [],
    playedCards: [],
    offSuits: []
  };
  // below loop adds defaults for the proper number of players
  for(let i = 0; i < players.length; i++) {
    initGameValues.bids.push(0);
    initGameValues.seenCards.push([]);
    initGameValues.playedCards.push([]);
    initGameValues.offSuits.push([]);
  }
  return initGameValues;
};
/**
 * This will pop a card off of the user discard pile and move that to the meld next player to recieve a card
 * Advancement of the possible deal also occurs
 * @param state {object} Pointer to the reducer
 * @returns {{newMovingCard: {shown: boolean, keyId: string, id: string, suit, source: WorkerLocation | Location,
 *          value, speed: number, target: WorkerLocation | Location}, newDealer: number, newDiscards: *[]}}
 *          object with replacements for discards, dealer, and movingCards in the reducer
 */
export const throwCardForDeal = (state) => {
  // Set up card movement source
  const sourceCardId = `D0${state.discardPiles[0].length - 1}`;
  const sourceCard = getCardLocation(sourceCardId, state);
  sourceCard.zoom = sourceCard.zoom * 2;
  // Advance possible dealer
  const newDealer = (state.dealer + 1) % state.players.length;
  // set up card movement target
  const targetCardId = `M${newDealer}`;
  const targetCard = getCardLocation(targetCardId, state);
  targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
  // Get card thrown
  const dealtCard = state.discardPiles[0][state.discardPiles[0].length -1];
  // Remove card for discard pile
  const newDiscard0 = state.discardPiles[0];
  newDiscard0.pop();
  const newDiscards = [...state.discardPiles];
  newDiscards[0] = [...newDiscard0];
  // Creatw props for new moving card
  const newMovingCard = {
    id: `${sourceCardId}to${targetCardId}`,
    keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
    suit: dealtCard.suit,
    value: dealtCard.value,
    shown: true,
    speed: 1,
    source: sourceCard,
    target: targetCard,
  };
  return {
    newDiscards,
    newDealer,
    newMovingCard
  };
}
/**
 * Declares through the prompt modal who the dealer will be
 * @param players {array} array of player names
 * @param dealer {number} index into players for how the dealer is
 * @returns {{dealerPromptModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string, zoom: number,
 *          message: *, hasHeaderSeparator: boolean, height: number}}} replacement for prompt modal in reducer
 */
export const declareDealer = (
  players,
  dealer
) => {
  const dealerPromptModal =
    generalModalData((<div>The dealer is<br/><b>{players[dealer]}</b></div>));
  return {
    dealerPromptModal,
  };
};
/**
 * Passes one card from each player from hand, melds, and discards to the dealer discard pile. Also, clears bid modals.
 * @param state {object} Pointer to the reducer state
 * @returns {{toDealerPlayPile: *[], toDealerBidModels: *[], toDealerMovingCards: (*|[]), toDealerDiscards: *[],
 *          toDealerMelds: *[], toDealerHands: *[]}}
 *          replacements for movingCards, melds, discardsPiles, hands, playPile, and bidModals in the reducer
 */
export const passDeckToDealer = (state) => {
  let sourceCard;
  let newMovingCard;
  let cardsToMove = [];
  let toDealerMovingCards = state.movingCards;
  const toDealerDiscards = [...state.discardPiles];
  const toDealerMelds = [...state.melds];
  const toDealerHands = [...state.hands];
  let toDealerPlayPile = [...state.playPile];
  // Get target for moving card
  const targetCardId = `D${state.dealer}`;
  const targetCard = getCardLocation(targetCardId, state);
  const toDealerBidModels = [];
  // below loop takes a cards from containers
  for(let i = 0 ; i < state.players.length; i++) {
    toDealerBidModels.push({shown: false});
    if (i !== state.dealer && state.discardPiles[i].length > 0) {
      // remove card from discards if not the dealer
      cardsToMove.push(`D${i}${state.discardPiles[i].length - 1}`);
      const newDiscard = state.discardPiles[i];
      newDiscard.pop();
      toDealerDiscards[i] = [...newDiscard];
    }
    if (state.melds[i].length > 0) {
      // remove card for meld
      cardsToMove.push(`M${i}${state.melds[i].length - 1}`);
      const newMeld = state.melds[i];
      newMeld.pop();
      toDealerMelds[i] = [...newMeld];
    }
    if (state.hands[i].length > 0) {
      // remove card from hand
      cardsToMove.push(`H${i}${state.hands[i].length - 1}`);
      const newHand = state.hands[i];
      newHand.pop();
      toDealerHands[i] = [...newHand];
    }
  }
  if (state.playPile.length > 0) {
    // remove card from play pile
    cardsToMove.push(`P${toDealerPlayPile.length - 1}`);
    toDealerPlayPile.pop();
    toDealerPlayPile=[...toDealerPlayPile];
  }
  // Below loop creates moving cards for each card removed from a container in this function
  cardsToMove.forEach(cardToMove => {
    sourceCard = getCardLocation(cardToMove, state);
    newMovingCard = {
      id: `${cardToMove}to${targetCardId}`,
      key: `${cardToMove}to${targetCardId}`,
      keyId: `${cardToMove}to${targetCardId}${Date.now()}`,
      shown: false,
      speed: 10,
      travelTime: 51,
      source: sourceCard,
      target: targetCard,
    };
    toDealerMovingCards = [...toDealerMovingCards, newMovingCard];
  });
  return ({
    toDealerMovingCards,
    toDealerMelds,
    toDealerDiscards,
    toDealerHands,
    toDealerPlayPile,
    toDealerBidModels
  });
};
/**
 * This creates a shuffled deck in the dealers discard pile.
 * @param discards {array} array, by player, of cards in the discard pile components
 * @param dealer {number} index into players for who has the deal
 * @returns {{shuffledCards: *[], clearPlayerPrompt: {hasCloseButton: boolean, shown: boolean, width: number,
 *          header: string, zoom: number, message: *, hasHeaderSeparator: boolean, height: number}}}
 *          replacements for discardPiles and player modal in reducer
 */
export const preDealing = (discards, dealer) => {
  const shuffledCards = [...discards];
  // generate shuffled deck
  shuffledCards[dealer] = [...generateShuffledDeck()];
  // clear player modal
  const clearPlayerPrompt =
    generalModalData("");
  return { shuffledCards, clearPlayerPrompt };
};
/**
 * Removes cards from the dealer discard pile and moves them to the proper player's hand or the widow in set pattern
 * @param state {object} Pointer to the reducer state
 * @returns {{dealCards: *[], dealDeck: *[]}} replacements for discardPiles and movingCards in reducer
 */
export const dealing = (state) => {
  const dealDeck = [...state.discardPiles];
  let dealCards = [...state.movingCards];
  const newDiscardDeck = state.discardPiles[state.dealer];
  // Only moves cards if cards are in the discard pile
  if (newDiscardDeck.length > 0) {
    // calculates the number cards to deal this time
    const cardsToThrow = (newDiscardDeck.length > 48 - state.players.length * 3) ? 3 : 4;
    const targets = [];
    if (state.dealer === state.dealToPlayer) {
      // calculates the cards to throw to the widow and creates targets for them
      if (state.players.length === 3 && state.hands[state.dealer].length > 0) {
        targets.push("P-1");
      }
      if (state.players.length === 4) {
        targets.push("P-1");
        if (state.hands[state.dealer].length === 0) {
          targets.push("P-1");
        }
      }
    }
    // below loop generates targets for cards to player
    for (let i = 0; i < cardsToThrow; i++) {
      targets.push(`H${state.dealToPlayer}`);
    }
    // below loop creates the moving cards to go to player and widow
    targets.forEach(target => {
      // get moving card source
      const sourceCardId = `D${state.dealer}${newDiscardDeck.length - 1}`;
      const sourceCard = getCardLocation(sourceCardId, state);
      sourceCard.zoom = sourceCard.zoom * 2;
      // get moving card target
      const targetCard = getCardLocation(target, state);
      const targetCardId = target;
      targetCard.rotation = targetCard.rotation + getRandomRange(-10, 10, 1);
      // get card dealt
      const dealtCard = newDiscardDeck[newDiscardDeck.length -1];
      newDiscardDeck.pop();
      // create new moving card
      const newMovingCard = {
        id: `${sourceCardId}to${targetCardId}`,
        keyId: `${sourceCardId}to${targetCardId}${Date.now()}`,
        suit: dealtCard.suit,
        value: dealtCard.value,
        shown: false,
        travelTime: 300,
        source: sourceCard,
        target: targetCard,
      };
      dealCards = [...dealCards, newMovingCard];
    });
    dealDeck[state.dealer] = [...newDiscardDeck];
  }
  return {
    dealDeck,
    dealCards,
  };
};
/**
 * These function checks if any player has an amount 9s in their hand that would allow a redeal and sets up UI if that
 * player is the user.
 * @param hands {array} array, by player, of cards in the player's hands
 * @param players {array} player names
 * @returns {{ninesGameState: string, ninesPromptModal: {hasCloseButton: boolean, shown: boolean, width: number,
 *          header: string, zoom: number, message: *, hasHeaderSeparator: boolean, height: number},
 *          ninesPlayerModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string, zoom: number,
 *          message: *, hasHeaderSeparator: boolean, height: number}}}
 *          replacement for gameState, playerModal, and promptModal in reducer
 */
export const checkForNines = (hands, players) => {
  let ninesPromptModal;
  let ninesPlayerModal;
  let ninesGameState = GAME_STATE.NINES_CONTINUE;
  let ninesPlayer = -1;
  let promptWording;
  let playerWording;
  let playerButtons = {};
  // below loop checks each player for an amount of 9s that would allow for a redeal
  hands.forEach((hand, index) => {
    let nines = 0;
    hand.forEach(card => {
      if (card.value === '9') {
        nines++;
      }
    });
    if (nines > 9 - players.length) {
      ninesPlayer = index;
    }
  });
  if (ninesPlayer > -1) {
    // A player qualifies for 9s
    const playerWordingChange = ninesPlayer === 0 ? 'have' : 'has';
    if (ninesPlayer > 0) {
      // computer gets projected bid value of the hand to use to see if they want a redeal
      const bid = getHandBid(hands[ninesPlayer], players);
      ninesGameState = GAME_STATE.NINES_CONTINUE;
      if (bid < 21) {
        // computer wants a redeal
        if (players.length === 4) {
          if (ninesPlayer === 2) {
            // Computer player wanting a redeal is the user's partner, set up UI to ask if user agress with redeal
            promptWording = (<div><b>{players[2]}</b> {playerWordingChange} nines for re-deal</div>);
            playerWording = (<div>Do you agree to a re-deal?</div>);
            playerButtons = { buttons: [{
                label: 'No',
                returnMessage: GAME_STATE.NINES_CONTINUE
              },
                {
                  label: 'Yes',
                  status: 'warning',
                  returnMessage: GAME_STATE.NINES_REDEAL
                }
              ]};
            ninesGameState = GAME_STATE.NINES_USER_AGREE;
          } else {
            // Partner of nines is computer, calculate if the partner agress to redeal
            const ninesPartner = (ninesPlayer + 2) % 4;
            const partnerBid = getHandBid(hands[ninesPartner], players);
            if (partnerBid < 21) {
              // redeal is agreed to, inform the user in a modal
              promptWording = (
                <div>
                  <b>{players[ninesPlayer]}</b> {playerWordingChange} nines for re-deal<br/>
                  <b>{players[ninesPartner]}</b> agrees.
                </div>
              );
              playerButtons = {
                hasBox: false,
                buttons: [{
                  label: 'Re-deal',
                  status: 'warning',
                  returnMessage: GAME_STATE.NINES_REDEAL
                }],
              };
              ninesGameState = GAME_STATE.WAIT_REDEAL;
            } else {
              // redeal is disagreed with, inform the user in a modal
              promptWording = (
                <div>
                  <b>{players[ninesPlayer]}</b> {playerWordingChange} nines for re-deal<br/>
                  <b>{players[ninesPartner]}</b> disagrees with re-deal.
                </div>
              );
              ninesGameState = GAME_STATE.WAIT_NINES_CONTINUE;
              playerButtons = {
                hasBox: false,
                buttons: [{
                  label: 'Continue',
                  returnMessage: GAME_STATE.NINES_CONTINUE
                }],
              };
            }
          }
        } else {
          // 3 handed game, no agree required for redeal, set UI up to let user know there is a redeal
          promptWording = (<div><b>{players[ninesPlayer]}</b> has enough nines for the re-deal</div>);
          playerButtons = {
            hasBox: false,
            buttons: [{
              label: 'Re-deal',
              status: 'warning',
              returnMessage: GAME_STATE.NINES_REDEAL
            }],
          };
          ninesGameState = GAME_STATE.WAIT_REDEAL;
        }
      }
    } else {
      // Set up UI to ask the user if they want a redeal
      promptWording = (<div><b>{players[0]}</b> {playerWordingChange} enough nines for<br/>a re-deal.</div>);
      playerWording = (<div>Do you want a re-deal for 9s?</div>);
      playerButtons = { buttons: [{
          label: 'No',
          returnMessage: GAME_STATE.NINES_CONTINUE
        },
          {
            label: 'Yes',
            status: 'warning',
            returnMessage: GAME_STATE.NINES_USER_REDEAL
          }
        ]};
      ninesGameState = GAME_STATE.NINES_USER_REDEAL_WAIT;
    }
    // build modals if message or buttons exist using helper function
    if (promptWording) {
      ninesPromptModal = generalModalData(promptWording, {});
    }
    if (playerWording || Object.keys(playerButtons).length > 0) {
      ninesPlayerModal = generalModalData(playerWording, playerButtons);
    }
  }
  return {
    ninesPromptModal,
    ninesPlayerModal,
    ninesGameState
  };
};
/**
 * This calculates for the computer if it agrees with the partner wanting a redeal.
 * @param hands {array} array, by player, of the cards in the player's hands
 * @param players {array} player names
 * @returns {{postNinesPlayerModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number},
 *          postNinesPromptModal: {hasCloseButton: boolean, shown: boolean, width: number, header: string,
 *          zoom: number, message: *, hasHeaderSeparator: boolean, height: number}, postNinesGameState: string}}
 *          replacement for gameState, playerModal, and promptModal in reducer
 */
export const checkPostNines = (
  hands,
  players,
) => {
  // get bid amount to decide if the redeal should happen
  const bid = getHandBid(hands[2], players);
  // Modal message and button for agree to redeal.
  let promptWording =
    (<div><b>{players[0]}</b> have enough nines for<br/>a re-deal.<br/><b>{players[2]}</b> agrees.</div>);
  let playerButtons = {
    hasBox: false,
    buttons: [{
      label: 'Re-deal',
      status: 'warning',
      returnMessage: GAME_STATE.NINES_REDEAL
    }],
  };
  if (bid > 20) {
    // Modal message and button for disagrees to redeal.
    promptWording =
      (<div><b>{players[0]}</b> have enough nines for<br/>a re-deal.<br/><b>{players[2]}</b> disagrees.</div>);
    playerButtons = {
      hasBox: false,
      buttons: [{
        label: 'Continue',
        returnMessage: GAME_STATE.NINES_CONTINUE
      }],
    };
  }
  const postNinesGameState = GAME_STATE.POST_NINES_WAIT;
  // Build modals with help function
  const postNinesPromptModal = generalModalData(promptWording, {});
  const postNinesPlayerModal = generalModalData('', playerButtons);
  return {
    postNinesPromptModal,
    postNinesPlayerModal,
    postNinesGameState
  };
};