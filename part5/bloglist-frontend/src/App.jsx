import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { setToken } from './utils/token'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessfulMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [blogVisible, setBlogVisible] = useState(false)

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const login = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setToken(user.token)
      setUser(user)
    }
    catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setSuccessfulMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added.`)
    setBlogVisible(false)
    setTimeout(() => {
      setSuccessfulMessage(null)
    }, 5000)
  }

  return (
    <div>
      <Notification message={successMessage || errorMessage}
        type={errorMessage ? 'error' : 'success'} />

      {!user && (
        <div>
          <h2>Log in to application</h2>
          <LoginForm login={login} />
        </div>
      )}

      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <h2>Blogs</h2>
          <div style={hideWhenVisible}>
            <button onClick={() => setBlogVisible(true)}>new blog</button>
          </div>
          <div style={showWhenVisible}>
            <BlogForm createBlog={addBlog} />
            <button onClick={() => setBlogVisible(false)}>cancel</button>
          </div>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App