<template>
  <div class="page">
    <div :class="ws.state.connectionClass" class="connection-status">
      {{ ws.state.connectionMessage }}
    </div>

    <button @click="ws.reconnect()" class="submit-button" type="button">重新连接</button>

    <div class="info-panel">
      <div class="compact-info">
        <span><small>VID</small>{{ ws.state.vid || '—' }}</span>
        <span><small>PID</small>{{ ws.state.pid || '—' }}</span>
        <span><small>Baud</small>{{ ws.state.baud || '—' }}</span>
      </div>
      <div class="compact-lcd">
        <span class="lcd-label-sm">LCD1</span>
        <span class="lcd-text-sm">{{ ws.state.LCD1 }}</span>
        <span class="lcd-divider">|</span>
        <span class="lcd-label-sm">LCD2</span>
        <span class="lcd-text-sm">{{ ws.state.LCD2 }}</span>
      </div>
    </div>

    <div class="section-title">服务器地址</div>
    <div class="input-container">
      <input
          type="text"
          placeholder="请输入 ws 开头的 URL 地址"
          v-model="ipAddress"
          class="input-field"
      />
    </div>
    <button @click="setConfiguration" class="set-button" type="button">保存地址</button>
  </div>
</template>

<script>
import ws from '../../store/ws.js'

export default {
  name: 'ConnectionPage',
  data() {
    return {
      ws: ws,
      ipAddress: ''
    };
  },
  mounted() {
    const storedIp = localStorage.getItem('config_ip');
    if (storedIp) {
      this.ipAddress = storedIp;
    }
  },
  methods: {
    resolveWsAddress(value) {
      const trimmed = value.trim();
      if (!trimmed) return "";
      if (trimmed.includes("://")) return trimmed;
      if (trimmed.startsWith("/")) {
        const { protocol, host } = window.location;
        const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
        return `${wsProtocol}//${host}${trimmed}`;
      }
      return `ws://${trimmed}`;
    },
    setConfiguration() {
      if (this.ipAddress === "") {
        alert("请输入有效的地址");
        return;
      }
      const resolvedIp = this.resolveWsAddress(this.ipAddress);
      localStorage.setItem("config_ip", resolvedIp);
      this.ipAddress = resolvedIp;
      alert("设置已保存");
    }
  }
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 12px;
}

.connection-status {
  width: 100%;
  text-align: center;
  padding: 16px;
  color: #fff;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
}

.status-success { background-color: #2d7a2d; }
.status-progress { background-color: #3a6fa8; }
.status-failed { background-color: #a83a3a; }

.submit-button {
  width: 100%;
  padding: 16px;
  background-color: #3cc51f;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
.submit-button:hover { background-color: #45d028; }

.info-panel {
  background-color: #1c1c1e;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 14px;
}

.compact-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #e0e0e0;
  background-color: #2c2c2e;
  border: 1px solid #3a3a3c;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}
.compact-info span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.compact-info small { color: #888; font-weight: 500; font-size: 12px; }

.compact-lcd {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  flex-wrap: nowrap;
}
.lcd-label-sm { font-size: 13px; font-weight: 700; color: #888; }
.lcd-divider { color: #444; font-size: 13px; margin: 0 2px; }
.lcd-text-sm {
  flex: 1;
  min-width: 0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  padding: 10px 14px;
  background-color: #000;
  color: #7cfc00;
  border-radius: 6px;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid #1a3a1a;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #bbb;
  margin: 8px 0 4px 0;
  padding-left: 4px;
  letter-spacing: 0.5px;
}

.input-container { width: 100%; }

.input-field {
  width: 100%;
  height: 52px;
  padding: 12px 14px;
  border: 1px solid #3a3a3c;
  border-radius: 8px;
  background-color: #2c2c2e;
  color: #e0e0e0;
  font-size: 15px;
  box-sizing: border-box;
  font-family: 'Courier New', monospace;
}
.input-field:focus { outline: none; border-color: #3cc51f; background-color: #333; }
.input-field::placeholder { color: #666; }

.set-button {
  width: 100%;
  height: 52px;
  background-color: #3cc51f;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  text-align: center;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  margin-top: 4px;
}
.set-button:hover { background-color: #45d028; }
</style>
