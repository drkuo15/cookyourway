import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword, setPersistence, browserSessionPersistence,
} from 'firebase/auth';
import { auth } from '../../firestore/index';

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
      <h3>Log into Your Account</h3>
      <div>
        <div className="input_container">
          <div>Email</div>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <div>Password</div>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleSubmit}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p>{error}</p>}
      </div>
    </section>
  );
}

export default Login;
