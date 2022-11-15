import {
  Routes, Route, BrowserRouter as Router,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import styled, { createGlobalStyle } from 'styled-components';
import Cooking from './pages/Cooking';
import ModifyRecipe from './pages/ModifyRecipe';
import ReadRecipe from './pages/ReadRecipe';
import SearchRecipe from './pages/SearchRecipe';
import AuthHome from './pages/AuthHome';
import Register from './pages/Register';
import UnAuthHome from './pages/UnAuthHome';
import Login from './pages/LogIn';
import { auth, db } from './firestore/index';
import AuthContext from './components/AuthContext';
import NoMatch from './pages/NoMatch';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

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
  const [userInfo, setUserInfo] = useState('');
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid } = user;
        const userRef = doc(db, 'users', uid);
        const getUserData = async () => {
          const docSnap = await getDoc(userRef);
          return docSnap.data();
        };
        getUserData().then((data) => {
          setUserInfo(data);
        });
      } else {
        setUserInfo(user);
      }
    });
  }, []);

  const onChangeMyFavorites = (newMyFavorites) => {
    setUserInfo({ ...userInfo, myFavorites: newMyFavorites });
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
