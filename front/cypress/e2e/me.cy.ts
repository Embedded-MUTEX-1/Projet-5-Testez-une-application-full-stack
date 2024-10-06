import '../support/commands'

describe('Me spec', () => {
	beforeEach(() => {
		cy.reload();
	})

	it('Should display user infos', () => {
		
		cy.intercept('GET', '/api/user/1', {
			body: {
				id: 1,
				username: 'toto',
				firstName: 'tata',
				lastName: 'titi',
				admin: true,
				email: 'test@test.com',
				password: 'test!1234',
				createdAt: new Date,
				updatedAt: new Date,
			}
		}).as('getUser')

		cy.loginAdmin(true)

		cy.get("[routerLink='me']").click()

		cy.wait('@getUser')

		cy.url().should('include', '/me')

		cy.get("[data-testid='name']").should('contain.text', 'Name: tata TITI')
		cy.get("[data-testid='email']").should('contain.text', 'test@test.com')
		cy.get("[data-testid='is-admin']").should('contain.text', 'You are admin')
	})

	it('Should delete user', () => {
		
		cy.intercept('GET', '/api/user/1', {
			body: {
				id: 1,
				username: 'toto',
				firstName: 'tata',
				lastName: 'titi',
				admin: false,
				email: 'test@test.com',
				password: 'test!1234',
				createdAt: new Date,
				updatedAt: new Date,
			}
		}).as('getUser')
		
		cy.intercept('DELETE', '/api/user/1', {
			body: {}
		}).as('deleteUser')
		
		cy.loginUser(true)
		cy.get("[routerLink='me']").click()

		cy.wait('@getUser')

		cy.url().should('include', '/me')

		cy.get("[data-testid='delete']").click()

		cy.wait('@deleteUser')

		cy.url().should('not.contain', '/me')
	})
});