import axios from 'axios';

const apiUrl = `${process.env.REACT_APP_APIURL}/api/category/public`;

export function getCategories() {
	return axios.get(`${apiUrl}/all`);
}