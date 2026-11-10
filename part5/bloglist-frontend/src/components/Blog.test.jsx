import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, vi } from 'vitest'
import BlogForm from './BlogForm'


test('the number of likes are displayed to unauthenticated users, buttons are not displayed', () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    }

    render(
        <MemoryRouter initialEntries={['/blogs/123']}>
            <Routes>
                <Route path='/blogs/:id' element={<Blog blogs={[{ ...blog, id: '123' }]} />} />
            </Routes>
        </MemoryRouter>
    )

    const title = screen.getByText("React patterns")
    expect(title).toBeDefined()
    const author = screen.getByText("by Michael Chan")
    expect(author).toBeDefined()
    const url = screen.getByText("https://reactpatterns.com/")
    expect(url).toBeDefined()
    const likesElement = screen.getByText(/Likes: 7/)
    expect(likesElement).toBeDefined()
    expect(screen.queryByRole('button')).toBeNull()

})

test('the not blog creator are shown only the like button', () => {
    const userId = 'predm'

    const blog = {
        id: "123",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: { id: 'kuku' }
    }

    render(
        <MemoryRouter initialEntries={['/blogs/123']}>
            <Routes>
                <Route path='/blogs/:id' element={<Blog blogs={[blog]} userId={userId}/>} />
            </Routes>
        </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'delete' })).toBeNull()

})

test('the blog creator is also shown the delete button', () => {
    const userId = 'predm'
    const blog = {
        id: "123",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: { id: 'predm' }
    }

    render (
        <MemoryRouter initialEntries={['/blogs/123']}>
            <Routes>
                <Route path='/blogs/:id' element={<Blog blogs={[blog]} userId={userId}/>} />
            </Routes>
        </MemoryRouter>
    )

    expect(screen.getByRole('button', {name: 'Remove'})).toBeDefined()
})

test('creator can delete their blog', async() => {
    const user = userEvent.setup()
    const mockRemove = vi.fn()

    const blog = {
        id: "123",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: { id: 'predm' }
    }

    render(
        <MemoryRouter initialEntries={['/blogs/123']}>
            <Routes>
                <Route path='/blogs/:id' element={<Blog blogs={[blog]} userId='predm' remove={mockRemove}/>} />
            </Routes>
        </MemoryRouter>
    )
    
    const deleteButton = screen.getByRole('button', { name: 'Remove' })
    await user.click(deleteButton)

    expect(mockRemove).toHaveBeenCalledTimes(1)
    expect(mockRemove).toHaveBeenCalledWith('123')
})

test('creating blog calls createBlog with correct data', async () =>{
    const user = userEvent.setup()
    const mockCreate = vi.fn()

    render(<BlogForm createBlog={mockCreate}/>)

    await user.type(screen.getByLabelText('title'), 'React patterns')
    await user.type(screen.getByLabelText('author'), 'Michael Chan')
    await user.type(screen.getByLabelText('url'), 'https://reactpatterns.com/')

    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockCreate).toHaveBeenCalledWith({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/'
    })
})