import Vue from "vue";
import App from "./App";
import router from "./router";
import "./assets/iconfont/iconfont.css";
import "./assets/iconfont/iconfont.js";
import store from "./store/index.js";
import "./assets/style/reset.css";
import "./assets/style/sass.scss";
import "bootstrap/dist/js/bootstrap.min.js";
import axios from "./http/axios.js";
import { Message,icon } from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// import Element from 'element-ui'	//全局引入element-ui
// Vue.use(Element) 

// 在调用 Vue.use 前，给 Message 添加 install 方法
Message.install = function(Vue, options) {
  Vue.prototype.$message = Message;
};

Vue.use(Message);
Vue.use(icon);
Vue.config.productionTip = false;	//消除vue自带生成环境警告
Vue.prototype.$message1 = function(msg, state) {
  this.$message({
    message: msg,
    duration: 1000,
    type: state
  });
};


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");



