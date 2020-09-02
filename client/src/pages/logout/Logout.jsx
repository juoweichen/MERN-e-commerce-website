import { useEffect } from 'react'
import { useAuth } from '../../contexts/auth';

export default function Logout() {
	const { logoutUser } = useAuth();

	useEffect(() => {
		logoutUser();
		window.location = '/';
	}, [logoutUser])

	return (
		null
	)
}
