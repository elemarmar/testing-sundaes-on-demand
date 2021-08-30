import { render } from '@testing-library/react';

import { OrderDetailsProvider } from '../contexts/OrderDetails';

// Custom render
const renderWithContext = (ui, options) =>
  render(ui, {
    wrapper: OrderDetailsProvider,
    ...OrderDetailsProvider.options,
  });

// r-export everything
export * from '@testing-library/react';

// override render method
export { renderWithContext as render };
