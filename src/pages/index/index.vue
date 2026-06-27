<template>
  <div class="page">
    <div :class="ws.state.connectionClass" class="connection-status">
      {{ ws.state.connectionMessage }}
    </div>

    <div class="info-panel">
      <div class="row-2col">
        <div class="output-row">
          <button v-for="dev in ws.state.outputs" :key="dev.name" @click="switchOutput(dev.name)" :class="getOutputClass(dev.name)" type="button">输出 {{ dev.name }}</button>
        </div>
        <div class="compact-info">
          <span><small>VID</small>{{ ws.state.vid || '—' }}</span>
          <span><small>PID</small>{{ ws.state.pid || '—' }}</span>
        </div>
      </div>
    </div>

    <div class="mask-panel" v-if="(ws.state.MaskCtrl && ws.state.MaskCtrl.length > 0) || (ws.state.MaskButton && ws.state.MaskButton.length > 0)">
      <div class="mask-title">屏蔽状态</div>
      <div class="mask-group" v-if="ws.state.MaskCtrl && ws.state.MaskCtrl.length > 0">
        <span class="mask-tag" v-for="item in ws.parseCtrlList(ws.state.MaskCtrl)" :key="item.hex" :title="item.hex">{{ item.name }}</span>
      </div>
      <div class="mask-group" v-if="ws.state.MaskButton && ws.state.MaskButton.length > 0">
        <span class="mask-tag" v-for="item in ws.parseKeyList(ws.state.MaskButton)" :key="item.hex" :title="item.hex">{{ item.name }}</span>
      </div>
    </div>

    <div class="sliders-panel">
      <div class="slider-row">
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

      <div class="slider-row">
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

      <div class="slider-row">
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
    </div>

    <div class="bottom-bar">
      <div class="section-title-sm">触发模式</div>
      <div class="btn-row">
        <button @click="modeOption(0)" :class="getModeClass(0)" type="button">关闭</button>
        <button @click="modeOption(1)" :class="getModeClass(1)" type="button">On-Q</button>
        <button @click="modeOption(2)" :class="getModeClass(2)" type="button">On-Whel</button>
      </div>

      <div class="section-title-sm">键盘模式</div>
      <div class="btn-row">
        <button @click="endPointOption(0)" :class="getEndpointClass(0)" type="button">Ste</button>
        <button @click="endPointOption(1)" :class="getEndpointClass(1)" type="button">Dym</button>
        <button @click="endPointOption(2)" :class="getEndpointClass(2)" type="button">Wde</button>
        <button @click="endPointOption(3)" :class="getEndpointClass(3)" type="button">Ato</button>
        <button @click="endPointOption(4)" :class="getEndpointClass(4)" type="button">Atw</button>
        <button @click="endPointOption(5)" :class="getEndpointClass(5)" type="button">Man</button>
      </div>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style scoped src="./index.css"></style>