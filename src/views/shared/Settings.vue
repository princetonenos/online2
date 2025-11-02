<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="bg-white rounded-classroom classroom-shadow p-6">
      <h1 class="text-2xl font-medium text-classroom-gray-900 mb-6">Settings</h1>
      
      <div class="space-y-6">
        <!-- Account Settings -->
        <div class="border border-classroom-gray-200 rounded-classroom p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Account Settings</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-classroom-gray-900">Email Notifications</p>
                <p class="text-sm text-classroom-gray-500">Receive email updates about your classes</p>
              </div>
              <button class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-classroom-primary transition-colors duration-200 ease-in-out focus:outline-none">
                <span class="sr-only">Use setting</span>
                <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"></span>
              </button>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-classroom-gray-900">Push Notifications</p>
                <p class="text-sm text-classroom-gray-500">Get notified about new assignments and announcements</p>
              </div>
              <button class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-classroom-gray-200 transition-colors duration-200 ease-in-out focus:outline-none">
                <span class="sr-only">Use setting</span>
                <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Display Settings -->
        <div class="border border-classroom-gray-200 rounded-classroom p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Display Settings</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">Theme</label>
              <select class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-classroom-gray-900 mb-2">Language</label>
              <select class="w-full px-3 py-2 border border-classroom-gray-300 rounded-classroom focus:border-classroom-primary focus:outline-none transition-colors">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="border border-classroom-gray-200 rounded-classroom p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Privacy</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-classroom-gray-900">Show Profile to Classmates</p>
                <p class="text-sm text-classroom-gray-500">Allow other students in your classes to see your profile</p>
              </div>
              <button class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-classroom-primary transition-colors duration-200 ease-in-out focus:outline-none">
                <span class="sr-only">Use setting</span>
                <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="border border-classroom-gray-200 rounded-classroom p-6">
          <h2 class="text-lg font-medium text-classroom-gray-900 mb-4">Actions</h2>
          <div class="space-y-3">
            <button class="w-full text-left px-4 py-3 border border-classroom-gray-200 rounded-classroom hover:bg-classroom-gray-50 transition-colors">
              <p class="font-medium text-classroom-gray-900">Export Data</p>
              <p class="text-sm text-classroom-gray-500">Download all your classroom data</p>
            </button>
            
            <button class="w-full text-left px-4 py-3 border border-classroom-gray-200 rounded-classroom hover:bg-classroom-gray-50 transition-colors">
              <p class="font-medium text-classroom-gray-900">Delete Account</p>
              <p class="text-sm text-classroom-gray-500">Permanently delete your account and all data</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Settings functionality would be implemented here
</script>
