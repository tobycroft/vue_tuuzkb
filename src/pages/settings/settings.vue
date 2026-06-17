<template>
  <view class="container">
    <!-- 标题 -->
    <view class="title">服务器设置</view>

    <!-- 输入框容器 -->
    <view class="input-container">
      <!-- IP 地址或 URL 输入框 -->
      <input
          type="text"
          placeholder="请输入 ws开头的url 地址 "
          v-model="ipAddress"
          class="input-field"
      />
    </view>

    <!-- 设置按钮 -->
    <button @click="setConfiguration" class="set-button">设定</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      ipAddress: "", // 存储输入的IP地址或URL
      port: "" // 存储输入的端口号
    };
  },
  mounted() {
    // 页面加载时，从本地存储中获取之前保存的IP地址和端口号
    const storedIp = uni.getStorageSync('config_ip');
    const storedPort = uni.getStorageSync('config_port');

    // 如果存储中有值，设置到输入框中
    if (storedIp) {
      this.ipAddress = storedIp;
    }
    if (storedPort) {
      this.port = storedPort;
    }
  },
  methods: {
    setConfiguration() {
      // 校验输入是否有效
      if (this.ipAddress === "") {
        uni.showToast({
          title: "请输入有效的 IP 地址和端口号",
          icon: "none"
        });
        return;
      }

      // 保存到本地存储
      uni.setStorageSync("config_ip", this.ipAddress);
      uni.setStorageSync("config_port", this.port);

      uni.showToast({
        title: "设置已保存",
        icon: "success"
      });
    }
  }
};
</script>

<style>
/* 设置容器 */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 100vh;
  background-color: #f7f7f7;
}

/* 标题样式 */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 输入框容器 */
.input-container {
  width: 100%; /* 容器宽度占满父元素 */
  padding: 0;
  margin-bottom: 20px;
}

/* 输入框样式 */
.input-field {
  width: 95%; /* 自适应宽度 */
  height: 45px;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #ffffff;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 设置按钮样式 */
.set-button {
  width: 80%; /* 按钮宽度相对父元素 */
  height: 45px;
  background-color: #3cc51f;
  color: #ffffff;
  font-size: 18px;
  text-align: center;
  line-height: 45px;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.set-button:active {
  background-color: #39b51c;
}
</style>
