import { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')


  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <>
      <Typography variant='h4' component='h2'>Create new blog</Typography>
      <Box component='form' onSubmit={addBlog}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: 150,
          mt: 3
        }}>
        <TextField
          label='title'
          type='text'
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)} />

        <TextField
          label='author'
          type='text'
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)} />

        <TextField
          label='url'
          type='text'
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)} />

        <Button type='submit' variant='contained'>Create</Button>
      </Box>
    </>


  )
}

export default BlogForm