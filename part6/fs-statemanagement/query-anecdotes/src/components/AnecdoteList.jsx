import { useAnecdotes } from "../hooks/useAnecdotes"
import { useContext } from "react"
import { NotificationContext } from "../NotificationContext"

const AnecdoteList = () => {
    const { anecdotes, voteAnecdote } = useAnecdotes()
    const { setNotification } = useContext(NotificationContext)

    const handleVote = (anecdote) => {
        voteAnecdote(anecdote, () => {
            setNotification(`anecdote '${anecdote.content}' voted`)
            setTimeout(() => {
                setNotification('')
            }, 5000)
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