import { useState, useEffect } from 'react'
import {
  Routes, Route, Link,
  useNavigate, Navigate
} from 'react-router-dom'
import { AppBar, Toolbar, Button } from '@mui/material'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { setToken } from './utils/token'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Bloglist from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessfulMessage] = useState(null)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

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
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setSuccessfulMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setSuccessfulMessage(null)
    }, 5000)
    navigate("/")
  }

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Button color='inherit' component={Link} to="/">Blogs</Button>
          {!user && (<Button color='inherit' component={Link} to="/login">LogIn</Button>)}
          {user && (<Button color='inherit' component={Link} to="/create">New blog</Button>)}
          {user && (<Button color='inherit' onClick={handleLogout}>LogOut</Button>)}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/login" element={<LoginForm login={login} />} />
        <Route path='/create' element={user ? <BlogForm createBlog={addBlog} /> : <Navigate to="/login" replace />} />
        <Route path="/blogs/:id" element={<Blog blogs={blogs} like={likeHandler} remove={removeHandler} userId={user?.id} />} />
        <Route path="/" element={<Bloglist blogs={blogs} />} />
      </Routes>
      <div>
        <Notification message={successMessage || errorMessage}
          type={errorMessage ? 'error' : 'success'} />
      </div>

    </>
  )
}

export default App