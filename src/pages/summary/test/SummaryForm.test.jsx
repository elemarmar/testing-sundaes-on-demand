import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
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
test('popover responds to hover', async () => {
  // popover starts out hidden
  render(<SummaryForm />);
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();

  // popover appears upon mouseover of checkbox label
  const checkboxElement = screen.getByText(/terms and conditions/i);
  userEvent.hover(checkboxElement);
  const popoverElement = screen.getByText(
    /no ice cream will actually be delivered/i
  );
  expect(popoverElement).toBeInTheDocument();

  // popover disappears when we mouse out
  userEvent.unhover(checkboxElement);
  // this works as an assertion on its own so we don't need the "expect" assertion
  await waitForElementToBeRemoved(() =>
    screen.queryByText(/no ice cream will actually be delivered/i)
  );
});
