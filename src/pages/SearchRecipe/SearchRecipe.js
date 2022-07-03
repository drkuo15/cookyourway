import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../firestore';
import Stars from '../../components/DisplayStars';
import HomeHeader from '../../components/HomeHeader';
// import Footer from '../../components/Footer';

const Img = styled.img`
width: 100px;
height: 100px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

function SearchRecipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchName, setSearchName] = useState(decodeURI(location.search.split('=')[1]));
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    if (searchName) {
      const searchNameArray = searchName.split('');
      const recipeRef = collection(db, 'recipes');
      const q = query(recipeRef, where('titleKeywords', 'array-contains', searchNameArray[0]));
      let queryDataArray = [];
      getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(
            (doc) => {
              if (doc.data().title.includes(searchName)) {
                queryDataArray = [...queryDataArray, doc.data()];
              }
            },
          );
        }
        setSearchResult(queryDataArray);
      });
    } else {
      setSearchResult([]);
    }
  }, [searchName]);
  return (
    <>
      <HomeHeader />
      <input
        type="search"
        placeholder="請輸入食譜名稱"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            setSearchName(e.target.value);
            navigate({ pathname: '/search_recipe', search: `?q=${e.target.value}` });
          }
        }}
      />
      <div>
        {searchResult.length !== 0 ? searchResult.map((recipe) => (
          <div key={recipe.recipeId}>
            <StyledLink to={`/read_recipe?id=${recipe.recipeId}`}>
              <Img src={recipe.mainImage} alt="食譜封面照" />
              {recipe.title}
              by
              {recipe.authorName}
              <Stars stars={recipe.difficulty} size={20} spacing={2} fill="#EB811F" />
              {recipe.ingredients.map((ingredient) => (
                <div key={ingredient.id}>
                  {ingredient.ingredientsTitle}
                </div>
              ))}
              {Math.floor(recipe.fullTime / 60)}
              分
              {recipe.fullTime % 60}
              秒
            </StyledLink>
          </div>
        )) : ''}
        {location.search.split('=')[1] && searchResult.length === 0 ? '查無相關結果' : ''}
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default SearchRecipe;
