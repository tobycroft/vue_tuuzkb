import ws from '../../store/ws.js'

export default {
  name: 'HardwarePage',
  data() {
    return { ws: ws, vidInput: '05ac', pidInput: '0256', mfgrInput: '', prodInput: '', serialInput: '', cfggetTimer: null };
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
      const pid = parseInt(pidStr, 16);
      const vid = parseInt(vidStr, 16);
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
    setUsbString() {
      const mfgr = (this.mfgrInput || '').trim();
      const prod = (this.prodInput || '').trim();
      const serial = (this.serialInput || '').trim();
      if (!mfgr && !prod && !serial) {
        alert('请至少输入一个字段');
        return;
      }
      ws.sendMessage({
        route: 'kbd',
        type: 'setusbstr',
        data: { mfgr: mfgr, prod: prod, serial: serial }
      });
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
    setPollingRate(rate) {
      ws.state.polling_rate = rate;
      ws.sendMessage({
        route: 'kbd',
        type: 'polling_rate',
        data: { rate: rate }
      });
    },
    getPollingRateClass(rate) {
      return ws.state.polling_rate === rate ? 'option-selected' : '';
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
  },
  watch: {
    'ws.state.vid': {
      immediate: true,
      handler(val) { this.vidInput = val || ''; }
    },
    'ws.state.pid': {
      immediate: true,
      handler(val) { this.pidInput = val || ''; }
    },
    'ws.state.manufacturer': {
      immediate: true,
      handler(val) { this.mfgrInput = val || ''; }
    },
    'ws.state.product': {
      immediate: true,
      handler(val) { this.prodInput = val || ''; }
    },
    'ws.state.serial': {
      immediate: true,
      handler(val) { this.serialInput = val || ''; }
    }
  }
};