import { useAnecdoteActions } from "../store"

const AnecdoteFrom = () => {
    const { add } = useAnecdoteActions()

    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.new.value
        add({ content })
        event.target.reset()
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="new" />
                </div>
                <button>create</button>
            </form>
        </div>
    )
}

export default AnecdoteFrom