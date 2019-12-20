import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

const testBlog = {
    title: 'Testing React components with jest',
    author: 'Aristoteles',
    url: 'cs.ancient-greece-software.org/blogs/1337/',
    likes: 12345,
    user: {
        id: 'abcd1234',
        name: 'batman'
    }
}

describe('<Blog />', () => {
    let mockHandleLike, mockHandleRemove

    beforeEach(() => {
        mockHandleLike = jest.fn()
        mockHandleRemove = jest.fn()
    })

    test('a blog is properly structured', () => {
        const component = render(
            <Blog
                blog={testBlog}
                isRemovable={true}
                onLike={mockHandleLike}
                onRemove={mockHandleRemove}
            />)
        const container = component.container

        const blogContainer = container.querySelectorAll('.blog')
        expect(blogContainer.length).toBe(1)

        const likeButtonContainer = container.querySelectorAll('.blogLikeButton')
        expect(likeButtonContainer.length).toBe(1)

        const removeButtonContainer = container.querySelectorAll('.blogRemoveButton')
        expect(removeButtonContainer.length).toBe(1)
    })

    test('a blog\'s details are rendered correctly', () => {
        const component = render(<Blog blog={testBlog} />)
        const container = component.container

        expect(container).toHaveTextContent(testBlog.title)
        expect(container).toHaveTextContent(testBlog.author)
        expect(container).toHaveTextContent(testBlog.url)
        expect(container).toHaveTextContent(testBlog.likes)
        expect(container).toHaveTextContent(testBlog.user.name)
    })

    test('pressing the like button will trigger the right event', () => {
        const component = render (<Blog blog={testBlog} onLike={mockHandleLike} />)

        const likeButton = component.container.querySelector('.blogLikeButton')
        expect(mockHandleLike.mock.calls.length).toBe(0)
        expect(mockHandleRemove.mock.calls.length).toBe(0)

        fireEvent.click(likeButton)
        expect(mockHandleLike.mock.calls.length).toBe(1)
        expect(mockHandleRemove.mock.calls.length).toBe(0)
    })

    test('by default, remove button is not visible', () => {
        const component = render (<Blog blog={testBlog} />)

        const removeButton = component.container.querySelector('.blogRemoveButton')
        expect(removeButton).toHaveStyle('display: none')
    })

    test('when visible, clicking the remove button will trigger the right event', () => {
        const component = render(
            <Blog blog={testBlog} isRemovable={true} onRemove={mockHandleRemove} />
        )

        const removeButton = component.container.querySelector('.blogRemoveButton')
        expect(removeButton).not.toHaveStyle('display: none')
        expect(mockHandleLike.mock.calls.length).toBe(0)
        expect(mockHandleRemove.mock.calls.length).toBe(0)

        fireEvent.click(removeButton)
        expect(mockHandleLike.mock.calls.length).toBe(0)
        expect(mockHandleRemove.mock.calls.length).toBe(1)
    })
})
