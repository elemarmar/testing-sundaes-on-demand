import {
  render,
  screen,
  waitFor,
} from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Options from '../Options';
import OrderEntry from '../OrderEntry';

test('update scoop subtotal when scoops change', async () => {
  render(<Options optionType="scoops" />);

  // make sure total starts out at $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });
  expect(scoopsSubtotal).toHaveTextContent('0.00');

  // update vanilla scoops to 1 and check subtotal
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');
  expect(scoopsSubtotal).toHaveTextContent('2.00');

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');
  expect(scoopsSubtotal).toHaveTextContent('6.00');
});
test('update toppings subtotal when toppings change', async () => {
  render(<Options optionType="toppings" />);

  // make sure starts out at 0.00
  const toppingsSubtotal = screen.getByText('Toppings total: $', {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent('0.00');

  // tick one option and assert updated subtotal
  const mAndMCheckbox = await screen.findByRole('checkbox', { name: 'M&Ms' });
  userEvent.click(mAndMCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('1.50');

  // tick another option and assert updated subtotal
  const hotFudgeCheckbox = await screen.findByRole('checkbox', {
    name: 'Hot fudge',
  });
  userEvent.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('3.00');

  // tick one box off and assert updated subtotal (removed)
  userEvent.click(mAndMCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('1.50');
});
describe('grand total', () => {
  test('grand total updates properly if scoop is added first', async () => {
    render(<OrderEntry />);
    const totalElement = screen.getByRole('heading', {
      name: /grand total: \$/i,
    });

    // grand total starts out at 0.00
    expect(totalElement).toHaveTextContent('0.00');

    // update chocolate scoops to 2 and check grand total
    const chocolateInput = await screen.findByRole('spinbutton', {
      name: 'Chocolate',
    });
    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, '2');
    expect(totalElement).toHaveTextContent('4.00');

    // tick M&Ms topping and check grand total
    const mAndMCheckbox = await screen.findByRole('checkbox', {
      name: 'M&Ms',
    });
    userEvent.click(mAndMCheckbox);
    expect(totalElement).toHaveTextContent('5.50');
  });
  test('grand total updates properly if topping is added first', async () => {
    render(<OrderEntry />);
    const totalElement = screen.getByRole('heading', {
      name: /grand total: \$/i,
    });
    // tick M&Ms topping and check grand total
    const mAndMCheckbox = await screen.findByRole('checkbox', {
      name: 'M&Ms',
    });
    userEvent.click(mAndMCheckbox);
    expect(totalElement).toHaveTextContent('1.50');

    // update chocolate scoops to 2 and check grand total
    const chocolateInput = await screen.findByRole('spinbutton', {
      name: 'Chocolate',
    });
    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, '2');
    expect(totalElement).toHaveTextContent('5.50');
  });
  test('grand total updates properly if an item is removed', async () => {
    render(<OrderEntry />);
    const totalElement = screen.getByRole('heading', {
      name: /grand total: \$/i,
    });

    // add M&Ms
    const mAndMCheckbox = await screen.findByRole('checkbox', {
      name: 'M&Ms',
    });
    userEvent.click(mAndMCheckbox);

    // update chocolate scoops to 2; grand total should be $5.50
    const chocolateInput = await screen.findByRole('spinbutton', {
      name: 'Chocolate',
    });
    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, '2');

    // remove 1 scoop of chocolate and check grand total
    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, '1');
    expect(totalElement).toHaveTextContent('3.50');
  });
});
