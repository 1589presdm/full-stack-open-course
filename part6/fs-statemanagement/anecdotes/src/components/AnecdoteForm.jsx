import { useAnecdoteActions } from "../store"
import anecdoteService from '../services/anecdotes'

const AnecdoteFrom = () => {
    const { add } = useAnecdoteActions()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        const newAnecdote = await anecdoteService.createNew(content)
        add(newAnecdote)
        event.target.reset()
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="anecdote" />
                </div>
                <button>create</button>
            </form>
        </div>
    )
}

export default AnecdoteFrom