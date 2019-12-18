import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

const blog = {
    title: 'Testing React components with jest',
    author: 'Aristoteles',
    url: 'cs.ancient-greece-software.org/blogs/1337/',
    likes: 13,
    user: {
        id: 'abcd1234',
        name: 'batman'
    }
}

describe('<Blog />', () => {
    let component
    let titleDiv, detailsDiv

    beforeEach(() => {
        component = render(
            <Blog
                blog={blog}
                isOwner={true}
                incrementLikes={() => {}}
                removeBlog={() => {}}
            />
        )
        titleDiv = component.container.querySelector('.blogTitle')
        detailsDiv = component.container.querySelector('.blogDetails')
    })

    test('a blog\'s title division only has title and author', () => {
        expect(titleDiv).toHaveTextContent(blog.title)
        expect(titleDiv).toHaveTextContent(blog.author)
        expect(titleDiv).not.toHaveTextContent(blog.url)
        expect(titleDiv).not.toHaveTextContent(blog.likes)
        expect(titleDiv).not.toHaveTextContent(blog.user.name)
        expect(titleDiv).not.toHaveTextContent(blog.user.id)
    })

    test('a blog\'s details division only has url, likes and added user\'s name', () => {
        expect(detailsDiv).not.toHaveTextContent(blog.title)
        expect(detailsDiv).not.toHaveTextContent(blog.author)
        expect(detailsDiv).toHaveTextContent(blog.url)
        expect(detailsDiv).toHaveTextContent(blog.likes)
        expect(detailsDiv).toHaveTextContent(blog.user.name)
        expect(detailsDiv).not.toHaveTextContent(blog.user.id)
    })

    test('at start only title and author are displayed', () => {
        expect(titleDiv).not.toHaveStyle('display: none')
        expect(detailsDiv).toHaveStyle('display: none')
    })

    test('clicking the blog toggles the visibility of other details', () => {
        fireEvent.click(titleDiv)
        expect(titleDiv).not.toHaveStyle('display: none')
        expect(detailsDiv).not.toHaveStyle('display: none')

        fireEvent.click(titleDiv)
        expect(titleDiv).not.toHaveStyle('display: none')
        expect(detailsDiv).toHaveStyle('display: none')
    })
})
