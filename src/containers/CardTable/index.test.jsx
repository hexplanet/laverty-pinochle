import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardTable from './index';

describe('CardTable Container', () => {
  const setup = (propsOverwrite = {}) => {
    const props = {
      displayHands: [],
      displayDiscards: [],
      displayMelds: [],
      displayGameArea: [],
      displayScorePad: [],
      displayPlayerModal: [],
      displayMovingCards: [],
      ...propsOverwrite
    }
    return render(<CardTable {...props} />);
  };
  test('renders default CardTable', () => {
    const {container} = setup();
    expect(container.querySelectorAll('.lavpin-card-table').length).toEqual(1);
  });
  test('renders all component arrays', () => {
    const {container} = setup({
      displayHands: [(<div key={'a1'} className={'display-hands'}></div>), (<div key={'a2'} className={'display-hands'}></div>)],
      displayDiscards: [(<div key={'a1'} className={'display-discards'}></div>), (<div key={'b2'} className={'display-discards'}></div>)],
      displayMelds: [(<div key={'a1'} className={'display-meld'}></div>), (<div key={'c2'} className={'display-meld'}></div>)],
      displayGameArea: [(<div key={'d1'} className={'display-game-area'}></div>)],
      displayScorePad: [(<div key={'e1'} className={'display-score-pad'}></div>)],
      displayPlayerModal: [(<div key={'f1'} className={'display-player-modal'}></div>)],
      displayMovingCards: [
        (<div key={'g1'} className={'display-moving-card'}></div>),
        (<div key={'g2'} className={'display-moving-card'}></div>),
        (<div key={'g3'} className={'display-moving-card'}></div>),
        (<div key={'g4'} className={'display-moving-card'}></div>),
      ],
    });
    expect(container.querySelectorAll('.lavpin-card-table').length).toEqual(1);
  });
});