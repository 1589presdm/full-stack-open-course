import AnecdoteList from "./components/AnecdoteList"
import AnecdoteFrom from "./components/AnecdoteForm"
import Filter from "./components/Filter"

const App = () => {
  return (
    <div>
      <Filter />
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteFrom />
    </div>
  )
}

export default App
