import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

//初始化,以免为空时会报错；空字符串时 "" ,length == 2，why？？
// console.log(localStorage.memoItem == " ")
if (!localStorage.memoItem || localStorage.memoItem == 'undefined' || localStorage.memoItem == null || localStorage.memoItem
	.length == 0 || localStorage.memoItem.length == 2) {
		//初始化
	let resetArr = [{
		type: 0, //用来标记是否置顶
		title: 'reset',
		label: '学习', //分类
		time: new Date().getTime(), //创建时间
		content: 'reset', //内容
	}]
	localStorage.memoItem = JSON.stringify(resetArr)
}

//初始化taskData
if (!localStorage.taskData || localStorage.taskData == 'undefined' || localStorage.taskData == null || localStorage.taskData
	.length == 0 || localStorage.taskData.length == 2) {
	//初始化
	let taskReData = {
		'reset': 'reset'
	}
	localStorage.taskData = JSON.stringify(taskReData)
}

//初始化labelData
if (!localStorage.labelData || localStorage.labelData == 'undefined' || localStorage.labelData == null || localStorage.labelData
	.length == 0 || localStorage.labelData.length == 2) {
	//初始化
	let _labelData = []
	localStorage.labelData = JSON.stringify(_labelData)
}



export default new Vuex.Store({
	state: {
		isShowEdit: false,
		memoItem: JSON.parse(localStorage.memoItem) || [], //要遍历的备忘录数组
		itemContent: {}, //编辑框中的的内容,用于编辑的时候
		isNew: true, //点击的是新建还是编辑,区别失望数组里添加还是替换
		isLogin: false, //1登陆，2注册
		token: localStorage.token || '',
		userName: localStorage.userName || '',
		isUp: false, //降序还是升序
		taskData: JSON.parse(localStorage.taskData) || {}, //task数据
		showCalendarTask: false, //是否显示日历任务组件
		upload: 'http://localhost:3000/upload',
		labelArr: JSON.parse(localStorage.labelData) || [] ,//自定义的label信息
		showMessageTips:false			,//是否显示提示面板
		showFeedBack:false				//反馈
	},
	mutations: {
		//自定义的label信息
		setlabelArr(state, data) {
			state.labelArr = data
			localStorage.labelData = JSON.stringify(data)
		},
		//是否显示编辑框
		setShowEdit(state, data) {
			state.isShowEdit = data
		},
		setLogin(state, data) {
			state.isLogin = data
		},
		setUserName(state, data) {
			state.userName = data
			localStorage.userName = data
		},
		setToken(state, data) {
			state.token = data
			localStorage.token = data
		},
		setTaskData(state, data) {
			state.taskData = data
			localStorage.taskData = JSON.stringify(data)
		},
		setShowCalendarTask(state, data) {
			state.showCalendarTask = !state.showCalendarTask
		},
		//增加数组
		addMemoItem(state, data) {
			let te = state.memoItem
			//如果是编辑的话,把老的替换成新编辑的
			if (!state.isNew) {
				te.forEach((item, index) => {
					if (item.time == data.time) {
						te.splice(index, 1, data)
					}
				})
			} else {
				//新增,直接添加,添加到第一位
				te.unshift(data)
				this.commit('sortMomeItem', false)
			}
			localStorage.memoItem = JSON.stringify(te)
		},
		//删
		deleteMemoItem(state, data) {
			var items = state.memoItem.filter((item) => {
				return item.time != data
			})
			state.memoItem = items
			localStorage.memoItem = JSON.stringify(items)
		},
		//按类别筛选
		filterMemoItem(state, data) {
			if (data == '全部') {
				state.memoItem = JSON.parse(localStorage.memoItem)
			} else {
				var items = JSON.parse(localStorage.memoItem).filter((item) => {
					return item.label == data
				})
				state.memoItem = items
			}

		},
		//按...排序
		sortMomeItem(state, up) {
			if (up) {
				state.memoItem.sort((a, b) => {
					//跳过置顶的
					if (a.type == 1) {
						return 0
					} else {
						return a.time - b.time
					}
				})
				//置顶的type是1,不置顶的是0，进行排序
				state.memoItem.sort((a, b) => {
					return b.type - a.type
				})
			} else {
				state.memoItem.sort((a, b) => {
					if (a.type == 1) {
						return 0
					} else {
						return b.time - a.time
					}

				})
				state.memoItem.sort((a, b) => {
					return b.type - a.type
				})
			}
		},
		//处理置頂
		setTopStore(state, data) {
			let te = state.memoItem
			let type = data[0]
			let time = data[1]
			te.forEach((item, index, arr) => {
				if (item.time == time) {
					if (type == 0) {
						//置顶
						item.type = 1
						this.commit('sortMomeItem', state.isUp)
					} else {
						//撤销置顶
						item.type = 0
						this.commit('sortMomeItem', state.isUp)
					}

				}
			})
			localStorage.memoItem = JSON.stringify(te)
		},
		//编辑框里的内容
		setItemContent(state, data) {
			state.itemContent = data
		},

		//设置点击的是新建还是编辑
		setIsNew(state, data) {
			state.isNew = data
		},
		//文字筛选
		setFilter(state, data) {
			var filterArr = []
			filterArr = JSON.parse(localStorage.memoItem).filter((item) => {
				let is = false
				if (item.title.indexOf(data) != -1 || item.content.indexOf(data) != -1) {
					is = true
				}
				return is
			})
			state.memoItem = filterArr
		},
		initItem(state, data) {
			state.memoItem = data
			this.commit('sortMomeItem', state.isUp)
			localStorage.memoItem = JSON.stringify(state.memoItem)
		},
		//升降序
		setIsUP(state, data) {
			console.log(data)
			state.isUp = data
		}
	}
})
