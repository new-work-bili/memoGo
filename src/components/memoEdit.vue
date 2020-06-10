<template>
	<div class="wrappers">
		<div class="content">
			<div class="header">
				<div class="left">
					<!-- 标题 -->
					<input type="text" class="title" placeholder="标题" v-model="itemContent.title">
					<!-- 分类选项框 -->
					<div class="btn-group btn-group-sm down_memu">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
						 aria-expanded="false" v-model="itemContent.label">
							{{type}} <span class="caret"></span>
						</button>
						<ul class="threeChange dropdown-menu" style="min-width:40px;left:-5px ;">
							<li v-for="item in testArr"  @click="type = item"><a href="#">{{item}}</a></li>
						</ul>
					</div>
				</div>
				<!-- 图标 -->
				<div class="right">
					<!-- 保存	点击折叠data-target、data-toggle -->
					<span class="iconfont icon-baocun1" @click="save"></span>
					<span @click="close" class="iconfont icon-guanbi1"></span>
				</div>
			</div>
			<!-- 内容 -->
			<!-- markdown -->
			<div class="main">
				<textarea class="text-content form-control" v-model="itemContent.content"></textarea>
			</div>
		</div>
	</div>
</template>

<script>
	import 'bootstrap/dist/css/bootstrap.min.css'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		postTable,
		getTable
	} from '../http/func.js'
	export default {
		data() {
			return {
				type: '工作',
				memoData: [], //遍历用的数组
				// createData: {
				//   type: '', //markdown? poor?
				//   title: '',
				//   label: '', //标签
				//   time: '', //创建时间
				//   content: '' //内容
				// } 
			}
		},
		methods: {
			...mapMutations([
				'setMainType',
				'addMemoItem',
				'setShowEdit',
				'setItemContent',
				'setIsNew',
				'setLogin',
				'setTopStore'
			]),
			close() {
				this.setShowEdit(false)
			},
			//保存
			save() {
				//如果是新建
				if (this.isNew) {
					this.itemContent.time = new Date().getTime()
					//默认不置顶
					this.itemContent.type = 0
				}
				this.itemContent.label = this.type //标签
				this.addMemoItem(this.itemContent)

				//传入服务器
				this.itemContent.userName = this.userName
				this.itemContent.isNew = this.isNew
				postTable('/add/', {
					itemData: this.itemContent
				}).then((res) => {

				}).catch((err) => {

				})

				//关闭
				this.setShowEdit(false)

			}
		},
		created() {

		},
		mounted() {},
		watch: {},
		computed: {
			...mapState([
				'isShowEdit',
				'memoItem',
				'itemContent',
				'isNew',
				'isLogin',
				'userName',
				'isShowNav',
				'labelArr'
			]),
			//遍历自定义的label数组
			testArr:function(){
				var arr = ['生活','学习','工作']
				if(this.labelArr.length!=0){
					return this.labelArr
				}
				return arr
			}
		},

	}
</script>

<style lang="scss" scoped="scoped">
	.wrappers {

		.content {
			padding: 10px;
			background-color: #fff;
			width: 280px;
			height: 350px;
			box-shadow: 0 0 5px #fff;
			border-radius: 5px;

			.header {
				position: relative;

				.right {
					position: absolute;
					right: 1px;
					top: 3px;

					span {
						// padding: 5px 5px;
						font-size: 18px;
						margin-right: 3px;
					}

					&>span:hover {
						cursor: pointer;
					}
				}

				.left {

					.title {
						font-size: 14px;
						font-weight: 600;
						width: 50%;
						border: 1px solid #ccc;
						border-radius: 5px;
						padding: 5px;
						margin-right: 5px;
					}

					.title:focus {
						outline: none;
						box-shadow: 0 0 5px $input_border_color;
						border: 1px solid #66afe9;
					}
				}

			}

			.main {
				textarea {
					font-size: 14px;
					height: 280px;
					margin-top: 10px;
					padding: 5px;
				}

				textarea:focus {
					outline: none;
					box-shadow: 0 0 5px $input_border_color;
					border: 1px solid #66afe9;
				}
			}
		}
	}
</style>
