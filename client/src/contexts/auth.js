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

// NOTE: old mock auth context using mockImplementationOnce
// NOTE: mockImplementationOnce is not the best solution.
// 			 But I havn't figure out how to mock specific funciton
//			 in a module for each test
// export const useAuth = jest.fn()
// 	.mockImplementationOnce(() => {
// 		return ({
// 			isLogin: false,
// 			user: null,
// 			jwt: ''
// 		})
// 	})
// 	.mockImplementationOnce(() => {
// 		return ({
// 			isLogin: true,
// 			user: {
// 				username: 'testuser',
// 				email: 'testuser@gmail.com',
// 				password: '123123'
// 			},
// 			jwt: 'oraoraoraoroaroaroaroaroaroaroar'
// 		})
// 	})