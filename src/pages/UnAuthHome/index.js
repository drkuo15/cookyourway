import styled, { keyframes } from 'styled-components';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import mainImage from '../../images/healthy.jpg';
import Header from '../../components/Header';
import { auth, db } from '../../firestore';
import { devices } from '../../utils/StyleUtils';
import { ToastContainer, showCustomAlert } from '../../components/CustomAlert';
import backgroundImg from '../../images/BG.svg';

const Background = styled.div`
  padding: calc(44*100vw/1920) calc(116*100vw/1920) calc(44*100vw/1920) calc(116*100vw/1920);
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media ${devices.Tablet} and (orientation: portrait){
    flex-direction: column;
    margin-top: calc(75*100vw/1920);
    margin-bottom: calc(75*100vw/1920);
    gap: calc(100*100vw/1920);
  }
`;

const HomeImage = styled.img`
  width: calc(768*100vw/1920);
  height: calc(890*100vw/1920);
  border-radius: calc(15*100vw/1920);
  object-fit: cover;
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(1650*100vw/1920);
    height: calc(1912*100vw/1920);
    flex-direction: column;
  }
`;

const Shine = keyframes`
  to {
    background-position-x: -200%;
  }
`;

const HomeDefaultDiv = styled.div`
  width: calc(768*100vw/1920);
  height: calc(890*100vw/1920);
  border-radius: calc(15*100vw/1920);
  background: #eee;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  border-radius: 5px;
  background-size: 200% 100%;
  animation: 1.5s ${Shine} linear infinite;
  @media ${devices.Tablet} and (orientation: portrait){
  width: calc(1650*100vw/1920);
  height: calc(1912*100vw/1920);
  flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: calc(76*100vw/1920);
  font-weight: 450;
  text-align: center;
  @media ${devices.Tablet} and (orientation: portrait){
    font-size: calc(170*100vw/1920);
  }
`;

const SubTitle = styled.div`
  font-size: calc(40*100vw/1920);
  letter-spacing: calc(3*100vw/1920);
  text-align: center;
  @media ${devices.Tablet} and (orientation: portrait){
    font-size: calc(100*100vw/1920);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(804*100vw/1920);
  height: calc(890*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(1650*100vw/1920);
    height: calc(1912*100vw/1920);
    margin-top: calc(100*100vw/1920);
    gap: calc(100*100vw/1920);
  }
`;

const Floating = keyframes`
  {
      from { transform: translate(0,  0px); }
      65%  { transform: translate(0, -10px); }
      to   { transform: translate(0, 0px); }
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
  position: relative; 
  z-index: 10;
  overflow: hidden;
  &::before {
    position: absolute;
    top: auto;
    content: "";
    background-image: url(${backgroundImg});
    background-repeat:no-repeat;
    background-position: center center;
    background-size: cover;
    opacity: 0.2;
    width: calc(804*100vw/1920);
    height: calc(572*100vw/1920);
    z-index: -1;
    animation-name: ${Floating};
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(1650*100vw/1920);
    height: calc(1144*100vw/1920);
    &::before {
      width: calc(1650*100vw/1920);
      height: calc(1144*100vw/1920);
    }
  }
`;

const ManualRegister = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: calc(400*100vw/1920);
  @media ${devices.Tablet} and (orientation: portrait){
    height: calc(800*100vw/1920);
  }
`;

const ManualInput = styled.input`
  width: calc(560*100vw/1920);
  height: calc(72*100vw/1920);
  text-align: center;
  border-radius: calc(15*100vw/1920);
  border: 0;
  color: #2B2A29;
  background-color: #FDFDFC;
  font-size: calc(28*100vw/1920);
  outline :0;
  border: calc(2.5*100vw/1920) solid #B3B3AC;
  padding: calc(2*100vw/1920) calc(8*100vw/1920);
  &:focus {
    border-color: #EB811F;
  }
  @media ${devices.Tablet} and (orientation: portrait){
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
  @media ${devices.Tablet} and (orientation: portrait){
    width: calc(664*100vw/1920);
    height: calc(144*100vw/1920);
    line-height: calc(144*100vw/1920);
    font-size: calc(70*100vw/1920);
  }
`;

const ErrorMsg = styled.p`
  font-size: calc(24*100vw/1920);
  color: red;
  @media ${devices.Tablet} and (orientation: portrait){
    font-size: calc(60*100vw/1920);
  }
`;

function UnAuthHome() {
  const [imgLoaded, setImgLoaded] = useState(false);
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
    <>
      <Header />
      <Background>
        {imgLoaded ? (
          <HomeImage
            src={mainImage}
            alt="mainImage"
          />
        ) : (
          <>
            <HomeImage
              style={imgLoaded ? {} : { display: 'none' }}
              src={mainImage}
              alt="mainImage"
              onLoad={() => { setImgLoaded(true); }}
            />
            <HomeDefaultDiv />
          </>
        )}
        <Wrapper>
          <Title>編製食譜｜隨音料理</Title>
          <SubTitle>
            隨意編製完整食譜

            +

            音樂自動化步驟指引
            <br />
            帶您體驗料理新樂趣
          </SubTitle>
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
      </Background>
      <ToastContainer />
    </>
  );
}

export default UnAuthHome;
