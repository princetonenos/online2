<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-classroom-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-classroom">
    <!-- Mobile view -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="$emit('previous')"
        :disabled="!hasPreviousPage"
        class="relative inline-flex items-center rounded-md border border-classroom-gray-300 bg-white px-4 py-2 text-sm font-medium text-classroom-gray-700 hover:bg-classroom-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="$emit('next')"
        :disabled="!hasNextPage"
        class="relative ml-3 inline-flex items-center rounded-md border border-classroom-gray-300 bg-white px-4 py-2 text-sm font-medium text-classroom-gray-700 hover:bg-classroom-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Desktop view -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-classroom-gray-700">
          Showing
          <span class="font-medium">{{ startIndex + 1 }}</span>
          to
          <span class="font-medium">{{ endIndex }}</span>
          of
          <span class="font-medium">{{ totalItems }}</span>
          results
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Previous button -->
          <button
            @click="$emit('previous')"
            :disabled="!hasPreviousPage"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-classroom-gray-400 ring-1 ring-inset ring-classroom-gray-300 hover:bg-classroom-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <span class="material-icons text-sm">chevron_left</span>
          </button>

          <!-- First page -->
          <button
            v-if="pageNumbers[0] > 1"
            @click="$emit('goto', 1)"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-classroom-gray-900 ring-1 ring-inset ring-classroom-gray-300 hover:bg-classroom-gray-50 focus:z-20 focus:outline-offset-0"
          >
            1
          </button>

          <!-- Ellipsis before -->
          <span
            v-if="pageNumbers[0] > 2"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-classroom-gray-700 ring-1 ring-inset ring-classroom-gray-300"
          >
            ...
          </span>

          <!-- Page numbers -->
          <button
            v-for="page in pageNumbers"
            :key="page"
            @click="$emit('goto', page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-classroom-gray-300 focus:z-20 focus:outline-offset-0',
              page === currentPage
                ? 'z-10 bg-classroom-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-classroom-primary'
                : 'text-classroom-gray-900 hover:bg-classroom-gray-50'
            ]"
          >
            {{ page }}
          </button>

          <!-- Ellipsis after -->
          <span
            v-if="pageNumbers[pageNumbers.length - 1] < totalPages - 1"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-classroom-gray-700 ring-1 ring-inset ring-classroom-gray-300"
          >
            ...
          </span>

          <!-- Last page -->
          <button
            v-if="pageNumbers[pageNumbers.length - 1] < totalPages"
            @click="$emit('goto', totalPages)"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-classroom-gray-900 ring-1 ring-inset ring-classroom-gray-300 hover:bg-classroom-gray-50 focus:z-20 focus:outline-offset-0"
          >
            {{ totalPages }}
          </button>

          <!-- Next button -->
          <button
            @click="$emit('next')"
            :disabled="!hasNextPage"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-classroom-gray-400 ring-1 ring-inset ring-classroom-gray-300 hover:bg-classroom-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Next</span>
            <span class="material-icons text-sm">chevron_right</span>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  startIndex: {
    type: Number,
    required: true
  },
  endIndex: {
    type: Number,
    required: true
  },
  pageNumbers: {
    type: Array,
    required: true
  },
  hasNextPage: {
    type: Boolean,
    required: true
  },
  hasPreviousPage: {
    type: Boolean,
    required: true
  }
})

defineEmits(['previous', 'next', 'goto'])
</script>
