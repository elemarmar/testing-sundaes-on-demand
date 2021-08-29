import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryForm from '../SummaryForm';

test('Initial conditions', () => {
  render(<SummaryForm />);
  const checkboxElement = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });
  expect(checkboxElement).not.toBeChecked();

  const buttonElement = screen.getByRole('button', {
    name: /confirm order/i,
  });
  expect(buttonElement).toBeDisabled();
});
test('Checkbox disables button on first click and enables on second click', () => {
  render(<SummaryForm />);
  const checkboxElement = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });
  const buttonElement = screen.getByRole('button', {
    name: /confirm order/i,
  });
  // clicking checkbox once enables button
  userEvent.click(checkboxElement);
  expect(buttonElement).toBeEnabled();

  // clicking checkbox a second time disables the button
  userEvent.click(checkboxElement);
  expect(buttonElement).toBeDisabled();
});
