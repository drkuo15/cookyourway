import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FavoriteBorder, Favorite, ContentCopy, Edit,
} from '@styled-icons/material-rounded';
import logoImage from '../images/CookYourWay_logo_v1.png';
import { auth } from '../firestore/index';
import { devices } from '../utils/StyleUtils';
import AuthContext from './AuthContext';
import chefImage from '../images/chef.png';

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
  @media ${devices.Tablet} {
    height: calc(320*100vw/1920);
  }
`;

const LeftDiv = styled.div`
  gap: calc(26*100vw/1920);
  display: flex;
  align-items: center;
  @media ${devices.Tablet} {
    gap: calc(60*100vw/1920);
  }
`;

const RightDiv = styled(LeftDiv)`
  gap: calc(20*100vw/1920);
  @media ${devices.Tablet} {
    gap: calc(50*100vw/1920);
  }
`;

const ImgLink = styled(Link)`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
  display: flex;
  @media ${devices.Tablet} {
    width: calc(180*100vw/1920);
    height: calc(180*100vw/1920);
  }
`;

const Img = styled.img`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
  @media ${devices.Tablet} {
    width: calc(180*100vw/1920);
    height: calc(180*100vw/1920);
  }
`;

const Title = styled.div`
  width: calc(450*100vw/1920);
  height: calc(64*100vw/1920);
  color: #EB811F;
  font-size: calc(48*100vw/1920);
  @media ${devices.Tablet} {
    width: calc(1000*100vw/1920);
    height: calc(200*100vw/1920);
    font-size: calc(120*100vw/1920);
    padding-top: calc(20*100vw/1920);
  }
`;

const ButtonLink = styled(Link)`
  display: flex;
  text-decoration: none;
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
  @media ${devices.Tablet} {
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
  @media ${devices.Tablet} {
    width: calc(180*100vw/1920);
    height: calc(180*100vw/1920);
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
  @media ${devices.Tablet} {
    width: calc(180*100vw/1920);
    height: calc(180*100vw/1920);
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
  @media ${devices.Tablet} {
    height: calc(320*100vw/1920);
  }
`;

const Icon = styled.span`
  cursor: pointer;
  font-size: calc(40*100vw/1920);
  display: flex;
  align-items: end;
  color:  ${(props) => ((props.colorCode))};
  &:hover {
    color: ${(props) => ((props.selected))};
  }
  & > svg{
    width: calc(60*100vw/1920);
    height: calc(60*100vw/1920);
  }
  & > svg:hover {
    color: ${(props) => ((props.selected))};
  }
  @media ${devices.Tablet} {
    & > svg{
    width: calc(160*100vw/1920);
    height: calc(160*100vw/1920);
  }
  }
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

function ReadRecipeHeader({
  authorId, userId, addToFavorites, removeFromFavorites, myFavorites, currentRecipeId,
}) {
  const userInfo = useContext(AuthContext);
  const [userInitial, setUserInitial] = useState('');
  const [showMemberWord, setShowMemberWord] = useState(true);
  const [showMemberPhoto, setShowMemberPhoto] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (userInfo) {
      const userName = userInfo.name.split('');
      const initial = userName.shift();
      setUserInitial(initial.toUpperCase());
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
          {myFavorites.includes(currentRecipeId)
            ? <Icon colorCode="#BE0028" selected="#dd1b44" onClick={removeFromFavorites}><Favorite /></Icon>
            : <Icon colorCode="#808080" selected="#b2b0b0" onClick={addToFavorites}><FavoriteBorder /></Icon>}
          <ButtonLink to={`/modify_recipe?id=${location.search.split('=')[1]}`}>
            {userId === authorId
              ? (
                <Icon colorCode="#808080" selected="#b2b0b0">
                  <Edit />
                </Icon>
              )
              : (
                <Icon colorCode="#808080" selected="#b2b0b0">
                  <ContentCopy />
                </Icon>
              )}
          </ButtonLink>
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
              <SignOut />
            </DropdownContentDiv>
          </DropdownDiv>
        </RightDiv>
      </Background>
      <Padding />
    </>
  );
}

ReadRecipeHeader.propTypes = {
  authorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  addToFavorites: PropTypes.func.isRequired,
  removeFromFavorites: PropTypes.func.isRequired,
  myFavorites: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentRecipeId: PropTypes.string.isRequired,
};
export default ReadRecipeHeader;
