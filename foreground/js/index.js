/**
 * 权限配置接口
 * 默认走表单形式 -> qs.stringify (对象转字符串)
 */

import axios from '../lib/axios'


let apiLock = true
// baseUrl
export const baseURL = Object.is(process.env.NODE_ENV, 'production') ? `${window.location.origin}` : '/api'
export const baseURLou = Object.is(process.env.NODE_ENV, 'production') ? `${window.location.origin}/api` : '/ouapi'
// 创建自定义接口服务实例
export const http = axios.create({
  timeout: 60000, // 不可超过 manifest.json 中配置 networkTimeout的超时时间
  withCredentials: true
  /* headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }, */
})

http.interceptors.request.use(config => {
   
    config.headers['x-system'] = window.localStorage.getItem("systemCode")
    console.log('x-system',config.headers['x-system']);
    if (config.method === 'post' && config.headers['Content-Type'] != 'multipart/form-data') {

      if(config.headers['Content-Type'] === 'application/json') return config;
    
    } else if (config.method === 'get') {
      config.params = {
       
        ...config.params
      }
    }
    return config
  }, err => {
    return Promise.reject(err)
  }
)

http.interceptors.response.use(data => { // 响应成功关闭loading
  if (apiLock) {
    let res = data.data
    console.log(123,res);
    if (data.status == 200) {
     
      if (res.code != 1 && res.retCode != 0 ) {
        if (res.code == 0 || res.retCode == 2999) {
          let msg = res.msg || res.message || res.resultmsg || res.retMsg || res.resultMsg;
          alert(msg)
        } else if (res.code == 7) {

        } else if (res.code == 3) {
   
        } else if (res.code == 403) {
          alert('登录过期')

          // 清楚本地存储,重置路由
          setTimeout(() => {
            localStorage.clear()
            window.location.href = `${location.origin}/#/login`
          }, 500)
        }
      } 
    }
  }
  return data
}, error => {
  Spin.hide()
  Message.destroy()
  if (apiLock) {
    if (String(error).indexOf('timeout') !== -1) {
      return alert('连接超时')
    }

    if (error && error.response) {
      switch ((error.response.status)) { // 跨域存在获取不到状态码的情况
        case 400:
          alert('错误请求(400)')
          break
        case 401:
          alert('未授权,请重新登录(401)')
          break
        case 403:
          alert('拒绝访问(403)')
          break
        case 404:
          alert('请求错误,未找到该资源(404)')
          break
        case 405:
          alert('错误请求(405)')
          break
        case 408:
          alert('请求超时(408)')
          break
        case 413:
          alert('请求参数过大(413)')
          break
        case 500:
          alert('服务器错误(500)')
          break
        case 501:
          alert('服务未实现(501)')
          break
        case 502:
          alert('网络错误(502)')
          break
        case 503:
          alert('服务不可用(503)')
          break
        case 504:
          alert('网络超时(504)')
          break
        case 505:
          alert('HTTP版本不受支持(505)')
          break
        default:
          alert('网络出现问题,请稍后再试')
          break
      }
    }
  }

  return Promise.reject(error)
})
