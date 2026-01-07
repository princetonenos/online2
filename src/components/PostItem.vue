<template>
  <div class="bg-white rounded-classroom classroom-shadow p-4">
    <!-- Post header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-start space-x-3">
        <img 
          :src="author?.avatar" 
          :alt="author?.name"
          class="w-10 h-10 rounded-full"
        >
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="font-medium text-classroom-gray-900">{{ author?.name }}</h3>
            <span class="chip text-xs" :class="getPostTypeClass(post.type)">
              {{ getPostTypeLabel(post.type) }}
            </span>
          </div>
          <p class="text-sm text-classroom-gray-500">{{ formatDate(post.createdAt) }}</p>
        </div>
      </div>

      <!-- Post actions menu -->
      <div class="relative">
        <button 
          @click="toggleOptions"
          class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors focus-classroom"
          aria-label="Post options"
        >
          <span class="material-icons text-classroom-gray-600 text-lg">more_vert</span>
        </button>

        <!-- Options dropdown -->
        <div 
          v-if="showOptions"
          class="absolute right-0 top-full mt-1 bg-white rounded-classroom classroom-shadow-lg border border-classroom-gray-200 py-1 z-10 w-48"
        >
          <button 
            v-if="canEdit"
            @click="editPost"
            class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
          >
            <span class="material-icons text-classroom-gray-600 text-lg">edit</span>
            <span>Edit</span>
          </button>
          <button 
            @click="copyPost"
            class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
          >
            <span class="material-icons text-classroom-gray-600 text-lg">content_copy</span>
            <span>Copy</span>
          </button>
          <button 
            @click="reusePost"
            class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2"
          >
            <span class="material-icons text-classroom-gray-600 text-lg">replay</span>
            <span>Reuse post</span>
          </button>
          <div class="border-t border-classroom-gray-100 my-1"></div>
          <button 
            v-if="canEdit"
            @click="deletePost"
            class="w-full text-left px-4 py-2 hover:bg-classroom-gray-100 text-sm flex items-center space-x-2 text-red-600"
          >
            <span class="material-icons text-lg">delete</span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Post title -->
    <h4 v-if="post.title" class="text-lg font-medium text-classroom-gray-900 mb-3">
      {{ post.title }}
    </h4>

    <!-- Post content -->
    <div class="text-classroom-gray-700 mb-4 whitespace-pre-line">
      {{ post.content }}
    </div>

    <!-- Attachments -->
    <div v-if="post.attachments && post.attachments.length > 0" class="mb-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <AttachmentPreview
          v-for="attachment in post.attachments"
          :key="attachment.name"
          :attachment="attachment"
        />
      </div>
    </div>

    <!-- Topics -->
    <div v-if="post.topics && post.topics.length > 0" class="flex flex-wrap gap-2 mb-4">
      <span
        v-for="topic in post.topics"
        :key="topic"
        class="chip chip-gray text-xs"
      >
        {{ topic }}
      </span>
    </div>

    <!-- Post actions -->
    <div class="flex items-center justify-between pt-4 border-t border-classroom-gray-100">
      <div class="flex items-center space-x-4">
        <button 
          @click="toggleComments"
          class="flex items-center space-x-1 text-classroom-gray-600 hover:text-classroom-gray-800 transition-colors"
        >
          <span class="material-icons text-lg">chat_bubble_outline</span>
          <span class="text-sm">{{ post.comments?.length || 0 }}</span>
        </button>
        <button 
          class="flex items-center space-x-1 text-classroom-gray-600 hover:text-classroom-gray-800 transition-colors"
        >
          <span class="material-icons text-lg">thumb_up</span>
          <span class="text-sm">Like</span>
        </button>
        <button 
          class="flex items-center space-x-1 text-classroom-gray-600 hover:text-classroom-gray-800 transition-colors"
        >
          <span class="material-icons text-lg">share</span>
          <span class="text-sm">Share</span>
        </button>
      </div>
    </div>

    <!-- Comments section -->
    <div v-if="showComments" class="mt-4 pt-4 border-t border-classroom-gray-100">
      <!-- Comments list -->
      <div v-if="post.comments && post.comments.length > 0" class="space-y-3 mb-4">
        <div
          v-for="comment in post.comments"
          :key="comment.id"
          class="flex items-start space-x-3"
        >
          <img 
            :src="getCommentAuthor(comment.authorId)?.avatar" 
            :alt="getCommentAuthor(comment.authorId)?.name"
            class="w-8 h-8 rounded-full"
          >
          <div class="flex-1">
            <div class="bg-classroom-gray-50 rounded-classroom p-3">
              <div class="flex items-center space-x-2 mb-1">
                <span class="text-sm font-medium text-classroom-gray-900">
                  {{ getCommentAuthor(comment.authorId)?.name }}
                </span>
                <span class="text-xs text-classroom-gray-500">
                  {{ formatDate(comment.createdAt) }}
                </span>
              </div>
              <p class="text-sm text-classroom-gray-700">{{ comment.content }}</p>
            </div>
            <div class="flex items-center space-x-3 mt-1 ml-3">
              <button class="text-xs text-classroom-gray-500 hover:text-classroom-gray-700">
                Like
              </button>
              <button class="text-xs text-classroom-gray-500 hover:text-classroom-gray-700">
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add comment -->
      <div class="flex items-start space-x-3">
        <img 
          :src="currentUser?.avatar" 
          :alt="currentUser?.name"
          class="w-8 h-8 rounded-full"
        >
        <div class="flex-1">
          <textarea
            v-model="newComment"
            rows="2"
            placeholder="Add a class comment..."
            class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors resize-none text-sm"
          ></textarea>
          <div class="flex items-center justify-end space-x-2 mt-2">
            <button
              @click="cancelComment"
              class="btn-outline text-sm px-3 py-1"
            >
              Cancel
            </button>
            <button
              @click="addComment"
              :disabled="!newComment.trim()"
              class="btn-primary text-sm px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AttachmentPreview from './AttachmentPreview.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['post-updated', 'post-deleted', 'comment-added'])

const showOptions = ref(false)
const showComments = ref(false)
const newComment = ref('')

const currentUser = computed(() => {
  return JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
})

const author = computed(() => {
  const users = JSON.parse(localStorage.getItem('mock:users') || '[]')
  return users.find(u => u.id === props.post.authorId)
})

const canEdit = computed(() => {
  return currentUser.value?.id === props.post.authorId || currentUser.value?.role === 'teacher'
})

const getPostTypeClass = (type) => {
  const typeClasses = {
    announcement: 'chip-primary',
    question: 'chip-secondary',
    material: 'chip-gray',
    assignment: 'chip-primary'
  }
  return typeClasses[type] || 'chip-gray'
}

const getPostTypeLabel = (type) => {
  const typeLabels = {
    announcement: 'Announcement',
    question: 'Question',
    material: 'Material',
    assignment: 'Assignment'
  }
  return typeLabels[type] || 'Post'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      return `${diffMinutes}m ago`
    }
    return `${diffHours}h ago`
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString()
}

const getCommentAuthor = (authorId) => {
  const users = JSON.parse(localStorage.getItem('mock:users') || '[]')
  return users.find(u => u.id === authorId)
}

const toggleOptions = () => {
  showOptions.value = !showOptions.value
}

const toggleComments = () => {
  showComments.value = !showComments.value
}

const editPost = () => {
  showToast('Edit post functionality would open here')
  showOptions.value = false
}

const copyPost = () => {
  navigator.clipboard.writeText(`${props.post.title}\n\n${props.post.content}`)
    .then(() => {
      showToast('Post copied to clipboard')
      showOptions.value = false
    })
    .catch(() => {
      showToast('Failed to copy post')
    })
}

const reusePost = () => {
  showToast('Reuse post functionality would open here')
  showOptions.value = false
}

const deletePost = async () => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      // Delete from localStorage
      const allPosts = JSON.parse(localStorage.getItem('mock:posts') || '[]')
      const filtered = allPosts.filter(p => p.id !== props.post.id)
      localStorage.setItem('mock:posts', JSON.stringify(filtered))
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('postDeleted'))
      
      emit('post-deleted', props.post.id)
      showToast('Post deleted successfully')
    } catch (error) {
      console.error('Error deleting post:', error)
      showToast('Error deleting post')
    }
  }
  showOptions.value = false
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  
  const currentUserData = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
  if (!currentUserData) {
    showToast('Please login to comment')
    return
  }

  const comment = {
    id: 'comment_' + Date.now(),
    authorId: currentUserData.id,
    content: newComment.value.trim(),
    createdAt: new Date().toISOString()
  }

  try {
    // Update post in localStorage
    const allPosts = JSON.parse(localStorage.getItem('mock:posts') || '[]')
    const postIndex = allPosts.findIndex(p => p.id === props.post.id)
    
    if (postIndex !== -1) {
      if (!allPosts[postIndex].comments) {
        allPosts[postIndex].comments = []
      }
      allPosts[postIndex].comments.push(comment)
      localStorage.setItem('mock:posts', JSON.stringify(allPosts))
      
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('postUpdated'))
      
      emit('comment-added', props.post.id, comment)
      newComment.value = ''
      showToast('Comment added successfully')
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    showToast('Error adding comment')
  }
}

const cancelComment = () => {
  newComment.value = ''
}

// Close options when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative') && !event.target.closest('button[aria-label="Post options"]')) {
    showOptions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
