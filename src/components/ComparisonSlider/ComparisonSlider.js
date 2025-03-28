import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 400px;
  overflow: hidden;
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

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
  }
`;

const ComparisonSlider = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

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
        <AfterImage src={afterImage} alt="After" sliderPosition={sliderPosition} />
      </ImageContainer>
      <Divider
        data-testid="slider-divider"
        position={sliderPosition}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      />
    </SliderContainer>
  );
};

export default ComparisonSlider;
