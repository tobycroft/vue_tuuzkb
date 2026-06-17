<template>
  <div class="page">
    <div :class="ws.state.connectionClass" class="connection-status">
      {{ ws.state.connectionMessage }}
    </div>

    <div class="info-panel">
      <div class="row-2col">
        <div class="output-row">
          <button @click="switchOutput('A')" :class="getOutputClass('A')" type="button">A</button>
          <button @click="switchOutput('B')" :class="getOutputClass('B')" type="button">B</button>
        </div>
        <div class="compact-info">
          <span><small>VID</small>{{ ws.state.vid || '—' }}</span>
          <span><small>PID</small>{{ ws.state.pid || '—' }}</span>
          <span><small>Baud</small>{{ ws.state.baud || '—' }}</span>
        </div>
      </div>
      <div class="compact-lcd">
        <span class="lcd-label-sm">LCD1</span>
        <span class="lcd-text-sm">{{ ws.state.LCD1 }}</span>
        <span class="lcd-divider">|</span>
        <span class="lcd-label-sm">LCD2</span>
        <span class="lcd-text-sm">{{ ws.state.LCD2 }}</span>
      </div>
    </div>

    <div class="mask-panel" v-if="(ws.state.MaskCtrl && ws.state.MaskCtrl.length > 0) || (ws.state.MaskButton && ws.state.MaskButton.length > 0)">
      <div class="mask-title">屏蔽状态</div>
      <div class="mask-row" v-if="ws.state.MaskCtrl && ws.state.MaskCtrl.length > 0">
        <span class="mask-label">Ctrl</span>
        <span class="mask-values">{{ formatHexList(ws.state.MaskCtrl) }}</span>
      </div>
      <div class="mask-row" v-if="ws.state.MaskButton && ws.state.MaskButton.length > 0">
        <span class="mask-label">Btn</span>
        <span class="mask-values">{{ formatHexList(ws.state.MaskButton) }}</span>
      </div>
    </div>

    <div class="slider-group">
      <div class="slider-label">前置震动: {{ ws.state.Endpoint_BeforeDelay_Random }}</div>
      <input
          type="range"
          class="slider"
          :value="ws.state.Endpoint_BeforeDelay_Random"
          min="0"
          max="30"
          step="1"
          @change="onSliderChange('Endpoint_BeforeDelay_Random', $event)"
      />
    </div>

    <div class="slider-group">
      <div class="slider-label">前置时间: {{ ws.state.Endpoint_BeforeDelay }}</div>
      <input
          type="range"
          class="slider"
          :value="ws.state.Endpoint_BeforeDelay"
          min="0"
          max="50"
          step="1"
          @change="onSliderChange('Endpoint_BeforeDelay', $event)"
      />
    </div>

    <div class="slider-group">
      <div class="slider-label">操作间隔: {{ ws.state.Endpoint_delay }}</div>
      <input
          type="range"
          class="slider"
          :value="ws.state.Endpoint_delay"
          min="0"
          max="200"
          step="1"
          @change="onSliderChange('Endpoint_delay', $event)"
      />
    </div>

    <div class="section-title">触发模式</div>
    <div class="btn-row">
      <button @click="modeOption(0)" :class="getModeClass(0)" type="button">关闭</button>
      <button @click="modeOption(1)" :class="getModeClass(1)" type="button">On-Q</button>
      <button @click="modeOption(2)" :class="getModeClass(2)" type="button">On-Whel</button>
    </div>

    <div class="section-title">键盘模式</div>
    <div class="btn-row">
      <button @click="endPointOption(0)" :class="getEndpointClass(0)" type="button">Ste</button>
      <button @click="endPointOption(1)" :class="getEndpointClass(1)" type="button">Dym</button>
      <button @click="endPointOption(2)" :class="getEndpointClass(2)" type="button">Wde</button>
      <button @click="endPointOption(3)" :class="getEndpointClass(3)" type="button">Ato</button>
      <button @click="endPointOption(4)" :class="getEndpointClass(4)" type="button">Atw</button>
      <button @click="endPointOption(5)" :class="getEndpointClass(5)" type="button">Man</button>
    </div>
  </div>
</template>

<script>
import ws from '../../store/ws.js'

export default {
  name: 'IndexPage',
  data() {
    return { ws: ws };
  },
  mounted() {
    ws.reconnect();
  },
  methods: {
    onSliderChange(field, event) {
      const value = Number(event.target.value);
      ws.state[field] = value;
      ws.requestSemiConfig(field, this.getSnapshot());
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
    modeOption(option) {
      ws.state.Mode = option;
      ws.requestSemiConfig('Mode', this.getSnapshot());
    },
    endPointOption(option) {
      ws.state.Endpoint_dynamic_mode = option;
      ws.requestSemiConfig('Endpoint_dynamic_mode', this.getSnapshot());
    },
    getEndpointClass(option) {
      return ws.state.Endpoint_dynamic_mode === option ? 'option-selected' : '';
    },
    getModeClass(option) {
      return ws.state.Mode === option ? 'option-selected' : '';
    },
    switchOutput(name) {
      ws.state.currentOutput = name;
      ws.sendMessage({
        route: "semi-config",
        type: "switch_output",
        data: { name: name }
      });
    },
    getOutputClass(name) {
      return ws.state.currentOutput === name ? 'option-selected' : '';
    },
    formatHexList(arr) {
      if (!arr || arr.length === 0) return '—';
      return arr.map(v => v.length === 1 ? '0' + v.toUpperCase() : v.toUpperCase()).join(', ');
    }
  }
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 10px;
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

.info-panel {
  background-color: #1c1c1e;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 12px 14px;
}

.row-2col {
  display: flex;
  gap: 10px;
  align-items: stretch;
  margin-bottom: 10px;
}

.row-2col > * { flex: 1; }

.output-row {
  display: flex;
  gap: 6px;
}

.output-row button {
  flex: 1;
  padding: 14px 10px;
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  background-color: #2c2c2e;
  color: #ddd;
  border-radius: 8px;
  border: 1px solid #3a3a3c;
  cursor: pointer;
}

.output-row .option-selected {
  background-color: #3cc51f;
  color: #fff;
  border-color: #3cc51f;
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
  margin: 10px 0 4px 0;
  padding-left: 4px;
  letter-spacing: 0.5px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.slider-label {
  font-size: 15px;
  margin: 4px 0 6px 4px;
  color: #ddd;
  font-weight: 600;
}

.slider {
  width: 100%;
  height: 48px;
  accent-color: #3cc51f;
  margin: 0;
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
  font-size: 17px;
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
</style>
