import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateVote } from '../requests'

const AnecdoteList = () => {
    const queryClient = useQueryClient()

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateVote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes']})
        }
    })

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes
    })

    if (result.isPending) {
        return <div>loading data...</div>
    }

    if (result.isError) {
        return <div>{result.error.message}</div>
    }

    const anecdotes = result.data

    const handleVote = (anecdote) => {
        updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
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