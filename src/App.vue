<template>
  <div class="app-root">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <nav :class="['tab-bar', showTab ? 'tab-bar-visible' : 'tab-bar-hidden']">
      <router-link to="/" class="tab-item" active-class="tab-item-active">
        <span class="tab-icon">◉</span>
        <span>首页</span>
      </router-link>
      <router-link to="/settings" class="tab-item" active-class="tab-item-active">
        <span class="tab-icon">⚙</span>
        <span>硬件控制</span>
      </router-link>
      <router-link to="/connection" class="tab-item" active-class="tab-item-active">
        <span class="tab-icon">⇌</span>
        <span>连接控制</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return { showTab: true, lastScrollY: 0 };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const y = window.scrollY || window.pageYOffset || 0;
      if (y <= 0) {
        this.showTab = true;
      } else if (y > this.lastScrollY + 6) {
        this.showTab = false;
      } else if (y < this.lastScrollY - 6) {
        this.showTab = true;
      }
      this.lastScrollY = y;
    }
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #0d0d0d;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background-color: #0d0d0d;
}

.app-root {
  min-height: 100vh;
  padding-bottom: 78px;
  background-color: #0d0d0d;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #1c1c1e;
  border-top: 1px solid #2a2a2a;
  z-index: 100;
  padding: 10px 0 14px 0;
  transition: transform 0.25s ease;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.35);
}

.tab-bar-visible {
  transform: translateY(0);
}

.tab-bar-hidden {
  transform: translateY(100%);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
  text-decoration: none;
  color: #7a7a7a;
  font-size: 13px;
  transition: color 0.2s;
  font-weight: 500;
}

.tab-item-active {
  color: #3cc51f;
}

.tab-icon {
  font-size: 20px;
  margin-bottom: 2px;
}
</style>
