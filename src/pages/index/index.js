import ws from '../../store/ws.js'

export default {
  name: 'IndexPage',
  data() {
    return { ws: ws, cfggetTimer: null };
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
        Mode: s.Mode
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
      if (this.cfggetTimer) {
        clearTimeout(this.cfggetTimer);
      }
      this.cfggetTimer = setTimeout(() => {
        ws.requestInfoCfgGet();
        this.cfggetTimer = null;
      }, 1000);
    },
    getOutputClass(name) {
      return ws.state.currentOutput === name ? 'option-selected' : '';
    },
    cmd(type) {
      ws.cmdFunc(type);
    }
  }
};