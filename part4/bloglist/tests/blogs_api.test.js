const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test.only('returns the correct amount of blog posts', () => {
    return api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then((response) => {
            const expectedLength = 0
            const actualLength = response.body.length
            if(actualLength !== expectedLength) {
                throw new Error()
            }
        })
})

after(async () => {
  await mongoose.connection.close()
})