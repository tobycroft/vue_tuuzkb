<template>
  <div class="page">
    <div :class="ws.state.connectionClass" class="connection-status">
      {{ ws.state.connectionMessage }}
    </div>

    <div class="section-title">屏蔽控制</div>
    <div class="btn-row">
      <button @click="cmd('setting_reset')" type="button">重置</button>
      <button @click="cmd('bankey')" type="button">屏蔽键</button>
      <button @click="cmd('unbanall')" type="button">解除屏蔽</button>
    </div>

    <div class="mask-panel" v-if="(ws.state.MaskCtrl && ws.state.MaskCtrl.length > 0) || (ws.state.MaskButton && ws.state.MaskButton.length > 0)">
      <div class="mask-title">屏蔽状态</div>
      <div class="mask-row" v-if="ws.state.MaskCtrl && ws.state.MaskCtrl.length > 0">
        <span class="mask-label">Ctrl</span>
        <span class="mask-values">{{ ws.formatCtrlList(ws.state.MaskCtrl) }}</span>
      </div>
      <div class="mask-row" v-if="ws.state.MaskButton && ws.state.MaskButton.length > 0">
        <span class="mask-label">Btn</span>
        <span class="mask-values">{{ ws.formatKeyList(ws.state.MaskButton) }}</span>
      </div>
    </div>

    <div class="section-title">设备信息</div>
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

    <div class="section-title">系统配置</div>
    <div class="slider-label">系统 Sep: {{ ws.state.sep }}</div>
    <input
        type="range"
        class="slider"
        :value="ws.state.sep"
        min="1"
        max="50"
        step="1"
        @change="onSepChange($event)"
    />

    <div class="section-title">波特率</div>
    <div class="btn-row">
      <button @click="cmd('reset')" type="button">重启</button>
      <button @click="cmd('cfgget')" type="button">获取 cfg</button>
    </div>
    <div class="btn-row">
      <button @click="cmd('cfg3k')" type="button">300K</button>
      <button @click="cmd('cfg115k')" type="button">115K</button>
      <button @click="cmd('cfg9k')" type="button">9K</button>
    </div>
    <div class="btn-row">
      <button @click="cmd('setusb')" type="button">USBStr</button>
    </div>
    <div class="section-title">PID / VID</div>
    <div class="pidvid-row">
      <input v-model="pidInput" class="pidvid-input" placeholder="PID (如 05ac)" />
      <input v-model="vidInput" class="pidvid-input" placeholder="VID (如 0256)" />
      <button @click="setPidVid" type="button">设置</button>
    </div>

    <div class="section-title">键盘模式（M）</div>
    <div class="btn-row">
      <button @click="kbModeOption(0)" :class="getKbModeClass(0)" type="button">M1</button>
      <button @click="kbModeOption(1)" :class="getKbModeClass(1)" type="button">M2</button>
      <button @click="kbModeOption(2)" :class="getKbModeClass(2)" type="button">M3</button>
      <button @click="kbModeOption(3)" :class="getKbModeClass(3)" type="button">M4</button>
    </div>

    <div class="section-title">键盘编码</div>
    <div class="btn-row">
      <button @click="kbCfgOption(0)" :class="getKbCfgClass(0)" type="button">Norm</button>
      <button @click="kbCfgOption(1)" :class="getKbCfgClass(1)" type="button">ASCII</button>
      <button @click="kbCfgOption(2)" :class="getKbCfgClass(2)" type="button">Pass</button>
    </div>
  </div>
</template>

<script>
import ws from '../../store/ws.js'

export default {
  name: 'HardwarePage',
  data() {
    return { ws: ws, pidInput: '', vidInput: '' };
  },
  methods: {
    cmd(type) {
      ws.cmdFunc(type);
    },
    setPidVid() {
      const pidStr = (this.pidInput || '').trim().toLowerCase();
      const vidStr = (this.vidInput || '').trim().toLowerCase();
      if (!pidStr || !vidStr) {
        alert('请输入 PID 和 VID');
        return;
      }
      let pid = parseInt(pidStr, 16);
      let vid = parseInt(vidStr, 16);
      if (isNaN(pid) || isNaN(vid)) {
        alert('PID 和 VID 必须是十六进制数字');
        return;
      }
      ws.sendMessage({
        route: 'kbd',
        type: 'pidvid',
        data: { pid: pid, vid: vid }
      });
    },
    getSnapshot() {
      const s = ws.state;
      return {
        Endpoint_BeforeDelay_Random: s.Endpoint_BeforeDelay_Random,
        Endpoint_BeforeDelay: s.Endpoint_BeforeDelay,
        Endpoint_delay: s.Endpoint_delay,
        Endpoint_dynamic_mode: s.Endpoint_dynamic_mode,
        Mode: s.Mode,
        kbmode: s.kbmode,
        kbcfg: s.kbcfg,
        sep: s.sep
      };
    },
    onSepChange(event) {
      const value = Number(event.target.value);
      ws.state.sep = value;
      ws.sendMessage({
        route: 'semi-config',
        type: 'sep',
        data: {
          sep: value,
          Endpoint_BeforeDelay_Random: ws.state.Endpoint_BeforeDelay_Random,
          Endpoint_BeforeDelay: ws.state.Endpoint_BeforeDelay,
          Endpoint_delay: ws.state.Endpoint_delay,
          Endpoint_dynamic_mode: ws.state.Endpoint_dynamic_mode,
          Mode: ws.state.Mode,
          kbmode: ws.state.kbmode,
          kbcfg: ws.state.kbcfg
        }
      });
    },
    kbModeOption(option) {
      ws.state.kbmode = option;
      ws.requestSemiConfig('kbmode', this.getSnapshot());
    },
    kbCfgOption(option) {
      ws.state.kbcfg = option;
      ws.requestSemiConfig('kbcfg', this.getSnapshot());
    },
    getKbModeClass(option) {
      return ws.state.kbmode === option ? 'option-selected' : '';
    },
    getKbCfgClass(option) {
      return ws.state.kbcfg === option ? 'option-selected' : '';
    }
  }
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 8px;
}

.connection-status {
  width: 100%;
  text-align: center;
  padding: 14px;
  color: #fff;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}

.status-success { background-color: #2d7a2d; }
.status-progress { background-color: #3a6fa8; }
.status-failed { background-color: #a83a3a; }

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
  padding: 10px 12px;
}

.compact-info span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.compact-info small {
  color: #888;
  font-weight: 500;
  font-size: 12px;
}

.compact-lcd {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  flex-wrap: nowrap;
}

.lcd-label-sm {
  font-size: 13px;
  font-weight: 700;
  color: #888;
}

.lcd-divider { color: #444; font-size: 13px; margin: 0 2px; }

.lcd-text-sm {
  flex: 1;
  min-width: 0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  padding: 10px 12px;
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
  margin: 8px 0 6px 0;
  padding-left: 4px;
  letter-spacing: 0.5px;
}

.slider-label {
  font-size: 14px;
  margin: 6px 0 6px 4px;
  color: #ddd;
  font-weight: 600;
}

.slider {
  width: 100%;
  height: 48px;
  accent-color: #3cc51f;
  margin: 0 0 6px 0;
}

.btn-row {
  display: flex;
  gap: 6px;
  width: 100%;
  flex-wrap: nowrap;
}

.btn-row button {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 16px 8px;
  background-color: #2c2c2e;
  border: 1px solid #3a3a3c;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
  color: #ddd;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-row button:hover {
  background-color: #3a3a3c;
  border-color: #4a4a4c;
}

.btn-row button:active {
  background-color: #4a4a4c;
}

.btn-row .option-selected {
  background-color: #3cc51f;
  color: #fff;
  border-color: #3cc51f;
}

.mask-panel {
  background-color: #1c1c1e;
  border: 1px solid #5a2a2a;
  border-radius: 10px;
  padding: 10px 14px;
  margin: 6px 0;
}

.mask-title {
  font-size: 14px;
  font-weight: 700;
  color: #ff6b6b;
  margin: 0 0 8px 4px;
  letter-spacing: 0.5px;
}

.mask-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 4px 0;
}

.mask-label {
  flex-shrink: 0;
  width: 44px;
  font-size: 13px;
  font-weight: 700;
  color: #aaa;
  padding-top: 2px;
}

.mask-values {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #ffc9c9;
  font-weight: 600;
  line-height: 1.5;
  word-break: break-all;
}

.pidvid-row {
  display: flex;
  gap: 6px;
  width: 100%;
}

.pidvid-input {
  flex: 1;
  min-width: 0;
  padding: 14px 10px;
  background-color: #2c2c2e;
  border: 1px solid #3a3a3c;
  border-radius: 10px;
  font-size: 14px;
  color: #ddd;
  font-family: 'Courier New', monospace;
  text-align: center;
}

.pidvid-input:focus {
  outline: none;
  border-color: #3cc51f;
}

.pidvid-row button {
  flex: 0.8;
  min-width: 0;
  padding: 14px 8px;
  background-color: #2c2c2e;
  border: 1px solid #3a3a3c;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  color: #ddd;
}

.pidvid-row button:hover {
  background-color: #3a3a3c;
  border-color: #4a4a4c;
}

.pidvid-row button:active {
  background-color: #4a4a4c;
}
</style>