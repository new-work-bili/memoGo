<template>
	<div class="login_wrapper">
		<div class="right">
			<!-- 保存 -->
			<span @click="close" class="glyphicon glyphicon-remove"></span>
		</div>
		<form class="form-horizontal form_box" role="form">
			<div class="form-group">
				<label for="inputPassword" class="col-sm-2 control-label">账号</label>
				<div class="col-sm-10">
					<input v-model="form.account" type="text" class="form-control" id="inputAccount" placeholder="请输入账号">
				</div>
			</div>
			<div class="form-group">
				<label for="inputPassword" class="col-sm-2 control-label">密码</label>
				<div class="col-sm-10">
					<input v-model="form.password" type="password" class="form-control" id="inputPassword" placeholder="请输入密码">
				</div>
			</div>
			<div v-if="this.$store.state.isLogin == 1">
				<span @click.prevent="login" class="login_login">登录</span>
			</div>
			<div v-if="this.$store.state.isLogin == 2">
				<span @click.prevent="registe" class="login_registe">注册</span>
			</div>
		</form>
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
	import 'bootstrap/dist/css/bootstrap.min.css'
	export default {
		data() {
			return {
				form: {
					account: 'admin',
					password: 'admin'
				},
			}
		},
		methods: {
			...mapMutations([
				'addMemoItem',
				'setShowEdit',
				'setItemContent',
				'setIsNew',
				'setLogin',
				'setToken',
				'setUserName',
				'initItem',
				'setlabelArr',
				'setTaskData'
			]),
			close() {
				this.setLogin(false)
				this.form = {
					account: '',
					password: ''
				}
			},
			//登陆
			login() {
				if (this.form.account == '' || this.form.password == '') {
					this.$message1('请输入账号或密码!', 'warning')
					console.log(111)
				} else {
					postTable('/login/', this.form).then((res) => {
						if (res.data.code == 1 && res.data.token) {
							this.setToken(res.data.token)
							this.setUserName(res.data.username)
							this.setLogin(false)
							this.init()
							this.form = {
								account: '',
								password: ''
							}
						} else if (res.data.code == 0) {
							this.$message1('密码错误请重试!', 'error')
						}
					}).catch((err) => {

					})
				}

			},
			//注册
			registe() {
				if (this.form.account == '' || this.form.password == '') {
					this.$message1('请输入账号或密码!', 'warning')
				} else {
					postTable('/login/registe/', this.form).then((res) => {
						this.setLogin(false)
					}).catch((err) => {

					})
				}
			},
			//获取用户表格
			init() {
				if (this.userName) {
					postTable('/init/', {
						userName: this.userName
					}).then((res) => {
						//memo数据
						this.initItem(res.data.userData)
						let _taskData = res.data.taskData
						//task数据
						this.setTaskData(_taskData)
						//每次init接收新token
						if (res.data.token) {
							this.setToken(res.data.token)
						}
						console.log('登陆init token:', res.data.token)
						//自定义的label信息
						if (res.data.labelData && Object.values(res.data.labelData).length != 0) {
							this.setlabelArr(res.data.labelData)
						}

					}).catch((err) => {})
				} else {
					console.log('没有用户名')
				}
			}
		},
		computed: {
			...mapState([
				'isShowEdit',
				'mainType', //编辑模块显示markdown还是poor
				'memoItem',
				'itemContent',
				'isNew',
				'isLogin',
				'token',
				'userName'
			])
		},
		created() {
			if (process.env.NODE_ENV === 'production') {
				this.form.account = ''
				this.form.password = ''
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	// 登录按钮
	.login_login {
		font-weight: 600;
		padding: 10px 15px;
		background-color: #35d435;
		&:hover{
			cursor: pointer;
		}
	}
	
	.login_registe {
		font-weight: 600;
		padding: 8px 14px;
		margin-left: 5px;
		border: 3px solid #35d435;
		box-sizing: border-box;
		color: #35d435;
		&:hover{
			cursor: pointer;
		}
	}
	
	@media screen and (min-width: 767px) {
		.login_login,.login_registe{
			margin-left: 70px;
		}
	}

	.login_wrapper {
		padding: 6px;
		box-shadow: 0 0 5px #fff;
		border-radius: 5px;

		.right {
			position: absolute;
			right: 6px;
			top: 6px;

			span {
				padding: 2px 3px;
			}

			&>span:hover {
				cursor: pointer;
			}
		}

		.form_box {
			padding: 50px;
		}
	}
</style>
