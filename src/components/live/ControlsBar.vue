<template>
  <nav class="w-full bg-gray-800/90 backdrop-blur border-t border-gray-700 py-2 sm:py-3" aria-label="Meeting controls">
    <div class="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 px-2">
      <!-- Mic -->
      <button
        type="button"
        class="rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        :class="isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-500'"
        @click="$emit('toggle-mute')"
        :aria-pressed="isMuted"
        aria-label="Toggle microphone (M)"
      >
        <span class="material-icons" aria-hidden>{{ isMuted ? 'mic_off' : 'mic' }}</span>
      </button>

      <!-- Camera -->
      <button
        type="button"
        class="rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        :class="isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-500'"
        @click="$emit('toggle-video')"
        :aria-pressed="isVideoOff"
        aria-label="Toggle camera (V)"
      >
        <span class="material-icons" aria-hidden>{{ isVideoOff ? 'videocam_off' : 'videocam' }}</span>
      </button>

      <!-- Share Screen -->
      <button
        type="button"
        class="rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        :class="isScreenShared ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500'"
        @click="$emit(isScreenShared ? 'stop-share' : 'start-share')"
        :aria-pressed="isScreenShared"
        aria-label="Toggle screen share (S)"
      >
        <span class="material-icons" aria-hidden>screen_share</span>
      </button>

      <!-- Participants -->
      <button
        type="button"
        class="rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-600 hover:bg-gray-500 transition-colors"
        @click="$emit('toggle-participants')"
        aria-label="Toggle participants"
      >
        <span class="material-icons" aria-hidden>group</span>
      </button>

      <!-- Chat -->
      <button
        type="button"
        class="rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-600 hover:bg-gray-500 transition-colors"
        @click="$emit('open-chat')"
        aria-label="Toggle chat (C)"
      >
        <span class="material-icons" aria-hidden>chat</span>
      </button>

      <!-- Record -->
      <button
        type="button"
        class="rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        :class="isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-gray-600 hover:bg-gray-500'"
        @click="$emit('toggle-record')"
        :aria-pressed="isRecording"
        aria-label="Toggle recording"
      >
        <span class="material-icons" aria-hidden>{{ isRecording ? 'fiber_manual_record' : 'radio_button_unchecked' }}</span>
      </button>

      <!-- Leave -->
      <button
        type="button"
        class="rounded-full w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-600 hover:bg-red-700 transition-colors"
        @click="$emit('leave')"
        aria-label="Leave meeting"
      >
        <span class="material-icons" aria-hidden>call_end</span>
      </button>
    </div>
  </nav>
</template>
<script setup>
const props = defineProps({
  isMuted: Boolean,
  isVideoOff: Boolean,
  isScreenShared: Boolean,
  isRecording: Boolean
})
</script>
