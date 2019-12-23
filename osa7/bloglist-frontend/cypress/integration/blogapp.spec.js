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

    before(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users/', testUser)
    })

    describe('login page', function() {
        beforeEach(function() {
            cy.visit('http://localhost:3000')
        })

        it('cannot login with invalid credentials', function() {
            cy.contains('Log in to application')

            cy.get('[data-cy=submit]').click()
            cy.get('[data-cy=errorNotification]').should('exist')

            cy.get('[data-cy=username]').type(testUser.username)
            cy.get('[data-cy=submit]').click()
            cy.get('[data-cy=errorNotification]').should('exist')

            cy.get('[data-cy=password]').type('asdf')
            cy.get('[data-cy=submit]').click()
            cy.get('[data-cy=errorNotification]').should('exist')
        })

        it('can login when credentials are valid', function() {
            cy.contains('Log in to application')

            cy.get('[data-cy=username]').type(testUser.username)
            cy.get('[data-cy=password]').type(testUser.password)
            cy.get('[data-cy=submit]').click()
            cy.get('[data-cy=successNotification]').should('exist')
            cy.contains(`${testUser.name} logged in`)
        })
    })

    describe('when logged in', function() {
        const comment = 'Didn\'t actually read the article, just picked it because of context'

        before(function() {
            cy.request('POST', 'http://localhost:3003/api/testing/reset/blogs')
        })

        beforeEach(function() {
            cy.server()
            cy.route({ method: 'POST', url: 'blogs' }).as('postBlog')
            cy.route({ method: 'POST', url: 'comments' }).as('postComment')

            cy.request('POST', 'http://localhost:3003/api/login', {
                username: testUser.username,
                password: testUser.password
            }).then (function(response) {
                window.localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
            })
            cy.visit('http://localhost:3000')
        })

        describe('creating new blog', function() {
            before(function() {
                cy.server()
                cy.route({ method: 'POST', url: '/blogs' }).as('postBlog')
                cy.route({ method: 'POST', url: '/comments' }).as('postComment')
            })

            beforeEach(function() {
                cy.contains('new blog').click()
            })

            it('cannot create new blog when title or url is missing', function() {
                cy.get('[data-cy=submit]').click()
                cy.wait('@postBlog')
                cy.get('[data-cy=errorNotification]').should('exist')

                cy.get('[data-cy=blogTitle]').type('need url')
                cy.get('[data-cy=submit]').click()
                cy.wait('@postBlog')
                cy.get('[data-cy=errorNotification]').should('exist')

                cy.get('[data-cy=blogTitle]').clear()
                cy.get('[data-cy=blogUrl]').type('need title')
                cy.get('[data-cy=submit]').click()
                cy.wait('@postBlog')
                cy.get('[data-cy=errorNotification]').should('exist')
            })

            it('can create new blog when title and url are entered', function() {
                cy.get('[data-cy=blogTitle]').type(testBlog.title)
                cy.get('[data-cy=blogAuthor]').type(testBlog.author)
                cy.get('[data-cy=blogUrl]').type(testBlog.url)
                cy.get('[data-cy=submit]').click()
                cy.wait('@postBlog')
                cy.get('[data-cy=successNotification]').should('exist')

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

        /* describe('when a blog is created', function() {
            beforeEach(function() {
                cy.request('POST', 'http://localhost:3003/api/testing/reset/blogs')
                //const token = JSON.parse(window.localStorage.getItem('loggedBlogappUser')).token
                //const wtf = ` ${token}`
                // const first = token.substring(1)
                // const second = token.substring(4)
                // console.log(first, second, token)
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:3003/api/blogs',
                    body: testBlog,
                    auth: {
                        bearer: `${token}`,
                        sendImmediately: false
                    }
                    //headers: { authorization: `Bearer ${token}` }
                    //auth: { bearer: wtf }
                    //headers: { authorization: `bearer ${token}`
                    //options: { headers: { Authorization: `bearer ${token}` } },
                    //options: { auth: { bearer: `bearer ${token}` } },
                })
                cy.request('POST', 'http://localhost:3003/api/blogs', )
                cy.server()
                cy.route({ method: 'POST', url: '/comments' }).as('postComment')
            })

            it('got this right?', function() {
                cy.get('.blogItem').get('.header').contains(testBlog.title).click()
                cy.contains('0 likes')
                cy.get('[data-cy=like]').click()
                cy.contains('1 likes')
            })
        }) */
    })
})
