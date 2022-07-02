import { useState, useEffect, useContext } from 'react';
import {
  collection, query, where, getDocs, onSnapshot, doc,
} from 'firebase/firestore';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../firestore';
import Stars from '../../components/DisplayStars';
import AuthContext from '../../components/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Img = styled.img`
  width: 100px;
  height: 100px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const SearchInput = styled.input`
  width: calc(1282/1920 * 100vw);
  height: 64px;
  border: 1px #2B2A29 solid;
  border-radius: 15px;
  font-size: 28px;
`;

const SearchDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 48px;
  margin-bottom: 68px;
`;

function Home() {
  const userInfo = useContext(AuthContext);
  const [userId, setUserId] = useState('');
  const [userRecipes, setUserRecipes] = useState([]);
  const [userRecipeIndex, setUserRecipeIndex] = useState(0);
  const [averageDifficulty, setAverageDifficulty] = useState(3);
  const [recommendRecipes, setRecommendRecipes] = useState([]);
  const [myFavorites, setMyFavorites] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
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
          setMyFavorites(userdata.myFavorites);
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

  const showNextRecipe = () => {
    setUserRecipeIndex((prev) => prev + 1);
  };

  const showPrevRecipe = () => {
    setUserRecipeIndex((prev) => prev - 1);
  };
  return (
    <>
      <Header />
      <SearchDiv>
        <SearchInput
          type="search"
          placeholder="請輸入食譜名稱"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              navigate({ pathname: '/search_recipe', search: `?q=${e.target.value}` });
            }
          }}
        />
      </SearchDiv>
      <div>推薦食譜</div>
      {recommendRecipes.map((recommendRecipe) => (
        <div key={recommendRecipe.recipeId}>
          <StyledLink to={`/read_recipe?id=${recommendRecipe.recipeId}`}>
            <Img src={recommendRecipe.mainImage} alt="食譜封面照" />
            {recommendRecipe.title}
            by
            {recommendRecipe.authorName}
            <Stars stars={recommendRecipe.difficulty} size={20} spacing={2} fill="#EB811F" />
            {recommendRecipe.ingredients.map((ingredient) => (
              <div key={ingredient.id}>
                {ingredient.ingredientsTitle}
              </div>
            ))}
            {Math.floor(recommendRecipe.fullTime / 60)}
            分
            {recommendRecipe.fullTime % 60}
            秒
          </StyledLink>
        </div>
      ))}
      <div>我的食譜</div>
      {userRecipeIndex >= 1
        ? <button type="button" onClick={showPrevRecipe}>上一張</button> : ''}
      {userRecipes.slice(userRecipeIndex, userRecipeIndex + 3).map((userRecipe) => (
        <div key={userRecipe.recipeId}>
          <StyledLink to={`/read_recipe?id=${userRecipe.recipeId}`}>
            <Img src={userRecipe.mainImage} alt="食譜封面照" />
            {userRecipe.title}
            by
            {userRecipe.authorName}
            <Stars stars={userRecipe.difficulty} size={20} spacing={2} fill="#EB811F" />
            {userRecipe.ingredients.map((ingredient) => (
              <div key={ingredient.id}>
                {ingredient.ingredientsTitle}
              </div>
            ))}
            {Math.floor(userRecipe.fullTime / 60)}
            分
            {userRecipe.fullTime % 60}
            秒
          </StyledLink>
        </div>
      ))}
      {userRecipeIndex <= userRecipes.length - 4
        ? <button type="button" onClick={showNextRecipe}>下一張</button> : ''}
      <div>最愛食譜</div>
      {favoriteRecipes.map((favoriteRecipe) => (
        <div key={favoriteRecipe.recipeId}>
          <StyledLink to={`/read_recipe?id=${favoriteRecipe.recipeId}`}>
            <Img src={favoriteRecipe.mainImage} alt="食譜封面照" />
            {favoriteRecipe.title}
            by
            {favoriteRecipe.authorName}
            <Stars stars={favoriteRecipe.difficulty} size={20} spacing={2} fill="#EB811F" />
            {favoriteRecipe.ingredients.map((ingredient) => (
              <div key={ingredient.id}>
                {ingredient.ingredientsTitle}
              </div>
            ))}
            {Math.floor(favoriteRecipe.fullTime / 60)}
            分
            {favoriteRecipe.fullTime % 60}
            秒
          </StyledLink>
        </div>
      ))}
      <Footer />
    </>
  );
}

export default Home;
