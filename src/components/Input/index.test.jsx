import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './index';

describe("Input Component", () => {
  const mockHandleChange = jest.fn();
  const mockHandleEnter = jest.fn();
  const mockHandleFocus = jest.fn();
  const setup = (propsOverwrite = {}) => {
    const props = {
      id: '',
      inputType: 'text',
      inputCLass: '',
      width: 200,
      maxChars: 15,
      label: '',
      labelWidth: 0,
      value: '',
      prompt: '',
      status: 'active',
      handleChange: null,
      handleEnter: null,
      handleFocus: mockHandleFocus,
      ...propsOverwrite
    }
    return render(<Input {...props} />);
  };
  test('renders basic input correctly', () => {
    const { container } = setup();
    expect(container.querySelector('.lavpin-input')).toBeDefined();
    expect(container.querySelector('.input-container')).toBeDefined();
    expect(container.querySelector('.input-element')).toBeDefined();
    expect(container.querySelector('input')).toHaveStyle({ width: '200px' });
    expect(container.querySelector('input')).toHaveProperty('type', 'text');
    expect(container.querySelector('input')).toHaveProperty('placeholder', '');
    expect(container.querySelector('input')).toHaveProperty('value', '');
    expect(container.querySelector('input')).toHaveProperty('disabled', false);
  });
  test('renders label if label given with a width of 300px', async () => {
    const { container } = setup({ label: 'Input Label', labelWidth: 300 });
    expect(await screen.findByText('Input Label')).toBeVisible();
    expect(await screen.findByText('Input Label')).toHaveStyle({
      width: '300px'
    });
  });
  test('renders additional class name if given', async () => {
    const { container } = setup({ inputClass: 'extra-input-class'});
    expect(container.querySelector('.extra-input-class')).toBeDefined();
  });
  test('renders placeholder if given', async () => {
    const { container } = setup({ prompt: 'Enter Text'});
    expect(container.querySelector('input')).toHaveProperty('placeholder', 'Enter Text');
  });
  test('renders input type to be checkbox', async () => {
    const { container } = setup({ inputType: 'checkbox'});
    expect(container.querySelector('input')).toHaveProperty('type', 'checkbox');
  });
  test('renders currentValue is the value of the input', () => {
    const { container } = setup({ value: 'Current Value'});
    expect(container.querySelector('input')).toHaveProperty('value', 'Current Value');
  });
  test('renders input with selected width', () => {
    const { container } = setup({ width: 600});
    expect(container.querySelector('input')).toHaveStyle({ width: '600px' });
  });
  test('renders input as disabled if the status is inactive', () => {
    const { container } = setup({ status: 'inactive' });
    expect(container.querySelector('input')).toHaveProperty('disabled', true);
  });
  test('Sends callback to parent if the input is focused or blurred', () => {
    const { container } = setup({ id: 'testInput', status: 'inactive' });
    fireEvent.focus(container.querySelector('input'));
    expect(mockHandleFocus).toHaveBeenCalledWith('testInput', true);
    fireEvent.blur(container.querySelector('input'));
    expect(mockHandleFocus).toHaveBeenCalledWith('testInput', false);
  });
  test('Sends callback to parent if value changed', () => {
    const { container } = setup({ id: 'justChange', handleChange: mockHandleChange });
    fireEvent.change(container.querySelector('input'),{
      target: { value: 'test' }
    });
    expect(mockHandleChange).toHaveBeenCalledWith('justChange', 'test');
  });
  test('Does not send callback to parent if enter pressed and not focused', () => {
    const { container } = setup({ handleEnter: mockHandleEnter });
    fireEvent.change(container.querySelector('input'),{
      target: { value: 'entered text' }
    });
    document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode': 13}));
    expect(mockHandleEnter).toHaveBeenCalledTimes(0);
  });
  test('Sends callback to parent if enter pressed', async () => {
    const { container } = setup({ id: 'enterCallbackTest', handleEnter: mockHandleEnter });
    fireEvent.change(container.querySelector('input'),{
      target: { value: 'entered text' }
    });
    fireEvent.focus(container.querySelector('input'));
    document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode': 13}));
    expect(mockHandleEnter).toHaveBeenCalledWith('enterCallbackTest', 'entered text');
  });
  test('maxChars stops more than that number of characters from being entered ', async () => {
    const { container } = setup({ id: 'Max', handleChange: mockHandleChange, maxChars: 12 });
    fireEvent.change(container.querySelector('input'),{
      target: { value: '12345678901A' }
    });
    expect(mockHandleChange).toHaveBeenCalledWith('Max', '12345678901A');
    fireEvent.change(container.querySelector('input'),{
      target: { value: '12345678901AB' }
    });
    expect(mockHandleChange).toHaveBeenCalledWith('Max', '12345678901A');
  });
});