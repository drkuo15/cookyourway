import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firestore';
import CenterTopHeader from '../../components/CenterTopHeader';
import FoodBackground from '../../components/FoodBackgroud';
import helpImage from '../../images/help_center_FILL0_wght400_GRAD0_opsz48.svg';
import { ToastContainer, showCustomAlert } from '../../components/CustomAlert';
import { devices } from '../../utils/StyleUtils';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(95*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    flex-direction: column;
  }
`;

const RegisterBox = styled.div`
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

const ManualRegister = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: calc(400*100vw/1920);
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

const RegisterButton = styled.div`
  text-align: center;
  vertical-align: middle;
  font-size: calc(28*100vw/1920);
  color: #F7EFE7;
  background-color: #EB811F;
  width: calc(332*100vw/1920);
  height: calc(72*100vw/1920);
  line-height: calc(72*100vw/1920);
  border-radius: calc(15*100vw/1920);
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

const LoginButton = styled.div`
  text-align: center;
  vertical-align: middle;
  font-size: calc(28*100vw/1920);
  color: #F7EFE7;
  background-color: #584743;
  width: calc(332*100vw/1920);
  height: calc(72*100vw/1920);
  line-height: calc(72*100vw/1920);
  border-radius: calc(15*100vw/1920);
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

function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    error: null,
    loading: false,
  });
  const {
    name, email, password, error, loading,
  } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name || !email || !password) {
      setData({ ...data, error: '所有欄位都需要填寫呦！' });
    }
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        myFavorites: [],
      });
      setData({
        name: '',
        email: '',
        password: '',
        error: null,
        loading: false,
      });
      showCustomAlert('您已註冊成功，即將轉跳首頁');
      setTimeout(() => { navigate('/home', { replace: true }); }, 4000);
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };
  return (
    <section>
      <CenterTopHeader />
      <Wrapper>
        <Question to="/login">
          已經有註冊過了？
          <HelpImg src={helpImage} alt="helpImage" />
          <LoginButton>登入</LoginButton>
        </Question>
        <VerticalLine />
        <RegisterBox>
          <ManualRegister>
            <ManualInput
              type="text"
              name="name"
              placeholder="使用者名稱"
              value={name}
              onChange={handleChange}
            />
            <ManualInput
              type="text"
              name="email"
              placeholder="電子郵件"
              value={email}
              onChange={handleChange}
            />
            <ManualInput
              type="password"
              name="password"
              placeholder="密碼"
              value={password}
              onChange={handleChange}
            />
            <RegisterButton onClick={handleSubmit}>
              {loading ? '帳號註冊中...' : '註冊'}
            </RegisterButton>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </ManualRegister>
        </RegisterBox>
      </Wrapper>
      <FoodBackground />
      <ToastContainer />
    </section>
  );
}
export default Register;
