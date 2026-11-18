import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useAnecdotes } from '../src/store'
import App from '../src/App'
import anecdoteService from '../src/services/anecdotes'

vi.mock('../src/services/anecdotes', () => ({
    default: {
        getAll: vi.fn()
    }
}))

const StoreInspector = () => {
    const anecdotes = useAnecdotes()

    return (
        <div data-testid='store-state'>
            {JSON.stringify(anecdotes)}
        </div>
    )
}

test('initializes anecdotes from backend', async () => {
    const anecdotesFromBackend = [
        {id: '1', content: 'First joke', votes: 8},
        {id: '2', content: 'Second joke', votes: 13}
    ]

    anecdoteService.getAll.mockResolvedValue(anecdotesFromBackend)

    render(
        <>
            <App />
            <StoreInspector />
        </>
    )

    expect(await screen.findByText('First joke')).toBeTruthy()
    expect(await screen.findByText('Second joke')).toBeTruthy()
    expect(JSON.parse(screen.getByTestId('store-state').textContent)).toEqual(anecdotesFromBackend)
    expect(anecdoteService.getAll).toHaveBeenCalled()
})
