import React from 'react';
import { render } from '@testing-library/react';
import 'jest-styled-components';
import ComparisonSlider from './ComparisonSlider';

describe('ComparisonSlider', () => {
  const mockProps = {
    beforeImage: 'before-image-url.jpg',
    afterImage: 'after-image-url.jpg'
  };

  test('renders both before and after images', () => {
    const { getByRole } = render(<ComparisonSlider {...mockProps} />);
    
    const beforeImage = getByRole('img', { name: /before/i });
    const afterImage = getByRole('img', { name: /after/i });
    
    expect(beforeImage).toBeInTheDocument();
    expect(afterImage).toBeInTheDocument();
    expect(beforeImage).toHaveAttribute('src', mockProps.beforeImage);
    expect(afterImage).toHaveAttribute('src', mockProps.afterImage);
  });

  test('renders divider element', () => {
    const { container } = render(<ComparisonSlider {...mockProps} />);
    const divider = container.querySelector('[data-testid="slider-divider"]');
    expect(divider).toBeInTheDocument();
  });

  test('container has correct dimensions', () => {
    const { container } = render(<ComparisonSlider {...mockProps} />);
    const sliderContainer = container.firstChild;
    
    expect(sliderContainer).toHaveStyleRule('width', '100%');
    expect(sliderContainer).toHaveStyleRule('max-width', '800px');
    expect(sliderContainer).toHaveStyleRule('height', '400px');
  });

  test('images have correct styling', () => {
    const { getAllByRole } = render(<ComparisonSlider {...mockProps} />);
    const images = getAllByRole('img');
    
    images.forEach(img => {
      expect(img).toHaveStyleRule('position', 'absolute');
      expect(img).toHaveStyleRule('width', '100%');
      expect(img).toHaveStyleRule('height', '100%');
      expect(img).toHaveStyleRule('object-fit', 'cover');
    });
  });
});