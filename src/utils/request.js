import axios from 'axios'
import store from '@/store'
import storage from 'store'
// import notification from 'ant-design-vue/es/notification'
import { message } from 'ant-design-vue'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 30000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token

    if (error.response.status === 403) {
      message.error(data.message)
    }
    if (error.response.status === 401) {
      store.dispatch('ResetToken').then(() => {
        window.location.reload()
      })
    }
    if (error.response.status === 500) {
      message.error('服务器内部错误，请稍后重试！')
    }
    if (error.response.status === 502) {
      message.error('服务器正在开小差，请稍后重试！')
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  const contentType = response.headers['content-type']
  if (contentType.indexOf('application/octet-stream') !== -1) {
    return response
  }

  const data = response.data
  if (!data.success) {
    if (data.code === 1000) {
      store.dispatch('ResetToken').then(() => {
        window.location.reload()
      })
    } else {
      if (data.code !== 1003) {
        message.error(data.message)
      }

      return data
    }
  } else {
    return data
  }
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
