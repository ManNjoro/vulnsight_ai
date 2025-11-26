import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
    baseURL: baseUrl
})

export default apiClient;