import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const bigWiggle = keyframes`
  0% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(13deg);
  }
  100% {
    transform: rotate(15deg);
  }
`;

const littleWiggle = keyframes`
  0% {
    transform: translateX(0px) translateY(-1px) rotate(-18deg);
  }
  50% {
    transform: translateX(2px) translateY(0px) rotate(-16deg);
  }
  100% {
    transform: translateX(0px) translateY(-1px) rotate(-18deg);
  }
`;

const PlayerButton = styled.div`
  position: absolute;
  height: calc(1.5*20*100vw/1920);
  width: calc(1.5*20*100vw/1920);
  background: #E5D2C0;
  border: calc(1.5*3*100vw/1920) solid #343638;
  right: calc(1.5*15*100vw/1920);
  bottom: calc(1.5*15*100vw/1920);
  border-radius: 50%;
`;

const Player = styled.div`
  height: calc(1.5*195*100vw/1920);
  width: calc(1.5*220*100vw/1920);
  position: relative;
  background: #EB811F;
  border: calc(1.5*3*100vw/1920) solid #E5D2C0;
  border-radius: calc(1.5*8*100vw/1920);
`;

interface MusicDiscProps {
  isCounting: boolean;
}

const Disc = styled.svg`
  position: absolute;
  top: calc(1.5*20*100vw/1920);
  left: calc(1.5*20*100vw/1920);
  height: calc(1.5*150*100vw/1920);
  width: calc(1.5*150*100vw/1920);
  border-radius: 50%;
  background: #343638;
  border: calc(1.5*5*100vw/1920) solid #EB811F;
  box-shadow: 0 0 0 calc(1.5*3*100vw/1920) #E5D2C0;
  animation: ${({ isCounting }: MusicDiscProps) => (isCounting ? spin : '')} 1s linear infinite;
`;

const Eye = styled.div`
  content: "";
  position: absolute;
  height: calc(1.5*15*100vw/1920);
  width: calc(1.5*15*100vw/1920);
  background: #EB811F;
  border-radius: 50%;
  border: calc(1.5*3*100vw/1920) solid #343638;
  box-shadow: 0 0 0 calc(1.5*15*100vw/1920) #E5D2C0;
  top: calc(1.5*88*100vw/1920);
  left: calc(1.5*88*100vw/1920);
  z-index: 5;
`;

const StylusBase = styled.div`
  height: calc(1.5*20*100vw/1920);
  width: calc(1.5*20*100vw/1920);
  background: #343638;
  position: absolute;
  right: calc(1.5*20*100vw/1920);
  top: calc(1.5*20*100vw/1920);
  border-radius: 50%;
  border: calc(1.5*3*100vw/1920) solid #EB811F;
  box-shadow: 0 0 0 calc(1.5*3*100vw/1920) #343638;
  transform: rotate(14deg);
  animation: ${({ isCounting }: MusicDiscProps) => (isCounting ? bigWiggle : '')} 500ms infinite linear;
  &:after {
    content: "";
    position: absolute;
    top: calc(1.5*6*100vw/1920);
    left: 50%;
    border-radius: calc(1.5*3*100vw/1920);
    margin-left: -calc(1.5*3*100vw/1920);
    width: calc(1.5*6*100vw/1920);
    height: calc(1.5*80*100vw/1920);
    background: #E5D2C0;
    box-shadow: calc(1.5*2*100vw/1920) calc(1.5*2*100vw/1920) calc(1.5*10*100vw/1920) -calc(1.5*1*100vw/1920) #333;
  }
`;

const Stylus = styled.div`
  background: #E5D2C0;
  height: calc(1.5*12*100vw/1920);
  width: calc(1.5*18*100vw/1920);
  position: absolute;
  right: calc(1.5*55*100vw/1920);
  top: calc(1.5*102*100vw/1920);
  border-radius: calc(1.5*2*100vw/1920);
  transform: rotate(-15deg);
  box-shadow: calc(1.5*2*100vw/1920) calc(1.5*2*100vw/1920) calc(1.5*10*100vw/1920) 0px #333;
  animation: ${({ isCounting }: MusicDiscProps) => (isCounting ? littleWiggle : '')} 500ms infinite linear;
  &:after {
    content: "";
    position: absolute;
    left: calc(1.5*18*100vw/1920);
    height: calc(1.5*6*100vw/1920);
    width: calc(1.5*8*100vw/1920);
    top: calc(1.5*3*100vw/1920);
    background: #E5D2C0;
    border-radius: 0 calc(1.5*6*100vw/1920) calc(1.5*6*100vw/1920) 0;
  }
`;

function MusicDisc({ isCounting }: MusicDiscProps) {
  return (
    <Player>
      <PlayerButton />
      <Eye />
      <Disc isCounting={isCounting} width="150px" height="150px" viewBox="0 0 150 150" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Group" transform="translate(75.000000, 75.000000) scale(1, -1) translate(-75.000000, -75.000000) ">
            <path d="M75,150 C116.421356,150 150,116.421356 150,75 C150,33.5786438 116.421356,0 75,0 C33.5786438,0 0,33.5786438 0,75 C0,116.421356 33.5786438,150 75,150 Z" id="Oval-1" fill="#343638" />
            <path d="M27.7421875,75 C27.7421875,101.017578 51.7402344,122.183594 75,122.183594" id="Path-1" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" />
            <path d="M75,38.1484375 C75,58.4688144 93.4978363,75 111.426601,75" id="Path-1-Copy-3" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" transform="translate(93.213301, 56.574219) scale(-1, -1) translate(-93.213301, -56.574219) " />
            <path d="M38.0904708,75 C38.0904708,95.3203769 56.8335434,111.851562 75,111.851562" id="Path-1-Copy" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" />
            <path d="M75,27.8164062 C75,53.8339844 98.9980469,75 122.257812,75" id="Path-1-Copy-4" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" transform="translate(98.628906, 51.408203) scale(-1, -1) translate(-98.628906, -51.408203) " />
          </g>
        </g>
      </Disc>
      <StylusBase isCounting={isCounting} />
      <Stylus isCounting={isCounting} />
    </Player>
  );
}

export default MusicDisc;
