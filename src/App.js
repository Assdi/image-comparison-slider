import styled from 'styled-components';
import ComparisonSlider from './components/ComparisonSlider/ComparisonSlider';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
`;

function App() {
  return (
    <AppContainer>
      <h1>Image Comparison Slider</h1>
      <ComparisonSlider
        beforeImage="https://picsum.photos/800/400?random=1"
        afterImage="https://picsum.photos/800/400?random=2"
      />
    </AppContainer>
  );
}

export default App;
