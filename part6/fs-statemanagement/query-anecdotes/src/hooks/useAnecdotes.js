import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { createAnecdote, getAnecdotes, updateVote } from "../requests"

export const useAnecdotes = () => {
    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        refetchOnWindowFocus: false
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        },
    })

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateVote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        }
    })

    return {
        anecdotes: result.data,
        isPending: result.isPending,
        isError: result.isError,
        error: result.error,
        createAnecdote: (content, onSuccess, onError) => newAnecdoteMutation.mutate({ content, votes: 0 }, { onSuccess, onError }),
        voteAnecdote: (anecdote, onSuccess) => updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }, { onSuccess })
    }
}