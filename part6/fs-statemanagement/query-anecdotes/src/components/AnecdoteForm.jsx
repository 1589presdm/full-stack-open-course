import { useContext } from "react"
import { useAnecdotes } from "../hooks/useAnecdotes"
import { NotificationContext } from "../NotificationContext"

const AnecdoteForm = () => {
  const {createAnecdote} = useAnecdotes()
  const {setNotification} = useContext(NotificationContext)

  const showNotification = (message) => {
    setNotification(message)

    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    createAnecdote(content, () => {
      showNotification(`anecdote '${content}' was added successfully`)
    }, (error) => {
      showNotification(error.message)
    })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm