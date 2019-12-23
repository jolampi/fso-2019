/* eslint-disable no-undef */

describe('Blog app', function() {
    beforeEach(function() {
        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function() {
        cy.contains('blogs')
    })

    it('first login form is displayed and user can sign in', function() {
        cy.contains('Log in to application')
        cy.get('[data-cy=username]').type('superroot')
        cy.get('[data-cy=password]').type('hunter2')
        cy.get('[data-cy=submit]').click()
        cy.contains('Andrew Mitkins logged in')
    })

    describe('when logged in', function() {
        beforeEach(function() {
            cy.get('[data-cy=username]').type('superroot')
            cy.get('[data-cy=password]').type('hunter2')
            cy.get('[data-cy=submit]').click()
        })

        it('can log out', function() {
            cy.get('[data-cy=logout]').click()
            cy.contains('Log in to application')
        })
    })
})
