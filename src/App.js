import './App.css';
import {
  Routes, Route, BrowserRouter as Router,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Cooking from './pages/Cooking';
import ModifyRecipe from './pages/ModifyRecipe/ModifyRecipe';
import ReadRecipe from './pages/ReadRecipe/readRecipe';
import SearchRecipe from './pages/SearchRecipe/SearchRecipe';
import Home from './pages/Home/home';
import Register from './pages/Register/Register';
import Login from './pages/LogIn/LogIn';
import { auth, db } from './firestore/index';
import AuthContext from './components/AuthContext';

function App() {
  const [userInfo, setUserInfo] = useState('');
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
        getUserData().then((data) => setUserInfo(data));
      } else {
        // 清除使用者資料
        setUserInfo(user);
      }
    });
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={userInfo}>
        <Router>
          <Routes>
            <Route path="/cooking" element={<Cooking />} />
            <Route path="/modify_recipe" element={<ModifyRecipe />} />
            <Route path="/read_recipe" element={<ReadRecipe />} />
            <Route path="/search_recipe" element={<SearchRecipe />} />
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
