import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayingCard from './index';
import * as colors from "../../utils/colors";

describe("PlayingCard Component", () => {
  const mockHandleCard = jest.fn();
  const setup = (propsOverwrite = {}) => {
    const props = {
      index: 0,
      suit: 'H',
      value: '9',
      shown: true,
      zoom: 100,
      rotation: 0,
      xLocation: 0,
      yLocation: 0,
      zLocation: 0,
      hidden: false,
      rolloverColor: colors.cardDefaultRolloverColor,
      frontColor: colors.cardDefaultFrontColor,
      active: true,
      clickable: true,
      handleClick: mockHandleCard,
      ...propsOverwrite
    }
    return render(<PlayingCard {...props} />);
  };
  test('default PlayingCard renders correctly', () => {
    const {container} = setup();
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(1);
    expect(container.querySelectorAll('.card-container').length).toEqual(1);
    expect(container.querySelectorAll('.card-display').length).toEqual(1);
    expect(container.querySelectorAll('.card-body').length).toEqual(1);
    expect(container.querySelectorAll('.clickable').length).toEqual(1);
    expect(container.querySelectorAll('.top-left-suit').length).toEqual(1);
    expect(container.querySelectorAll('.bottom-right-suit').length).toEqual(1);
    expect(container.querySelectorAll('.top-left-value').length).toEqual(1);
    expect(container.querySelectorAll('.bottom-right-value').length).toEqual(1);
    expect(container.querySelectorAll('.unselectableText').length).toEqual(2);
    expect(container.querySelector('.lavpin-playing-card')).toHaveStyle({
      left: "0px",
      top: "0px",
      zIndex: 0
    });
    expect(container.querySelector('.card-display')).toHaveStyle({
      transform: `scale(1)`,
    });
    expect(container.querySelector('.card-display').style.rotate).toEqual('0deg');
    expect(container.querySelectorAll('rect[fill="#eee"]').length).toEqual(1);
  });
  test('is the card hidden, not rendered', () => {
    const {container} = setup({ hidden: true });
    expect(container.querySelectorAll('.lavpin-playing-card').length).toEqual(0);
  });
  test('renders 9 of Hearts', async() => {
    const {container} = setup({ suit:'H', value:'9' });
    expect(container.querySelectorAll('.value-red').length).toEqual(2);
    expect(await screen.queryAllByText('9').length).toEqual(2);
    expect(container.querySelectorAll('svg').length).toEqual(3);
  });
  test('renders A of Spades', async() => {
    const {container} = setup({ suit:'S', value:'A' });
    expect(container.querySelectorAll('.value-black').length).toEqual(2);
    expect(await screen.queryAllByText('A').length).toEqual(2);
    expect(container.querySelectorAll('svg').length).toEqual(3);
  });
  test('renders 10 of Clubs', async() => {
    const {container} = setup({ suit:'C', value:'10' });
    expect(container.querySelectorAll('.value-black').length).toEqual(2);
    expect(await screen.queryAllByText('10').length).toEqual(2);
    expect(container.querySelectorAll('svg').length).toEqual(3);
  });
  test('renders Q of Diamonds', async() => {
    const {container} = setup({ suit:'D', value:'Q' });
    expect(container.querySelectorAll('.value-red').length).toEqual(2);
    expect(await screen.queryAllByText('Q').length).toEqual(2);
    expect(container.querySelectorAll('svg').length).toEqual(3);
  });
  test('renders card back', () => {
    const {container} = setup({ shown: false });
    expect(container.querySelectorAll('svg').length).toEqual(1);
    expect(container.querySelectorAll('rect').length).toEqual(2);
  });
  test('renders card rotated', () => {
    const {container} = setup({ rotation: 245 });
    expect(container.querySelector('.card-display').style.rotate).toEqual('245deg');
  });
  test('renders card zoomed', () => {
    const {container} = setup({ zoom: 245 });
    expect(container.querySelector('.card-display')).toHaveStyle({
      transform: `scale(2.45)`,
    });
  });
  test('render card with proper placement', () => {
    const {container} = setup({
      xLocation: 1000,
      yLocation: -2000,
      zLocation: 123
    });
    expect(container.querySelector('.lavpin-playing-card')).toHaveStyle({
      left: "1000px",
      top: "-2000px",
      zIndex: 123
    });
  });
  test('render inactive card', async() => {
    const {container} = setup({
      active: false
    });
    expect(container.querySelectorAll('rect[fill="#afafaf"]').length).toEqual(1);
    expect(container.querySelectorAll('rect[fill="#eee"]').length).toEqual(0);
  });
  test('render with modified colors and proper mouseEnter and mouseExit color changes', async() => {
    const {container} = setup({
      frontColor: '#f00',
      rolloverColor: '#0f0',
    });
    expect(container.querySelectorAll('rect[fill="#f00"]').length).toEqual(1);
    expect(container.querySelectorAll('rect[stroke="#aaa"]').length).toEqual(1);
    fireEvent.mouseEnter(container.querySelector('.card-body'));
    expect(container.querySelectorAll('rect[stroke="#0f0"]').length).toEqual(1);
    fireEvent.mouseLeave(container.querySelector('.card-body'));
    expect(container.querySelectorAll('rect[stroke="#aaa"]').length).toEqual(1);
  });
  test('card does not call callback function if clicked while clickable is false', () => {
    const {container} = setup({
      clickable: false
    });
    expect(container.querySelectorAll('.card-body.clickable').length).toEqual(0);
    fireEvent.click(container.querySelector('.card-body'));
    expect(mockHandleCard).toHaveBeenCalledTimes(0);
  });
  test('card does call callback function, with index, if clicked while clickable is true', () => {
    const {container} = setup({
      index: 3,
      clickable: true,
      suit: 'S',
      value: 'A'
    });
    expect(container.querySelectorAll('.card-body.clickable').length).toEqual(1);
    fireEvent.click(container.querySelector('.card-body'));
    expect(mockHandleCard).toHaveBeenCalledWith(3, 'SA');
  });
});
