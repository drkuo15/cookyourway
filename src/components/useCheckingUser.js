import {
  useState, useEffect, useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

export default function useCheckingUser() {
  const userInfo = useContext(AuthContext);
  const userId = userInfo?.uid || '';
  const [checkingUser, setCheckingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo === '') {
      setCheckingUser(true);
    }
    if (userInfo === null) {
      navigate({ pathname: '/' });
    }
    if (userId) {
      setCheckingUser(false);
    }
  }, [navigate, userId, userInfo]);

  return { userInfo, userId, checkingUser };
}
