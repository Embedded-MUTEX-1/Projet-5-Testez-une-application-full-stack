import '../support/commands'

describe('Register spec', () => {
	beforeEach(() => {
		cy.reload();
	})

    it('Should register user', () => {
      cy.intercept('POST', 'api/auth/register', {
				body: {}
	  	}).as('register')

			cy.visit('/register')

			cy.get("[formControlName='firstName']").type('toto')
			cy.get("[formControlName='lastName']").type('titi')
			cy.get("[formControlName='email']").type('test@test.com')
			cy.get("[formControlName='password']").type('test!1234')

			cy.get("button[type='submit']").click()

			cy.wait('@register')

			cy.url().should('include', '/login')
    })
  });