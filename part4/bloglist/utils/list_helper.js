const _ = require('lodash')


const dummy = (blogs) => {
    return 1
}


const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    const blogCount = _.countBy(blogs, 'author')
    const author = _.map(blogCount, (count, name) => ({
        author: name,
        blogs: count
    }))

    return _.maxBy(author, 'blogs')
}


const mostLikes = (blogs) => {
    const grouped = _.groupBy(blogs, 'author')
    const likes = _.map(grouped, (count, name) => ({
        author: name,
        likes: _.sumBy(count, 'likes')
    }))
    
    return _.maxBy(likes, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }