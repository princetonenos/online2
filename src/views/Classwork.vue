<template>
  <div class="space-y-6">
    <!-- Classwork header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-medium text-classroom-gray-900 mb-2">Classwork</h2>
        <p class="text-classroom-gray-600">Manage assignments, questions, and materials</p>
      </div>
      <button 
        v-if="isTeacher"
        @click="openCreateAssignment"
        class="btn-primary flex items-center space-x-2"
      >
        <span class="material-icons text-lg">add</span>
        <span>Create</span>
      </button>
    </div>

    <!-- Topics and assignments layout -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Topics sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-classroom classroom-shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-classroom-gray-900">Topics</h3>
            <button 
              v-if="isTeacher"
              @click="openCreateTopic"
              class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors"
              aria-label="Create topic"
            >
              <span class="material-icons text-classroom-gray-600 text-lg">add</span>
            </button>
          </div>

          <!-- Topics list -->
          <div class="space-y-1">
            <button
              @click="selectTopic(null)"
              class="w-full text-left px-3 py-2 rounded-classroom text-sm transition-colors"
              :class="{
                'bg-classroom-primary bg-opacity-10 text-classroom-primary': selectedTopicId === null,
                'text-classroom-gray-700 hover:bg-classroom-gray-100': selectedTopicId !== null
              }"
            >
              All classwork
            </button>
            
            <div
              v-for="topic in topics"
              :key="topic.id"
              class="group"
            >
              <div class="flex items-center">
                <button
                  @click="toggleTopic(topic.id)"
                  class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors"
                  aria-label="Toggle topic"
                >
                  <span 
                    class="material-icons text-classroom-gray-500 text-sm transform transition-transform"
                    :class="{ 'rotate-90': expandedTopics[topic.id] }"
                  >
                    play_arrow
                  </span>
                </button>
                
                <button
                  @click="selectTopic(topic.id)"
                  class="flex-1 text-left px-2 py-2 rounded-classroom text-sm transition-colors"
                  :class="{
                    'bg-classroom-primary bg-opacity-10 text-classroom-primary': selectedTopicId === topic.id,
                    'text-classroom-gray-700 hover:bg-classroom-gray-100': selectedTopicId !== topic.id
                  }"
                >
                  {{ topic.name }}
                </button>

                <button
                  v-if="isTeacher"
                  @click="openTopicOptions(topic)"
                  class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Topic options"
                >
                  <span class="material-icons text-classroom-gray-500 text-lg">more_vert</span>
                </button>
              </div>

              <!-- Assignment count -->
              <div 
                v-if="expandedTopics[topic.id]"
                class="ml-6 text-xs text-classroom-gray-500"
              >
                {{ getAssignmentsByTopic(topic.id).length }} assignments
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assignments main content -->
      <div class="lg:col-span-3">
        <!-- Loading state -->
        <div v-if="loading" class="space-y-4">
          <div v-for="n in 3" :key="n" class="bg-white rounded-classroom classroom-shadow p-4">
            <div class="skeleton h-6 w-3/4 mb-3"></div>
            <div class="skeleton h-4 w-full mb-2"></div>
            <div class="skeleton h-4 w-1/2"></div>
          </div>
        </div>

        <!-- Empty state -->
        <div 
          v-else-if="filteredAssignments.length === 0" 
          class="bg-white rounded-classroom classroom-shadow p-8 text-center"
        >
          <div class="w-16 h-16 bg-classroom-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-classroom-gray-400 text-2xl">assignment</span>
          </div>
          <h3 class="text-lg font-medium text-classroom-gray-900 mb-2">No classwork yet</h3>
          <p class="text-classroom-gray-600 mb-4">
            {{ isTeacher ? 'Create assignments, questions, or materials to get started.' : 'Your teacher hasn\'t created any classwork yet.' }}
          </p>
          <button 
            v-if="isTeacher"
            @click="openCreateAssignment"
            class="btn-primary"
          >
            Create your first assignment
          </button>
        </div>

        <!-- Assignments list -->
        <div v-else class="space-y-4">
          <AssignmentCard
            v-for="assignment in filteredAssignments"
            :key="assignment.id"
            :assignment="assignment"
            @click="navigateToAssignment(assignment)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '../store/users'
import { useAssignmentsStore } from '../store/assignments'
import AssignmentCard from '../components/AssignmentCard.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const assignmentsStore = useAssignmentsStore()

const loading = ref(false)
const selectedTopicId = ref(null)
const expandedTopics = ref({})

const courseId = computed(() => route.params.id)
const currentUser = computed(() => usersStore.currentUser)
const isTeacher = computed(() => usersStore.isTeacher)

const topics = computed(() => {
  // Mock topics for now - in a real app, this would come from the store
  return [
    { id: 'topic1', courseId: courseId.value, name: 'Introduction to Calculus', order: 1 },
    { id: 'topic2', courseId: courseId.value, name: 'Derivatives', order: 2 },
    { id: 'topic3', courseId: courseId.value, name: 'Integration', order: 3 }
  ]
})

const assignments = computed(() => {
  return assignmentsStore.getAssignmentsByCourse(courseId.value)
})

const filteredAssignments = computed(() => {
  if (selectedTopicId.value === null) {
    return assignments.value
  }
  return assignments.value.filter(assignment => assignment.topicId === selectedTopicId.value)
})

const getAssignmentsByTopic = (topicId) => {
  return assignments.value.filter(assignment => assignment.topicId === topicId)
}

const selectTopic = (topicId) => {
  selectedTopicId.value = topicId
}

const toggleTopic = (topicId) => {
  expandedTopics.value[topicId] = !expandedTopics.value[topicId]
}

const openCreateAssignment = () => {
  showToast('Create assignment modal would open here')
}

const openCreateTopic = () => {
  showToast('Create topic modal would open here')
}

const openTopicOptions = (topic) => {
  showToast(`Options for topic: ${topic.name}`)
}

const navigateToAssignment = (assignment) => {
  router.push(`/course/${assignment.courseId}/assignments/${assignment.id}`)
}

const loadClasswork = async () => {
  loading.value = true
  try {
    await assignmentsStore.loadAssignments()
    // Auto-expand topics with assignments
    topics.value.forEach(topic => {
      if (getAssignmentsByTopic(topic.id).length > 0) {
        expandedTopics.value[topic.id] = true
      }
    })
  } catch (error) {
    console.error('Error loading classwork:', error)
    showToast('Error loading classwork')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadClasswork()
})

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
