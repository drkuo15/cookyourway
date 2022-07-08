import {
  useState, useEffect, useContext, useRef,
} from 'react';
import {
  collection, query, where, getDocs, onSnapshot, doc,
} from 'firebase/firestore';
import styled from 'styled-components/macro';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../firestore';
import Stars from '../../components/DisplayStars';
import AuthContext from '../../components/AuthContext';
import HomeHeader from '../../components/HomeHeader';
import Footer from '../../components/Footer';
import searchImage from '../../images/search_FILL0_wght400_GRAD0_opsz48.svg';
import Loading from '../../components/Loading';
import nextIcon from '../../images/next.png';
import beforeIcon from '../../images/before.png';
import mandarin from '../../images/fruits/mandarin.jpg';
import pineapple from '../../images/fruits/pineapple.jpg';
import strawberry from '../../images/fruits/strawberry.jpg';
import blueberry from '../../images/fruits/blueberry.jpg';

const Background = styled.div`
  padding-bottom: calc(80*100vw/1920);
`;

const SearchInput = styled.input`
  width: calc(1282*100vw/1920);
  height: calc(64*100vw/1920);
  border: calc(1*100vw/1920) #2B2A29 solid;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  text-align: center;
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration { display: none; }
`;

const SearchImg = styled.img`
  width: calc(58*100vw/1920);
  height: calc(58*100vw/1920);
  position: absolute;
  right: calc(330*100vw/1920);
  cursor: pointer;
`;

const SearchDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: calc(48*100vw/1920);
  margin-bottom: calc(68*100vw/1920);
  position: relative;
`;

const SectionWithBackground = styled.div`
  width: 100vw;
  ${'' /* height: calc(850*100vw/1920); */}
  ${'' /* background-color: #F7EFE7; */}
  position: relative;
`;

const Section = styled.div`
  width: 100vw;
  ${'' /* height: calc(850*100vw/1920); */}
  position: relative;
`;

const SectionTitle = styled.div`
  font-size: calc(40*100vw/1920);
  padding: calc(80*100vw/1920) 0 calc(40*100vw/1920) calc(129*100vw/1920);
  position: relative;
  font-weight: 400;
  ${'' /* &:after{
    content: "";
    position: absolute;
    bottom: -20px;
    left: 20px;
    width: 60px;
    height: 6px;
    background-color:  #fec740;
    opacity: 0.5;
  } */}
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: calc(81*100vw/1920);
  padding: 0 calc(129*100vw/1920);
`;

const ContentDiv = styled.div`
  display: flex;
  justify-content: space-around;
  width: calc(500*100vw/1920);
  height: calc(600*100vw/1920);
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  ${'' /* display: flex;
  flex-direction: column;
  align-items: center; */}
`;

const Img = styled.img`
  width: calc(500*100vw/1920);
  ${'' /* max-height: calc(369*100vw/1920); */}
  height: calc(350*100vw/1920);
  border-radius: calc(15*100vw/1920);
  transform: scale(1,1);
  transition: 1s;
  &:hover {
    transform: scale(1.1,1.1);
  }
`;

const ImgDiv = styled.div`
  width: calc(500*100vw/1920);
  height: calc(350*100vw/1920);
  overflow: hidden;
`;

const ContentFirstRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: baseline;
  padding: calc(15*100vw/1920);
`;

const ContentTitle = styled.div`
  font-size: calc(36*100vw/1920);
  font-weight: 600;
`;

const ContentAuthor = styled.div`
  font-size: calc(28*100vw/1920);
  margin-top: calc(20*100vw/1920);
  margin-left: calc(4*100vw/1920);
  margin-bottom: calc(20*100vw/1920);
`;

const DefaultText = styled.div`
  height: calc(600*100vw/1920);
  width: calc(1662*100vw/1920);
  font-size: calc(48*100vw/1920);
  display: flex;
  justify-content: center;
  align-items: center;
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
    ${'' /* background: #E5D2C080; */}
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
`;

const RightArrow = styled(LeftArrow)`
    right: calc(80*100vw/1920);
    left: auto;
`;

const ArrowIcon = styled.img`
  width: calc(40*100vw/1920);
  height: calc(40*100vw/1920);
`;

const StarRow = styled.div`
  font-size: calc(20*100vw/1920);
  color: #808080;
`;

const Selections = styled.div`
  display: flex;
  gap: calc(81*100vw/1920);
  padding: 0 calc(129*100vw/1920);
  display: grid;
  grid-template-columns: repeat(2,1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
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

const SelectiveContext = styled.div`
  color: #fff;
  font-size: 2em;
  font-weight: 500;
  letter-spacing: 2px;
  z-index: 100;
  &::after{
    content: "";
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.403921568627451);
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
  const [userId, setUserId] = useState('');
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
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const allRef = useRef(null);
  const recommendRef = useRef(null);
  const userRef = useRef(null);
  const favoriteRef = useRef(null);

  // 當userInfo存在時，取得uid
  useEffect(() => {
    if (userInfo) {
      setUserId(userInfo.uid);
    } else {
      setUserId('');
    }
  }, [userInfo]);

  // 抓出所有食譜
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

  // 抓出我的食譜
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

  // 抓出平均食譜難度
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
        // setUserRecipes(queryDataArray);
        const sum = queryDifficultyArray.reduce((cur, acc) => cur + acc, 0);
        const avg = sum / queryDifficultyArray.length;
        if (avg) {
          setAverageDifficulty(avg);
        }
      });
    }
  }, [userId]);

  // 抓出超過平均食譜難度的食譜
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

  // 抓出我的最愛食譜清單
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

  // 依照最愛清單的食譜id抓出食譜資料
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

  if (loading) {
    return (
      <>
        <HomeHeader />
        <Loading />
      </>
    );
  }

  return (
    <>
      <HomeHeader />
      <Background>
        <SearchDiv>
          <SearchInput
            type="search"
            placeholder="請輸入食譜名稱"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                navigate({ pathname: '/search_recipe', search: `?q=${e.target.value}` });
              }
            }}
            onChange={(e) => { setSearchName(e.target.value); }}
          />
          <SearchImg src={searchImage} alt="searchImage" onClick={() => { navigate({ pathname: '/search_recipe', search: `?q=${searchName}` }); }} />
        </SearchDiv>
        <Selections>
          <Selective onClick={() => { scrollToRef(allRef); }} mainImage={strawberry}>
            <SelectiveContext>全部料理</SelectiveContext>
          </Selective>
          <Selective onClick={() => { scrollToRef(recommendRef); }} mainImage={mandarin}>
            <SelectiveContext>推薦料理</SelectiveContext>
          </Selective>
          <Selective onClick={() => { scrollToRef(userRef); }} mainImage={pineapple}>
            <SelectiveContext>我的料理</SelectiveContext>
          </Selective>
          <Selective onClick={() => { scrollToRef(favoriteRef); }} mainImage={blueberry}>
            <SelectiveContext>最愛料理</SelectiveContext>
          </Selective>
        </Selections>
        <Section ref={allRef}>
          <SectionTitle>所有食譜</SectionTitle>
          {allRecipeIndex >= 1
            ? <LeftArrow onClick={showAllPrevRecipe}><ArrowIcon src={beforeIcon} alt="beforeNavigateIcon" /></LeftArrow>
            : ''}
          <ContentWrapper>
            {allRecipes.slice(allRecipeIndex, allRecipeIndex + 3)
              .map((allRecipe) => (
                <ContentDiv key={allRecipe.recipeId}>
                  <StyledLink to={`/read_recipe?id=${allRecipe.recipeId}`}>
                    <ImgDiv>
                      <Img src={allRecipe.mainImage} alt="食譜封面照" />
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
        </Section>
        <SectionWithBackground ref={recommendRef}>
          <SectionTitle>推薦食譜</SectionTitle>
          {recommendRecipeIndex >= 1
            ? <LeftArrow onClick={showRecommendPrevRecipe}><ArrowIcon src={beforeIcon} alt="beforeNavigateIcon" /></LeftArrow>
            : ''}
          <ContentWrapper>
            {recommendRecipes.slice(recommendRecipeIndex, recommendRecipeIndex + 3)
              .map((recommendRecipe) => (
                <ContentDiv key={recommendRecipe.recipeId}>
                  <StyledLink to={`/read_recipe?id=${recommendRecipe.recipeId}`}>
                    <ImgDiv>
                      <Img src={recommendRecipe.mainImage} alt="食譜封面照" />
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
        </SectionWithBackground>
        <Section ref={userRef}>
          <SectionTitle>我的食譜</SectionTitle>
          {userRecipeIndex >= 1
            ? <LeftArrow onClick={showUserPrevRecipe}><ArrowIcon src={beforeIcon} alt="beforeNavigateIcon" /></LeftArrow>
            : ''}
          <ContentWrapper>
            {userRecipes.length !== 0 ? userRecipes.slice(userRecipeIndex, userRecipeIndex + 3)
              .map((userRecipe) => (
                <ContentDiv key={userRecipe.recipeId}>
                  <StyledLink to={`/read_recipe?id=${userRecipe.recipeId}`}>
                    <ImgDiv>
                      <Img src={userRecipe.mainImage} alt="食譜封面照" />
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
        </Section>
        <SectionWithBackground ref={favoriteRef}>
          <SectionTitle>最愛食譜</SectionTitle>
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
                      <Img src={favoriteRecipe.mainImage} alt="食譜封面照" />
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
        </SectionWithBackground>
      </Background>
      <Footer />
    </>
  );
}

export default AuthHome;
