import React from 'react';
import { screen } from '@testing-library/react';

import http from '../../services/http';
import user from '../../utils/test/userAction';
import { renderWithRouter } from '../../utils/test/router';
import { waitForErrorMessage } from '../../utils/test/async';
import Login from './Login';

jest.mock('../../services/http');

function fillInAndClick(account) {
	user.type('Email', account.email);
	user.type('Password', account.password);
	user.click(/login/i);
}

describe('Login component', () => {
	let history;
	const apiUrl = '/api/user/public/login';

	beforeEach(() => {
		history = renderWithRouter(<Login />, '/login');
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	describe('Rendering', () => {
		it('Should render email, password, register link and login button', () => {
			expect(screen.getByLabelText(/email/i)).toBeDefined();
			expect(screen.getByLabelText(/password/i)).toBeDefined();
			expect(screen.getByText(/login/i)).toBeDefined();
			expect(screen.getByText(/register/i)).toBeDefined();
		})
		it('Should not render error message when start', () => {
			expect(screen.queryByTestId('error-email')).toBeNull();
			expect(screen.queryByTestId('error-password')).toBeNull();
		})
		it('Should render email input field correct', async () => {
			// Input valid email
			const emailInputBox = await user.type('Email', 'poo@gmail.com')
			expect(emailInputBox.value).toEqual('poo@gmail.com');
			// error should not render
			expect(screen.queryByTestId('error-email')).toBeNull();
		})
		it('Should render password input field correct', async () => {
			// input valid password
			const passwordInputBox = await user.type('Password', '123123')
			expect(passwordInputBox.value).toEqual('123123');
			// error should not render
			expect(screen.queryByTestId('error-password')).toBeNull();
		})
	})

	describe('login attempt', () => {
		it('Should login if email exist and password matches', async () => {
			// correct login
			const account = {
				email: 'user1@gmail.com',
				password: '123123'
			}
			fillInAndClick(account);
			expect(http.post).toHaveBeenCalledTimes(1);
			expect(http.post).toHaveBeenCalledWith(apiUrl, account);
			expect(screen.queryByTestId('error-email')).toBeNull();
		})

		it('Should not login if user inputs are invalid', () => {
			// invalid input
			const account = {
				email: 'user1111111',	// invalid email format
				password: '12'	// Too short
			}
			fillInAndClick(account);
			expect(http.post).toHaveBeenCalledTimes(0);
			expect(screen.queryByTestId('error-email')).not.toBeNull();
			expect(screen.queryByTestId('error-password')).not.toBeNull();
		})

		it('Should not login if email is not exist, rendering corresponse error message', async () => {
			// incorrect login
			const account = {
				email: 'notexistuser@gmail.com',
				password: '123123'
			}
			fillInAndClick(account);
			expect(http.post).toHaveBeenCalledTimes(1);
			expect(http.post).toHaveBeenCalledWith(apiUrl, account);
			await waitForErrorMessage('error-email');
		})

		it('Should not login if password is not match, rendering corresponsed error message', async () => {
			// correct login
			const account = {
				email: 'user1@gmail.com',
				password: 'wrongpassword'
			}
			fillInAndClick(account);
			expect(http.post).toHaveBeenCalledTimes(1);
			expect(http.post).toHaveBeenCalledWith(apiUrl, account);
			await waitForErrorMessage('error-email');
		})
	})
	describe('New register', () => {
		it('Should link to register page when user press the register link', () => {
			expect(history.location.pathname).toBe('/login');
			user.clickByElem(screen.getByText(/register/i));
			expect(history.location.pathname).toBe('/register');
		})
	})
})