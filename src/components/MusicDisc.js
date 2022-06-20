import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

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
  height: 20px;
  width: 20px;
  background: #E5D2C0;
  border: 3px solid #343638;
  right: 15px;
  bottom: 15px;
  border-radius: 50%;
`;

const Player = styled.div`
  height: 195px;
  width: 220px;
  position: relative;
  margin: 100px auto 0 auto;
  background: #EB811F;
  border: 3px solid #E5D2C0;
  border-radius: 8px;
`;

const Disc = styled.svg`
  position: absolute;
  top: 20px;
  left: 20px;
  height: 150px;
  width: 150px;
  border-radius: 50%;
  background: #343638;
  border: 5px solid #EB811F;
  box-shadow: 0 0 0 3px #E5D2C0;
  animation: ${(props) => (props.isCounting ? spin : '')} 1s linear infinite;
`;

const Eye = styled.div`
  content: "";
  position: absolute;
  height: 15px;
  width: 15px;
  background: #EB811F;
  border-radius: 50%;
  border: 3px solid #343638;
  box-shadow: 0 0 0 15px #E5D2C0;
  top: 88px;
  left: 88px;
  z-index: 5;
`;

const StylusBase = styled.div`
  height: 20px;
  width: 20px;
  background: #343638;
  position: absolute;
  right: 20px;
  top: 20px;
  border-radius: 50%;
  border: 3px solid #EB811F;
  box-shadow: 0 0 0 3px #343638;
  transform: rotate(14deg);
  animation: ${(props) => (props.isCounting ? bigWiggle : '')} 500ms infinite linear;
  &:after {
    content: "";
    position: absolute;
    top: 6px;
    left: 50%;
    border-radius: 3px;
    margin-left: -3px;
    width: 6px;
    height: 80px;
    background: #E5D2C0;
    box-shadow: 2px 2px 10px -1px #333;
  }
`;

const Stylus = styled.div`
  background: #E5D2C0;
  height: 12px;
  width: 18px;
  position: absolute;
  right: 55px;
  top: 102px;
  border-radius: 2px;
  transform: rotate(-15deg);
  box-shadow: 2px 2px 10px 0px #333;
  animation: ${(props) => (props.isCounting ? littleWiggle : '')} 500ms infinite linear;
  &:after {
    content: "";
    position: absolute;
    left: 18px;
    height: 6px;
    width: 8px;
    top: 3px;
    background: #E5D2C0;
    border-radius: 0 6px 6px 0;
  }
`;

function MusicDisc({ isCounting }) {
  return (
    <Player>
      <PlayerButton />
      <Eye />
      <Disc isCounting={isCounting} width="150px" height="150px" viewBox="0 0 150 150" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnsSketch="http://www.bohemiancoding.com/sketch/ns">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" sketchtype="MSPage">
          <g id="Group" sketchtype="MSLayerGroup" transform="translate(75.000000, 75.000000) scale(1, -1) translate(-75.000000, -75.000000) ">
            <path d="M75,150 C116.421356,150 150,116.421356 150,75 C150,33.5786438 116.421356,0 75,0 C33.5786438,0 0,33.5786438 0,75 C0,116.421356 33.5786438,150 75,150 Z" id="Oval-1" fill="#343638" sketchtype="MSShapeGroup" />
            <path d="M27.7421875,75 C27.7421875,101.017578 51.7402344,122.183594 75,122.183594" id="Path-1" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" sketchtype="MSShapeGroup" />
            <path d="M75,38.1484375 C75,58.4688144 93.4978363,75 111.426601,75" id="Path-1-Copy-3" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" sketchtype="MSShapeGroup" transform="translate(93.213301, 56.574219) scale(-1, -1) translate(-93.213301, -56.574219) " />
            <path d="M38.0904708,75 C38.0904708,95.3203769 56.8335434,111.851562 75,111.851562" id="Path-1-Copy" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" sketchtype="MSShapeGroup" />
            <path d="M75,27.8164062 C75,53.8339844 98.9980469,75 122.257812,75" id="Path-1-Copy-4" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" sketchtype="MSShapeGroup" transform="translate(98.628906, 51.408203) scale(-1, -1) translate(-98.628906, -51.408203) " />
          </g>
        </g>
      </Disc>
      <StylusBase isCounting={isCounting} />
      <Stylus isCounting={isCounting} />
    </Player>
  );
}

MusicDisc.propTypes = {
  isCounting: PropTypes.bool.isRequired,
};
export default MusicDisc;
