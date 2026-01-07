<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">GC</span>
              </div>
              <span class="text-xl font-semibold text-gray-900">Classroom</span>
            </router-link>
          </div>

          <!-- Navigation Menu -->
          <NavigationMenu />

          <!-- User Menu -->
          <UserMenu />
        </div>
      </div>
    </header>

    <!-- Breadcrumb Navigation -->
    <Breadcrumb />

    <!-- Main Content -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <PageTransition>
          <component :is="Component" />
        </PageTransition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import PageTransition from '../components/PageTransition.vue'
import NavigationMenu from '../components/NavigationMenu.vue'
import UserMenu from '../components/UserMenu.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
</script>

<style scoped>
/* Additional styles if needed */
</style>
