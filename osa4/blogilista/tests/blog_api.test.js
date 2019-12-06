const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const mongoose = require('mongoose')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('identifier field is called id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    expect(blog.id).toBeDefined()
    expect(blog._id).not.toBeDefined()
})

test('delete a blog with status code 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)
    expect(blogsAtEnd).not.toContainEqual(blogToDelete)
})

test('a blogs likes can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedLikes = {
        likes: blogToUpdate.likes + 1
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedLikes)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

    expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1)
    expect(updatedBlog.author).toBe(blogToUpdate.author)
})

describe('when there is initially one user at db', () => {
    const rootUser = {
        username: 'root',
        password: 'non-alcoholic bear',
        name: 'Tree Legs'
    }

    const login = async (username, password) => {
        const result = await api
            .post('/api/login')
            .send({ username, password })
        return result.body
    }

    beforeEach(async () => {
        await User.deleteMany({})
        await api
            .post('/api/users')
            .send(rootUser)
    })

    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'newbie360',
            password: 'hunter2',
            name: 'New User'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails when trying to use existing username with proper status and error', async () => {
        const usersAtStart = await helper.usersInDb()

        const result = await api
            .post('/api/users')
            .send(rootUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails with invalid fields', async () => {
        const usersAtStart = await helper.usersInDb()

        let result = await api
            .post('/api/users')
            .send({ name: 'no password', username: 'username' })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('`password` is required')

        result = await api
            .post('/api/users')
            .send({ name: 'too short password', username: 'username', password: 'no' })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('`password`')
        expect(result.body.error).toContain('shorter than the minimum')

        result = await api
            .post('/api/users')
            .send({ name: 'no username', password: 'passw0rd' })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('`username` is required')

        result = await api
            .post('/api/users')
            .send({ name: 'too short username', username: 'ok', password: 'passw0rd' })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('`username`')
        expect(result.body.error).toContain('shorter than the minimum')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    describe('when they have signed in', () => {
        const getToken = async () => {
            const result = await login(rootUser.username, rootUser.password)
            return result.token
        }

        test('a new valid blog can be added', async () => {
            const token = await getToken()

            const blogsAtStart = await helper.blogsInDb()

            const newBlog = {
                title: 'Rust',
                author: 'John Doe',
                url: 'nah',
                likes: 7
            }

            const result = await api
                .post('/api/blogs')
                .auth(token, { type: 'bearer' })
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd.length).toBe(blogsAtStart.length + 1)

            const addedBlog = blogsAtEnd.find(blog => blog.id === result.body.id)
            expect(addedBlog.title).toBe(newBlog.title)
            expect(addedBlog.author).toBe(newBlog.author)
            expect(addedBlog.url).toBe(newBlog.url)
            expect(addedBlog.likes).toBe(newBlog.likes)
        })

        test('a new valid blog\'s likes are set to `0` if not defined', async () => {
            const token = await getToken()

            const newBlog = {
                title: 'How to get likes',
                author: 'Liked author',
                url: 'nah'
            }

            const result = await api
                .post('/api/blogs')
                .auth(token, { type: 'bearer' })
                .send(newBlog)

            const blogsAtEnd = await helper.blogsInDb()
            const addedBlog = blogsAtEnd.find(blog => blog.id === result.body.id)
            expect(addedBlog.likes).toBeDefined()
            expect(addedBlog.likes).toBe(0)
        })

        test('invalid blog is not added', async () => {
            const token = await getToken()
            const blogsAtStart = await helper.blogsInDb()

            let result = await api
                .post('/api/blogs')
                .auth(token, { type: 'bearer' })
                .send({ url: 'no title' })
                .expect(400)
                .expect('Content-Type', /application\/json/)
            expect(result.body.error).toContain('`title` is required')

            result = await api
                .post('/api/blogs')
                .auth(token, { type: 'bearer' })
                .send({ title: 'no url' })
                .expect(400)
                .expect('Content-Type', /application\/json/)
            expect(result.body.error).toContain('`url` is required')

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd.length).toBe(blogsAtStart.length)
        })
    })

})

afterAll(() => {
    mongoose.connection.close()
})
