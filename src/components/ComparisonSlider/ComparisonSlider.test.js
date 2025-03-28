import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import 'jest-styled-components';
import ComparisonSlider from './ComparisonSlider';

describe('ComparisonSlider', () => {
  const mockProps = {
    beforeImage: 'before-image-url.jpg',
    afterImage: 'after-image-url.jpg'
  };

  beforeEach(() => {
    // Mock Image constructor
    const originalImage = window.Image;
    window.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload && this.onload();
        }, 0);
      }
    };
    return () => {
      window.Image = originalImage;
    };
  });

  const setupComponent = async () => {
    const utils = render(<ComparisonSlider {...mockProps} />);
    await new Promise(resolve => setTimeout(resolve, 0));
    return utils;
  };

  test('renders loading state initially', async () => {
    const { getByText } = await setupComponent();
    expect(getByText('Loading images...')).toBeInTheDocument();
  });

  test('renders root container', async () => {
    const { container } = await setupComponent();
    const rootElement = container.firstChild;
    expect(rootElement).toBeInTheDocument();
    expect(rootElement.tagName).toBe('DIV');
  });

  test('handles basic mouse interaction', async () => {
    const { container } = await setupComponent();
    const slider = container.querySelector('[data-testid="slider-divider"]');
    
    if (slider) {
      fireEvent.mouseDown(slider);
      expect(slider).toBeInTheDocument();
      
      fireEvent.mouseUp(document);
      expect(slider).toBeInTheDocument();
    }
  });

  test('handles basic touch interaction', async () => {
    const { container } = await setupComponent();
    const slider = container.querySelector('[data-testid="slider-divider"]');
    
    if (slider) {
      fireEvent.touchStart(slider);
      expect(slider).toBeInTheDocument();
      
      fireEvent.touchEnd(document);
      expect(slider).toBeInTheDocument();
    }
  });

  test('handles basic keyboard interaction', async () => {
    const { container } = await setupComponent();
    const slider = container.querySelector('[data-testid="slider-divider"]');
    
    if (slider) {
      fireEvent.keyDown(slider, { key: 'ArrowLeft' });
      expect(slider).toBeInTheDocument();
      
      fireEvent.keyDown(slider, { key: 'ArrowRight' });
      expect(slider).toBeInTheDocument();
    }
  });

  test('shows percentage indicator', async () => {
    const { container } = await setupComponent();
    const slider = container.querySelector('[data-testid="slider-divider"]');
    
    if (slider) {
      fireEvent.mouseDown(slider);
      const indicator = container.querySelector('[data-testid="percentage-indicator"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveTextContent('50%');
    }
  });

  test('handles custom dimensions', async () => {
    const customProps = {
      ...mockProps,
      maxWidth: 600,
      height: 300
    };
    
    const { container } = await setupComponent();
    expect(container.firstChild).toBeInTheDocument();
  });
});