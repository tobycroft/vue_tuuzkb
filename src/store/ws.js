import { reactive } from 'vue'

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
  kbmode: 0,
  kbcfg: 0,
  currentOutput: '',
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
  getState
}
