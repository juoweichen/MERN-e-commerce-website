import React from 'react';
import { render, screen, } from '@testing-library/react';

import CartItem from './CartItem';
import getMock from '../../../utils/test/getMock';
import user from '../../../utils/test/userAction';

describe('CartItem component unit test', () => {
	let mockItem = {
		merchid: getMock.id(),
		name: 'Shirt',
		price: 13.99,
		amount: 3,
		subTotalPrice: 41.97
	}
	let mockUpdateItem = jest.fn();
	let mockHandleDelete = jest.fn();

	beforeEach(() => {
		render(<CartItem
			item={mockItem}
			updateItem={mockUpdateItem}
			handleDelete={mockHandleDelete}
		/>)
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	describe('Rendering', () => {
		it('shoulde render item name, price, amount selector, subTotalPrice and a delete button', () => {
			expect(screen.getByText(new RegExp(mockItem.name, "i"))).toBeDefined();
			expect(screen.getByText(new RegExp(mockItem.price.toString(), "i"))).toBeDefined();
			expect(screen.getByTestId('select-single')).toBeDefined();
			expect(screen.getByTestId('select-single').value).toBe(mockItem.amount.toString());
			expect(screen.getByText(new RegExp(mockItem.subTotalPrice.toString(), "i"))).toBeDefined();
			expect(screen.getByText(/delete/i)).toBeDefined();
		})
	})

	describe('Update item', () => {
		it('should call updateItem if user select new amount of merch', () => {
			user.select('select-single', "5");
			expect(screen.getByTestId('select-single').value).toBe("5");
			expect(mockUpdateItem).toHaveBeenCalledTimes(1);
			expect(mockUpdateItem).toHaveBeenCalledWith(
				expect.objectContaining({ amount: 5 })
			);
		})
		it('should call deleteItem if user click delete button', () => {
			user.click(/delete/i);
			expect(mockHandleDelete).toHaveBeenCalledTimes(1);
			expect(mockHandleDelete).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining(
					{ merchid: mockItem.merchid }
				)
			)
		})
	})
})