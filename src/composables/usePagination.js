// usePagination.js - Composable for pagination
import { ref, computed } from 'vue'

export function usePagination(itemsPerPage = 10) {
  const currentPage = ref(1)
  const perPage = ref(itemsPerPage)
  const totalItems = ref(0)

  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / perPage.value)
  })

  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  const hasPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  const startIndex = computed(() => {
    return (currentPage.value - 1) * perPage.value
  })

  const endIndex = computed(() => {
    return Math.min(startIndex.value + perPage.value, totalItems.value)
  })

  const paginate = (items) => {
    if (!items || !Array.isArray(items)) return []
    totalItems.value = items.length
    return items.slice(startIndex.value, endIndex.value)
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const reset = () => {
    currentPage.value = 1
  }

  const pageNumbers = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  })

  return {
    currentPage,
    perPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    pageNumbers,
    paginate,
    nextPage,
    previousPage,
    goToPage,
    reset
  }
}
