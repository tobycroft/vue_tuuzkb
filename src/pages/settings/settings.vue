<template>
  <div class="page">
    <div :class="ws.state.connectionClass" class="connection-status">
      {{ ws.state.connectionMessage }}
    </div>

    <div class="section-title">屏蔽控制</div>
    <div class="btn-row">
      <button @click="cmd('bankey')" type="button">屏蔽键</button>
      <button @click="cmd('unbanall')" type="button">解除屏蔽</button>
      <button @click="cmd('toggle_macmode')" :class="ws.state.macmode ? 'option-selected' : 'option-dim'" type="button">Mac</button>
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

    <div class="section-title">系统</div>
    <div class="btn-row">
      <button @click="cmd('setting_reset')" type="button">重置</button>
    </div>
  </div>
</template>

<script src="./settings.js"></script>

<style scoped src="./settings.css"></style>