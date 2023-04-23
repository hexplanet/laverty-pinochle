import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './index';
import Input from '../Input/index';
import { MODAL_AUTO_CENTER_VALUE } from '../../utils/constants';

describe("Modal Component", () => {
  const mockHandleCloseModal = jest.fn();
  const mockHandleModalInput = jest.fn();
  const setup = (propsOverwrite = {}) => {
    const props = {
      xLocation: MODAL_AUTO_CENTER_VALUE,
      yLocation: MODAL_AUTO_CENTER_VALUE,
      zLocation: 1000,
      zoom: 50,
      width: 400,
      height: 200,
      hasBlocker: false,
      hasCloseButton: true,
      hasBox: true,
      boxStyleClass: '',
      header: '',
      hasHeaderSeparator: false,
      message: '',
      textInputs: [],
      buttons: [],
      handleCloseModal: mockHandleCloseModal,
      handleModalInput: mockHandleModalInput,
      ...propsOverwrite
    }
    return render(<Modal {...props} />);
  };
  test('renders basic modal correctly', () => {
    const { container } = setup();
    expect(container.querySelector('.lavpin-modal')).toBeDefined();
    expect(container.querySelector('.modal-box')).toBeDefined();
    expect(container.querySelector('.header-line')).toBeDefined();
    expect(container.querySelector('.box-container')).toBeDefined();
    expect(container.querySelector('.box-transition')).toBeDefined();
    expect(container.querySelector('.x-button')).toBeDefined();
    expect(container.querySelector('.message-area')).toBeDefined();
    expect(container.querySelector('.box-container')).toHaveStyle({
      height: '200px',
      width: '400px',
      left: '512px',
      top: '384px',
      zIndex: 1000
    });
    expect(container.querySelector('.box-transition')).toHaveStyle({
      transform: 'scale(0.5)',
    });
    expect(container.querySelector('.modal-box')).toHaveStyle({
      left: '-200px',
      top: '-100px',
      height: '200px',
      width: '400px',
    });
  });
  test('renders at proper location', () => {
    const { container } = setup({
      xLocation: 100,
      yLocation: 200,
      zLocation: 300,
    });
    expect(container.querySelector('.box-container')).toHaveStyle({
      left: '100px',
      top: '200px',
      zIndex: 300
    });
  });
  test('renders with proper width and height', () => {
    const { container } = setup({
      width: 1001,
      height: 2001,
    });
    expect(container.querySelector('.box-container')).toHaveStyle({
      width: '1001px',
      height: '2001px'
    });
  });
  test('renders with proper scale', () => {
    const { container } = setup({
      zoom: 150,
    });
    expect(container.querySelector('.box-transition')).toHaveStyle({
      transform: 'scale(1.5)',
    });
  });
  test('renders with a click blocker behind the modal that no clicks get through', () => {
    const mockMouseEventStopPropagation = jest.spyOn(MouseEvent.prototype, 'stopPropagation');
    const { container } = setup({
      hasBlocker: true,
      zLocation: 700,
    });
    expect(container.querySelector('.blocker')).toBeDefined();
    expect(container.querySelector('.blocker')).toHaveStyle({
      zIndex: 700,
    });
    fireEvent.click(container.querySelector('.blocker'));
    expect(mockMouseEventStopPropagation).toHaveBeenCalled()
    jest.resetAllMocks();
  });
  test('able to click the close button', () => {
    const { container } = setup();
    fireEvent.click(container.querySelector('.x-button button'));
    expect(mockHandleCloseModal).toHaveBeenCalled();
  });
  test('renders without the close if hasCloseButton is false', () => {
    const { container } = setup({ hasCloseButton: false });
    expect(container.querySelector('.x-button')).toEqual(null);
  });
  test('renders without a background box if hasBox is false', () => {
    const { container } = setup({ hasBox: false });
    expect(container.querySelector('.transparent-box')).toBeDefined();
  });
  test('renders with additional class name', () => {
    const { container } = setup({ boxStyleClass: 'extra-modal-style' });
    expect(container.querySelector('.extra-modal-style')).toBeDefined();
  });
  test('renders header from a string', async() => {
    setup({ header: 'Header Title' });
    expect(await screen.findByText('Header Title')).toBeVisible();
  });
  test('renders header from HTML with dividing line', async() => {
    const { container } = setup({
      header: (<span className={'sub-header'}>Span Text</span>),
      hasHeaderSeparator: true
    });
    expect(container.querySelector('.sub-header')).toBeDefined();
    expect(container.querySelector('.header-separator')).toBeDefined();
    expect(await screen.findByText('Span Text')).toBeVisible();
  });
  test('renders message from a string', async() => {
    setup({ header: 'Message Line' });
    expect(await screen.findByText('Message Line')).toBeVisible();
  });
  test('renders message from HTML', async() => {
    const { container } = setup({
      message: (<span className={'message-class'}>Message Span Text</span>),
    });
    expect(container.querySelector('.message-class')).toBeDefined();
    expect(await screen.findByText('Message Span Text')).toBeVisible();
  });
  test('renders Input components from parent and receives callback', async () => {
    const inputChange = jest.fn();
    const inputComponents = [
      <Input id={'input1'} handleChange={inputChange} key={'inputComponent1'} inputCLass={'input-field-1'} />,
      <Input id={'input2'} handleChange={inputChange} key={'inputComponent2'} inputCLass={'input-field-2'} />
    ];
    const { container } = setup({
      textInputs: inputComponents
    });
    expect(container.querySelectorAll('.lavpin-input').length).toEqual(2);
    fireEvent.change(container.querySelectorAll('input')[0],{
      target: { value: 'entered for 1' }
    });
    expect(inputChange).toHaveBeenCalledWith('input1', 'entered for 1');
    fireEvent.change(container.querySelectorAll('input')[1],{
      target: { value: 'entered for 2' }
    });
    expect(inputChange).toHaveBeenCalledWith('input2', 'entered for 2');
  });
  test('renders Button components and sends callback', async () => {
    const buttonComponentData = [
      { returnMessage: 'clickButton1', label: 'Click Me' },
      { returnMessage: 'clickButton2', label: 'No, click me!'}
    ];
    const { container } = await setup({
      buttons: buttonComponentData
    });
    expect(container.querySelectorAll('.lavpin-button').length).toEqual(3);
    fireEvent.click(container.querySelectorAll('.inner-button')[1]);
    expect(mockHandleModalInput).toHaveBeenCalledWith('button', 'click', 'clickButton1');
    fireEvent.click(container.querySelectorAll('.inner-button')[2]);
    expect(mockHandleModalInput).toHaveBeenCalledWith('button', 'click', 'clickButton2');
  });
  test('repositions modal if centered on a resize', async () => {
    const { container } = await setup({});
    expect(container.querySelector('.box-container')).toHaveStyle({
      height: '200px',
      width: '400px',
      left: '512px',
      top: '384px',
      zIndex: 1000
    });
    window.innerWidth = 4000;
    window.innerHeight = 3000;
    fireEvent.resize(window);
    expect(container.querySelector('.box-container')).toHaveStyle({
      height: '200px',
      width: '400px',
      left: '2000px',
      top: '1500px',
      zIndex: 1000
    });
  });
});