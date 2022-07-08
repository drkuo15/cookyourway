import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firestore';

const RecipeArea = styled.div`
  width: calc(1300*100vw/1920);
  height: calc(830*100vw/1920);
  display: flex;
  flex-direction: column;
  margin-top: calc(60*100vw/1920);
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WrapperStep = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  ${'' /* align-items: center; */}
  gap: calc(50*100vw/1920);
  width: calc(600*100vw/1920);
`;

const WrapperStepButton = styled(Wrapper)`
  justify-content: space-around;
`;

const StepsNav = styled(Wrapper)`
  width: calc(1250*100vw/1920);
  padding: calc(50*100vw/1920) calc(20*100vw/1920)
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
  font-size: calc(48*100vw/1920);
  color: white;
`;

// const load = keyframes`
//   100% {
//       transform: translateX(-66.6666%);
//     }
// `;

const StepArea = styled.div`
  display: block;
  position: relative;
  float: left;
  width: calc(382*100vw/1920);
  height: calc(142*100vw/1920);
  line-height: calc(142*100vw/1920);
  margin-right: calc(70*100vw/1920);
  padding-left: calc(50*100vw/1920);
  background-color: ${(props) => (props.selected ? '#EB811F' : '#584743')};
  border-radius: calc(4*100vw/1920);
  font-size: calc(36*100vw/1920);
  color: #FDFDFC;
  ${'' /* animation: ${load} 5s linear infinite;
  overflow: scroll; */}
  &:before {
  content: "";
  position: absolute;
  right: calc(-62.5*100vw/1920);
  height: 0;
  width: 0;
  border-top: calc(70*100vw/1920) solid transparent;
  border-bottom: calc(70*100vw/1920) solid transparent;
  border-left: calc(65*100vw/1920) solid ${(props) => (props.selected ? '#EB811F' : '#584743')};
  border-radius: calc(4*100vw/1920);
  };
  &:after {
  content: "";
  position: absolute;
  ${'' /* left: calc(-1*100vw/1920); */}
  left: 0;
  height: 0;
  width: 0;
  border-top: calc(70*100vw/1920) solid transparent;
  border-bottom: calc(70*100vw/1920) solid transparent;
  border-left: calc(65*100vw/1920) solid #FDFDFC;
  border-radius: calc(4*100vw/1920);
  };
`;

const StepDiv = styled.div`
  margin-top: calc(50*100vw/1920);
  width: calc(1250*100vw/1920);
  height: calc(450*100vw/1920);
  display: flex;
  justify-content: space-around;
`;

const ExpectTime = styled.div`
  font-size: calc(28*100vw/1920);
  width: 100%;
  text-align: end;
`;

const StepContent = styled.div`
  text-align: start;
  margin-top: calc(20*100vw/1920);
  font-size: calc(36*100vw/1920);
  font-size: calc(40*100vw/1920);
  overflow: scroll;
`;

const Img = styled.img`
  max-width: calc(600*100vw/1920);
  max-height: calc(450*100vw/1920);
  border-radius: calc(15*100vw/1920);
`;

const Button = styled.button`
  width: calc(250*100vw/1920);
  height: calc(65*100vw/1920);
  background-color: #584743;
  border: 0;
  border-radius: calc(15*100vw/1920);
  color: #FDFDFC;
  margin-top: calc(50*100vw/1920);
  font-size: calc(28*100vw/1920);
  cursor: pointer;
`;

function Recipe({
  setInitialTime, stepIndex, setStepIndex, setStepsLength, setIsCounting, setTitle,
}) {
  const [steps, setSteps] = useState([]);
  const [isNextStep, setIsNextStep] = useState(true);
  const [isPrevStep, setIsPrevStep] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const currentRecipeId = location.search.split('=')[1];
      const docRef = doc(db, 'recipes', currentRecipeId);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();

      setSteps(docData.steps);
      setTitle(docData.title);
      if (docData.steps.length === stepIndex + 1) {
        setIsNextStep(false);
      } else {
        setIsNextStep(true);
      }
      if (stepIndex > 0) {
        setIsPrevStep(true);
      } else {
        setIsPrevStep(false);
      }
      setInitialTime((docData.steps[stepIndex].stepTime));
      // setInitialTime((docData.steps[stepIndex].time));
      setStepsLength(docData.steps.length);
    }
    getData();
  }, [location.search, setInitialTime, setStepsLength, setTitle, stepIndex]);

  function renderSwitch() {
    switch (stepIndex) {
      case (0):
        // console.log('first');
        return steps
          .filter((_, index) => index <= stepIndex + 2)
          .map((step, index) => (
            <StepArea selected={index === 0} key={step.stepTitle}>
              {stepIndex + index + 1}
              .
              {' '}
              {step.stepTitle}
            </StepArea>
          ));
      case (steps.length - 1):
        // console.log('last');
        return steps.filter((_, index) => index >= stepIndex - 2)
          .map((step, index) => (
            <StepArea selected={index === 2} key={step.stepTitle}>
              {stepIndex + index - 1}
              .
              {' '}
              {step.stepTitle}
            </StepArea>
          ));
      default:
        // console.log('default');
        return steps.filter((_, index) => index <= (stepIndex + 1) && index >= (stepIndex - 1))
          .map(((step, index) => (
            <StepArea selected={index === 1} key={step.stepTitle}>
              {stepIndex + index}
              .
              {' '}
              {step.stepTitle}
            </StepArea>
          )));
    }
  }

  function handlePrevStep() {
    setStepIndex((prev) => prev - 1);
    setIsCounting(false);
  }

  function handleNextStep() {
    setStepIndex((prev) => prev + 1);
    setIsCounting(false);
  }

  function handleEnding() {
    setIsCounting(false);
    setTimeout(() => {
      navigate({ pathname: '/read_recipe', search: `?id=${location.search.split('=')[1]}` });
    }, 100);
  }

  return (
    <RecipeArea>
      <StepsNav>
        {renderSwitch()}
      </StepsNav>
      {steps.map((step) => (
        <StepDiv key={step.stepTitle}>
          <WrapperStep>
            <StepContent>
              {step.stepContent}
            </StepContent>
            <ExpectTime>
              預計時間：
              {step.stepMinute ? `${step.stepMinute}分` : ''}
              {step.stepSecond ? `${step.stepSecond}秒` : ''}
            </ExpectTime>
          </WrapperStep>
          <Img src={step.stepImgUrl} alt="stepImage" />
        </StepDiv>
      )).filter((_, index) => index === stepIndex)}
      <WrapperStepButton>
        {stepIndex + 1 !== steps.length && !isPrevStep ? <Button type="button" onClick={() => { setIsCounting(true); }}>開始料理</Button> : <Button type="button" onClick={() => { handlePrevStep(); }}>上一步</Button>}
        {stepIndex + 1 === steps.length && !isNextStep ? (
          <Button type="button" onClick={() => { handleEnding(); }}>
            結束料理
          </Button>
        ) : <Button type="button" onClick={() => { handleNextStep(); }}>下一步</Button>}
      </WrapperStepButton>
    </RecipeArea>
  );
}

Recipe.propTypes = {
  setInitialTime: PropTypes.func.isRequired,
  stepIndex: PropTypes.number.isRequired,
  setStepIndex: PropTypes.func.isRequired,
  setStepsLength: PropTypes.func.isRequired,
  setIsCounting: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
};

export default Recipe;
