import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

const blog = {
    title: 'Testing React components with jest',
    author: 'Aristoteles',
    url: 'cs.ancient-greece-software.org/blogs/1337/',
    likes: 13
}

describe('<SimpleBlog />', () => {
    let component
    let mockOnClick

    beforeEach(() => {
        mockOnClick = jest.fn()
        component = render(
            <SimpleBlog blog={blog} onClick={mockOnClick} />
        )
    })

    test('Blog information is rendered', () => {
        const div = component.container.querySelector('.simpleBlog')
        expect(div).toHaveTextContent(blog.title)
        expect(div).toHaveTextContent(blog.author)
        expect(div).toHaveTextContent(blog.likes)
    })

    test('When like button is pressed twice, given event handler is called both times', () => {
        expect(mockOnClick.mock.calls.length).toBe(0)

        const likeButton = component.getByText('like')
        fireEvent.click(likeButton)
        expect(mockOnClick.mock.calls.length).toBe(1)

        fireEvent.click(likeButton)
        expect(mockOnClick.mock.calls.length).toBe(2)
    })
})
