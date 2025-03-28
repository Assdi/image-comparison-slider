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
  clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
`;

const Divider = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  background-color: #fff;
  transform: translateX(-50%);
  cursor: ew-resize;
`;

const ComparisonSlider = ({ beforeImage, afterImage }) => {
  return (
    <SliderContainer>
      <ImageContainer>
        <BeforeImage src={beforeImage} alt="Before" />
        <AfterImage src={afterImage} alt="After" />
      </ImageContainer>
      <Divider data-testid="slider-divider" />
    </SliderContainer>
  );
};

export default ComparisonSlider;
