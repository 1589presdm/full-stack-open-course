import { beforeEach, afterEach, describe, test, expect, vi } from 'vitest'
import { render, waitFor, screen, cleanup } from '@testing-library/react'
import useAnecdoteStore from './store'
import App from './App'
import AnecdoteList from './components/AnecdoteList'
import anecdoteService from './services/anecdotes'

vi.mock('./services/anecdotes', () => ({
    default: {
        getAll: vi.fn(),
        updateVote: vi.fn()
    }
}))

const testAnecdotes = [
    { id: '1', content: 'First joke', votes: 8 },
    { id: '2', content: 'Second joke', votes: 13 },
    { id: '3', content: 'Third joke', votes: 11 }
]

beforeEach(() => {
    useAnecdoteStore.setState({
        anecdotes: [],
        filter: ''
    })

    vi.clearAllMocks()
})

afterEach(() => {
    cleanup()
})

describe('Anecdotes', () => {
    test('initializes anecdotes from backend', async () => {
        const anecdotesFromBackend = [
            { id: '1', content: 'First joke', votes: 8 },
            { id: '2', content: 'Second joke', votes: 13 }
        ]

        anecdoteService.getAll.mockResolvedValue(anecdotesFromBackend)

        render(<App />)

        await waitFor(() => {
            expect(useAnecdoteStore.getState().anecdotes).toEqual(anecdotesFromBackend)
        })

        expect(anecdoteService.getAll).toHaveBeenCalled()
    })

    test('dasplays anecdotes sorted by votes', () => {
        useAnecdoteStore.setState({
            anecdotes: testAnecdotes
        })

        const { container } = render(<AnecdoteList />)

        const contentElements = Array.from(
            container.querySelectorAll('div')
        ).filter(element => testAnecdotes.some(a => a.content === element.textContent))

        const actualOrder = contentElements.map(element => element.textContent)

        expect(actualOrder).toEqual([
            'Second joke',
            'Third joke',
            'First joke'
        ])
    })

    test('displays only anecdotes matching the filter', () => {
        useAnecdoteStore.setState({
            anecdotes: testAnecdotes,
            filter: 'Second'
        })

        render (<AnecdoteList />)

        expect(screen.getByText('Second joke')).toBeTruthy()
        expect(screen.queryByText('First joke')).toBeNull()
        expect(screen.queryByText('Third joke')).toBeNull()
    })

    test('voiting increases the number of votes', async () => {
        const anecdote = {
            id: '1',
            content: 'First joke',
            votes: 8
        }

        useAnecdoteStore.setState({
            anecdotes: [anecdote]
        })

        const updatedAnecdote = {...anecdote, votes: 9}

        anecdoteService.updateVote.mockResolvedValue(updatedAnecdote)

        await useAnecdoteStore.getState().actions.vote(anecdote.id)

        expect(anecdoteService.updateVote).toHaveBeenCalledWith('1', 9)
        expect(useAnecdoteStore.getState().anecdotes[0].votes).toBe(9)
    })

})
