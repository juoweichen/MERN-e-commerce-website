import React from 'react';
import { screen } from '@testing-library/react';

import ImageCard from './ImageCard';
import { getImageByMerchId } from '../../services/image';
import user from '../../utils/test/userAction';
import { waitForLoadingDone } from '../../utils/test/async';
import { renderWithRouter } from '../../utils/test/router';

jest.mock('../../services/image');

describe('ImageCard unit testing', () => {
	let history;
	const oldLink = '/shop';
	const newLink = '/testMerchPage';
	const mockImageService = jest.fn(
		() => getImageByMerchId('mmmmmockmerchid'));

	beforeEach(async () => {
		history = renderWithRouter(
			<ImageCard
				title='Test title'
				text='Description of the item'
				link={newLink}
				imageService={mockImageService}
			/>, oldLink);
		await waitForLoadingDone();
	})

	afterEach(() => {
		jest.clearAllMocks();
	})

	describe('Rendering', () => {
		it('Should render item image, title and body text correctly', () => {
			expect(screen.getByTestId('card-image')).toBeDefined();
			expect(screen.getByText(/title/i)).toBeDefined();
			expect(screen.getByText(/description/i)).toBeDefined();
		})
	})

	describe('Card link to page', () => {
		it('Should link to specific page when card has been clicked', () => {
			expect(history.location.pathname).toBe(oldLink);
			user.clickByElem(screen.getByText(/title/i));
			expect(history.location.pathname).toBe(newLink);
		})
	})
})
