<template>
  <div class="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
    <div class="h-full bg-black">
      <VideoTile :participant="participant" :stream="stream" :isLocalStream="isLocal" :showControls="false" class="w-full h-full" />
    </div>

    <!-- Top badges / device pickers -->
    <div class="absolute top-3 left-3">
      <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-xs">
        <span class="material-symbols-rounded text-[14px]">person</span>
        {{ participant?.name || 'Speaker' }}
      </span>
    </div>
    <div class="absolute top-3 right-3 flex items-center gap-2">
      <DevicePicker type="camera" :devices="cameras" :selected-id="selectedCameraId" @select="$emit('select-camera', $event)" />
      <DevicePicker type="microphone" :devices="microphones" :selected-id="selectedMicrophoneId" @select="$emit('select-microphone', $event)" />
    </div>


    <!-- Floating call controls -->
    <div class="absolute inset-x-0 -bottom-4 flex justify-center">
      <div class="bg-white/90 backdrop-blur border border-gray-200 shadow-xl rounded-full px-2 py-1.5 flex items-center gap-2">
        <button @click="$emit('toggle-mute')" :title="isMuted ? 'Unmute (M)' : 'Mute (M)'" :aria-pressed="isMuted" class="ctrl"
                :class="isMuted ? 'bg-gradient-to-br from-rose-100 to-red-100 text-red-700 ring-2 ring-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
          <span class="material-symbols-rounded transition-transform duration-150" :class="isMuted ? 'scale-110' : ''">{{ isMuted ? 'mic_off' : 'mic' }}</span>
        </button>
        <button @click="$emit('toggle-video')" :title="isVideoOff ? 'Start video (V)' : 'Stop video (V)'" :aria-pressed="isVideoOff" class="ctrl"
                :class="isVideoOff ? 'bg-gradient-to-br from-rose-100 to-red-100 text-red-700 ring-2 ring-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
          <span class="material-symbols-rounded transition-transform duration-150" :class="isVideoOff ? 'scale-110' : ''">{{ isVideoOff ? 'videocam_off' : 'videocam' }}</span>
        </button>
        <button @click="$emit('toggle-share')" :title="isScreenSharing ? 'Stop share (S)' : 'Share screen (S)'" :aria-pressed="isScreenSharing" class="ctrl"
                :class="isScreenSharing ? 'bg-gradient-to-br from-emerald-100 to-green-100 text-green-700 ring-2 ring-emerald-200 animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
          <span class="material-symbols-rounded">screen_share</span>
        </button>
        <button @click="$emit('leave')" title="Leave" class="ctrl !bg-red-600 !text-white hover:!bg-red-700 active:scale-95">
          <span class="material-symbols-rounded">call_end</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import VideoTile from './VideoTile.vue'
import DevicePicker from './DevicePicker.vue'
const props = defineProps({
  participant: Object,
  stream: Object,
  isLocal: Boolean,
  isMuted: Boolean,
  isVideoOff: Boolean,
  isScreenSharing: Boolean,
  cameras: { type: Array, default: () => [] },
  microphones: { type: Array, default: () => [] },
  selectedCameraId: { type: String, default: null },
  selectedMicrophoneId: { type: String, default: null }
})
</script>
<style scoped>
.ctrl{ @apply w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 shadow-sm hover:shadow-md active:scale-95; }
</style>
