<template>
  <div class="bg-white rounded-classroom classroom-shadow p-4">
    <!-- Composer header -->
    <div class="flex items-start space-x-3 mb-4">
      <img 
        :src="currentUser?.avatar" 
        :alt="currentUser?.name"
        class="w-10 h-10 rounded-full"
      >
      <div class="flex-1">
        <button 
          @click="toggleComposer"
          class="w-full text-left p-3 border border-classroom-gray-300 rounded-classroom hover:border-classroom-gray-400 transition-colors text-classroom-gray-500 focus-classroom"
        >
          Share something with your class...
        </button>
      </div>
    </div>

    <!-- Expanded composer -->
    <div v-if="showComposer" class="space-y-4">
      <!-- Post type selector -->
      <div class="flex items-center space-x-2 border-b border-classroom-gray-100 pb-3">
        <button
          v-for="type in postTypes"
          :key="type.value"
          @click="selectedType = type.value"
          class="px-3 py-2 rounded-classroom text-sm font-medium transition-colors"
          :class="{
            'bg-classroom-primary bg-opacity-10 text-classroom-primary': selectedType === type.value,
            'text-classroom-gray-600 hover:bg-classroom-gray-100': selectedType !== type.value
          }"
        >
          <span class="material-icons text-base mr-1">{{ type.icon }}</span>
          {{ type.label }}
        </button>
      </div>

      <!-- Title input (for announcements and questions) -->
      <div v-if="selectedType !== 'material'" class="space-y-2">
        <label class="text-sm font-medium text-classroom-gray-700">Title</label>
        <input
          v-model="postTitle"
          type="text"
          placeholder="Add a title..."
          class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
        >
      </div>

      <!-- Content textarea -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-classroom-gray-700">Content</label>
        <textarea
          v-model="postContent"
          rows="4"
          placeholder="What do you want to share with your class?"
          class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors resize-none"
        ></textarea>
      </div>

      <!-- Attachments -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-classroom-gray-700">Attachments</label>
        <div class="border-2 border-dashed border-classroom-gray-300 rounded-classroom p-4 text-center">
          <input
            type="file"
            ref="fileInput"
            multiple
            @change="handleFileUpload"
            class="hidden"
          >
          <button
            @click="$refs.fileInput.click()"
            class="btn-outline mb-2"
          >
            <span class="material-icons text-lg mr-2">attach_file</span>
            Add attachment
          </button>
          <p class="text-xs text-classroom-gray-500">You can attach files from your computer</p>
        </div>

        <!-- Attachment previews -->
        <div v-if="attachments.length > 0" class="space-y-2">
          <div
            v-for="(attachment, index) in attachments"
            :key="index"
            class="flex items-center justify-between p-2 bg-classroom-gray-50 rounded-classroom"
          >
            <div class="flex items-center space-x-3">
              <span class="material-icons text-classroom-gray-500">description</span>
              <div>
                <p class="text-sm font-medium text-classroom-gray-900">{{ attachment.name }}</p>
                <p class="text-xs text-classroom-gray-500">{{ attachment.size }}</p>
              </div>
            </div>
            <button
              @click="removeAttachment(index)"
              class="p-1 rounded-full hover:bg-classroom-gray-200 transition-colors"
            >
              <span class="material-icons text-classroom-gray-500 text-lg">close</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Audience selector -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-classroom-gray-700">Audience</label>
        <select
          v-model="selectedAudience"
          class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
        >
          <option value="all">All students</option>
          <option value="teachers">Teachers only</option>
          <option value="specific">Specific students</option>
        </select>
      </div>

      <!-- Topics -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-classroom-gray-700">Topics</label>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="topic in selectedTopics"
            :key="topic"
            class="chip chip-primary flex items-center space-x-1"
          >
            <span>{{ topic }}</span>
            <button @click="removeTopic(topic)" class="hover:opacity-70">
              <span class="material-icons text-xs">close</span>
            </button>
          </span>
          <input
            v-model="newTopic"
            @keydown.enter="addTopic"
            placeholder="Add a topic..."
            class="flex-1 min-w-0 px-2 py-1 text-sm border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors"
          >
        </div>
      </div>

      <!-- Schedule post -->
      <div class="flex items-center justify-between">
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            v-model="schedulePost"
            type="checkbox"
            class="rounded border-classroom-gray-300 text-classroom-primary focus:ring-classroom-primary"
          >
          <span class="text-sm text-classroom-gray-700">Schedule post</span>
        </label>

        <div v-if="schedulePost" class="flex items-center space-x-2">
          <input
            v-model="scheduledDate"
            type="date"
            class="px-2 py-1 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors text-sm"
          >
          <input
            v-model="scheduledTime"
            type="time"
            class="px-2 py-1 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors text-sm"
          >
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center justify-end space-x-3 pt-4 border-t border-classroom-gray-100">
        <button
          @click="cancelComposer"
          class="btn-outline"
        >
          Cancel
        </button>
        <button
          @click="createPost"
          :disabled="!canCreatePost"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUsersStore } from '../store/users'
import { usePostsStore } from '../store/posts'

const props = defineProps({
  courseId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['post-created'])

const usersStore = useUsersStore()
const postsStore = usePostsStore()

const showComposer = ref(false)
const selectedType = ref('announcement')
const postTitle = ref('')
const postContent = ref('')
const attachments = ref([])
const selectedAudience = ref('all')
const selectedTopics = ref([])
const newTopic = ref('')
const schedulePost = ref(false)
const scheduledDate = ref('')
const scheduledTime = ref('')

const currentUser = computed(() => usersStore.currentUser)

const postTypes = [
  { value: 'announcement', label: 'Announcement', icon: 'campaign' },
  { value: 'question', label: 'Question', icon: 'help_outline' },
  { value: 'material', label: 'Material', icon: 'description' },
  { value: 'assignment', label: 'Assignment', icon: 'assignment' }
]

const canCreatePost = computed(() => {
  if (selectedType.value !== 'material' && !postTitle.value.trim()) return false
  if (!postContent.value.trim()) return false
  return true
})

const toggleComposer = () => {
  showComposer.value = !showComposer.value
}

const cancelComposer = () => {
  showComposer.value = false
  resetForm()
}

const resetForm = () => {
  postTitle.value = ''
  postContent.value = ''
  attachments.value = []
  selectedAudience.value = 'all'
  selectedTopics.value = []
  newTopic.value = ''
  schedulePost.value = false
  scheduledDate.value = ''
  scheduledTime.value = ''
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    attachments.value.push({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      file: file
    })
  })
  event.target.value = '' // Reset file input
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}

const addTopic = () => {
  if (newTopic.value.trim() && !selectedTopics.value.includes(newTopic.value.trim())) {
    selectedTopics.value.push(newTopic.value.trim())
    newTopic.value = ''
  }
}

const removeTopic = (topic) => {
  selectedTopics.value = selectedTopics.value.filter(t => t !== topic)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const createPost = async () => {
  if (!canCreatePost.value) return

  const postData = {
    courseId: props.courseId,
    authorId: currentUser.value.id,
    type: selectedType.value,
    title: postTitle.value.trim(),
    content: postContent.value.trim(),
    attachments: attachments.value.map(att => ({
      name: att.name,
      type: att.type,
      size: att.size,
      url: '#' // In a real app, this would be the uploaded file URL
    })),
    topics: selectedTopics.value,
    audience: selectedAudience.value,
    scheduled: schedulePost.value,
    scheduledAt: schedulePost.value ? `${scheduledDate.value}T${scheduledTime.value}` : null
  }

  try {
    const newPost = await postsStore.createPost(postData)
    emit('post-created', newPost)
    showToast('Post created successfully')
    resetForm()
    showComposer.value = false
  } catch (error) {
    console.error('Error creating post:', error)
    showToast('Error creating post')
  }
}

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
