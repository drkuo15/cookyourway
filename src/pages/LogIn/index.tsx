import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { loginUser } from '../../firestore';
import CenterTopHeader from '../../components/CenterTopHeader';
import FoodBackground from '../../components/FoodBackground';
import helpImage from '../../images/help.svg';
import { devices } from '../../utils/StyleUtils';
import useManageUserAuth from '../../hooks/useManageUserAuth';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(95*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    flex-direction: column;
  }
`;

const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background-color: #E5D2C0;
  width: calc(804*100vw/1920);
  height: calc(572*100vw/1920);
  border-radius: calc(15*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1650*100vw/1920);
    height: calc(1144*100vw/1920);
  }
`;

const ManualSignIn = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: calc(320*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(800*100vw/1920);
  }
`;

const ManualInput = styled.input`
  width: calc(560*100vw/1920);
  height: calc(72*100vw/1920);
  text-align: center;
  border-radius: calc(15*100vw/1920);
  color: #2B2A29;
  background-color: #FDFDFC;
  font-size: calc(28*100vw/1920);
  outline :0;
  border: calc(2.5*100vw/1920) solid #B3B3AC;
  padding: calc(2*100vw/1920) calc(8*100vw/1920);
  &:focus {
    border-color: #EB811F;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(1120*100vw/1920);
    height: calc(144*100vw/1920);
    font-size: calc(70*100vw/1920);
  }
`;

const LoginButton = styled.button`
  text-align: center;
  vertical-align: middle;
  font-size: calc(28*100vw/1920);
  color: #F7EFE7;
  background-color: #EB811F;
  width: calc(332*100vw/1920);
  height: calc(72*100vw/1920);
  line-height: calc(72*100vw/1920);
  border-radius: calc(15*100vw/1920);
  border-width: 0;
  cursor: pointer;
  z-index: 10;
  &:hover{
  background-color:#fa8921;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(664*100vw/1920);
    height: calc(144*100vw/1920);
    line-height: calc(144*100vw/1920);
    font-size: calc(70*100vw/1920);
  }
`;

const VerticalLine = styled.div`
  width: calc(5*100vw/1920);
  height: calc(644*100vw/1920);
  background-color: #2B2A29;
  opacity: 0.5;
  @media ${devices.Tablet} and (orientation:portrait) {
  height: calc(10*100vw/1920);
  width: calc(1650*100vw/1920);
  margin-top: calc(80*100vw/1920);
  margin-bottom: calc(80*100vw/1920);
  }
`;

const Question = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: calc(48*100vw/1920);
  cursor: help;
  opacity: 0.3;
  z-index: 10;
  text-decoration: none;
  color: inherit;
  &:hover {opacity: 1;};
  @media ${devices.Tablet} and (orientation:portrait) {
  font-size: calc(120*100vw/1920);
  opacity: 1;
  }
`;

const HelpImg = styled.img`
  width: calc(384*100vw/1920);
  height: calc(384*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
  width: calc(900*100vw/1920);
  height: calc(900*100vw/1920);
  }
`;

const RegisterButton = styled.button`
  text-align: center;
  vertical-align: middle;
  font-size: calc(28*100vw/1920);
  color: #F7EFE7;
  background-color: #584743;
  width: calc(332*100vw/1920);
  height: calc(72*100vw/1920);
  line-height: calc(72*100vw/1920);
  border-radius: calc(15*100vw/1920);
  border-width: 0;
  cursor: pointer;
  z-index: 10;
  &:hover {background-color: #4c3732;}
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(664*100vw/1920);
    height: calc(144*100vw/1920);
    line-height: calc(144*100vw/1920);
    font-size: calc(70*100vw/1920);
  }
`;

const ErrorMsg = styled.p`
  font-size: calc(24*100vw/1920);
  color: red;
  @media ${devices.Tablet} and (orientation:portrait) {
    font-size: calc(60*100vw/1920);
  }
`;

function Login() {
  const fields = ['電子郵件', '密碼'];
  const {
    email, password, error, loading, handleChange, handleSubmit,
  } = useManageUserAuth(loginUser, fields);
  return (
    <>
      <CenterTopHeader />
      <Wrapper>
        <LoginBox>
          <ManualSignIn>
            <ManualInput
              type="text"
              name="email"
              placeholder={fields[0]}
              value={email}
              onChange={handleChange}
              autoFocus
              autoComplete="email"
            />
            <ManualInput
              type="password"
              name="password"
              placeholder={fields[1]}
              value={password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <LoginButton onClick={handleSubmit}>
              {loading ? '登入中...' : '登入'}
            </LoginButton>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </ManualSignIn>
        </LoginBox>
        <VerticalLine />
        <Question to="/register">
          還沒註冊過嗎？
          <HelpImg src={helpImage} alt="helpImage" />
          <RegisterButton>註冊</RegisterButton>
        </Question>
      </Wrapper>
      <FoodBackground />
    </>
  );
}

export default Login;
