import styled, { keyframes } from 'styled-components';

const load = keyframes`
  from {
    transform: scaleX(1.25);
  }
  to {
    transform: translateY(-5rem) scaleX(1);
  }
`;

const Background = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #fff;
`;

const LoadingDiv = styled.div`
  width: 15rem;
  height: 7.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
`;

const Dot = styled.div`
  font-size: 2rem;
  font-weight: 700;
  border-radius: 50%;
  color:#EB811F;
  animation: ${load} 0.5s alternate infinite;
  &:nth-child(2) {
  animation-delay: 0.16s;
  };
  &:nth-child(3) {
  animation-delay: 0.32s;
  };
  &:nth-child(4) {
  animation-delay: 0.48s;
  };
  &:nth-child(5) {
  animation-delay: 0.64s;
  };
  &:nth-child(6) {
  animation-delay: 0.8s;
  };
  &:nth-child(7) {
  animation-delay: 0.96s;
  };
`;

const Text = styled.span`
  font-size: 2rem;
  text-transform: uppercase;
  margin: auto;
`;

function Loading() {
  return (
    <Background>
      <LoadingDiv>
        <Dot>L</Dot>
        <Dot>O</Dot>
        <Dot>A</Dot>
        <Dot>D</Dot>
        <Dot>I</Dot>
        <Dot>N</Dot>
        <Dot>G</Dot>
        <Text>Please Wait...</Text>
      </LoadingDiv>
    </Background>
  );
}

export default Loading;
