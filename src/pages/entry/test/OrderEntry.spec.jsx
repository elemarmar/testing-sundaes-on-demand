import {
  render,
  screen,
  waitFor,
} from '../../../test-utils/testing-library-utils';
import OrderEntry from '../OrderEntry';
import { rest } from 'msw';
import { server } from '../../../mocks/server';
import userEvent from '@testing-library/user-event';

test('handles error for scoops and toppings routes', async () => {
  server.resetHandlers(
    rest.get('http://localhost:3030/scoops', (req, res, ctx) =>
      res(ctx.status(500))
    ),
    rest.get('http://localhost:3030/toppings', (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderEntry setOrderPhase={jest.fn()} />);
  await waitFor(async () => {
    const alerts = await screen.findAllByRole('alert');
    expect(alerts).toHaveLength(2);
  });
});
test('order sundae button is disabled if no scoops are selected', async () => {
  render(<OrderEntry setOrderPhase={jest.fn()} />);

  // Button is disabled before choosing scoops
  let orderButton = await screen.findByRole('button', {
    name: /order sundae/i,
  });
  expect(orderButton).toBeDisabled();

  // Add ice cream scoops and enable button
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');
  expect(orderButton).toBeEnabled();

  // Removing scoops disables button again
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '0');

  expect(orderButton).toBeDisabled();

  // Adding Toppings but no scoops keeps the button disabled
  const hotFudgeCheckbox = await screen.findByRole('checkbox', {
    name: 'Hot fudge',
  });
  userEvent.click(hotFudgeCheckbox);
  expect(orderButton).toBeDisabled();

  // Adding scoops and toppings enables button
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');
  expect(orderButton).toBeEnabled();
});
