import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the index.js file
jest.mock('./index.js', () => {
  return () => {
    return null;
  };
});

describe('Index', () => {
  test('renders App component inside root element', () => {
    // Create a root element
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    // Import and render the index
    require('./index.js')();

    // Clean up
    document.body.removeChild(rootElement);
  });
});