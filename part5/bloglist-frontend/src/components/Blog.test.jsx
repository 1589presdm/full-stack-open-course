import {render, screen } from '@testing-library/react'
import Blog from './Blog'

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
