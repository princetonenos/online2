// useAsync.js - Composable for handling async operations with loading/error states
import { ref } from 'vue'

export function useAsync() {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  const execute = async (asyncFunction, errorMessage = 'An error occurred') => {
    loading.value = true
    error.value = null
    
    try {
      data.value = await asyncFunction()
      return data.value
    } catch (err) {
      error.value = errorMessage
      console.error(errorMessage, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    loading.value = false
    error.value = null
    data.value = null
  }

  return {
    loading,
    error,
    data,
    execute,
    reset
  }
}
