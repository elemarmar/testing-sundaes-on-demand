import { render, screen } from '../../../test-utils/testing-library-utils';
import { rest } from 'msw';
import { server } from '../../../mocks/server';
import OrderConfirmation from '../OrderConfirmation';

test('show error message when order fetch fails', async () => {
  // Override post handler
  server.resetHandlers(
    rest.post('http://localhost:3030/order', (req, res, ctx) =>
      res(ctx.status(500))
    )
  );
  render(<OrderConfirmation setOrderPhase={jest.fn()} />);

  const errorMessage = await screen.findByText(
    'An unexpected error occured. Please try again later.'
  );
  expect(errorMessage).toBeInTheDocument();
});
