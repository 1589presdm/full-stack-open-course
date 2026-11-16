
import { create } from 'zustand'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: (id) => set(state => ({
      anecdotes: state.anecdotes.map(a => a.id === id ? {...a, votes: a.votes + 1} : a)
    })),

    add: ({ content }) => set(state => ({anecdotes: [...state.anecdotes, asObject(content) ]})),

    setFilter: value => set(() => ({ filter: value})),

    initialize: anecdotes => set(() => ({anecdotes}))
  },
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useFilter = () => useAnecdoteStore((state) => state.filter)

