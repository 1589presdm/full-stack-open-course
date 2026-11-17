const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)

    if(!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }

    return await response.json()
}

const createNew = async (content) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, votes: 0 })
    }

    const response = await fetch(baseUrl, options)

    if (!response.ok) {
        throw new Error ('Failed to create anecdote')
    }

    return await response.json()
}

const updateVote = async (id, updatedVotes) => {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({votes: updatedVotes})
    })

    if(!response.ok) {
        throw new Error('Failed to change numbers of votes')
    }

    return await response.json()
}

const remove = async (id) => {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    })

    if(!response.ok) {
        throw new Error('Failed to delete anecdote')
    }
}

export default { getAll, createNew, updateVote, remove }