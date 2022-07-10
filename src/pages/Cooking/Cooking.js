import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Counter from './Counter';
import Player from './Music';
import Recipe from './Recipe';
import Footer from '../../components/Footer';
import AuthHeader from '../../components/AuthHeader';
import music1 from '../../music/music1.mp3';
import music2 from '../../music/music2.mp3';
import music3 from '../../music/music3.mp3';
import music4 from '../../music/music4.mp3';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-top: calc(60*100vw/1920);
  margin-bottom: calc(60*100vw/1920);
`;

const LeftTimer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(500*100vw/1920);
  height: calc(730*100vw/1920);
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
`;

const Title = styled.div`
  font-size: calc(48*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
`;

const playlist = [music1, music2, music3, music4];

// const playlist = [
//   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//   'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
//   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
//   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
// ];

// const playlist = ['https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_5423_lazy-bones_by_vital.mp3?alt=media&token=30cb614d-0230-482a-b83c-9c82bf77022e',
//   'https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_5094_new-york-lounge_by_99instrumentals.mp3?alt=media&token=76e6a1cf-0e22-4544-960b-183231335faf',
//   'https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_3474_cozy-cafe_by_ahoami.mp3?alt=media&token=db9c404b-ecb2-4c05-8409-06de01fe20c5',
//   'https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_2161_stay-chilled_by_pillowvibes.mp3?alt=media&token=4b09d609-f86a-4f92-a3ba-f886fbf096ea'];

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
      <AuthHeader setIsCounting={setIsCounting} />
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
