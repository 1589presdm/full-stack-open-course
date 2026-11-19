import { useAnecdotes } from "../hooks/useAnecdotes"

const AnecdoteList = () => {
    const {anecdotes, voteAnecdote } = useAnecdotes()

    const handleVote = (anecdote) => {
        voteAnecdote(anecdote)
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