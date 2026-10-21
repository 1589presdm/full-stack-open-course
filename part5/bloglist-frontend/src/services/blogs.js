import axios from 'axios'
import { getToken } from '../utils/token'
const baseUrl = '/api/blogs'


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create }