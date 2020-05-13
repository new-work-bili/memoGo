<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
	//背景效果
	$(document).on("mousemove", evt => {
	  $("body")
	    .css("background-position-x", Math.ceil(evt.pageX / 40))
	    .css("background-position-y", Math.ceil(evt.pageY / 40));
	});
	//移动端改变手机的旋转方向?
	window.ondeviceorientation = evt => {
	  $("body")
	    .css("background-position-x", evt.gamma)
	    .css("background-position-y", evt.beta);
	};
  export default {
    name: 'App'
  }
</script>

<style>

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }
  body {
    background-image: url(assets/pixels.png);
  }
</style>
