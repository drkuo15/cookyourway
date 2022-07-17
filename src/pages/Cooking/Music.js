import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Player = ({ url, isCounting }) => {
  const location = useLocation();
  const audio = useRef();

  useEffect(() => {
    audio.current = new Audio(url);
    audio.current.load(); // 改放於此避免暫停後 play 前重新 load，造成音樂重頭開始
  }, [audio, url]);

  useEffect(
    () => {
      if (isCounting) {
        audio.current.play();
      } else {
        audio.current.pause();
      }
    },
    [isCounting, audio, url],
  );

  useEffect(() => () => {
    audio.current.pause();
  }, [audio, url, location]);

  useEffect(() => {
    audio.current.addEventListener('ended', function repeat() {
      this.currentTime = 0;
      this.load();
      this.play();
    }, false);
  }, [audio]);
};

Player.propTypes = {
  url: PropTypes.string.isRequired,
  setIsCounting: PropTypes.func.isRequired,
  isCounting: PropTypes.bool.isRequired,
};

export default Player;
