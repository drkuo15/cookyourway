import {
  Routes, Route, BrowserRouter as Router,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { changeUserDataOnAuthState } from './firestore';
import Cooking from './pages/Cooking';
import ModifyRecipe from './pages/ModifyRecipe';
import ReadRecipe from './pages/ReadRecipe';
import SearchRecipe from './pages/SearchRecipe';
import AuthHome from './pages/AuthHome';
import Register from './pages/Register';
import UnAuthHome from './pages/UnAuthHome';
import Login from './pages/LogIn';
import AuthContext from './components/AuthContext';
import NoMatch from './pages/NoMatch';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { User } from './types/User';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
  }
`;

const BodyDiv = styled.div`
  min-height: calc(100vh - 7.5vh);
`;

function App() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  useEffect(() => {
    changeUserDataOnAuthState(setUserInfo);
  }, []);

  const onChangeMyFavorites = (newMyFavorites: User['myFavorites']) => {
    setUserInfo({ ...userInfo!, myFavorites: newMyFavorites });
  };

  return (
    <>
      <BodyDiv>
        <AuthContext.Provider value={userInfo}>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/cooking" element={<Cooking />} />
              <Route path="/modify_recipe" element={<ModifyRecipe />} />
              <Route path="/read_recipe" element={<ReadRecipe onChangeMyFavorites={onChangeMyFavorites} />} />
              <Route path="/search_recipe" element={<SearchRecipe />} />
              <Route path="/home" element={<AuthHome />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<UnAuthHome />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </Router>
          <GlobalStyle />
        </AuthContext.Provider>
      </BodyDiv>
      <Footer />
    </>
  );
}

export default App;
