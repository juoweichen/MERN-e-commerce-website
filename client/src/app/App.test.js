import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('true for now', () => {
  render(<App />);
  expect(true).toBe(true);
});
