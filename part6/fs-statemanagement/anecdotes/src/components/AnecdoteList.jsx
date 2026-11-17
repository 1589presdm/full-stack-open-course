import { useAnecdotes, useAnecdoteActions, useFilter } from "../store"
import { useNotificationAction } from "../notificationStore"

const AnecdoteList = () => {
    const anecdotes = useAnecdotes()
    const { vote } = useAnecdoteActions()
    const filter = useFilter()
    const sortedAnecdotes = anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
    .toSorted((a, b) => b.votes - a.votes)
    const { setNotification, clear } = useNotificationAction()

    const handleVote = async (anecdote) => {
        await vote(anecdote.id)
        setNotification(`You voted "${anecdote.content}"`)
        setTimeout(() =>{
            clear()
        }, 5000)
    }

    return (
        <div>
            {sortedAnecdotes.map((anecdote) => (
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