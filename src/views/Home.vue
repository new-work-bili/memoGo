<template>
	<div class="wrapper" @click="hiddenHeader">
		<!-- 头部 -->
		<Headers class="_header" :winodwControlShowTask="winodwControlShowTask"></Headers>
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
		<div class="mark" v-show="this.$store.state.isShowEdit ||this.$store.state.isLogin ||this.$store.state.showFeedBack"></div>
		<!-- 备案号 -->
		<Record class="record"></Record>
		<!-- 反馈 -->
		<transition name="el-zoom-in-top">
			<feedBack class="transition-box" v-show="this.$store.state.showFeedBack"></feedBack>
		</transition>
	</div>
</template>

<script>
	window.onload = function(){
		console.log('load')
	}
	import memoEdit from '../components/memoEdit.vue'
	import memoItem from '../components/memoItem.vue'
	import Headers from '../components/Header.vue'
	import Record from '../components/Record.vue'
	import Login from '../components/Login.vue'
	import feedBack from '../components/feedBack.vue'
	import axios from '../http/axios.js'
	import qs from 'qs' //是否使用qs取决于实际情况以及与后台的沟通

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
			feedBack,

		},
		data() {
			return {
				showFeedBack: 'showFeedBack',
				winodwControlShowTask: false, //传给子级的；点击空白子级彩蛋回收
			}
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
				'setTaskData',
				'countAllLabel',
			]),
			//全局事件；监听点击之后隐藏彩蛋
			hiddenHeader() {
				console.log(this.winodwControlShowTask)
				this.winodwControlShowTask = !this.winodwControlShowTask
			},
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
						if (res.data.labelData && Object.values(res.data.labelData).length != 0) {
							this.setlabelArr(res.data.labelData)
						}

						//更新label数量
						this.$store.commit('countAllLabel')
					} else {
						this.initItem('')
					}
				}).catch((err) => {})
			},
			//性能监控，PV计算
			timeObserve() {
				var time = window.performance.timing
				//白屏时间
				var whiteTime = time.domLoading - time.navigationStart
				//首屏时间(所有资源下载完成...)
				//loadEventEnd 返回当前网页load事件的回调函数运行结束时的时间戳。如果该事件还没有发生，返回0。
				// var laodTime = time.loadEventEnd - time.navigationStart;
				//对于vue，直接在对应生命周期获取时间戳就行了
				var firstTime  = new Date().getTime() - time.navigationStart;
				
				//用户等待可操纵时间
				var waitTime = time.domContentLoadedEventEnd  - time.navigationStart;
				//DNS解析;
				var DNSTime = time.domainLookupEnd - time.domainLookupStart
				//tcp耗时
				var TCPTime = time.connectEnd - time.connectStart

				var timeObject = {
					whiteTime,
					firstTime,
					waitTime,
					DNSTime,
					TCPTime
				}
				console.log(timeObject)
				return timeObject
			},
			//用户设备信息
			userIn() {
				var sBrowser, sUsrAg = navigator.userAgent;
				if (/(iPhone|iPad|iPod|iOS)/i.test(sUsrAg)) {
					// ios
					sBrowser = 'ios'
				} else if (/(Android)/i.test(sUsrAg)) {
					// 安卓
					sBrowser = 'android'
				} else if (sUsrAg.indexOf("Firefox") > -1) {
					sBrowser = "Mozilla Firefox";
					// "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
				} else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
					sBrowser = "Opera";
					//"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
				} else if (sUsrAg.indexOf("Trident") > -1) {
					sBrowser = "Microsoft IE";
					// "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
				} else if (sUsrAg.indexOf("Edge") > -1) {
					sBrowser = "Microsoft Edge";
					// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
				} else if (sUsrAg.indexOf("Chrome") > -1) {
					sBrowser = "Google Chrome or Chromium";
					// "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
				} else if (sUsrAg.indexOf("Safari") > -1) {
					sBrowser = "Apple Safari";
					// "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
				} else {
					sBrowser = "unknown";
				}
				return sBrowser
			},
			//发送监听信息
			sendListMassage() {
				var sendObject = this.timeObserve()
				sendObject.userMassage = this.userIn()
				var sendJson = qs.stringify(sendObject)
				let url = axios.defaults.baseURL + '/ListenLog'
				
				//发送
				let img = new Image(1,1)
				let src = url+'?'+sendJson;	//不能用字符串模板，要用这种形式
				console.log(src)
				
				//发送
				img.src = src
			}

		},
		created() {
			//对label总数进行计算
			this.$store.commit('countAllLabel')
		},
		mounted() {
			console.log('mounted')
			//性能监控，延迟\耗时计算
			this.sendListMassage()
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
		width: 500px;
		height: 235px;
		background-color: #fff;
		z-index: 99;
		padding: 50px;
	}


	/*0-768px以上宽度container为100%*/
	.container {
		margin-right: auto;
		margin-left: auto;
	}

	@media (max-width:768px) {

		.login,
		.feed_back {
			width: 100%;
			padding: 25px 75px;
		}
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
