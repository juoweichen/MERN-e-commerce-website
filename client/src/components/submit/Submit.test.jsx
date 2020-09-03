import { render, screen } from '@testing-library/react';
import { submitWrapper } from './Submit';
import joi from 'joi';

import user from '../../utils/test/userAction';

describe('Submit component unit testing', () => {
	const state = {
		data: { test: 'astring', otherData: 10 },
		setData: jest.fn(),
		error: {},
		setError: jest.fn()
	}
	const schema = joi.object({
		test: joi.string(),
		otherData: joi.number()
	})
	const onSubmit = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	})

	test('Should render Test button', () => {
		render(submitWrapper('Test', state, schema, onSubmit));
		expect(screen.getByText(/test/i)).toBeDefined();
	})

	test('Should call onSubmit if button clicked', () => {
		render(submitWrapper('Test', state, schema, onSubmit));
		user.click(/test/i);
		expect(onSubmit).toHaveBeenCalled();
	})

	test('Should not call onSubmit if validation faieled', () => {
		state.data = { ...state.data, otherData: 'shouldnotbeastring' };
		render(submitWrapper('Test', state, schema, onSubmit));
		user.click(/test/i);
		expect(onSubmit).not.toHaveBeenCalled();
	})
})