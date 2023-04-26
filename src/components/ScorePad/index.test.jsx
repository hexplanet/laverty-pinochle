import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScorePad from './index';

describe("ScorePad Component", () => {
  const mockHandleClick = jest.fn();
  const setup = (propsOverwrite = {}) => {
    const props = {
      teams: [],
      scores: [],
      xLocation: 0,
      yLocation: 0,
      zoom: 100,
      won: '',
      handleClick: mockHandleClick,
      hasBlocker: false,
      ...propsOverwrite
    }
    return render(<ScorePad {...props} />);
  };
  test('Renders default score pad properly without blocker', () => {
    const {container} = setup();
    expect(container.querySelectorAll('.lavpin-global-score-pad').length).toEqual(0);
    expect(container.querySelectorAll('.scorepad-blocker').length).toEqual(0);
    expect(container.querySelectorAll('.lavpin-score-pad').length).toEqual(1);
    expect(container.querySelectorAll('.score-pad-transform').length).toEqual(1);
    expect(container.querySelectorAll('.score-pad-container').length).toEqual(1);
    expect(container.querySelector('.lavpin-score-pad')).toHaveStyle({
      left: '0px',
      top: '0px'
    });
    expect(container.querySelector('.score-pad-transform')).toHaveStyle({
      transform: `scale(1)`,
    });
  });
  test('Renders default and reads click on scorepad', () => {
    const {container} = setup();
    fireEvent.click(container.querySelector('.score-pad-transform'));
    expect(mockHandleClick).toHaveBeenCalled();
  });
  test('Renders default score pad properly with blocker', () => {
    const {container} = setup({
      hasBlocker: true
    });
    expect(container.querySelectorAll('.lavpin-global-score-pad').length).toEqual(1);
    expect(container.querySelectorAll('.scorepad-blocker').length).toEqual(1);
    expect(container.querySelectorAll('.lavpin-score-pad').length).toEqual(1);
    expect(container.querySelectorAll('.score-pad-transform').length).toEqual(1);
    expect(container.querySelectorAll('.score-pad-container').length).toEqual(1);
    expect(container.querySelector('.lavpin-score-pad')).toHaveStyle({
      left: '50%',
      top: '50%'
    });
    expect(container.querySelector('.score-pad-transform')).toHaveStyle({
      transform: `scale(4)`,
    });
  });
  test('renders with a click blocker behind the modal that no clicks get through', () => {
    const mockMouseEventStopPropagation = jest.spyOn(MouseEvent.prototype, 'stopPropagation');
    const { container } = setup({
      hasBlocker: true,
    });
    expect(container.querySelectorAll('.scorepad-blocker').length).toEqual(1);
    fireEvent.click(container.querySelector('.scorepad-blocker'));
    expect(mockMouseEventStopPropagation).toHaveBeenCalled();
    jest.resetAllMocks();
  });
  test('renders proper location and zoom', () => {
    const { container } = setup({
      xLocation: -100,
      yLocation: 200,
      zoom: 345,
    });
    expect(container.querySelector('.lavpin-score-pad')).toHaveStyle({
      left: '-100px',
      top: '200px'
    });
    expect(container.querySelector('.score-pad-transform')).toHaveStyle({
      transform: `scale(3.45)`,
    });
  });
  test('render scores for 3 teams', async() => {
    const teams = ['Team A', 'Team B', 'Team C'];
    const scores = [
      [
        { bid: '0', meld: '0', counts: '12', score: '12', gotSet: false },
      ],
      [
        { bid: '21', meld: '13', counts: '6', score: '-21', gotSet: true },
      ],
      [
        { bid: '0', meld: '24', counts: '', score: '31', gotSet: false },
      ]
    ];
    const won = 'Team B';
    const { container } = setup({
      scores,
      teams,
      won
    });
    expect(await screen.queryAllByText('0').length).toEqual(3);
    expect(await screen.queryAllByText('12').length).toEqual(2);
    expect(await screen.queryAllByText('21').length).toEqual(1);
    expect(await screen.queryAllByText('13').length).toEqual(1);
    expect(await screen.queryAllByText('6').length).toEqual(1);
    expect(await screen.queryAllByText('-21').length).toEqual(1);
    expect(await screen.queryAllByText('24').length).toEqual(1);
    expect(await screen.queryAllByText('31').length).toEqual(1);
  });
});