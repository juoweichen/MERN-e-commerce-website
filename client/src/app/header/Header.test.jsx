import React from 'react';
import { render, screen } from '@testing-library/react';

import { renderWithRouter } from '../../utils/test/router';
import Header from './Header';

// NOTE: mockReturnValueOnce still not the best solution...
// 			 But better then mock entire file or mockImplementationOnce
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
}));

describe('Rendering', () => {
	const welcomeMessageReg = /(?=.*\welcome\b)(?=.*\btestuser\b).*/i;

	beforeEach(() => {
		renderWithRouter(<Header />);
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	test('should render brand link, login button, cart link', () => {
		expect(screen.getByTestId('link-brand')).toBeDefined();
		expect(screen.getByTestId('button-login')).toBeDefined();
		expect(screen.getByTestId('link-cart')).toBeDefined();
	})

	test('Should render welcome user message and logout button if user login', () => {
		expect(screen.getByTestId('link-brand')).toBeDefined();
		expect(screen.getByText(welcomeMessageReg)).toBeDefined();
		expect(screen.getByTestId('button-logout')).toBeDefined();
		expect(screen.getByTestId('link-cart')).toBeDefined();
	})

	//TODO: this
	// test('Should render admin panel if current login are admin', () => {
	// 	expect(true).toBe(true);
	// })
})