<template>
  <div class="main-layout">
    <AppHeader />
    <PortalNavigation />
    <main class="main-content" data-testid="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'
import PortalNavigation from '../components/PortalNavigation.vue'

export default {
  name: 'MainLayout',
  components: {
    AppHeader,
    PortalNavigation
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}
</style>
