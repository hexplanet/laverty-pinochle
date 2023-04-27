import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import GamePlay from './index';
import * as actionType from '../../redux/actions/gameActionTypes';
import * as GAME_STATE from "../../utils/gameStates";
import * as CONSTANT from "../../utils/constants";

describe('GamePlay Container', () => {
  jest.mock('../../redux/store.js');
  const createMockStore = configureMockStore([thunk]);
  const setup = (storeOverwrite = {}) => {
    const store = createMockStore({
      game: {
        gameState: 'init', /* This is a string that holds the game state that drives the state based part of the app */
        teams: ['Us', 'Them', 'Jessica'], /* This is an array of team names. There can either 2 or 3 teams */
        players: ['You', 'Steven', 'Ellen'], /* This is an array of player names. There can either 3 or 4 teams */
        playerDisplaySettings: [], /* array, by player, of locations to place the hand components */
        discardPiles: [], /* array, by player, of cards that are in the discard pile components */
        discardDisplaySettings: [], /* array, by player, of locations to place discard piles */
        showHands: [], /* array, by player, of booleans. If boolean is true, player hand is shown face up */
        handFanOut: -1, /* number, this is the degrees of fan out in all hands. If -1, no fan out. */
        hands: [], /* array, by player, of cards for the hand components */
        seenWidow: [], /* array that holds the seen widow cards for AI usage */
        seenCards: [], /* array, by player, that holds all cards seen as meld for AI usage */
        playedCards: [], /* array that holds all card suit/values that have been played in this hand */
        offSuits: [], /* array, by player, that stores all suits that the player is know to be out of, for AI usage */
        bids: [], /* array, by player, of the bids for this hand */
        tookBid: 0, /* number, index into players for who took the bid this hand */
        bidAmount: 0, /* number, amount of the winning bid */
        thrownHand: false, /* boolean, did the bid winner throw the hand? */
        firstPlay: true, /* boolean, is this the first trick of the hand? */
        tookPlay: 0, /* number, index into players for who took the last trick */
        winningPlay: 0, /* number, index into players for who currently is winning the trick */
        bidModals: [], /* array, by player, properties for the modal components that display either the bid or the count */
        bidOffset: 21, /* number, the offset in bid value for the paginated user bidding */
        trumpSuit: '', /* string, this is the trump suit selected for the current hand */
        meldDisplaySettings: [], /* array, by player, of the locations of the pile components used to display meld */
        melds: [], /* array, by player, cards in the pile components used to display meld */
        meldScores: [], /* array, by player, of the score recorded for the meld */
        miscDisplaySettings: { /* object, locations of one-off components */
          scorePad: {}, /* object, locations of the scorepad component */
          playArea: {}, /* object, location of the pile component used for the trick play area */
          playerModal: {}, /* object, location of the player modal component */
          promptModal: {}, /* object, location of the prompt modal component */
          gameBidModals: [], /* array, by player, location of the bid modal components */
        },
        movingCards: [], /* array of props for MoveCard components for animation */
        zoomRatio: 1, /* number, global zoom level of the game page */
        dealer: 0, /* number, index into players for who the current dealer is */
        dealToPlayer: 0, /* number, index into players for who the current target player is */
        playPile: [], /* array, cards that are currently displayed in the play pile component */
        playPileShown: true, /* boolean, is the play pile currently visible? */
        playScore: [], /* array, by team, of arrays of object that make up the game score. See ScorePad component for more */
        gameWon: '', /* string, the name of the team that won the game */
        playerModal: {shown: false}, /* modal properties for player modal components */
        promptModal: {shown: false},/* modal properties for prompt modal components */
        ...storeOverwrite
      }
    });
    const testRender = render(
      <Provider store={store}>
        <GamePlay />
      </Provider>
    )
    return {
      container: testRender.container,
      store
    };
  };
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  })
  test('render default correctly and execute init', () => {
    const {container, store} = setup();
    expect(container.querySelectorAll('.lavpin-card-table').length).toEqual(1);
    expect(store.getActions()[0].type).toEqual(actionType.SET_CARD_TABLE_LAYOUT);
    expect(store.getActions()[1].type).toEqual(actionType.SETUP_FOR_NEW_GAME);
  });
  test('listens for resize event and recalculates layout', () => {
    const {store} = setup();
    expect(store.getActions()[0].type).toEqual(actionType.SET_CARD_TABLE_LAYOUT);
    expect(store.getActions()[1].type).toEqual(actionType.SETUP_FOR_NEW_GAME);
    window.innerWidth = 4000;
    window.innerHeight = 3000;
    fireEvent.resize(window);
    expect(store.getActions()[2].type).toEqual(actionType.SET_CARD_TABLE_LAYOUT);
  });
  test('listens for click and end time delay if active', () => {
    setup();
    window.delayWait = jest.fn();
    window.delayWaitTimeout = setTimeout(() => {}, 5000);
    fireEvent.click(window);
    expect(window.delayWait).toEqual(null);
    expect(window.delayWaitTimeout).toEqual(null);
  });
  test('gameState CHOSE_DEALER calls action throwForAce', () => {
    const {store} = setup({gameState: GAME_STATE.CHOSE_DEALER});
    expect(store.getActions()[1].type).toEqual(actionType.THROW_FOR_ACE);
  });
  test('gameState WAIT_FOR_ACE_COMPLETE calls action throwForAce when dealer meld not an ace', () => {
    const {store} = setup({
      gameState: GAME_STATE.WAIT_FOR_ACE_COMPLETE,
      melds: [[{value:'10'}]],
      dealer: 0,
    });
    expect(store.getActions()[1].type).toEqual(actionType.THROW_FOR_ACE);
  });
  test('gameState WAIT_FOR_ACE_COMPLETE calls action selectedDealer when dealer meld is an ace', () => {
    const {store} = setup({
      gameState: GAME_STATE.WAIT_FOR_ACE_COMPLETE,
      melds: [[{value:'A'}]],
      dealer: 0,
    });
    expect(store.getActions()[1].type).toEqual(actionType.SELECTED_DEALER);
  });
  test('gameState PRE_MOVE_DECK_TO_DEALER set gamestate WAITING and then to MOVE_DECK_TO_DEALER', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const {store} = setup({
      gameState: GAME_STATE.PRE_MOVE_DECK_TO_DEALER,
    });
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), CONSTANT.PREDEAL_DELAY);
    jest.runAllTimers();
    expect(store.getActions()[1].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[1].gameState).toEqual(GAME_STATE.WAITING);
    expect(store.getActions()[2].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[2].gameState).toEqual(GAME_STATE.MOVE_DECK_TO_DEALER);
  });
  test('gameState MOVE_DECK_TO_DEALER dispatches moveCardsToDealer  and then to MOVE_CARD_TO_DEALER', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    const {store} = setup({
      gameState: GAME_STATE.MOVE_DECK_TO_DEALER,
    });
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), CONSTANT.DECK_TO_DEALER_DELAY);
    jest.advanceTimersByTime(100);
    expect(store.getActions()[1].type).toEqual(actionType.MOVE_CARD_TO_DEALER);
    expect(store.getActions()[2].type).toEqual(actionType.MOVE_CARD_TO_DEALER);
  });
  test('gameState MOVE_DECK_TO_DEALER_COMPLETE dispatches moveCardsToDealer  and then to MOVE_DECK_TO_DEALER', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const {store} = setup({
      gameState: GAME_STATE.MOVE_DECK_TO_DEALER_COMPLETE,
    });
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), CONSTANT.POST_DECK_TO_DEALER_DELAY);
    jest.runAllTimers();
    expect(store.getActions()[1].type).toEqual(actionType.PRE_DEAL);
    expect(store.getActions()[2].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[2].gameState).toEqual(GAME_STATE.DEAL);
  });
  test('gameState DEAL dispatches moveCardsToDealer and then DEAL_CARDS', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    const {store} = setup({
      gameState: GAME_STATE.DEAL,
    });
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), CONSTANT.DEAL_DELAY);
    jest.advanceTimersByTime(500);
    expect(store.getActions()[1].type).toEqual(actionType.MOVE_CARD_TO_DEALER);
    expect(store.getActions()[2].type).toEqual(actionType.DEAL_CARDS);
    expect(store.getActions()[3].type).toEqual(actionType.DEAL_CARDS);
  });
  test('gameState DEAL_COMPLETE fans out hands and then starts CHECK_FOR_NINES', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const {store} = setup({
      gameState: GAME_STATE.DEAL_COMPLETE,
    });
    jest.runAllTimers();
    expect(store.getActions()[1].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[1].gameState).toEqual(GAME_STATE.FANNING_OUT);
    for (let i = 0; i <= 3; i = i + 0.25) {
      expect(store.getActions()[(i * 4) + 2].type).toEqual(actionType.SET_HAND_FAN_OUT);
      expect(store.getActions()[(i * 4) + 2].fanOut).toEqual(i);
    }
    expect(store.getActions()[15].type).toEqual(actionType.CHECK_FOR_NINES);
  });
  test('gameState NINES_CONTINUE calls action nextBid', () => {
    const {store} = setup({
      gameState: GAME_STATE.NINES_CONTINUE,
    });
    expect(store.getActions()[1].type).toEqual(actionType.NEXT_BID);
  });
  test('gameState NEXT_BID calls action nextBid', () => {
    const {store} = setup({
      gameState: GAME_STATE.NEXT_BID,
    });
    expect(store.getActions()[1].type).toEqual(actionType.NEXT_BID);
  });
  test('gameState COMPUTER_BID calls action nextBid', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const {store} = setup({
      gameState: GAME_STATE.COMPUTER_BID,
    });
    expect(store.getActions()[1].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[1].gameState).toEqual(GAME_STATE.WAITING_ON_BID);
    jest.runAllTimers();
    expect(store.getActions()[2].type).toEqual(actionType.RESOLVE_COMPUTER_BID);
  });
  test('gameState USER_BID calls action nextBid', () => {
    const {store} = setup({
      gameState: GAME_STATE.USER_BID,
    });
    expect(store.getActions()[1].type).toEqual(actionType.GET_USER_BID);
  });
  test('gameState BIDDING_COMPLETE calls action decideBidWinner after delay', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const {store} = setup({
      gameState: GAME_STATE.BIDDING_COMPLETE,
    });
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), CONSTANT.BID_COMPLETE_DELAY);
    jest.runAllTimers();
    expect(store.getActions()[1].type).toEqual(actionType.DECIDE_BID_WINNER);
  });
  test('gameState SHOW_WIDOW calls action showTheWidow for each card in the widow', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const {store} = setup({
      gameState: GAME_STATE.SHOW_WIDOW,
      hands: [[],[],[],[]],
    });
    jest.runAllTimers();
    for(let i = 0; i < 5; i++) {
      expect(store.getActions()[1 + i].type).toEqual(actionType.SHOW_THE_WIDOW);
      expect(store.getActions()[1 + i].widowCardIndex).toEqual(i);
    }
  });
  test('gameState WIDOW_MOVING_COMPLETE calls action decideThrowHand', () => {
    const {store} = setup({
      gameState: GAME_STATE.WIDOW_MOVING_COMPLETE,
    });
    expect(store.getActions()[1].type).toEqual(actionType.DECIDE_THROW_HAND);
  });
  test('gameState COMPUTER_WANTS_TO_THROW_HAND calls action agreeThrowHand', () => {
    const {store} = setup({
      gameState: GAME_STATE.COMPUTER_WANTS_TO_THROW_HAND,
    });
    expect(store.getActions()[1].type).toEqual(actionType.AGREE_THROW_HAND);
  });
  test('gameState THROW_HAND_DISAGREE calls action disagreeThrowHand', () => {
    const {store} = setup({
      gameState: GAME_STATE.THROW_HAND_DISAGREE,
    });
    expect(store.getActions()[1].type).toEqual(actionType.DISAGREE_THROW_HAND);
  });
  test('gameState THROW_HAND calls action throwHand', () => {
    const {store} = setup({
      gameState: GAME_STATE.THROW_HAND,
    });
    expect(store.getActions()[1].type).toEqual(actionType.THROW_HAND);
  });

  test('gameState START_DISCARDS calls action clearPlayerModal and startDiscards', () => {
    const {store} = setup({
      gameState: GAME_STATE.START_DISCARDS,
    });
    expect(store.getActions()[1].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].type).toEqual(actionType.START_DISCARDS);
  });
  test('gameState COMPUTER_DISCARD calls action computerDiscards', () => {
    const {store} = setup({
      gameState: GAME_STATE.COMPUTER_DISCARD,
    });
    expect(store.getActions()[1].type).toEqual(actionType.COMPUTER_DISCARDS);
  });
  test('gameState THROW_HAND_CONTINUE calls action declareTrumpSuit', () => {
    const {store} = setup({
      gameState: GAME_STATE.THROW_HAND_CONTINUE,
    });
    expect(store.getActions()[1].type).toEqual(actionType.DECLARE_TRUMP_SUIT);
  });
  test('gameState SELECT_TRUMP_SUIT calls action declareTrumpSuit', () => {
    const {store} = setup({
      gameState: GAME_STATE.SELECT_TRUMP_SUIT,
    });
    expect(store.getActions()[1].type).toEqual(actionType.DECLARE_TRUMP_SUIT);
  });
  test('gameState WAIT_REMOVE_DISCARDS_COMPLETE calls action startMeld', () => {
    const {store} = setup({
      gameState: GAME_STATE.WAIT_REMOVE_DISCARDS_COMPLETE,
    });
    expect(store.getActions()[1].type).toEqual(actionType.START_MELD);
  });
  test('gameState START_MELD calls action startMeld', () => {
    const {store} = setup({
      gameState: GAME_STATE.START_MELD,
    });
    expect(store.getActions()[1].type).toEqual(actionType.START_MELD);
  });
  test('gameState DISPLAY_MELD calls action displayMeld', () => {
    const {store} = setup({
      gameState: GAME_STATE.DISPLAY_MELD,
    });
    expect(store.getActions()[1].type).toEqual(actionType.DISPLAY_MELD);
  });
  test('gameState MELD_DELAY calls action nextLMeld after a delay', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const {store} = setup({
      gameState: GAME_STATE.MELD_DELAY,
    });
    jest.runAllTimers();
    expect(store.getActions()[1].type).toEqual(actionType.NEXT_MELD);
  });
  test('gameState MOVING_MELD_CARDS_BACK_COMPLETE calls action playLead', () => {
    const {store} = setup({
      gameState: GAME_STATE.MOVING_MELD_CARDS_BACK_COMPLETE,
    });
    expect(store.getActions()[1].type).toEqual(actionType.PLAY_LEAD);
  });
  test('gameState START_NEXT_PLAY calls action playLead', () => {
    const {store} = setup({
      gameState: GAME_STATE.START_NEXT_PLAY,
    });
    expect(store.getActions()[1].type).toEqual(actionType.PLAY_LEAD);
  });
  test('gameState CARD_TO_PLAY_PILE_COMPLETE calls action resolvePlay', () => {
    const {store} = setup({
      gameState: GAME_STATE.CARD_TO_PLAY_PILE_COMPLETE,
    });
    expect(store.getActions()[1].type).toEqual(actionType.RESOLVE_PLAY);
  });
  test('gameState WAIT_TO_CLEAR_PLAY_PILE calls action playFollow after a delay', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const {store} = setup({
      gameState: GAME_STATE.WAIT_TO_CLEAR_PLAY_PILE,
    });
    jest.runAllTimers();
    expect(store.getActions()[1].type).toEqual(actionType.PLAY_FOLLOW);
  });
  test('gameState WAIT_MOVE_PLAY_PILE_TO_DISCARD calls action movePlayPileToDiscard after a delay', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const {store} = setup({
      gameState: GAME_STATE.WAIT_MOVE_PLAY_PILE_TO_DISCARD,
    });
    jest.runAllTimers();
    expect(store.getActions()[1].type).toEqual(actionType.MOVE_PLAY_PILE_TO_DISCARD);
  });

  test('gameState REST_MOVE_TO_DISCARD_COMPLETE calls action startNextPlay', () => {
    const {store} = setup({
      gameState: GAME_STATE.REST_MOVE_TO_DISCARD_COMPLETE,
    });
    expect(store.getActions()[1].type).toEqual(actionType.START_NEXT_PLAY);
  });
  test('gameState PLAY_PILE_TO_DISCARD_COMPLETE calls action startNextPlay', () => {
    const {store} = setup({
      gameState: GAME_STATE.PLAY_PILE_TO_DISCARD_COMPLETE,
    });
    expect(store.getActions()[1].type).toEqual(actionType.START_NEXT_PLAY);
  });
  test('gameState TALLY_COUNTS calls action tallyCounts', () => {
    const {store} = setup({
      gameState: GAME_STATE.TALLY_COUNTS,
    });
    expect(store.getActions()[1].type).toEqual(actionType.TALLY_COUNTS);
  });
  test('gameState NEXT_TALLY calls action tallyCounts', () => {
    const {store} = setup({
      gameState: GAME_STATE.NEXT_TALLY,
    });
    expect(store.getActions()[1].type).toEqual(actionType.TALLY_COUNTS);
  });
  test('gameState MOVE_DISCARD_TO_MELD_TALLY_COMPLETE calls action addCountToTally', () => {
    const {store} = setup({
      gameState: GAME_STATE.MOVE_DISCARD_TO_MELD_TALLY_COMPLETE,
    });
    expect(store.getActions()[1].type).toEqual(actionType.ADD_COUNT_TO_TALLY);
  });
  test('gameState DONE_COUNTING calls action addCountToScore', () => {
    const {store} = setup({
      gameState: GAME_STATE.DONE_COUNTING,
    });
    expect(store.getActions()[1].type).toEqual(actionType.ADD_COUNT_TO_SCORE);
  });
  test('Renders hands and receives card clicks for WAIT_USER_DISCARD', () => {
    const hands = [
      [
        {suit:'H', value:'A', clickable: true},
        {suit:'S', value:'10', clickable: true},
        {suit:'C', value:'K', clickable: true},
      ],
    ];
    const {store, container} = setup({
      gameState: GAME_STATE.WAIT_USER_DISCARD,
      hands,
      playerDisplaySettings: [{x:0, y:0, rotation: 0, zoom: 100}, {x:0, y:0, rotation: 0, zoom: 100}],
      showHands: [true, false],
      handFanOut: 3.5,
    });
    fireEvent.click(container.querySelectorAll('.card-body')[1]);
    expect(store.getActions()[1].type).toEqual(actionType.USER_SELECT_DISCARD);
    expect(store.getActions()[1].index).toEqual(1);
  });
  test('Renders hands and receives card clicks for WAIT_USER_PLAY', () => {
    const hands = [
      [
        {suit:'H', value:'A', clickable: true},
        {suit:'S', value:'10', clickable: true},
        {suit:'C', value:'K', clickable: true},
      ],
      [
        {suit:'H', value:'A', clickable: true},
        {suit:'S', value:'10', clickable: true},
        {suit:'C', value:'K', clickable: true},
      ],
    ];
    const {store, container} = setup({
      gameState: GAME_STATE.WAIT_USER_PLAY,
      hands,
      playerDisplaySettings: [{x:0, y:0, rotation: 0, zoom: 100}, {x:0, y:0, rotation: 0, zoom: 100}],
      showHands: [true, false],
      handFanOut: 3.5,
    });
    fireEvent.click(container.querySelectorAll('.card-body')[2]);
    expect(store.getActions()[1].type).toEqual(actionType.USER_PLAY);
    expect(store.getActions()[1].cardIndex).toEqual(2);
  });
  test('Renders discard piles', () => {
    const discardPiles = [
      [
        {suit:'H', value:'A', clickable: true},
        {suit:'S', value:'10', clickable: true},
        {suit:'C', value:'K', clickable: true},
      ],
      [
        {suit:'H', value:'A', clickable: true},
        {suit:'S', value:'10', clickable: true},
        {suit:'C', value:'K', clickable: true},
      ],
    ];
    const {container} = setup({
      discardPiles,
      discardDisplaySettings: [{x:0, y:0, rotation: 0, zoom: 100}, {x:0, y:0, rotation: 0, zoom: 100}],
    });
    expect(container.querySelectorAll('.lavpin-pile').length).toEqual(2);
  });
  test('Renders meld piles', () => {
    const melds = [
      [
        {suit:'H', value:'A', clickable: true},
        {suit:'S', value:'10', clickable: true},
        {suit:'C', value:'K', clickable: true},
      ],
      [
        {suit:'H', value:'A', clickable: true},
        {suit:'S', value:'10', clickable: true},
        {suit:'C', value:'K', clickable: true},
      ],
    ];
    const {container} = setup({
      melds,
      meldDisplaySettings: [{x:0, y:0, rotation: 0, zoom: 100}, {x:0, y:0, rotation: 0, zoom: 100}],
    });
    expect(container.querySelectorAll('.lavpin-pile').length).toEqual(2);
  });
  test('Renders play pile', () => {
    const playPile = [
        {suit:'H', value:'A', clickable: true},
        {suit:'S', value:'10', clickable: true},
        {suit:'C', value:'K', clickable: true},
        {suit:'C', value:'K', clickable: true},
    ];
    const {container} = setup({
      playPile,
      miscDisplaySettings: {
        playArea: {x:0, y:0, rotation: 0, zoom: 100},
        gameBidModals: [{}],
        scorePad: {},
        playerModal: {},
        promptModal: {}
      },
    });
    expect(container.querySelectorAll('.lavpin-pile').length).toEqual(1);
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(4);
  });
  test('Renders score pad and toggles placement on click', () => {
    const {container} = setup({
      playScore: [[],[]],
      teams: ['',''],
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [{}],
        scorePad: {x:0, y:0, rotation: 0, zoom: 100},
        playerModal: {},
        promptModal: {}
      },
    });
    expect(container.querySelectorAll('.lavpin-score-pad').length).toEqual(1);
    fireEvent.click(container.querySelector('.score-pad-transform'));
    expect(container.querySelectorAll('.lavpin-global-score-pad').length).toEqual(1);
    fireEvent.click(container.querySelector('.score-pad-transform'));
    expect(container.querySelectorAll('.lavpin-global-score-pad').length).toEqual(0);
  });
  test('Renders bid modals', () => {
    const {container} = setup({
      hands: [[],[],[]],
      bidModals: [{shown: true}, {shown: true}, {shown: true}],
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [
          {x:0, y:0, rotation: 0, zoom: 100},
          {x:0, y:0, rotation: 0, zoom: 100},
          {x:0, y:0, rotation: 0, zoom: 100}
        ],
        scorePad: {},
        playerModal: {},
        promptModal: {}
      },
    });
    expect(container.querySelectorAll('.lavpin-modal').length).toEqual(3);
  });
  test('Renders player modal', () => {
    const {container} = setup({
      playerModal: {shown: true},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    expect(container.querySelectorAll('.lavpin-modal').length).toEqual(1);
  });
  test('Renders prompt modal', () => {
    const {container} = setup({
      promptModal: {shown: true},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {},
        promptModal: {x:0, y:0, rotation: 0, zoom: 100}
      },
    });
    expect(container.querySelectorAll('.lavpin-modal').length).toEqual(1);
  });
  test('renders moving cards', () => {
    /* TODO: unit testing after refactor of MoveCard
    const {container} = setup({
      movingCards: [
        {id: 'H0toP0', keyId: 'moveCard0', travelTime: 50, source: {x: 0, y: 0}, target: {x: 100, y: 100}},
        {id: 'H1toP1', keyId: 'moveCard1', travelTime: 50, source: {x: 0, y: 0}, target: {x: 100, y: 100}},
        {id: 'H2toP2', keyId: 'moveCard2', travelTime: 50, source: {x: 0, y: 0}, target: {x: 100, y: 100}},
        {id: 'H3toP3', keyId: 'moveCard3', travelTime: 50, source: {x: 0, y: 0}, target: {x: 100, y: 100}},
      ],
    });
     */
  });
  test('click on modal button for NINES_USER_REDEAL for 4 handed game', () => {
    const {container, store} = setup({
      hands: [[],[],[],[]],
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.NINES_USER_REDEAL}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.PARTNER_CONFIRM_NINES_REDEAL);
  });
  test('click on modal button for NINES_USER_REDEAL for 3 handed game', () => {
    const {container, store} = setup({
      hands: [[],[],[]],
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.NINES_USER_REDEAL}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.CLEAR_PROMPT_MODAL);
    expect(store.getActions()[3].hide).toEqual(true);
    expect(store.getActions()[4].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[4].gameState).toEqual(GAME_STATE.PRE_MOVE_DECK_TO_DEALER);
  });
  test('click on modal button for NINES_CONTINUE', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.NINES_CONTINUE}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[3].gameState).toEqual(GAME_STATE.NEXT_BID);
  });
  test('click on modal button for NINES_REDEAL', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.NINES_REDEAL}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.CLEAR_PROMPT_MODAL);
    expect(store.getActions()[3].hide).toEqual(true);
    expect(store.getActions()[4].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[4].gameState).toEqual(GAME_STATE.PRE_MOVE_DECK_TO_DEALER);
  });
  test('click on modal button for POST_BID_CONTINUE', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.POST_BID_CONTINUE}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.SHOW_THE_WIDOW);
  });
  test('click on modal button for WIDOW_CONTINUE', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.WIDOW_CONTINUE}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.CLEAR_PROMPT_MODAL);
    expect(store.getActions()[3].hide).toEqual(true);
    expect(store.getActions()[4].type).toEqual(actionType.MOVE_WIDOW_TO_HAND);
  });
  test('click on modal button for THROW_HAND_CONTINUE', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.THROW_HAND_CONTINUE}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[3].gameState).toEqual(GAME_STATE.SELECT_TRUMP_SUIT);
  });
  test('click on modal button for USER_THROW_HAND', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.USER_THROW_HAND}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.AGREE_THROW_HAND);
  });
  test('click on modal button for THROW_HAND_DISAGREE', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.THROW_HAND_DISAGREE}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.DISAGREE_THROW_HAND);
  });
  test('click on modal button for THROW_HAND', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.THROW_HAND}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.THROW_HAND);
  });
  test('click on modal button for USER_DISCARD', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.USER_DISCARD}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.REMOVE_USER_DISCARDS);
  });
  test('click on modal button for NAME_TRUMP_SUIT', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.NAME_TRUMP_SUIT}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[2].gameState).toEqual(GAME_STATE.SELECT_TRUMP_SUIT);
  });
  test('click on modal button for START_GAME_PLAY', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.START_GAME_PLAY}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.START_GAME_PLAY);
  });
  test('click on modal button for POST_TRUMP_SUIT_CONTINUE', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.POST_TRUMP_SUIT_CONTINUE}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.START_DISCARDS);
  });
  test('click on modal button for POST_DISCARD_TRUMP', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.POST_DISCARD_TRUMP}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.STORE_GAME_STATE);
    expect(store.getActions()[3].gameState).toEqual(GAME_STATE.WAIT_REMOVE_DISCARDS_COMPLETE);
  });
  test('click on modal button for END_OF_HAND', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.END_OF_HAND}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.END_HAND);
  });
  test('click on modal button for WIN_REST_CONTINUE', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: GAME_STATE.WIN_REST_CONTINUE}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.MOVE_REST_TO_DISCARD);
  });
  test('click on modal button for BID_31 to test user bidding', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: 'bid_31'}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.GET_USER_BID);
    expect(store.getActions()[2].selection).toEqual('bid_31');
  });
  test('click on modal button for TRUMP is Spades to test user bidding', () => {
    const {container, store} = setup({
      playerModal: {shown: true, buttons: [{returnMessage: 'trumpIs_S'}]},
      miscDisplaySettings: {
        playArea: {},
        gameBidModals: [],
        scorePad: {},
        playerModal: {x:0, y:0, rotation: 0, zoom: 100},
        promptModal: {}
      },
    });
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(store.getActions()[2].type).toEqual(actionType.CLEAR_PLAYER_MODAL);
    expect(store.getActions()[2].hide).toEqual(undefined);
    expect(store.getActions()[3].type).toEqual(actionType.SET_TRUMP_SUIT);
    expect(store.getActions()[3].suit).toEqual('S');
  });
});

