import { useAnecdotes } from "../hooks/useAnecdotes"
import { useNotify } from "../NotificationContext"

const AnecdoteList = () => {
    const { anecdotes, voteAnecdote } = useAnecdotes()
    const notify =useNotify()

    const handleVote = (anecdote) => {
        voteAnecdote(anecdote, () => {
            notify(`anecdote '${anecdote.content}' voted`)
        })
    }

    return (
        <div>
            {anecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AnecdoteList