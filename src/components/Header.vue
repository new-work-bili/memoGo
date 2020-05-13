<template>
	<div class="wrappers" role="navigation">
		<!-- bootstrap navbar -->
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<!-- 移动端导航栏 -->  
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"
					 :aria-expanded="false">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<span class="login" v-show="!this.$store.state.userName"><span @click="login">登陆</span> || <span @click="registe">注册</span></span>
					<div class="other col-xs-6 col-sm-3 col-md-3 col-lg-2" v-show="!this.$store.state.userName">
						<span>第三方登陆:</span>
						<svg class="icon" aria-hidden="true" @click="QQclick">
							<use xlink:href="#icon-QQ1"></use>
						</svg>
						<span class="weixin_wrapper">
							<svg class="icon" aria-hidden="true" @click="weixin" @mouseout="leaveWeixin">
								<use xlink:href="#icon-weixin"></use>
							</svg>
							<span class="toding" v-show="toding">开发中</span>
						</span>
						
					</div>
					<span class="login" v-show="this.$store.state.userName"><span>{{this.$store.state.userName}}</span> || <span
						 @click="logout" class="logout">注销</span></span>
				</div>
				<!-- 客户端 -->
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" ref="nav">
					<ul class="nav navbar-nav navbar-right">
						<li :class="{dateTask_click_down:ShowCalendarTask}">
							<a @click="showCalendarTask">任务日历</span></a>
							<!-- task日历任务组件 -->
							<transition name="el-zoom-in-top">
								<DateTask class="transition-box" v-show="ShowCalendarTask"></DateTask>
							</transition>
						</li>
						<li @click="clickMark"><a>新建</span></a></li>
						<!-- 筛选 -->
						<li class="dropdown">
							<a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{label}}
								<span class="caret"></span></a>
							<ul class="dropdown-menu">
								<li @click="clickFilter('全部')"><a>全部<span>{{this.Length}}</span></a></li>
								<li role="separator" class="divider"></li>
								<li @click="clickFilter('生活')"><a>生活<span>{{this.liveLength}}</span></a></li>
								<li @click="clickFilter('学习')"><a>学习<span>{{this.studyLength}}</span></a></li>
								<li @click="clickFilter('工作')"><a>工作<span>{{this.workLength}}</span></a></li>
							</ul>
						</li>
						<!-- 排序 -->
						<li @click="changeUp"><a>按创建时间 <span class="glyphicon glyphicon-arrow-up" v-show="up"></span><span class="glyphicon glyphicon-arrow-down"
								 v-show="!up"></span></a></li>
						<!-- 查询 -->
						<form class="navbar-form navbar-left" role="search">
							<div class="form-group">
								<input type="text" class="form-control" placeholder="Search" @input="inputChange" v-model="inputText">
							</div>
						</form>
					</ul>
				</div>
			</div>
		</nav>
	</div>
</template>

<script>
	import 'bootstrap/dist/css/bootstrap.min.css'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import DateTask from './DateTask.vue'
	export default {
		data() {
			return {
				label: '全部',
				sort: '按创建时间',
				up: false, //排序是升序还是降序
				inputText: '',
				toding: false ,//显示开发中字样
				ShowCalendarTask:false
			}
		},
		components:{
			DateTask
		},
		methods: {
			//vuex中的方法
			...mapMutations([
				'addMemoItem',
				'setShowEdit',
				'deleteMemoItem',
				'setItemContent',
				'filterMemoItem',
				'sortMomeItem',
				'setIsNew',
				'setFilter',
				'setLogin',
				'setUserName',
				'setToken',
				'setIsUP',
				'setShowCalendarTask'
			]),
			//点击新建
			clickMark() {
				this.setIsNew(true) //表示这是新建
				this.$store.commit('setShowEdit', true)
				var reset = {
					type: '', //markdown? poor?
					title: '',
					label: '', //分类
					time: '', //创建时间
					content: '' //内容
				}
				//更改内容
				this.setItemContent(reset)
				//关闭头部导航栏
				$('#bs-example-navbar-collapse-1').collapse('hide')
			},
			//点击显示日历任务
			showCalendarTask(){
				this.setShowCalendarTask()
				this.ShowCalendarTask = !this.ShowCalendarTask
			},
			//筛选选项
			clickFilter(data) {
				this.label = data
				this.filterMemoItem(data)
				//关闭头部导航栏
				$('#bs-example-navbar-collapse-1').collapse('hide')
			},
			//改变排序
			changeUp() {
				this.up = !this.up
				//排序
				this.sortMomeItem(this.up)
				//升降序
				this.setIsUP(this.up)
				//关闭头部导航栏
				$('#bs-example-navbar-collapse-1').collapse('hide')
			},
			//文字筛选
			inputChange() {
				console.log(this.inputText)
				this.setFilter(this.inputText)
			},
			//登陆
			login() {
				this.setLogin(1)
			},
			//注册
			registe() {
				this.setLogin(2)
			},
			//注销
			logout() {
				this.setUserName('')
				this.setToken('')
				this.$message1('注销成功!', 'success')
			},
			//QQ登陆
			QQclick() {
				var a = document.createElement('a')
				a.href =
					'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101851279&redirect_uri=http://lppwork.cn/memo/qqlogin&scope='
				a.click()
			},
			//微信
			weixin() {
				// this.toding = true
				this.$message1('开发中','warning')
			},
			leaveWeixin() {
				this.toding = false
			},
			//绑定快捷键
			hotKey(){
				var keyCode = window.event.keyCode ? window.event.keyCode : window.event.which
				if((window.event.shiftKey)&&(keyCode == 67)){
					this.clickMark()
				}
			}

		},
		computed: {
			...mapState([
				'isShowEdit',
				'memoItem',
				'itemContent',
				'isNew',
				'isLogin',
				'userName',
				'isShowNav'
			]),
			//分类是学习的数量
			studyLength: function() {
				var length = JSON.parse(localStorage.memoItem).filter((item) => {
					return item.label == "学习"
				})
				return length.length
			},
			workLength: function() {
				var length = JSON.parse(localStorage.memoItem).filter((item) => {
					return item.label == "工作"
				})
				return length.length
			},
			liveLength: function() {
				var length = JSON.parse(localStorage.memoItem).filter((item) => {
					return item.label == "生活"
				})
				return length.length
			},
			Length: function() {
				return this.studyLength + this.workLength + this.liveLength
			},
			//return头部导航栏标记
			is: function() {
				return this.isShowNav
			}
		},
		mounted() {},
		created() {
			document.addEventListener('keydown',this.hotKey)
			//焦距表單
		},
		watch: {
			is() {
				console.log($(this.$refs.nav))
				$(this.$refs.nav).collapse()
			},
			
			
		},

	}
</script>

<style lang="scss" scoped="scoped">
	.login {
		position: absolute;
		top: 14px;
		color: #77778c;

		span:hover {
			cursor: pointer;
		}

		.logout {
			color: #dd001b;
			font-weight: 600;
		}
	}

	//第三方登陆
	.other {
		position: absolute;
		left: 120px;
		top: 10px;
		display: flex;
		justify-content: center;
		align-items: center;

		span {
			font-size: 1rem;
		}

		.icon {
			font-size: 28px;
			margin-left: 10px;
		}

		.icon:hover {
			cursor: pointer;
		}
		//装微信图标
		.weixin_wrapper{
			// padding: 0 35px 0 0 ;
			overflow: visible;
			position: relative;
		}

		//开发中
		.toding {
			position: absolute;
			left: 5px;
			top: 33px;
			padding: 0 6px;
			font-size: 0.75rem;
			background-color: #f3cb85;
			color: red;
		}

		.toding:after {
			position: absolute;
			top: -17px;
			left: 10px;
			content: '';
			width: 0;
			height: 0;
			overflow: hidden;
			/*清除ie6下默认的宽高*/
			font-size: 0;
			/*是因为, 虽然宽高度为0, 但在IE6下会具有默认的 */
			line-height: 0;
			/* 字体大小和行高, 导致盒子呈现被撑开的长矩形 */
			border-width: 10px;
			border-style: solid;
			border-color: transparent transparent #f3cb85 transparent;
		}
		
	}

	.navbar-right>li:hover{
		cursor: pointer;
	}
	.dateTask_click_down{
		background-color: #e7e7e7;
	}
</style>

<style>

</style>
