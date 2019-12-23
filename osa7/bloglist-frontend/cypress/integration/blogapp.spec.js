/* eslint-disable no-undef */

describe('Blog app', function() {
    const testUser = {
        username: 'rootb',
        password: 'passw0rd',
        name: 'Root Bear'
    }

    const testBlog = {
        title: 'End-to-End testing with Cypress',
        author: 'Steve Fuller',
        url: 'https://medium.com/better-practices/end-to-end-testing-with-cypress-bfcd59633f1a'
    }

    const login = function() {
        cy.get('[data-cy=username]').type(testUser.username)
        cy.get('[data-cy=password]').type(testUser.password)
        cy.get('[data-cy=submit]').click()
    }

    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users/', testUser)
        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function() {
        cy.contains('blogs')
    })

    it('first login form is displayed and user can sign in', function() {
        cy.contains('Log in to application')
        login()
        cy.contains(`${testUser.name} logged in`)
    })

    describe('when logged in', function() {
        beforeEach(function() { login() })

        it('can log out', function() {
            cy.get('[data-cy=logout]').click()
            cy.contains('Log in to application')
        })

        it('can create valid new blog', function() {
            cy.contains('create new')
            cy.contains('new blog').click()
            cy.get('[data-cy=blogTitle]').type(testBlog.title)
            cy.get('[data-cy=blogAuthor]').type(testBlog.author)
            cy.get('[data-cy=blogUrl]').type(testBlog.url)
            cy.get('[data-cy=submit]').click()
            cy.contains(testBlog.title)
        })
    })
})
