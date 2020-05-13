<template>
	<div class="recordWrapper" ref="record">
		网站备案: <a href="http://beian.miit.gov.cn/" target="_blank">豫ICP备20003279号-1</a>
	</div>
</template>

<script>
	export default{
		name:'record',
		mounted() {
			var top = this.$refs.record.offsetTop
		},
		methods: {},
	}
</script> 

<style lang="scss" scoped="scoped">
	.recordWrapper{
		color: #999;
		text-align: center;
		padding: 10px 0;
		a{
			color: #999;
			&:hover{
				color:#4fc1ed;
			}
		}
	}
</style>
