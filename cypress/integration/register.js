describe('Register', () => {
	const testUsername = 'testuser2';
	const testEmail = 'testuser2@gmail.com';
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
		// move to register page
		cy.contains(/login/i).click();
		cy.contains(/register/i).click();
	})

	it('should move to register page', () => {
		cy.url().should('include', '/register');
	})

	it('should successfully register user without error', () => {
		// input register form
		cy.get('#email')
			.type(testEmail)
			.should('have.value', testEmail);
		cy.get('#username')
			.type(testUsername)
			.should('have.value', testUsername);
		cy.get('#password')
			.type(testPassword)
			.should('have.value', testPassword);
		cy.get('#password2')
			.type(testPassword)
			.should('have.value', testPassword);
		cy.get('#submitButton').click();
		// redirect back to home page
		cy.url().should('include', '/');
		// login assertion
		cy.get('#welcome-user').should('contain', testUsername);
		// click logout
		cy.contains(/logout/i).click();
		// redirect back to home page
		cy.url().should('include', '/');
		// logout assertion
		cy.get('#welcome-user').should('not.exist');
	})

	it('should NOT register if user miss email format', () => {
		const wrongEmail = 'nonsenseemail';
		// wrong email format
		cy.get('#email')
			.type(wrongEmail)
			.should('have.value', wrongEmail);
		cy.get('#username')
			.type(testUsername)
			.should('have.value', testUsername);
		cy.get('#password')
			.type(testPassword)
			.should('have.value', testPassword);
		cy.get('#password2')
			.type(testPassword)
			.should('have.value', testPassword);
		cy.get('#submitButton').click();
		// Show error messages
		cy.get('[data-testid=error-email]').should('exist');
		// not redirect
		cy.url().should('include', '/register');
	})

	it('should NOT register if user miss username', () => {
		// miss to fill in username
		cy.get('#email')
			.type(testEmail)
			.should('have.value', testEmail);
		cy.get('#password')
			.type(testPassword)
			.should('have.value', testPassword);
		cy.get('#password2')
			.type(testPassword)
			.should('have.value', testPassword);
		cy.get('#submitButton').click();
		// Show error messages
		cy.get('[data-testid=error-username]').should('exist');
		// not redirect
		cy.url().should('include', '/register');
	})

	it('should NOT register if confirmation password is not the same as password', () => {
		cy.get('#email')
			.type(testEmail)
			.should('have.value', testEmail);
		cy.get('#username')
			.type(testUsername)
			.should('have.value', testUsername);
		cy.get('#password')
			.type(testPassword)
			.should('have.value', testPassword);
		cy.get('#password2')	// Not the same as password
			.type(testPassword + '123123')
			.should('have.value', testPassword + '123123');
		cy.get('#submitButton').click();
		// Show error messages
		cy.get('[data-testid=error-password2]').should('exist');
		// not redirect
		cy.url().should('include', '/register');
	})
})