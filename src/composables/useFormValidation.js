// useFormValidation.js - Composable for form validation
import { ref, reactive } from 'vue'

export function useFormValidation() {
  const errors = reactive({})
  const isValid = ref(true)

  const validators = {
    required: (value, fieldName = 'This field') => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} is required`
      }
      return null
    },

    email: (value) => {
      if (!value) return null
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
      return null
    },

    minLength: (value, min, fieldName = 'This field') => {
      if (!value) return null
      if (value.length < min) {
        return `${fieldName} must be at least ${min} characters`
      }
      return null
    },

    maxLength: (value, max, fieldName = 'This field') => {
      if (!value) return null
      if (value.length > max) {
        return `${fieldName} must not exceed ${max} characters`
      }
      return null
    },

    pattern: (value, pattern, message) => {
      if (!value) return null
      if (!pattern.test(value)) {
        return message || 'Invalid format'
      }
      return null
    },

    custom: (value, validatorFn) => {
      return validatorFn(value)
    }
  }

  const validate = (fieldName, value, rules) => {
    errors[fieldName] = null

    for (const rule of rules) {
      let error = null

      if (typeof rule === 'function') {
        error = rule(value)
      } else if (typeof rule === 'object') {
        const { type, ...params } = rule
        if (validators[type]) {
          error = validators[type](value, ...Object.values(params))
        }
      } else if (validators[rule]) {
        error = validators[rule](value)
      }

      if (error) {
        errors[fieldName] = error
        break
      }
    }

    return !errors[fieldName]
  }

  const validateAll = (formData, rules) => {
    let valid = true
    
    for (const [field, fieldRules] of Object.entries(rules)) {
      const fieldValid = validate(field, formData[field], fieldRules)
      if (!fieldValid) {
        valid = false
      }
    }

    isValid.value = valid
    return valid
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => {
      errors[key] = null
    })
    isValid.value = true
  }

  const clearError = (fieldName) => {
    errors[fieldName] = null
  }

  return {
    errors,
    isValid,
    validate,
    validateAll,
    clearErrors,
    clearError,
    validators
  }
}
