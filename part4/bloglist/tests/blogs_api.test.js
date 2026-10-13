const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blogNote')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(initialBlogs)

    /*let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()*/
})

test('returns the correct amount of blog posts', async () => {
    const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 6)

})

test('verifies the unique identifier property', async () => {
    const response = await api.get('/api/blogs/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blog = response.body[0]

    assert.notStrictEqual(blog.id, undefined)
    assert.strictEqual(blog._id, undefined)
})

test('making an HTTP POST request', async () => {
    const oldBlogsList = initialBlogs.length
    const newBlog = {
        title: "New Blog",
        author: "Me",
        url: "https://newblog.com",
        likes: 13,
    }
    const response = await api.post('/api/blogs/').send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const updatedBlogsList = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(updatedBlogsList.body.length, oldBlogsList + 1)

    const titels = updatedBlogsList.body.map(x => x.title)
    assert.ok(titels.includes('New Blog'))
})

/*test('making an HTTP POST request', () => {
    const oldBlogsList = initialBlogs.length
    const newBlog = {
        title: "New Blog",
        author: "Me",
        url: "https://newblog.com",
        likes: 13,
    }

    return api.post('/api/blogs/').send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .then(() => {
            return api.get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        }).then(res => {
            assert.strictEqual(res.body.length, oldBlogsList+1)
            const title = res.body.map(x => x.title)
            assert.ok(title.includes('New Blog'))
        })
})*/

test('default like-property is zero', async() => {
    const newBlog = {
        title: "New Blog",
        author: "Me",
        url: "https://newblog.com"
    }
    const response = await api.post('/api/blogs').send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
})

test('status code 400 if url property is missing', () => {
    const newBlog = {
        title: "New Blog",
        author: "Me",
        likes: 13,
    }

    return api.post('/api/blogs/').send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test.only('status code 400 if title property is missing', async() => {
    const newBlog = {
        author: "Me",
        url: "https://newblog.com",
        likes: 13,
    }

    await api.post('/api/blogs').send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})