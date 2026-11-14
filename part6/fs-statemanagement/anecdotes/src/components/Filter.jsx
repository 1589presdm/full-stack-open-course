import { useAnecdoteActions } from "../store"

const Filter = () => {
    const { setFilter } = useAnecdoteActions()

    const handleChange = (event) => {
        const filterText = event.target.value
        setFilter(filterText)
    }

    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange}  name="filter" />
        </div>
    )
}

export default Filter