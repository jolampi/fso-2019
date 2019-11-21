
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

module.exports = {
    dummy,
    favouriteBlog,
    totalLikes
}
