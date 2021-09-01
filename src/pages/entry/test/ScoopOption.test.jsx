import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScoopOption from '../ScoopOption';

test('invalid scoop number makes input red', async () => {
  render(<ScoopOption name="" imagePath="" updateItemCount={jest.fn()} />);

  const scoopInput = screen.getByRole('spinbutton');

  // negative value gives error
  userEvent.clear(scoopInput);
  userEvent.type(scoopInput, '-1');
  expect(scoopInput).toHaveClass('is-invalid');

  // decimal value gives error
  userEvent.clear(scoopInput);
  userEvent.type(scoopInput, '1.5');
  expect(scoopInput).toHaveClass('is-invalid');

  // value higher than 10 gives error
  userEvent.clear(scoopInput);
  userEvent.type(scoopInput, '12');
  expect(scoopInput).toHaveClass('is-invalid');

  // no error if number between 0 and 10
  userEvent.clear(scoopInput);
  userEvent.type(scoopInput, '5');
  expect(scoopInput).not.toHaveClass('is-invalid');
});
