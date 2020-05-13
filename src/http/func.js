import axios from './axios.js'
import store from '../store/index'
// import qs from 'qs'       //是否使用qs取决于实际情况以及与后台的沟通



//请求列表数据
const postTable = function postTableData(url, data) {
  return axios.post(url, data)
}
const getTable = function getTableData(url,data){
	return axios.get(url,{params:data})
}


export {postTable,getTable}
