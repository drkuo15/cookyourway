import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import logoImage from '../images/CookYourWay_logo_v1.png';
import { auth } from '../firestore/index';

const Img = styled.img`
width: 50px;
height: 50px;
`;

function SignOut() {
  const navigate = useNavigate();
  function handleSignOut() {
    signOut(auth).then(() => {
      navigate('/login', { replace: true });
      // Sign-out successful.
    });
  }

  return (
    <button type="button" onClick={handleSignOut}>登出</button>
  );
}

function Header() {
  return (
    <>
      <Link to="/">
        <Img src={logoImage} alt="logoImage" />
      </Link>
      <Link to="/modify_recipe">
        <button type="button">創建食譜</button>
      </Link>
      <SignOut />
    </>

  );
}

export default Header;
