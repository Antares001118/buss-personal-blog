import axios from 'axios'
import router from '@/router'


const request = axios.create({
  timeout: 10000,
  baseURL: import.meta.env.VITE_API_BASE_URL
})

// 请求拦截器
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
request.interceptors.request.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default request
