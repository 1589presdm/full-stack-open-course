import axios from 'axios'

const url = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(url)
    return request.then(response => response.data)
}

const create = contactObject => {
    const request = axios.post(url, contactObject)
    return request.then(response => response.data)
}

const deleteContact = id => {
    const request = axios.delete(`${url}/${id}`)
    return request.then(response => response.data)
}

export default {getAll, create, deleteContact}