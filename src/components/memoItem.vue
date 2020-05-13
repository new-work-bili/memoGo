<template>
	<div class="memo-wrapper">
		<div class="memo">
			<div class="header">
				<div class="top">
					<p class="title">{{item.title}}</p>
					<!-- 图标 -->
					<div class="tool">
						<span class="iconfont icon-zhiding" v-if="item.type == 0" @click="setTop(item)"></span>
						<span class="top iconfont icon-zhiding" v-if="item.type == 1" @click="setTop(item)"></span>
						<span class="add iconfont icon-bianji1" @click="edit"></span>
						<span class="delete iconfont icon-shanchu" @click="deletes"></span>
					</div>
				</div>
				<div class="bottom">
					<div class="time">{{time}}</div>
					<div class="sort">
						<svg class="icon" aria-hidden="true" v-if="item.label == '工作'">
							<use xlink:href="#icon-gongzuotai"></use>
						</svg>
						<svg class="icon" aria-hidden="true" v-if="item.label == '学习'">>
							<use xlink:href="#icon-xuexizhongxin"></use>
						</svg>
						<svg class="icon" aria-hidden="true" v-if="item.label == '生活'">
							<use xlink:href="#icon-shenghuo"></use>
						</svg>
						<!-- 分类： -->
						{{item.label}}
					</div>
				</div>
			</div>
			<!-- markdown -->
			<div class="content">
				{{item.content}}
			</div>
		</div>

	</div>

</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import {postTable,getTable} from '../http/func.js'
	export default {
		data() {
			return {

			}
		},
		props: ['item'],
		methods: {
			//vuex中的方法
			...mapMutations([
				'addMemoItem',
				'setShowEdit',
				'deleteMemoItem',
				'setItemContent',
				'setIsNew',
				'setTopStore'
			]),
			//删除
			deletes() {
				console.log(this.item.time)
				this.deleteMemoItem(this.item.time)
				postTable('/delete/', {
					time: this.item.time
				}).then((res) => {

				}).catch((err) => {

				})
			},
			//编辑
			edit() {
				this.setIsNew(false) //表示这是编辑
				this.setShowEdit(true)
				this.setItemContent(this.item)
				console.log(this.itemContent)
			},
			//置顶
			setTop(item) {
				this.setTopStore([item.type, item.time])
				//更新服务器数据
				postTable('/setTop/',{item:item})
			},
			//转成日期形式
			add0(m) {
			  return m < 10 ? "0" + m : m;
			},
			//时间戳-->2020-04-27 22:38:21
			changeTime(timestamp) {
			  //时间戳是整数，否则要parseInt转换
			  var time = new Date(timestamp);
			  var y = time.getFullYear();
			  var m = time.getMonth() + 1;
			  var d = time.getDate();
			  var h = time.getHours();
			  var mm = time.getMinutes();
			  var s = time.getSeconds();
			  return (
			    y +
			    "-" +
			    this.add0(m) +
			    "-" +
			    this.add0(d) +
			    " " +
			    this.add0(h) +
			    ":" +
			    this.add0(mm) +
			    ":" +
			    this.add0(s)
			  );
			}
		},
		computed: {
			time: function() {
				return this.changeTime(this.item.time)
			},
			...mapState([
				'isShowEdit',
				'memoItem',
				'itemContent',
				'isNew'
			]),
		}
	}
</script> 

<style scoped lang="scss">

	.memo-wrapper {
		padding: 0 5px;
		margin: 5px 0;
		box-sizing: border-box;
		float: left;
		.memo {
			background-color: $bg_color;
			border: 1px solid $border_color;
			border-radius: 5px;
			padding: 10px;
			.header {
				.top {
					height: 18.5px;
					.title {
						height: 18.5px;
						display: inline-block;
						width: 60%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						padding: 0 0 4px 0;
						font-weight: 600;
						border-bottom: 1px solid #bdbdbd;
					}

					.tool {
						float: right;
						margin-top: 2px;

						.delete {
							color: #dd001b;
						}

						.top {
							color: #55ff55;
							color: #3bec3b;
						}

						&>span:hover {
							cursor: pointer;
						}

						&>span {
							font-size: 18px;
							margin-right: 3px;
						}
					}
				}

				.bottom {
					.time {
						font-size: 0.75rem;
						padding: 5px 0 3px;
					}
					//分类
					.sort{
						font-size: 0.85rem;
						svg{
							font-size: 1.25rem;
						}
						
					}
				}
			}
			//内容
			.content {
				word-wrap: break-word;
				word-break: normal;
				height: 242.4px;
				overflow-y: auto;
				ul{
					list-style-type: disc;
					background-color: red;
				}
			}
		}
	}

	//动画
	.memo-wrapper {
		box-shadow: 0 20px 16px -26px black;
		-webkit-box-shadow: 0 20px 16px -26px black;
		-moz-box-shadow: 0 20px 16px -26px black;

		transition: all .085s ease-in-out;
		-webkit-transition: all .085s ease-in-out;
		-moz-transition: all .085s ease-in-out;
		-ms-transition: all .085s ease-in-out;
		-o-transition: all .085s ease-in-out;
	}

	.memo-wrapper:hover {
		transform: scale(1.02);
		-webkit-transform: scale(1.02);
		-moz-transform: scale(1.02);
		-ms-transform: scale(1.02);
		-o-transform: scale(1.02);

		box-shadow: 0 50px 36px -56px black;
		-webkit-box-shadow: 0 50px 36px -56px black;
		-moz-box-shadow: 0 50px 36px -56px black;

		transition: all .085s ease-in-out;
		-webkit-transition: all .085s ease-in-out;
		-moz-transition: all .085s ease-in-out;
		-ms-transition: all .085s ease-in-out;
		-o-transition: all .085s ease-in-out;
	}
</style>
