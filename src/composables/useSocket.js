import { ref, onBeforeUnmount } from 'vue'
import { io } from 'socket.io-client'

/**
 * Socket.IO composable
 * - Auth via Bearer token
 * - Helpers to join/leave class rooms
 * - Graceful fallback if server rejects auth (e.g., local mock tokens)
 */
export function useSocket(baseApiUrl) {
  const connected = ref(false)
  const error = ref(null)
  const socketRef = ref(null)

  // Derive server origin from API base like http://localhost:8080/api/v1
  function getServerUrl() {
    try {
      if (!baseApiUrl) return ''
      const u = new URL(baseApiUrl)
      // strip /api/... path
      return `${u.protocol}//${u.host}`
    } catch {
      return ''
    }
  }

  function connect(token, schoolId) {
    const url = getServerUrl()
    if (!url) {
      error.value = 'Invalid server URL for sockets'
      return
    }
    // If already connected, do nothing
    if (socketRef.value) return

    const socket = io(url, {
      transports: ['websocket'],
      withCredentials: true,
      auth: token ? { token } : {},
      autoConnect: true
    })

    socket.on('connect', () => {
      connected.value = true
      error.value = null
      // Join tenant rooms so server can broadcast per-school events
      if (schoolId) {
        try { socket.emit('join:tenant', schoolId) } catch {}
      }
    })

    socket.on('connect_error', (err) => {
      error.value = err?.message || 'Socket connection error'
      connected.value = false
    })

    socket.on('disconnect', () => {
      connected.value = false
    })

    socketRef.value = socket
  }

  function disconnect() {
    if (socketRef.value) {
      socketRef.value.disconnect()
      socketRef.value = null
      connected.value = false
    }
  }

  function joinClass(classId) {
    socketRef.value?.emit('join:class', classId)
  }

  function leaveClass(classId) {
    socketRef.value?.emit('leave:class', classId)
  }

  function on(event, cb) {
    socketRef.value?.on(event, cb)
  }

  function off(event, cb) {
    socketRef.value?.off(event, cb)
  }

  function emit(event, payload) {
    socketRef.value?.emit(event, payload)
  }

  onBeforeUnmount(() => disconnect())

  return { connected, error, connect, disconnect, joinClass, leaveClass, on, off, emit }
}
