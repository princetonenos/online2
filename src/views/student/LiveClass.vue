<template>
  <div class="h-screen bg-gray-900 flex flex-col">
    <!-- Header -->
    <div class="bg-gray-800 text-white px-4 py-3 border-b border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="material-icons text-green-400">videocam</span>
          <h1 class="text-lg font-semibold">{{ classTitle }}</h1>
          <span class="text-sm text-gray-300">{{ participants.length }} participants</span>
        </div>
        
        <div class="flex items-center space-x-3">
          <span class="text-sm" :class="connectionQualityColor">{{ connectionQuality }}</span>
          <button 
            @click="leaveClass"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-sm font-medium"
          >
            Leave
          </button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="connectionError" class="bg-red-500 text-white px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="material-icons">error</span>
        <span>{{ connectionError }}</span>
      </div>
      <button @click="retryConnection" class="underline">Retry</button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden flex">
      <!-- Video Grid -->
      <div class="flex-1 p-4">
        <div class="h-full grid gap-3" :class="gridClass">
          <!-- Teacher Video -->
          <VideoTile
            v-for="participant in allParticipants"
            :key="participant.id"
            :participant="participant"
            :stream="participant.id === currentUser?.id ? localStream : null"
            :is-local-stream="participant.id === currentUser?.id"
            :can-control="false"
            :show-connection-quality="true"
          />
        </div>
      </div>

      <!-- Chat Sidebar -->
      <div v-if="showChat" class="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div class="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 class="font-semibold text-white">Chat</h3>
          <button @click="showChat = false" class="text-gray-400 hover:text-white">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-for="msg in chatMessages" :key="msg.id" class="text-sm">
            <div class="font-medium text-gray-300">{{ msg.user.name }}</div>
            <div class="text-gray-400">{{ msg.text }}</div>
          </div>
        </div>
        
        <div class="p-4 border-t border-gray-700">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type a message..."
            class="w-full px-3 py-2 bg-gray-700 text-white rounded"
          />
        </div>
      </div>
    </div>

    <!-- Controls Bar -->
    <div class="bg-gray-800 border-t border-gray-700 py-4">
      <div class="flex items-center justify-center space-x-4">
        <!-- Microphone -->
        <button 
          @click="toggleMicrophone"
          class="flex flex-col items-center space-y-1"
          :class="isMicrophoneOn ? 'text-white' : 'text-red-400'"
        >
          <div 
            class="w-12 h-12 rounded-full flex items-center justify-center"
            :class="isMicrophoneOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-600'"
          >
            <span class="material-icons">{{ isMicrophoneOn ? 'mic' : 'mic_off' }}</span>
          </div>
          <span class="text-xs">{{ isMicrophoneOn ? 'Mute' : 'Unmute' }}</span>
        </button>

        <!-- Camera -->
        <button 
          @click="toggleCamera"
          class="flex flex-col items-center space-y-1"
          :class="isCameraOn ? 'text-white' : 'text-red-400'"
        >
          <div 
            class="w-12 h-12 rounded-full flex items-center justify-center"
            :class="isCameraOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-600'"
          >
            <span class="material-icons">{{ isCameraOn ? 'videocam' : 'videocam_off' }}</span>
          </div>
          <span class="text-xs">{{ isCameraOn ? 'Stop Video' : 'Start Video' }}</span>
        </button>

        <!-- Raise Hand -->
        <button 
          @click="toggleHandRaise"
          class="flex flex-col items-center space-y-1"
          :class="isHandRaised ? 'text-yellow-400' : 'text-white'"
        >
          <div 
            class="w-12 h-12 rounded-full flex items-center justify-center"
            :class="isHandRaised ? 'bg-yellow-500 hover:bg-yellow-600 animate-pulse' : 'bg-gray-600 hover:bg-gray-500'"
          >
            <span class="material-icons">front_hand</span>
          </div>
          <span class="text-xs">{{ isHandRaised ? 'Lower Hand' : 'Raise Hand' }}</span>
        </button>

        <!-- Chat -->
        <button 
          @click="showChat = !showChat"
          class="flex flex-col items-center space-y-1 text-white"
        >
          <div class="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center">
            <span class="material-icons">chat</span>
          </div>
          <span class="text-xs">Chat</span>
        </button>

        <!-- Settings -->
        <button 
          @click="showSettings = true"
          class="flex flex-col items-center space-y-1 text-white"
        >
          <div class="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center">
            <span class="material-icons">settings</span>
          </div>
          <span class="text-xs">Settings</span>
        </button>
      </div>
    </div>

    <!-- Settings Modal -->
    <Teleport to="body">
      <div v-if="showSettings" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showSettings = false">
        <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 class="text-xl font-bold text-white mb-4">Device Settings</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-300 mb-2">Camera</label>
              <select 
                v-model="selectedCameraId"
                @change="handleCameraChange"
                class="w-full px-3 py-2 bg-gray-700 text-white rounded"
              >
                <option v-for="cam in cameras" :key="cam.deviceId" :value="cam.deviceId">
                  {{ cam.label || `Camera ${cameras.indexOf(cam) + 1}` }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-gray-300 mb-2">Microphone</label>
              <select 
                v-model="selectedMicrophoneId"
                @change="handleMicrophoneChange"
                class="w-full px-3 py-2 bg-gray-700 text-white rounded"
              >
                <option v-for="mic in microphones" :key="mic.deviceId" :value="mic.deviceId">
                  {{ mic.label || `Microphone ${microphones.indexOf(mic) + 1}` }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="showSettings = false" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
              Done
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWebRTC } from '../../composables/useWebRTC'
import VideoTile from '../../components/live/VideoTile.vue'

const route = useRoute()
const router = useRouter()

// WebRTC Setup
const {
  localStream,
  isCameraOn,
  isMicrophoneOn,
  isScreenSharing,
  connectionError,
  connectionQuality,
  cameras,
  microphones,
  selectedCamera,
  selectedMicrophone,
  startLocalStream,
  toggleCamera,
  toggleMicrophone,
  getMediaDevices,
  switchCamera,
  switchMicrophone
} = useWebRTC()

// State
const classId = computed(() => route.params.id)
const classTitle = ref('Live Class Session')
const currentUser = ref(JSON.parse(localStorage.getItem('mock:currentUser') || '{}'))
const isHandRaised = ref(false)
const showChat = ref(false)
const showSettings = ref(false)
const newMessage = ref('')
const chatMessages = ref([])
const selectedCameraId = ref('')
const selectedMicrophoneId = ref('')

// Mock participants (teacher + other students)
const participants = ref([
  { id: 'teacher1', name: 'Mr. Johnson', role: 'teacher', audio: true, video: true, handRaised: false },
  { id: 'student2', name: 'Sarah Miller', role: 'student', audio: true, video: false, handRaised: false },
  { id: 'student3', name: 'Tom Wilson', role: 'student', audio: false, video: true, handRaised: false }
])

const allParticipants = computed(() => {
  const current = {
    id: currentUser.value.id || 'current',
    name: currentUser.value.name || 'You',
    role: 'student',
    audio: isMicrophoneOn.value,
    video: isCameraOn.value,
    handRaised: isHandRaised.value
  }
  return [current, ...participants.value]
})

const gridClass = computed(() => {
  const count = allParticipants.value.length
  if (count <= 2) return 'grid-cols-1'
  if (count <= 4) return 'grid-cols-2'
  if (count <= 6) return 'grid-cols-3'
  return 'grid-cols-3 lg:grid-cols-4'
})

const connectionQualityColor = computed(() => {
  const q = connectionQuality.value.toLowerCase()
  if (q === 'excellent') return 'text-green-400'
  if (q === 'good') return 'text-blue-400'
  if (q === 'fair') return 'text-yellow-400'
  return 'text-red-400'
})

// Methods
function toggleHandRaise() {
  isHandRaised.value = !isHandRaised.value
  showToast(isHandRaised.value ? 'Hand raised' : 'Hand lowered')
}

function sendMessage() {
  if (!newMessage.value.trim()) return
  
  chatMessages.value.push({
    id: Date.now(),
    user: { name: currentUser.value.name || 'You' },
    text: newMessage.value.trim()
  })
  newMessage.value = ''
}

async function retryConnection() {
  try {
    await startLocalStream()
  } catch (error) {
    console.error('Retry failed:', error)
  }
}

async function handleCameraChange() {
  if (selectedCameraId.value) {
    await switchCamera(selectedCameraId.value)
  }
}

async function handleMicrophoneChange() {
  if (selectedMicrophoneId.value) {
    await switchMicrophone(selectedMicrophoneId.value)
  }
}

function leaveClass() {
  if (confirm('Are you sure you want to leave the class?')) {
    router.push({ name: 'StudentDashboard' })
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await getMediaDevices()
    selectedCameraId.value = selectedCamera.value
    selectedMicrophoneId.value = selectedMicrophone.value
    await startLocalStream()
    showToast('Connected to live class')
  } catch (error) {
    console.error('Failed to initialize:', error)
  }
})

function showToast(message) {
  if (window.showToast) {
    window.showToast(message)
  } else {
    console.log('Toast:', message)
  }
}
</script>
