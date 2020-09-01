import http from './http'

const apiUrl = '/api/category/public';

export function getCategories() {
	return http.get(`${apiUrl}/all`);
}