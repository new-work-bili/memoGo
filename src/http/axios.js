import axios from 'axios'
import store from '../store/index.js'
import router from '../router/index.js'
import {
	Message
} from 'element-ui'
// axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.baseURL = 'http://123.57.209.85';

axios.interceptors.request.use(
	config => {
		console.log('请求发送的数据:', config)
		//发送token
		if (store.state.token) {
			config.headers.Authorization = `Bearer ${store.state.token}` //+Bearer是jwt验证中间件规定的
		}
		return config;
	},
	err => {

		return Promise.reject(err)
	})

axios.interceptors.response.use(
	res => {
		console.log('拦截器打印返回数据:', res)
		const code = res.data.code
		if (code == 1) {
			Message({
				showClose: false,
				duration: 1000,
				message: res.data.msg || '请求成功!',
				type: 'success',
			})
		} else if (code == -2 && store.state.token) { //token验证错误，并且用户是登录状态的时候才报错
			console.log('命中')
			if (res.data.errorMsg == "No authorization token was found") {
				console.log('命中')
				Message({
					showClose: false,
					duration: 2000,
					message: '未找到token!',
					type: 'error',
				});
			} else if (res.data.errorMsg == "jwt expired") {
				Message({
					showClose: false,
					duration: 2000,
					message: '身份验证已过期，请重新登陆!',
					type: 'error',
				});
			} else if (res.data.errorMsg == "invalid signature") {
				Message({
					showClose: false,
					duration: 2000,
					message: 'token无效，请重试!',
					type: 'error',
				});
			} else {
				Message({
					showClose: false,
					duration: 2000,
					message: '身份验证错误!',
					type: 'error',
				});
			}
			store.state.userName ? store.state.userName = '' : store.state.userName,
				// console.log(localStorage.userName,store.state)	//为什locaoStorage里userName有值，但store.state里面没有
				store.commit('setUserName', '')
			store.commit('setToken', '')
		} else if (code == -1) {
			Message({
				showClose: false,
				duration: 2000,
				message: res.data.msg || '更新失败!',
				type: 'error',
			});
		}
		return res
	},
	err => {

		if (err.message.indexOf('timeout') != -1) {
			Message({
				showClose: false,
				duration: 2000,
				message: '请求超时请刷新后重试!',
				type: 'error',
			});
		} else if (err.message.indexOf('404') != -1) {
			router.replace({
				name: '404'
			})
			// Message({
			// 	showClose: false,
			// 	duration: 2000,
			// 	message: '跳转至404页面!',
			// 	type: 'error',
			// });
		} else if (err.message.indexOf('403') != -1) {
			Message({
				showClose: false,
				duration: 2000,
				message: '您无权进行该操作，请尝试登陆!',
				type: 'error',
			});
		}

		return Promise.reject(err)
	})

export default axios
