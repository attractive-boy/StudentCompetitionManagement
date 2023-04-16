// 封装一下请求
import axios from 'axios'
import { ElMessage } from 'element-plus'

export const baseURL:string = 'http://localhost:81'

const request = axios.create({
  baseURL: baseURL,
  timeout: 10000
})

const err = (error: any) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = localStorage.getItem('token')
    if (error.response.status === 403) {
      ElMessage({
        message: '禁止访问',
        type: 'warning'
      })
    }
    if (error.response.status === 401) {
      ElMessage({
        message: '授权失败，请重新登录',
        type: 'error',
        duration: 1000,
        onClose: () => {
          if (token) {
            localStorage.removeItem('token')
          }
          location.reload()
          window.location.href = '/login'
        }
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
request.interceptors.response.use((response) => {
  const res = response.data
  if (res.code !== 200) {
    ElMessage({
      message: res.message || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      ElMessage({
        message: '你已被登出，可以取消继续留在该页面，或者重新登录',
        type: 'warning',
        duration: 5 * 1000,
        onClose: () => {
          localStorage.removeItem('token')
          location.reload()
        }
      })
    }
    return Promise.reject(new Error(res.message || 'Error'))
  } else {
    return res
  }
}, err)

export default request
