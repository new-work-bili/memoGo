<template>
	<div class="form_slot">
		<!-- 关闭 -->
		<span @click="close" class="glyphicon glyphicon-remove close"></span>
		<p class="title"><slot name="title"></slot></p>
		<div class="form">
			<slot name="form"></slot>
		</div>
		<div class="button">
			<slot name="button"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			click: String
		},
		data() {
			return {
				onClick: this.click
			}
		},
		methods: {
			close() {
				console.log('click:', this.click)
				switch (this.click) {
					case 'FeedBack':
						this.$store.state.showFeedBack = false;
					case 'Login':
						this.$store.state.isLogin = false;
				}
			}
		}
	}
</script>

<style lang="scss">
	.form_slot {
		position: relative;
	}

	//X好
	.close {
		position: absolute;
		right: 6px;
		top: 6px;
		padding: 13px;

		&:hover {
			cursor: pointer;
		}
	}
	
	.title{
		font-weight: 600;
	}

	.form_slot {
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
