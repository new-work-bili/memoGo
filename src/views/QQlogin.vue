<template>
	<div class="mask">
		{{masg}}
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
				masg: ''
			}
		},
		methods: {
			getQQ() {
				getTable('/memo/qqlogin/', this.$route.query).then((res) => {
					console.log(111)
					var userData = res.data.userData
					this.$store.commit('setUserName', userData.account)
					this.$store.commit('setToken', res.data.token)
					this.masg = '登陆成功'
					//处理完数据就可以返回主页了
					const that = this
					setTimeout(function() {
						that.$router.replace('/')
					}, 1500)
				}).catch((err) => {
					//报错也要返回过去
					this.masg = '登陆失败'
					setTimeout(function() {
						that.$router.replace('/')
					}, 1500)
				})
			}
		},
		mounted() {
			this.getQQ()
			console.log('qqlogin')
		}
	}
</script>

<style scoped="scoped">
	/* 遮罩 */
	.mask {
		font-size: 18rem;
		font-weight: 900;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: black;
		opacity: 0.65;
		-webkit-text-fill-color: #fff;
		color: #fff;
		animation: move 0.8s cubic-bezier(.21, .35, .9, .48);
	}

	@keyframes move {
		from {
			top: -100%;
		}

		to {
			top: 0;
		}
	}
</style>
