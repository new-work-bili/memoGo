<template>
	<div class="tips_wrapper">
		<!-- <div class="tips" v-for="(text,index) in tipsArr" v-show="text == showTips" :style="tipsStyle(text,index)">Tips:{{text}}</div> -->
		<p v-show="this.$store.state.showMessageTips" :style="tipsStyle" class="tips">{{this.$store.state.showMessageTips}}</p>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tipsArr: ['项目github地址:github.com/new-work-bili/memoGo ', //tips内内容
					'创建项目快捷键:shift+c',
					'您可以在筛选按钮中自定义memo类型',
					'目前尚不支持微信第三方登陆',
				],
				showTips: false, //当前tips是否显示
				message: '请求成功!'
			}
		},
		//展示提示面板
		methods: {
			changeTips() {
				var num = 1;
				//循环展示tips的内容
				setInterval(() => {
					//展示哪一个
					// this.showTips = this.tipsArr[num]
					// num++;
					// if (num >= this.tipsArr.length) {
					// 	num = 0
					// }
					
					this.$store.state.showMessageTips = true
					
					this.showTips = false
					
				}, 3100) //这个时间要个动画时间配合好

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
					for (var i = 0; i < str.length; i++) {
						var ascll = str.charAt(i).charCodeAt()
						// if ((ascll > 65 && ascll < 90) || (ascll > 97 && ascll < 122)) {
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
				// var str =
				// 	`go${index} .5s steps(${this.strLength(text)}, end) forwards  , back${index} .5s steps(${this.strLength(text)}, end) forwards 6s , blink-caret .75s infinite`
				var str = 'go5 .15s steps(6,end) forwards, back5 .1s steps(6,end) forwards 3s , blink-caret .75s infinite'
				return {
					animation: str
				}

			},
		},
		mounted() {
			//初始haulshowTips,因为定时器后置
			this.showTips = true
			this.changeTips()

		},
		watch: {
			// showTips(newValue, oldValue) {
			// 	return
			// }
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
	}

	.tips_wrapper {
		position: absolute;
		left: 30%;
		top: 12px;
		height: 1.25em;
		z-index: 99;
	}

	// 为message设置的东阿虎
	@keyframes go5 {
		from {
			width: 0rem;
		}

		to {
			width: 6em;
		}
	}

	@keyframes back5 {
		from {
			width: 6rem;
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

	// 提示面板
	// @media screen and (max-width: 1200px) {
	// 	.tips {
	// 		display: none;
	// 	}
	// }
</style>
