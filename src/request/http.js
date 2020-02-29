/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router';

// 通用设置
axios.defaults.timeout = 10000; // 请求超时时间

// 环境的切换
axios.defaults.baseURL = '';
if (process.env.NODE_ENV == 'development') {
    // axios.defaults.baseURL = 'http://127.0.0.1:8000';
    axios.defaults.baseURL = 'http://122.51.217.55:8000';
} else if (process.env.NODE_ENV == 'debug') {    
    axios.defaults.baseURL = 'http://122.51.217.55:8000';
} else if (process.env.NODE_ENV == 'production') {    
    axios.defaults.baseURL = 'http://122.51.217.55:8000';
}

// 请求拦截
axios.interceptors.request.use(
	config => {
        config.data = JSON.stringify(config.data);
        // jwt认证使用
        const token = localStorage.token || sessionStorage.token
		config.headers = {
            'Content-Type':'application/json',
            'Authorization': token?'JWT '+token:null
        }
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// 响应拦截
axios.interceptors.response.use(    
    response => {   
        return Promise.resolve(response);   
    },
    // 服务器状态码不是2开头的的情况，提前错误状态码
    error => {          
        if (error.response.status) { 
            switch (error.response.status) { 
                case 401:
                    Message.error('没有操作权限或者登录信息已失效，请登录')
                    router.push({path:'/login'})
                    break;
                case 404:
                    Message.error('请求资源不存在')
                    break;
                default:
                    Message.error(error.response.data.msg)
            }
        }else{
            Message.error('请求失败')
        }
        return Promise.reject(error.response);
    }    
);


// 封装get方法和post方法
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params={}){    
    return new Promise((resolve, reject) =>{
        axios.get(axios.defaults.baseURL+url, {            
            params: params,
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)        
    	})
	});
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params={}) {
    return new Promise((resolve, reject) => {
        axios.post(
            axios.defaults.baseURL+url, 
            params
        )
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err)
        })
	});
}

 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url,params={}){
	return new Promise((resolve,reject) => {
	    axios.patch(
            axios.defaults.baseURL+url,
            params
        )
		.then(response => {
			resolve(response.data);
        })
        .catch(err =>{
            reject(err)
        })
	})
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url,params={}){
	return new Promise((resolve,reject) => {
		axios.put(
            axios.defaults.baseURL+url,
            params
        )
		.then(response => {
		    resolve(response.data);
        })
        .catch(err =>{
            reject(err)
        })
	})
}

 /**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del(url,params={}){
	return new Promise((resolve,reject) => {
		axios.delete(
            axios.defaults.baseURL+url,
            params
        )
		.then(response => {
		    resolve(response.data);
        })
        .catch(err =>{
            reject(err)
        })
	})
}
