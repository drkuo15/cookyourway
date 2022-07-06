import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion, useAnimation } from 'framer-motion'; // npm i react-intersection-observer framer-motion
import { useInView } from 'react-intersection-observer';
import { db } from '../../firestore';
import Stars from '../../components/DisplayStars';
import defaultImage from '../../images/upload.png';
import { ToastContainer, showCustomAlert } from '../../components/CustomAlert';
import AuthContext from '../../components/AuthContext';
import Footer from '../../components/Footer';
import ReadRecipeHeader from '../../components/ReadRecipeHeader';
import tipImage from '../../images/tips.png';

const Background = styled.div`
  padding: 0 calc(116*100vw/1920);
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LogoImg = styled.img`
  width: calc(70*100vw/1920);
  height: calc(70*100vw/1920);
`;

const Img = styled.img`
  width: calc(800*100vw/1920);
  height: calc(600*100vw/1920);
  border-radius: calc(15*100vw/1920)
`;

const StepImg = styled.img`
  width: calc(600*100vw/1920);
  height: calc(450*100vw/1920);
  border-radius: calc(15*100vw/1920)
`;

const TitleWrapper = styled(Div)`
  justify-content: center;
  align-items: end;
  margin-top: calc(38*100vw/1920);
  gap: calc(36*100vw/1920);
`;

const ExtraLargeDiv = styled.div`
  font-size: calc(76*100vw/1920);
`;

const LargeDiv = styled.div`
  font-size: calc(48*100vw/1920);
`;

const MediumLargeDiv = styled.div`
  font-size: calc(36*100vw/1920);
  margin: calc(20*100vw/1920);
`;

const MediumDiv = styled.div`
  font-size: calc(28*100vw/1920);
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: calc(88*100vw/1920);
  margin-top: calc(60*100vw/1920);
`;

const ContentDiv = styled.div`
  width: calc(800*100vw/1920);
  display: flex;
  justify-content: space-between;
`;

const IngredientContentDiv = styled(ContentDiv)`
  flex-direction: column;
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
  padding: calc(16*100vw/1920);
  justify-content: start;
  width: calc(800*100vw/1920);
  height: calc(600*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
`;

const IngredientTitleDiv = styled(Div)`
  border-bottom: calc(2*100vw/1920)  #2B2A29 solid;
  padding-bottom: calc(15*100vw/1920);
`;

const AllIngredientsDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: calc(15*100vw/1920);
  overflow: scroll;
`;

const ExportButton = styled.div`
  width: calc(150*100vw/1920);
  height: calc(64*100vw/1920);
  color: #FDFDFC;
  background-color: #584743;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const StepCircleDiv = styled.div`
  width: calc(288*100vw/1920);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
`;

const Line = styled.div`
  width: calc(2.5*100vw/1920);
  height: calc(625*100vw/1920);
  background-color: #2B2A29;
`;

const BlankLine = styled(Line)`
  background-color: #FDFDFC;
`;

const StepWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StepTitleContentWrapper = styled.div`
  height: calc(650*100vw/1920);
  width: calc(1400*100vw/1920);
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
  overflow: scroll;
  display: flex;
  align-items: center;
`;

const StepContentAndImgDiv = styled(Div)`
  align-items: center;
  margin-top: calc(36*100vw/1920);
`;

const DoItYourSelfButton = styled.button`
  position:fixed;
  right: 1.5%;
  top: 50%;
  white-space: normal;
  word-wrap: break-word;
  width: calc(50*100vw/1920);
  height: calc(286*100vw/1920);
  font-size: calc(28*100vw/1920);
  background-color: #EB811F50;
  border: 0;
  border-radius: calc(15*100vw/1920);
  cursor: pointer;
`;

const TipsDiv = styled.div`
  display: flex;
  align-items: center;
`;

const CommentDiv = styled.div`
  width: calc(1688*100vw/1920);
  height: calc(312*100vw/1920);
  padding: calc(30*100vw/1920);
  background-color: #E5D2C050;
  border-radius: calc(15*100vw/1920);
  margin-bottom: calc(90*100vw/1920);
`;

const CommentContentDiv = styled.div`
  font-size: calc(36*100vw/1920);
  padding-left: calc(220*100vw/1920);
  margin-top: calc(25*100vw/1920);
`;

// https://blog.logrocket.com/react-scroll-animations-framer-motion/
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

function ReadRecipe() {
  const userInfo = useContext(AuthContext);
  const [userId, setUserId] = useState('');
  const [myFavorites, setMyFavorites] = useState([]);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [comment, setComment] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [fullTime, setFulltime] = useState(0);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // 當userInfo存在時，取得uid
  useEffect(() => {
    if (userInfo) {
      setUserId(userInfo.uid);
      setMyFavorites(userInfo.myFavorites);
    } else {
      setUserId('');
      setMyFavorites([]);
    }
  }, [userInfo]);

  const currentRecipeId = location.search.split('=')[1];
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'recipes', currentRecipeId),
      (document) => {
        const recipeData = document.data();
        setTitle(recipeData.title);
        setDifficulty(recipeData.difficulty);
        setImgUrl(recipeData.mainImage);
        setIngredients(recipeData.ingredients);
        setSteps(recipeData.steps);
        setComment(recipeData.comment);
        setAuthorName(recipeData.authorName);
        setAuthorId(recipeData.authorId);
        setFulltime(recipeData.fullTime);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [currentRecipeId]);

  const copyText = ingredients.reduce((acc, i) => `${acc}${i.ingredientsTitle}:${i.ingredientsQuantity}公克,`, '');

  function exportIngredients() {
    if (navigator.share) {
      navigator.share({
        title: `${title}食材內容`,
        text: `${title}食材內容:${copyText}`,
      });
    } else {
      navigator.clipboard.writeText(`【 ${title} 】  食材內容: \n ${copyText}`);
      navigator.clipboard.readText().then((text) => showCustomAlert(`已成功複製\n${text}`));
    }
  }

  function addToFavorites() {
    const UserRef = doc(db, 'users', userId);
    const isRecipeExisting = myFavorites.some((id) => id === currentRecipeId);
    if (isRecipeExisting) {
      return;
    }
    const updatedMyFavorite = [...myFavorites, currentRecipeId];
    setMyFavorites(updatedMyFavorite);
    updateDoc(UserRef, { myFavorites: updatedMyFavorite });
  }

  function removeFromFavorites() {
    const UserRef = doc(db, 'users', userId);
    const isRecipeExisting = myFavorites.some((id) => id === currentRecipeId);
    if (isRecipeExisting) {
      const updatedMyFavorite = myFavorites.filter((id) => id !== currentRecipeId);
      setMyFavorites(updatedMyFavorite);
      updateDoc(UserRef, { myFavorites: updatedMyFavorite });
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ReadRecipeHeader
        authorId={authorId}
        userId={userId}
        addToFavorites={() => { addToFavorites(); }}
        removeFromFavorites={() => { removeFromFavorites(); }}
        myFavorites={myFavorites}
        currentRecipeId={currentRecipeId}
      />
      <Background>
        <TitleWrapper>
          <ExtraLargeDiv>{title}</ExtraLargeDiv>
          <MediumDiv>
            by
            {authorName}
          </MediumDiv>
        </TitleWrapper>
        <ContentWrapper>
          <ContentDiv>
            <LargeDiv>難易度</LargeDiv>
            <Stars stars={difficulty} size={48} spacing={2} fill="#EB811F" />
          </ContentDiv>
          <ContentDiv>
            <LargeDiv>總時長</LargeDiv>
            <LargeDiv>
              {Math.floor(fullTime / 60) === 0 ? '' : `${Math.floor(fullTime / 60)}分`}
              {fullTime % 60 === 0 ? '' : `${fullTime % 60}秒`}
            </LargeDiv>
          </ContentDiv>
        </ContentWrapper>
        <ContentWrapper>
          <Img src={imgUrl || defaultImage} alt="stepImages" />
          <IngredientContentDiv>
            <IngredientTitleDiv>
              <LargeDiv>食材</LargeDiv>
              <ExportButton type="button" onClick={() => exportIngredients()}>匯出食材</ExportButton>
            </IngredientTitleDiv>
            <AllIngredientsDiv>
              {ingredients.map((ingredient) => (
                <Div key={ingredient.id}>
                  <MediumLargeDiv>{ingredient.ingredientsTitle}</MediumLargeDiv>
                  <MediumLargeDiv>
                    {ingredient.ingredientsQuantity}
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
                  <StepImg src={steps[index].stepImgUrl || defaultImage} alt="stepImages" />
                </StepContentAndImgDiv>
              </StepTitleContentWrapper>
            </StepWrapper>
          </div>
        ))}
        <CommentDiv>
          <TipsDiv>
            <LogoImg src={tipImage} alt="tipImage" />
            <LargeDiv>小秘訣</LargeDiv>
          </TipsDiv>
          <CommentContentDiv>
            {comment}
          </CommentContentDiv>
        </CommentDiv>
        <Link to={`/cooking?id=${location.search.split('=')[1]}`}>
          <DoItYourSelfButton>小試身手</DoItYourSelfButton>
        </Link>
        <ToastContainer />
      </Background>
      <Footer />
    </>
  );
}

Stars.propTypes = {
  stars: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  spacing: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
};

export default ReadRecipe;
