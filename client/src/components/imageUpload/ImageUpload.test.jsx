import React from 'react';
import { render, screen, } from '@testing-library/react';

import ImageUpload from './ImageUpload';
import user from '../../utils/test/userAction';

describe('ImageUpload component unit test', () => {
	let label = 'upload a image';
	let mockUpload = jest.fn();
	const file = new File(['hello'], 'hello.png', { type: 'image/png' })
	const inputLabelReg = /(?=.*\bupload\b)(?=.*\bimage\b).*/i;

	beforeEach(() => {
		render(<ImageUpload label={label} upload={mockUpload} />)
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	it('Shoulde render file upload field and upload button', () => {
		// a sentence must include 'upload' and 'image'
		expect(screen.getByLabelText(/(?=.*\bupload\b)(?=.*\bimage\b).*/i))
		expect(screen.getByRole('button', { name: /upload/i }))
	})

	it('should read a image if user upload to input field', () => {
		const input = user.upload(inputLabelReg, file);
		expect(input.files[0]).toStrictEqual(file)
		expect(input.files).toHaveLength(1)
	})

	it('should call upload with image which user just uploaded', () => {
		// user upload image to input field
		const input = user.upload(inputLabelReg, file);
		expect(input.files[0]).toStrictEqual(file)
		expect(input.files).toHaveLength(1)
		// click upload button
		user.click(/upload/i);
		expect(mockUpload).toHaveBeenCalledTimes(1);
		expect(mockUpload).toHaveBeenCalledWith(
			expect.any(FormData)
		);
	})
})