import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';

export function waitForLoadingDone() {
	// wait for loading gone
	// NOTE: To avoid act(...) warning!
	return waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
}

export function waitForErrorMessage(errorTestId) {
	// NOTE: To avoid act(...) warning!
	return waitFor(() => expect(screen.queryByTestId(errorTestId)).not.toBeNull());
}
