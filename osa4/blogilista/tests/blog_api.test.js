const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const mongoose = require('mongoose')

const Blog = require('../models/blog')

const newBlog = {
    title: 'new blog',
    author: 'John Doe',
}

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

test('a valid blog can be added', async () => {
    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const authors = blogsAtEnd.map(n => n.author)
    expect(authors).toContain('John Doe')

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain('new blog')
})

test('likes are set to 0 if not defined', async () => {
    await api
        .post('/api/blogs')
        .send(newBlog)

    const blogsAtEnd = await helper.blogsInDb()
    const postedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
    expect(postedBlog.likes).toBeDefined()
    expect(postedBlog.likes).toBe(0)
})

test('invalid blog is not added', async () => {
    const noTitle = {
        url: 'secret',
    }
    const noUrl = {
        title: 'secret',
    }

    await api
        .post('/api/blogs')
        .send(noTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(noUrl)
        .expect(400)
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

afterAll(() => {
    mongoose.connection.close()
})
