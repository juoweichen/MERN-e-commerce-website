import React from 'react';
import { render, screen } from '@testing-library/react';

import ItemList from './ItemList';
import user from 'utils/test/userAction';

describe('ItemList unit testing', () => {
	const mockItems = [
		{ _id: 1, name: 'Outfit' },
		{ _id: 2, name: 'Shoes' },
		{ _id: 3, name: 'Hat' }
	];
	const mockOnClick = jest.fn();

	beforeEach(() => {
		render(<ItemList items={mockItems} handleOnClick={mockOnClick} />)
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	describe('Rendering', () => {
		it('Should render all and 3 items correctly', () => {
			expect(screen.getByText(/all/i)).toBeDefined();
			mockItems.map(item => {
				expect(screen.getByText(new RegExp(item.name, 'i'))).toBeDefined();
			})
		})
	})

	describe('User Action', () => {
		it('Should call handleOnClick if user click a list', () => {
			mockItems.map(item => {
				user.clickByElem(screen.getByText(new RegExp(item.name, 'i')))
			})
			expect(mockOnClick).toHaveBeenCalledTimes(3);
		})
	})
})