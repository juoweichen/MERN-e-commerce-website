import { render, screen } from '@testing-library/react';
import { inputWrapper } from './Input';

import user from 'utils/test/userAction';

describe('Input component unit testing', () => {
	const state = {
		data: { test: '', otherData: '' },
		setData: jest.fn(),
		error: {},
		setError: jest.fn()
	}

	afterEach(() => {
		jest.clearAllMocks();
	})

	test('Should render label and input field, but no error message', () => {
		render(inputWrapper('text', 'test', 'Test', state));
		expect(screen.getByLabelText(/test/i)).toBeDefined();
		expect(screen.getByPlaceholderText(/test/i)).toBeDefined();
		expect(screen.queryByTestId('error-test')).toBeNull();
	})

	test('Should call state.setData when input value', () => {
		render(inputWrapper('text', 'test', 'Test', state));
		const test123 = 'mic testing...';

		user.type(/test/i, test123);
		expect(state.setData).toHaveBeenCalledTimes(test123.length);
		expect(state.setData).toHaveBeenCalledWith(
			expect.objectContaining({ test: 'm' })
		);
		expect(screen.queryByTestId('error-test')).toBeNull();
	})

	test('Should render error message correctly', () => {
		state.error = { test: 'Something wrong I guess..' }
		render(inputWrapper('text', 'test', 'Test', state));
		expect(screen.queryByTestId('error-test')).not.toBeNull();
	})
})
