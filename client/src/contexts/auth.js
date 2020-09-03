import { createContext, useContext } from 'react';

const initState = {
	isLogin: false,
	user: null,
	jwt: ''
}

const AuthContext = createContext(initState);

export function useAuth() {
	return useContext(AuthContext);
}

export default AuthContext;