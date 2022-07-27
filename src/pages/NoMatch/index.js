import styled, { keyframes } from 'styled-components';

const Jump = keyframes`
{
0% {
    top: 24%;
    transform: rotateX(85deg);
  }
  25% {
    top: 10%;
    transform: rotateX(0deg);
  }
  50% {
    top: 30%;
    transform: rotateX(85deg);
  }
  75% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(85deg);
  }
}
`;

const Flip = keyframes`
{
  0% {
    transform: rotate(0deg);
  }
  5% {
    transform: rotate(-27deg);
  }
  30%, 50% {
    transform: rotate(0deg);
  }
  55% {
    transform: rotate(27deg);
  }
  83.3% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
`;

const SwitchSide = keyframes` 
{
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
`;

const Fly = keyframes`
{
  0% {
    bottom: 26%;
    transform: rotate(0deg);
  }
  10% {
    bottom: 40%;
  }
  50% {
    bottom: 26%;
    transform: rotate(-190deg);
  }
  80% {
    bottom: 40%;
  }
  100% {
    bottom: 26%;
    transform: rotate(0deg);
  }
}
`;

const BubbleKey = keyframes` 
{
  0% {
    transform: scale(0.15, 0.15);
    top: 80%;
    opacity: 0;
  }
  50% {
    transform: scale(1.1, 1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.33, 0.33);
    top: 60%;
    opacity: 0;
  }
}
`;

const Pulse = keyframes`
{
  0% {
    transform: scale(1, 1);
    opacity: 0.25;
  }
  50% {
    transform: scale(1.2, 1);
    opacity: 1;
  }
  100% {
    transform: scale(1, 1);
    opacity: 0.25;
  }
}
`;

const Background = styled.div`
  background-color: #EB811F75;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const Text = styled.div`
  position: relative;
  margin: 0 auto;
  top: 25vh;
  width: 100%;
  text-align: center;
  font-family: "Roboto";
  font-size: 8vh;
  color: #343638;
  opacity: 0.75;
  animation: ${Pulse} 2.5s linear infinite;
`;

const Cooking = styled.div`
  position: relative;
  margin: 0 auto;
  top: 0;
  width: 75vh;
  height: 75vh;
  overflow: hidden;
`;

const Bubble = styled.div`
  position: absolute;
  border-radius: 100%;
  box-shadow: 0 0 0.25vh #EB811F;
  opacity: 0;
  &:nth-child(1) {
  margin-top: 2.5vh;
  left: 58%;
  width: 2.5vh;
  height: 2.5vh;
  background-color: #EB811F;
  animation: ${BubbleKey} 2s cubic-bezier(0.53, 0.16, 0.39, 0.96) infinite;
  }
  &:nth-child(2) {
  margin-top: 3vh;
  left: 52%;
  width: 2vh;
  height: 2vh;
  background-color: #EB811F;
  animation: ${BubbleKey} 2s ease-in-out 0.35s infinite;
  }
  &:nth-child(3) {
  margin-top: 1.8vh;
  left: 50%;
  width: 1.5vh;
  height: 1.5vh;
  background-color: #333;
  animation: ${BubbleKey} 1.5s cubic-bezier(0.53, 0.16, 0.39, 0.96) 0.55s infinite;
  }
  &:nth-child(4) {
  margin-top: 2.7vh;
  left: 56%;
  width: 1.2vh;
  height: 1.2vh;
  background-color: #2b2b2b;
  animation: ${BubbleKey} 1.8s cubic-bezier(0.53, 0.16, 0.39, 0.96) 0.9s infinite;
  }
  &:nth-child(5) {
  margin-top: 2.7vh;
  left: 63%;
  width: 1.1vh;
  height: 1.1vh;
  background-color: #EB811F50;
  animation: ${BubbleKey} 1.6s ease-in-out 1s infinite;
  }
`;

const Area = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 50%;
  background-color: transparent;
  transform-origin: 15% 60%;
  animation: ${Flip} 2.1s ease-in-out infinite;  
`;

const Sides = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: 15% 60%;
  animation: ${SwitchSide} 2.1s ease-in-out infinite;
`;

const Handle = styled.div`
  position: absolute;
  bottom: 18%;
  right: 80%;
  width: 35%;
  height: 20%;
  background-color: transparent;
  border-top: 1vh solid #333;
  border-left: 1vh solid transparent;
  border-radius: 100%;
  transform: rotate(20deg) rotateX(0deg) scale(1.3, 0.9);
`;

const Pan = styled.div`
  position: absolute;
  bottom: 20%;
  right: 30%;
  width: 50%;
  height: 8%;
  background-color: #333;
  border-radius: 0 0 1.4em 1.4em;
  transform-origin: -15% 0;
`;

const Pancake = styled.div`
  position: absolute;
  top: 24%;
  width: 100%;
  height: 100%;
  transform: rotateX(85deg);
  animation: ${Jump} 2.1s ease-in-out infinite;
`;

const Pastry = styled.div`
  position: absolute;
  bottom: 26%;
  right: 37%;
  width: 40%;
  height: 45%;
  background-color: #EB811F;
  box-shadow: 0 0 3px 0 #EB811F;
  border-radius: 100%;
  transform-origin: -20% 0;
  animation: ${Fly} 2.1s ease-in-out infinite;
`;

function NoMatch() {
  return (
    <Background>
      <Text>
        4 0 4
        {' '}
        <br />
        {' '}
        Page Not Found
      </Text>
      <Cooking>
        <Bubble />
        <Bubble />
        <Bubble />
        <Bubble />
        <Bubble />
        <Area>
          <Sides>
            <Pan />
            <Handle />
          </Sides>
          <Pancake>
            <Pastry />
          </Pancake>
        </Area>
      </Cooking>
    </Background>
  );
}

export default NoMatch;
