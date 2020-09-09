import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';

import getMock from '../../utils/test/getMock';
import { waitForLoadingDone } from '../../utils/test/async';
import Merch from './Merch';

jest.mock('../../services/image');
jest.mock('../../services/merch');

describe('Merch page', () => {
	let mockMatch = {
		params: {
			merchid: getMock.id()
		}
	}

	beforeEach(() => {
		render(<Merch match={mockMatch} />)
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	describe('Rendering', () => {
		it('Should render merch info, amount control components after loading succeed', async () => {
			await waitForLoadingDone();
			// Check merch info rendering, look at merch mock service for mock value
			expect(screen.getByText('Shirt')).toBeDefined()
			expect(screen.getByText(/15.99/i)).toBeDefined()
			// Check amount control components
			expect(screen.getByLabelText(/select amount/i)).toBeDefined()
			expect(screen.getByText(/add to cart/i)).toBeDefined()
		})

		it('Shoudl render image after loading succeed', async () => {
			await waitForLoadingDone();
			expect(screen.getByAltText(/image/)).toBeDefined();
		})
	})

	// describe('Select purchase number and add to cart', () => {
	// 	it('should add nothing to cart if user not select amounts', () => {
	// 	})
	// })
})