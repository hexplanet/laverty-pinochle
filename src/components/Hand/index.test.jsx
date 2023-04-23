import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Hand from './index';

describe("Hand Component", () => {
  const mockCardClicked = jest.fn();
  const cardSet = [
    {
      xOffset: 12,
      yOffset: -6,
      rotation: 0,
      suit: 'S',
      value: 'A',
      frontColor: '#dad',
      rolloverColor: '#987abc',
      active: false,
      clickable: false
    },
    {
      xOffset: 21,
      yOffset: 11,
      rotation: 3,
      suit: 'S',
      value: 'Q',
      frontColor: '#dad',
      rolloverColor: '#987cba',
      active: true,
      clickable: true
    },
    {
      xOffset: 22,
      yOffset: -21,
      rotation: -10,
      suit: 'D',
      value: 'J',
      frontColor: '#dad',
      rolloverColor: '#987abc',
      active: false,
      clickable: false
    },
    {
      xOffset: 11,
      yOffset: 2,
      rotation: 4,
      suit: 'S',
      value: 'A',
      frontColor: '#dad',
      rolloverColor: '#987abc',
      active: false,
      clickable: false
    },
    {
      xOffset: 0,
      yOffset: 0,
      rotation: 0,
      suit: 'C',
      value: '9',
      frontColor: '#dad',
      rolloverColor: '#987abc',
      active: false,
      clickable: false
    }
  ];

  const setup = (propsOverwrite = {}) => {
    const props = {
      id: '',
      xLocation: 1000,
      yLocation: 1000,
      zLocation: 0,
      cards: [],
      fanOut: 3,
      shown: true,
      zoom: 100,
      rotation: 0,
      hidden: false,
      cardClicked: mockCardClicked,
      ...propsOverwrite
    }
    return render(<Hand {...props} />);
  };
  test('renders basic hand correctly', () => {
    const { container } = setup();
    expect(container.querySelector('.lavpin-hand')).toBeDefined();
    expect(container.querySelector('.hand-transformer')).toBeDefined();
    expect(container.querySelector('.hand-container')).toBeDefined();
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(0);
  });
  test('does not render basic hand if hidden', () => {
    const { container } = setup({hidden:true});
    expect(container.querySelector('.lavpin-hand')).toEqual(null);
    expect(container.querySelector('.hand-transformer')).toEqual(null);
    expect(container.querySelector('.hand-container')).toEqual(null);
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(0);
  });
  test('hand gets rendered at the right locations', () => {
    const { container } = setup({ xLocation:123, yLocation: 321, zLocation: 111 });
    expect(container.querySelector('.lavpin-hand')).toHaveStyle({
      left: '123px',
      top: '321px',
      zIndex: 111
    });
  });
  test('renders hand with proper zoom', () => {
    const { container } = setup({ zoom: 150 });
    expect(container.querySelector('.hand-transformer')).toHaveStyle({
      transform: 'scale(1.5)',
    });
  });
  test('renders hand with proper rotation', () => {
    const { container } = setup({ rotation: 45 });
    expect(container.querySelector('.hand-container').style.rotate).toEqual('45deg');
  });
  test('renders cards in the hand without fanning', () => {
    const { container } = setup({ cards: cardSet, fanOut: -1 });
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(5);
    expect(container.querySelector('.lavpin-playing-card')).toHaveStyle({
      left: '412px',
      top: '84px',
      zIndex: 0
    });
  });
  test('renders cards in the hand with fanning', () => {
    const { container } = setup({ cards: cardSet });
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(5);
    expect(container.querySelector('.lavpin-playing-card')).toHaveStyle({
      left: '321.60365254926px',
      top: '94.10857847379498px',
      zIndex: 0
    });
    expect(container.querySelector('.lavpin-playing-card .card-display').style.rotate).toEqual('-6deg');
  });
  test('Should not be able to click on a card that is inactive', () => {
    const { container } = setup({ cards: cardSet });
    fireEvent.click(container.querySelector('.card-body'));
    expect(mockCardClicked).toHaveBeenCalledTimes(0);
  });
  test('Able to click card when it is active and clickable', () => {
    const { container } = setup({ cards: cardSet });
    fireEvent.click(container.querySelectorAll('.card-body')[1]);
    expect(mockCardClicked).toHaveBeenCalledWith('', 1, 'SQ');
  });
});