import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { setToken } from './utils/token'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')


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

  const handleCreator = async event => {
    event.preventDefault()

    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
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

  const createForm = () => (
    <form onSubmit={handleCreator}>
      <div>
        <label>
          title: <input type='text'
          value={newTitle}
          onChange={({target}) => setNewTitle(target.value)}/>
        </label>
      </div>
      <div>
        <label>
          author: <input type='text'
          value={newAuthor}
          onChange={({target}) => setNewAuthor(target.value)}/>
        </label>
      </div>
      <div>
        <label>
          url: <input type='text'
          value={newUrl}
          onChange={({target}) => setNewUrl(target.value)}/>
        </label>
      </div>
      <button type='submit'>create</button>
    </form>
  )


  return (
    <div>

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
          <h2>create new blog</h2>
          {createForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
          
        </div>
      )}
    </div>
  )
}

export default App