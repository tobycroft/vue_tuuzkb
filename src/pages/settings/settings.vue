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

    <div class="mask-panel" v-if="ws.state.MaskButton && ws.state.MaskButton.length > 0">
      <div class="mask-title">屏蔽状态</div>
      <div class="mask-group">
        <div class="mask-card" v-for="item in ws.parseKeyList(ws.state.MaskButton)" :key="item.hex">
          <span class="mask-card-name">{{ item.display }}</span>
        </div>
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

    <div class="section-title">系统</div>
    <div class="btn-row">
      <button @click="cmd('reset')" type="button">重启</button>
      <button @click="cmd('cfgget')" type="button">获取 cfg</button>
      <button @click="cmd('setting_reset')" type="button">重置</button>
    </div>

    <div class="btn-row">
      <button @click="cmd('setusb')" type="button">USBStr</button>
    </div>

    <div class="section-title">VID / PID</div>
    <div class="pidvid-row">
      <input v-model="vidInput" class="pidvid-input" placeholder="VID (如 05ac)" />
      <input v-model="pidInput" class="pidvid-input" placeholder="PID (如 0256)" />
      <button @click="setPidVid" type="button">设置</button>
    </div>
  </div>
</template>

<script src="./settings.js"></script>

<style scoped src="./settings.css"></style>