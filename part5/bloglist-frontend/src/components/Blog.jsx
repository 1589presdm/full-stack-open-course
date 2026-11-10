import { useParams } from 'react-router-dom'
import { Paper, Typography, Button, Box } from '@mui/material'

const Blog = ({ blogs, like, remove, userId }) => {
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return <div>Blog not found or loading...</div>
  }

  return (
    <Paper elevation={3} className='blog' sx={{ p: 3, mt: 3, maxWidth: 600, borderRadius: 2 }}>
      <Typography variant='h4' component='h2' gutterBottom>{blog.title}</Typography>
      <Typography variant='subtitle1' color='text.secondary'>by {blog.author}</Typography>

      <Box sx={{ mt: 2 }}>
        <Typography component='a' href={blog.url} target='_blank' rel='noopener noreferrer'>{blog.url}</Typography>

        <Typography>Added by {blog.user?.name || 'Unknown user'}</Typography>

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Likes: {blog.likes}</Typography>
          {userId && (<Button variant='contained' size='small' onClick={() => like(blog.id)}>like</Button>)}
        </Box>

        {userId && blog.user?.id === userId && (<div>
          <Button variant='outlined' color='error' sx={{ mt: 3 }} onClick={() => remove(blog.id)}>Remove</Button>
        </div>)}
      </Box>
    </Paper>
  )
}

export default Blog