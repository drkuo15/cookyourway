import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { signOut } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import {
  Search, FavoriteBorder, Favorite, ContentCopy, Edit,
} from '@styled-icons/material-rounded';
// import PropTypes from 'prop-types';
import logoImage from '../images/CookYourWay_logo_v1.png';
import { auth } from '../firestore';
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

const ImgLink = styled(Link)`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
  display: flex;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(180*100vw/1920);
    height: calc(180*100vw/1920);
  }
`;

const TitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Img = styled.img`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
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

const CreateButton = styled.button`
  width: calc(200*100vw/1920);
  height: calc(64*100vw/1920);
  background-color: #EB811F;
  cursor: pointer;
  border: 0;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  color:#FDFDFC;
  &:hover{
  background-color:#fa8921;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(300*100vw/1920);
    height: calc(150*100vw/1920);
    font-size: calc(70*100vw/1920);
  }
`;

const ButtonLink = styled(Link)`
  width: calc(200*100vw/1920);
  height: calc(64*100vw/1920);
  display: flex;
  text-decoration: none;
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(300*100vw/1920);
    height: calc(150*100vw/1920);
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

interface MemberProps {
  active: boolean;
}

const MemberPhoto = styled.img`
  width: calc(64*100vw/1920);
  height: calc(64*100vw/1920);
  cursor: pointer;
  border-radius: 50%;
  display: ${({ active }: MemberProps) => (active ? 'flex' : 'none')};
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
  display: ${({ active }: MemberProps) => (active ? 'flex' : 'none')};
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

const SearchWrap = styled.div`
  display: inline-block;
  position: relative;
  height: calc(116*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(320*100vw/1920);
  }
`;

const SearchInputImg = styled.div`
  height: calc(62*100vw/1920);
  width: calc(62*100vw/1920);
  display: inline-block;
  border: none;
  position: absolute;
  top: calc(30*100vw/1920);
  right: 0;
  z-index: 2;
  cursor: pointer;
  transition: opacity 0.4s ease;
  opacity: 0.4;
  &:hover {
  opacity: 0.8;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    top: calc(90*100vw/1920);
    height: calc(150*100vw/1920);
    width: calc(150*100vw/1920);
  }
`;

interface SearchInputProps {
  show: boolean;
}

const SearchInput = styled.input`
  height: calc(80*100vw/1920);
  display: inline-block;
  border: none;
  outline: none;
  padding-right: calc(80*100vw/1920);
  width: 0;
  position: absolute;
  top: calc(24*100vw/1920);
  right: 0;
  background: none;
  z-index: ${({ show }: SearchInputProps) => (show ? 3 : 1)};
  transition: width 0.4s cubic-bezier(0, 0.795, 0, 1);
  cursor: pointer;
  &:hover ~ ${SearchInputImg}{
    opacity: 0.8;
  }
  &:focus:hover {
  border-bottom: calc(2.55*100vw/1920) solid #343638;
  }
  &:focus {
  font-size: calc(36*100vw/1920);
  color: #343638;
  width: calc(800*100vw/1920);
  z-index: 1;
  border-bottom: calc(2.55*100vw/1920) solid #34363850;
  cursor: text;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const DropBtn = styled.button`
  width: calc(150*100vw/1920);
  height: calc(64*100vw/1920);
  background-color: transparent;
  cursor: pointer;
  border-radius: calc(15*100vw/1920);
  font-size: calc(28*100vw/1920);
  font-weight: 500;
  color: #2B2A29;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover { 
    border-bottom: calc(5*100vw/1920) #EB811F solid;
    box-shadow: 0 2px 2px -2px #EB811F ;
    color: #000000;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(200*100vw/1920);
    height: calc(150*100vw/1920);
    font-size: calc(70*100vw/1920);
  }
`;

const ToolTipText = styled.span`
  visibility: hidden;
  width: calc(440*100vw/1920);
  background-color: #26262590;
  font-size: calc(26*100vw/1920);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: calc(20*100vw/1920); 0;
  position: absolute;
  z-index: 1;
  bottom: -230%;
  left: -100%;
  margin-left: calc(-250*100vw/1920);;
  opacity: 0;
  transition: opacity 1s;
`;

interface IconProps {
  colorCode: string;
  selected: string;
}

const Icon = styled.span`
  position: relative;
  cursor: pointer;
  font-size: calc(40*100vw/1920);
  display: flex;
  align-items: end;
  color:  ${({ colorCode }: IconProps) => (colorCode)};
  &:hover {
    color: ${({ selected }: IconProps) => (selected)};
  }
  & > svg{
    width: calc(60*100vw/1920);
    height: calc(60*100vw/1920);
  }
  & > svg:hover {
    color: ${(props) => ((props.selected))};
  }
  &:hover > ${ToolTipText} {
    visibility: visible;
    opacity: 1;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    & > svg{
    width: calc(160*100vw/1920);
    height: calc(160*100vw/1920);
  }
  }
`;

const Button = styled(Link)`
  display: flex;
  text-decoration: none;
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

function SearchRecipe() {
  const [inputShown, setInputShown] = useState(true);
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();
  return (
    <SearchWrap>
      <SearchInput
        show={inputShown}
        name="search"
        type="search"
        placeholder="來找些料理吧！"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            navigate({ pathname: '/search_recipe', search: `?q=${e.currentTarget.value}` });
          }
        }}
        onChange={(e) => { setSearchName(e.currentTarget.value); }}
        onBlur={() => {
          setInputShown(false);
        }}
      />
      <SearchInputImg>
        <Search onClick={() => {
          if (searchName) {
            navigate({ pathname: '/search_recipe', search: `?q=${searchName}` });
          } else {
            setInputShown(true);
          }
        }}
        />
      </SearchInputImg>
    </SearchWrap>
  );
}

function CreateRecipe() {
  return (
    <ButtonLink to="/modify_recipe">
      <CreateButton>寫食譜</CreateButton>
    </ButtonLink>
  );
}

function LogOut() {
  const userInfo = useContext(AuthContext);
  const [userInitial, setUserInitial] = useState('');
  const [showMemberWord, setShowMemberWord] = useState(true);
  const [showMemberPhoto, setShowMemberPhoto] = useState(false);

  useEffect(() => {
    if (userInfo) {
      const userName = userInfo.name.split('');
      const initial = userName.shift();
      setUserInitial(initial!.toUpperCase());
    }
  }, [userInfo]);

  return (
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
  );
}

function LogIn() {
  return (
    <StyledLink to="/login">
      <DropBtn>登入</DropBtn>
    </StyledLink>
  );
}

interface CollectRecipeProps {
  addToFavorites: () => void;
  removeFromFavorites: () => void;
  myFavorites: string[];
  currentRecipeId: string;
}

function CollectRecipe({
  addToFavorites, removeFromFavorites, myFavorites, currentRecipeId,
}: CollectRecipeProps) {
  return (

    myFavorites.includes(currentRecipeId)
      ? (
        <Icon colorCode="#BE0028" selected="#dd1b44" onClick={removeFromFavorites}>
          <Favorite />
          <ToolTipText>
            點擊取消收藏
            <br />
            嗚嗚～我的心碎了一地
          </ToolTipText>
        </Icon>
      )
      : (
        <Icon colorCode="#808080" selected="#b2b0b0" onClick={addToFavorites}>
          <FavoriteBorder />
          <ToolTipText>喜歡我嗎？趕緊加入收藏吧！</ToolTipText>
        </Icon>
      )
  );
}

interface CopyOrModifyRecipeProps {
  userId: string;
  authorId: string;
}

function CopyOrModifyRecipe({ userId, authorId }: CopyOrModifyRecipeProps) {
  const location = useLocation();
  return (
    <Button to={`/modify_recipe?id=${location.search.split('=')[1]}`}>
      {userId === authorId
        ? (
          <Icon colorCode="#808080" selected="#b2b0b0">
            <Edit />
            <ToolTipText>有些新想法嗎？ 來編輯食譜吧！</ToolTipText>
          </Icon>
        )
        : (
          <Icon colorCode="#808080" selected="#b2b0b0">
            <ContentCopy />
            <ToolTipText>
              複製食譜！
              <br />
              將天馬行空的點子寫進食譜吧！
            </ToolTipText>
          </Icon>
        )}
    </Button>
  );
}

interface HeaderProps {
  authorId?: string;
  userId?: string;
  addToFavorites?: () => void;
  removeFromFavorites?: () => void;
  myFavorites?: string[];
  currentRecipeId?: string;
}

function Header({
  authorId = '',
  userId = '',
  addToFavorites = () => { },
  removeFromFavorites = () => { },
  myFavorites = [],
  currentRecipeId = '',
}: HeaderProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  const isHomeOrSearchPage = location.pathname === '/home' || location.pathname === '/search_recipe';
  const isLandingPage = location.pathname === '/';
  const isReadRecipePage = location.pathname === '/read_recipe';

  return (
    <>
      <Background>
        <LeftDiv>
          <ImgLink to="/home">
            <Img src={logoImage} alt="logoImage" />
          </ImgLink>
          <TitleLink to="/home">
            <Title>Cook Your Way</Title>
          </TitleLink>
        </LeftDiv>
        <RightDiv>
          {isHomePage ? <SearchRecipe /> : ''}
          {isHomeOrSearchPage ? <CreateRecipe /> : ''}
          {isReadRecipePage
            ? (
              <CollectRecipe
                addToFavorites={addToFavorites}
                myFavorites={myFavorites}
                removeFromFavorites={removeFromFavorites}
                currentRecipeId={currentRecipeId}
              />
            )
            : ''}
          {isReadRecipePage
            ? (
              <CopyOrModifyRecipe
                authorId={authorId}
                userId={userId}
              />
            )
            : ''}
          {isLandingPage ? <LogIn /> : <LogOut />}
        </RightDiv>
      </Background>
      <Padding />
    </>
  );
}

// Header.defaultProps = defaultHeaderProps;

// Header.propTypes = {
//   authorId: PropTypes.string,
//   userId: PropTypes.string,
//   addToFavorites: PropTypes.func,
//   removeFromFavorites: PropTypes.func,
//   myFavorites: PropTypes.arrayOf(PropTypes.string),
//   currentRecipeId: PropTypes.string,
// };

// Header.defaultProps = {
//   authorId: '',
//   userId: '',
//   addToFavorites: () => { },
//   removeFromFavorites: () => { },
//   myFavorites: [],
//   currentRecipeId: '',
// };

// CollectRecipe.propTypes = {
//   addToFavorites: PropTypes.func.isRequired,
//   removeFromFavorites: PropTypes.func.isRequired,
//   myFavorites: PropTypes.arrayOf(PropTypes.string).isRequired,
//   currentRecipeId: PropTypes.string.isRequired,
// };

// CopyOrModifyRecipe.propTypes = {
//   authorId: PropTypes.string.isRequired,
//   userId: PropTypes.string.isRequired,
// };

export default Header;
