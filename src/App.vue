<template>
  <div class="app-root">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <nav class="tab-bar">
      <router-link to="/" class="tab-item" active-class="tab-item-active">
        <img src="/static/icons/home.png" alt="" class="tab-icon" />
        <img src="/static/icons/home-selected.png" alt="" class="tab-icon-active" />
        <span>首页</span>
      </router-link>
      <router-link to="/settings" class="tab-item" active-class="tab-item-active">
        <img src="/static/icons/settings.png" alt="" class="tab-icon" />
        <img src="/static/icons/settings-selected.png" alt="" class="tab-icon-active" />
        <span>设置</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
}

.app-root {
  min-height: 100vh;
  padding-bottom: 70px;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #ffffff;
  border-top: 1px solid #e5e5e5;
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  text-decoration: none;
  color: #7A7E83;
  font-size: 12px;
  transition: color 0.2s;
}

.tab-item-active {
  color: #3cc51f;
}

.tab-item .tab-icon {
  display: inline-block;
}

.tab-item .tab-icon-active {
  display: none;
}

.tab-item-active .tab-icon {
  display: none;
}

.tab-item-active .tab-icon-active {
  display: inline-block;
}

.tab-icon,
.tab-icon-active {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}
</style>
