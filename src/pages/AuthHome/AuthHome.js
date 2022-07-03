import { useState, useEffect, useContext } from 'react';
import {
  collection, query, where, getDocs, onSnapshot, doc,
} from 'firebase/firestore';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../firestore';
import Stars from '../../components/DisplayStars';
import AuthContext from '../../components/AuthContext';
import HomeHeader from '../../components/HomeHeader';
import Footer from '../../components/Footer';
import searchImage from '../../images/search_FILL0_wght400_GRAD0_opsz48.svg';
import leftImage from '../../images/chevron_left_FILL0_wght400_GRAD0_opsz48.svg';
import rightImage from '../../images/chevron_right_FILL0_wght400_GRAD0_opsz48.svg';

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
  height: calc(850*100vw/1920);
  background-color: #F7EFE7;
  position: relative;
`;

const Section = styled.div`
  width: 100vw;
  height: calc(850*100vw/1920);
  position: relative;
`;

const SectionTitle = styled.div`
  font-size: calc(76*100vw/1920);
  padding: calc(40*100vw/1920) 0 calc(45*100vw/1920) calc(158*100vw/1920);
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: calc(51*100vw/1920);
  padding: 0 calc(129*100vw/1920);
`;

const ContentDiv = styled.div`
  display: flex;
  justify-content: space-around;
  width: calc(520*100vw/1920);
  height: calc(600*100vw/1920);
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const Img = styled.img`
  width: calc(492*100vw/1920);
  max-height: calc(369*100vw/1920);
  border-radius: calc(15*100vw/1920);
`;

const ContentFirstRow = styled.div`
  width: calc(520*100vw/1920);
  display: flex;
  justify-content: space-around;
  align-items: baseline;
`;

const ContentTitle = styled.div`
  font-size: calc(48*100vw/1920);
`;

const ContentAuthor = styled.div`
  font-size: calc(28*100vw/1920);
`;

const PrevArrowImage = styled.img`
  width: calc(143*100vw/1920);
  height: calc(143*100vw/1920);
  display: inline-block;
  position: absolute;
  bottom: calc(300*100vw/1920);
  cursor: pointer;
`;

const PrevArrowDiv = styled.div`
  width: calc(143*100vw/1920);
  height: calc(143*100vw/1920);
  display: inline-block;
  position: absolute;
  bottom: calc(300*100vw/1920);
`;

const NextArrowImage = styled(PrevArrowImage)`
  right: 0;
`;

const NextArrowDiv = styled(PrevArrowDiv)`
  right: 0;
`;

const DefaultText = styled.div`
  height: calc(600*100vw/1920);
  width: calc(1662*100vw/1920);
  font-size: calc(48*100vw/1920);
  display: flex;
  justify-content: center;
  align-items: center;
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
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();

  // 當userInfo存在時，取得uid
  useEffect(() => {
    if (userInfo) {
      setUserId(userInfo.uid);
    } else {
      setUserId('');
    }
  }, [userInfo]);

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

  return (
    <>
      <HomeHeader />
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
      <SectionWithBackground>
        <SectionTitle>推薦食譜</SectionTitle>
        {recommendRecipeIndex >= 1
          ? <PrevArrowImage src={leftImage} alt="leftImage" onClick={showRecommendPrevRecipe} />
          : <PrevArrowDiv />}
        <ContentWrapper>
          {recommendRecipes.slice(recommendRecipeIndex, recommendRecipeIndex + 3)
            .map((recommendRecipe) => (
              <ContentDiv key={recommendRecipe.recipeId}>
                <StyledLink to={`/read_recipe?id=${recommendRecipe.recipeId}`}>
                  <Img src={recommendRecipe.mainImage} alt="食譜封面照" />
                  <ContentFirstRow>
                    <ContentTitle>{recommendRecipe.title}</ContentTitle>
                    <ContentAuthor>
                      by
                      {recommendRecipe.authorName}
                    </ContentAuthor>
                  </ContentFirstRow>
                  <Stars stars={recommendRecipe.difficulty} size={48} spacing={2} fill="#EB811F" />
                </StyledLink>
              </ContentDiv>
            ))}
        </ContentWrapper>
        {recommendRecipeIndex <= recommendRecipes.length - 4
          ? <NextArrowImage src={rightImage} alt="rightImage" onClick={showRecommendNextRecipe} />
          : <NextArrowDiv />}
      </SectionWithBackground>
      <Section>
        <SectionTitle>我的食譜</SectionTitle>
        {userRecipeIndex >= 1
          ? <PrevArrowImage src={leftImage} alt="leftImage" onClick={showUserPrevRecipe} />
          : <PrevArrowDiv />}
        <ContentWrapper>
          {userRecipes.length !== 0 ? userRecipes.slice(userRecipeIndex, userRecipeIndex + 3)
            .map((userRecipe) => (
              <ContentDiv key={userRecipe.recipeId}>
                <StyledLink to={`/read_recipe?id=${userRecipe.recipeId}`}>
                  <Img src={userRecipe.mainImage} alt="食譜封面照" />
                  <ContentFirstRow>
                    <ContentTitle>{userRecipe.title}</ContentTitle>
                    <ContentAuthor>
                      by
                      {' '}
                      {userRecipe.authorName}
                    </ContentAuthor>
                  </ContentFirstRow>
                  <Stars stars={userRecipe.difficulty} size={48} spacing={2} fill="#EB811F" />
                </StyledLink>
              </ContentDiv>
            ))
            : <DefaultText>尚未建立任何食譜</DefaultText>}
        </ContentWrapper>
        {userRecipeIndex <= userRecipes.length - 4
          ? <NextArrowImage src={rightImage} alt="rightImage" onClick={showUserNextRecipe} />
          : <NextArrowDiv />}
      </Section>
      <SectionWithBackground>
        <SectionTitle>最愛食譜</SectionTitle>
        {favoriteRecipeIndex >= 1
          ? <PrevArrowImage src={leftImage} alt="leftImage" onClick={showFavoritePrevRecipe} />
          : <PrevArrowDiv />}
        <ContentWrapper>
          {userRecipes.length !== 0 ? favoriteRecipes
            .slice(favoriteRecipeIndex, favoriteRecipeIndex + 3)
            .map((favoriteRecipe) => (
              <ContentDiv key={favoriteRecipe.recipeId}>
                <StyledLink to={`/read_recipe?id=${favoriteRecipe.recipeId}`}>
                  <Img src={favoriteRecipe.mainImage} alt="食譜封面照" />
                  <ContentFirstRow>
                    <ContentTitle>{favoriteRecipe.title}</ContentTitle>
                    <ContentAuthor>
                      by
                      {' '}
                      {favoriteRecipe.authorName}
                    </ContentAuthor>
                  </ContentFirstRow>
                  <Stars stars={favoriteRecipe.difficulty} size={48} spacing={2} fill="#EB811F" />
                </StyledLink>
              </ContentDiv>
            )) : <DefaultText>尚未收藏任何食譜</DefaultText>}
        </ContentWrapper>
        {favoriteRecipeIndex <= favoriteRecipes.length - 4
          ? <NextArrowImage src={rightImage} alt="rightImage" onClick={showFavoriteNextRecipe} />
          : <NextArrowDiv />}
      </SectionWithBackground>
      <Footer />
    </>
  );
}

export default AuthHome;
