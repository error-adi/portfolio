import axios from 'axios'
import { BASE_URL } from '../utils/constants'

const api = axios.create({
  baseURL: `${BASE_URL}api`
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export default api