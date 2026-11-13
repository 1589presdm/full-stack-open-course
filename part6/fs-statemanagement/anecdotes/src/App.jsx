import AnecdoteList from "./components/AnecdoteList"
import AnecdoteFrom from "./components/AnecdoteForm"

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteFrom />
      <AnecdoteList />
    </div>
  )
}

export default App
