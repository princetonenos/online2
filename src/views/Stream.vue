<template>
  <div class="space-y-6">
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '../store/users'
import { usePostsStore } from '../store/posts'
import StreamComposer from '../components/StreamComposer.vue'
import PostItem from '../components/PostItem.vue'

const route = useRoute()
const usersStore = useUsersStore()
const postsStore = usePostsStore()

const loading = ref(false)
const loadingMore = ref(false)
const showComposer = ref(false)

const courseId = computed(() => route.params.id)
const currentUser = computed(() => usersStore.currentUser)
const isTeacher = computed(() => usersStore.isTeacher)

const posts = computed(() => {
  return postsStore.getPostsByCourse(courseId.value)
})

const handlePostCreated = (newPost) => {
  showToast('Post created successfully')
  // The post will automatically appear in the list due to the computed property
}

const handlePostUpdated = (updatedPost) => {
  showToast('Post updated successfully')
}

const handlePostDeleted = (deletedPostId) => {
  showToast('Post deleted successfully')
}

const handleCommentAdded = (postId, newComment) => {
  showToast('Comment added')
}

const loadMorePosts = async () => {
  loadingMore.value = true
  // Simulate loading more posts
  await new Promise(resolve => setTimeout(resolve, 1000))
  loadingMore.value = false
  showToast('No more posts to load')
}

const loadPosts = async () => {
  loading.value = true
  try {
    await postsStore.loadPosts()
  } catch (error) {
    console.error('Error loading posts:', error)
    showToast('Error loading posts')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPosts()
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
