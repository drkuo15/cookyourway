import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firestore';

function Register() {
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
      setData({ ...data, error: 'All fields are required' });
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
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };
  return (
    <section>
      <h3>註冊</h3>
      <div>
        <div className="input_container">
          <div>姓名</div>
          <input type="text" name="name" value={name} onChange={handleChange} />
          <div>信箱</div>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <div>密碼</div>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleSubmit}>
          {loading ? 'Creating ...' : 'Register'}
        </button>
        {error && <p>{error}</p>}
      </div>
    </section>
  );
}
export default Register;
