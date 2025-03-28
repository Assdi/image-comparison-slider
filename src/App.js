import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

function App() {
  return (
    <AppContainer>
      <h1>Image Comparison Slider</h1>
    </AppContainer>
  );
}

export default App;
