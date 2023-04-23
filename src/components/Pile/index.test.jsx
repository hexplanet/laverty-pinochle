import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pile from './index';
describe("Modal Component", () => {
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
      xLocation: 1000,
      yLocation: 1000,
      zLocation: 0,
      cards: [],
      shown: false,
      rotation: 0,
      zoom: 100,
      hidden: false,
      hasHeight: true,
      ...propsOverwrite
    }
    return render(<Pile {...props} />);
  };
  test('renders basic pile correctly', () => {
    const { container } = setup();
    expect(container.querySelector('.lavpin-pile')).toBeDefined();
    expect(container.querySelector('.pile-transformer')).toBeDefined();
    expect(container.querySelector('.pile-container')).toBeDefined();
    expect(container.querySelector('.lavpin-pile')).toHaveStyle({
      left: '1000px',
      top: '1000px',
      zIndex: 0
    });
    expect(container.querySelector('.pile-transformer')).toHaveStyle({
      transform: 'scale(1)'
    });
    expect(container.querySelector('.pile-container').style.rotate).toEqual('0deg');
  });
  test('renders at proper location', () => {
    const { container } = setup({
      xLocation: 100,
      yLocation: 200,
      zLocation: 300,
    });
    expect(container.querySelector('.lavpin-pile')).toHaveStyle({
      left: '100px',
      top: '200px',
      zIndex: 300
    });
  });
  test('renders with proper scale', () => {
    const { container } = setup({
      zoom: 150,
    });
    expect(container.querySelector('.pile-transformer')).toHaveStyle({
      transform: 'scale(1.5)',
    });
  });
  test('renders with proper scale', () => {
    const { container } = setup({
      rotation: 150,
    });
    expect(container.querySelector('.pile-container').style.rotate).toEqual('150deg');
  });
  test('does not render if hidden', () => {
    const { container } = setup({
      hidden: true
    });
    expect(container.querySelector('.lavpin-pile')).toEqual(null);
  });
  test('renders the cards in the pile with card backs only', () => {
    const { container } = setup({
      cards: cardSet,
      shown: false
    });
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(5);
    expect(container.querySelectorAll('.top-left-suit').length).toEqual(0);
  });
  test('renders the cards in the pile with card fronts only', () => {
    const { container } = setup({
      cards: cardSet,
      shown: true
    });
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(5);
    expect(container.querySelectorAll('.top-left-suit').length).toEqual(5);
  });
  test('renders the cards positioned without height', () => {
    const { container } = setup({
      cards: cardSet,
      hasHeight: false
    });
    expect(container.querySelectorAll('.lavpin-playing-card')[4]).toHaveStyle({
      left: '110px',
      top: '110px'
    });
  });
  test('renders the cards positioned with height', () => {
    const { container } = setup({
      cards: cardSet,
      hasHeight: true
    });
    expect(container.querySelectorAll('.lavpin-playing-card')[4]).toHaveStyle({
      left: '110.8px',
      top: '108px'
    });
  });
});