describe('my app', () => {
	it('visit my app', () => {
		cy.visit('/');
		cy.contains(/welcome/i);
	})
})