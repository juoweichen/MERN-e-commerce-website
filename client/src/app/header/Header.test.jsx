import React from 'react';
import { render, screen } from '@testing-library/react';

import Header from './Header';
import getMock from '../../utils/test/getMock';

describe('Rendering', () => {
	let mockUser;

	beforeAll(async () => {
		mockUser = await getMock.user({
			email: 'testuser@gmail.com',
			username: 'testuser',
			password: '123123'
		})
	})

	test('should render brand link, login button, cart link', () => {
		render(<Header user={null} />);
		expect(screen.getByTestId('link-brand')).toBeDefined();
		expect(screen.getByTestId('button-login')).toBeDefined();
		expect(screen.getByTestId('link-cart')).toBeDefined();
	})

	test('Should render welcome user message and logout button if user login', () => {
		render(<Header user={mockUser} />);
		expect(screen.getByTestId('link-brand')).toBeDefined();
		expect(screen.getByText(/welcome/i)).toBeDefined();
		expect(screen.getByText(new RegExp(mockUser.username), 'i')).toBeDefined();
		expect(screen.getByTestId('button-logout')).toBeDefined();
		expect(screen.getByTestId('link-cart')).toBeDefined();
	})
})