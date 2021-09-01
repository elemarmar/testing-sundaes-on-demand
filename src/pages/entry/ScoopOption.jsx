import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function ScoopOption({ name, imagePath, updateItemCount }) {
  const [isValid, setIsValid] = useState(true);

  const handlechange = (e) => {
    const currentValueFloat = parseFloat(e.target.value);
    const isValidNumber =
      0 <= currentValueFloat &&
      currentValueFloat <= 10 &&
      Math.floor(currentValueFloat) === currentValueFloat;

    if (isValidNumber) updateItemCount(name, e.target.value);

    setIsValid(isValidNumber);
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: 'center' }}>
      <img
        style={{ width: '75%' }}
        src={`http://localhost:3030/${imagePath}`}
        alt={`${name} scoop`}
      />
      <Form.Group
        controlId={`${name}-count`}
        as={Row}
        style={{ marginTop: '10px' }}
      >
        <Form.Label column xs="6" style={{ textAlign: 'right' }}>
          {name}
        </Form.Label>
        <Col xs="5" style={{ textAlign: 'left' }}>
          <Form.Control
            onChange={handlechange}
            type="number"
            defaultValue={0}
            isInvalid={!isValid}
          />
        </Col>
      </Form.Group>
    </Col>
  );
}
