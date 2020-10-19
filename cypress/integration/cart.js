describe('Cart', () => {
	before(() => {
		// seeding
		cy.exec('npm run seed:user')
			.its('stdout')
			.should('contain', 'completed')
			.should('contain', 'worldwidev3-test');
	})

	it('should redirect to login page if user not login yet', () => {
		cy.visit('/');
		cy.get('a[data-testid="link-cart"]').click();
		cy.url().should('not.include', '/cart');
		cy.url().should('include', '/login');
	})

	describe('Cart operation', () => {
		const merchName = 'T-shirt';
		const merchPrice = 13.99;

		beforeEach(() => {
			const testEmail = 'testuser1@gmail.com';
			const testPassword = '123123';

			cy.visit('/');
			// login user
			cy.contains(/login/i).click();
			// Input login form
			cy.get('#email')
				.type(testEmail)
				.should('have.value', testEmail)
			cy.get('#password')
				.type(testPassword)
				.should('have.value', testPassword);
			cy.get('#submitButton').click();
			// wait till login
			cy.wait(2000);
		})

		it('should start with an empty cart, zero total amount and price', () => {
			cy.get('a[data-testid="link-cart"]').click();
			cy.url().should('include', '/cart');
			// Cart should be empty
			assertCart({ merchName, merchPrice, amount: 0 });
			cy.contains(/check out/i).should('exist')
		})

		// NOTE: To avoid reseeding db, I test all cart operation here
		it('should allow user to add merchs to cart on merch page', () => {
			// redirect to T-shirt merch page
			cy.get('.card').contains(merchName).click();
			cy.url().should('include', 'merch');
			// Add 3 t-shirts to cart
			cy.get('select').select("3");
			cy.contains(/add/i).click();
			cy.wait(1000);
			// Move to cart
			cy.get('a[data-testid="link-cart"]').click();
			cy.url().should('include', '/cart');
			// assert t-shirt in cart and cart's total amount and price
			assertCart({ merchName, merchPrice, amount: 3 });
			// Change t-shirt amount and assert again
			cy.get('.cart-item').first().within(() => {
				cy.get('select').select("8");
			})
			assertCart({ merchName, merchPrice, amount: 8 });
			// remove t-shirts from cart, total amount and price should be 0
			cy.contains(/delete/i).click();
			assertCart({ merchName, merchPrice, amount: 0 });
		})

		it('should avoid user from adding a kind of merch more then 10 in cart', () => {
			// redirect to T-shirt merch page
			cy.get('.card').contains(merchName).click();
			cy.url().should('include', 'merch');
			// Add 9 t-shirts to cart
			cy.get('select').select("9");
			cy.contains(/add/i).click();
			cy.wait(1000);
			// Add 9 t-shirts to cart agian
			cy.get('select').select("9");
			cy.contains(/add/i).click();
			cy.wait(1000);
			// TODO: Assert network call with status 409 'conflict'
			// Move to cart page, should only have 9 t-shirts in cart
			cy.get('a[data-testid="link-cart"]').click();
			cy.url().should('include', '/cart');
			// assert t-shirt in cart and cart's total amount and price
			assertCart({ merchName, merchPrice, amount: 9 });
		})
	})
})

// assert t-shirt in cart and cart's total amount and price
function assertCart({ merchName, merchPrice, amount }) {
	if (amount === 0)
		cy.get('.cart-item').should('not.exist');
	else
		cy.get('.cart-item').first().within(() => {
			cy.contains(merchName).should('exist');
			cy.contains(merchPrice).should('exist');
			cy.get('select').should('have.value', amount);
			cy.contains(merchPrice * amount).should('exist');
			cy.contains(/delete/i).should('exist');
		})
	cy.contains(/total amount/i).should('contain', amount);
	cy.contains(/total price/i).should('contain', merchPrice * amount);
}