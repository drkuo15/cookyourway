import {
  Routes, Route, BrowserRouter as Router,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createGlobalStyle } from 'styled-components';
import Cooking from './pages/Cooking';
import ModifyRecipe from './pages/ModifyRecipe/ModifyRecipe';
import ReadRecipe from './pages/ReadRecipe/readRecipe';
import SearchRecipe from './pages/SearchRecipe/SearchRecipe';
import AuthHome from './pages/AuthHome/AuthHome';
import Register from './pages/Register/Register';
import UnAuthHome from './pages/UnAuthHome/UnAuthHome';
import Login from './pages/LogIn/LogIn';
import { auth, db } from './firestore/index';
import AuthContext from './components/AuthContext';
import NoMatch from './pages/NoMatch/NoMatch';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
  }
`;

function App() {
  const [userInfo, setUserInfo] = useState('');
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 取得uid，再利用uid取得使用者資料
        const { uid } = user;
        const userRef = doc(db, 'users', uid);
        const getUserData = async () => {
          const docSnap = await getDoc(userRef);
          return docSnap.data();
        };
        getUserData().then((data) => {
          setUserInfo(data);
          // setLoading(false);
        });
      } else {
        // 清除使用者資料
        setUserInfo(user);
      }
    });
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <AuthContext.Provider value={userInfo}>
        <Router>
          <Routes>
            <Route path="/cooking" element={<Cooking />} />
            <Route path="/modify_recipe" element={<ModifyRecipe />} />
            <Route path="/read_recipe" element={<ReadRecipe />} />
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
    </div>
  );
}

export default App;
