import React from 'react';
import { render, screen } from '@testing-library/react';

import user from '../../services/user';
import Logout from './Logout';

jest.mock('../../services/user');

describe('Logout', () => {
	beforeEach(() => {
		render(<Logout />)
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	describe('Executing logout', () => {
		it('should call user.logout service', () => {
			expect(user.logout).toHaveBeenCalledTimes(1);
		})
	})
})