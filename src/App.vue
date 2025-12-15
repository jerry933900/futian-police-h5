<template>
  <div id="app">
    <div class="page-container">
      <div class="page-header">
        <h1 class="title">智慧公安</h1>
      </div>
      <div class="page-content">
        <router-view />
      </div>
      <div class="page-footer">
        <van-tabbar v-model="active" route @change="handleTabChange">
          <van-tabbar-item to="/review-auth" icon="user-o">
            <span>复核授权</span>
          </van-tabbar-item>
          <van-tabbar-item to="/transaction-progress" icon="setting-o">
            <span>交易进度</span>
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
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* background: url('@/assets/logo.png') no-repeat center center fixed; */
  background-size: cover;
}

.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(5px); /* 背景模糊效果 */
}

.page-header {
  padding: 18px 15px;
  text-align: center;
  background-color: #e6f7ff;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.title {
  color: #0050b3;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 0;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  /* padding: 20px; */
  background-color: rgba(255, 255, 255, 0.85); /* 半透明白色背景 */
  /* margin: 15px; */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page-footer {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

/* 优化底部标签栏active样式 */
:deep(.van-tabbar-item--active) {
  color: #1989fa !important;
  font-weight: bold;
}

:deep(.van-tabbar-item--active img) {
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(180deg) brightness(118%) contrast(119%);
}
</style>
