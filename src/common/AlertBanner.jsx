import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function AlertBanner({ message, variant = 'danger' }) {
  const alertMessage =
    message || 'An unexpected error occured. Please try again later.';

  return (
    <div>
      <Alert variant={variant} style={{ backgroundcolor: 'red' }}>
        {alertMessage}
      </Alert>
    </div>
  );
}
