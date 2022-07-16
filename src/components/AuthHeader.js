import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logoImage from '../images/CookYourWay_logo_v1.png';
import { auth } from '../firestore/index';
import { devices } from '../utils/StyleUtils';
import AuthContext from './AuthContext';
import chefImage from '../images/chef.png';

const Background = styled.div`
  width: 100%;
  height: calc(116*100vw/1920);
  background-color: #E5D2C0;
  display: flex;
  align-item: center;
  justify-content: space-between;
  padding: calc(26*100vw/1920);
  position: fixed;
  top: 0;
  z-index: 200;
  box-shadow: 0px 0px calc(30*100vw/1920) #fdfdfc;
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(320*100vw/1920);
  }
`;

const LeftDiv = styled.div`
  gap: calc(26*100vw/1920);
  display: flex;
  align-items: center;
  @media ${devices.Tablet} and (orientation:portrait) {
    gap: calc(60*100vw/1920);
  }
`;

const RightDiv = styled(LeftDiv)`
  gap: calc(20*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    gap: calc(50*100vw/1920);
  }
`;

const TitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Img = styled.img`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
  cursor: pointer;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(180*100vw/1920);
    height: calc(180*100vw/1920);
  }
`;

const Title = styled.div`
  width: calc(450*100vw/1920);
  height: calc(64*100vw/1920);
  color: #EB811F;
  font-size: calc(48*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1000*100vw/1920);
    height: calc(200*100vw/1920);
    font-size: calc(120*100vw/1920);
    padding-top: calc(20*100vw/1920);
  }
`;

const SignOutButton = styled.button`
  width: calc(200*100vw/1920);
  height: calc(64*100vw/1920);
  background: transparent;
  cursor: pointer;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  color: #2B2A29;
  border: 0;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(300*100vw/1920);
    height: calc(150*100vw/1920);
    font-size: calc(70*100vw/1920);
  }
`;

const MemberPhoto = styled.img`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
  cursor: pointer;
  border-radius: 50%;
  display: ${(props) => (props.active ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 3px #e0e0e0;
  object-fit: cover;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(160*100vw/1920);
    height: calc(160*100vw/1920);
  }
`;

const MemberWord = styled.div`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
  background-color: #FDFDFC;
  cursor: pointer;
  border-radius: 50%;
  font-size: calc(28*100vw/1920);
  color: #2B2A29;
  border: 0;
  display: ${(props) => (props.active ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 3px #e0e0e0;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(160*100vw/1920);
    height: calc(160*100vw/1920);
    font-size: calc(70*100vw/1920);
  }
`;

const DropdownContentDiv = styled.div`
  display: none;
  position: absolute;
  left: calc(-160*100vw/1920);
  background-color: #fff;
  min-width: calc(160*100vw/1920);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  transition: .5s;
  border-radius: calc(15*100vw/1920);
  &:hover{
    background-color: #f0f0f0;
  }
`;

const DropdownDiv = styled.div`
  position: relative;
  display: inline - block;
  &:hover ${DropdownContentDiv} {display: block;};
`;

const Padding = styled.div`
  height: calc(116*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(320*100vw/1920);
  }
`;

function SignOut({ setIsCounting }) {
  const navigate = useNavigate();

  function handleSignOutAndStopPlaying() {
    signOut(auth).then(() => {
      setIsCounting(false);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
    });
  }

  return (
    <SignOutButton type="button" onClick={() => handleSignOutAndStopPlaying()}>登出</SignOutButton>
  );
}

function AuthHeader({ setIsCounting }) {
  const userInfo = useContext(AuthContext);
  const [userInitial, setUserInitial] = useState('');
  const [showMemberWord, setShowMemberWord] = useState(true);
  const [showMemberPhoto, setShowMemberPhoto] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo) {
      const userName = userInfo.name.split('');
      const initial = userName.shift();
      setUserInitial(initial.toUpperCase());
    }
  }, [userInfo]);

  const NavigateToHomeAndStopPlaying = () => {
    setIsCounting(false);
    setTimeout(() => {
      navigate('/home', { replace: true });
    }, 100);
  };

  return (
    <>
      <Background>
        <LeftDiv>
          <Img src={logoImage} alt="logoImage" onClick={() => NavigateToHomeAndStopPlaying()} />
          <TitleLink to="/home"><Title>Cook Your Way</Title></TitleLink>
        </LeftDiv>
        <RightDiv>
          <DropdownDiv>
            <MemberWord
              active={showMemberWord}
              onMouseLeave={() => { setShowMemberWord(true); setShowMemberPhoto(false); }}
              onMouseEnter={() => { setShowMemberPhoto(true); setShowMemberWord(false); }}
            >
              {userInitial}
            </MemberWord>
            <MemberPhoto
              active={showMemberPhoto}
              onMouseLeave={() => { setShowMemberWord(true); setShowMemberPhoto(false); }}
              onMouseEnter={() => { setShowMemberPhoto(true); setShowMemberWord(false); }}
              src={chefImage}
              alt="memberImage"
            />
            <DropdownContentDiv>
              <SignOut setIsCounting={setIsCounting} />
            </DropdownContentDiv>
          </DropdownDiv>
        </RightDiv>
      </Background>
      <Padding />
    </>
  );
}

AuthHeader.propTypes = {
  setIsCounting: PropTypes.func,
};

AuthHeader.defaultProps = {
  setIsCounting: () => { },
};

SignOut.propTypes = {
  setIsCounting: PropTypes.func,
};

SignOut.defaultProps = {
  setIsCounting: () => { },
};

export default AuthHeader;
