import React from 'react';
import { Router } from 'react-router-dom'
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history'

/**
 * Test components with Link or Route, return history to compare
 * location's path name
 * NOTE: avoid using this to test implementation details
 * REF: https://testing-library.com/docs/example-react-router
 * @param {*} ui - render component
 * @param {string} route - initial path name
 * @return {*} history - provided by createMemoryHistory
 */
export function renderWithRouter(ui, route = '/') {
	const history = createMemoryHistory({ initialEntries: [route] });
	render(<Router history={history}>{ui}</Router>);
	return history;
}