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

const mostBlogs = (blogs) => {
    if (blogs.length === 0) { return undefined }
    let authors = []
    blogs.forEach(blog => {
        if (!authors[blog.author]) { authors[blog.author] = 0 }
        authors[blog.author] += 1
    })
    let biggest = 0
    let biggestName = ''
    for (const [key, value] of Object.entries(authors)) {
        console.log('I am stupid javascript also', biggest, '>', value)
        if (parseInt(value) > parseInt(biggest)) {
            biggestName = key
            biggest = value
        }
    }
    return { author: biggestName, blogs: biggest }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) { return undefined }
    let authors = []
    blogs.forEach(blog => {
        if (!authors[blog.author]) { authors[blog.author] = 0 }
        authors[blog.author] += blog.likes
    })
    let biggest = 0
    let biggestName = ''
    for (const [key, value] of Object.entries(authors)) {
        console.log('I am stupid javascript also', biggest, '>', value)
        if (parseInt(value) > parseInt(biggest)) {
            biggestName = key
            biggest = value
        }
    }
    return { author: biggestName, likes: biggest }
}

module.exports = {
    dummy,
    favouriteBlog,
    totalLikes,
    mostBlogs,
    mostLikes
}
