// We don't need to import it from our custom file because App already
// wraps
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

test('Order phases for happy path', async () => {
  // 1. render the app
  render(<App />);

  // 2. add ice cream scoops and toppings
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });
  const hotFudgeCheckbox = await screen.findByRole('checkbox', {
    name: 'Hot fudge',
  });

  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');
  userEvent.click(hotFudgeCheckbox);

  // 3. find and click order button
  const orderButton = await screen.findByRole('button', {
    name: /order sundae/i,
  });
  userEvent.click(orderButton);

  // 4. check summary information based on order
  const scoopsSummary = screen.getByRole('heading', {
    name: 'Scoops: $4.00',
  });
  expect(scoopsSummary).toBeInTheDocument();

  const toppingsSummary = screen.getByRole('heading', {
    name: 'Toppings: $1.50',
  });
  expect(toppingsSummary).toBeInTheDocument();

  // Check summary option items
  const optionItems = screen.getAllByRole('listitem');
  const optionItemsText = optionItems.map((item) => item.textContent);
  expect(optionItemsText).toEqual(['2 Chocolate', 'Hot fudge']);

  // 5. accept terms and conditions and click button confirm order
  const termsAndConditionsCheckbox = await screen.findByRole('checkbox', {
    name: /terms and conditions/i,
  });
  userEvent.click(termsAndConditionsCheckbox);

  const confirmOrderButton = await screen.findByRole('button', {
    name: /confirm order/i,
  });
  userEvent.click(confirmOrderButton);

  // 6.1. Confirm "Loading" message displays and disappears after orderNumber has been fetched
  const LoadingText = screen.getByText('Loading');
  expect(LoadingText).toBeInTheDocument();

  // 6.2 confirm order number on confirmation page
  // this one is async because there is a POST request to serve in between
  const thankYouHeader = await screen.findByRole('heading', {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  // loading is no longer in screen
  const notLoading = screen.queryByText('Loading');
  expect(notLoading).not.toBeInTheDocument();

  const randomOrderNumber = await screen.findByText(/order number/i);
  expect(randomOrderNumber).toBeInTheDocument();

  // 7. click "new order" button on confirmation page
  const newOrderButton = await screen.findByRole('button', {
    name: /new order/i,
  });
  userEvent.click(newOrderButton);

  // 8. check that scoops and toppings subtotals have been reset
  const scoopsTotal = await screen.findByText('Scoops total: $0.00');
  const toppingsTotal = await screen.findByText('Toppings total: $0.00');
  expect(scoopsTotal).toBeInTheDocument();
  expect(toppingsTotal).toBeInTheDocument();

  // Do we need to await anything to avoid test errors ?
  await screen.findByRole('spinbutton', { name: 'Chocolate' });
  await screen.findByRole('checkbox', { name: 'Hot fudge' });
});
test('no toppings appear in summary page if no toppings were selected', async () => {
  render(<App />);

  // Order only scoops
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');

  // Click on "order sundae" button
  const orderButton = await screen.findByRole('button', {
    name: /order sundae/i,
  });
  userEvent.click(orderButton);

  // expect only scoops title but no toppings title
  const scoopsSummary = screen.getByRole('heading', {
    name: 'Scoops: $4.00',
  });
  expect(scoopsSummary).toBeInTheDocument();

  const toppingsSummary = screen.queryByRole('heading', {
    name: /toppings/i,
  });
  expect(toppingsSummary).not.toBeInTheDocument();
});
