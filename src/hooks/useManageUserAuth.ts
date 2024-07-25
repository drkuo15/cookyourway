import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FirebaseError } from 'firebase/app';
import { showCustomAlert } from '../components/CustomAlert';

type AuthHandler = (email: string, password: string, name?: string) => Promise<void>;
export default function useManageUserAuth(authHandler: AuthHandler, fields: string[]) {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    loading: false,
  });
  const {
    name, email, password, error, loading,
  } = data;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.currentTarget.name]: e.currentTarget.value });
  };

  const renderError = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Email 格式錯誤';
      case 'auth/email-already-in-use':
        return '帳號已存在，請嘗試其它帳號';
      case 'auth/weak-password':
        return '密碼至少要六位數呦！';
      case 'auth/user-not-found':
        return '找不到此用戶';
      case 'auth/wrong-password':
        return '密碼錯誤，請重新嘗試';
      default:
        return errorCode;
    }
  };

  const getInputValue = (field: string) => {
    switch (field) {
      case '使用者名稱':
        return name;
      case '電子郵件':
        return email;
      case '密碼':
        return password;
      default:
        return '';
    }
  };
  const handleMissingField = (labelList: string[], inputList: string[]): string | undefined => (
    labelList.find(
      (label, index) => !inputList[index] && label,
    ));

  const redirectUser = () => {
    const checkAuthCase = fields.includes('使用者名稱') ? 'register' : 'login';
    if (checkAuthCase === 'register') {
      showCustomAlert('您已註冊成功，即將轉跳首頁');
      setTimeout(() => { navigate('/home', { replace: true }); }, 4000);
    } else if (checkAuthCase === 'login') {
      navigate('/home', { replace: true });
    }
  };
  const handleSuccess = () => {
    setData((prev) => ({
      ...prev,
      name: '',
      email: '',
      password: '',
      error: '',
      loading: false,
    }));
    redirectUser();
  };

  const handleError = (errorCode: string) => {
    setData((prev) => ({ ...prev, error: renderError(errorCode), loading: false }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setData((prev) => ({ ...prev, loading: true }));

    const inputList = fields.map((field) => getInputValue(field));
    const missingField = handleMissingField(fields, inputList);

    if (missingField) {
      setData((prev) => ({ ...prev, loading: false, error: `請填寫${missingField}` }));
      return;
    }

    try {
      await authHandler(email, password, name);
      handleSuccess();
    } catch (err) {
      const FirebaseError = err as FirebaseError;
      handleError(FirebaseError.code);
    }
  };

  return {
    name, email, password, error, loading, handleChange, handleSubmit,
  };
}
