import '../support/commands'

describe('Session spec', () => {
	const sessions = [
		{
			id: 1,
			name: 'test_1',
			description: 'test',
			date: new Date,
			teacher_id: 1,
			users: [1],
			createdAt: new Date,
			updatedAt: new Date
		},
		{
			id: 1,
			name: 'test_2',
			description: 'test',
			date: new Date,
			teacher_id: 1,
			users: [1],
			createdAt: new Date,
			updatedAt: new Date
		}
	]

	beforeEach(() => {
		cy.reload();
	})

	it('Should display a session', () => {
		cy.intercept(
			{
				method: 'GET',
				url: '/api/session',
			},
			sessions
			).as('sessions')
			
		cy.intercept(
			{
				method: 'GET',
				url: '/api/session/1',
			},
			sessions[0]
			).as('session')

		cy.intercept(
			{
				method: 'GET',
				url: '/api/teacher/1',
			},
			{
				id: 1,
				lastName: 'string',
				firstName: 'string',
				createdAt: new Date,
				updatedAt: new Date
			}).as('teacher')

		cy.loginAdmin(false)

		cy.wait('@sessions')

		cy.get("button[routerLink='create']").should('be.visible')

		cy.get(".item button").then((buttons) => {
			buttons[0].click()
		})

		cy.wait('@session')
		cy.wait('@teacher')

		cy.get("[data-testid='name']").should('contain', 'Test_1')
		cy.get("[data-testid='delete']").should('contain', 'delete')
	})

	it('Should update a session', () => {
		cy.intercept(
			{
				method: 'GET',
				url: '/api/session',
			},
			sessions
			).as('sessions')
			
		cy.intercept(
			{
				method: 'GET',
				url: '/api/session/1',
			},
			sessions[0]
			).as('session')

		cy.intercept(
			{
				method: 'GET',
				url: '/api/teacher',
			},
			[{
				id: 1,
				lastName: 'string',
				firstName: 'string',
				createdAt: new Date,
				updatedAt: new Date
			}]).as('teacher')

		cy.intercept(
			{
				method: 'PUT',
				url: '/api/session/1',
			},
			{ }).as('update')

		cy.loginAdmin(false)

		cy.wait('@sessions')

		cy.get("button[routerLink='create']").should('be.visible')

		cy.get(".item button").then((buttons) => {
			buttons[1].click()
		})

		cy.wait('@session')
		cy.wait('@teacher')

		cy.get(".mat-card-title div h1").should('contain', 'Update session')

		cy.get("input[data-testid='name']").should('contain.value', 'test_1').type('toto')
		cy.get("textarea[data-testid='desc']").should('contain.value', 'test').type('tata')

		cy.get(".mat-card-content button").click()

		cy.wait('@update')

		cy.url().should('contain', 'sessions')
	})


	it('Should create a session', () => {
		cy.intercept(
			{
				method: 'GET',
				url: '/api/session',
			},
			sessions
			).as('sessions')

		cy.intercept(
			{
				method: 'GET',
				url: '/api/teacher',
			},
			[{
				id: 1,
				lastName: 'titi',
				firstName: 'titi',
				createdAt: new Date,
				updatedAt: new Date
			}]).as('teacher')

		cy.intercept(
			{
				method: 'POST',
				url: '/api/session',
			},
			{ }).as('create')
			

		cy.loginAdmin(false)

		cy.wait('@sessions')

		cy.get("button[routerLink='create']").should('be.visible').click()

		cy.wait('@teacher')

		cy.get(".mat-card-title div h1").should('contain', 'Create session')

		cy.get("[data-testid='name']").type('toto')
		cy.get("[data-testid='desc']").type('tata')
		cy.get("[data-testid='options']").first().dblclick()
		cy.get("[data-testid='date']").type('2024-10-01')

		cy.get(".mat-card-content button").click()

		cy.wait('@create')

		cy.url().should('contain', 'sessions')
	})
});