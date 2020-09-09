describe('Browse shop and merchs page', () => {
	before(() => {
		// seeding
		cy.exec('npm run seed:merch')
			.its('stdout')
			.should('contain', 'worldwidev3-test')
			.should('contain', 'completed');
	})

	beforeEach(() => {
		cy.visit('/');
	})

	describe('Shop rendering', () => {
		it('should render category list, merch cards', () => {
			// assert 3 category list
			cy.get('.list-group').children()
				.should('have.class', 'list-group-item')
				.should('have.length', 3)
				.first().should('contain', 'All')
			// assert 3 merch cards
			cy.get('.card')
				.should('have.length', 3);
		})

		it('should render merch name, price and image on each merch card', () => {
			cy.get('.card').children().should('have.id', 'merch-page-link');
			cy.get('#merch-page-link').children().should('have.class', 'card-img-top');
			cy.get('#merch-page-link').children().should('have.class', 'card-body');
			// assert T-shirt card
			cy.get('.card-img-top[alt="T-shirt"]').should('exist');
			cy.get('.card-body>.card-title').first().should('contain', 'T-shirt');
			cy.get('.card-body>.card-text').first().should('contain', '13.99');
		})

		it('should render merchs by corresponding category', () => {
			// click category 'all', should render 3 merch cards
			cy.get('.list-group-item').first().click();
			cy.get('.card').should('have.length', 3);
			// click category 'Outfit', should render 2 merch cards
			cy.get('.list-group-item').eq(1).click();
			cy.get('.card').should('have.length', 2);
			// click category 'Shoes', should render 1 merch cards
			cy.get('.list-group-item').eq(2).click();
			cy.get('.card').should('have.length', 1);
		})
	})

	describe('merch rendering', () => {
		it('should direct to merch page if user click merch card', () => {
			// redirect to T-shirt merch page
			cy.get('#merch-page-link').first().click();
			cy.url().should('include', 'merch');
		})

		it('should render merch name, price, image, description and amount select', () => {
			// direct to T-shirt page
			cy.get('#merch-page-link').first().click();
			cy.get('#image-col').should('exist');
			cy.get('#info-col').should('exist');
			cy.get('img[alt=merch-image]').should('exist');
			cy.get('#info-col').should('contain', 'T-shirt');
			cy.get('#info-col').should('contain', '$13.99');
			cy.get('#info-col').should('contain', 'description');
			// amount control
			cy.get('form').within(() => {
				cy.get('label').should('contain', 'Select amount');
				cy.get('select').children().should('have.length', 11);
				cy.contains(/add to cart/i).should('exist');
			})
		})
	})
})
