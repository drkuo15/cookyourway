import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PlayerProps {
  url: string;
  isCounting: boolean;
}

function Player({ url, isCounting }: PlayerProps) {
  const location = useLocation();
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audio.current = new Audio(url);
    audio.current.load();
  }, [url]);

  useEffect(
    () => {
      if (isCounting) {
        audio.current?.play();
      } else {
        audio.current?.pause();
      }
    },
    [isCounting, audio, url],
  );

  useEffect(() => () => {
    audio.current?.pause();
  }, [audio, url, location]);

  useEffect(() => {
    audio.current?.addEventListener('ended', () => {
      audio.current!.currentTime = 0;
      audio.current!.load();
      audio.current!.play();
    }, false);
  }, [audio]);

  return null;
}

export default Player;
