/**
 * 权限配置接口 (后台不肯改,前端只能再写一套)
 * 业务走json -> (params)
 */
import axios from '../lib/axios'



let apiLock = true;
// 创建自定义接口服务实例
export const httpJ = axios.create({
  timeout: 60 * 60 * 1000,  // 不可超过 manifest.json 中配置 networkTimeout的超时时间
  withCredentials: true,
  /*headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },*/
});

httpJ.interceptors.request.use(config => {
  config.headers['x-system'] = window.localStorage.getItem("systemCode")
  console.log('x-system',config.headers['x-system']);
  return config;
}, err => {
  return Promise.reject(err)
}
)


httpJ.interceptors.response.use(data => {// 响应成功关闭loading

  if (apiLock) {
    let res = data.data;
    console.log('json',data,res.retCode );
    // console.log(res.retCode != 1 && res.retCode != 0);
    if (data.status == 200) {
      if (res.retCode != 1 && res.retCode != 0 ) {
       
        if (res.code == 0 || res.retCode == 2999 || res.code == 2999) {
          console.log('错误返回');
      
        } else if (res.code == 7) {
         
        } else if (res.code == 3) {
      
        } else if (res.code == 403) {
        
        } else {
          return data;
        }
      }
    }
  }
  return data;
}, error => {

  if (apiLock) {
    if (String(error).indexOf('timeout') !== -1) {
      
    }

    if (error && error.response) {
      switch ((error.response.status)) { // 跨域存在获取不到状态码的情况
        case 400:
          alert('错误请求(400)');
          break;
        case 401:
          alert('未授权,请重新登录(401)');
          break;
        case 403:
          alert('拒绝访问(403)');
          break;
        case 404:
          alert('请求错误,未找到该资源(404)');
          break;
        case 405:
          alert('错误请求(405)');
          break;
        case 408:
          alert('请求超时(408)');
          break;
        case 500:
          alert('服务器错误(500)');
          break;
        case 501:
          alert('服务未实现(501)');
          break;
        case 502:
          alert('网络错误(502)');
          break;
        case 503:
          alert('服务不可用(503)');
          break;
        case 504:
          alert('网络超时(504)');
          break;
        case 505:
          alert('httpJ版本不受支持(505)');
          break;
        default:
          alert('网络出现问题,请稍后再试');
          break;
      }
    }
  }

  return Promise.reject(error)
});

export default httpJ
