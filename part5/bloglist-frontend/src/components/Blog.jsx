import { useParams } from 'react-router-dom'

const Blog = ({ blogs, like, remove, userId }) => {
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if(!blog) {
    return <div>Blog not found or loading...</div>
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>{blog.title} {blog.author}</div>
      <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          {userId && (<button onClick={() => like(blog.id)}>like</button>)}
        </div>
        {userId && blog.user?.id === userId && (<div>
          <button onClick={() => remove(blog.id)}>delete</button>
        </div>)}
      </div>
    </div>
  )
}

export default Blog