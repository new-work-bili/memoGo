<template>
	<div class="wrapper">
		登陆成功!
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import {postTable,getTable} from '../http/func.js'
	export default{
		data() {
			return { 
			}
		},
		methods: {
			getQQ() {
				getTable('/memo/qqlogin/',this.$route.query).then((res)=>{
					console.log(111)
					var userData = res.data.userData
					this.$store.commit('setUserName',userData.account)
					this.$store.commit('setToken',res.data.token)
					//处理完数据就可以返回主页了
					var a = document.createElement('a')
					a.href = '/'
					setTimeout(function(){
						a.click()
					},1500)
					
				}).catch((err)=>{
					//报错也要返回过去
					var a = document.createElement('a')
					a.href = '/'
					setTimeout(function(){
						a.click()
					},1500)
				})
			}
		},
		mounted() {
			this.getQQ()
			console.log('qqlogin')
		}
	}
</script>

<style>
</style>
