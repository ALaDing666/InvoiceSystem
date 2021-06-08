import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
})

http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (sessionStorage.getItem('token')) {
    config.headers.authorization = sessionStorage.getItem('token')
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default http
