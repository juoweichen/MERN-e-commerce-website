import http from './http';

const apiUrl = '/api/cart/auth';

export function getCartById(cartid, jwt) {
	return http.get(`${apiUrl}/${cartid}`,
		{ headers: { 'x-auth-token': jwt } }
	);
}

export function updateCart(cartid, newCart, jwt) {
	return http.put(`${apiUrl}/${cartid}`,
		newCart,
		{ headers: { 'x-auth-token': jwt } }
	);
}

export function addItemToCart(cartid, item, jwt) {
	return http.post(`${apiUrl}/${cartid}`,
		item,
		{ headers: { 'x-auth-token': jwt } }
	);
}
