// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1
}

const favouriteBlog = (blogs) => {
    const reducer = (most, current) => (current.likes > most.likes) ? current : most
    if (blogs.length === 0) { return undefined }
    return blogs.reduce(reducer, blogs[0])
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => sum + item.likes
    return blogs.reduce(reducer, 0)
}

const aggregateAuthors = (authors, blog) => {
    const author = blog.author
    if (!authors.has(author)) { authors.set(author, { author, blogs: 0, likes: 0 }) }
    const entry = authors.get(author)
    authors.set(author, { ...entry, blogs: entry.blogs + 1, likes: entry.likes + blog.likes })
    return authors
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) { return undefined }
    const mostBlogs = Array
        .from(blogs.reduce(aggregateAuthors, new Map()).values())
        .sort((author1, author2) => author2.blogs - author1.blogs)[0]
    return { author: mostBlogs.author, blogs: mostBlogs.blogs }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) { return undefined }
    const mostBlogs = Array
        .from(blogs.reduce(aggregateAuthors, new Map()).values())
        .sort((author1, author2) => author2.likes - author1.likes)[0]
    return { author: mostBlogs.author, likes: mostBlogs.likes }
}

module.exports = {
    dummy,
    favouriteBlog,
    totalLikes,
    mostBlogs,
    mostLikes
}
