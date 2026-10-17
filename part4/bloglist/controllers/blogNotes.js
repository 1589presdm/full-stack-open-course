const blogsRouter = require('express').Router()
const Blog = require('../models/blogNote')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const user = await User.findById(body.userId)
    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
  catch (error) { next(error) }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true, context: 'query' })
    if (updatedBlog) {
      response.json(updatedBlog)
    }
    else {
      response.status(400).end()
    }
  }
  catch (error) { next(error) }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (deletedBlog) {
      response.status(204).end()
    }
    else {
      response.status(404).end()
    }
  }
  catch (error) { next(error) }
})

module.exports = blogsRouter