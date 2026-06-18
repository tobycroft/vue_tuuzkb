import ws from '../../store/ws.js'

export default {
  name: 'HardwarePage',
  data() {
    return { ws: ws, pidInput: '', vidInput: '' };
  },
  watch: {
    'ws.state.pid'(v) {
      if (this.pidInput === '' && typeof v === 'number' && v > 0) {
        this.pidInput = v.toString(16).padStart(4, '0');
      }
    },
    'ws.state.vid'(v) {
      if (this.vidInput === '' && typeof v === 'number' && v > 0) {
        this.vidInput = v.toString(16).padStart(4, '0');
      }
    }
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