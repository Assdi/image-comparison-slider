import { useState, useRef, useEffect } from 'react';
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
`;

const ComparisonSlider = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

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

  return (
    <SliderContainer ref={containerRef}>
      <ImageContainer>
        <BeforeImage src={beforeImage} alt="Before" />
        <AfterImage
          src={afterImage}
          alt="After"
          sliderPosition={sliderPosition}
          style={{ transition: isDragging ? 'none' : 'clip-path 0.1s ease-out' }}
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

export default ComparisonSlider;
