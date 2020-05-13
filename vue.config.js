const webpack = require("webpack");
//了解打包的详细信息
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
//自定义压缩配置
const TerserPlugin = require('terser-webpack-plugin')
//缓存
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');


module.exports = {
	productionSourceMap: false,
	publicPath: process.env.VUE_APP_URLENV == 'test' ? './' : '/', //分环境打包:VUE_APP_URLENV是test 的时候设置hash模式，使其能直接打开打包文件
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			//生产环境配置
			return { //返回一个对象
				plugins: [
					new HardSourceWebpackPlugin(),
					new webpack.ProvidePlugin({
						$: "jquery",
						jQuery: "jquery",
						"windows.jQuery": "jquery",
					}),
					new CompressionWebpackPlugin({
						filename: '[path].gz[query]',
						algorithm: 'gzip',
						test: /\.js$|\.html$|\.css/,
						threshold: 10240, // 只有大小大于该值的资源会被处理 10240
						minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
						deleteOriginalAssets: false // 删除原文件
					})

				],
				optimization: {
					minimizer: [new TerserPlugin({
						terserOptions: {
							compress: {
								drop_console: true //去除console
							}
						}
					})]
				},
				module: {
					noParse: /jquery/
				}
			}
		}
		return {
			//开发环境配置
			plugins: [
				new webpack.ProvidePlugin({
					$: "jquery",
					jQuery: "jquery",
					"windows.jQuery": "jquery",
				}),
			],
			module: {
				noParse: /jquery/
			}
		}
	},
	chainWebpack: config => {
		//全局引入sass
		const oneOfsMap = config.module.rule("scss").oneOfs.store;
		oneOfsMap.forEach(item => {
			item
				.use("sass-resources-loader")
				.loader("sass-resources-loader")
				.options({
					// Provide path to the file with resources
					resources: "./src/assets/style/sass.scss"
				})
				.end();
		});
	},
	devServer: {
		// disableHostCheck: true //webpack4.0 开启热更新
		// proxy: {
		// 	'/api': {
		// 		target: 'http://123.57.209.85:8001',
		// 		ws: true,
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/api': ''
		// 		}
		// 	},
		// }

	},
	//关闭eslint
	lintOnSave: false
};
