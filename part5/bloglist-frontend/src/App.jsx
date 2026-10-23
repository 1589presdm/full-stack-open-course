import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { setToken } from './utils/token'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessfulMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

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

  const likeHandler = async (id) => {
    const blogToUpdate = blogs.find(b => b.id === id)
    const updatedBlog = {...blogToUpdate, user: blogToUpdate.user.id, likes: blogToUpdate.likes + 1}
    const returnedBlog = await blogService.update(id, updatedBlog)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
  }

  const removeHandler = async (id) => {
    const blogToDelete = blogs.find(b => b.id === id)
    
    if(window.confirm(`Do you want to delete ${blogToDelete.title} from bloglist?`)){
      await blogService.remove(blogToDelete.id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setSuccessfulMessage(`${blogToDelete.title} by ${blogToDelete.author} was deleted successfully`)
      setTimeout(() => {
        setSuccessfulMessage(null)
    }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
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
          <LoginForm login={login} />
        </div>
      )}

      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <h2>Blogs</h2>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>(
            <Blog key={blog.id} blog={blog} like={likeHandler} remove={removeHandler}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default App