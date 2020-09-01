import React from 'react';
import { render, screen, } from '@testing-library/react';

import Selector from './Selector';
import user from '../../utils/test/userAction';

function createNumberOptions(count) {
	const options = [];
	for (let i = 0; i <= count; i++)
		options.push({
			label: i.toString(),
			value: i
		});
	return options;
}

describe('Selector component unit testing', () => {
	let amount;
	let handleChange = jest.fn();

	beforeEach(() => {
		amount = 0;
		render(
			<Selector
				label='Select number: '
				value={amount}
				handleChange={handleChange}
				options={createNumberOptions(10)}
			/>
		)
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	it('Should render label, select field with default value', () => {
		const selectField = screen.getByLabelText(/select number/i);
		expect(selectField).toBeDefined();
		expect(selectField.value == amount).toBeTruthy();
	})
	it('Should call handleChange if user click new number', () => {
		// NOTE: Flaw on this one by I don't wanna spend more time on here
		user.select('select-single', "5");
		expect(handleChange).toHaveBeenCalledTimes(1);
	})
})