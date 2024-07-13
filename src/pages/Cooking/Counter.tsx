import React, {
  useRef, useEffect, Dispatch, SetStateAction,
} from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { PlayCircle, PauseCircle, ReplayCircleFilled } from '@styled-icons/material-rounded';
import MusicDisc from '../../components/MusicDisc';

const CounterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Time = styled.div`
  font-size: calc(48*100/9*16vh/1920);
  width: 100%;
  text-align: center;
`;

const ButtonDiv = styled.div`
  width: calc(400*100/9*16vh/1920);
  display: flex;
  justify-content: center;
  margin-top: calc(50*100/9*16vh/1920);
`;

const Button = styled.button`
  width: calc(65*100/9*16vh/1920);
  height: calc(65*100/9*16vh/1920);
  background-color: transparent;
  border: 0;
  cursor: pointer;
`;

const Icon = styled.span`
  width: calc(65*100/9*16vh/1920);
  height: calc(65*100/9*16vh/1920);
  cursor: pointer;
  & > svg{
    width: calc(65*100/9*16vh/1920);
    height: calc(65*100/9*16vh/1920);
    color: #2B2A29;
  }
  & > svg:hover {
    color:#EB811F;
  }
`;

interface CounterProps {
  setIsCounting: Dispatch<SetStateAction<boolean>>
  isCounting: boolean;
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
  initialTime: number;
  onTimeUp: () => void;
}

function Counter({
  setIsCounting, isCounting, time, setTime, initialTime, onTimeUp,
}: CounterProps) {
  const timerRef = useRef<number | null>(null);

  const toggleCounting = () => {
    setIsCounting((prev) => !prev);
  };

  useEffect(() => {
    if (!isCounting) {
      return undefined;
    }

    if (time === 0) {
      onTimeUp();
    }

    timerRef.current = window.setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    const clearTimer = () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
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
          {isCounting ? <Icon><PauseCircle /></Icon> : <Icon><PlayCircle /></Icon>}
        </Button>
        <Time>{`${Math.floor(time / 60) > 9 ? Math.floor(time / 60) : `0${Math.floor(time / 60)}`} : ${time % 60 < 10 ? `0${time % 60}` : time % 60}`}</Time>
        <Button type="button" onClick={resetTime}><Icon><ReplayCircleFilled /></Icon></Button>
      </ButtonDiv>
    </CounterWrapper>
  );
}

// Counter.propTypes = {
//   setIsCounting: PropTypes.func.isRequired,
//   isCounting: PropTypes.bool.isRequired,
//   time: PropTypes.number.isRequired,
//   setTime: PropTypes.func.isRequired,
//   initialTime: PropTypes.number.isRequired,
//   onTimeUp: PropTypes.func.isRequired,
// };

export default Counter;
