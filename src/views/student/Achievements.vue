<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Achievements
          </h1>
          <p class="text-gray-600 mt-2">Track your progress, earn badges, and celebrate your learning milestones</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <div class="text-sm text-gray-500">Current Level</div>
            <div class="text-2xl font-bold text-gray-900">{{ userLevel }}</div>
          </div>
          <button 
            @click="$router.back()"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-classroom transition-colors flex items-center space-x-2"
          >
            <span class="material-icons text-sm">arrow_back</span>
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Achievement Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Points</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalPoints.toLocaleString() }}</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">trending_up</span>
              +{{ recentPoints }} this week
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-blue-600 text-xl">emoji_events</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Badges Earned</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ badgesEarned }}</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">stars</span>
              {{ badgesTotal }} available
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-green-600 text-xl">military_tech</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Learning Streak</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ learningStreak }} days</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">local_fire_department</span>
              Keep it up!
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-purple-600 text-xl">local_fire_department</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl border border-orange-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Rank Position</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">#{{ rankPosition }}</p>
            <p class="text-green-500 text-sm mt-2 flex items-center">
              <span class="material-icons text-sm mr-1">leaderboard</span>
              Top {{ rankPercentile }}%
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-classroom flex items-center justify-center">
            <span class="material-icons text-orange-600 text-xl">leaderboard</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Left Column: Progress & Recent -->
      <div class="xl:col-span-2 space-y-8">
        <!-- Level Progress -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Level Progress</h2>
            <div class="text-right">
              <div class="text-sm text-gray-500">Next Level: {{ nextLevel }}</div>
              <div class="text-lg font-bold text-gray-900">{{ pointsToNextLevel }} points needed</div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900">Current Progress</span>
              <span class="text-sm text-gray-600">{{ currentLevelProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div 
                class="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                :style="{ width: currentLevelProgress + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500">
              <span>Level {{ userLevel }}</span>
              <span>Level {{ parseInt(userLevel) + 1 }}</span>
            </div>
          </div>

          <!-- Level Rewards -->
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 rounded-classroom p-4 border border-blue-200">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-blue-600 text-lg">card_giftcard</span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-sm">Current Level</h3>
                  <p class="text-gray-600 text-xs">Access to all current features</p>
                </div>
              </div>
            </div>
            <div class="bg-purple-50 rounded-classroom p-4 border border-purple-200">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-purple-600 text-lg">auto_awesome</span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-sm">Next Level</h3>
                  <p class="text-gray-600 text-xs">Advanced analytics & premium badges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Achievements -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Recent Achievements</h2>
            <button 
              @click="viewAllAchievements"
              class="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-2"
            >
              <span>View all</span>
              <span class="material-icons text-sm">arrow_forward</span>
            </button>
          </div>

          <div class="space-y-4">
            <div 
              v-for="achievement in recentAchievements"
              :key="achievement.id"
              class="flex items-center space-x-4 p-4 bg-gray-50 rounded-classroom hover:bg-blue-50 transition-colors"
            >
              <div 
                class="w-16 h-16 rounded-classroom flex items-center justify-center text-white text-2xl"
                :class="achievement.color"
              >
                <span class="material-icons text-xl">{{ achievement.icon }}</span>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-gray-900">{{ achievement.title }}</h3>
                <p class="text-gray-600 text-sm mt-1">{{ achievement.description }}</p>
                <div class="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                  <span class="flex items-center space-x-1">
                    <span class="material-icons text-sm">schedule</span>
                    <span>{{ achievement.date }}</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <span class="material-icons text-sm">star</span>
                    <span>+{{ achievement.points }} points</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="recentAchievements.length === 0" class="text-center py-8 text-gray-500">
            <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-gray-400 text-2xl">emoji_events</span>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Recent Achievements</h3>
            <p class="text-gray-500">Complete assignments and participate in classes to earn achievements</p>
          </div>
        </div>
      </div>

      <!-- Right Column: Badges & Leaderboard -->
      <div class="space-y-8">
        <!-- Badge Collection -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Badge Collection</h2>
          
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="badge in badgeCollection"
              :key="badge.id"
              class="text-center group cursor-pointer"
              @click="viewBadgeDetails(badge)"
            >
              <div 
                class="w-16 h-16 mx-auto rounded-classroom flex items-center justify-center text-white text-xl mb-2 transform group-hover:scale-110 transition-transform"
                :class="badge.earned ? badge.color : 'bg-gray-300'"
              >
                <span class="material-icons text-lg">{{ badge.icon }}</span>
              </div>
              <div class="text-xs font-medium text-gray-900">{{ badge.name }}</div>
              <div class="text-xs text-gray-500" v-if="!badge.earned">Locked</div>
            </div>
          </div>

          <div class="mt-6 text-center">
            <button 
              @click="viewAllBadges"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all {{ badgesTotal }} badges
            </button>
          </div>
        </div>

        <!-- Weekly Leaderboard -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Weekly Leaderboard</h2>
          
          <div class="space-y-3">
            <div
              v-for="(student, index) in leaderboard"
              :key="student.id"
              class="flex items-center space-x-3 p-3 rounded-classroom"
              :class="{
                'bg-yellow-50 border border-yellow-200': index === 0,
                'bg-gray-50': index > 0 && index < 3,
                'hover:bg-blue-50': index >= 3
              }"
            >
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                :class="{
                  'bg-yellow-500': index === 0,
                  'bg-gray-400': index === 1,
                  'bg-orange-500': index === 2,
                  'bg-blue-500': index >= 3
                }"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-900 truncate">
                  {{ student.name }}
                  <span v-if="student.id === currentUserId" class="text-blue-600 ml-1">(You)</span>
                </div>
                <div class="text-xs text-gray-500">{{ student.points }} points</div>
              </div>
              <div class="text-right">
                <div class="text-xs font-medium" :class="getRankColor(index)">{{ getRankTitle(index) }}</div>
              </div>
            </div>
          </div>

          <div class="mt-4 text-center">
            <button 
              @click="viewFullLeaderboard"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View full leaderboard
            </button>
          </div>
        </div>

        <!-- Achievement Goals -->
        <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-xl border border-green-100 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Current Goals</h2>
          
          <div class="space-y-3">
            <div
              v-for="goal in currentGoals"
              :key="goal.id"
              class="flex items-center justify-between p-3 bg-white rounded-classroom border border-green-200"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-classroom flex items-center justify-center">
                  <span class="material-icons text-green-600 text-sm">{{ goal.icon }}</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ goal.title }}</div>
                  <div class="text-xs text-gray-500">{{ goal.progress }}/{{ goal.target }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs font-medium text-green-600">{{ goal.reward }} points</div>
                <div class="w-16 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    class="bg-green-500 h-2 rounded-full transition-all duration-500"
                    :style="{ width: (goal.progress / goal.target * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievement Categories -->
    <div class="mt-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Achievement Categories</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="category in achievementCategories"
          :key="category.id"
          class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
          @click="viewCategory(category)"
        >
          <div class="flex items-center space-x-3 mb-4">
            <div 
              class="w-12 h-12 rounded-classroom flex items-center justify-center text-white"
              :class="category.color"
            >
              <span class="material-icons text-lg">{{ category.icon }}</span>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">{{ category.name }}</h3>
              <p class="text-sm text-gray-600">{{ category.completed }}/{{ category.total }} completed</p>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-500"
              :class="category.color"
              :style="{ width: (category.completed / category.total * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Milestone Rewards -->
    <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl border border-purple-100 p-6 mt-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Upcoming Milestone Rewards</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="milestone in milestoneRewards"
          :key="milestone.id"
          class="bg-white rounded-classroom p-6 border border-purple-200 text-center"
        >
          <div 
            class="w-16 h-16 mx-auto rounded-classroom flex items-center justify-center text-white text-xl mb-4"
            :class="milestone.color"
          >
            <span class="material-icons text-2xl">{{ milestone.icon }}</span>
          </div>
          <h3 class="font-bold text-gray-900 text-lg mb-2">{{ milestone.title }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ milestone.description }}</p>
          <div class="text-purple-600 font-semibold">{{ milestone.points }} points</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// User data
const userLevel = ref(12)
const totalPoints = ref(8450)
const recentPoints = ref(250)
const badgesEarned = ref(18)
const badgesTotal = ref(45)
const learningStreak = ref(14)
const rankPosition = ref(8)
const rankPercentile = ref(15)
const currentUserId = ref(123)

// Computed properties
const nextLevel = computed(() => userLevel.value + 1)
const pointsToNextLevel = computed(() => {
  const basePoints = 1000
  const levelMultiplier = userLevel.value * 100
  return basePoints + levelMultiplier - (totalPoints.value % (basePoints + levelMultiplier))
})

const currentLevelProgress = computed(() => {
  const levelPoints = 1000 + (userLevel.value * 100)
  const pointsInLevel = totalPoints.value % levelPoints
  return Math.round((pointsInLevel / levelPoints) * 100)
})

// Mock data
const recentAchievements = ref([
  {
    id: 1,
    title: 'Perfect Week',
    description: 'Completed all assignments for the week on time',
    points: 100,
    date: '2 days ago',
    icon: 'calendar_today',
    color: 'bg-green-500'
  },
  {
    id: 2,
    title: 'Math Master',
    description: 'Scored 90% or higher on 5 consecutive math quizzes',
    points: 150,
    date: '4 days ago',
    icon: 'calculate',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    title: 'Study Streak',
    description: 'Maintained a 14-day learning streak',
    points: 200,
    date: '1 week ago',
    icon: 'local_fire_department',
    color: 'bg-orange-500'
  }
])

const badgeCollection = ref([
  { id: 1, name: 'Quick Learner', icon: 'rocket_launch', color: 'bg-blue-500', earned: true },
  { id: 2, name: 'Math Whiz', icon: 'calculate', color: 'bg-green-500', earned: true },
  { id: 3, name: 'Science Star', icon: 'science', color: 'bg-purple-500', earned: true },
  { id: 4, name: 'Bookworm', icon: 'menu_book', color: 'bg-orange-500', earned: true },
  { id: 5, name: 'Perfect Score', icon: 'score', color: 'bg-red-500', earned: false },
  { id: 6, name: 'Group Leader', icon: 'groups', color: 'bg-indigo-500', earned: false }
])

const leaderboard = ref([
  { id: 101, name: 'Alex Johnson', points: 1250 },
  { id: 102, name: 'Sarah Miller', points: 1180 },
  { id: 103, name: 'Mike Davis', points: 1120 },
  { id: 123, name: 'Your Name', points: 845 },
  { id: 104, name: 'Emma Wilson', points: 820 },
  { id: 105, name: 'James Brown', points: 790 }
])

const currentGoals = ref([
  {
    id: 1,
    title: 'Complete 5 assignments',
    progress: 3,
    target: 5,
    reward: 100,
    icon: 'assignment'
  },
  {
    id: 2,
    title: 'Maintain 7-day streak',
    progress: 4,
    target: 7,
    reward: 150,
    icon: 'local_fire_department'
  },
  {
    id: 3,
    title: 'Score 90% on next test',
    progress: 0,
    target: 1,
    reward: 200,
    icon: 'grade'
  }
])

const achievementCategories = ref([
  {
    id: 1,
    name: 'Academic Excellence',
    icon: 'school',
    color: 'bg-blue-500',
    completed: 8,
    total: 12
  },
  {
    id: 2,
    name: 'Study Habits',
    icon: 'schedule',
    color: 'bg-green-500',
    completed: 5,
    total: 8
  },
  {
    id: 3,
    name: 'Participation',
    icon: 'groups',
    color: 'bg-purple-500',
    completed: 3,
    total: 10
  },
  {
    id: 4,
    name: 'Special Skills',
    icon: 'auto_awesome',
    color: 'bg-orange-500',
    completed: 2,
    total: 15
  }
])

const milestoneRewards = ref([
  {
    id: 1,
    title: 'Level 15 Unlock',
    description: 'Access to advanced learning modules',
    points: 1000,
    icon: 'lock_open',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: '5000 Points',
    description: 'Exclusive digital certificate',
    points: 5000,
    icon: 'verified',
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: '25 Badges',
    description: 'Premium profile customization',
    points: 2500,
    icon: 'palette',
    color: 'bg-purple-500'
  }
])

// Helper functions
const getRankColor = (index) => {
  if (index === 0) return 'text-yellow-600'
  if (index === 1) return 'text-gray-600'
  if (index === 2) return 'text-orange-600'
  return 'text-blue-600'
}

const getRankTitle = (index) => {
  if (index === 0) return '1st'
  if (index === 1) return '2nd'
  if (index === 2) return '3rd'
  return `${index + 1}th`
}

// Actions
const viewAllAchievements = () => {
  showToast('Opening all achievements...')
}

const viewBadgeDetails = (badge) => {
  if (badge.earned) {
    showToast(`Viewing ${badge.name} badge details...`)
  } else {
    showToast(`This badge is locked. Complete requirements to earn it!`)
  }
}

const viewAllBadges = () => {
  showToast('Opening badge collection...')
}

const viewFullLeaderboard = () => {
  showToast('Opening full leaderboard...')
}

const viewCategory = (category) => {
  showToast(`Opening ${category.name} achievements...`)
}

const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  } else {
    alert(message)
  }
}

onMounted(() => {
  // Initialize achievements data
  console.log('Achievements module initialized')
})
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
</style>
