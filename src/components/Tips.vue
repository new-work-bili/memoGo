<template>
	<div class="tips_wrapper">
		<div class="tips" v-for="(text,index) in tipsArr" v-show="text == showTips" :style="tipsStyle(text,index)">Tips:<span v-html="text"></span></div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
				tipsArr: [
				'项目github地址:<a href="http://github.com/new-work-bili/memoGo" target="_blank">github.com/new-work-bili/memoGo</a> ', 		//tips内内容
				'创建项目快捷键:shift+c',
				'您可以在筛选按钮中自定义memo类型',
				'目前尚不支持微信第三方登陆',
				'<a href="#" @click="feedBack">点击</a>反馈,提出您宝贵的意见!'
				], 
				showTips:false,//当前tips是否显示
			}
		},
		//展示提示面板
		methods: {
			changeTips() {
				var num = 1;
				//循环展示tips的内容
				setInterval(() => {
					//展示哪一个
					this.showTips = this.tipsArr[num]
					num++;
					if (num >= this.tipsArr.length) {
						num = 0
					}
				}, 6500) //这个时间要个动画时间配合好

				//往header插入动态的@keyframes动画
				this.tipsArr.forEach((item, index) => {
					this.tipsAnimat(this.strLength(item), index)
				})
			},
			//设置tips动画，并把style插入head中;用索引标记
			tipsAnimat(length, index) {
				var keyStr_header =
					`
					@keyframes go${index} {
					from {
						width: 0rem;
					}
				
					to {
						width: ${length}em;
					}
				}
				
				@keyframes back${index} {
					from {
						width: ${length}rem;
					}
				
					to {
						width: 0em;
					}
				}
				@keyframes blink-caret {
				
					from,
					to {
						border-right: 5px solid transparent;
					}
				
					50% {
						border-right: 5px solid #333;
					}
				}
				`
				// 创建style标签
				const style = document.createElement('style');
				// 设置style属性
				style.type = 'text/css';
				// 将 keyframes样式写入style内
				style.innerHTML = keyStr_header;
				// 将style样式存放到head标签
				//chrome中，document.getElementsByTagName("head")[0];会报错
				var Document = document.head || document.getElementsByTagName("head")[0];
				Document.appendChild(style)
			},
		},
		computed: {
			//计算showTips长度;英文算0.5em
			strLength: function() {
				return function(str) {
					let num = 0;
					//匹配html标签内容，主要是让a标签不计入字符长度
					var reg = /\<(.*?)\>/g		
					var reStr = str.replace(reg,'')
					for (var i = 0; i < reStr.length; i++) {
						var ascll = reStr.charAt(i).charCodeAt()
						if (ascll > 33 & ascll < 126) { //不是汉字的都算0.5
							num += 0.5
						} else {
							num++
						}
					}
					//+5是因为前面还有一个"tips:"
					return Math.ceil(num + 5)
				}
			},
			//设置tips的animation样式
			tipsStyle: function() {
				return function(text, index) {
					var str =
						`go${index} .5s steps(${this.strLength(text)}, end) forwards  , back${index} .5s steps(${this.strLength(text)}, end) forwards 6s , blink-caret .75s infinite`
					// var str = `go0 .5s steps(22) forwards, back0 .5s steps(22) forwards 6s , blink-caret .75s infinite`
					return {
						animation: str
					}
				}

			},
		},
		mounted() {
			//初始haulshowTips,因为定时器后置
			this.showTips=this.tipsArr[0]
			this.changeTips()
			
		},
	}
</script>

<style lang="scss">
	.tips {
		font-weight: 600;
		overflow: hidden;
		word-break: break-all;
		font-family: Consolas, Monaco;
		text-indent: 15px;
		height: 1.25em;
		white-space: nowrap;
		// color: #777;
	}
	
	.tips_wrapper{
		position: absolute;
		left: 30%;
		top: 12px;
		height: 1.25em;
		z-index: 99;
	}
	
	// 提示面板
	@media screen and (max-width: 1200px) {
		.tips {
			display: none;
		}
	}
</style>
