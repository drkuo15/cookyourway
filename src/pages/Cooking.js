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

function Cooking() {
  const [initialTime, setInitialTime] = useState(0);
  const [time, setTime] = useState(initialTime);
  const [isCounting, setIsCounting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepsLength, setStepsLength] = useState(0);
  const [url, setUrl] = useState('https://firebasestorage.googleapis.com/v0/b/cook-your-way.appspot.com/o/tunetank.com_5423_lazy-bones_by_vital.mp3?alt=media&token=30cb614d-0230-482a-b83c-9c82bf77022e');

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  return (
    <div>
      <Wrapper>
        <LeftTimer>
          <Counter
            time={time}
            setTime={setTime}
            isCounting={isCounting}
            setIsCounting={setIsCounting}
            initialTime={initialTime}
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            stepsLength={stepsLength}
            setUrl={setUrl}
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
        />
      </Wrapper>
    </div>
  );
}

export default Cooking;
