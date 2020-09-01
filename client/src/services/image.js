import http from './http'

const apiUrl = '/api/image';

export function getImageByMerchId(merchid, source) {
	return http.get(`${apiUrl}/public/merchid/${merchid}`,
		{ cancelToken: source.token }
	);
}

export function getImageById(imageid) {
	return http.get(`${apiUrl}/admin/${imageid}`);
}

export function uploadImage(imageData) {
	http.post(`${apiUrl}/admin/new`,
		imageData,
		{ headers: { 'content-type': 'multipart/form-data' } }
	)
}
