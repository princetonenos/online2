<template>
  <div class="h-screen bg-gray-900 flex flex-col">
    <!-- Enhanced Live class header -->
    <div class="bg-gray-800 text-white p-4 border-b border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button 
            @click="leaveClass"
            class="p-2 rounded-full hover:bg-gray-700 transition-colors bg-gray-700"
            aria-label="Leave class"
          >
            <span class="material-icons text-lg">arrow_back</span>
          </button>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span class="material-icons text-white">video_call</span>
            </div>
            <div>
              <h1 class="text-xl font-semibold">{{ course?.name }}</h1>
              <p class="text-gray-300 text-sm flex items-center space-x-2">
                <span class="flex items-center space-x-1">
                  <span class="material-icons text-xs">schedule</span>
                  <span>{{ formattedTime }}</span>
                </span>
                <span>•</span>
                <span class="flex items-center space-x-1">
                  <span class="material-icons text-xs">people</span>
                  <span>{{ participants.length }} participants</span>
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Enhanced Class controls -->
          <div class="flex items-center space-x-3 bg-gray-700 px-4 py-2 rounded-classroom">
            <button 
              @click="toggleMute"
              class="p-3 rounded-full transition-all duration-200"
              :class="isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'"
              aria-label="Toggle microphone"
            >
              <span class="material-icons text-white text-lg">
                {{ isMuted ? 'mic_off' : 'mic' }}
              </span>
            </button>
            <button 
              @click="toggleVideo"
              class="p-3 rounded-full transition-all duration-200"
              :class="isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'"
              aria-label="Toggle video"
            >
              <span class="material-icons text-white text-lg">
                {{ isVideoOff ? 'videocam_off' : 'videocam' }}
              </span>
            </button>
            <button 
              @click="toggleScreenShare"
              class="p-3 rounded-full transition-all duration-200"
              :class="isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'"
              aria-label="Toggle screen share"
            >
              <span class="material-icons text-white text-lg">screen_share</span>
            </button>
            <button 
              @click="toggleHandRaise"
              class="p-3 rounded-full transition-all duration-200"
              :class="isHandRaised ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-600 hover:bg-gray-500'"
              aria-label="Raise hand"
            >
              <span class="material-icons text-white text-lg">front_hand</span>
            </button>
            <button 
              @click="openWhiteboard"
              class="p-3 rounded-full bg-gray-600 hover:bg-gray-500 transition-all duration-200"
              aria-label="Open whiteboard"
            >
              <span class="material-icons text-white text-lg">draw</span>
            </button>
          </div>
          
          <button 
            @click="endClass"
            class="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-classroom transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg"
          >
            <span class="material-icons text-lg">call_end</span>
            <span>End Class</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="flex-1 flex">
      <!-- Video grid -->
      <div class="flex-1 p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          <!-- Teacher/main video -->
          <div class="bg-classroom-gray-800 rounded-classroom overflow-hidden relative">
            <div class="aspect-video bg-classroom-gray-700 flex items-center justify-center">
              <span class="material-icons text-classroom-gray-500 text-6xl">person</span>
            </div>
            <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm text-white">
              {{ currentUser?.name }} (You)
            </div>
            <div v-if="isScreenSharing" class="absolute top-2 right-2 bg-classroom-primary px-2 py-1 rounded text-xs text-white">
              Screen Sharing
            </div>
          </div>

          <!-- Student videos -->
          <div 
            v-for="participant in participants"
            :key="participant.id"
            class="bg-classroom-gray-800 rounded-classroom overflow-hidden relative"
          >
            <div class="aspect-video bg-classroom-gray-700 flex items-center justify-center">
              <span class="material-icons text-classroom-gray-500 text-4xl">person</span>
            </div>
            <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm text-white">
              {{ participant.name }}
            </div>
            <div v-if="!participant.audio" class="absolute top-2 right-2 bg-red-500 p-1 rounded-full">
              <span class="material-icons text-white text-sm">mic_off</span>
            </div>
          </div>

          <!-- Join prompt -->
          <div 
            v-if="participants.length === 1"
            class="bg-classroom-gray-800 rounded-classroom flex items-center justify-center"
          >
            <div class="text-center text-classroom-gray-400">
              <span class="material-icons text-6xl mb-2">people</span>
              <p>Waiting for students to join...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="w-80 bg-classroom-gray-800 border-l border-classroom-gray-700 flex flex-col">
        <!-- Chat panel -->
        <div class="flex-1 flex flex-col">
          <div class="p-4 border-b border-classroom-gray-700">
            <h3 class="font-medium text-white">Chat</h3>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div 
              v-for="message in chatMessages"
              :key="message.id"
              class="text-sm"
            >
              <div class="flex items-start space-x-2">
                <img :src="message.user.avatar" :alt="message.user.name" class="w-6 h-6 rounded-full">
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-white">{{ message.user.name }}</span>
                    <span class="text-classroom-gray-400 text-xs">{{ message.time }}</span>
                  </div>
                  <p class="text-classroom-gray-300 mt-1">{{ message.text }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat input -->
          <div class="p-4 border-t border-classroom-gray-700">
            <div class="flex space-x-2">
              <input
                v-model="newMessage"
                @keydown.enter="sendMessage"
                type="text"
                placeholder="Send a message..."
                class="flex-1 bg-classroom-gray-700 border border-classroom-gray-600 rounded-classroom px-3 py-2 text-white placeholder-classroom-gray-400 focus:outline-none focus:border-classroom-primary transition-colors"
              >
              <button 
                @click="sendMessage"
                class="bg-classroom-primary hover:bg-classroom-primary-dark px-4 py-2 rounded-classroom transition-colors"
                :disabled="!newMessage.trim()"
              >
                <span class="material-icons text-sm">send</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Participants list -->
        <div class="border-t border-classroom-gray-700">
          <div class="p-4">
            <h3 class="font-medium text-white mb-3">Participants ({{ participants.length }})</h3>
            <div class="space-y-2">
              <div 
                v-for="participant in participants"
                :key="participant.id"
                class="flex items-center space-x-3 p-2 rounded-classroom hover:bg-classroom-gray-700 transition-colors"
              >
                <img :src="participant.avatar" :alt="participant.name" class="w-8 h-8 rounded-full">
                <div class="flex-1">
                  <p class="text-sm text-white">{{ participant.name }}</p>
                  <p class="text-xs text-classroom-gray-400">{{ participant.role }}</p>
                </div>
                <div class="flex items-center space-x-1">
                  <span 
                    class="material-icons text-sm"
                    :class="participant.audio ? 'text-classroom-primary' : 'text-red-500'"
                  >
                    {{ participant.audio ? 'mic' : 'mic_off' }}
                  </span>
                  <span 
                    class="material-icons text-sm"
                    :class="participant.video ? 'text-classroom-primary' : 'text-red-500'"
                  >
                    {{ participant.video ? 'videocam' : 'videocam_off' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()

const isMuted = ref(false)
const isVideoOff = ref(false)
const isScreenSharing = ref(false)
const isHandRaised = ref(false)
const newMessage = ref('')
const elapsedTime = ref(0)
let timer = null

const courseId = computed(() => route.params.id)
const currentUser = computed(() => usersStore.currentUser)

const course = computed(() => coursesStore.getCourseById(courseId.value))

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = elapsedTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Mock participants data
const participants = ref([
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: '/avatars/student1.jpg',
    role: 'student',
    audio: true,
    video: false
  },
  {
    id: 2,
    name: 'Sarah Miller',
    avatar: '/avatars/student2.jpg',
    role: 'student',
    audio: false,
    video: true
  },
  {
    id: 3,
    name: 'Tom Wilson',
    avatar: '/avatars/student3.jpg',
    role: 'student',
    audio: true,
    video: true
  }
])

// Mock chat messages
const chatMessages = ref([
  {
    id: 1,
    user: { name: 'Alex Johnson', avatar: '/avatars/student1.jpg' },
    text: 'Hello everyone!',
    time: '10:01 AM'
  },
  {
    id: 2,
    user: { name: currentUser.value?.name, avatar: currentUser.value?.avatar },
    text: 'Welcome to today\'s class! Let\'s get started.',
    time: '10:02 AM'
  },
  {
    id: 3,
    user: { name: 'Sarah Miller', avatar: '/avatars/student2.jpg' },
    text: 'I have a question about the homework.',
    time: '10:03 AM'
  }
])

const toggleMute = () => {
  isMuted.value = !isMuted.value
  showToast(isMuted.value ? 'Microphone muted' : 'Microphone unmuted')
}

const toggleVideo = () => {
  isVideoOff.value = !isVideoOff.value
  showToast(isVideoOff.value ? 'Video turned off' : 'Video turned on')
}

const toggleScreenShare = () => {
  isScreenSharing.value = !isScreenSharing.value
  showToast(isScreenSharing.value ? 'Screen sharing started' : 'Screen sharing stopped')
}

const toggleHandRaise = () => {
  isHandRaised.value = !isHandRaised.value
  showToast(isHandRaised.value ? 'Hand raised' : 'Hand lowered')
}

const openWhiteboard = () => {
  showToast('Whiteboard would open in a new window')
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const message = {
    id: Date.now(),
    user: {
      name: currentUser.value?.name,
      avatar: currentUser.value?.avatar
    },
    text: newMessage.value.trim(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  chatMessages.value.push(message)
  newMessage.value = ''
}

const leaveClass = () => {
  if (confirm('Are you sure you want to leave the class?')) {
    stopTimer()
    router.back()
    showToast('You left the class')
  }
}

const endClass = () => {
  if (confirm('Are you sure you want to end the class for everyone?')) {
    stopTimer()
    router.back()
    showToast('Class ended')
  }
}

const startTimer = () => {
  timer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startTimer()
  // Add current user to participants if not already there
  if (currentUser.value && !participants.value.find(p => p.id === currentUser.value.id)) {
    participants.value.unshift({
      id: currentUser.value.id,
      name: currentUser.value.name,
      avatar: currentUser.value.avatar,
      role: 'teacher',
      audio: !isMuted.value,
      video: !isVideoOff.value
    })
  }
})

onUnmounted(() => {
  stopTimer()
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
