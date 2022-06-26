import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Player = ({ url, isCounting }) => {
  const [audio] = useState(new Audio(url));

  useEffect(
    () => {
      if (isCounting) {
        audio.src = url;
        audio.load();
        audio.play();
      } else {
        audio.pause();
      }
    },
    [isCounting, audio, url],
  );

  useEffect(() => {
    audio.addEventListener('ended', function repeat() {
      this.currentTime = 0;
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
