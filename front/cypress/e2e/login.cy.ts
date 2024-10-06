describe('Login spec', () => {
  beforeEach(() => {
		cy.reload();
	})

  it('Login successfull', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    }).as('login')

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.wait('@login')
    cy.wait('@session')

    cy.url().should('include', '/sessions')
  })

  it('Login error', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401
    }).as('error')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.wait('@error')

    cy.get('.error').should('contain.text', 'An error occurred')
  })

  it('Login bad fields', () => {
    cy.visit('/login')

    cy.get('input[formControlName=email]').type("bad")
    cy.get('input[formControlName=password]').type(`${"bad"}`)

    cy.get('button[type=submit]').should('be.disabled')
  })
});