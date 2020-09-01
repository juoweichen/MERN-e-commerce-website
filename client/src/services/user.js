import http from './http'
import jwtDecode from 'jwt-decode';

const apiUrl = '/api/user/public';
const tokenKey = 'token';

async function login(account) {
	const response = await http.post(`${apiUrl}/login`, {
		email: account.email,
		password: account.password
	})
	loginWithJwt(response.headers["x-auth-token"]);
}

async function register(account) {
	const response = await http.post(`${apiUrl}/register`, {
		email: account.email,
		username: account.username,
		password: account.password,
		password2: account.password2
	})
	loginWithJwt(response.headers["x-auth-token"]);
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
}
