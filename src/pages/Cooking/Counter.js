import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { PlayCircle } from '@styled-icons/material-rounded';
import MusicDisc from '../../components/MusicDisc';
import pauseImg from '../../images/musicSVG/pause_FILL0_wght400_GRAD0_opsz48.svg';
import playImg from '../../images/musicSVG/play_circle_FILL0_wght400_GRAD0_opsz48.svg';
import replayImg from '../../images/musicSVG/replay_FILL0_wght400_GRAD0_opsz48.svg';

const CounterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Time = styled.div`
  font-size: calc(48*100vw/1920);
`;

const ButtonDiv = styled.div`
  width: calc(400*100vw/1920);
  display: flex;
  justify-content: center;
  gap: calc(50*100vw/1920);
  margin-top: calc(50*100vw/1920);
`;

const Button = styled.button`
  width: calc(65*100vw/1920);
  height: calc(65*100vw/1920);
  background-color: transparent;
  border: 0;
  cursor: pointer;
`;

const Img = styled.img`
  width: calc(65*100vw/1920);
  height: calc(65*100vw/1920);
`;

const Icon = styled.span`
  width: calc(65*100vw/1920);
  height: calc(65*100vw/1920);
  cursor: pointer;
  & > svg{
    width: calc(65*100vw/1920);
    height: calc(65*100vw/1920);
  }
  & > svg:hover {
    color:  #EB811F;
  }
`;
// const playlist = ['https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_5423_lazy-bones_by_vital.mp3?alt=media&token=30cb614d-0230-482a-b83c-9c82bf77022e',
//   'https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_5094_new-york-lounge_by_99instrumentals.mp3?alt=media&token=76e6a1cf-0e22-4544-960b-183231335faf',
//   'https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_3474_cozy-cafe_by_ahoami.mp3?alt=media&token=db9c404b-ecb2-4c05-8409-06de01fe20c5',
//   'https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_2161_stay-chilled_by_pillowvibes.mp3?alt=media&token=4b09d609-f86a-4f92-a3ba-f886fbf096ea'];

function Counter({
  setIsCounting, isCounting, time, setTime, initialTime, onTimeUp,
}) {
  // const [random, setRandom] = useState(Math.floor(Math.random() * playlist.length));
  // const randomUrl = playlist[random];
  const timerRef = useRef();

  const toggleCounting = () => {
    setIsCounting((prev) => !prev);
  };

  useEffect(() => {
    if (!isCounting) {
      return undefined;
    }

    if (time === 0) {
      // onTimeUp
      onTimeUp();
      // setRandom(generateRandomNumber());

      // if (stepIndex + 1 < stepsLength) {
      //   setStepIndex((prev) => prev + 1);
      //   setTime(initialTime);
      //   setUrl(randomUrl);
      // } else {
      //   setIsCounting(false);
      // }
    }

    timerRef.current = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    const clearTimer = () => {
      clearInterval(timerRef.current);
    };

    return clearTimer;
  }, [isCounting, time, onTimeUp, setTime]);

  const resetTime = () => {
    setTime(initialTime);
    setIsCounting(true);
  };

  return (
    <CounterWrapper>
      <MusicDisc isCounting={isCounting} />
      <ButtonDiv>
        <Button type="button" onClick={toggleCounting}>
          {/* {isCounting ? '暫停倒數' : '開始倒數'} */}
          {isCounting ? <Img src={pauseImg} alt="Pause" /> : <Img src={playImg} alt="Play" />}
        </Button>
        <Icon><PlayCircle /></Icon>
        <Time>{`${Math.floor(time / 60) > 9 ? Math.floor(time / 60) : `0${Math.floor(time / 60)}`} : ${time % 60 < 10 ? `0${time % 60}` : time % 60}`}</Time>
        <Button type="button" onClick={resetTime}><Img src={replayImg} alt="Replay" /></Button>
      </ButtonDiv>
    </CounterWrapper>
  );
}

Counter.propTypes = {
  setIsCounting: PropTypes.func.isRequired,
  isCounting: PropTypes.bool.isRequired,
  time: PropTypes.number.isRequired,
  setTime: PropTypes.func.isRequired,
  initialTime: PropTypes.number.isRequired,
  onTimeUp: PropTypes.func.isRequired,
};

export default Counter;
