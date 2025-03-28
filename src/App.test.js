import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the image comparison slider heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/image comparison slider/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders with correct styling', () => {
    const { container } = render(<App />);
    const appContainer = container.firstChild;

    expect(appContainer).toHaveStyle({
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    });
  });

  test('renders heading with correct HTML tag', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});