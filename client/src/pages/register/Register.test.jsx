import React from 'react';
import { render, screen } from '@testing-library/react';

import http from 'services/http';
import user from 'utils/test/userAction';
import { waitForErrorMessage } from 'utils/test/async';
import Register from './Register';

jest.mock('services/http');

function fillInAndClick(account) {
	user.type('Email', account.email);
	user.type('Username', account.username);
	user.type('Password', account.password);
	user.type(/confirm/i, account.password2);
	user.click(/Register/i);
}

describe('Register component', () => {
	const apiUrl = "/api/user/public/register";

	beforeEach(() => {
		render(<Register />);
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	describe('Rendering', () => {
		it('Should render email, username, password, confirm password and register button', () => {
			expect(screen.getByLabelText(/email/i)).toBeDefined();
			expect(screen.getByLabelText(/username/i)).toBeDefined();
			expect(screen.getByLabelText('Password')).toBeDefined();
			expect(screen.getByLabelText(/confirm/i)).toBeDefined();
			expect(screen.getByText(/register/i)).toBeDefined();
		})
		it('Should not render error message when start', () => {
			expect(screen.queryByTestId('error-email')).toBeNull();
			expect(screen.queryByTestId('error-username')).toBeNull();
			expect(screen.queryByTestId('error-password')).toBeNull();
			expect(screen.queryByTestId('error-password2')).toBeNull();
		})
		it('Should render email input field correct', async () => {
			// Input valid email
			const emailInputBox = await user.type('Email', 'poo@gmail.com')
			expect(emailInputBox.value).toEqual('poo@gmail.com');
			// error should not render
			expect(screen.queryByTestId('error-email')).toBeNull();
		})
		it('Should render username input field correct', async () => {
			// Input valid username
			const usernameInputBox = await user.type('Username', 'poo')
			expect(usernameInputBox.value).toEqual('poo');
			// error should not render
			expect(screen.queryByTestId('error-username')).toBeNull();
		})
		it('Should render password input field correct', async () => {
			// input valid password
			const passwordInputBox = await user.type('Password', '123123')
			expect(passwordInputBox.value).toEqual('123123');
			// error should not render
			expect(screen.queryByTestId('error-password')).toBeNull();
		})
		it('Should render confirmed password input field correct', async () => {
			// input valid password2
			const password2InputBox = await user.type(/confirm/i, '123123')
			expect(password2InputBox.value).toEqual('123123');
			// error should not render
			expect(screen.queryByTestId('error-password2')).toBeNull();
		})
	})

	describe('Register attemp', () => {
		it('Should register new user', async () => {
			// correct login
			const account = {
				email: 'user1@gmail.com',
				username: 'user1',
				password: '123123',
				password2: '123123'
			}
			fillInAndClick(account);
			expect(http.post).toHaveBeenCalledTimes(1);
			expect(http.post).toHaveBeenCalledWith(apiUrl, account);
			expect(screen.queryByTestId('error-email')).toBeNull();
		})

		it('Should not register if password2 does not match password', () => {
			const account = {
				username: 'user1',
				email: 'user1@gmail.com',
				password: '123123',
				password2: '123123123'
			}
			fillInAndClick(account);
			expect(http.post).toHaveBeenCalledTimes(0);
			expect(screen.queryByTestId('error-password2')).not.toBeNull();
		})

		it('Should not register if email is not a valid format', () => {
			const account = {
				username: 'user1',
				email: 'user1111',
				password: '123123',
				password2: '123123'
			}
			fillInAndClick(account);
			expect(http.post).toHaveBeenCalledTimes(0);
			expect(screen.queryByTestId('error-email')).not.toBeNull();
		})

		it('Should not register if email already registered, render corresponsed error message correctly', async () => {
			const account = {
				username: 'sameuser',
				email: 'sameuser@gmail.com',
				password: '123123',
				password2: '123123'
			}
			fillInAndClick(account);
			expect(http.post).toHaveBeenCalledTimes(1);
			expect(http.post).toHaveBeenCalledWith(apiUrl, account);
			await waitForErrorMessage('error-email');
		})
	})
})
