import { beforeEach, describe, test, expect, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import useAnecdoteStore from '../src/store'
import App from '../src/App'
import AnecdoteList from '../src/components/AnecdoteList'
import anecdoteService from '../src/services/anecdotes'

vi.mock('../src/services/anecdotes', () => ({
    default: {
        getAll: vi.fn()
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
})
