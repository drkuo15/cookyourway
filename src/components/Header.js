import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../images/CookYourWay_logo_v1.png';

const Img = styled.img`
width: 50px;
height: 50px;
`;

function Header() {
  return (
    <>
      <Link to="/">
        <Img src={logoImage} alt="logoImage" />
      </Link>
      <Link to="/modify_recipe">
        <button type="button">創建食譜</button>
      </Link>
    </>

  );
}

export default Header;
