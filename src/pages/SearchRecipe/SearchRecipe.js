import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../firestore';
import Stars from '../../components/DisplayStars';
import HomeHeader from '../../components/HomeHeader';
import Footer from '../../components/Footer';
import searchImage from '../../images/search_FILL0_wght400_GRAD0_opsz48.svg';

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

const Title = styled.div`
  font-size: calc(76*100vw/1920);
  padding: calc(40*100vw/1920) 0 calc(45*100vw/1920) calc(158*100vw/1920);
`;

const ResultsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ResultDiv = styled.div`
  width: calc(1604*100vw/1920);
  height: calc(410*100vw/1920);
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Img = styled.img`
  width: calc(492*100vw/1920);
  height: calc(369*100vw/1920);
  object-fit: cover;
  border-radius: calc(15*100vw/1920);
  margin: calc(21*100vw/1920);
`;

const ResultContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: calc(1000*100vw/1920);
  height: calc(300*100vw/1920);
  margin-right: calc(50*100vw/1920);
`;

const ResultContentTop = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: calc(48*100vw/1920);
`;

const TitleAuthorDiv = styled.div`
  width: calc(500*100vw/1920);
  display: flex;
  align-items: baseline;
`;

const AuthorDiv = styled.div`
  margin-left: calc(50*100vw/1920);
  font-size: calc(28*100vw/1920);
`;

const ResultContentButton = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: calc(36*100vw/1920);
`;

const IngredientsDiv = styled.div`
  display: flex;
  justify-content: start;
  gap: calc(20*100vw/1920);
`;

const DefaultText = styled.div`
    width: calc(1604*100vw/1920);
    height: calc(410*100vw/1920);
    font-size: calc(48*100vw/1920);
    margin-bottom: calc(50*100vw/1920);
    text-align: center;
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
      <Title>搜尋結果</Title>
      <ResultsWrapper>
        {searchResult.length !== 0 ? searchResult.map((recipe) => (
          <ResultDiv key={recipe.recipeId}>
            <StyledLink to={`/read_recipe?id=${recipe.recipeId}`}>
              <Img src={recipe.mainImage} alt="食譜封面照" />
              <ResultContent>
                <ResultContentTop>
                  <TitleAuthorDiv>
                    {recipe.title}
                    <AuthorDiv>
                      by
                      {recipe.authorName}
                    </AuthorDiv>
                  </TitleAuthorDiv>
                  <Stars stars={recipe.difficulty} size={48} spacing={2} fill="#EB811F" />
                </ResultContentTop>
                <ResultContentButton>
                  <IngredientsDiv>
                    {recipe.ingredients.map((ingredient) => (
                      <div key={ingredient.id}>
                        {ingredient.ingredientsTitle}
                      </div>
                    ))}
                  </IngredientsDiv>
                  {Math.floor(recipe.fullTime / 60)}
                  分
                  {recipe.fullTime % 60}
                  秒
                </ResultContentButton>
              </ResultContent>
            </StyledLink>
          </ResultDiv>
        )) : <DefaultText>查無相關結果</DefaultText>}
        {/* {location.search.split('=')[1] && searchResult.length === 0 ? '查無相關結果' : ''} */}
      </ResultsWrapper>
      <Footer />
    </>
  );
}

export default SearchRecipe;
