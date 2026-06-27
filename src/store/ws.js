import { reactive } from 'vue'

const hidKeyNameMap = {
  '04': 'A', '05': 'B', '06': 'C', '07': 'D', '08': 'E', '09': 'F', '0A': 'G',
  '0B': 'H', '0C': 'I', '0D': 'J', '0E': 'K', '0F': 'L', '10': 'M', '11': 'N',
  '12': 'O', '13': 'P', '14': 'Q', '15': 'R', '16': 'S', '17': 'T', '18': 'U',
  '19': 'V', '1A': 'W', '1B': 'X', '1C': 'Y', '1D': 'Z',
  '1E': '1 / !', '1F': '2 / @', '20': '3 / #', '21': '4 / $', '22': '5 / %',
  '23': '6 / ^', '24': '7 / &', '25': '8 / *', '26': '9 / (', '27': '0 / )',
  '28': 'Enter', '29': 'ESC', '2A': 'Backspace', '2B': 'Tab', '2C': 'Space',
  '2D': '- / _', '2E': '= / +', '2F': '[ / {', '30': '] / }',
  '31': 'Key\\ / |', '32': 'Key# / ~', '33': '; / :', '34': "' / \"",
  '35': '` / ~', '36': ', / <', '37': '. / >', '38': '/ / ?',
  '39': 'Caps Lock',
  '3A': 'F1', '3B': 'F2', '3C': 'F3', '3D': 'F4', '3E': 'F5', '3F': 'F6',
  '40': 'F7', '41': 'F8', '42': 'F9', '43': 'F10', '44': 'F11', '45': 'F12',
  '46': 'PrintScreen', '47': 'ScrollLock', '48': 'Pause',
  '49': 'Insert', '4A': 'Home', '4B': 'PgUp', '4C': 'Delete',
  '4D': 'End', '4E': 'PgDn', '4F': '→', '50': '←', '51': '↓', '52': '↑',
  '53': 'NumLock',
  '54': 'Num /', '55': 'Num *', '56': 'Num -', '57': 'Num +',
  '58': 'Num Enter', '59': 'Num 1 / End', '5A': 'Num 2 / ↓',
  '5B': 'Num 3 / PgDn', '5C': 'Num 4 / ←', '5D': 'Num 5',
  '5E': 'Num 6 / →', '5F': 'Num 7 / Home', '60': 'Num 8 / ↑',
  '61': 'Num 9 / PgUp', '62': 'Num 0 / Ins', '63': 'Num . / Del',
  '64': 'Keycode45', '65': 'APP',
  '85': 'Keycode107', '87': 'Keycode56', '88': 'J133', '89': 'Keycode14',
  '8A': 'J132', '8B': 'J131', '90': 'KC-L(Hangul)', '91': 'KC-R(Hanja)',
  'E0': 'Ctrl L', 'E1': 'Shift L', 'E2': 'Alt L', 'E3': 'Win L',
  'E4': 'Ctrl R', 'E5': 'Shift R', 'E6': 'Alt R', 'E7': 'Win R'
}

const modifierBitMap = {
  '01': 'L Ctrl', '02': 'L Shift', '04': 'L Alt', '08': 'L Win',
  '10': 'R Ctrl', '20': 'R Shift', '40': 'R Alt', '80': 'R Win'
}

export function getKeyName(code) {
  if (!code) return ''
  const key = code.toUpperCase().padStart(2, '0')
  return hidKeyNameMap[key] || code.toUpperCase()
}

function decodeModifierByte(hexCode) {
  const n = parseInt(hexCode, 16)
  if (isNaN(n) || n === 0) return null
  if (n >= 0xE0 && n <= 0xE7) {
    return hidKeyNameMap[n.toString(16).toUpperCase().padStart(2, '0')] || null
  }
  const names = []
  for (const bit of Object.keys(modifierBitMap)) {
    if (n & parseInt(bit, 16)) {
      names.push(modifierBitMap[bit])
    }
  }
  if (names.length > 0) return names.join(' + ')
  return null
}

export function parseCtrlList(arr) {
  if (!arr || arr.length === 0) return []
  return arr.map(c => {
    const decoded = decodeModifierByte(c)
    const hex = c.toUpperCase().padStart(2, '0')
    return { name: decoded || hex, hex: hex }
  })
}

export function parseKeyList(arr) {
  if (!arr || arr.length === 0) return []
  return arr.map(c => {
    const name = getKeyName(c)
    const hex = c.toUpperCase().padStart(2, '0')
    return { name: name, hex: hex }
  })
}

export function formatCtrlList(arr) {
  if (!arr || arr.length === 0) return ''
  return arr.map(c => {
    const decoded = decodeModifierByte(c)
    const hex = c.toUpperCase().padStart(2, '0')
    return decoded ? decoded + ' (' + hex + ')' : hex
  }).join(', ')
}

export function formatKeyList(arr) {
  if (!arr || arr.length === 0) return ''
  return arr.map(c => {
    const name = getKeyName(c)
    const hex = c.toUpperCase().padStart(2, '0')
    return name === hex ? hex : name + ' (' + hex + ')'
  }).join(', ')
}

export function formatMaskList(arr) {
  return formatKeyList(arr)
}

const state = reactive({
  socket: null,
  connectionMessage: '未连接',
  connectionClass: 'status-failed',
  MaskCtrl: [],
  MaskButton: [],
  pid: '',
  vid: '',
  baud: 0,
  Endpoint_BeforeDelay_Random: 0,
  Endpoint_BeforeDelay: 0,
  Endpoint_delay: 0,
  Endpoint_dynamic_mode: 0,
  sep: 1,
  LCD1: '',
  LCD2: '',
  Mode: 0,
  macmode: false,
  currentOutput: '',
  currentIP: '',
  outputs: [],
  wakeLock: null,
  heartbeatTimer: null,
  _listeners: new Set()
})

let initialized = false

function updateFormData(data) {
  for (const i in data) {
    if (data[i] !== undefined && data[i] !== null) {
      state[i] = data[i]
    }
  }
}

function notifyListeners() {
  for (const cb of state._listeners) {
    try { cb() } catch (e) {}
  }
}

export function connectWebSocket(url) {
  if (state.socket && state.socket.readyState === WebSocket.OPEN) {
    return
  }

  state.connectionMessage = '连接中……'
  state.connectionClass = 'status-progress'

  let socket
  try {
    socket = new WebSocket(url)
  } catch (err) {
    state.connectionMessage = '连接失败×'
    state.connectionClass = 'status-failed'
    return
  }

  socket.onopen = () => {
    state.socket = socket
    state.connectionMessage = '连接建立'
    state.connectionClass = 'status-success'
    requestWakeLock()
    requestInfo()
    startHeartbeat()
    notifyListeners()
  }

  socket.onerror = () => {
    state.connectionMessage = '连接错误'
    state.connectionClass = 'status-failed'
    notifyListeners()
  }

  socket.onmessage = (event) => {
    if (event.data === 'update') {
      requestInfo()
      return
    }
    try {
      const data = JSON.parse(event.data)
      updateFormData(data)
      notifyListeners()
    } catch (e) {
      console.error('解析消息失败:', e)
    }
  }

  socket.onclose = () => {
    state.socket = null
    state.connectionMessage = '连接被关闭'
    state.connectionClass = 'status-failed'
    stopHeartbeat()
    notifyListeners()
  }
}

export function disconnectWebSocket() {
  if (state.socket) {
    try { state.socket.close() } catch (e) {}
    state.socket = null
  }
  stopHeartbeat()
}

export function sendMessage(msg) {
  if (state.socket && state.socket.readyState === WebSocket.OPEN) {
    state.socket.send(JSON.stringify(msg))
  }
}

export function cmdFunc(type) {
  sendMessage({ route: 'kbd', type: type })
}

export function requestInfo() {
  sendMessage({ route: 'info' })
}

export function requestSemiConfig(type, allData) {
  sendMessage({ route: 'semi-config', type: type, data: allData })
}

function startHeartbeat() {
  stopHeartbeat()
  state.heartbeatTimer = setInterval(() => {
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      state.socket.send(JSON.stringify({ route: 'ping' }))
    }
  }, 9000)
}

function stopHeartbeat() {
  if (state.heartbeatTimer) {
    clearInterval(state.heartbeatTimer)
    state.heartbeatTimer = null
  }
}

function requestWakeLock() {
  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').then((wl) => {
      state.wakeLock = wl
    }).catch(() => {})
  }
}

export function subscribe(cb) {
  state._listeners.add(cb)
  return () => state._listeners.delete(cb)
}

export function reconnect() {
  const ip = localStorage.getItem('config_ip')
  if (ip) {
    connectWebSocket(ip)
  }
}

export function getState() {
  return state
}

export function initOnce() {
  if (initialized) return
  initialized = true
}

export default {
  state,
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
  cmdFunc,
  requestInfo,
  requestSemiConfig,
  reconnect,
  subscribe,
  getState,
  getKeyName,
  formatMaskList,
  formatCtrlList,
  formatKeyList,
  parseCtrlList,
  parseKeyList
}