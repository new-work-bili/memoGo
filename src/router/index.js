import Vue from 'vue'
import Router from 'vue-router'

const Home =  resolve => require.ensure([], () => resolve(require('@/components/Home')),'HomeWebpack')
const qqlogin =  resolve => require.ensure([], () => resolve(require('@/components/qqlogin')),'QQloginWebpack')
Vue.use(Router)

export default new Router({
	mode: process.env.VUE_APP_URLENV  == 'test'?'hash':'history',
	routes: [{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/memo/qqlogin',
			name: 'qqlogin',
			component: qqlogin
		}
	]
})
