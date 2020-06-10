import axios from './axios.js'
import store from '../store/index'
// import qs from 'qs'       //是否使用qs取决于实际情况以及与后台的沟通

//需要检查是否有用户名，在进行上传服务器
var check = ['/add/', '/delete/', '/setTop/', '/init/','/changeLabel/']
//请求列表数据
const postTable = function postTableData(url, data) {
	var is = check.indexOf(url)
	console.log(url)
	//需要检查&&已登录 || 不需要检查
	if (((is||is==0) && store.state.userName) || is == -1) { 
		console.log('go')
		return axios.post(url, data)
	} else {
		console.log('no')
		return Promise.resolve()
	}

}
const getTable = function getTableData(url, data) {
	return axios.get(url, {
		params: data
	})
}


export {
	postTable,
	getTable
}
