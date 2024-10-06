/// <reference types="cypress" />

// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    loginUser(captureSessions: Boolean): void;
    loginAdmin(captureSessions: Boolean): void;
  }
}
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

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

Cypress.Commands.add('loginUser', (captureSessions: Boolean = true) => {
    cy.intercept('POST', '/api/auth/login', {
        body: {
            id: 1,
            username: 'userName',
            firstName: 'firstName',
            lastName: 'lastName',
            admin: false
        },
    }).as('login')

    if(captureSessions) {
        cy.intercept(
        {
            method: 'GET',
            url: '/api/session',
        },
        sessions).as('session')
    }

    cy.visit('/login')
    
    cy.get('input[formControlName=email]').type("test@test.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    
    cy.wait('@login')

    if(captureSessions) {
        cy.wait('@session')
        cy.url().should('include', '/sessions')
    }
})

Cypress.Commands.add('loginAdmin', (captureSessions: Boolean = true) => {
    cy.intercept('POST', '/api/auth/login', {
        body: {
            id: 1,
            username: 'userName',
            firstName: 'firstName',
            lastName: 'lastName',
            admin: true
        },
    }).as('login')

    if(captureSessions) {
        cy.intercept(
        {
            method: 'GET',
            url: '/api/session',
        },
        sessions).as('session')
    }

    cy.visit('/login')

    cy.get('input[formControlName=email]').type("test@test.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.wait('@login')

    if(captureSessions) {
        cy.wait('@session')
        cy.url().should('include', '/sessions')
    }
})