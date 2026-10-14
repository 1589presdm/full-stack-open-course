const blogsRouter = require('express').Router()
const Blog = require('../models/blogNote')


blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  blog.save().then((result) => {
    response.status(201).json(result)
  })
    .catch(error => next(error))
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
    if(deletedBlog) {
      response.status(204).end()
    }
    else {
      response.status(404).end()
    }
  }
  catch (error) { next(error) }
})

module.exports = blogsRouter