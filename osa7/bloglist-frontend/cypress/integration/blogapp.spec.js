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

    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users/', testUser)
        cy.visit('http://localhost:3000')
    })

    it('first login form is displayed and user can sign in', function() {
        cy.contains('Log in to application')
        cy.get('[data-cy=username]').type(testUser.username)
        cy.get('[data-cy=password]').type(testUser.password)
        cy.get('[data-cy=submit]').click()
        cy.contains(`${testUser.name} logged in`)
    })

    describe('when logged in', function() {
        const comment = 'Didn\'t actually read the article, just picked it because of context'

        beforeEach(function() {
            cy.server()
            cy.request('POST', 'http://localhost:3003/api/login', {
                username: testUser.username,
                password: testUser.password
            }).then (function(response) {
                window.localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
                cy.reload()
            })
        })

        it('can create valid new blog and operate relevant functions', function() {
            cy.server()
            cy.route({ method: 'POST', url: 'blogs' }).as('postBlog')
            cy.route({ method: 'POST', url: 'comments' }).as('postComment')

            cy.contains('new blog').click()
            cy.contains('create new')
            cy.get('[data-cy=blogTitle]').type(testBlog.title)
            cy.get('[data-cy=blogAuthor]').type(testBlog.author)
            cy.get('[data-cy=blogUrl]').type(testBlog.url)
            cy.get('[data-cy=submit]').click()

            cy.wait('@postBlog')
            cy.get('.blogItem').get('.header').contains(testBlog.title).click()
            cy.contains('0 likes')
            cy.get('[data-cy=like]').click()
            cy.contains('1 likes')

            cy.get('[data-cy=commentField]').type(comment)
            cy.get('[data-cy=commentSubmit]').click()
            cy.wait('@postComment')
            cy.contains(comment)
        })
    })
})
