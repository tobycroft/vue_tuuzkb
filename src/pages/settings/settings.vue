<template>
  <div class="container">
    <div class="title">服务器设置</div>

    <div class="input-container">
      <input
          type="text"
          placeholder="请输入 ws开头的url 地址 "
          v-model="ipAddress"
          class="input-field"
      />
    </div>

    <button @click="setConfiguration" class="set-button" type="button">设定</button>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage',
  data() {
    return {
      ipAddress: "",
      port: ""
    };
  },
  mounted() {
    const storedIp = localStorage.getItem('config_ip');
    const storedPort = localStorage.getItem('config_port');

    if (storedIp) {
      this.ipAddress = storedIp;
    }
    if (storedPort) {
      this.port = storedPort;
    }
  },
  methods: {
    resolveWsAddress(value) {
      const trimmed = value.trim();
      if (!trimmed) return "";

      if (trimmed.includes("://")) {
        return trimmed;
      }

      if (trimmed.startsWith("/")) {
        const { protocol, host } = window.location;
        const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
        return `${wsProtocol}//${host}${trimmed}`;
      }

      return `ws://${trimmed}`;
    },
    setConfiguration() {
      if (this.ipAddress === "") {
        alert("请输入有效的 IP 地址和端口号");
        return;
      }

      const resolvedIp = this.resolveWsAddress(this.ipAddress);
      localStorage.setItem("config_ip", resolvedIp);
      localStorage.setItem("config_port", this.port);

      this.ipAddress = resolvedIp;
      alert("设置已保存");
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 10px;
  min-height: 80vh;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}

.input-container {
  width: 100%;
  padding: 0;
  margin-bottom: 20px;
}

.input-field {
  width: 95%;
  height: 45px;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #ffffff;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.set-button {
  width: 80%;
  height: 45px;
  background-color: #3cc51f;
  color: #ffffff;
  font-size: 18px;
  text-align: center;
  line-height: 45px;
  border-radius: 10px;
  border: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s;
}

.set-button:hover {
  background-color: #36b01c;
}

.set-button:active {
  background-color: #2e9e18;
}
</style>
