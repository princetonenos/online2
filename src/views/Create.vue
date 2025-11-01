<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900 mb-6">Create</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Create Class -->
        <div 
          @click="navigateToClassCreate"
          class="border border-classroom-gray-200 rounded-classroom p-6 hover:border-classroom-primary transition-colors cursor-pointer focus-classroom"
          tabindex="0"
          @keydown.enter="navigateToClassCreate"
          @keydown.space="navigateToClassCreate"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-classroom-primary bg-opacity-10 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-classroom-primary text-xl">school</span>
            </div>
            <div>
              <h3 class="font-medium text-classroom-gray-900">Class</h3>
              <p class="text-sm text-classroom-gray-500">Create a new class</p>
            </div>
          </div>
        </div>

        <!-- Create Assignment -->
        <div 
          @click="navigateToAssignmentCreate"
          class="border border-classroom-gray-200 rounded-classroom p-6 hover:border-classroom-primary transition-colors cursor-pointer focus-classroom"
          tabindex="0"
          @keydown.enter="navigateToAssignmentCreate"
          @keydown.space="navigateToAssignmentCreate"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-classroom-secondary bg-opacity-10 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-classroom-secondary text-xl">assignment</span>
            </div>
            <div>
              <h3 class="font-medium text-classroom-gray-900">Assignment</h3>
              <p class="text-sm text-classroom-gray-500">Create a new assignment</p>
            </div>
          </div>
        </div>

        <!-- Create Quiz -->
        <div 
          @click="navigateToQuizCreate"
          class="border border-classroom-gray-200 rounded-classroom p-6 hover:border-classroom-primary transition-colors cursor-pointer focus-classroom"
          tabindex="0"
          @keydown.enter="navigateToQuizCreate"
          @keydown.space="navigateToQuizCreate"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-classroom-support bg-opacity-10 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-classroom-support text-xl">quiz</span>
            </div>
            <div>
              <h3 class="font-medium text-classroom-gray-900">Quiz</h3>
              <p class="text-sm text-classroom-gray-500">Create a new quiz</p>
            </div>
          </div>
        </div>

        <!-- Create Material -->
        <div 
          @click="navigateToMaterialCreate"
          class="border border-classroom-gray-200 rounded-classroom p-6 hover:border-classroom-primary transition-colors cursor-pointer focus-classroom"
          tabindex="0"
          @keydown.enter="navigateToMaterialCreate"
          @keydown.space="navigateToMaterialCreate"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-classroom-gray-100 rounded-classroom flex items-center justify-center">
              <span class="material-icons text-classroom-gray-600 text-xl">description</span>
            </div>
            <div>
              <h3 class="font-medium text-classroom-gray-900">Material</h3>
              <p class="text-sm text-classroom-gray-500">Share learning materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToClassCreate = () => {
  router.push('/teacher/create-class')
}

const navigateToAssignmentCreate = () => {
  showToast('Assignment creation would open here')
}

const navigateToQuizCreate = () => {
  showToast('Quiz creation would open here')
}

const navigateToMaterialCreate = () => {
  showToast('Material creation would open here')
}

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
