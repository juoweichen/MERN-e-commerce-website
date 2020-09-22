import React from 'react';
import { render, screen, } from '@testing-library/react';

import AmountControl from './AmountControl';
import user from '../../../utils/test/userAction';

describe('<AmountControl />', () => {
	let addToCart = jest.fn();

	beforeEach(() => {
		render(<AmountControl addToCart={addToCart} />)
	})
	afterEach(() => {
		jest.clearAllMocks();
	})

	describe('Rendering', () => {
		it('shoulde render number select field and add to cart button', () => {
			expect(screen.getByTestId('select-single')).toBeDefined();
			expect(screen.getByText(/add to cart/i)).toBeDefined();
		})
	})
	describe('Changing amount and add to cart', () => {
		it('should add 0 amount to cart if user not select any number', () => {
			user.click(/add to cart/i);
			expect(addToCart).toHaveBeenCalledTimes(1);
			expect(addToCart).toHaveBeenCalledWith(0);
		})
		it('should add 5 amount to cart if user select number 5', () => {
			user.select('select-single', "5");
			user.click(/add to cart/i);
			expect(addToCart).toHaveBeenCalledTimes(1);
			expect(addToCart).toHaveBeenCalledWith(5);
		})
	})
})