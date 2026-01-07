<template>
  <div 
    class="relative bg-gray-900 rounded-lg overflow-hidden group"
    :class="[
      isSpeaking ? 'ring-2 ring-green-500' : '',
      isScreenShare ? 'col-span-2 row-span-2' : ''
    ]"
  >
    <!-- Video Element -->
    <video
      ref="videoRef"
      class="w-full h-full object-cover"
      :class="{ 'mirror': isLocalStream && !isScreenShare }"
      autoplay
      playsinline
      :muted="isLocalStream"
    ></video>

    <!-- No Video Placeholder -->
    <div 
      v-if="!hasVideo"
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800"
    >
      <div class="text-center">
        <div 
          class="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold"
          :class="bgColor"
        >
          {{ initials }}
        </div>
        <div class="text-white text-sm font-medium">{{ participant.name }}</div>
      </div>
    </div>

    <!-- Status Indicators -->
    <div class="absolute top-2 left-2 flex items-center space-x-1">
      <!-- Muted Indicator -->
      <div 
        v-if="!participant.audio" 
        class="bg-red-500 px-2 py-1 rounded-full flex items-center space-x-1"
      >
        <span class="material-icons text-xs">mic_off</span>
      </div>

      <!-- Hand Raised -->
      <div 
        v-if="participant.handRaised" 
        class="bg-yellow-500 px-2 py-1 rounded-full animate-pulse"
      >
        <span class="material-icons text-xs">front_hand</span>
      </div>

      <!-- Screen Sharing -->
      <div 
        v-if="isScreenShare" 
        class="bg-blue-500 px-2 py-1 rounded-full flex items-center space-x-1"
      >
        <span class="material-icons text-xs">screen_share</span>
        <span class="text-xs">Screen</span>
      </div>
    </div>

    <!-- Connection Quality -->
    <div 
      v-if="showConnectionQuality"
      class="absolute top-2 right-2"
    >
      <div 
        class="flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full"
        :class="connectionQualityClass"
      >
        <div class="w-2 h-2 rounded-full" :class="connectionDotClass"></div>
        <span class="text-white text-xs">{{ connectionQuality }}</span>
      </div>
    </div>

    <!-- Name Tag -->
    <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between">
      <div class="bg-black/70 px-2 py-1 rounded flex items-center space-x-1 flex-1 min-w-0">
        <span class="material-icons text-white text-xs">
          {{ participant.role === 'teacher' ? 'school' : 'person' }}
        </span>
        <span class="text-white text-xs font-medium truncate">
          {{ participant.name }}{{ isLocalStream ? ' (You)' : '' }}
        </span>
        <span 
          v-if="participant.role === 'teacher'"
          class="text-xs px-1 py-0.5 bg-blue-500 text-white rounded"
        >
          Teacher
        </span>
      </div>

      <!-- Speaking Indicator -->
      <div 
        v-if="isSpeaking && participant.audio"
        class="ml-2 flex items-center space-x-1"
      >
        <div class="w-1 h-2 bg-green-500 rounded animate-pulse"></div>
        <div class="w-1 h-3 bg-green-500 rounded animate-pulse" style="animation-delay: 0.1s"></div>
        <div class="w-1 h-2 bg-green-500 rounded animate-pulse" style="animation-delay: 0.2s"></div>
      </div>
    </div>

    <!-- Teacher Controls (hover) -->
    <div 
      v-if="showControls && canControl"
      class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2"
    >
      <button
        v-if="!isLocalStream"
        @click="$emit('mute-participant', participant)"
        class="bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white transition-colors"
        :title="participant.audio ? 'Mute' : 'Unmute'"
      >
        <span class="material-icons text-sm">
          {{ participant.audio ? 'mic_off' : 'mic' }}
        </span>
      </button>

      <button
        v-if="!isLocalStream"
        @click="$emit('toggle-video', participant)"
        class="bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white transition-colors"
        :title="participant.video ? 'Turn off video' : 'Turn on video'"
      >
        <span class="material-icons text-sm">
          {{ participant.video ? 'videocam_off' : 'videocam' }}
        </span>
      </button>

      <button
        v-if="!isLocalStream && participant.handRaised"
        @click="$emit('lower-hand', participant)"
        class="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-full text-white transition-colors"
        title="Lower hand"
      >
        <span class="material-icons text-sm">downloading</span>
      </button>

      <button
        v-if="!isLocalStream"
        @click="$emit('remove-participant', participant)"
        class="bg-red-500 hover:bg-red-600 p-2 rounded-full text-white transition-colors"
        title="Remove from class"
      >
        <span class="material-icons text-sm">person_remove</span>
      </button>
    </div>

    <!-- Pin/Unpin Button -->
    <button
      v-if="canPin"
      @click="$emit('toggle-pin', participant)"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-gray-700 hover:bg-gray-600 p-1 rounded-full text-white transition-all z-10"
      :title="isPinned ? 'Unpin' : 'Pin participant'"
    >
      <span class="material-icons text-sm">
        {{ isPinned ? 'push_pin' : 'push_pin' }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  participant: {
    type: Object,
    required: true
  },
  stream: {
    type: MediaStream,
    default: null
  },
  isLocalStream: {
    type: Boolean,
    default: false
  },
  isScreenShare: {
    type: Boolean,
    default: false
  },
  showControls: {
    type: Boolean,
    default: true
  },
  canControl: {
    type: Boolean,
    default: false
  },
  canPin: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  showConnectionQuality: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'mute-participant',
  'toggle-video',
  'lower-hand',
  'remove-participant',
  'toggle-pin'
])

const videoRef = ref(null)
const isSpeaking = ref(false)
const connectionQuality = ref('good')

// Computed properties
const hasVideo = computed(() => {
  return props.participant.video && props.stream
})

const initials = computed(() => {
  const name = props.participant.name || 'Guest'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const bgColor = computed(() => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500'
  ]
  const index = props.participant.id ? 
    String(props.participant.id).charCodeAt(0) % colors.length : 
    0
  return colors[index]
})

const connectionQualityClass = computed(() => {
  const quality = connectionQuality.value.toLowerCase()
  if (quality === 'excellent') return 'border-green-500'
  if (quality === 'good') return 'border-blue-500'
  if (quality === 'fair') return 'border-yellow-500'
  if (quality === 'poor') return 'border-red-500'
  return 'border-gray-500'
})

const connectionDotClass = computed(() => {
  const quality = connectionQuality.value.toLowerCase()
  if (quality === 'excellent') return 'bg-green-500'
  if (quality === 'good') return 'bg-blue-500'
  if (quality === 'fair') return 'bg-yellow-500'
  if (quality === 'poor') return 'bg-red-500'
  return 'bg-gray-500'
})

// Watch for stream changes
watch(() => props.stream, (newStream) => {
  if (videoRef.value && newStream) {
    videoRef.value.srcObject = newStream
  } else if (videoRef.value) {
    videoRef.value.srcObject = null
  }
}, { immediate: true })

// Audio level detection for speaking indicator
let audioContext = null
let analyser = null
let animationFrameId = null

function setupAudioDetection() {
  if (!props.stream || !props.participant.audio) return

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(props.stream)
    source.connect(analyser)
    analyser.fftSize = 256

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    function detectSpeaking() {
      analyser.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      isSpeaking.value = average > 30 // Threshold for speaking detection

      animationFrameId = requestAnimationFrame(detectSpeaking)
    }

    detectSpeaking()
  } catch (error) {
    console.error('Error setting up audio detection:', error)
  }
}

function cleanupAudioDetection() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (audioContext) {
    audioContext.close()
  }
}

// Lifecycle
onMounted(() => {
  if (props.stream) {
    setupAudioDetection()
  }
})

onUnmounted(() => {
  cleanupAudioDetection()
})

// Watch for audio changes
watch(() => [props.stream, props.participant.audio], () => {
  cleanupAudioDetection()
  if (props.stream && props.participant.audio) {
    setTimeout(() => setupAudioDetection(), 100)
  }
})
</script>

<style scoped>
.mirror {
  transform: scaleX(-1);
}

@keyframes pulse {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}
</style>
