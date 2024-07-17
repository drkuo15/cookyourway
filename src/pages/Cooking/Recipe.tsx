import React, {
  useEffect, useState, Dispatch, SetStateAction,
} from 'react';
import styled, { keyframes } from 'styled-components/macro';
import {
  West, East, OutdoorGrill, LocalDining,
} from '@styled-icons/material-rounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { Step } from '../../types/Step';

const RecipeArea = styled.div`
  width: calc(1250*100/9*16vh/1920);
  height: calc(730*100/9*16vh/1920);
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const WrapperStep = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: calc(50*100/9*16vh/1920);
  width: calc(600*100/9*16vh/1920);
`;

const WrapperStepButton = styled(Wrapper)`
  justify-content: space-between;
  width: calc(1250*100/9*16vh/1920);
  height: calc(70*100/9*16vh/1920);
`;

const StepsNav = styled(Wrapper)`
  width: calc(1250*100/9*16vh/1920);
  height: calc(110*100/9*16vh/1920);
  justify-content: flex-start;
  text-align: center;
  overflow: hidden;
  font-size: calc(48*100/9*16vh/1920);
  color: white;
`;

interface StepAreaProps {
  selected: boolean;
}

const StepArea = styled.div`
  display: inline-flex;
  position: relative;
  float: left;
  width: calc(382*100/9*16vh/1920);
  height: calc(110*100/9*16vh/1920);
  line-height: calc(110*100/9*16vh/1920);
  margin-right: calc(62.5*100/9*16vh/1920);
  padding-left: calc(100*100/9*16vh/1920);
  background-color: ${({ selected }: StepAreaProps) => (selected ? '#EB811F' : '#584743')};
  border-radius: calc(4*100/9*16vh/1920);
  font-size: calc(36*100/9*16vh/1920);
  color: #FDFDFC;
  &:before {
  content: "";
  position: absolute;
  right: calc(-61.5*100/9*16vh/1920);
  height: 0;
  width: 0;
  border-top: calc(54*100/9*16vh/1920) solid transparent;
  border-bottom: calc(56*100/9*16vh/1920) solid transparent;
  border-left: calc(64*100/9*16vh/1920) solid ${(props) => (props.selected ? '#EB811F' : '#584743')};
  border-radius: calc(4*100/9*16vh/1920);
  };
  &:after {
  content: "";
  position: absolute;
  left: 0;
  height: 0;
  width: 0;
  border-top: calc(55.5*100/9*16vh/1920) solid transparent;
  border-bottom: calc(55.5*100/9*16vh/1920) solid transparent;
  border-left: calc(64*100/9*16vh/1920) solid #FDFDFC;
  border-radius: calc(4*100/9*16vh/1920);
  };
`;

const TitleText = styled.p`
  margin-left: calc(5*100/9*16vh/1920);
  overflow-x: auto;
  white-space: nowrap;
`;

const StepDiv = styled.div`
  margin-top: calc(50*100/9*16vh/1920);
  margin-bottom: calc(50*100/9*16vh/1920);
  width: calc(1250*100/9*16vh/1920);
  height: calc(450*100/9*16vh/1920);
  display: flex;
  gap: calc(50*100/9*16vh/1920);
`;

const ExpectTime = styled.div`
  font-size: calc(28*100/9*16vh/1920);
  width: 100%;
  text-align: end;
`;

const StepContent = styled.div`
  text-align: start;
  margin-top: calc(20*100/9*16vh/1920);
  font-size: calc(36*100/9*16vh/1920);
  font-size: calc(40*100/9*16vh/1920);
  overflow: auto;
`;

const Img = styled.img`
  width: calc(600*100/9*16vh/1920);
  height: calc(450*100/9*16vh/1920);
  object-fit: cover;
  border-radius: calc(15*100/9*16vh/1920);
`;

const Shine = keyframes`
  to {
    background-position-x: -200%;
  }
`;

const ImgDefaultDiv = styled.div`
  width: calc(600*100/9*16vh/1920);
  height: calc(450*100/9*16vh/1920);
  object-fit: cover;
  border-radius: calc(15*100/9*16vh/1920);
  background: #eee;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: 1.5s ${Shine} linear infinite;
`;

const Icon = styled.span`
  cursor: pointer;
  font-size: calc(40*100/9*16vh/1920);
  display: flex;
  align-items: end;
  &:hover {
    color:#EB811F
  }
  & > svg{
    width: calc(60*100/9*16vh/1920);
    height: calc(60*100/9*16vh/1920);
  }
  & > svg:hover {
    color:#EB811F;
  }
`;

interface RecipeProps {
  stepIndex: number;
  setStepIndex: Dispatch<SetStateAction<number>>;
  setIsCounting: Dispatch<SetStateAction<boolean>>
  steps: Step[];
}

function Recipe({
  stepIndex, setStepIndex, setIsCounting, steps,
}: RecipeProps) {
  const [isNextStep, setIsNextStep] = useState(true);
  const [isPrevStep, setIsPrevStep] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (steps.length === stepIndex + 1) {
      setIsNextStep(false);
    } else {
      setIsNextStep(true);
    }
    if (stepIndex > 0) {
      setIsPrevStep(true);
    } else {
      setIsPrevStep(false);
    }
  }, [stepIndex, steps.length]);

  function renderSwitch() {
    switch (true) {
      case (stepIndex === 0):
        return steps
          .filter((_, index) => index <= stepIndex + 2)
          .map((step, index) => (
            <StepArea selected={index === 0} key={step.stepTitle}>
              {stepIndex + index + 1}
              .
              <TitleText>{step.stepTitle}</TitleText>
            </StepArea>
          ));
      case (stepIndex === steps.length - 1 && steps.length !== 2):
        return steps.filter((_, index) => index >= stepIndex - 2)
          .map((step, index) => (
            <StepArea selected={index === 2} key={step.stepTitle}>
              {stepIndex + index - 1}
              .
              <TitleText>{step.stepTitle}</TitleText>
            </StepArea>
          ));
      default:
        return steps.filter((_, index) => index <= (stepIndex + 1) && index >= (stepIndex - 1))
          .map(((step, index) => (
            <StepArea selected={index === 1} key={step.stepTitle}>
              {stepIndex + index}
              .
              <TitleText>{step.stepTitle}</TitleText>
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
            {step.stepMinute || step.stepSecond ? (
              <ExpectTime>
                預計時間：
                {step.stepMinute ? `${step.stepMinute}分` : ''}
                {step.stepSecond ? `${step.stepSecond}秒` : ''}
              </ExpectTime>
            ) : ''}
          </WrapperStep>
          {imgLoaded ? (
            <Img
              src={step.stepMainImage}
              alt="stepImage"
            />
          ) : (
            <>
              <Img
                style={imgLoaded ? {} : { display: 'none' }}
                src={step.stepMainImage}
                alt="stepImage"
                onLoad={() => { setImgLoaded(true); }}
              />
              <ImgDefaultDiv />
            </>
          )}
        </StepDiv>
      )).filter((_, index) => index === stepIndex)}
      <WrapperStepButton>
        {stepIndex === 0 && !isPrevStep
          ? (
            <Icon onClick={() => { setIsCounting(true); }}>
              <OutdoorGrill />
              開始料理
            </Icon>
          )
          : <Icon onClick={() => { handlePrevStep(); }}><West /></Icon>}
        {stepIndex + 1 === steps.length && !isNextStep ? (
          <Icon onClick={() => { handleEnding(); }}>
            <LocalDining />
            結束料理
          </Icon>
        ) : <Icon onClick={() => { handleNextStep(); }}><East /></Icon>}
      </WrapperStepButton>
    </RecipeArea>
  );
}

export default Recipe;
