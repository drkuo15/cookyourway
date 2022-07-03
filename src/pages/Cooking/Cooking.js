import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Counter from './Counter';
import Player from './Music';
import Recipe from './Recipe';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const LeftTimer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(500*100vw/1920);
  height: calc(830*100vw/1920);
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
`;

const Title = styled.div`
  font-size: calc(76*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
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
      <Header />
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
      <Footer />
    </div>
  );
}

export default Cooking;
