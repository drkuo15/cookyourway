import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import logoImage from '../images/CookYourWay_logo_v1.png';
import { auth } from '../firestore/index';
import AuthContext from './AuthContext';
import likeImage from '../images/like.png';
import dislikeImage from '../images/dislike.png';

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

const ModifyRecipeButton = styled.button`
  width: calc(286*100vw/1920);
  height: calc(64*100vw/1920);
  background-color: #EB811F;
  cursor: pointer;
  border: 0;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  color: #FDFDFC;
`;

const LikeButton = styled.button`
  height: calc(64*100vw/1920);
  background-color: transparent;
  cursor: pointer;
  border: 0;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  color: #2B2A29;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(10*100vw/1920)
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

function ReadRecipeHeader({
  authorId, userId, addToFavorites, removeFromFavorites, myFavorites, currentRecipeId,
}) {
  const userInfo = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const location = useLocation();

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
          {myFavorites.includes(currentRecipeId)
            ? (
              <LikeButton type="button" onClick={removeFromFavorites}>
                <Img src={likeImage} alt="likeImage" />
                珍藏中...
              </LikeButton>
            )

            : (
              <LikeButton type="button" onClick={addToFavorites}>
                <Img src={dislikeImage} alt="dislikeImage" />
                加入珍藏
              </LikeButton>
            )}
          <Link to={`/modify_recipe?id=${location.search.split('=')[1]}`}>
            <ModifyRecipeButton type="button">
              {userId === authorId ? '編輯食譜' : '複製食譜'}
            </ModifyRecipeButton>
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

ReadRecipeHeader.propTypes = {
  authorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  addToFavorites: PropTypes.func.isRequired,
  removeFromFavorites: PropTypes.func.isRequired,
  myFavorites: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentRecipeId: PropTypes.string.isRequired,
};
export default ReadRecipeHeader;
