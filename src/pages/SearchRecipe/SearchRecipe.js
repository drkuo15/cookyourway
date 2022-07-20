import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { Search } from '@styled-icons/material-rounded';
import { db } from '../../firestore';
import { devices } from '../../utils/StyleUtils';
import Stars from '../../components/DisplayStars';
import Header from '../../components/Header';
import Loading from '../../components/Loading';

const SearchInput = styled.input`
  width: calc(1282*100vw/1920);
  height: calc(64*100vw/1920);
  font-size: calc(28*100vw/1920);
  text-align: center;
  border: 0;
  outline :0;
  border-bottom: calc(2.5*100vw/1920) solid #B3B3AC;
  padding: calc(2*100vw/1920) calc(8*100vw/1920);
  &:focus {
    border-color: #EB811F;
  }
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration { display: none; }
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(70*100vw/1920);
    height: calc(128*100vw/1920);
  }
`;

const SearchImg = styled.div`
  width: calc(58*100vw/1920);
  height: calc(58*100vw/1920);
  position: absolute;
  right: calc(330*100vw/1920);
  cursor: pointer;
  &:hover {
    color:  #EB811F;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
  width: calc(116*100vw/1920);
  height: calc(116*100vw/1920);
  bottom: 0;
  }
`;

const SearchDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: calc(48*100vw/1920);
  margin-bottom: calc(68*100vw/1920);
  position: relative;
  @media ${devices.Tablet} and (orientation:portrait) {
  margin-top: calc(96*100vw/1920);
  margin-bottom: calc(136*100vw/1920);
  }
`;

const Title = styled.div`
  font-size: calc(40*100vw/1920);
  padding: calc(40*100vw/1920) 0 calc(45*100vw/1920) calc(158*100vw/1920);
  font-weight: 400;
  @media ${devices.Tablet} and (orientation:portrait) {
  font-size: calc(100*100vw/1920);
  padding-bottom: calc(100*100vw/1920);
  }
`;

const Mark = styled.mark`
  display: inline-block;
  line-height: 0;
  padding-bottom: 0.5em;
  background-color: #fec74099;
`;

const ResultsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ResultDiv = styled.div`
  width: calc(1604*100vw/1920);
  height: calc(350*100vw/1920);
  background-color: #E5D2C0;
  border-radius: calc(15*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(525*100vw/1920);
    margin-bottom: calc(100*100vw/1920);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ImgDiv = styled.div`
  width: calc(500*100vw/1920);
  height: calc(350*100vw/1920);
  overflow: hidden;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(750*100vw/1920);
    height: calc(525*100vw/1920);
  }
`;

const Img = styled.img`
  width: calc(500*100vw/1920);
  height: calc(350*100vw/1920);
  object-fit: cover;
  border-radius: calc(15*100vw/1920);
  transform: scale(1,1);
  transition: 1s;
  &:hover {
    transform: scale(1.1,1.1);
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(750*100vw/1920);
    height: calc(525*100vw/1920);
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
    width: calc(750*100vw/1920);
    height: calc(525*100vw/1920);
  }
`;

const ResultContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: calc(1000*100vw/1920);
  height: calc(300*100vw/1920);
  margin-right: calc(60*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    margin-left: calc(60*100vw/1920);
    margin-right: 0;
    height: calc(525*100vw/1920);
    justify-content: flex-start;
    padding-top: calc(30*100vw/1920);
  }
`;

const ResultContentTop = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: calc(48*100vw/1920);
  align-items: end;
  @media ${devices.Tablet} and (orientation:portrait) {
    align-items: flex-start;
    flex-direction: column;
    font-size: calc(80*100vw/1920);
  }
`;

const TitleAuthorDiv = styled.div`
  display: flex;
  align-items: baseline;
  @media ${devices.Tablet} and (orientation:portrait) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const ContentTitle = styled.div`
  font-size: calc(48*100vw/1920);
  font-weight: 600;
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(80*100vw/1920);
  }
`;

const AuthorDiv = styled.div`
  margin-left: calc(50*100vw/1920);
  font-size: calc(28*100vw/1920);
  font-weight: none;
  @media ${devices.Tablet} and (orientation:portrait) {
    margin-left: 0;
    font-size: calc(50*100vw/1920);
    margin-top: calc(20*100vw/1920);
    margin-bottom: calc(20*100vw/1920);
  }
`;

const ResultContentBottom = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: calc(36*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    flex-direction: column;
    font-size: calc(50*100vw/1920);
  }
`;

const IngredientsDiv = styled.div`
  display: flex;
  justify-content: start;
  gap: calc(20*100vw/1920);
  ${'' /* text-overflow: ellipsis; */}
  overflow-x: auto;
  white-space: nowrap;
  width: calc(700*100vw/1920);
  ${'' /* height: calc(60*100vw/1920); */}
  height: 100%;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(800*100vw/1920);
    height: calc(80*100vw/1920);
    margin-top: calc(20*100vw/1920);
    margin-bottom: calc(20*100vw/1920);
  }
`;

const DefaultText = styled.div`
  width: calc(1604*100vw/1920);
  height: calc(410*100vw/1920);
  font-size: calc(40*100vw/1920);
  margin-bottom: calc(50*100vw/1920);
  text-align: center;
  @media ${devices.Tablet} and (orientation:portrait) {
  font-size: calc(100*100vw/1920);
  }
`;

const StarRow = styled.div`
  font-size: calc(20*100vw/1920);
  color: #808080;
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(36*100vw/1920);
  }
`;

function SearchRecipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchName, setSearchName] = useState(decodeURI(location.search.split('=')[1]));
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

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
        setLoading(false);
      });
    } else {
      setSearchResult([]);
      setLoading(false);
    }
  }, [searchName]);

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
      <SearchDiv>
        <SearchInput
          type="search"
          placeholder="請輸入料理名稱"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              navigate({ pathname: '/search_recipe', search: `?q=${e.target.value}` });
            }
          }}
          onChange={(e) => { setSearchName(e.target.value); }}
        />
        <SearchImg>
          <Search onClick={() => {
            navigate({ pathname: '/search_recipe', search: `?q=${searchName}` });
          }}
          />
        </SearchImg>
      </SearchDiv>
      <Title>
        <Mark>搜尋結果</Mark>
      </Title>
      <ResultsWrapper>
        {searchResult.length !== 0 ? searchResult.map((recipe) => (
          <ResultDiv key={recipe.recipeId}>
            <StyledLink to={`/read_recipe?id=${recipe.recipeId}`}>
              <ImgDiv>
                {/* <Img src={recipe.mainImage} alt="食譜封面照" /> */}
                {imgLoaded ? (
                  <Img
                    src={recipe.mainImage}
                    alt="食譜封面照"
                  />
                ) : (
                  <>
                    <Img
                      style={imgLoaded ? {} : { display: 'none' }}
                      src={recipe.mainImage}
                      alt="食譜封面照"
                      onLoad={() => { setImgLoaded(true); }}
                    />
                    <ImgDefaultDiv />
                  </>
                )}
              </ImgDiv>

              <ResultContent>
                <ResultContentTop>
                  <TitleAuthorDiv>
                    <ContentTitle>{recipe.title}</ContentTitle>
                    <AuthorDiv>
                      by
                      {' '}
                      {recipe.authorName}
                    </AuthorDiv>
                  </TitleAuthorDiv>
                  <StarRow>
                    <Stars stars={recipe.difficulty} size={40} spacing={2} fill="#BE0028" />
                    (難度)
                  </StarRow>
                </ResultContentTop>
                <ResultContentBottom>
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
                </ResultContentBottom>
              </ResultContent>
            </StyledLink>
          </ResultDiv>
        )) : <DefaultText>查無相關料理</DefaultText>}
      </ResultsWrapper>
    </>
  );
}

export default SearchRecipe;
