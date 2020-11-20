import axios from 'axios'
import { message } from 'antd';
import qs from 'qs'
import { prefix, toLoginPage } from '@/utils'
// 是否是生产环境-因为生产环境唯一
// const isProductionEnv = location.host === 'v1.tf56.com'
const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  };

// 创建axios
const service = axios.create({
    // baseURL: '/api/partyOpenApi',
    timeout: 30 * 1000,
})

//axios请求头默认不自带，需要手动加上，便于让后端识别是ajax请求
service.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// 拦截器
service.interceptors.request.use(config=>{
    // console.log(config,'进入req拦截器')
    return config
},err=>{
    console.log(err)
    return Promise.reject(err)
})

service.interceptors.response.use(config=>{
    // console.log(config,'进入res拦截器')
    if (config.status !== 200) {
        message.error(codeMessage[config.status])
        return Promise.reject(`${codeMessage[config.status]}`)
    } 
    // if (config.data.redirect === true) {
    //     message.error('未登录，正在前往登录页...')
    //     toLoginPage()
    //     return Promise.reject('未登录，正在前往登录页...')
    // }
    if (config.data.code < 0) {
        message.error(config.data.msg)
        return Promise.reject(`${config.data.msg}`)
		}
		if (config.data.redirect) {
			toLoginPage()
			return Promise.reject('未登录，正在前往登录页...')
		}
    return config
},err=>{
    console.log(err)
    // message.error('数据获取失败')
    return Promise.reject(err)
})

// csrf
function createSecret() {
    return +new Date() + '-' + Math.floor(Math.random() * Math.pow(10, 18)).toString(16);
}

let csrfType = createSecret();

// Post
const requestPost = (url, data = {}, headers) => {
		
    return new Promise((resolve, reject) => {
        service({
            url,
            data,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8 ',
            },
            method: 'post',
        }).then(response => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
      })
  
}

const requestFormPost = (url, data = {}, headers) => {
		
    return new Promise((resolve, reject) => {
        service({
            url,
            data: qs.stringify(data),
            headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'post',
        }).then(response => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
      })
  
}

// Get
const requestGet = (url, data = {}, headers) => {
		
    return new Promise((resolve, reject) => {
        service({
            url,
            params:data,
            transformRequest: [function(data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
								}
								ret += encodeURIComponent('subToken')+ '=' + encodeURIComponent(getQueryString('subToken')) + '&'
                return ret
            }],
            method: 'get',
        }).then(response => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          })
      })

}

// 文件上传
const requestFile = (url, data = {}, headers) => {
		
    return new Promise((resolve, reject) => {
        service({
            url: url,
            method: 'post',
            data,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

//获取url参数
function getQueryString(name) {
	var paramsUrl = location.hash.split('?')[1]; //获取url中"?"符后的字串
	let paramsObj = {}, paramsStrArr = paramsUrl?.split('&')||[]
	paramsStrArr.map(item => {
		paramsObj[item.split('=')[0]] = item.split('=')[1]
	})
	return paramsObj[name];
}

// Jsonp
//axios本版本不支持jsonp 自己拓展一个

/**
 * 拼接url方法
 * @param data
 * @returns {string}
 */
function param(data) {
	let url = '';
	for (var k in data) {
			let value = data[k] !== undefined ? data[k] : '';
			url += '&' + k + '=' + encodeURIComponent(value);
	}
	return url ? url.substring(1) : '';
}

const Jsonp = (url, data) => {
	
	if(!url){
			console.error('Axios.JSONP 至少需要一个url参数!')
			return;
	}
	url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
  // console.info('jsonp',url);
	return new Promise((resolve,reject) => {
			window.jsonCallBack = (result) => {
					resolve(result)
			}
			var JSONP=document.createElement("script");
			JSONP.type="text/javascript";
			JSONP.src=`${url}&callback=jsonCallBack`;
			document.getElementsByTagName("head")[0].appendChild(JSONP);
			setTimeout(() => {
					document.getElementsByTagName("head")[0].removeChild(JSONP)
			},500)
	})
}


export { requestPost, requestGet, requestFile, requestFormPost, Jsonp }