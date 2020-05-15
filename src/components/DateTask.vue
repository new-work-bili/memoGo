<template>
	<div class="task_wrapper">
		<!-- 显示日期 -->
		<div class="header">
			<!-- 向前选择月、年 -->
			<div class="date_last">
				<span class="el-icon-d-arrow-left" @click="changeDate('preYear')"></span>
				<span class="el-icon-arrow-left" @click="changeDate('preMonth')"></span>
			</div>
			<div class="date_now">{{`${year}年${month}月${day}日`}}</div>
			<div class="date_next">
				<span class="el-icon-arrow-right" @click="changeDate('nextMonth')"></span>
				<span class="el-icon-d-arrow-right" @click="changeDate('nextYear')"></span>
			</div>
		</div>
		<!-- 日历 -->
		<div class="canlendar">
			<!-- 周 -->
			<ul class="canlendar_week">
				<li v-for="item in week">{{item}}</li>
			</ul>
			<ul class="canlendar_week">
				<!-- 上个月:上个月的天数先减去空着的，这样平了，再一个一个加index -->
				<li v-for="index in topNumber" class="last_month">
					<span @click="changeDate('preMonth')">{{beforeMonth-topNumber+index}}</span>
				</li>
				<!-- 本月的 -->
				<li v-for="index in monthList[month-1]" :class="{'today':day == index&&month == trueMonth,'have_task':isHaveTask(index),'before_task':isBeforeTask(index)}"
				 class="task_li">
					<!-- 日期 -->
					<span @click="showTask(index)">
						{{index}}
					</span>
					<!-- 添加/编辑task信息-->
					<transition name="el-zoom-in-top">
						<!--zoom动画 -->
						<div class="task_animate_box transition-box" v-show="clickDay == index&&show2">
							<div class="task" ref="task">
								<div class="task_flex">
									<input class="task_input" v-model="taskInput" @keyup.enter="saveTask(index)">
									<button @click="saveTask(index)">保存</button>
									<button @click="deleteTask(index)" v-if="isHaveTask(index)">删除</button>
								</div>
								<p class="close_task" @click="closeTask">关闭</p>
							</div>
						</div>

					</transition>
					<!-- 已有的task信息 -->
					<p class="show_task_text" ref="show_task_text" style="top: 0px;">
						{{isHaveTask(index)}}
					</p>
				</li>
				<!-- 下个月的 -->
				<li v-for="index in bottomNumber" class="next_month">
					<span @click="changeDate('nextMonth')">{{index}}</span>
				</li>
			</ul>
		</div>

	</div>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {
		postTable,
		getTable
	} from '../http/func.js'
	export default {
		data() {
			return {
				year: 0, //当前年
				month: 0,
				day: 0,
				week: ['一', '二', '三', '四', '五', '六', '日'],
				monthList: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //12月份中各有多少天
				topNumber: 0, //本月的第一天前面要有几个空着的
				bottomNumber: 0, //本月的最后一天后面要有几个空着的
				beforeMonth: 0, //上一个月有几天
				clickDay: 0, //点击的天数
				taskInput: '', //task内容
				taskData_: {
					"5/3": "4ddd56"
				}, //所有task数据
				trueMonth: 0, //保存当前月份
				show2: false
			}
		},
		methods: {
			//获取今天日期
			getDateNow() {
				var date = new Date()
				this.year = date.getFullYear()
				this.month = date.getMonth() + 1
				this.day = date.getDate()
				//判断闰年
				if (
					(this.year % 4 === 0 && this.year % 100 !== 0) ||
					this.year % 400 === 0
				) {
					this.monthList[1] = 29
				} else {
					this.monthList[1] = 28
				}
				//保存当前月份
				this.trueMonth = date.getMonth() + 1

			},
			// 根据年月日获得为星期几
			getWeekDay(year, month, day) {
				//getDay()获取的星期几是0[周日]~6[周六]
				var weekDate = new Date(`${year}/${month}/${day}`).getDay()
				return weekDate == 0 ? 7 : weekDate
			},
			initData() {
				//该月第一天是星期几
				var firstDay = this.getWeekDay(this.year, this.month, 1)
				var six = false; //已经6行
				//计算前面有多少空位留着展示上一个月的日期:--->为了操作优化 最后必须是固定6行
				if (firstDay - 1 == 0) { //如果是星期一就多空一行
					this.topNumber = 7
					six = true
				} else {
					this.topNumber = firstDay - 1
				}

				//该月最后一天是星期几
				var lastsDay = this.getWeekDay(this.year, this.month, this.monthList[this.month - 1])
				//计算月底有多少空位留着展示下个月的日期
				if (!six && this.monthList[this.month - 1] == 30) { //针对有30、31天的月份进行优化，避免变成7行
					if (firstDay == 7 && lastsDay == 1) {
						six = true
					}
				} else if (!six && this.monthList[this.month - 1] == 31) {
					if (firstDay == 6 || lastsDay == 2) {
						six = true
					}
				}
				if (7 - lastsDay == 0 || !six) { //多加一行
					this.bottomNumber = 14 - lastsDay
				} else {
					this.bottomNumber = 7 - lastsDay
				}


				//上一个月有几天
				this.beforeMonth = this.month - 1 === 0 ? 31 : this.monthList[this.month - 2]
			},
			//改变日期
			changeDate(data) {
				switch (data) {
					case 'preYear':
						this.year -= 1
						break
					case 'preMonth':
						// 当前月份为1月， 上一个月分为12月，年份减1
						if (this.month === 1) {
							this.month = 12
							this.year -= 1
						} else {
							this.month -= 1
						}
						break
					case 'nextYear':
						this.year += 1
						break
					case 'nextMonth':
						// 当前月份为12月， 下个月分为1月，年份加1
						if (this.month === 12) {
							this.month = 1
							this.year += 1
						} else {
							this.month += 1
						}
						break
					default:
						break
				}
				//根据数据的改变在进行初始化
				this.initData()
				this.clickDay = false
			},
			//显示任务编辑
			showTask(day) {
				this.clickDay = day
				this.taskInput = ''
				this.show2 = !this.show2
				this.$nextTick(() => { // 自动获取焦点，要nextTick里获取点击之后已经显示的.task
					$('.task_input').focus()
				})


			},
			//保存task
			saveTask(day) {
				if (!this.taskInput) {
					this.$message1('不可为空', 'wangning')
					return
				}
				var date = `${this.year}/${this.month}/${day}`
				console.log(this.taskData, this.taskData.length)
				this.taskData[date] = this.taskInput
				this.$store.commit('setTaskData', this.taskData)
				// this.clickDay = false
				this.show2 = false

				//同步服务器
				this.upServe()
				this.setTaskTop()
			},
			//删除task
			deleteTask(day) {
				var date = `${this.month}/${day}`
				delete this.taskData[date]
				this.$store.commit('setTaskData', this.taskData)
				this.show2 = false

				//同步服务器
				this.upServe()
			},
			//同步服务器
			upServe() {
				if (this.userName) {
					postTable('/taskData/', {
						taskData: this.taskData,
						userName: this.userName
					}).then((res) => {

					}).catch((err) => {

					})
				} else {
					console.log('无用户名,未登录?')
				}
			},
			//关闭task
			closeTask() {
				this.show2 = false
			},
			//手动设置task信息 的top
			setTaskTop(){
				if (this.showCalendarTask) {
					this.$refs.show_task_text.forEach((item) => {
						item.style.top = -item.offsetHeight-10+'px'
					})
				}
			}
		},
		computed: {
			...mapState([
				'taskData',
				'userName',
				'showCalendarTask'
			]),
			//本日是否含有task
			isHaveTask() {
				return function(day) {
					for (var key in this.taskData) {
						var split = key.split('/')
						var taskKyeYear = split[0]
						var taskKyeMonth = split[1]
						var taskKyeDay = split[2]
						if (taskKyeYear == this.year && taskKyeMonth == this.month && taskKyeDay == day) {
							return this.taskData[key]
						}
					}
					return false
				}
			},
			//判断该日历上的日期是不是已经过了的 task
			isBeforeTask() {
				return function(day) {
					return (this.isHaveTask(day) && this.month < this.trueMonth) || (this.isHaveTask(day) && this.day > day && this.month ==
						this.trueMonth)
				}
			},
			
		},
		created() {
			this.getDateNow()
			this.initData()

		},
		mounted() {
		},
		watch: {
			//手动设置task信息 的top，
			showCalendarTask(newValue) {
				this.setTaskTop()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.task_wrapper {
		position: absolute;
		z-index: 100;
		// top: 50%;
		// left: 50%;
		// transform: translate(-50%, -50%);
		// background-color: red;

		//头部日期
		.header {
			font-size: 1.5rem;
			background-color: firebrick;
			display: flex;
			justify-content: space-between;
			background-color: #8cc4fc;

			.date_last,
			.date_next {
				margin: 0 15px;

				span {
					padding: 0 5px;
				}

				span:hover {
					cursor: pointer;
				}
			}
		}

		//日历
		.canlendar {
			background-color: #d1e7fe;

			.canlendar_week {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;

				li {
					width: 13%;
					height: 40px;
					text-align: center;
					line-height: 40px;
					margin: 1px;

					span {
						display: inline-block;
						width: 30px;
						height: 30px;
						line-height: 30px;
						margin: 0 auto;
						border-radius: 50%;
					}

					span:hover {
						cursor: pointer;
						color: #409eff;
						font-weight: 600;
					}
				}

				.last_month,
				.next_month {
					color: #c0c9db;
				}

				.today>span {
					background-color: #409eff;
					color: #fff;
					font-weight: 600;
				}

				//本月日期li
				.task_li {
					position: relative;
				}

				//含有task任务的日期
				.have_task {
					background-color: #ffbb00;
					// background-color: #26a65b;
				}

				//在本日之前的task
				.before_task {
					background-color: #fff0f0;
					// background-color: #d0d0d0;
				}

				.have_task:hover .show_task_text {
					z-index: 99;
					opacity: 1;
					//
					transform: scaleY(1) translateX(-50%); //scaleY翻转
					transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
				}

				//显示task信息
				.show_task_text {
					line-height: 22.4px;
					position: absolute;
					z-index: -1;
					width: 180px;
					word-wrap: break-word;
					left: 50%;
					top: -30px;
					text-align: center;
					background-color: #fff;
					box-shadow: 0px 0px 5px #333333;
					opacity: 0;
					//
					transform-origin: center bottom; //设置翻转轴心在底部，达到从下至的效果
					transform: scaleY(0) translateX(-50%);

				}

				//划过带有task的日期时显示task信息
				.today>span:hover {
					background-color: #409eff;
					color: #fff;
					font-weight: 600;
				}
			}

			.task_animate_box {
				z-index: 99;
				position: absolute;
			}

			.task {
				position: absolute;
				color: #000;
				transform: translate(-22%, 19%);
				z-index: 99;

				.task_flex {
					flex-wrap: wrap;
					display: flex;
					width: 250px;
					line-height: 22px;

					button {
						width: 50px;
					}

					input {
						width: 150px;
					}
				}

				.close_task {
					width: 150px;
					// height: 20px;
					line-height: 20px;
					font-weight: 900;
					color: red;
					border: 2px red dashed;
					margin-top: 1px;
				}

				.close_task:hover {
					cursor: pointer;
				}
			}
		}
	}

	@media (max-width :768px) {
		.task_wrapper {
			width: 100%;
			position: static;

			//编辑task的input、button
			.canlendar .task .task_flex {
				width: 100px;
			}
		}
	}

	@media (min-width:768px) {
		.task_wrapper {
			width: 450px;
		}
	}
</style>
