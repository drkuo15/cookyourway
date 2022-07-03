import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import logoImage from '../images/CookYourWay_logo_v1.png';
import { auth } from '../firestore/index';
import AuthContext from './AuthContext';

const Background = styled.div`
  width: 100vw;
  height: calc(116*100vw/1920);
  background-color: #E5D2C080;
  display: flex;
  align-item: center;
  justify-content: space-between;
  padding: calc(26*100vw/1920);
  position: fixed;
  top: 0;
  z-index: 100;
`;

const LeftDiv = styled.div`
  gap: calc(26*100vw/1920);
  display: flex;
  align-items: center;
`;

const RightDiv = styled(LeftDiv)`
  gap: calc(20*100vw/1920);
`;

const ImgLink = styled(Link)`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
`;

const Img = styled.img`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
`;

const Title = styled.div`
  width: calc(450*100vw/1920);
  height: calc(64*100vw/1920);
  color: #EB811F;
  font-size: calc(48*100vw/1920);
`;

const CreateButton = styled.button`
  width: calc(286*100vw/1920);
  height: calc(64*100vw/1920);
  background-color: #EB811F;
  cursor: pointer;
  border: 0;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  color: #2B2A29;
`;

const SignOutButton = styled.button`
  width: calc(200*100vw/1920);
  height: calc(64*100vw/1920);
  background-color: #FDFDFC;
  cursor: pointer;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  color: #2B2A29;
  border: 0;
`;

const DropBtn = styled.button`
  width: calc(200*100vw/1920);
  height: calc(64*100vw/1920);
  background-color: #FDFDFC;
  cursor: pointer;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  color: #2B2A29;
  border: calc(3*100vw/1920)  #2B2A29 solid;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DropdownContentDiv = styled.div`
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: calc(160*100vw/1920);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const DropdownDiv = styled.div`
  position: relative;
  display: inline - block;
  &:hover ${DropBtn} {background-color: #584743; color: #FDFDFC;};
  &:hover ${DropdownContentDiv} {display: block;};
`;

const Padding = styled.div`
  height: calc(116*100vw/1920);
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
    <SignOutButton type="button" onClick={() => handleSignOut()}>登出</SignOutButton>

  );
}

function HomeHeader() {
  const userInfo = useContext(AuthContext);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.name);
    } else {
      setUserName('');
    }
  }, [userInfo]);

  return (
    <>
      <Background>
        <LeftDiv>
          <ImgLink to="/home">
            <Img src={logoImage} alt="logoImage" />
          </ImgLink>
          <Title>Cook Your Way</Title>
        </LeftDiv>
        <RightDiv>
          <Link to="/modify_recipe">
            <CreateButton>創建食譜</CreateButton>
          </Link>
          <DropdownDiv>
            <DropBtn>{userName}</DropBtn>
            <DropdownContentDiv>
              <SignOut />
            </DropdownContentDiv>
          </DropdownDiv>
        </RightDiv>
      </Background>
      <Padding />
    </>
  );
}

export default HomeHeader;
