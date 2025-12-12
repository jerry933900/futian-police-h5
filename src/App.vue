<template>
  <div id="app">
    <div class="page-container">
      <div class="page-header">
        <h1>智慧公安</h1>
      </div>
      <div class="page-content">
        <router-view />
      </div>
      <div class="page-footer">
        <van-tabbar v-model="active" route @change="handleTabChange">
          <van-tabbar-item to="/review-auth">
            <span>复核授权</span>
            <img slot="icon" src="https://img.yzcdn.cn/vant/user-o.png" />
          </van-tabbar-item>
          <van-tabbar-item to="/transaction-progress">
            <span>交易进度</span>
            <img slot="icon" src="https://img.yzcdn.cn/vant/setting-o.png" />
          </van-tabbar-item>
        </van-tabbar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      active: this.$route.path || '/review-auth'
    }
  },
  watch: {
    // 监听路由变化，更新active值
    $route(to) {
      this.active = to.path;
    }
  },
  methods: {
    // 处理底部切换栏点击事件
    handleTabChange(active) {
      this.active = active;
    }
  }
}
</script>

<style>
#app {
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 15px;
  text-align: center;
  background-color: #1989fa;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.page-content {
  flex: 1;
  overflow-y: auto;
}

.page-footer {
  background-color: white;
}
</style>
