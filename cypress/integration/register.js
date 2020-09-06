describe('Register', () => {
	beforeEach(() => {
		cy.visit('/');
		// move to register page
		cy.contains(/login/i).click();
		cy.contains(/register/i).click();
	})

	it('should successfully register user without error', () => {
		const testUsername = 'testuser';
		const testEmail = 'testuser@email.com';
		const testPassword = '123123';

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
		
	})
})