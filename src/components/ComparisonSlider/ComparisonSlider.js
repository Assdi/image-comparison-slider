import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 480px) {
    height: 200px;
    border-radius: 4px;
  }

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:focus-within {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

const ImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const BeforeImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AfterImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  clip-path: polygon(
    ${(props) => props.sliderPosition}% 0,
    100% 0,
    100% 100%,
    ${(props) => props.sliderPosition}% 100%
  );
`;

const Divider = styled.div`
  position: absolute;
  top: 0;
  left: ${(props) => props.position}%;
  width: 4px;
  height: 100%;
  background-color: #fff;
  transform: translateX(-50%);
  cursor: ew-resize;
  transition: all 0.1s ease-out;
  opacity: ${(props) => (props.isDragging ? '1' : '0.8')};

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(${(props) => (props.isDragging ? 1.2 : 1)});
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: translate(-50%, -50%) scale(1.1);
  }

  @media (max-width: 480px) {
    width: 2px;

    &::after {
      width: 32px;
      height: 32px;
    }
  }
`;

const PercentageIndicator = styled.div`
  position: absolute;
  top: 20px;
  left: ${(props) => props.position}%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  opacity: ${(props) => (props.isVisible ? '1' : '0')};
  transition: opacity 0.2s ease;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 2px 6px;
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-align: center;
`;

const ComparisonSlider = ({ beforeImage, afterImage, maxWidth, height }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({ before: false, after: false });
  const [imageErrors, setImageErrors] = useState({ before: false, after: false });
  const containerRef = useRef(null);

  // Preload images
  useEffect(() => {
    const preloadImage = (src, type) => {
      const img = new Image();
      img.onload = () => setImagesLoaded((prev) => ({ ...prev, [type]: true }));
      img.onerror = () => setImageErrors((prev) => ({ ...prev, [type]: true }));
      img.src = src;
    };

    preloadImage(beforeImage, 'before');
    preloadImage(afterImage, 'after');
  }, [beforeImage, afterImage]);

  const handleKeyDown = (event) => {
    const step = 1;
    if (event.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - step));
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + step));
      event.preventDefault();
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const calculateSliderPosition = (clientX) => {
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = ((clientX - left) / width) * 100;
    return Math.min(Math.max(position, 0), 100);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const newPosition = calculateSliderPosition(event.clientX);
    setSliderPosition(newPosition);
  };

  const handleTouchMove = (event) => {
    if (!isDragging) return;
    const newPosition = calculateSliderPosition(event.touches[0].clientX);
    setSliderPosition(newPosition);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  const handleImageError = (type) => {
    setImageErrors((prev) => ({ ...prev, [type]: true }));
  };

  if (imageErrors.before || imageErrors.after) {
    return (
      <SliderContainer style={{ maxWidth, height }}>
        <ErrorMessage>
          Failed to load {imageErrors.before && imageErrors.after ? 'images' : 'image'}
        </ErrorMessage>
      </SliderContainer>
    );
  }

  if (!imagesLoaded.before || !imagesLoaded.after) {
    return (
      <SliderContainer style={{ maxWidth, height }}>
        <ErrorMessage>Loading images...</ErrorMessage>
      </SliderContainer>
    );
  }

  return (
    <SliderContainer ref={containerRef} style={{ maxWidth, height }}>
      <ImageContainer>
        <BeforeImage src={beforeImage} alt="Before" onError={() => handleImageError('before')} />
        <AfterImage
          src={afterImage}
          alt="After"
          sliderPosition={sliderPosition}
          style={{ transition: isDragging ? 'none' : 'clip-path 0.1s ease-out' }}
          onError={() => handleImageError('after')}
        />
      </ImageContainer>
      <Divider
        data-testid="slider-divider"
        position={sliderPosition}
        isDragging={isDragging}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuenow={sliderPosition}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Image comparison slider"
      />
      <PercentageIndicator
        data-testid="percentage-indicator"
        position={sliderPosition}
        isVisible={isDragging}
      >
        {Math.round(sliderPosition)}%
      </PercentageIndicator>
    </SliderContainer>
  );
};

ComparisonSlider.propTypes = {
  beforeImage: PropTypes.string.isRequired,
  afterImage: PropTypes.string.isRequired,
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ComparisonSlider.defaultProps = {
  maxWidth: 800,
  height: 400,
};

export default ComparisonSlider;
