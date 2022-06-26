import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Counter from './Counter';
import Player from './Music';
import Recipe from './Recipe';

const LeftTimer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-top: 140px; 
`;

const Title = styled.div`
  font-size: 1.5rem;
`;

const playlist = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
];

function Cooking() {
  const [title, setTitle] = useState('');
  const [initialTime, setInitialTime] = useState(0);
  const [time, setTime] = useState(initialTime);
  const [isCounting, setIsCounting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepsLength, setStepsLength] = useState(0);
  const [playIndex, setPlayIndex] = useState(0);
  const url = playlist[playIndex];
  // const DEFAULT_URL = 'https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_5423_lazy-bones_by_vital.mp3?alt=media&token=30cb614d-0230-482a-b83c-9c82bf77022e';
  // const [url, setUrl] = useState(DEFAULT_URL);
  // const [random, setRandom] = useState(Math.floor(Math.random() * playlist.length));
  // const randomUrl = playlist[random];

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  return (
    <div>
      <Wrapper>
        <LeftTimer>
          <Title>{title}</Title>
          <Counter
            time={time}
            setTime={setTime}
            isCounting={isCounting}
            setIsCounting={setIsCounting}
            initialTime={initialTime}
            onTimeUp={() => {
              const generateRandomNumber = () => {
                const randomNumber = Math.floor(Math.random() * playlist.length);
                if (randomNumber !== playIndex) {
                  return randomNumber;
                }
                return generateRandomNumber();
              };
              if (stepIndex + 1 < stepsLength) {
                setStepIndex((prev) => prev + 1);
                setTime(initialTime);
                setPlayIndex(generateRandomNumber());
              } else {
                setIsCounting(false);
              }
            }}
          />
          <Player
            url={url}
            isCounting={isCounting}
            setIsCounting={setIsCounting}
          />
        </LeftTimer>
        <Recipe
          setInitialTime={setInitialTime}
          stepIndex={stepIndex}
          setStepIndex={setStepIndex}
          setStepsLength={setStepsLength}
          setIsCounting={setIsCounting}
          setTitle={setTitle}
        />
      </Wrapper>
    </div>
  );
}

export default Cooking;
