import React from 'react';
import { render, screen } from '@testing-library/react';

import Cart from './Cart';
import getMock from '../../utils/test/getMock';
import user from '../../utils/test/userAction';
import { renderWithRouter } from "../../utils/test/router";
import { waitForLoadingDone } from '../../utils/test/async';

jest.mock('../../services/cart');
jest.mock('../../services/user');

describe('Cart page', () => {
	let mockMatch = {
		params: {
			cartid: getMock.id()
		}
	}
	let mockItem;

	beforeEach(async () => {
		renderWithRouter(<Cart match={mockMatch} />)
		await waitForLoadingDone();
		mockItem = [
			{ merchid: '123123123123', name: 'Shirt', amount: 1, price: 13.99, subTotalPrice: 13.99 },
			{ merchid: '234234234234', name: 'Cap', amount: 3, price: 12, subTotalPrice: 36 },
		]
		window.alert = jest.fn(); // Avoid jest error 'Error: Not implemented: window.alert'
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	describe('Rendering', () => {
		it('should render list of cart id, total amount, total price and checkout button', async () => {
			expect(screen.getByText(/total amount/i)).toBeDefined();
			expect(screen.getByText(/total price/i)).toBeDefined();
			expect(screen.getAllByText(new RegExp(mockItem[0].name))).toBeDefined();
			expect(screen.getAllByText(new RegExp(mockItem[1].name))).toBeDefined();
			expect(screen.getAllByRole('combobox')).toHaveLength(2);
			expect(screen.getByText(/check out/i)).toBeDefined();
		})
	})

	describe('Change purchase amount and items', () => {
		it('should change amount, sub-total price, cart total amount and total price if user select new amount', () => {
			// find all selector by it's role 'combobox' 
			const allSelector = screen.getAllByRole('combobox');
			// select two combobox with new amount
			user.selectByElem(allSelector[0], "5");
			user.selectByElem(allSelector[1], "6");
			// assert new amount is correct
			expect(allSelector[0].value).toBe("5");
			expect(allSelector[1].value).toBe("6");
			// assert two new subTotalPrice is correct
			mockItem[0].subTotalPrice = 5 * mockItem[0].price;
			mockItem[1].subTotalPrice = 6 * mockItem[1].price;
			expect(screen.getByText(new RegExp(mockItem[0].subTotalPrice.toString(), "i"))).toBeDefined();
			expect(screen.getByText(new RegExp(mockItem[1].subTotalPrice.toString(), "i"))).toBeDefined();
			// assert cart total amount and total price
			const totalAmountRegExp = new RegExp(`Total Amount|${(5 + 6).toString()}`, "i");
			const totalPriceRegExp = new RegExp(`Total Price|${(mockItem[0].subTotalPrice + mockItem[1].subTotalPrice).toString()}`, "i");
			expect(screen.getByText(totalAmountRegExp)).toBeDefined()
			expect(screen.getByText(totalPriceRegExp)).toBeDefined();
		})
		it('should delete items and adjust total amount and price when user click delete item', () => {
			// find all delete button
			const allDeleteButton = screen.getAllByRole('button', { name: /delete/i });
			// click first delete button
			user.clickByElem(allDeleteButton[0]);
			// assert cart total amount and total price
			const totalAmountRegExp = new RegExp(`Total Amount|${mockItem[1].toString()}`, "i");
			const totalPriceRegExp = new RegExp(`Total Price|${(mockItem[1].subTotalPrice).toString()}`, "i");
			expect(screen.getAllByText(totalAmountRegExp)).toBeDefined() // NOTE: same as merch1 so use getAll here
			expect(screen.getAllByText(totalPriceRegExp)).toBeDefined();
		})
	})
	describe('Links and Check out items', () => {
		it('should link to check-out page, pass purchase info to check-out page', () => {

		})
		it('should link to merch\'s page if user click merch name', () => {

		})
	})
})