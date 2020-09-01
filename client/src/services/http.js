import axios from "axios";

export function setJwtToken(jwt) {
	axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete,
	setJwtToken,
	getCancelSource: () => axios.CancelToken.source(),
	isCancel: (error) => axios.isCancel(error),
};
