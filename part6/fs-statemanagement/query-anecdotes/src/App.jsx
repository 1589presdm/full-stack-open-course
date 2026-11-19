import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import AnecdoteList from './components/AnecdoteList'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const { isPending, isError, error } = useAnecdotes()

  if (isPending) {
        return <div>loading data...</div>
    }

    if (isError) {
        return <div>anecdote service not available due to problems in server</div>
    }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App