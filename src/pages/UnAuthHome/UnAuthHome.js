import styled, { keyframes } from 'styled-components';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import mainImage from '../../images/healthy.jpg';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { auth, db } from '../../firestore';
import { ToastContainer, showCustomAlert } from '../../components/CustomAlert';
import backgroundImg from '../../images/BG.svg';

const Background = styled.div`
  padding: calc(44*100vw/1920) calc(116*100vw/1920) calc(29*100vw/1920) calc(116*100vw/1920);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HomeImage = styled.img`
  width: calc(768*100vw/1920);
  height: calc(890*100vw/1920);
  border-radius: calc(15*100vw/1920);
  object-fit: cover;
`;

const Title = styled.div`
  font-size: calc(76*100vw/1920);
  font-weight: 500;
`;

const SubTitle = styled.div`
  font-size: calc(40*100vw/1920);
  letter-spacing: calc(3*100vw/1920);

`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${'' /* align-items: flex-start; */}
  width: calc(804*100vw/1920);
  height: calc(890*100vw/1920)
  ${'' /* gap: calc(95*100vw/1920); */}
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
  ${'' /* gap: calc(28*100vw/1920); */}
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
`;

const ＭanualRegister = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  ${'' /* gap: calc(28*100vw/1920); */}
  height: calc(400*100vw/1920);
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
`;

const ErrorMsg = styled.p`
  font-size: calc(24*100vw/1920);
  color: red;
`;

function UnAuthHome() {
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
      });
      setData({
        name: '',
        email: '',
        password: '',
        error: null,
        loading: false,
      });
      showCustomAlert('您已註冊成功，即將轉跳登入頁面');
      setTimeout(() => { navigate('/login', { replace: true }); }, 4000);
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };

  return (
    <>
      <Header />
      <Background>
        <HomeImage src={mainImage} alt="mainImage" />
        <Wrapper>
          <Title>自己的美食自己做</Title>
          <SubTitle>
            立即註冊看此網站如何讓您
            <br />
            成為一個名符其實的米其林3星主廚
          </SubTitle>
          <RegisterBox>
            {/* <SSOs>
            <SSORegister>
              <SSOImg src={googleImage} alt="googleImage" />
              Google 註冊
            </SSORegister>
            <SSORegister>
              <SSOImg src={metaImage} alt="metaImage" />
              Meta 註冊
            </SSORegister>
          </SSOs>
          <HorizontalLine /> */}
            <ＭanualRegister>
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
            </ＭanualRegister>
          </RegisterBox>
        </Wrapper>
      </Background>
      <ToastContainer />
      <Footer />
    </>
  );
}

export default UnAuthHome;
