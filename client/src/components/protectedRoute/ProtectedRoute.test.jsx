import React from 'react';
import { screen } from '@testing-library/react';
import { Switch, Route } from 'react-router-dom';

import { renderWithRouter } from '../../utils/test/router';
import ProtectedRoute from './ProtectedRoute';

// NOTE: mockImplementation to each function not working, it's ugly I know...
jest.mock('../../contexts/auth', () => ({
	useAuth: jest.fn()
		.mockReturnValueOnce({
			isLogin: false,
			user: null,
			jwt: ''
		})
		.mockReturnValueOnce({
			isLogin: true,
			user: {
				username: 'testuser',
				email: 'testuser@gmail.com',
				password: '123123'
			},
			jwt: 'oraoraoraoroaroaroaroaroaroaroar'
		})
		.mockReturnValueOnce({
			isLogin: true,
			user: {
				username: 'admin',
				email: 'admin@gmail.com',
				password: 'admin',
				isAdmin: true
			},
			jwt: 'oraoraoraoroaroaroaroaroaroaroar'
		})
		.mockReturnValueOnce({
			isLogin: false,
			user: null,
			jwt: ''
		})
		.mockReturnValueOnce({
			isLogin: true,
			user: {
				username: 'testuser',
				email: 'testuser@gmail.com',
				password: '123123'
			},
			jwt: 'oraoraoraoroaroaroaroaroaroaroar'
		})
		.mockReturnValueOnce({
			isLogin: true,
			user: {
				username: 'admin',
				email: 'admin@gmail.com',
				password: 'admin',
				isAdmin: true
			},
			jwt: 'oraoraoraoroaroaroaroaroaroaroar'
		})
}));

const HomePage = () => <h1>Home page, everyone allow to access</h1>
const UserPage = () => <h1>User Page, only logged user or admin can access</h1>
const LoginPage = () => <h1>Login page, redirect anonymous user to here</h1>
const AdminPage = () => <h1>admin page, only admin can access</h1>

describe('ProtectedRoute unit testing', () => {
	let history;

	beforeEach(async () => {
		window.alert = jest.fn(); // To avoid jest error 'Error: Not implemented: window.alert'
	})

	describe('user auth page access attempt', () => {
		beforeEach(() => {
			history = renderWithRouter(
				<Switch>
					<Route path='/home' component={HomePage} />
					<Route path='/login' component={LoginPage} />
					<ProtectedRoute
						path='/user'
						component={UserPage}
						redirectPath='/login'
						authLevel={2}
					/>
				</Switch>
				, '/user');
		})
		it('Should not be able access by anonymous user', async () => {
			// expect(screen.getByText(/login page/i)).toBeDefined() // NOTE: NOT WORKING
			expect(history.location.pathname).toBe('/login');
		})
		it('Should be able access by logged-in user', () => {
			expect(screen.getByText(/user page/i)).toBeDefined();
			expect(history.location.pathname).toBe('/user');
		})
		it('Should be able access by admin', () => {
			expect(screen.getByText(/user page/i)).toBeDefined();
			expect(history.location.pathname).toBe('/user');
		})
	})

	describe('admin auth page access attempt', () => {
		beforeEach(() => {
			history = renderWithRouter(
				<Switch>
					<Route path='/home' component={HomePage} />
					<Route path='/login' component={LoginPage} />
					<ProtectedRoute
						path='/admin'
						component={AdminPage}
						redirectPath='/home'
						authLevel={1}
					/>
				</Switch>
				, '/admin');
		});

		it('Should not be able access by anonymous user', () => {
			expect(history.location.pathname).toBe('/home');
		})
		it('Should be able access by logged-in user', () => {
			expect(history.location.pathname).toBe('/home');
		})
		it('Should be able access by admin', () => {
			expect(history.location.pathname).toBe('/admin');
		})
	})
})
