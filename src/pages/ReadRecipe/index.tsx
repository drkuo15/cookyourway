import React, {
  useState, useEffect, useCallback,
} from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { IosShare } from '@styled-icons/material-rounded';
import { getRecipe, updateUserDoc } from '../../firestore';
import { devices } from '../../utils/StyleUtils';
import Stars from '../../components/DisplayStars';
import defaultImage from '../../images/upload.png';
import { ToastContainer, showCustomAlert } from '../../components/CustomAlert';
import Header from '../../components/Header';
import tipImage from '../../images/tips.png';
import Loading from '../../components/Loading';
import useCheckingUser from '../../hooks/useCheckingUser';
import { User } from '../../types/User';
import { Recipe } from '../../types/Recipe';

const Background = styled.div`
  padding: 0 calc(116*100vw/1920);
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TipImg = styled.img`
  width: calc(60*100vw/1920);
  height: calc(60*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(90*100vw/1920);
    height: calc(90*100vw/1920);
  }
`;

const Img = styled.img`
  width: calc(800*100vw/1920);
  height: calc(600*100vw/1920);
  border-radius: calc(15*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(1600*100vw/1920);
    height: calc(1200*100vw/1920);
  }
`;

const Shine = keyframes`
  to {
    background-position-x: -200%;
  }
`;

const ImgDefaultDiv = styled.div`
  width: calc(800*100vw/1920);
  height: calc(600*100vw/1920);
  border-radius: calc(15*100vw/1920);
  background: #eee;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: 1.5s ${Shine} linear infinite;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1600*100vw/1920);
    height: calc(1200*100vw/1920);
  }
`;

const StepImg = styled.img`
  width: calc(600*100vw/1920);
  height: calc(450*100vw/1920);
  border-radius: calc(15*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(900*100vw/1920);
    height: calc(675*100vw/1920);
  }
`;

const StepImgDefaultDiv = styled.div`
  width: calc(600*100vw/1920);
  height: calc(450*100vw/1920);
  border-radius: calc(15*100vw/1920);
  background: #eee;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: 1.5s ${Shine} linear infinite;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(900*100vw/1920);
    height: calc(675*100vw/1920);
  }
`;

const TitleWrapper = styled(Div)`
  justify-content: center;
  align-items: end;
  margin-top: calc(38*100vw/1920);
  gap: calc(36*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    flex-direction: column;
    align-items: center;
  }
`;

const ExtraLargeDiv = styled.div`
  font-size: calc(76*100vw/1920);
  font-weight: 500;
  @media ${devices.Tablet} and (orientation: portrait){
    font-size: calc(152*100vw/1920);
  }
`;

const LargeDiv = styled.div`
  font-size: calc(48*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    font-size: calc(96*100vw/1920);
  }
`;

const MediumLargeDiv = styled.div`
  font-size: calc(32*100vw/1920);
  margin: calc(20*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    font-size: calc(72*100vw/1920);
  }
`;

const MediumDiv = styled.div`
  font-size: calc(28*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    font-size: calc(56*100vw/1920);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: calc(88*100vw/1920);
  align-items: center;
  margin-bottom: calc(50*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    flex-direction: column;
    align-items: center;
  }
`;

const ContentDiv = styled.div`
  width: calc(800*100vw/1920);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(1600*100vw/1920);
  }
`;

const IngredientContentDiv = styled.div`
  width: calc(800*100vw/1920);
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
  padding: calc(16*100vw/1920);
  justify-content: start;
  height: calc(600*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(1600*100vw/1920);
    height: calc(1200*100vw/1920);
  }
`;

const IngredientTitleDiv = styled(Div)`
  border-bottom: calc(2*100vw/1920)  #2B2A29 solid;
  padding-bottom: calc(15*100vw/1920);
  padding-left: calc(15*100vw/1920);
  padding-right: calc(15*100vw/1920);
`;

const AllIngredientsDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: calc(15*100vw/1920);
  overflow: auto;
  @media ${devices.Tablet} and (orientation: portrait){
    margin-top: calc(50*100vw/1920);
  }
`;

const StepCircleDiv = styled.div`
  width: calc(288*100vw/1920);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(300*100vw/1920);
  }
`;

const Circle = styled.div`
  width: calc(100*100vw/1920);
  height: calc(100*100vw/1920);
  border: calc(5*100vw/1920)  #2B2A29 solid;
  border-radius: 50%;
  font-size: calc(48*100vw/1920);
  display: inline-flex;
  flex: 0 0 auto;
  text-align: center;
  justify-content: center;
  align-items: center;
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(200*100vw/1920);
    height: calc(200*100vw/1920);
    font-size: calc(96*100vw/1920);
  }
`;

const Line = styled.div`
  width: calc(2.5*100vw/1920);
  height: calc(625*100vw/1920);
  background-color: #2B2A29;
  @media ${devices.Tablet} and (orientation: portrait){
    height: calc(1000*100vw/1920);
  }
`;

const BlankLine = styled(Line)`
  background-color: #FDFDFC;
`;

const StepWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media ${devices.Tablet} and (orientation: portrait){
    justify-content: center;
  }
`;

const StepTitleContentWrapper = styled.div`
  height: calc(650*100vw/1920);
  width: calc(1400*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(1300*100vw/1920);
    height: calc(1000*100vw/1920);
  }
`;

const StepTitleAndTimeDiv = styled(Div)`
  font-size: calc(48*100vw/1920);
  border-bottom: calc(5*100vw/1920)  #2B2A29 solid;
  padding-bottom: calc(50*100vw/1920);
`;

const StepContentDiv = styled(LargeDiv)`
  font-size: calc(36*100vw/1920);
  width: calc(700*100vw/1920);
  height: calc(450*100vw/1920);
  line-height: calc(50*100vw/1920);
  overflow: auto;
  display: flex;
  align-items: center;
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(1300*100vw/1920);
    height: calc(300*100vw/1920);
    font-size: calc(72*100vw/1920);
    line-height: calc(100*100vw/1920);
    overflow-y: auto;
    white-space: nowrap;
  }
`;

const StepContentAndImgDiv = styled(Div)`
  align-items: center;
  margin-top: calc(36*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    margin-top: calc(5*100vw/1920);
    flex-direction: column;
    justify-content: center;
  }
`;

const DoItYourSelfButton = styled.button`
  position:fixed;
  right: 1.5%;
  top: 40%;
  white-space: normal;
  word-wrap: break-word;
  width: calc(50*100vw/1920);
  height: calc(200*100vw/1920);
  font-size: calc(28*100vw/1920);
  background-color: #EB811F;
  color: #FDFDFC;
  border: 0;
  border-radius: calc(15*100vw/1920);
  cursor: pointer;
  &:hover{
  background-color:#fa8921;
  }
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(100*100vw/1920);
    height: calc(400*100vw/1920);
    font-size: calc(60*100vw/1920);
  }
`;

const TipsDiv = styled.div`
  display: flex;
  align-items: end;
`;

const CommentDiv = styled.div`
  width: calc(1688*100vw/1920);
  height: calc(312*100vw/1920);
  padding: calc(30*100vw/1920);
  background-color: #E5D2C050;
  border-radius: calc(15*100vw/1920);
  margin-bottom: calc(90*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    padding: calc(60*100vw/1920);
    margin-top: calc(90*100vw/1920);
    width: 100%;
    height: calc(600*100vw/1920);
  }
`;

const CommentContentDiv = styled.div`
  font-size: calc(36*100vw/1920);
  padding-left: calc(220*100vw/1920);
  margin-top: calc(25*100vw/1920);
  line-height: calc(64*100vw/1920);
  overflow: auto;
  @media ${devices.Tablet} and (orientation: portrait){
    margin-top: calc(60*100vw/1920);
    font-size: calc(72*100vw/1920);
    line-height: calc(100*100vw/1920);
  }
`;

const CommentTitleSpan = styled.span`
  font-size: calc(36*100vw/1920);
  font-weight: 500;
  @media ${devices.Tablet} and (orientation: portrait){
    font-size: calc(72*100vw/1920);
  }
`;

const Mark = styled.mark`
  display: inline-block;
  line-height: 0;
  padding-bottom: 0.5em;
  background-color: #fec740;
`;

const LineVariant = {
  visible: { opacity: 1, scale: 1, transition: { duration: 1.5 } },
  hidden: { opacity: 0, scale: 0 },
};

function MotionLine() {
  const control = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      control.start('visible');
    } else {
      control.start('hidden');
    }
  }, [control, inView]);

  return (
    <motion.div
      ref={ref}
      variants={LineVariant}
      initial="hidden"
      animate={control}
      style={{ originX: 0, originY: 0 }}
    >
      <Line />
    </motion.div>
  );
}

const ToolTipText = styled.span`
  visibility: hidden;
  width: calc(440*100vw/1920);
  background-color: #26262590;
  font-size: calc(26*100vw/1920);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: calc(20*100vw/1920); 0;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  margin-left: calc(-250*100vw/1920);;
  opacity: 0;
  transition: opacity 1s;
`;

const Icon = styled.span`
  position: relative;
  cursor: pointer;
  font-size: calc(40*100vw/1920);
  display: flex;
  align-items: end;
  &:hover {
    color: #808080;
  }
  & > svg{
    width: calc(50*100vw/1920);
    height: calc(50*100vw/1920);
  }
  & > svg:hover {
    color: #808080;
  }
  &:hover > ${ToolTipText} {
    visibility: visible;
    opacity: 1;
  }
  @media ${devices.Tablet} and (orientation: portrait){
    & > svg{
    width: calc(110*100vw/1920);
    height: calc(110*100vw/1920);
  }
  }
`;

interface ReadRecipeProps {
  onChangeMyFavorites: (newMyFavorites: User['myFavorites']) => void;
}

function ReadRecipe({ onChangeMyFavorites }: ReadRecipeProps) {
  const { userFavorites, userId, checkingUser } = useCheckingUser();
  const initialRecipe: Recipe = {
    title: '',
    difficulty: 1,
    ingredients: [],
    steps: [],
    comment: '',
    mainImage: '',
    authorName: '',
    authorId: '',
    fullTime: 0,
  };
  const [recipeData, setRecipeData] = useState(initialRecipe);
  const {
    title, difficulty, ingredients, steps, comment, mainImage, authorName, authorId, fullTime,
  } = recipeData;
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [stepImgLoaded, setStepImgLoaded] = useState(false);
  const currentRecipeId = location.search.split('=')[1];

  useEffect(() => {
    async function getRecipeData() {
      const currentRecipe = await getRecipe(currentRecipeId);
      setRecipeData(currentRecipe);
    }
    if (currentRecipeId) {
      getRecipeData();
      setLoading(false);
    } else {
      navigate({ pathname: '/home' });
    }
  }, [currentRecipeId, navigate]);

  const exportIngredients = useCallback(() => {
    const copyText = ingredients.reduce((acc, i) => `${acc}${i.ingredientsTitle}:${i.ingredientsQuantity}公克,`, '');
    if (navigator.share) {
      navigator.clipboard.writeText(`【 ${title} 】食材內容: \n ${copyText}`);
      navigator.clipboard.readText().then(() => showCustomAlert(`【 ${title} 】採買清單 \n\n已為您複製囉！ \n\n請自行選擇記錄方式`));
      navigator.share({
        title: `【 ${title} 】 食材內容`,
        text: `【 ${title} 】 食材內容: \n ${copyText}`,
      });
    } else {
      navigator.clipboard.writeText(`【 ${title} 】食材內容: \n ${copyText}`);
      navigator.clipboard.readText().then(() => showCustomAlert(`【 ${title} 】採買清單 \n\n已為您複製囉！ \n\n請自行選擇記錄方式`));
    }
  }, [ingredients, title]);

  function addToFavorites() {
    const isRecipeExisting = userFavorites.some((id) => id === currentRecipeId);
    if (isRecipeExisting) {
      return;
    }
    const updatedMyFavorite = [...userFavorites, currentRecipeId];
    onChangeMyFavorites(updatedMyFavorite);
    updateUserDoc(userId, updatedMyFavorite)
      .then(() => showCustomAlert('已成功加入收藏清單\n\n請前往首頁查看'));
  }

  function removeFromFavorites() {
    const isRecipeExisting = userFavorites.some((id) => id === currentRecipeId);
    if (isRecipeExisting) {
      const updatedMyFavorite = userFavorites.filter((id) => id !== currentRecipeId);
      onChangeMyFavorites(updatedMyFavorite);
      updateUserDoc(userId, updatedMyFavorite)
        .then(() => showCustomAlert('已從收藏清單成功移除'));
    }
  }

  if (checkingUser || loading) {
    return (
      <>
        <Header
          authorId={authorId}
          userId={userId}
          addToFavorites={() => { addToFavorites(); }}
          removeFromFavorites={() => { removeFromFavorites(); }}
          myFavorites={userFavorites}
          currentRecipeId={currentRecipeId}
        />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Header
        authorId={authorId}
        userId={userId}
        addToFavorites={() => { addToFavorites(); }}
        removeFromFavorites={() => { removeFromFavorites(); }}
        myFavorites={userFavorites}
        currentRecipeId={currentRecipeId}
      />
      <Background>
        <TitleWrapper>
          <ExtraLargeDiv>{title}</ExtraLargeDiv>
          <MediumDiv>
            by
            {' '}
            {authorName}
          </MediumDiv>
        </TitleWrapper>
        <ContentWrapper>
          <ContentDiv>
            <LargeDiv>難易度</LargeDiv>
            <Stars stars={difficulty} size={48} spacing={2} fill="#BE0028" />
          </ContentDiv>
          <ContentDiv>
            <LargeDiv>總時長</LargeDiv>
            <LargeDiv>
              {Math.floor(fullTime! / 60) === 0 ? '' : `${Math.floor(fullTime! / 60)}分`}
              {fullTime! % 60 === 0 ? '' : `${fullTime! % 60}秒`}
            </LargeDiv>
          </ContentDiv>
        </ContentWrapper>
        <ContentWrapper>
          {imgLoaded ? (
            <Img
              src={mainImage || defaultImage}
              alt="mainImage"
            />
          ) : (
            <>
              <Img
                style={imgLoaded ? {} : { display: 'none' }}
                src={mainImage || defaultImage}
                alt="mainImage"
                onLoad={() => { setImgLoaded(true); }}
              />
              <ImgDefaultDiv />
            </>
          )}
          <IngredientContentDiv>
            <IngredientTitleDiv>
              <LargeDiv>食材</LargeDiv>
              <Icon onClick={exportIngredients}>
                <IosShare />
                <ToolTipText>匯出食材！方便記錄採買清單</ToolTipText>
              </Icon>
            </IngredientTitleDiv>
            <AllIngredientsDiv>
              {ingredients.map((ingredient) => (
                <Div key={ingredient.id}>
                  <MediumLargeDiv>{ingredient.ingredientsTitle}</MediumLargeDiv>
                  <MediumLargeDiv>
                    {ingredient.ingredientsQuantity}
                    {' '}
                    公克
                  </MediumLargeDiv>
                </Div>
              ))}
            </AllIngredientsDiv>
          </IngredientContentDiv>
        </ContentWrapper>
        {steps.map((step, index) => (
          <div key={step.id}>
            <StepWrapper>
              <StepCircleDiv>
                <Circle>{index + 1}</Circle>
                {index + 1 === steps.length ? <BlankLine /> : <MotionLine />}
              </StepCircleDiv>
              <StepTitleContentWrapper>
                <StepTitleAndTimeDiv>
                  <LargeDiv>{step.stepTitle}</LargeDiv>
                  <LargeDiv>
                    {steps[index].stepMinute === 0 ? '' : `${steps[index].stepMinute}分`}
                    {steps[index].stepSecond === 0 ? '' : `${steps[index].stepSecond}秒`}
                  </LargeDiv>
                </StepTitleAndTimeDiv>
                <StepContentAndImgDiv>
                  <StepContentDiv>
                    {steps[index].stepContent}
                  </StepContentDiv>
                  {stepImgLoaded ? (
                    <StepImg
                      src={steps[index].stepMainImage || defaultImage}
                      alt="stepImages"
                    />
                  ) : (
                    <>
                      <StepImg
                        style={stepImgLoaded ? {} : { display: 'none' }}
                        src={steps[index].stepMainImage || defaultImage}
                        alt="stepImages"
                        onLoad={() => { setStepImgLoaded(true); }}
                      />
                      <StepImgDefaultDiv />
                    </>
                  )}
                </StepContentAndImgDiv>
              </StepTitleContentWrapper>
            </StepWrapper>
          </div>
        ))}
        <CommentDiv>
          <TipsDiv>
            <TipImg src={tipImage} alt="tipImage" />
            <CommentTitleSpan>
              <Mark>小秘訣</Mark>
            </CommentTitleSpan>
          </TipsDiv>
          <CommentContentDiv>
            {comment}
          </CommentContentDiv>
        </CommentDiv>
        <Link to={`/cooking?id=${location.search.split('=')[1]}`}>
          <DoItYourSelfButton>來料理吧</DoItYourSelfButton>
        </Link>
        <ToastContainer />
      </Background>
    </>
  );
}

export default ReadRecipe;
