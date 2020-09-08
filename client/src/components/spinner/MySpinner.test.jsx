import React from 'react';
import { render, screen } from '@testing-library/react';

import MySpinner from './MySpinner';

describe('MySpinner', () => {
	beforeEach(() => {
		render(<MySpinner />)
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	describe('Rendering', () => {
		it('should render my custom spinner', () => {
			expect(screen.getByTestId(/loading/i)).toBeDefined();
		})
	})
})