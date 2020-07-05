<template>
	<div class="feed_back" >
		<!-- 关闭 -->
		<span @click="close" class="glyphicon glyphicon-remove close" ></span>
		<p class="title">遇到BUG或者有什么意见请告诉我吧:</p>
		<textarea class="text-content form-control" v-model="text"></textarea>
		<span class="up" @click="upContent">提交</span>
	</div>
</template>

<script>
	import {postTable} from '../http/func.js'
	export default {
		data() {
			return {
				text: '',
				showFeedBack: false
			}
		},
		methods: {
			close() {
				this.$store.state.showFeedBack = false
			},
			upContent(){
				postTable('/sendEmali/',{text:this.text}).then((res)=>{
					
				})
				this.$store.state.showFeedBack = false
			}
		},
		mounted() {
			this.$store.state.showFeedBack = false
		}

	}
</script>

<style lang="scss" scoped="scoped">
	.title{
		font-weight: 600;
	}
	//X好
	.close{
		position: absolute;
		right: 6px;
		top: 6px;
		padding: 3px;
		&:hover{
			cursor: pointer;
		}
		
	}
	//提交
	.up {
		font-weight: 600;
		padding: 10px 15px;
		background-color: #35d435;

		&:hover {
			cursor: pointer;
		}
	}

	.feed_back {
		position: absolute;
		top: 50%;
		left: 50%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: 350px;
		height: 250px;
		z-index: 99;
		padding: 15px;
		background-color: #fff;

		box-shadow: 0 0 5px #fff;
		border-radius: 5px;
		
		textarea {
			font-size: 14px;
			height: 150px;
			margin-top: 10px;
			padding: 5px;
			margin-bottom: 15px;
		}
	}
</style>
