<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            System Settings
          </h1>
          <p class="text-gray-600 mt-2">Configure system-wide settings and preferences</p>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            v-if="hasChanges"
            @click="saveAllSettings"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-classroom transition-colors flex items-center space-x-2"
          >
            <span class="material-icons text-sm">save</span>
            <span>Save Changes</span>
          </button>
          <router-link 
            to="/admin/dashboard"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-classroom transition-colors flex items-center space-x-2"
          >
            <span class="material-icons text-sm">arrow_back</span>
            <span>Back</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <ErrorAlert 
      :error="error" 
      @dismiss="error = null"
    />
    
    <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-classroom p-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <span class="material-icons text-green-600">check_circle</span>
        <span class="text-green-900">{{ successMessage }}</span>
      </div>
      <button @click="successMessage = null" class="text-green-600 hover:text-green-800">
        <span class="material-icons text-sm">close</span>
      </button>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="border-b border-gray-200">
        <div class="flex overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap"
            :class="activeTab === tab.id 
              ? 'border-blue-600 text-blue-600 bg-blue-50' 
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <span class="material-icons text-sm">{{ tab.icon }}</span>
            <span class="font-medium">{{ tab.name }}</span>
          </button>
        </div>
      </div>

      <div class="p-6">
        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">School Name</label>
              <input
                v-model="settings.general.schoolName"
                @input="hasChanges = true"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter school name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
              <select
                v-model="settings.general.timezone"
                @change="hasChanges = true"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                <option value="Europe/London">GMT</option>
                <option value="Asia/Dubai">Gulf Standard Time</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <input
                v-model="settings.general.academicYear"
                @input="hasChanges = true"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2024-2025"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                v-model="settings.general.language"
                @change="hasChanges = true"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="sw">Swahili</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">School Address</label>
              <textarea
                v-model="settings.general.address"
                @input="hasChanges = true"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter school address"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                v-model="settings.general.contactEmail"
                @input="hasChanges = true"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@school.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                v-model="settings.general.contactPhone"
                @input="hasChanges = true"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
              <input
                v-model.number="settings.security.minPasswordLength"
                @input="hasChanges = true"
                type="number"
                min="6"
                max="20"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input
                v-model.number="settings.security.sessionTimeout"
                @input="hasChanges = true"
                type="number"
                min="15"
                max="480"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
              <input
                v-model.number="settings.security.maxLoginAttempts"
                @input="hasChanges = true"
                type="number"
                min="3"
                max="10"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
              <input
                v-model.number="settings.security.passwordExpiryDays"
                @input="hasChanges = true"
                type="number"
                min="0"
                max="365"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Set to 0 to disable password expiry</p>
            </div>

            <div class="md:col-span-2 space-y-4">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  v-model="settings.security.requireSpecialChars"
                  @change="hasChanges = true"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">Require special characters in passwords</span>
              </label>

              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  v-model="settings.security.requireNumbers"
                  @change="hasChanges = true"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">Require numbers in passwords</span>
              </label>

              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  v-model="settings.security.requireUppercase"
                  @change="hasChanges = true"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">Require uppercase letters in passwords</span>
              </label>

              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  v-model="settings.security.twoFactorAuth"
                  @change="hasChanges = true"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-if="activeTab === 'notifications'" class="space-y-6">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Email Notifications</h3>
            
            <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <div class="font-medium text-gray-900">New User Registration</div>
                <div class="text-sm text-gray-600">Send email when new users register</div>
              </div>
              <input
                v-model="settings.notifications.newUserRegistration"
                @change="hasChanges = true"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <div class="font-medium text-gray-900">Assignment Submissions</div>
                <div class="text-sm text-gray-600">Notify teachers of new submissions</div>
              </div>
              <input
                v-model="settings.notifications.assignmentSubmissions"
                @change="hasChanges = true"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <div class="font-medium text-gray-900">Grade Updates</div>
                <div class="text-sm text-gray-600">Notify students when grades are posted</div>
              </div>
              <input
                v-model="settings.notifications.gradeUpdates"
                @change="hasChanges = true"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <div class="font-medium text-gray-900">System Maintenance</div>
                <div class="text-sm text-gray-600">Notify all users of scheduled maintenance</div>
              </div>
              <input
                v-model="settings.notifications.systemMaintenance"
                @change="hasChanges = true"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label class="flex items-center justify-between p-4 bg-gray-50 rounded-classroom cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <div class="font-medium text-gray-900">Daily Digest</div>
                <div class="text-sm text-gray-600">Send daily summary emails to admins</div>
              </div>
              <input
                v-model="settings.notifications.dailyDigest"
                @change="hasChanges = true"
                type="checkbox"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <!-- System Settings -->
        <div v-if="activeTab === 'system'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-classroom cursor-pointer">
                <div>
                  <div class="font-medium text-gray-900">Maintenance Mode</div>
                  <div class="text-sm text-gray-600">Disable access for non-admin users</div>
                </div>
                <input
                  v-model="settings.system.maintenanceMode"
                  @change="hasChanges = true"
                  type="checkbox"
                  class="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
              <select
                v-model="settings.system.backupFrequency"
                @change="hasChanges = true"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Data Retention (days)</label>
              <input
                v-model.number="settings.system.dataRetentionDays"
                @input="hasChanges = true"
                type="number"
                min="30"
                max="3650"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max File Upload Size (MB)</label>
              <input
                v-model.number="settings.system.maxUploadSize"
                @input="hasChanges = true"
                type="number"
                min="1"
                max="100"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
              <select
                v-model="settings.system.logLevel"
                @change="hasChanges = true"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="error">Error Only</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
            </div>

            <div class="md:col-span-2 space-y-4 mt-4">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  v-model="settings.system.allowRegistration"
                  @change="hasChanges = true"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">Allow public registration</span>
              </label>

              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  v-model="settings.system.enableAnalytics"
                  @change="hasChanges = true"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">Enable analytics tracking</span>
              </label>

              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  v-model="settings.system.autoBackup"
                  @change="hasChanges = true"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">Enable automatic backups</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Appearance Settings -->
        <div v-if="activeTab === 'appearance'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div class="flex items-center space-x-3">
                <input
                  v-model="settings.appearance.primaryColor"
                  @input="hasChanges = true"
                  type="color"
                  class="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  v-model="settings.appearance.primaryColor"
                  @input="hasChanges = true"
                  type="text"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <input
                v-model="settings.appearance.logoUrl"
                @input="hasChanges = true"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-classroom focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/logo.png"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div class="grid grid-cols-3 gap-4">
                <label 
                  v-for="theme in themes"
                  :key="theme.id"
                  class="relative flex flex-col items-center p-4 border-2 rounded-classroom cursor-pointer transition-all"
                  :class="settings.appearance.theme === theme.id ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'"
                >
                  <input
                    v-model="settings.appearance.theme"
                    @change="hasChanges = true"
                    type="radio"
                    :value="theme.id"
                    class="sr-only"
                  />
                  <div class="w-full h-20 rounded mb-2" :style="{ background: theme.preview }"></div>
                  <span class="text-sm font-medium">{{ theme.name }}</span>
                  <span v-if="settings.appearance.theme === theme.id" class="absolute top-2 right-2">
                    <span class="material-icons text-blue-600 text-sm">check_circle</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex items-center justify-between">
      <button 
        @click="resetToDefaults"
        class="text-red-600 hover:text-red-800 font-medium flex items-center space-x-2"
      >
        <span class="material-icons text-sm">restore</span>
        <span>Reset to Defaults</span>
      </button>
      
      <div class="flex items-center space-x-4">
        <button 
          @click="$router.back()"
          class="px-6 py-2 border border-gray-300 rounded-classroom hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          v-if="hasChanges"
          @click="saveAllSettings"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-classroom transition-colors flex items-center space-x-2"
        >
          <span class="material-icons text-sm">save</span>
          <span>Save All Changes</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuditLogStore } from '@/stores/auditLog'
import ErrorAlert from '@/components/ErrorAlert.vue'

const router = useRouter()
const auditStore = useAuditLogStore()

const activeTab = ref('general')
const hasChanges = ref(false)
const error = ref(null)
const successMessage = ref(null)

const tabs = [
  { id: 'general', name: 'General', icon: 'settings' },
  { id: 'security', name: 'Security', icon: 'security' },
  { id: 'notifications', name: 'Notifications', icon: 'notifications' },
  { id: 'system', name: 'System', icon: 'dns' },
  { id: 'appearance', name: 'Appearance', icon: 'palette' }
]

const themes = [
  { id: 'light', name: 'Light', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'dark', name: 'Dark', preview: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' },
  { id: 'auto', name: 'Auto', preview: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }
]

const defaultSettings = {
  general: {
    schoolName: 'My School',
    timezone: 'UTC',
    academicYear: '2024-2025',
    language: 'en',
    address: '',
    contactEmail: '',
    contactPhone: ''
  },
  security: {
    minPasswordLength: 8,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    twoFactorAuth: false
  },
  notifications: {
    newUserRegistration: true,
    assignmentSubmissions: true,
    gradeUpdates: true,
    systemMaintenance: true,
    dailyDigest: false
  },
  system: {
    maintenanceMode: false,
    backupFrequency: 'daily',
    dataRetentionDays: 365,
    maxUploadSize: 10,
    logLevel: 'info',
    allowRegistration: true,
    enableAnalytics: true,
    autoBackup: true
  },
  appearance: {
    primaryColor: '#3b82f6',
    logoUrl: '',
    theme: 'light'
  }
}

const settings = ref(JSON.parse(JSON.stringify(defaultSettings)))

const loadSettings = () => {
  const saved = localStorage.getItem('gco:adminSettings')
  if (saved) {
    try {
      settings.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }
}

const saveAllSettings = () => {
  try {
    localStorage.setItem('gco:adminSettings', JSON.stringify(settings.value))
    auditStore.logSystemSettingsChanged(settings.value)
    hasChanges.value = false
    successMessage.value = 'Settings saved successfully!'
    
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (e) {
    error.value = 'Failed to save settings. Please try again.'
    console.error('Save error:', e)
  }
}

const resetToDefaults = () => {
  if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
    settings.value = JSON.parse(JSON.stringify(defaultSettings))
    hasChanges.value = true
    successMessage.value = 'Settings reset to defaults. Click "Save Changes" to apply.'
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
/* Custom scrollbar for tabs */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
