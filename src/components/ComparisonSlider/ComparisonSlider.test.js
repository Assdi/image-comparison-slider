import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import 'jest-styled-components';
import ComparisonSlider from './ComparisonSlider';

describe('ComparisonSlider', () => {
  const mockProps = {
    beforeImage: 'before-image-url.jpg',
    afterImage: 'after-image-url.jpg'
  };

  const setupComponent = () => {
    const utils = render(<ComparisonSlider {...mockProps} />);
    const divider = utils.getByTestId('slider-divider');
    const container = utils.container.firstChild;
    return { ...utils, divider, container };
  };

  test('renders both before and after images', () => {
    const { getByRole } = setupComponent();
    
    const beforeImage = getByRole('img', { name: /before/i });
    const afterImage = getByRole('img', { name: /after/i });
    
    expect(beforeImage).toBeInTheDocument();
    expect(afterImage).toBeInTheDocument();
    expect(beforeImage).toHaveAttribute('src', mockProps.beforeImage);
    expect(afterImage).toHaveAttribute('src', mockProps.afterImage);
  });

  test('initializes with default slider position', () => {
    const { getByTestId } = setupComponent();
    const divider = getByTestId('slider-divider');
    expect(divider).toHaveStyleRule('left', '50%');
  });

  test('handles mouse down event', () => {
    const { divider } = setupComponent();
    fireEvent.mouseDown(divider);
    expect(divider).toBeInTheDocument();
  });

  test('handles mouse move event when dragging', () => {
    const { divider, container } = setupComponent();
    
    // Mock getBoundingClientRect
    const mockRect = {
      left: 0,
      width: 800,
      right: 800,
      top: 0,
      bottom: 400,
      height: 400
    };
    container.getBoundingClientRect = jest.fn(() => mockRect);

    // Start dragging
    fireEvent.mouseDown(divider);
    
    // Move mouse to 75% of container width
    fireEvent.mouseMove(document, {
      clientX: mockRect.width * 0.75
    });
    
    // Check if divider position is approximately 75%
    expect(divider).toHaveStyleRule('left', '75%');
  });

  test('handles mouse up event to stop dragging', () => {
    const { divider } = setupComponent();
    
    fireEvent.mouseDown(divider);
    fireEvent.mouseUp(document);
    
    // Try moving after mouse up
    fireEvent.mouseMove(document, { clientX: 500 });
    expect(divider).toHaveStyleRule('left', '50%');
  });

  test('handles touch events', () => {
    const { divider } = setupComponent();
    
    fireEvent.touchStart(divider);
    fireEvent.touchMove(document, {
      touches: [{ clientX: 400 }]
    });
    fireEvent.touchEnd(document);
    
    expect(divider).toBeInTheDocument();
  });

  test('bounds checking prevents slider from going out of range', () => {
    const { divider, container } = setupComponent();
    const rect = container.getBoundingClientRect();
    
    fireEvent.mouseDown(divider);
    
    // Try moving beyond container
    fireEvent.mouseMove(document, {
      clientX: rect.left + rect.width + 100
    });
    
    expect(divider).toHaveStyleRule('left', '100%');
  });

  test('cleanup removes event listeners on unmount', () => {
    const { unmount } = setupComponent();
    unmount();
    
    // Verify no errors when triggering events after unmount
    fireEvent.mouseMove(document, { clientX: 500 });
    fireEvent.mouseUp(document);
  });

  test('handles keyboard arrow controls', () => {
    const { divider } = setupComponent();
    
    // Test left arrow
    fireEvent.keyDown(divider, { key: 'ArrowLeft' });
    expect(divider).toHaveStyleRule('left', '49%');
    
    // Test right arrow
    fireEvent.keyDown(divider, { key: 'ArrowRight' });
    expect(divider).toHaveStyleRule('left', '50%');
  });

  test('shows percentage indicator while dragging', () => {
    const { getByTestId, divider } = setupComponent();
    
    // Start dragging
    fireEvent.mouseDown(divider);
    
    const indicator = getByTestId('percentage-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle({ opacity: '1' });
    expect(indicator).toHaveTextContent('50%');
  });

  test('applies correct ARIA attributes', () => {
    const { divider } = setupComponent();
    
    expect(divider).toHaveAttribute('role', 'slider');
    expect(divider).toHaveAttribute('aria-valuemin', '0');
    expect(divider).toHaveAttribute('aria-valuemax', '100');
    expect(divider).toHaveAttribute('aria-valuenow', '50');
    expect(divider).toHaveAttribute('aria-label', 'Image comparison slider');
  });

  test('applies drag styling when dragging', () => {
    const { divider } = setupComponent();
    
    fireEvent.mouseDown(divider);
    expect(divider).toHaveStyleRule('opacity', '1');
    
    fireEvent.mouseUp(document);
    expect(divider).toHaveStyleRule('opacity', '0.8');
  });

  test('container has correct hover styles', () => {
    const { container } = setupComponent();
    const sliderContainer = container.firstChild;
    
    // Test that container exists and has position absolute
    expect(sliderContainer).toBeInTheDocument();
    expect(sliderContainer).toHaveStyleRule('position', 'absolute');
  });

  test('applies correct styles when dragging', () => {
    const { divider } = setupComponent();
    
    fireEvent.mouseDown(divider);
    expect(divider).toHaveStyle({ opacity: 1 });
    
    fireEvent.mouseUp(document);
    expect(divider).toHaveStyle({ opacity: 0.8 });
  });
});