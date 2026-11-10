import { useState } from 'react'
import { TextField, Button, Typography } from '@mui/material'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = (event) => {
    event.preventDefault()
    login({
      username,
      password
    })
    setUsername('')
    setPassword('')

  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Typography variant='h4' component='h2'>Log in to application</Typography>
        <label>
            <TextField
            label='login'
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            sx={{width: 150, mt: 2}}
            margin='normal'
          />
        </label>
      </div>
      <div>
        <label>
            <TextField
            label='password'
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            sx={{width: 150, mt: 2}}
            margin='normal'
          />
        </label>
      </div>
      <Button type="submit" variant='contained' style={{marginTop: 10}}>login</Button>
    </form>
  )

}

export default LoginForm