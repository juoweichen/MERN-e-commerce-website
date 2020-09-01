import React from "react";
import { Route, Redirect } from "react-router-dom";
import user from "services/user";

/**
 * Check authLevel of current user, 
 * return true if user has enough auth to access this page
 * @param {*} authLevel 
 */
function authCheck(authLevel) {
	const curUser = user.getCurrent();

	switch (authLevel) {
		case 1:
			return curUser && curUser.isAdmin ? true : false;
		case 2:
			return curUser ? true : false;
		default:
			return false;
	}
}

const ProtectedRoute = ({ redirectPath, authLevel, component: Component, render, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props => {
				if (!authCheck(authLevel)) {
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
