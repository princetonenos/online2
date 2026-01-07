<template>
  <Transition name="page" mode="out-in">
    <slot />
  </Transition>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
