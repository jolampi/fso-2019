import React from 'react'
import { render } from '@testing-library/react'

import User from './User'

const testBlogs = [
    {
        id: 'blog001',
        title: 'Kids can\'t use computers... and this is why it should worry you',
        author: 'Marc Scott',
        url: 'http://www.coding2learn.org/blog/2013/07/29/kids-cant-use-computers/'
    },
    {
        id: 'blog002',
        title: 'Computer Games Are A Waste Of Time',
        author: 'Matc Scott',
        url: 'http://coding2learn.org/blog/2014/05/18/computer-games-are-a-waste-of-time/'
    }
]

const testUser = {
    id: 'user001',
    name: 'Jaded Programmer',
    blogs: testBlogs
}

describe('<User />', () => {
    let container

    beforeEach(() => {
        const component = render(<User user={testUser} />)
        container = component.container
    })

    test('User is properly structured', () => {
        const userContainer = container.querySelectorAll('.user')
        expect(userContainer.length).toBe(1)

        const blogList = container.querySelectorAll('ul')
        expect(blogList.length).toBe(1)

        const blogs = container.querySelectorAll('li')
        expect(blogs.length).toBe(testBlogs.length)
    })

    test('User\'s details are properly rendered', () => {
        const userContainer = container.querySelector('.user')
        expect(userContainer).toHaveTextContent(testUser.name)

        const blogList = container.querySelector('ul')
        testBlogs.forEach(blog => {
            expect(blogList).toHaveTextContent(blog.title)
        })
    })

})
