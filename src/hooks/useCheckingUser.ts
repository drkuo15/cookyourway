import {
  useState, useEffect, useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../components/AuthContext';
import { handleAuthStateChange } from '../firestore';

export default function useCheckingUser() {
  const userInfo = useContext(AuthContext);
  const userId = userInfo?.uid || '';
  const userName = userInfo?.name || '';
  const userFavorites = userInfo?.myFavorites || [];
  const [checkingUser, setCheckingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    handleAuthStateChange({ setCheckingUser, navigate });
  }, [navigate]);

  return {
    userName, userId, userFavorites, checkingUser,
  };
}
