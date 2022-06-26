import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import MusicDisc from '../../components/MusicDisc';

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
    <div>
      <MusicDisc isCounting={isCounting} />
      <h2>{`${Math.floor(time / 60) > 9 ? Math.floor(time / 60) : `0${Math.floor(time / 60)}`}: ${time % 60 < 10 ? `0${time % 60}` : time % 60}`}</h2>
      <button type="button" onClick={toggleCounting}>
        {isCounting ? '暫停倒數' : '開始倒數'}
      </button>
      <button type="button" onClick={resetTime}>重置時間</button>
    </div>
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
