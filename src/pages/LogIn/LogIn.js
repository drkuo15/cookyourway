import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword, setPersistence, browserSessionPersistence,
} from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../../firestore/index';
import CenterTopHeader from '../../components/CenterTopHeader';
import FoodBackground from '../../components/FoodBackgroud';
import Footer from '../../components/Footer';
import helpImage from '../../images/help_center_FILL0_wght400_GRAD0_opsz48.svg';
// import googleImage from '../../images/google.svg';
// import metaImage from '../../images/meta.png';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(95*100vw/1920);
  ${'' /* margin-bottom: calc(244*100vw/1920); */}
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
  ${'' /* gap: calc(28*100vw/1920); */}
`;

// const SSOs = styled.div`
//   display: flex;
//   justify-content: space-around;
//   gap: calc(78*100vw/1920);
//   margin-top: calc(28*100vw/1920);
// `;

// const SSOSignIn = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: calc(28*100vw/1920);
//   font-size: calc(28*100vw/1920);
//   color: #2B2A29;
//   background-color: #FDFDFC;
//   width: calc(317*100vw/1920);
//   height: calc(72*100vw/1920);
//   line-height: calc(72*100vw/1920);
//   border-radius: calc(15*100vw/1920);
//   cursor: pointer;
// `;

// const SSOImg = styled.img`
//   width: calc(46*100vw/1920);
//   height: calc(46*100vw/1920);
// `;

// const HorizontalLine = styled.div`
//   width: calc(707*100vw/1920);
//   height: calc(2*100vw/1920);
//   background-color: #B3B3AC;
// `;

const ＭanualSignIn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-size: calc(28*100vw/1920);
  height: calc(320*100vw/1920);
`;

const ManualInput = styled.input`
  width: calc(560*100vw/1920);
  height: calc(72*100vw/1920);
  text-align: center;
  border-radius: calc(15*100vw/1920);
  border: 0;
  color: #2B2A29;
  background-color: #FDFDFC;
`;

const LoginButton = styled.div`
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

const VerticalLine = styled.div`
  width: calc(5*100vw/1920);
  height: calc(644*100vw/1920);
  background-color: #2B2A29;
  opacity: 0.5;
`;

const Question = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: calc(48*100vw/1920);
  cursor: help;
  opacity: 0.3;
  &:hover {opacity: 1;};
`;

const HelpImg = styled.img`
  width: calc(384*100vw/1920);
  height: calc(384*100vw/1920);
`;

const ButtonLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  z-index: 10;
`;

const RegisterButton = styled.div`
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
`;

const ErrorMsg = styled.p`
  font-size: calc(24*100vw/1920);
  color: red;
`;

function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
    error: null,
    loading: false,
  });
  const navigate = useNavigate();

  const {
    email, password, error, loading,
  } = data;
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: 'All fields are required' });
      return;
    }
    try {
      setPersistence(auth, browserSessionPersistence)
        .then(() => signInWithEmailAndPassword(auth, email, password));
      setData({
        email: '',
        password: '',
        error: null,
        loading: false,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };
  return (
    <section>
      <CenterTopHeader />
      <Wrapper>
        <LoginBox>
          {/* <SSOs>
            <SSOSignIn>
              <SSOImg src={googleImage} alt="googleImage" />
              Google 登入
            </SSOSignIn>
            <SSOSignIn>
              <SSOImg src={metaImage} alt="metaImage" />
              Meta 登入
            </SSOSignIn>
          </SSOs>
          <HorizontalLine /> */}
          <ＭanualSignIn>
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
            <LoginButton onClick={handleSubmit}>
              {loading ? '登入中...' : '登入'}
            </LoginButton>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </ＭanualSignIn>
        </LoginBox>
        <VerticalLine />
        <Question>
          還沒註冊過嗎？
          <HelpImg src={helpImage} alt="" />
          <ButtonLink to="/register">
            <RegisterButton>註冊</RegisterButton>
          </ButtonLink>
        </Question>
      </Wrapper>
      <FoodBackground />
      <Footer />
    </section>
  );
}

export default Login;
