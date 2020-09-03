import { useEffect } from 'react'

import user from '../../services/user';

export default function Logout() {
	useEffect(() => {
		user.logout();
		window.location = '/';
	}, [])

	return (
		null
	)
}
