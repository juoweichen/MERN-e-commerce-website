describe('Login', () => {
	const testUsername = 'testuser1';
	const testEmail = 'testuser1@gmail.com';
	const testPassword = '123123';

	before(() => {
		// seeding
		cy.exec('npm run seed:user')
			.its('stdout')
			.should('contain', 'completed')
			.should('contain', 'worldwidev3-test');
	})

	beforeEach(() => {
		cy.visit('/');
		// move to login page
		cy.contains(/login/i).click();
	})

	it('should move to login page', () => {
		cy.url().should('include', '/login');
	})

	it('should successfully login user without error', () => {
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
		cy.get('#welcome-user').should('contain', testUsername);
		// TODO: localstorage
		expect(localStorage.getItem('token')).to.not.be.undefined
		// click logout
		cy.contains(/logout/i).click();
		// redirect back to home page
		cy.url().should('include', '/');
		// logout assertion
		cy.get('#welcome-user').should('not.exist');
	})

	it('should NOT login if email is not exist', () => {
		const wrongEmail = 'randomemail@email.com';
		// Input login form
		cy.get('#email')
			.type(wrongEmail)
			.should('have.value', wrongEmail);
		cy.get('#password')
			.type(testPassword)
			.should('have.value', testPassword);
		cy.get('#submitButton').click();
		// Show error messages
		cy.get('[data-testid=error-email]').should('exist');
		// not redirect
		cy.url().should('include', '/login');
	})

	it('should NOT login if password is incorrect', () => {
		const wrongPassword = 'hehhehhehehehhehe';
		// Input login form
		cy.get('#email')
			.type(testEmail)
			.should('have.value', testEmail);
		cy.get('#password')
			.type(wrongPassword)
			.should('have.value', wrongPassword);
		cy.get('#submitButton').click();
		// Show error messages
		cy.get('[data-testid=error-email]').should('exist');
		// not redirect
		cy.url().should('include', '/login');
	})
})