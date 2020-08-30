import axios from 'axios';

const apiUrl = `/api/category/public`;

export function getCategories() {
	return axios.get(`${apiUrl}/all`);
}