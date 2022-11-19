import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components/macro';
import { ScreenRotation } from '@styled-icons/material-rounded';
import { useLocation, useNavigate } from 'react-router-dom';
import Counter from './Counter';
import Player from './Music';
import Recipe from './Recipe';
import Header from '../../components/Header';
import music1 from '../../music/music1.m4a';
import music2 from '../../music/music2.m4a';
import music3 from '../../music/music3.m4a';
import music4 from '../../music/music4.m4a';
import Loading from '../../components/Loading';
import { getCurrentData } from '../../firestore';
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
  @media only screen and (orientation:portrait){
    display: none;
    }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 7.5vh;
  align-items: flex-start;
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
      const currentData = await getCurrentData(currentRecipeId);
      if (!currentData) {
        navigate({ pathname: '/home' });
        return;
      }
      setSteps(currentData.steps);
      setTitle(currentData.title);
      setInitialTime((currentData.steps[stepIndex].stepTime));
      setStepsLength(currentData.steps.length);
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
        <Header setIsCounting={setIsCounting} />
        <Loading />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header setIsCounting={setIsCounting} />
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
        <Header setIsCounting={setIsCounting} />
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
