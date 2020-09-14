import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuth } from "../../contexts/auth";

/**
 * Check authLevel of current user, 
 * return true if user has enough auth to access this page
 * @param {*} authLevel 
 */
function authCheck(isLogin, user, authLevel) {
	switch (authLevel) {
		case 1:
			return isLogin && user.isAdmin ? true : false;
		case 2:
			return isLogin ? true : false;
		default:
			return false;
	}
}

const ProtectedRoute = ({ redirectPath, authLevel, component: Component, render, ...rest }) => {
	const auth = useAuth();

	return (
		<Route
			{...rest}
			render={props => {
				if (!authCheck(auth.isLogin, auth.user, authLevel)) {
					authLevel === 1 ?
						alert('Higher authentication required') :
						alert('You need to login before access this page');
					return (
						<Redirect
							to={{
								pathname: redirectPath,
								state: { from: props.location }
							}}
						/>
					);
				}
				return Component ? <Component {...props} /> : render(props);
			}}
		/>
	);
};

export default ProtectedRoute;
