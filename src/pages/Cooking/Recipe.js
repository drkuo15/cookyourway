import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { db } from '../../firestore';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const WrapperStepTitle = styled(Wrapper)`
  justify-content: space-between;
`;

const RecipeArea = styled.div`
  width: 900px;
  height: 300px;
  display: flex;
  flex-direction: column;
`;

const StepTitle = styled.div`
  font-size: 1.5rem;
`;

const WrapperStepButton = styled(Wrapper)`
  justify-content: space-around;
  margin-top: 20px;
`;

const StepsNav = styled(Wrapper)`
  ${'' /* display: block; */}
  width: 900px;
  margin: 0 auto;
  padding: 50px 20px;
  text-align: center;
  overflow: hidden;
  font-size: 1.5rem;
  color: white;
`;

const StepArea = styled.div`
  display: block;
  position: relative;
  float: left;
  width: calc(100% / 3);
  height: 40px;
  line-height: 40px;
  margin-right: 10px;
  padding: 0 10px;
  background-color: ${(props) => (props.selected ? '#EB811F' : '#584743')};;
  border-radius: 4px;
  &:before {
  content: "";
  position: absolute;
  right: -9px;
  height: 0;
  width: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 10px solid ${(props) => (props.selected ? '#EB811F' : '#584743')};;
  border-radius: 4px;
  };
  &:after {
  content: "";
  position: absolute;
  left: -1px;
  height: 0;
  width: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 10px solid #fff;
  border-radius: 4px;
  };
`;

const StepContent = styled.div`
  text-align: start;
  margin-top: 20px;
`;
function Recipe({
  setInitialTime, stepIndex, setStepIndex, setStepsLength, setIsCounting,
}) {
  const [steps, setSteps] = useState([]);
  const [isNextStep, setIsNextStep] = useState(true);
  const [isPrevStep, setIsPrevStep] = useState(false);

  useEffect(() => {
    async function getData() {
      const docRef = doc(db, 'recipes', 'O3pzlJ8g9gTtHahU9aeZ');
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();

      setSteps(docData.steps);
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
  }, [setInitialTime, setStepsLength, stepIndex]);

  function renderSwitch() {
    switch (stepIndex) {
      case (0):
        // console.log('first');
        return steps
          .filter((_, index) => index <= stepIndex + 2)
          .map((step, index) => (
            <StepArea selected={index === 0} key={step.stepTitle}>
              {step.stepTitle}
            </StepArea>
          ));
      case (steps.length - 1):
        // console.log('last');
        return steps.filter((_, index) => index >= stepIndex - 2)
          .map((step, index) => (
            <StepArea selected={index === 2} key={step.stepTitle}>
              {step.stepTitle}
            </StepArea>
          ));
      default:
        // console.log('default');
        return steps.filter((_, index) => index <= (stepIndex + 1) && index >= (stepIndex - 1))
          .map(((step, index) => (
            <StepArea selected={index === 1} key={step.stepTitle}>
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

  return (
    <RecipeArea>
      <StepsNav>
        {renderSwitch()}
      </StepsNav>
      {steps.map((step, index) => (
        <div key={step.stepTitle}>
          <WrapperStepTitle>
            <StepTitle>
              {index + 1}
              {step.stepTitle}
            </StepTitle>
            <div>
              預計時間：
              {step.stepMinute ? `${step.stepMinute}分` : ''}
              {step.stepSecond ? `${step.stepSecond}秒` : ''}
            </div>
          </WrapperStepTitle>
          <StepContent>
            {step.stepContent}
          </StepContent>
          <img src={step.stepImgUrl} alt="stepImage" />
        </div>
      )).filter((_, index) => index === stepIndex)}
      <WrapperStepButton>
        {stepIndex + 1 !== steps.length ? <button type="button" onClick={() => { setIsCounting(true); }}>開始料理</button> : ''}
        {isPrevStep ? <button type="button" onClick={() => { handlePrevStep(); }}>上一步</button> : ''}
        {isNextStep ? <button type="button" onClick={() => { handleNextStep(); }}>下一步</button> : ''}
        {stepIndex + 1 === steps.length ? <button type="button">結束料理</button> : ''}
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
};

export default Recipe;
