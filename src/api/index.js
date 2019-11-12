import axios from 'axios'
import local from '@/utils/store'
import router from '@/router'
import JSONBIG from 'json-bigint'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 设置默认的请求头
// if (local.getUser()) {
//  要在请求之前把token添加到headers中
//   axios.defaults.headers.Authorization = `Bearer ${local.getUser().token}`
// }

// 配置axios
axios.defaults.transformResponse = [(data) => {
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]

// 请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么  拦截成功往headers中加token
  const user = local.getUser() || {}
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, error => Promise.reject(error))

// 添加相应拦截器  token失效是 拦截返回到登录页面
axios.interceptors.response.use(response => response, err => {
  // 获取状态码 err.response.status状态码
  // 如果是401跳转登录
  if (err.response.status === 401) {
    return router.push('/login')
  }
  return Promise.reject(err)
})

export default axios
