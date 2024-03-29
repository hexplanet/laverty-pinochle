import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './index';

describe("Button Component", () => {
  const mockHandleClick = jest.fn();
  const setup = (propsOverwrite = {}) => {
    const props = {
      icon: null,
      buttonClass: '',
      status: '',
      label: '',
      returnMessage: '',
      handleClick: mockHandleClick,
      ...propsOverwrite
    }
    return render(<Button {...props} />);
  };
  test('renders button correctly', () => {
    const { container } = setup();
    expect(container.querySelectorAll('.lavpin-button').length).toEqual(1);
    expect(container.querySelectorAll('.inner-button').length).toEqual(1);
  });
  test('renders icon if icon given', () => {
    const { container } = setup({ icon: (<div className={'button-icon'} />)});
    expect(container.querySelectorAll('.button-icon').length).toEqual(1);
  });
  test('renders label if label given', async () => {
    setup({ label: 'Button Label'});
    expect(await screen.findByText('Button Label')).toBeVisible();
  });
  test('has additional class name if given', () => {
    const { container } = setup({ buttonClass: 'extra-button-class'});
    expect(container.querySelectorAll('.extra-button-class').length).toEqual(1);
  });
  test('renders disabled if status is inactive, does not click', async () => {
    const { container } = setup({ status: 'inactive'});
    expect(container.querySelectorAll('.inactive').length).toEqual(1);
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandleClick).toHaveBeenCalledTimes(0);
  });
  test('call be clicked if status is not inactive', () => {
    const { container } = setup({ returnMessage: 'hello' });
    expect(container.querySelectorAll('.inactive').length).toEqual(0);
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandleClick).toHaveBeenCalledWith('hello');
  });
})

