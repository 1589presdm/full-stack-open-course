import {render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { expect } from 'vitest'

test('displaying the blog title and author', () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    }

    const {container} = render(<Blog blog={blog} />)

    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent('React patterns')
    expect(div).toHaveTextContent('Michael Chan')

    expect(div).not.toHaveTextContent('https://reactpatterns.com/')
    expect(div).not.toHaveTextContent('7')
})

test('the blog URL and likes are shown when the button was clicked', async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    }

    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText("https://reactpatterns.com/")
    expect(urlElement).toBeDefined()

    const likesElement = screen.getByText(/7/)
    expect(likesElement).toBeDefined()
})

test('if the like button is clicked twice, the event handler is called twice', async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} like={mockHandler} />)

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const button = screen.getByText('like')

    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('new blog form', async () => {
    
    const mockHandler = vi.fn()

    render(<BlogForm createBlog={mockHandler} />)

    const user = userEvent.setup()

    const inputTitle = screen.getByRole('textbox', {name: 'title:'})
    await user.type(inputTitle, "How to add a new blog")

    const inputAuthor = screen.getByRole('textbox', {name: 'author:'})
    await user.type(inputAuthor, "Me")

    const inputUrl = screen.getByRole('textbox', {name: 'url:'})
    await user.type(inputUrl, "https://bloglist.com/")

    const createButton = screen.getByText('create')
    await user.click(createButton)

    expect(mockHandler.mock.calls[0][0]).toEqual({
        title: "How to add a new blog",
        author: "Me",
        url: "https://bloglist.com/"
    })

})