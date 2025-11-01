<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-medium text-classroom-gray-900 mb-2">Class Stream</h1>
      <p class="text-classroom-gray-600">Announcements and updates from your classes</p>
    </div>

    <!-- Posts list -->
    <div class="space-y-6">
      <div 
        v-for="post in posts"
        :key="post.id"
        class="bg-white rounded-classroom classroom-shadow p-6"
      >
        <div class="flex items-start space-x-4 mb-4">
          <div class="w-10 h-10 bg-classroom-primary rounded-full flex items-center justify-center text-white font-medium">
            {{ getInitials(post.authorName) }}
          </div>
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <h3 class="font-medium text-classroom-gray-900">{{ post.authorName }}</h3>
              <span class="text-sm text-classroom-gray-500">•</span>
              <span class="text-sm text-classroom-gray-500">{{ formatTime(post.createdAt) }}</span>
            </div>
            <p class="text-sm text-classroom-gray-600">{{ post.courseName }}</p>
          </div>
        </div>

        <div class="mb-4">
          <h4 class="text-lg font-medium text-classroom-gray-900 mb-2">{{ post.title }}</h4>
          <p class="text-classroom-gray-700 whitespace-pre-line">{{ post.content }}</p>
        </div>

        <!-- Attachments -->
        <div v-if="post.attachments && post.attachments.length > 0" class="mb-4">
          <h5 class="text-sm font-medium text-classroom-gray-900 mb-2">Attachments</h5>
          <div class="space-y-2">
            <div
              v-for="attachment in post.attachments"
              :key="attachment.id"
              class="flex items-center space-x-3 p-3 border border-classroom-gray-200 rounded-classroom hover:bg-classroom-gray-50 transition-colors cursor-pointer"
              @click="downloadAttachment(attachment)"
            >
              <span class="material-icons text-classroom-primary">attachment</span>
              <div class="flex-1">
                <p class="font-medium text-classroom-gray-900">{{ attachment.name }}</p>
                <p class="text-sm text-classroom-gray-600">{{ formatFileSize(attachment.size) }}</p>
              </div>
              <span class="material-icons text-classroom-gray-400">download</span>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div v-if="post.comments && post.comments.length > 0" class="border-t border-classroom-gray-200 pt-4">
          <h5 class="text-sm font-medium text-classroom-gray-900 mb-3">Comments</h5>
          <div class="space-y-3">
            <div
              v-for="comment in post.comments"
              :key="comment.id"
              class="flex items-start space-x-3"
            >
              <div class="w-8 h-8 bg-classroom-gray-200 rounded-full flex items-center justify-center text-classroom-gray-600 text-xs font-medium">
                {{ getInitials(comment.authorName) }}
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-sm font-medium text-classroom-gray-900">{{ comment.authorName }}</span>
                  <span class="text-xs text-classroom-gray-500">{{ formatTime(comment.createdAt) }}</span>
                </div>
                <p class="text-sm text-classroom-gray-700">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="posts.length === 0" class="text-center py-16">
      <div class="w-24 h-24 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="material-icons text-classroom-gray-400 text-4xl">forum</span>
      </div>
      <h3 class="text-xl font-medium text-classroom-gray-900 mb-2">No posts yet</h3>
      <p class="text-classroom-gray-600">Your teachers will post announcements and updates here</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePostsStore } from '../../store/posts'
import { useUsersStore } from '../../store/users'
import { useCoursesStore } from '../../store/courses'

const postsStore = usePostsStore()
const usersStore = useUsersStore()
const coursesStore = useCoursesStore()

const posts = computed(() => {
  const currentUser = usersStore.currentUser
  if (!currentUser) return []

  // Get courses the student is enrolled in
  const enrolledCourses = coursesStore.getCoursesForUser(currentUser.id)
  const enrolledCourseIds = enrolledCourses.map(course => course.id)

  // Filter posts to only show posts from enrolled courses
  return postsStore.posts
    .filter(post => enrolledCourseIds.includes(post.courseId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`
  } else {
    return date.toLocaleDateString()
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadAttachment = (attachment) => {
  // In a real app, this would download the actual file
  showToast(`Downloading ${attachment.name}...`)
  console.log('Downloading attachment:', attachment)
}

onMounted(async () => {
  try {
    await Promise.all([
      postsStore.loadPosts(),
      coursesStore.loadCourses()
    ])
  } catch (error) {
    console.error('Error loading stream data:', error)
    showToast('Error loading stream information')
  }
})

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
