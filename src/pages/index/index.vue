<template>
  <view class="container">
    <!-- 顶部连接状态 -->
    <view :class="connectionClass" class="connection-status">
      {{ connectionMessage }}
    </view>

    <!-- 表单区域 -->
    <form class="form">
      <button @click="reconnect" class="submit-button">连接</button>
      <!-- Progress 类型 -->
      <view class="form-group">
        <!--        <view>Endpoint_BeforeDelay:{{ Endpoint_BeforeDelay }}</view>-->
        <!--        <view>Endpoint_delay:{{ Endpoint_delay }}</view>-->
        <!--        <view>Endpoint_dynamic_mode:{{ Endpoint_dynamic_mode }}</view>-->
        <view class="radio-group">
          <view>不息屏:{{ wake }}</view>
          <view>PID:{{ pid }}</view>
          <view>VID:{{ vid }}</view>
          <view>Baud:{{ baud }}</view>
        </view>
        <hr/>
        <view class="radio-group">
          <view> MaskCtrl:</view>
          <view v-for="item in MaskCtrl" :key="item"> {{ item }}</view>
        </view>
        <hr/>
        <view class="radio-group">
          MaskButton:
          <view class="radio-group" v-for="item in MaskButton" :key="item"> {{ item }}</view>
        </view>
        <hr/>
        <view class="radio-group">LCD1:{{ LCD1 }}</view>
        <hr/>
        <view class="radio-group">LCD2:{{ LCD2 }}</view>
      </view>
      <hr/>

      <!-- 滑块显示当前大小 -->
      <view class="slider-label">前置震动: {{ Endpoint_BeforeDelay_Random }}</view>
      <slider
          :value="Endpoint_BeforeDelay_Random"
          min="0"
          max="30"
          step="1"
          show-value
          activeColor="#3cc51f"
          backgroundColor="#e5e5e5"
          block-color="#3cc51f"
          block-size="28"
          @change="onSliderChange('Endpoint_BeforeDelay_Random',$event)"
      />

      <view class="slider-label">前置时间: {{ Endpoint_BeforeDelay }}</view>
      <slider
          :value="Endpoint_BeforeDelay"
          min="0"
          max="50"
          step="1"
          show-value
          activeColor="#3cc51f"
          backgroundColor="#e5e5e5"
          block-color="#3cc51f"
          block-size="28"
          @change="onSliderChange('Endpoint_BeforeDelay',$event)"
      />

      <view class="slider-label">操作间隔: {{ Endpoint_delay }}</view>
      <slider
          :value="Endpoint_delay"
          min="0"
          max="200"
          step="1"
          show-value
          activeColor="#3cc51f"
          backgroundColor="#e5e5e5"
          block-color="#3cc51f"
          block-size="28"
          @change="onSliderChange('Endpoint_delay',$event)"
      />

      <view class="form-group">
        <text>选项选择:</text>
        <view class="radio-group">
          <button @click="modeOption(0)" :class="getModeClass(0)">关闭</button>
          <button @click="modeOption(1)" :class="getModeClass(1)">On-Q</button>
          <button @click="modeOption(2)" :class="getModeClass(2)">On-Whel</button>
        </view>
      </view>

      <view class="form-group">
        <text>选项选择:</text>
        <view class="radio-group">
          <button @click="endPointOption(0)" :class="getEndpointClass(0)">Ste</button>
          <button @click="endPointOption(1)" :class="getEndpointClass(1)">Dym</button>
          <button @click="endPointOption(2)" :class="getEndpointClass(2)">Wde</button>
          <button @click="endPointOption(3)" :class="getEndpointClass(3)">Ato</button>
          <button @click="endPointOption(4)" :class="getEndpointClass(4)">Atw</button>
          <button @click="endPointOption(5)" :class="getEndpointClass(5)">Man</button>
        </view>
      </view>

      <view class="form-group">
        <text>BaseFunc:</text>
        <view class="radio-group">
          <button @click="cmdFunc('setting_reset')">重置</button>
          <button @click="cmdFunc('bankey')">屏蔽键</button>
          <button @click="cmdFunc('unbanall')">解除屏蔽</button>
        </view>
      </view>

      <view class="slider-label">系统Sep: {{ sep }}</view>
      <slider
          :value="sep"
          min="1"
          max="50"
          step="1"
          show-value
          activeColor="#3cc51f"
          backgroundColor="#e5e5e5"
          block-color="#3cc51f"
          block-size="28"
          @change="onSliderChange('sep',$event)"
      />

      <view class="form-group">
        <text>PowerFunc:</text>
        <view class="radio-group">
          <button @click="cmdFunc('reset')">重启</button>
          <button @click="cmdFunc('cfgget')">获取CFG</button>
        </view>

        <text>CFG-Baud:</text>
        <view class="radio-group">
          <button @click="cmdFunc('cfg3k')">B-300K</button>
          <button @click="cmdFunc('cfg115k')">B-115k</button>
          <button @click="cmdFunc('cfg9k')">B-9k</button>
        </view>

        <text>DefFunc:</text>
        <view class="radio-group">
          <button @click="cmdFunc('05ac')">Def115</button>
          <button @click="cmdFunc('alldef9k')">Def9k</button>
          <button @click="cmdFunc('setusb')">设定USBstr</button>
        </view>

        <view class="form-group">
          <text>键盘模式:</text>
          <view class="radio-group">
            <button @click="kbModeOption(0)" :class="getKbModeClass(0)">M1</button>
            <button @click="kbModeOption(1)" :class="getKbModeClass(1)">M2</button>
            <button @click="kbModeOption(2)" :class="getKbModeClass(2)">M3</button>
            <button @click="kbModeOption(3)" :class="getKbModeClass(3)">M4</button>
          </view>
        </view>

        <view class="form-group">
          <text>通信模式:</text>
          <view class="radio-group">
            <button @click="kbCfgOption(0)" :class="getKbCfgClass(0)">Norm</button>
            <button @click="kbCfgOption(1)" :class="getKbCfgClass(1)">ASCII</button>
            <button @click="kbCfgOption(2)" :class="getKbCfgClass(2)">Pass</button>
          </view>
        </view>

      </view>
    </form>
  </view>
</template>

<script>
export default {
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
      connectionClass: 'status-failed', // 红色，连接失败时
      Mode: 0, // 默认选择的选项
      socket: null,// WebSocket 对象
      kbmode: 0,
      kbcfg: 0,
    };
  },
  mounted() {
    // 从 storage 中获取 IP 和端口号
    this.reconnect();
  },
  methods: {
    reconnect() {
      // 从 storage 中获取 IP 和端口号
      const ip = uni.getStorageSync('config_ip');

      // 如果 IP 和端口号存在，连接 WebSocket
      if (ip) {
        this.connectWebSocket(`${ip}`);
      }
    },
    cmdFunc(type) {
      const data = {
        route: "kbd",
        type: type,
      };
      this.socket.send({
        data: JSON.stringify(data)
      });
    },
    onSliderChange(field, event) {
      // 滑动结束时触发该事件，event.detail.value 为当前的值
      if (this[field] !== event.detail.value) {
        this[field] = event.detail.value;
        console.log(`${field} value:`, event.detail.value);
        this.socket.send({
          data: JSON.stringify({
            route: "semi-config",
            type: field,
            'data': this.$data
          })
        })
      }
    },
    connectWebSocket(url) {
      // 创建 WebSocket 连接
      this.socket = uni.connectSocket({

        url: url,
        success: () => {
          this.connectionMessage = '连接中……';
          this.connectionClass = 'status-progress'; // 绿色，连接成功
        },
        fail: () => {
          this.connectionMessage = '连接失败×';
          this.connectionClass = 'status-failed'; // 红色，连接失败
        }
      });

      // 监听 WebSocket 打开事件
      this.socket.onOpen(() => {
        this.connectionMessage = '连接建立';
        this.connectionClass = 'status-success';
        this.setWakeLock();
        this.updateData();
      });

      // 监听 WebSocket 错误事件
      this.socket.onError(() => {
        this.connectionMessage = '连接错误';
        this.connectionClass = 'status-failed';
      });

      // 监听 WebSocket 接收到的消息
      this.socket.onMessage((res) => {
        switch (res.data) {
          case 'update':
            this.updateData();
            break;

          default:
            const data = JSON.parse(res.data);
            this.updateFormData(data); // 根据接收到的数据更新表单
            break;
        }
      });

      // 监听 WebSocket 关闭事件
      this.socket.onClose(() => {
        this.connectionMessage = '连接被关闭';
        this.connectionClass = 'status-failed'; // 红色，连接关闭
      });
    },
    updateData() {
      const data = {
        route: "info",
      };
      this.socket.send({
        data: JSON.stringify(data)
      });

      let that = this
      setInterval(function () {
        const data = {
          route: "ping",
        };
        that.socket.send({
          data: JSON.stringify(data)
        });
      }, 9000)
    },
    // 更新表单数据
    updateFormData(data) {
      console.log(data);
      for (const i in data) {
        if (this[i] !== null) {
          this[i] = data[i];
        }
      }
    },

    // 选项切换
    modeOption(option) {
      this.Mode = option;
      this.socket.send({
        data: JSON.stringify({
          route: "semi-config",
          type: "Mode",
          'data': this.$data,
        })
      })
    },
    // 选项切换
    endPointOption(option) {
      this.Endpoint_dynamic_mode = option;
      this.socket.send({
        data: JSON.stringify({
          route: "semi-config",
          type: "Endpoint_dynamic_mode",
          'data': this.$data,
        })
      })
    },
    kbModeOption(option) {
      this.kbmode = option;
      this.socket.send({
        data: JSON.stringify({
          route: "semi-config",
          type: "kbmode",
          'data': this.$data,
        })
      })
    },
    kbCfgOption(option) {
      this.kbcfg = option;
      this.socket.send({
        data: JSON.stringify({
          route: "semi-config",
          type: "kbcfg",
          'data': this.$data,
        })
      })
    },
    getEndpointClass(option) {
      return this.Endpoint_dynamic_mode === option ? 'option-selected' : 'option';
    },
    // 获取选项样式
    getModeClass(option) {
      return this.Mode === option ? 'option-selected' : 'option';
    }, // 获取选项样式
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
        console.error(`<span class="red">唤醒锁定失败：${err.message}</span>`);
      });
    },
  }
};
</script>

<style>
hr {
  margin-top: 10px;
  margin-bottom: 10px;
}

/* 容器样式 */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  height: 160vh;
}

/* 连接状态 */
.connection-status {
  width: 100%;
  text-align: center;
  padding: 10px;
  color: #fff;
}

.slider-label {
  font-size: 18px;
  margin-bottom: 20px;
}

.slider {
  width: 100%;
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

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 25px;
}

.progress-bar-small {
  width: 100%;
  height: 10px;
}

/* 按钮样式 */
.radio-group {
  display: flex;
  justify-content: space-around;
}

button {
  flex: 1;
  margin: 5px;
  padding: 10px;
  background-color: #ddd;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
}

.option-selected {
  background-color: #3cc51f;
  color: #fff;
}

.submit-button {
  width: 100%;
  padding: 1px;
  background-color: #3cc51f;
  color: white;
  font-size: 18px;
  border-radius: 5px;
  border: none;
  margin: 0;
}

.form {
  width: 100%;
}
</style>
