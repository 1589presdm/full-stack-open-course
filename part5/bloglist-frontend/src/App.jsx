import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { setToken } from './utils/token'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Bloglist from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessfulMessage] = useState(null)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

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
    navigate("/")
  }

  const login = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setToken(user.token)
      setUser(user)
      navigate("/")
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
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    const returnedBlog = await blogService.update(id, updatedBlog)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
  }

  const removeHandler = async (id) => {
    const blogToDelete = blogs.find(b => b.id === id)

    if (window.confirm(`Do you want to delete ${blogToDelete.title} from bloglist?`)) {
      try {
        await blogService.remove(blogToDelete.id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setSuccessfulMessage(`${blogToDelete.title} by ${blogToDelete.author} was deleted successfully`)
        setTimeout(() => {
          setSuccessfulMessage(null)
        }, 5000)
        navigate("/")
      } catch (error) {
        setErrorMessage('you are not allowed to delete this blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
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

  const padding = {padding: 5}

  return (
    <>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {!user && (<Link style={padding} to="/login">login</Link>)}
        {user && (<button onClick={handleLogout}>logout</button>)}
      </div>

      <Routes>
        <Route path="/login" element={<LoginForm login={login} />} />
        <Route path="/" element={<Bloglist blogs={blogs} />} />
        <Route path="/blogs/:id" element={<Blog blogs={blogs} like={likeHandler} remove={removeHandler} userId={user?.id} />} />
      </Routes>
      <div>
        <Notification message={successMessage || errorMessage}
          type={errorMessage ? 'error' : 'success'} />
      </div>
      

      {user && (
        <div>
          <p>{user.name} logged in</p>
          
          <h2>Blogs</h2>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}
    </>
  )
}

export default App