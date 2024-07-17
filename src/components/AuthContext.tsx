import { createContext } from 'react';
import { User } from '../types/User';

const AuthContext = createContext<User | null>(null);

export default AuthContext;
