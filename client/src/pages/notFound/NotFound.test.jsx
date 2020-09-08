import React from 'react';
import { render, screen, } from '@testing-library/react';

import NotFound from './NotFound';

describe('NotFound', () => {
	beforeEach(() => {
		render(<NotFound />)
	})

	describe('Rendering', () => {
		it('should render page not found message', () => {
			expect(screen.getByText(/(not)|(found)/i));
		})
	})
})
