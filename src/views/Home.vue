<template>
	<div class="wrapper">
		<!-- 头部 -->
		<Headers class="_header"></Headers>
		<!-- 备忘录 -->
		<div class="content">
			<div class="container">
				<memoItem v-for="item in this.$store.state.memoItem" :item="item" :key="item.time" class="memo_item"></memoItem>
			</div>
		</div>
		<!-- 编辑页面 -->
		<transition name="el-zoom-in-top">
			<memoEdit v-show="this.$store.state.isShowEdit" class="Edit transition-box"></memoEdit>
		</transition>
		<!-- 登陆 -->
		<transition name="el-zoom-in-top">
			<Login v-show="this.$store.state.isLogin" class="login"></Login>
		</transition>
		<!-- 遮罩 -->
		<div class="mark" v-show="this.$store.state.isShowEdit ||this.$store.state.isLogin"></div>
		<!-- 备案号 -->
		<Record class="record"></Record>
		<!-- 提示面板 -->
		<!-- <MessageTips></MessageTips> -->
	</div>
</template>

<script>
	import memoEdit from '../components/memoEdit.vue'
	import memoItem from '../components/memoItem.vue'
	import Headers from '../components/Header.vue'
	import Record from '../components/Record.vue'
	import Login from '../components/Login.vue'
	import MessageTips from '../components/MessageTips.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		postTable,
		getTable
	} from '../http/func.js'

	export default {
		name: 'Home',
		components: {
			memoEdit,
			memoItem,
			Headers,
			Record,
			Login,
			MessageTips,
		},
		data() {
			return {}
		},
		methods: {
			...mapMutations([
				'addMemoItem',
				'setShowEdit',
				'setItemContent',
				'sortMomeItem',
				'initItem',
				'setTopStore',
				'setIsNew',
				'set',
				'setToken',
				'setlabelArr',
				'setTaskData'
			]),
			//获取用户表格
			init() {
				postTable('/init/', {
					userName: this.userName
				}).then((res) => {
					if (res.data.userData) {
						//memo数据
						this.initItem(res.data.userData)
						let _taskData = res.data.taskData
						//task数据
						this.setTaskData(_taskData)
						//每次init接收新token
						if (res.data.token) {
							this.setToken(res.data.token)
						}
						//自定义的label信息
						if(res.data.labelData&&Object.values(res.data.labelData).length !=0){
							this.setlabelArr(res.data.labelData)
						}
					} else {
						this.initItem('')
					}
				}).catch((err) => {})
			},

		},
		created() {},
		mounted() {
			//获取初始化
			this.init()
			//排序，默認降序
			this.sortMomeItem(false)

			//背景效果
			$(document).on("mousemove", evt => {
				$(".wrapper")
					.css("background-position-x", Math.ceil(evt.pageX / 40))
					.css("background-position-y", Math.ceil(evt.pageY / 40));
			});
			//移动端改变手机的旋转方向?
			window.ondeviceorientation = evt => {
				$("body")
					.css("background-position-x", evt.gamma)
					.css("background-position-y", evt.beta);
			};
		},
		watch: {},
		computed: {
			...mapState([
				'isShowEdit',
				'memoItem',
				'itemContent',
				'isNew',
				'userName',
				'showCalendarTask'
			]),

			memoItemData: function() {
				console.log('计算属性', JSON.parse(localStorage.memoItem))
				var data = JSON.parse(localStorage.memoItem)
				data.forEach((item) => {
					if (!item.title) {
						item.title == ' '
					}
				})
				return JSON.parse(localStorage.memoItem)
			}
		},
		watch: {

		}

	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="scoped" lang="scss">
	.wrapper {
		background-image: url(../assets/pixels.png);

		._header {
			z-index: 99;
			position: fixed;
			width: 100%;
		}

		overflow: scroll; //BFC；撑开高度

		// 隐藏滚动条
		&::-webkit-scrollbar {
			display: none;
		}

		//IE 10+
		& {
			-ms-overflow-style: none;
		}

		//Firefox
		& {
			overflow: -moz-scrollbars-none;
		}

		height: 100%;

		.content:after {
			content: '';
			clear: both;
		}

		.content {
			min-height: 630px;
			margin-top: 60px;
			// height: 90.5%;      //是视口高度的90.5%;有BFC撑开高度之后就不要用固定

			overflow: hidden; //BFC；撑开高度
		}

		.record {
			clear: both;
		}
	}

	.mark {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #222;
		opacity: 0.5;

	}

	.Edit {
		position: absolute;
		top: calc(50% - 175px);
		left: calc(50% - 140px);
		z-index: 99;
	}

	.login {
		position: absolute;
		top: 50%;
		left: 50%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		// transform: translateX(-50%) translateY(-50%);
		width: 500px;
		height: 235px;
		background-color: #fff;
		z-index: 99;
	}


	/*0-768px以上宽度container为100%*/
	.container {
		margin-right: auto;
		margin-left: auto;
	}


	/*768-992px以上宽度container为750px*/
	@media (min-width: 768px) {
		.container {
			width: 750px;
		}
	}

	/*992-1200px以上宽度container为970px*/
	@media (min-width: 992px) {
		.container {
			width: 970px;
		}
	}

	/*1200px以上宽度container为1170px*/
	@media (min-width: 1200px) {
		.container {
			width: 1170px;
		}
	}

	.active {
		background: #e7e7e7;
	}

	.edit_animate {
		position: absolute;
		top: 32%;
		left: 50%;
		// transform: translate(-50%, -50%);
	}
</style>
