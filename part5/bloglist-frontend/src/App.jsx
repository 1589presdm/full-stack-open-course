import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { setToken } from './utils/token'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessfulMessage] = useState(null)
  const [user, setUser] = useState(null)



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

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setSuccessfulMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added.`)
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
          {loginForm()}
        </div>
      )}

      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <h2>Blogs</h2>
          <BlogForm createBlog={addBlog} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}

        </div>
      )}
    </div>
  )
}

export default App