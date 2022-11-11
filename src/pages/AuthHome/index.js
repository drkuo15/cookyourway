import {
  useState, useEffect, useContext, useRef,
} from 'react';
import {
  collection, query, where, getDocs, onSnapshot, doc,
} from 'firebase/firestore';
import styled, { keyframes } from 'styled-components/macro';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../firestore';
import { devices } from '../../utils/StyleUtils';
import Stars from '../../components/DisplayStars';
import AuthContext from '../../components/AuthContext';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import nextIcon from '../../images/next.webp';
import beforeIcon from '../../images/before.webp';
import mandarin from '../../images/fruits/mandarin.webp';
import pineapple from '../../images/fruits/pineapple.webp';
import strawberry from '../../images/fruits/strawberry.webp';
import blueberry from '../../images/fruits/blueberry.webp';

const Background = styled.div`
  padding-bottom: calc(80*100vw/1920);
  color: #2B2A29;
  @media ${devices.Tablet} and (orientation:portrait) {
    padding-bottom: calc(160*100vw/1920);
  }
`;

const SectionWithBackground = styled.div`
  width: 100%;
  position: relative;
`;

const Section = styled.div`
  width: 100%;
  position: relative;
`;

const SectionTitle = styled.div`
  font-size: calc(40*100vw/1920);
  padding: calc(80*100vw/1920) 0 calc(40*100vw/1920) calc(129*100vw/1920);
  position: relative;
  font-weight: 400;
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(100*100vw/1920);
  }
`;

const Mark = styled.mark`
  display: inline-block;
  line-height: 0;
  padding-bottom: calc(40*100vw/1920);
  background-color: #fec74099;
  @media ${devices.Tablet} and (orientation:portrait) {
    padding-bottom: calc(80*100vw/1920);
  }
`;

const FullContentWrapper = styled.div`
  @media ${devices.Tablet} and (orientation:portrait) {
    display: -webkit-box;
    overflow: auto;
    position: relative;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: calc(81*100vw/1920);
  padding: 0 calc(129*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(3450*100vw/1920);
  }
`;

const ContentDiv = styled.div`
  display: flex;
  justify-content: space-around;
  width: calc(500*100vw/1920);
  height: calc(600*100vw/1920);
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1000*100vw/1920);
    height: calc(1200*100vw/1920);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Img = styled.img`
  width: calc(500*100vw/1920);
  height: calc(350*100vw/1920);
  border-radius: calc(15*100vw/1920);
  transform: scale(1,1);
  transition: 1s;
  &:hover {
    transform: scale(1.1,1.1);
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1000*100vw/1920);
    height: calc(700*100vw/1920);
  }
`;
const Shine = keyframes`
  to {
    background-position-x: -200%;
  }
`;

const ImgDefaultDiv = styled.div`
  width: calc(500*100vw/1920);
  height: calc(350*100vw/1920);
  border-radius: calc(15*100vw/1920);
  background: #eee;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: 1.5s ${Shine} linear infinite;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1000*100vw/1920);
    height: calc(700*100vw/1920);
  }
`;

const ImgDiv = styled.div`
  width: calc(500*100vw/1920);
  height: calc(350*100vw/1920);
  overflow: hidden;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1000*100vw/1920);
    height: calc(700*100vw/1920);
  }
`;

const ContentFirstRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: baseline;
  padding: calc(15*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    padding: calc(30*100vw/1920);
  }
`;

const ContentTitle = styled.div`
  font-size: calc(36*100vw/1920);
  font-weight: 600;
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(90*100vw/1920);
  }
`;

const ContentAuthor = styled.div`
  font-size: calc(28*100vw/1920);
  margin-top: calc(20*100vw/1920);
  margin-left: calc(4*100vw/1920);
  margin-bottom: calc(20*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(70*100vw/1920);
    margin-top: calc(40*100vw/1920);
    margin-left: calc(8*100vw/1920);
    margin-bottom: calc(40*100vw/1920);
  }
`;

const DefaultText = styled.div`
  height: calc(300*100vw/1920);
  width: calc(1662*100vw/1920);
  font-size: calc(48*100vw/1920);
  display: flex;
  justify-content: center;
  align-items: center;
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(600*100vw/1920);
    font-size: calc(120*100vw/1920);
  }
`;

const LeftArrow = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  outline: 0;
  transition: all .2s;
  border-radius: 35px;
  border: 0;
  background: rgba(0,0,0,.5);
  width: calc(75*100vw/1920);
  height: calc(75*100vw/1920);
  bottom: calc(350*100vw/1920);
  left: calc(80*100vw/1920);
  opacity: 1;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0px 0px 3px #fdfdfc;
  &:hover{
    background-color: #EB811F;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    ${'' /* position: static; */}
    width: calc(150*100vw/1920);
    height: calc(150*100vw/1920);
    bottom: calc(700*100vw/1920);
    left: calc(50*100vw/1920);
  }
`;

const RightArrow = styled(LeftArrow)`
  right: calc(80*100vw/1920);
  left: auto;
  @media ${devices.Tablet} and (orientation:portrait) {
    right: calc(-1450*100vw/1920);
  }
`;

const ArrowIcon = styled.img`
  width: calc(40*100vw/1920);
  height: calc(40*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(80*100vw/1920);
    height: calc(80*100vw/1920);
  }
`;

const StarRow = styled.div`
  font-size: calc(20*100vw/1920);
  color: #808080;
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(50*100vw/1920);
  }
`;

const Selections = styled.div`
  display: flex;
  gap: calc(81*100vw/1920);
  padding: 0 calc(129*100vw/1920);
  display: grid;
  grid-template-columns: repeat(2,1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  margin-top: calc(100*100vw/1920);
`;

const Selective = styled.div`
    height: 150px;
    background-color: #e4e6e9;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    position: relative;
    cursor: pointer;
    background-image: url(${(props) => (props.mainImage)})
`;

const DefaultSelective = styled.div`
  height: 150px;
  border-radius: 5px;
  background: #eee;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: 1.5s ${Shine} linear infinite;
`;

const SelectiveContext = styled.div`
  color: #fff;
  font-size: 1.8em;
  font-weight: 500;
  letter-spacing: 2px;
  &::after{
    content: "";
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.203921568627451);
    position: absolute;
    border-radius: 5px;
    top: 0;
    left: 0;
    transition: all .2s;
  }
  &:hover{
    &::after{
      background-color: rgba(0,0,0,.06274509803921569);
    }
  }
`;

function AuthHome() {
  const userInfo = useContext(AuthContext);
  const userId = userInfo?.uid || '';
  const [userRecipes, setUserRecipes] = useState([]);
  const [userRecipeIndex, setUserRecipeIndex] = useState(0);
  const [averageDifficulty, setAverageDifficulty] = useState(1);
  const [recommendRecipes, setRecommendRecipes] = useState([]);
  const [recommendRecipeIndex, setRecommendRecipeIndex] = useState(0);
  const [myFavorites, setMyFavorites] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [favoriteRecipeIndex, setFavoriteRecipeIndex] = useState(0);
  const [allRecipes, setAllRecipes] = useState([]);
  const [allRecipeIndex, setAllRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const allRef = useRef(null);
  const recommendRef = useRef(null);
  const userRef = useRef(null);
  const favoriteRef = useRef(null);

  const [checkingUser, setCheckingUser] = useState(true);
  const navigate = useNavigate();

  const [imgLoaded, setImgLoaded] = useState(false);
  const [sectionImgLoaded, setSectionImgLoaded] = useState(false);

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
    const recipeRef = collection(db, 'recipes');
    let queryDataArray = [];
    getDocs(recipeRef).then((querySnapshot) => {
      querySnapshot.forEach(
        (document) => {
          queryDataArray = [...queryDataArray, document.data()];
        },
      );
      setAllRecipes(queryDataArray);
    });
  }, [userId]);

  useEffect(() => {
    const recipeRef = collection(db, 'recipes');
    if (userId) {
      const q = query(recipeRef, where('authorId', '==', userId));
      let queryDataArray = [];
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(
          (document) => {
            queryDataArray = [...queryDataArray, document.data()];
          },
        );
        setUserRecipes(queryDataArray);
      });
    }
  }, [userId]);

  useEffect(() => {
    const recipeRef = collection(db, 'recipes');
    if (userId) {
      const q = query(recipeRef, where('authorId', '==', userId));
      let queryDifficultyArray = [];
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(
          (document) => {
            queryDifficultyArray = [...queryDifficultyArray, document.data().difficulty];
          },
        );
        const sum = queryDifficultyArray.reduce((cur, acc) => cur + acc, 0);
        const avg = sum / queryDifficultyArray.length;
        if (avg) {
          setAverageDifficulty(avg);
        }
      });
    }
  }, [userId]);

  useEffect(() => {
    const recipeRef = collection(db, 'recipes');
    const q = query(recipeRef, where('difficulty', '>=', averageDifficulty));
    let queryRecipeArray = [];
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach(
        (document) => {
          queryRecipeArray = [...queryRecipeArray, document.data()];
        },
      );
      const filterRecipeArray = queryRecipeArray.filter((recipe) => recipe.authorId !== userId);
      setRecommendRecipes(filterRecipeArray);
      setLoading(false);
    });
  }, [averageDifficulty, userId]);

  useEffect(() => {
    if (userId) {
      const UserRef = doc(db, 'users', userId);
      const unsubscribe = onSnapshot(
        UserRef,
        (document) => {
          const userdata = document.data();
          if (userdata.myFavorites) {
            setMyFavorites(userdata.myFavorites);
          }
        },
      );
      return () => { unsubscribe(); };
    }
    return undefined;
  }, [userId]);

  useEffect(() => {
    const recipeRef = collection(db, 'recipes');
    getDocs(recipeRef)
      .then((res) => res.docs.map((docc) => docc.data()))
      .then((data) => data.filter((each) => myFavorites.includes(each.recipeId)))
      .then((dataArray) => setFavoriteRecipes(dataArray));
  }, [myFavorites]);

  const showUserNextRecipe = () => {
    setUserRecipeIndex((prev) => prev + 1);
  };

  const showUserPrevRecipe = () => {
    setUserRecipeIndex((prev) => prev - 1);
  };

  const showRecommendNextRecipe = () => {
    setRecommendRecipeIndex((prev) => prev + 1);
  };

  const showRecommendPrevRecipe = () => {
    setRecommendRecipeIndex((prev) => prev - 1);
  };

  const showFavoriteNextRecipe = () => {
    setFavoriteRecipeIndex((prev) => prev + 1);
  };

  const showFavoritePrevRecipe = () => {
    setFavoriteRecipeIndex((prev) => prev - 1);
  };

  const showAllNextRecipe = () => {
    setAllRecipeIndex((prev) => prev + 1);
  };

  const showAllPrevRecipe = () => {
    setAllRecipeIndex((prev) => prev - 1);
  };

  const scrollToRef = (ref) => { ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' }); };

  if (checkingUser) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Header />
      <Background>
        <Selections>
          {sectionImgLoaded ? (
            <Selective onClick={() => { scrollToRef(allRef); }} mainImage={strawberry}>
              <SelectiveContext>全部料理</SelectiveContext>
            </Selective>
          ) : (
            <>
              <Img
                style={sectionImgLoaded ? {} : { display: 'none' }}
                src={strawberry}
                alt="食譜封面照"
                onLoad={() => { setSectionImgLoaded(true); }}
              />
              <DefaultSelective />
            </>
          )}
          {sectionImgLoaded ? (
            <Selective onClick={() => { scrollToRef(recommendRef); }} mainImage={mandarin}>
              <SelectiveContext>推薦料理</SelectiveContext>
            </Selective>
          ) : (
            <>
              <Img
                style={sectionImgLoaded ? {} : { display: 'none' }}
                src={strawberry}
                alt="食譜封面照"
                onLoad={() => { setSectionImgLoaded(true); }}
              />
              <DefaultSelective />
            </>
          )}
          {sectionImgLoaded ? (
            <Selective onClick={() => { scrollToRef(userRef); }} mainImage={pineapple}>
              <SelectiveContext>我的料理</SelectiveContext>
            </Selective>
          ) : (
            <>
              <Img
                style={sectionImgLoaded ? {} : { display: 'none' }}
                src={strawberry}
                alt="食譜封面照"
                onLoad={() => { setSectionImgLoaded(true); }}
              />
              <DefaultSelective />
            </>
          )}
          {sectionImgLoaded ? (
            <Selective onClick={() => { scrollToRef(favoriteRef); }} mainImage={blueberry}>
              <SelectiveContext>收藏料理</SelectiveContext>
            </Selective>
          ) : (
            <>
              <Img
                style={sectionImgLoaded ? {} : { display: 'none' }}
                src={mandarin}
                alt="食譜封面照"
                onLoad={() => { setSectionImgLoaded(true); }}
              />
              <DefaultSelective />
            </>
          )}
        </Selections>
        <Section ref={allRef}>
          <SectionTitle>
            <Mark>全部料理</Mark>
          </SectionTitle>
          <FullContentWrapper>
            {allRecipeIndex >= 1
              ? <LeftArrow onClick={showAllPrevRecipe}><ArrowIcon src={beforeIcon} alt="beforeNavigateIcon" /></LeftArrow>
              : ''}
            <ContentWrapper>
              {allRecipes.slice(allRecipeIndex, allRecipeIndex + 3)
                .map((allRecipe) => (
                  <ContentDiv key={allRecipe.recipeId}>
                    <StyledLink to={`/read_recipe?id=${allRecipe.recipeId}`}>
                      <ImgDiv>
                        {imgLoaded ? (
                          <Img
                            src={allRecipe.mainImage}
                            alt="食譜封面照"
                          />
                        ) : (
                          <>
                            <Img
                              style={imgLoaded ? {} : { display: 'none' }}
                              src={allRecipe.mainImage}
                              alt="食譜封面照"
                              onLoad={() => { setImgLoaded(true); }}
                            />
                            <ImgDefaultDiv />
                          </>
                        )}
                      </ImgDiv>
                      <ContentFirstRow>
                        <ContentTitle>{allRecipe.title}</ContentTitle>
                        <ContentAuthor>
                          by
                          {' '}
                          {allRecipe.authorName}
                        </ContentAuthor>
                        <StarRow>
                          <Stars stars={allRecipe.difficulty} size={40} spacing={2} fill="#BE0028" />
                          (難度)
                        </StarRow>
                      </ContentFirstRow>
                    </StyledLink>
                  </ContentDiv>
                ))}
            </ContentWrapper>
            {allRecipeIndex <= allRecipes.length - 4
              ? <RightArrow onClick={showAllNextRecipe}><ArrowIcon src={nextIcon} alt="nextIconImage" /></RightArrow>
              : ''}
          </FullContentWrapper>
        </Section>
        <SectionWithBackground ref={recommendRef}>
          <SectionTitle>
            <Mark>推薦料理</Mark>
          </SectionTitle>
          <FullContentWrapper>
            {recommendRecipeIndex >= 1
              ? <LeftArrow onClick={showRecommendPrevRecipe}><ArrowIcon src={beforeIcon} alt="beforeNavigateIcon" /></LeftArrow>
              : ''}
            <ContentWrapper>
              {recommendRecipes.slice(recommendRecipeIndex, recommendRecipeIndex + 3)
                .map((recommendRecipe) => (
                  <ContentDiv key={recommendRecipe.recipeId}>
                    <StyledLink to={`/read_recipe?id=${recommendRecipe.recipeId}`}>
                      <ImgDiv>
                        {imgLoaded ? (
                          <Img
                            src={recommendRecipe.mainImage}
                            alt="食譜封面照"
                          />
                        ) : (
                          <>
                            <Img
                              style={imgLoaded ? {} : { display: 'none' }}
                              src={recommendRecipe.mainImage}
                              alt="食譜封面照"
                              onLoad={() => { setImgLoaded(true); }}
                            />
                            <ImgDefaultDiv />
                          </>
                        )}
                      </ImgDiv>
                      <ContentFirstRow>
                        <ContentTitle>{recommendRecipe.title}</ContentTitle>
                        <ContentAuthor>
                          by
                          {' '}
                          {recommendRecipe.authorName}
                        </ContentAuthor>
                        <StarRow>
                          <Stars stars={recommendRecipe.difficulty} size={40} spacing={2} fill="#BE0028" />
                          (難度)
                        </StarRow>
                      </ContentFirstRow>
                    </StyledLink>
                  </ContentDiv>
                ))}
            </ContentWrapper>
            {recommendRecipeIndex <= recommendRecipes.length - 4
              ? <RightArrow onClick={showRecommendNextRecipe}><ArrowIcon src={nextIcon} alt="nextIconImage" /></RightArrow>
              : ''}
          </FullContentWrapper>
        </SectionWithBackground>
        <Section ref={userRef}>
          <SectionTitle>
            <Mark>我的料理</Mark>
          </SectionTitle>
          <FullContentWrapper>
            {userRecipeIndex >= 1
              ? <LeftArrow onClick={showUserPrevRecipe}><ArrowIcon src={beforeIcon} alt="beforeNavigateIcon" /></LeftArrow>
              : ''}
            <ContentWrapper>
              {userRecipes.length !== 0 ? userRecipes.slice(userRecipeIndex, userRecipeIndex + 3)
                .map((userRecipe) => (
                  <ContentDiv key={userRecipe.recipeId}>
                    <StyledLink to={`/read_recipe?id=${userRecipe.recipeId}`}>
                      <ImgDiv>
                        {imgLoaded ? (
                          <Img
                            src={userRecipe.mainImage}
                            alt="食譜封面照"
                          />
                        ) : (
                          <>
                            <Img
                              style={imgLoaded ? {} : { display: 'none' }}
                              src={userRecipe.mainImage}
                              alt="食譜封面照"
                              onLoad={() => { setImgLoaded(true); }}
                            />
                            <ImgDefaultDiv />
                          </>
                        )}
                      </ImgDiv>
                      <ContentFirstRow>
                        <ContentTitle>{userRecipe.title}</ContentTitle>
                        <ContentAuthor>
                          by
                          {' '}
                          {userRecipe.authorName}
                        </ContentAuthor>
                        <StarRow>
                          <Stars stars={userRecipe.difficulty} size={40} spacing={2} fill="#BE0028" />
                          (難度)
                        </StarRow>
                      </ContentFirstRow>
                    </StyledLink>
                  </ContentDiv>
                ))
                : <DefaultText>尚未建立任何食譜</DefaultText>}
            </ContentWrapper>
            {userRecipeIndex <= userRecipes.length - 4
              ? <RightArrow onClick={showUserNextRecipe}><ArrowIcon src={nextIcon} alt="nextIconImage" /></RightArrow>
              : ''}

          </FullContentWrapper>
        </Section>
        <SectionWithBackground ref={favoriteRef}>
          <SectionTitle>
            <Mark>收藏料理</Mark>
          </SectionTitle>
          <FullContentWrapper>
            {favoriteRecipeIndex >= 1
              ? <LeftArrow onClick={showFavoritePrevRecipe}><ArrowIcon src={beforeIcon} alt="beforeNavigateIcon" /></LeftArrow>
              : ''}
            <ContentWrapper>
              {favoriteRecipes.length !== 0 ? favoriteRecipes
                .slice(favoriteRecipeIndex, favoriteRecipeIndex + 3)
                .map((favoriteRecipe) => (
                  <ContentDiv key={favoriteRecipe.recipeId}>
                    <StyledLink to={`/read_recipe?id=${favoriteRecipe.recipeId}`}>
                      <ImgDiv>
                        {imgLoaded ? (
                          <Img
                            src={favoriteRecipe.mainImage}
                            alt="食譜封面照"
                          />
                        ) : (
                          <>
                            <Img
                              style={imgLoaded ? {} : { display: 'none' }}
                              src={favoriteRecipe.mainImage}
                              alt="食譜封面照"
                              onLoad={() => { setImgLoaded(true); }}
                            />
                            <ImgDefaultDiv />
                          </>
                        )}
                      </ImgDiv>
                      <ContentFirstRow>
                        <ContentTitle>{favoriteRecipe.title}</ContentTitle>
                        <ContentAuthor>
                          by
                          {' '}
                          {favoriteRecipe.authorName}
                        </ContentAuthor>
                        <StarRow>
                          <Stars stars={favoriteRecipe.difficulty} size={40} spacing={2} fill="#BE0028" />
                          (難度)
                        </StarRow>
                      </ContentFirstRow>
                    </StyledLink>
                  </ContentDiv>
                )) : <DefaultText>尚未收藏任何食譜</DefaultText>}
            </ContentWrapper>
            {favoriteRecipeIndex <= favoriteRecipes.length - 4
              ? <RightArrow onClick={showFavoriteNextRecipe}><ArrowIcon src={nextIcon} alt="nextIconImage" /></RightArrow>
              : ''}

          </FullContentWrapper>
        </SectionWithBackground>
      </Background>
    </>
  );
}

export default AuthHome;
