import React from 'react'
import { Provider } from 'react-redux'
import { render, waitForElement } from '@testing-library/react'
import App from './App'
import store from './store'

const user = {
    username: 'secretAgent007',
    name: 'James Bond',
    token: 'testing123123',
    id: '007'
}

describe('<App />', () => {
    test('if no user logged, notes are not rendered', async () => {
        const component = render(
            <Provider store={store}><App /></Provider>
        )
        //component.rerender(<App />)

        await waitForElement(
            () => component.container.querySelector('.loginForm')
        )

        const loginForm = component.container.querySelector('.loginForm')
        expect(loginForm).toBeDefined()

        const blogs = component.container.querySelector('.blogs')
        expect(blogs).toBeFalsy()
    })

    test('If user is logged in, notes are rendered', async () => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
        const component = render(
            <Provider store={store}><App /></Provider>
        )
        //component.rerender(<App />)

        await waitForElement(
            () => component.getByText('blogs')
        )

        const blogs = component.container.querySelectorAll('.blogItem')
        expect(blogs.length).toBe(3)
    })
})
