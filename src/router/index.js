import Vue from 'vue'
import Router from 'vue-router'

const Home =  resolve => require.ensure([], () => resolve(require('@/views/Home')),'HomeWebpack')
const qqlogin =  resolve => require.ensure([], () => resolve(require('@/views/QQlogin')),'QQloginWebpack')
const NotFound =  resolve => require.ensure([], () => resolve(require('@/views/404.vue')),'NotFound')
Vue.use(Router)

export default new Router({
	mode: process.env.VUE_APP_URLENV  == 'test'?'hash':'history',
	// mode: 'hash',
	routes: [{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/memo/qqlogin',
			name: 'qqlogin',
			component: qqlogin
		},
		{
			// path: '/404/',
			path: '*',
			name: '404',
			component: NotFound
		}
	]
})
