/**
 * WebRTC Composable for Live Video Conferencing
 * Handles camera, microphone, screen sharing, and peer connections
 */

import { ref, onUnmounted } from 'vue'

export function useWebRTC() {
  // Media streams
  const localStream = ref(null)
  const screenStream = ref(null)
  const remoteStreams = ref(new Map())
  
  // Device states
  const isCameraOn = ref(false)
  const isMicrophoneOn = ref(false)
  const isScreenSharing = ref(false)
  
  // Available devices
  const cameras = ref([])
  const microphones = ref([])
  const speakers = ref([])
  const selectedCamera = ref(null)
  const selectedMicrophone = ref(null)
  
  // Connection states
  const isConnecting = ref(false)
  const connectionError = ref(null)
  const connectionQuality = ref('excellent')
  
  // Peer connections
  const peerConnections = ref(new Map())
  
  /**
   * Get list of available media devices
   */
  async function getMediaDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      
      cameras.value = devices.filter(device => device.kind === 'videoinput')
      microphones.value = devices.filter(device => device.kind === 'audioinput')
      speakers.value = devices.filter(device => device.kind === 'audiooutput')
      
      // Set default devices
      if (cameras.value.length > 0 && !selectedCamera.value) {
        selectedCamera.value = cameras.value[0].deviceId
      }
      if (microphones.value.length > 0 && !selectedMicrophone.value) {
        selectedMicrophone.value = microphones.value[0].deviceId
      }
      
      return { cameras: cameras.value, microphones: microphones.value, speakers: speakers.value }
    } catch (error) {
      console.error('Error getting media devices:', error)
      connectionError.value = 'Failed to access media devices'
      throw error
    }
  }
  
  /**
   * Start local camera and microphone
   */
  async function startLocalStream(options = {}) {
    try {
      isConnecting.value = true
      connectionError.value = null
      
      const constraints = {
        video: options.video !== false ? {
          deviceId: selectedCamera.value ? { exact: selectedCamera.value } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: options.audio !== false ? {
          deviceId: selectedMicrophone.value ? { exact: selectedMicrophone.value } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStream.value = stream
      
      isCameraOn.value = stream.getVideoTracks().length > 0
      isMicrophoneOn.value = stream.getAudioTracks().length > 0
      
      isConnecting.value = false
      
      return stream
    } catch (error) {
      isConnecting.value = false
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        connectionError.value = 'Camera/microphone access denied. Please allow permissions in your browser.'
      } else if (error.name === 'NotFoundError') {
        connectionError.value = 'No camera or microphone found on your device.'
      } else if (error.name === 'NotReadableError') {
        connectionError.value = 'Camera or microphone is already in use by another application.'
      } else {
        connectionError.value = 'Failed to access camera/microphone: ' + error.message
      }
      
      console.error('Error starting local stream:', error)
      throw error
    }
  }
  
  /**
   * Stop local stream
   */
  function stopLocalStream() {
    if (localStream.value) {
      localStream.value.getTracks().forEach(track => track.stop())
      localStream.value = null
      isCameraOn.value = false
      isMicrophoneOn.value = false
    }
  }
  
  /**
   * Toggle camera on/off
   */
  async function toggleCamera() {
    if (!localStream.value) {
      await startLocalStream({ video: true, audio: isMicrophoneOn.value })
      return
    }
    
    const videoTrack = localStream.value.getVideoTracks()[0]
    
    if (videoTrack) {
      if (videoTrack.enabled) {
        videoTrack.enabled = false
        isCameraOn.value = false
      } else {
        videoTrack.enabled = true
        isCameraOn.value = true
      }
    } else {
      // No video track, need to add one
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera.value ? { exact: selectedCamera.value } : undefined,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })
        
        const newVideoTrack = stream.getVideoTracks()[0]
        localStream.value.addTrack(newVideoTrack)
        isCameraOn.value = true
      } catch (error) {
        console.error('Error adding video track:', error)
        connectionError.value = 'Failed to turn on camera'
        throw error
      }
    }
  }
  
  /**
   * Toggle microphone on/off
   */
  async function toggleMicrophone() {
    try {
      if (!localStream.value) {
        // Start an audio-only stream if none exists yet
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: selectedMicrophone.value ? { exact: selectedMicrophone.value } : undefined,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: false
        })
        localStream.value = stream
        isMicrophoneOn.value = true
        return
      }
      const audioTrack = localStream.value.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        isMicrophoneOn.value = audioTrack.enabled
      } else {
        // Attach a new audio track if none exists
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: selectedMicrophone.value ? { exact: selectedMicrophone.value } : undefined,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        })
        const newAudioTrack = stream.getAudioTracks()[0]
        localStream.value.addTrack(newAudioTrack)
        isMicrophoneOn.value = true
      }
    } catch (error) {
      console.error('Error toggling microphone:', error)
      connectionError.value = 'Failed to access or toggle microphone'
      throw error
    }
  }
  
  /**
   * Change camera device
   */
  async function switchCamera(deviceId) {
    if (!localStream.value) return
    
    try {
      const videoTrack = localStream.value.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.stop()
        localStream.value.removeTrack(videoTrack)
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      const newVideoTrack = stream.getVideoTracks()[0]
      localStream.value.addTrack(newVideoTrack)
      selectedCamera.value = deviceId
      isCameraOn.value = true
    } catch (error) {
      console.error('Error switching camera:', error)
      connectionError.value = 'Failed to switch camera'
      throw error
    }
  }
  
  /**
   * Change microphone device
   */
  async function switchMicrophone(deviceId) {
    if (!localStream.value) return
    
    try {
      const audioTrack = localStream.value.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.stop()
        localStream.value.removeTrack(audioTrack)
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      const newAudioTrack = stream.getAudioTracks()[0]
      localStream.value.addTrack(newAudioTrack)
      selectedMicrophone.value = deviceId
      isMicrophoneOn.value = true
    } catch (error) {
      console.error('Error switching microphone:', error)
      connectionError.value = 'Failed to switch microphone'
      throw error
    }
  }
  
  /**
   * Start screen sharing
   */
  async function startScreenShare() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: false
      })
      
      screenStream.value = stream
      isScreenSharing.value = true
      
      // Listen for user stopping screen share via browser UI
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare()
      }
      
      return stream
    } catch (error) {
      console.error('Error starting screen share:', error)
      connectionError.value = 'Failed to start screen sharing'
      throw error
    }
  }
  
  /**
   * Stop screen sharing
   */
  function stopScreenShare() {
    if (screenStream.value) {
      screenStream.value.getTracks().forEach(track => track.stop())
      screenStream.value = null
      isScreenSharing.value = false
    }
  }
  
  /**
   * Get audio level for visualizations
   */
  function getAudioLevel(stream) {
    if (!stream) return 0
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      
      microphone.connect(analyser)
      analyser.fftSize = 256
      
      const getLevel = () => {
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        return average / 255 // Normalize to 0-1
      }
      
      return getLevel
    } catch (error) {
      console.error('Error getting audio level:', error)
      return () => 0
    }
  }
  
  /**
   * Monitor connection quality
   */
  function monitorConnectionQuality(peerConnection) {
    if (!peerConnection) return
    
    const interval = setInterval(async () => {
      try {
        const stats = await peerConnection.getStats()
        let packetsLost = 0
        let packetsReceived = 0
        
        stats.forEach(report => {
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            packetsLost = report.packetsLost || 0
            packetsReceived = report.packetsReceived || 0
          }
        })
        
        if (packetsReceived > 0) {
          const lossRate = packetsLost / (packetsLost + packetsReceived)
          
          if (lossRate < 0.02) {
            connectionQuality.value = 'excellent'
          } else if (lossRate < 0.05) {
            connectionQuality.value = 'good'
          } else if (lossRate < 0.10) {
            connectionQuality.value = 'fair'
          } else {
            connectionQuality.value = 'poor'
          }
        }
      } catch (error) {
        console.error('Error monitoring connection quality:', error)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }
  
  /**
   * Cleanup on unmount
   */
  function cleanup() {
    stopLocalStream()
    stopScreenShare()
    
    // Close all peer connections
    peerConnections.value.forEach(pc => pc.close())
    peerConnections.value.clear()
    
    // Clear remote streams
    remoteStreams.value.clear()
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })
  
  return {
    // Streams
    localStream,
    screenStream,
    remoteStreams,
    
    // States
    isCameraOn,
    isMicrophoneOn,
    isScreenSharing,
    isConnecting,
    connectionError,
    connectionQuality,
    
    // Devices
    cameras,
    microphones,
    speakers,
    selectedCamera,
    selectedMicrophone,
    
    // Methods
    getMediaDevices,
    startLocalStream,
    stopLocalStream,
    toggleCamera,
    toggleMicrophone,
    switchCamera,
    switchMicrophone,
    startScreenShare,
    stopScreenShare,
    getAudioLevel,
    monitorConnectionQuality,
    cleanup
  }
}
