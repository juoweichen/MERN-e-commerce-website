import http from './http'
import jwtDecode from 'jwt-decode';

const apiUrl = '/api/user/public';
const tokenKey = 'token';

function login(account) {
	return http.post(`${apiUrl}/login`, {
		email: account.email,
		password: account.password
	})
}

async function register(account) {
	return http.post(`${apiUrl}/register`, {
		email: account.email,
		username: account.username,
		password: account.password,
		password2: account.password2
	})
}

function verifyJwt(jwt) {
	return http.get(`${apiUrl}/verify`,
		{ headers: { 'x-auth-token': jwt } }
	);
	// KEEP for mock
	// return ({
	// 	headers: {
	// 		"x-auth-token": "123123"
	// 	},
	// 	data: {
	// 		username: 'usertest',
	// 		password: '123123123',
	// 		email: 'usertest@gmail.com'
	// 	}
	// })
}

function loginWithJwt(jwtToken) {
	localStorage.setItem(tokenKey, jwtToken);
}


function getCurrent() {
	try {
		const token = localStorage.getItem(tokenKey);
		return jwtDecode(token);
	}
	catch (ex) {
		return null;
	}
}

function getJwt() {
	return localStorage.getItem(tokenKey);
}

function logout() {
	localStorage.removeItem(tokenKey);
}

export default {
	login,
	register,
	loginWithJwt,
	getCurrent,
	getJwt,
	logout,
	verifyJwt,
}
