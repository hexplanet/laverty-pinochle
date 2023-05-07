import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MoveCard from './index';
import * as colors from "../../utils/colors";

describe("PlayingCard Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockMovementDone = jest.fn();
  const setup = (propsOverwrite = {}) => {
    const props = {
      id: 'H1toD1',
      keyId: 'H1toD1-1',
      suit: 'H',
      value: '9',
      shown: true,
      speed: 1,
      travelTime: 0,
      zLocation: 0,
      frontColor: colors.cardFrontColor,
      doneMoving: false,
      source: {x: 789, y:987, zoom: 100, rotation: 1},
      target: {x: 1789, y:1987, zoom: 50, rotation: 181},
      movementDone: mockMovementDone,
      ...propsOverwrite
    }
    return render(<MoveCard {...props} />);
  };
  test('default MoveCard renders correctly', () => {
    jest.spyOn(Date, 'now').mockReturnValue(123456789);
    const {container} = setup();
    expect(container.querySelectorAll('.lavpin-move-card').length).toEqual(1);
    expect(container.querySelector('.lavpin-move-card')).toHaveStyle({
      left: '789px',
      top: '987px'
    });
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(1);
  });
  test('MoveCard does not render when doneMoving is true', () => {
    const {container} = setup({doneMoving: true});
    expect(container.querySelectorAll('.lavpin-move-card').length).toEqual(0);
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(0);
  });
  test('MoveCard properties proper values at the end of the travel', () => {
    jest.useFakeTimers();
    const {container} = setup();
    expect(container.querySelector('.lavpin-move-card')).toHaveStyle({
      left: '1789px',
      top: '1987px'
    });
    expect(mockMovementDone).toHaveBeenCalledWith("H1toD1", "H1toD1-1");
  });
  test('MoveCard properties proper values at the end of the travel for travel time', () => {
    jest.useFakeTimers();
    const {container} = setup({
      speed: 0,
      travelTime: 500,
    });
    expect(container.querySelector('.lavpin-move-card')).toHaveStyle({
      left: '789px',
      top: '987px'
    });
  });
});
