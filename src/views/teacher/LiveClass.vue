<template>
  <div class="h-screen bg-[#F6F7FB] overflow-hidden flex flex-col">
    <div class="max-w-7xl mx-auto w-full px-3 sm:px-6 pt-4 pb-2">
      <LiveHeader
        :meeting-title="course?.title || 'Live Class'"
        :subtitle="currentUser?.name ? 'Host: ' + currentUser.name : ''"
        :time-text="formattedTime"
        :live="isRecording"
      />
    </div>

    <!-- Content fills remaining viewport height -->
    <div class="flex-1 min-h-0">
      <div class="max-w-7xl mx-auto h-full px-3 sm:px-6">
        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 lg:gap-6 h-full min-h-0">
          <!-- Left: stage + thumbnails + quick actions -->
          <div class="flex flex-col gap-4 min-h-0">
            <!-- Stage card takes ~55vh, no page scroll -->
            <div class="h-[55vh] min-h-[320px]">
              <MainVideoCard
                :participant="stageParticipant"
                :stream="localStream"
                :isLocal="true"
                :isMuted="isMuted"
                :isVideoOff="isVideoOff"
                :isScreenSharing="isScreenSharing"
                :cameras="cameras"
                :microphones="microphones"
                :selectedCameraId="selectedCamera"
                :selectedMicrophoneId="selectedMicrophone"
                @select-camera="onSelectCamera"
                @select-microphone="onSelectMicrophone"
                @toggle-mute="toggleMute"
                @toggle-video="toggleVideo"
                @toggle-share="toggleScreenShare"
                @leave="leaveClass"
              />
            </div>

            <!-- Thumbnails area ~22vh -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-[22vh] min-h-[160px] overflow-hidden">
              <div class="h-full overflow-auto">
                <ThumbnailsRow :participants="thumbnailParticipants" />
              </div>
            </div>

            <!-- Quick actions - small fixed height -->
            <div class="shrink-0">
              <QuickActionsBar
                @participants="onParticipantsAction"
                @record="toggleRecording"
                @share="toggleScreenShare"
                @image="onShareImage"
                @link="onShareLink"
                @more="onMoreActions"
              />
            </div>
          </div>

          <!-- Right: participants + chat -->
          <div ref="rightColRef" class="min-h-0">
            <RightColumn :participants="uiParticipants" :messages="chatMessages" @send-message="onSendMessage" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile overlay for right column -->
    <div v-if="showRightOverlay" class="fixed inset-0 z-30 bg-black/40 lg:hidden" @click.self="showRightOverlay=false">
      <div class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-3 overflow-y-auto">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">Details</h3>
          <button class="text-gray-500" @click="showRightOverlay=false">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>
        <RightColumn :participants="uiParticipants" :messages="chatMessages" @send-message="onSendMessage" />
      </div>
    </div>

    <!-- Permission banner -->
    <div v-if="permissionError" class="fixed inset-x-4 bottom-20 z-20">
      <div class="max-w-3xl mx-auto bg-white border border-yellow-200 shadow-lg rounded-xl p-3 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          We need access to your microphone and camera. Please allow permissions in your browser and try again.
        </div>
        <button @click="retryPermissions" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">Try again</button>
      </div>
    </div>

    <!-- Connection error banner -->
    <div v-if="connectionError" class="fixed inset-x-4 bottom-4 z-20">
      <div class="max-w-3xl mx-auto bg-white border border-red-200 shadow-lg rounded-xl p-3 flex items-center justify-between">
        <div class="text-sm text-red-700 flex items-center gap-2">
          <span class="material-symbols-rounded text-red-500 text-[18px]">error</span>
          {{ connectionError }}
        </div>
        <button @click="retryPermissions" class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">Retry</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'
import { useAuth } from '../../store/auth'
import axios from 'axios'
import { useWebRTC } from '../../composables/useWebRTC'
import { useMediaRecorder } from '../../composables/useMediaRecorder'
import { useSocket } from '../../composables/useSocket'
import LiveHeader from '../../components/live/LiveHeader.vue'
import MainVideoCard from '../../components/live/MainVideoCard.vue'
import ThumbnailsRow from '../../components/live/ThumbnailsRow.vue'
import QuickActionsBar from '../../components/live/QuickActionsBar.vue'
import RightColumn from '../../components/live/RightColumn.vue'

const route = useRoute(); const router = useRouter();
const usersStore = useUsersStore(); const coursesStore = useCoursesStore(); const auth = useAuth();

const { localStream, screenStream, isCameraOn, isMicrophoneOn, isScreenSharing: webrtcScreenSharing, connectionError, startLocalStream, toggleCamera: webrtcToggleCamera, toggleMicrophone: webrtcToggleMicrophone, startScreenShare, stopScreenShare, cleanup: webrtcCleanup, getMediaDevices, cameras, microphones, selectedCamera, selectedMicrophone, switchCamera, switchMicrophone } = useWebRTC()

const { isRecording, start: startRecording, stop: stopRecording, download: downloadRecording, upload: uploadRecording } = useMediaRecorder()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
let participantsPoll = null
const socket = useSocket(API_URL)

// UI state
const isMuted = ref(false)
const isVideoOff = ref(false)
const isScreenSharing = ref(false)
// Recording state is provided by useMediaRecorder()
const elapsedTime = ref(0)
const timerRef = ref(null)
const permissionError = ref(false)
const showRightOverlay = ref(false)
const rightColRef = ref(null)

// Data
const courseId = computed(() => route.params.id)
const currentUser = computed(() => usersStore.currentUser)
const course = computed(() => coursesStore.getCourseById(courseId.value))

const formattedTime = computed(() => {
  const h = Math.floor(elapsedTime.value/3600).toString().padStart(2,'0')
  const m = Math.floor((elapsedTime.value%3600)/60).toString().padStart(2,'0')
  const s = (elapsedTime.value%60).toString().padStart(2,'0')
  return `${h}:${m}:${s}`
})

// Backend participants
const participants = ref([])
const sessionId = computed(() => route.query.session)
const roomId = computed(() => sessionId.value || courseId.value)
const chatMessages = ref([])

function mapServerParticipant(p){
  return {
    id: p.userId,
    name: p.userName,
    role: p.role,
    audio: !!p.audio,
    video: !!p.video,
    handRaised: !!p.handRaised,
    avatarUrl: p.avatar || '/avatars/user-default.jpg',
    isLocal: String(p.userId)===String(currentUser.value?.id)
  }
}

const uiParticipants = computed(()=> participants.value.map(mapServerParticipant))
const stageParticipant = computed(()=> uiParticipants.value[0] || { name: currentUser.value?.name || 'You' })
const thumbnailParticipants = computed(()=> uiParticipants.value.slice(1, 5))

async function joinRoomAPI(){ try { const res = await axios.post(`${API_URL}/webrtc/rooms/${roomId.value}/join`, { userId: currentUser.value?.id, userName: currentUser.value?.name, role: 'teacher' }); participants.value = res.data?.room?.participants || [] } catch(e){ console.error(e) } }
async function leaveRoomAPI(){ try { await axios.post(`${API_URL}/webrtc/rooms/${roomId.value}/leave`, { userId: currentUser.value?.id }) } catch{} }
async function fetchParticipantsAPI(){ try { const res = await axios.get(`${API_URL}/webrtc/rooms/${roomId.value}/participants`); participants.value = res.data?.participants || [] } catch{} }
async function updateParticipantAPI(payload){ try { await axios.patch(`${API_URL}/webrtc/rooms/${roomId.value}/participants`, { userId: currentUser.value?.id, ...payload }) } catch(e){ console.error(e) } }

function startTimer(){ timerRef.value = setInterval(()=> elapsedTime.value++, 1000) }
function stopTimer(){ if(timerRef.value){ clearInterval(timerRef.value); timerRef.value=null } }

async function toggleMute(){ await webrtcToggleMicrophone(); isMuted.value = !isMicrophoneOn.value; updateParticipantAPI({ audio: !isMuted.value }) }
async function toggleVideo(){ await webrtcToggleCamera(); isVideoOff.value = !isCameraOn.value; updateParticipantAPI({ video: !isVideoOff.value }) }
async function toggleScreenShare(){ try { if(!isScreenSharing.value) await startScreenShare(); else stopScreenShare() } catch{} isScreenSharing.value = webrtcScreenSharing.value }

// Quick actions behaviors
function onParticipantsAction(){
  if (window.innerWidth < 1024) {
    showRightOverlay.value = true
  } else {
    rightColRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }
}

async function toggleRecording(){
  try {
    if (!isRecording.value) {
      // Build a stream to record: prefer screen video + mic audio if sharing
      let streamToRecord = null
      if (webrtcScreenSharing.value && screenStream.value) {
        const tracks = []
        const v = screenStream.value.getVideoTracks()[0]
        if (v) tracks.push(v)
        const a = localStream.value?.getAudioTracks?.()[0]
        if (a) tracks.push(a)
        streamToRecord = new MediaStream(tracks)
      } else {
        streamToRecord = localStream.value
      }
      if (!streamToRecord) throw new Error('No active stream to record')
      await startRecording(streamToRecord)
      if (window.showToast) window.showToast('Recording started')
    } else {
      const blob = await stopRecording()
      // Auto-download a local copy
      downloadRecording(blob)
      // Upload to backend for persistence
      const API_BASE = API_URL
      const token = auth.token || localStorage.getItem('auth:token')
      try {
        await uploadRecording(blob, API_BASE, token)
        if (window.showToast) window.showToast('Recording saved to server')
      } catch (e) {
        console.error(e)
        if (window.showToast) window.showToast('Saved locally. Upload failed')
      }
    }
  } catch (e) {
    console.error('Recording error', e)
    if (window.showToast) window.showToast('Recording error')
  }
}

function onShareImage(){
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    try {
      const form = new FormData()
      form.append('file', file)
      const token = auth.token || localStorage.getItem('auth:token')
      const res = await axios.post(`${API_URL}/files/upload`, form, { headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'multipart/form-data' } })
      const uploaded = res.data?.data || {}
      const url = uploaded.url || ''
      chatMessages.value.push({ id: Date.now(), user: { name: currentUser.value?.name }, text: `[Image] ${file.name}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), url })
      if (window.showToast) window.showToast('Image uploaded')
    } catch (e) {
      console.error(e)
      const url = URL.createObjectURL(file)
      chatMessages.value.push({ id: Date.now(), user: { name: currentUser.value?.name }, text: `[Image] ${file.name}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), url })
      if (window.showToast) window.showToast('Shared locally (upload failed)')
    }
  }
  input.click()
}

function onShareLink(){
  const url = prompt('Paste a link to share:')
  if (!url) return
  chatMessages.value.push({ id: Date.now(), user: { name: currentUser.value?.name }, text: url, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
}

function onMoreActions(){ if (window.showToast) window.showToast('More actions coming soon') }

function onSendMessage(text){
  const msg = { id: Date.now(), user: { name: currentUser.value?.name }, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  chatMessages.value.push(msg)
  try { socket.emit('chat:message', { classId: roomId.value, text, user: { name: currentUser.value?.name } }) } catch {}
}

async function retryPermissions(){ permissionError.value=false; try { await startLocalStream({ video:true, audio:true }); isMuted.value = !isMicrophoneOn.value; isVideoOff.value = !isCameraOn.value } catch{ permissionError.value = true } }

async function leaveClass(){ stopTimer(); await leaveRoomAPI(); webrtcCleanup(); router.back() }

// Device selectors
async function onSelectCamera(id){ try { await switchCamera(id) } catch{} }
async function onSelectMicrophone(id){ try { await switchMicrophone(id) } catch{} }

// Keyboard shortcuts
function onKey(e){ const tag = (e.target?.tagName||'').toUpperCase(); if(tag==='INPUT'||tag==='TEXTAREA') return; const k=e.key.toLowerCase(); if(k==='m'){e.preventDefault(); toggleMute()} if(k==='v'){e.preventDefault(); toggleVideo()} if(k==='s'){e.preventDefault(); toggleScreenShare()} if(k==='c'){e.preventDefault(); onParticipantsAction()} if(k==='escape'){ if(showRightOverlay.value){ showRightOverlay.value=false; e.preventDefault() } } }

onMounted(async ()=>{
  startTimer()
  try {
    await getMediaDevices()
    await startLocalStream({ video:true, audio:true })
    isMuted.value = !isMicrophoneOn.value
    isVideoOff.value = !isCameraOn.value
  } catch{ permissionError.value = true }

  await joinRoomAPI()

  // Setup realtime updates via Socket.IO
  const token = auth.token || localStorage.getItem('auth:token')
  socket.connect(token)
  socket.joinClass(roomId.value)
  socket.on('webrtc:participants', (payload) => {
    if (!payload || String(payload.roomId) !== String(roomId.value)) return
    participants.value = payload.participants || []
  })
  socket.on('chat:message', (payload) => {
    if (!payload) return
    chatMessages.value.push(payload)
  })

  // Fallback polling if socket not connected
  setTimeout(() => {
    if (!socket.connected.value) {
      participantsPoll = setInterval(fetchParticipantsAPI, 7000)
    }
  }, 1000)

  window.addEventListener('keydown', onKey)
})

onUnmounted(async ()=>{
  stopTimer()
  if(participantsPoll) clearInterval(participantsPoll)
  try { socket.leaveClass(roomId.value) } catch {}
  socket.disconnect()
  await leaveRoomAPI().catch(()=>{})
  webrtcCleanup()
  window.removeEventListener('keydown', onKey)
})
</script>
