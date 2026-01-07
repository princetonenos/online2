<template>
  <div class="space-y-6">
    <!-- Filter buttons -->
    <div v-if="posts.length > 0 || filterType !== 'all'" class="flex items-center space-x-2 bg-white rounded-classroom p-4 classroom-shadow">
      <span class="text-sm font-medium text-gray-700 mr-2">Filter:</span>
      <button 
        @click="filterType = 'all'" 
        :class="filterType === 'all' ? 'chip-primary' : 'chip-gray'" 
        class="chip"
      >
        All Posts
      </button>
      <button 
        @click="filterType = 'announcement'" 
        :class="filterType === 'announcement' ? 'chip-primary' : 'chip-gray'" 
        class="chip"
      >
        Announcements
      </button>
      <button 
        @click="filterType = 'question'" 
        :class="filterType === 'question' ? 'chip-primary' : 'chip-gray'" 
        class="chip"
      >
        Questions
      </button>
      <button 
        @click="filterType = 'material'" 
        :class="filterType === 'material' ? 'chip-primary' : 'chip-gray'" 
        class="chip"
      >
        Materials
      </button>
    </div>

    <!-- Stream composer -->
    <StreamComposer 
      v-if="isTeacher"
      :course-id="courseId"
      @post-created="handlePostCreated"
    />

    <!-- Posts loading skeleton -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="bg-white rounded-classroom classroom-shadow p-4">
        <div class="flex items-start space-x-3 mb-4">
          <div class="skeleton w-10 h-10 rounded-full"></div>
          <div class="flex-1">
            <div class="skeleton h-4 w-32 mb-2"></div>
            <div class="skeleton h-3 w-24"></div>
          </div>
        </div>
        <div class="skeleton h-4 w-full mb-2"></div>
        <div class="skeleton h-4 w-3/4"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div 
      v-else-if="posts.length === 0" 
      class="bg-white rounded-classroom classroom-shadow p-8 text-center"
    >
      <div class="w-16 h-16 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="material-icons text-classroom-gray-400 text-2xl">chat</span>
      </div>
      <h3 class="text-lg font-medium text-classroom-gray-900 mb-2">No posts yet</h3>
      <p class="text-classroom-gray-600 mb-4">
        {{ isTeacher ? 'Share announcements, assignments, or questions with your class.' : 'Your teacher hasn\'t posted anything yet.' }}
      </p>
      <button 
        v-if="isTeacher"
        @click="showComposer = true"
        class="btn-primary"
      >
        Create your first post
      </button>
    </div>

    <!-- Posts list -->
    <div v-else class="space-y-4">
      <PostItem
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @post-updated="handlePostUpdated"
        @post-deleted="handlePostDeleted"
        @comment-added="handleCommentAdded"
      />
    </div>

    <!-- Load more button -->
    <div v-if="posts.length > 0" class="text-center">
      <button 
        @click="loadMorePosts"
        class="btn-outline"
        :disabled="loadingMore"
      >
        <span v-if="loadingMore" class="material-icons animate-spin text-lg mr-2">refresh</span>
        {{ loadingMore ? 'Loading...' : 'Load more posts' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import StreamComposer from '../components/StreamComposer.vue'
import PostItem from '../components/PostItem.vue'

const route = useRoute()

const loading = ref(false)
const loadingMore = ref(false)
const showComposer = ref(false)
const postsData = ref([])
const filterType = ref('all')

// Get current user from localStorage
const currentUser = JSON.parse(localStorage.getItem('mock:currentUser') || 'null')
const courseId = computed(() => route.params.id)
const isTeacher = computed(() => currentUser?.role === 'teacher')

// Load posts from localStorage
function loadPosts() {
  const allPosts = JSON.parse(localStorage.getItem('mock:posts') || '[]')
  postsData.value = allPosts
    .filter(p => p.courseId === courseId.value)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// Filtered posts based on type
const posts = computed(() => {
  if (filterType.value === 'all') {
    return postsData.value
  }
  return postsData.value.filter(p => p.type === filterType.value)
})

const handlePostCreated = (newPost) => {
  loadPosts() // Reload to show new post
  showToast('Post created successfully')
}

const handlePostUpdated = (updatedPost) => {
  loadPosts() // Reload to show updates
  showToast('Post updated successfully')
}

const handlePostDeleted = (deletedPostId) => {
  loadPosts() // Reload after deletion
  showToast('Post deleted successfully')
}

const handleCommentAdded = (postId, newComment) => {
  loadPosts() // Reload to show new comment
  showToast('Comment added')
}

const loadMorePosts = async () => {
  loadingMore.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  loadingMore.value = false
  showToast('All posts loaded')
}

// Event listeners for real-time updates
function handlePostEvent() {
  loadPosts()
}

onMounted(() => {
  loading.value = true
  loadPosts()
  loading.value = false
  
  // Listen for post events
  window.addEventListener('postCreated', handlePostEvent)
  window.addEventListener('postUpdated', handlePostEvent)
  window.addEventListener('postDeleted', handlePostEvent)
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('postCreated', handlePostEvent)
  window.removeEventListener('postUpdated', handlePostEvent)
  window.removeEventListener('postDeleted', handlePostEvent)
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
