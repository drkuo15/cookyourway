import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components/macro';
import { ScreenRotation } from '@styled-icons/material-rounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Counter from './Counter';
import Player from './Music';
import Recipe from './Recipe';
import AuthHeader from '../../components/AuthHeader';
import music1 from '../../music/music1.m4a';
import music2 from '../../music/music2.m4a';
import music3 from '../../music/music3.m4a';
import music4 from '../../music/music4.m4a';
import Loading from '../../components/Loading';
import { db } from '../../firestore';
import AuthContext from '../../components/AuthContext';

const ForceLandscapeAlert = styled.div`
  display:none;
  @media only screen and (orientation:portrait){
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 40%;
    font-size: calc(100*100vw/1920);
    }
`;

const Icon = styled.div`
  width: 50%;
  margin-top: 20%;
`;

const CookingWrapper = styled.div`
  ${'' /* height: 92.5vh; */}

  @media only screen and (orientation:portrait){
    display: none;
    }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 7.5vh;
  align-items: flex-start;
  ${'' /* margin-top: calc(60*100/9*16vh/1920);
  margin-bottom: calc(60*100/9*16vh/1920); */}
  min-height: 80vh;
  margin: 0 2.5vh;
`;

const LeftTimer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(500*100/9*16vh/1920);
  height: calc(730*100/9*16vh/1920);
  background-color: #E5D2C0;
  border-radius: calc(15*100/9*16vh/1920);
  margin: auto 0;
`;

const RightRecipe = styled.div`
  margin: auto 0;
`;

const Title = styled.div`
  font-size: calc(48*100/9*16vh/1920);
  margin-bottom: calc(50*100/9*16vh/1920);
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
  const [playIndex, setPlayIndex] = useState(Math.floor(Math.random() * 4));
  const url = playlist[playIndex];
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const userInfo = useContext(AuthContext);
  const userId = userInfo?.uid || '';
  const [checkingUser, setCheckingUser] = useState(true);

  // const DEFAULT_URL = 'https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_5423_lazy-bones_by_vital.mp3?alt=media&token=30cb614d-0230-482a-b83c-9c82bf77022e';
  // const [url, setUrl] = useState(DEFAULT_URL);
  // const [random, setRandom] = useState(Math.floor(Math.random() * playlist.length));
  // const randomUrl = playlist[random];

  useEffect(() => {
    if (userInfo === '') {
      setCheckingUser(true);
    }
    if (userInfo === null) {
      navigate({ pathname: '/' });
    }
    if (userId) {
      setCheckingUser(false);
    }
  }, [navigate, userId, userInfo]);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime, stepIndex]);

  const currentRecipeId = location.search.split('=')[1];
  useEffect(() => {
    async function getData() {
      const docRef = doc(db, 'recipes', currentRecipeId);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();
      if (!docData) {
        navigate({ pathname: '/home' });
        return;
      }
      setSteps(docData.steps);
      setTitle(docData.title);
      setInitialTime((docData.steps[stepIndex].stepTime));
      setStepsLength(docData.steps.length);
      setLoading(false);
    }
    if (currentRecipeId) {
      getData();
    } else {
      navigate({ pathname: '/home' });
    }
  }, [currentRecipeId, navigate, stepIndex]);

  if (checkingUser) {
    return (
      <>
        <AuthHeader setIsCounting={setIsCounting} />
        <Loading />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <AuthHeader setIsCounting={setIsCounting} />
        <Loading />
      </>
    );
  }

  return (
    <>
      <ForceLandscapeAlert>
        請將螢幕轉為橫向以繼續瀏覽此頁面
        <br />
        <Icon><ScreenRotation /></Icon>
      </ForceLandscapeAlert>
      <CookingWrapper>
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
          <RightRecipe>
            <Recipe
              stepIndex={stepIndex}
              setStepIndex={setStepIndex}
              setIsCounting={setIsCounting}
              steps={steps}
            />
          </RightRecipe>
        </Wrapper>
      </CookingWrapper>
    </>
  );
}

export default Cooking;
