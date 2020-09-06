describe('Login', () => {
	before(() => {
		// seeding
		cy.exec('npm run seed:user')
	})

	beforeEach(() => {
		cy.visit('/');
		// move to login page
		cy.contains(/login/i).click();
	})

	it('should move to login page', () => {
		cy.url().should('include', '/login');
	})

	it.only('should successfully login user without error', () => {
		const testUsername = 'testuser1';
		const testEmail = 'testuser1@gmail.com';
		const testPassword = '123123';
		// Input login form
		cy.get('#email')
			.type(testEmail)
			.should('have.value', testEmail)
		cy.get('#password')
			.type(testPassword)
			.should('have.value', testPassword);
		cy.get('#submitButton').click();
		// redirect back to home page
		cy.url().should('include', '/');
		// login assertion
		cy.get('#username').should('contain', testUsername);
		// TODO: localstorage
		// click logout
		cy.contains(/logout/i).click();
		// logout assertion
		cy.get('#username').should('not.exist');
	})
})