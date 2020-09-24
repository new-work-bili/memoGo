<template>
	<div class="wrappers" role="navigation" >
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
					<span class="login" v-show="!this.$store.state.userName"><span @click="login" class="login_login">登录</span>
						<span @click="registe" class="login_registe">注册</span></span>
					<div class="other col-xs-6 col-sm-3 col-md-3 col-lg-2" v-show="!this.$store.state.userName">
						<span class="other_login">第三方登陆:</span>
						<svg class="icon" aria-hidden="true" @click="QQclick">
							<use xlink:href="#icon-QQ1"></use>
						</svg>
						<span class="weixin_wrapper">
							<svg class="icon" aria-hidden="true" @click="weixin">
								<use xlink:href="#icon-weixin"></use>
							</svg>
							<span class="toding" v-show="toding">开发中</span>
						</span>

					</div>
					<span class="login" v-show="this.$store.state.userName"><span>{{this.$store.state.userName}}</span> || <span
						 @click="logout" class="logout">注销</span></span>
				</div>
				<!-- PC端 -->
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" ref="nav">
					<ul class="nav navbar-nav navbar-right">
						<li :class="{dateTask_click_down:ShowCalendarTask}" @click="RstopProp">
							<a @click="showCalendarTask_click">任务日历</span></a>
							<!-- task日历任务组件 -->
							<transition name="el-zoom-in-top">
								<DateTask class="transition-box" v-show="ShowCalendarTask"></DateTask>
							</transition>
						</li>
						<li @click="clickMark"><a>新建</span></a></li>
						<!-- 筛选—_手机端 -->
						<li class="dropdown all_li">
							<a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
							 @click="showAll = !showAll">{{label}}
								<span class="caret"></span></a>
							<ul class="dropdown-menu">
								<li @click="clickFilter('全部')"><a>全部<span class="phone_label_length">{{this.$store.state.AllLabel}}</span></a></li>
								<li role="separator" class="divider"></li>
								<li v-for="value in testArr" :key="value" @click="clickFilter(value)">
									<a>{{value}}<span class="phone_label_length">{{labelLength(value)}}</span></a>
									<!-- 删除 -->
									<span class="phone_delet_label iconfont icon-shanchu" @click.stop="deletLabel(value)" v-if="isNewlabel(value)"></span>
								</li>
							</ul>
						</li>
						<!-- 筛选—_电脑端 -->
						<li class="_all_li" @click="SstopProp">
							<a @click="showAll = !showAll;show_add_input = false">{{label}}<span class="caret"></span></a>
							<transition name="el-zoom-in-top">
								<div v-show="showAll" class="all">
									<ul>
										<!-- <li @click="clickFilter('全部')"><a>全部<span>{{this.Length}}</span></a></li> -->
										<li @click="clickFilter('全部')"><a>全部<span class="pc_label_length">{{this.$store.state.AllLabel}}</span></a></li>
										<hr>
										<!-- 循环出类别列表 -->
										<li v-for="value in testArr" :key="value" @click="clickFilter(value)">
											<a>{{value}}<span class="pc_label_length">{{labelLength(value)}}</span></a>
											<!-- 删除 -->
											<span class="delet_label iconfont icon-shanchu" @click.stop="deletLabel(value)" v-if="isNewlabel(value)"></span>
										</li>
										<!-- 添加类别 -->
										<li class="add" @click="addLabel">
											<a v-show="!show_add_input">+</a>
											<input type="text" v-show="show_add_input" class="add_input" @keyup.enter="addInput" v-model="addInputtData">
										</li>
									</ul>
								</div>
							</transition>
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

				<!-- tips,提示面板 -->
				<Tips></Tips>
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
	import {
		postTable,
		getTable
	} from '../http/func.js'
	import DateTask from './DateTask.vue'
	import Tips from './Tips.vue'
	export default {
		data() {
			return {
				label: '全部',
				sort: '按创建时间',
				up: false, //排序是升序还是降序
				inputText: '',
				toding: false, //显示开发中字样
				ShowCalendarTask: this.winodwControlShowTask,	//是否显示日历
				showAll: false, //是否显示筛选菜单
				show_add_input: false, //显示添加分类的表单
				addInputtData: '', //添加的新类别内容
			}
		},
		props:['winodwControlShowTask'],
		components: {
			DateTask,
			Tips
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
				'setShowCalendarTask',
				'setlabelArr'
			]),
			//阻止冒泡,防止点击日历的时候也触发全局点击，进而导致菜单隐藏
			RstopProp(e){
				this.showAll = false;
				e.stopPropagation()
			},
			//筛选
			SstopProp(e){
				this.ShowCalendarTask = false
				e.stopPropagation()
			},
			//点击 +
			addLabel() {
				this.show_add_input = true
				this.$nextTick(() => {
					$('.add_input').focus()
				})
			},
			//回车,添加类别-----》得触发一下让length跟新
			addInput() {
				console.log('this.labelArr:', this.labelArr)
				if (this.labelArr.indexOf(this.addInputtData) != -1) {
					this.$message1('已存在该类型!', 'error')
					return
				} else if (this.addInputtData.length >= 5) {
					this.$message1('长度过长!', 'warning')
					return
				} else if (this.addInputtData === '') {
					this.$message1('不可为空!', 'warning')
					return
				} else if (this.labelArr.length + 1 >= 10) {
					this.$message1('类型超过规定数量!', 'warning')
					return
				} else {
					var _labelArr = this.labelArr
					this.show_add_input = false
					_labelArr.push(this.addInputtData)
					this.setlabelArr(_labelArr)
					postTable('/changeLabel/', {
						labelArr: this.labelArr
					}).then((res) => {

					})
					this.addInputtData = ''
				}

			},
			//删除对应的
			deletLabel(label) {
				var _labelArr = this.labelArr
				console.log('删除时遍历的_labelArr:', _labelArr)
				_labelArr.forEach((item, index) => {
					if (item == label) {
						_labelArr.splice(index, 1)
					}

				})
				// console.log('删除之后赋值的_labelArr:', _labelArr)
				this.setlabelArr(_labelArr)
				// console.log('localStorage.labelData:', localStorage.labelData)
				postTable('/changeLabel/', {
					labelArr: _labelArr
				}).then((res) => {

				})

				//删除对应标签的所有memo

			},
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
			showCalendarTask_click() {
				console.log('点击日历，显示');
				//延迟执行；先让触发全局点击的执行；
				setTimeout(()=>{
					this.setShowCalendarTask()
					this.ShowCalendarTask = !this.ShowCalendarTask
				},0)
			},
			//筛选选项
			clickFilter(data) {
				console.log('clickFilter')
				this.showAll = !this.showAll
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
				postTable('/login/logout/').then(() => {})
					.finally(() => {
						this.setUserName('')
						this.setToken('')
					})
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
				this.$message1('尚不支持微信登陆!', 'warning')
			},
			//绑定快捷键
			hotKey() {
				var keyCode = window.event.keyCode ? window.event.keyCode : window.event.which
				if ((window.event.shiftKey) && (keyCode == 67)) {
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
				'isShowNav',
				'labelArr',
				// 'showCalendarTask'	//vuex中控制日历显示隐藏
			]),
			//对应label的数量
			labelLength: function() {
				
				return function(label) {
					var length = JSON.parse(localStorage.memoItem).filter((item) => {
						return item.label == label
					})
					return length.length
				}
			},
			//判断是否是用户新增的label
			isNewlabel: function() {
				var oldArr = ['学习', '生活', '工作']
				return function(label) {
					if (oldArr.indexOf(label) == -1) {
						return true
					} else {
						return false
					}
				}
			},
			//return头部导航栏标记
			is: function() {
				return this.isShowNav
			},
			//遍历自定义的label数组
			testArr: function() {
				var arr = ['生活', '学习', '工作']
				if (this.labelArr.length != 0) {
					return this.labelArr
				}
				return arr
			}
		},
		mounted() {

		},
		created() {
			document.addEventListener('keydown', this.hotKey)
			//焦距表單
		},
		watch: {
			winodwControlShowTask(){	//点击全局 菜单消失
				console.log('watch_winodwControlShowTask设置')
				this.ShowCalendarTask =false;
				this.showAll = false;
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	// 提示面板
	.tips {
		position: absolute;
		top: 12px;
		font-weight: 600;
		left: 30%;
		overflow: hidden;
		word-break: break-all;
		font-family: Consolas, Monaco;
		text-indent: 15px;
		height: 1.25em;
		white-space: nowrap;
	}

	.login {
		position: absolute;
		top: 14px;
		color: #333;

		span:hover {
			cursor: pointer;
		}

		.login_login {
			font-weight: 600;
			padding: 5px 10px;
			background-color: #35d435;
		}

		.login_registe {
			font-weight: 600;
			padding: 3px 7px;
			margin-left: 5px;
			border: 2px solid #35d435;
			box-sizing: border-box;
			color: #35d435;
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
			color: #777;
		}

		.icon {
			font-size: 28px;
			margin-left: 10px;
		}

		.icon:hover {
			cursor: pointer;
		}

		//装微信图标
		.weixin_wrapper {
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

	.navbar-right>li:hover {
		cursor: pointer;
	}

	.dateTask_click_down {
		background-color: #e7e7e7;
	}

	//全部分类列表
	.all {
		position: absolute;
		left: -35px;
		width: 135px;
		min-width: 100px;
		border: 1px solid rgba(0, 0, 0, .15);
		box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
		background-color: #fff;

		&>ul>li {
			text-align: center;

			&:hover {
				text-decoration: none;
				background-color: #e7e7e7;
			}

			a {
				color: #777;

				&:hover {
					text-decoration: none;
				}
			}
		}

		.add {
			font-size: 1.25rem;
			font-weight: 900;

			.add_input {
				width: 100%;
				box-sizing: border-box;
			}
		}

		.delet_label {
			position: absolute;
			right: 5px;
			// top: 0;
			font-size: 1.15rem;
			color: #dd001b;

			&:hover {
				color: red;
			}
		}

		hr {
			margin: 4px 0;
		}
	}

	.pc_label_length,
	.phone_label_length {
		font-weight: 900;
		margin-left: 4px;
	}

	//手机端label
	.all_li {
		.phone_delet_label {
			color: #dd001b;
			font-size: 1.35rem;
			position: absolute;
			right: 15px;
		}

		li {
			display: flex;
			// justify-content: center;
			// align-items: center;
		}

	}


	@media screen and (min-width: 768px) {
		._all_li {
			position: relative;
			display: block;
		}

		.all_li {
			display: none;
		}
	}

	@media screen and (max-width: 768px) {
		._all_li {
			position: relative;
			display: none;
		}

		.all_li {
			display: block;
		}
	}

	// 提示面板
	// @media screen and (max-width: 1200px) {
	// 	.tips {
	// 		display: none;
	// 	}
	// }
</style>
