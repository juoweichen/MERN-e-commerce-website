import React from 'react';
import { render, screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/test/router';
import ProtectedRoute from './ProtectedRoute';

// NOTE: mockImplementation to each function not working
jest.mock('../../contexts/auth', () => ({
	useAuth: jest.fn()
}));
import { useAuth } from '../../contexts/auth';

const userPage = () => <h1>User Page, only login user or admin can access</h1>
const loginPage = () => <h1>Login page, redirect anonymous user to here</h1>
const adminPage = () => <h1>admin page, only admin can access</h1>

describe('ProtectedRoute unit testing', () => {
	let history;

	describe('user auth page access attempt', () => {
		beforeEach(() => {
			history = renderWithRouter(
				<ProtectedRoute
					path='/user'
					component={userPage}
					redirectPath='/login'
					authlevel={2}
				/>);
		})
		it('Should not be able access by anonymous user', () => {
			// NOTE: Not working
			// useAuth.mockImplementation(() => {
			// 	console.log('oraoraoroaroaroaroaoraoraoroaroaro');
			// })
		})
		it('Should be able access by logged-in user', () => {

		})
		it('Should be able access by admin', () => {

		})
	})

	// describe('admin auth page access attempt', () => {
	// 	beforeEach(() => {
	// 		history = renderWithRouter(
	// 			<ProtectedRoute
	// 				path='/admin'
	// 				component={adminPage}
	// 				redirectPath='/'
	// 				authlevel={1}
	// 			/>);
	// 	})
	// 	it('Should not be able access by anonymous user', () => {

	// 	})
	// 	it('Should be able access by logged-in user', () => {

	// 	})
	// 	it('Should be able access by admin', () => {

	// 	})
	// })
})
