const listHelper = require('../utils/list_helper')
const blogs = require('./test_blogs')

test('dummy returns one', () => {
    const result = listHelper.dummy(blogs.list_0)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(blogs.list_0)
        expect(result).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(blogs.list_1)
        expect(result).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(blogs.list_n)
        expect(result).toBe(36)
    })
})

describe('favourite blog', () => {
    test('of empty list is undefined', () => {
        const result = listHelper.favouriteBlog(blogs.list_0)
        expect(result).toBeUndefined()
    })

    test('of list with one blog is that', () => {
        const result = listHelper.favouriteBlog(blogs.list_1)
        expect(result).toEqual(blogs.list_1[0])
    })

    test('of bigger list has correct amount of likes', () => {
        const result = listHelper.favouriteBlog(blogs.list_n)
        expect(result.likes).toBe(12)
    })
})
