<template>
  <div class="container">
    <div :class="connectionClass" class="connection-status">
      {{ connectionMessage }}
    </div>

    <div class="form">
      <button @click="reconnect" class="submit-button" type="button">连接</button>

      <div class="form-group">
        <div class="radio-group">
          <span>不息屏:{{ wake }}</span>
          <span>PID:{{ pid }}</span>
          <span>VID:{{ vid }}</span>
          <span>Baud:{{ baud }}</span>
        </div>
        <hr />
        <div class="radio-group">
          <span>MaskCtrl:</span>
          <span v-for="item in MaskCtrl" :key="item"> {{ item }}</span>
        </div>
        <hr />
        <div class="radio-group">
          <span>MaskButton:</span>
          <span v-for="item in MaskButton" :key="item"> {{ item }}</span>
        </div>
        <hr />
        <div class="radio-group">LCD1:{{ LCD1 }}</div>
        <hr />
        <div class="radio-group">LCD2:{{ LCD2 }}</div>
      </div>
      <hr />

      <div class="slider-label">前置震动: {{ Endpoint_BeforeDelay_Random }}</div>
      <input
          type="range"
          class="slider"
          :value="Endpoint_BeforeDelay_Random"
          min="0"
          max="30"
          step="1"
          @change="onSliderChange('Endpoint_BeforeDelay_Random', $event)"
      />

      <div class="slider-label">前置时间: {{ Endpoint_BeforeDelay }}</div>
      <input
          type="range"
          class="slider"
          :value="Endpoint_BeforeDelay"
          min="0"
          max="50"
          step="1"
          @change="onSliderChange('Endpoint_BeforeDelay', $event)"
      />

      <div class="slider-label">操作间隔: {{ Endpoint_delay }}</div>
      <input
          type="range"
          class="slider"
          :value="Endpoint_delay"
          min="0"
          max="200"
          step="1"
          @change="onSliderChange('Endpoint_delay', $event)"
      />

      <div class="form-group">
        <div class="radio-group">
          <button @click="modeOption(0)" :class="getModeClass(0)" type="button">关闭</button>
          <button @click="modeOption(1)" :class="getModeClass(1)" type="button">On-Q</button>
          <button @click="modeOption(2)" :class="getModeClass(2)" type="button">On-Whel</button>
        </div>
      </div>

      <div class="form-group">
        <div class="radio-group">
          <button @click="endPointOption(0)" :class="getEndpointClass(0)" type="button">Ste</button>
          <button @click="endPointOption(1)" :class="getEndpointClass(1)" type="button">Dym</button>
          <button @click="endPointOption(2)" :class="getEndpointClass(2)" type="button">Wde</button>
          <button @click="endPointOption(3)" :class="getEndpointClass(3)" type="button">Ato</button>
          <button @click="endPointOption(4)" :class="getEndpointClass(4)" type="button">Atw</button>
          <button @click="endPointOption(5)" :class="getEndpointClass(5)" type="button">Man</button>
        </div>
      </div>

      <div class="form-group">
        <div class="radio-group">
          <button @click="cmdFunc('setting_reset')" type="button">重置</button>
          <button @click="cmdFunc('bankey')" type="button">屏蔽键</button>
          <button @click="cmdFunc('unbanall')" type="button">解除屏蔽</button>
        </div>
      </div>

      <div class="slider-label">系统Sep: {{ sep }}</div>
      <input
          type="range"
          class="slider"
          :value="sep"
          min="1"
          max="50"
          step="1"
          @change="onSliderChange('sep', $event)"
      />

      <div class="form-group">
        <div class="radio-group">
          <button @click="cmdFunc('reset')" type="button">重启</button>
          <button @click="cmdFunc('cfgget')" type="button">获取CFG</button>
        </div>

        <div class="radio-group">
          <button @click="cmdFunc('cfg3k')" type="button">B-300K</button>
          <button @click="cmdFunc('cfg115k')" type="button">B-115k</button>
          <button @click="cmdFunc('cfg9k')" type="button">B-9k</button>
        </div>

        <div class="radio-group">
          <button @click="cmdFunc('05ac')" type="button">Def115</button>
          <button @click="cmdFunc('alldef9k')" type="button">Def9k</button>
          <button @click="cmdFunc('setusb')" type="button">设定USBstr</button>
        </div>

        <div class="form-group">
          <div class="radio-group">
            <button @click="kbModeOption(0)" :class="getKbModeClass(0)" type="button">M1</button>
            <button @click="kbModeOption(1)" :class="getKbModeClass(1)" type="button">M2</button>
            <button @click="kbModeOption(2)" :class="getKbModeClass(2)" type="button">M3</button>
            <button @click="kbModeOption(3)" :class="getKbModeClass(3)" type="button">M4</button>
          </div>
        </div>

        <div class="form-group">
          <div class="radio-group">
            <button @click="kbCfgOption(0)" :class="getKbCfgClass(0)" type="button">Norm</button>
            <button @click="kbCfgOption(1)" :class="getKbCfgClass(1)" type="button">ASCII</button>
            <button @click="kbCfgOption(2)" :class="getKbCfgClass(2)" type="button">Pass</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      wake: null,
      wakeLock: null,
      MaskCtrl: '',
      MaskButton: '',
      pid: '',
      vid: '',
      baud: 0,
      connectionMessage: '未连接',
      Endpoint_BeforeDelay_Random: 0,
      Endpoint_BeforeDelay: 0,
      Endpoint_delay: 0,
      Endpoint_dynamic_mode: 0,
      sep: 1,
      LCD1: '',
      LCD2: '',
      connectionClass: 'status-failed',
      Mode: 0,
      socket: null,
      kbmode: 0,
      kbcfg: 0,
      heartbeatTimer: null,
    };
  },
  mounted() {
    this.reconnect();
  },
  beforeUnmount() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  },
  methods: {
    reconnect() {
      const ip = localStorage.getItem('config_ip');

      if (ip) {
        this.connectWebSocket(ip);
      }
    },
    cmdFunc(type) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        return;
      }
      const data = {
        route: "kbd",
        type: type,
      };
      this.socket.send(JSON.stringify(data));
    },
    onSliderChange(field, event) {
      const value = Number(event.target.value);
      if (this[field] !== value) {
        this[field] = value;
        console.log(`${field} value:`, value);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({
            route: "semi-config",
            type: field,
            'data': this.$data
          }));
        }
      }
    },
    connectWebSocket(url) {
      this.connectionMessage = '连接中……';
      this.connectionClass = 'status-progress';

      try {
        this.socket = new WebSocket(url);
      } catch (err) {
        this.connectionMessage = '连接失败×';
        this.connectionClass = 'status-failed';
        return;
      }

      this.socket.onopen = () => {
        this.connectionMessage = '连接建立';
        this.connectionClass = 'status-success';
        this.setWakeLock();
        this.updateData();
      };

      this.socket.onerror = () => {
        this.connectionMessage = '连接错误';
        this.connectionClass = 'status-failed';
      };

      this.socket.onmessage = (event) => {
        if (event.data === 'update') {
          this.updateData();
          return;
        }
        try {
          const data = JSON.parse(event.data);
          this.updateFormData(data);
        } catch (e) {
          console.error('解析消息失败:', e);
        }
      };

      this.socket.onclose = () => {
        this.connectionMessage = '连接被关闭';
        this.connectionClass = 'status-failed';
      };
    },
    updateData() {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        return;
      }
      const data = {
        route: "info",
      };
      this.socket.send(JSON.stringify(data));

      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
      }
      this.heartbeatTimer = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          const data = {
            route: "ping",
          };
          this.socket.send(JSON.stringify(data));
        }
      }, 9000);
    },
    updateFormData(data) {
      console.log(data);
      for (const i in data) {
        if (this[i] !== null) {
          this[i] = data[i];
        }
      }
    },
    modeOption(option) {
      this.Mode = option;
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          route: "semi-config",
          type: "Mode",
          'data': this.$data,
        }));
      }
    },
    endPointOption(option) {
      this.Endpoint_dynamic_mode = option;
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          route: "semi-config",
          type: "Endpoint_dynamic_mode",
          'data': this.$data,
        }));
      }
    },
    kbModeOption(option) {
      this.kbmode = option;
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          route: "semi-config",
          type: "kbmode",
          'data': this.$data,
        }));
      }
    },
    kbCfgOption(option) {
      this.kbcfg = option;
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          route: "semi-config",
          type: "kbcfg",
          'data': this.$data,
        }));
      }
    },
    getEndpointClass(option) {
      return this.Endpoint_dynamic_mode === option ? 'option-selected' : 'option';
    },
    getModeClass(option) {
      return this.Mode === option ? 'option-selected' : 'option';
    },
    getKbModeClass(option) {
      return this.kbmode === option ? 'option-selected' : 'option';
    },
    getKbCfgClass(option) {
      return this.kbcfg === option ? 'option-selected' : 'option';
    },
    setWakeLock() {
      if (this.wakeLock) {
        return;
      }
      if (!navigator.wakeLock || !navigator.wakeLock.request) {
        console.log('当前浏览器不支持 wakeLock');
        return;
      }
      navigator.wakeLock.request('screen').then(result => {
        this.wakeLock = result;
        this.wake = '唤醒锁定已激活';
        console.log('唤醒锁定已激活');
        console.log(result);
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
          this.wake = '唤醒锁定已释放';
          console.log('唤醒锁定已释放');
        });
      }).catch((err) => {
        console.error(`唤醒锁定失败：${err.message}`);
      });
    },
  }
};
</script>

<style scoped>
hr {
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  border-top: 1px solid #e5e5e5;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.connection-status {
  width: 100%;
  text-align: center;
  padding: 10px;
  color: #fff;
  border-radius: 4px;
}

.slider-label {
  font-size: 18px;
  margin: 20px 0 10px 0;
  width: 100%;
}

.slider {
  width: 100%;
  height: 28px;
  accent-color: #3cc51f;
}

.status-success {
  background-color: green;
}

.status-progress {
  background-color: cornflowerblue;
}

.status-failed {
  background-color: red;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

.radio-group {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin: 5px 0;
  width: 100%;
}

.radio-group > span {
  font-size: 14px;
}

button {
  flex: 1;
  min-width: 60px;
  margin: 5px;
  padding: 10px;
  background-color: #ddd;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #ccc;
}

button:active {
  background-color: #bbb;
}

.option-selected {
  background-color: #3cc51f;
  color: #fff;
}

.option-selected:hover {
  background-color: #36b01c;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #3cc51f;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  border: none;
  margin: 0;
}

.submit-button:hover {
  background-color: #36b01c;
}

.form {
  width: 100%;
}
</style>
