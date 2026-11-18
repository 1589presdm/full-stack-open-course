
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updatedVotes = anecdote.votes + 1
      
      const updatedAnecdoteVotes = await anecdoteService.updateVote(id, updatedVotes)

      set(state => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? updatedAnecdoteVotes : a)
      }))
    },

    add: ( newAnecdote ) => set(state => ({ anecdotes: [...state.anecdotes, newAnecdote] })),

    setFilter: value => set(() => ({ filter: value })),

    initialize: anecdotes => set(() => ({ anecdotes })),

    remove: async (id) => {
      const anecdoteToDelete = get().anecdotes.find(a => a.id === id)

      if(anecdoteToDelete && anecdoteToDelete.votes === 0) {
        await anecdoteService.remove(id)

        set(state => ({
          anecdotes: state.anecdotes.filter(a => a.id !== id)
        }))
      }
      
    }
  },
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export default useAnecdoteStore
