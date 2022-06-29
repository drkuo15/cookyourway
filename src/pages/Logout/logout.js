import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firestore';

function SignOut() {
  const navigate = useNavigate();

  signOut(auth).then(() => {
    navigate('/login', { replace: true });
  });
  return (
    <button type="button">登出</button>
  );
}

export default SignOut;
