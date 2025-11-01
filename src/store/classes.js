import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useClassesStore = defineStore('classes', () => {
  const classes = ref([])
  const loading = ref(false)

  // Load classes from localStorage or mock data
  const loadClasses = async () => {
    loading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Try to load from localStorage first
      const savedClasses = localStorage.getItem('teacher-classes')
      if (savedClasses) {
        classes.value = JSON.parse(savedClasses)
      } else {
        // Load initial mock data
        const response = await fetch('/src/data/mock/classes.json')
        const data = await response.json()
        classes.value = data.classes
        saveToLocalStorage()
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      // Fallback to empty array
      classes.value = []
    } finally {
      loading.value = false
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('teacher-classes', JSON.stringify(classes.value))
  }

  const createClass = async (classData) => {
    const newClass = {
      id: `class_${Date.now()}`,
      ...classData,
      status: 'scheduled',
      sessions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    classes.value.push(newClass)
    saveToLocalStorage()
    return newClass
  }

  const updateClass = async (classId, updates) => {
    const classIndex = classes.value.findIndex(c => c.id === classId)
    if (classIndex !== -1) {
      classes.value[classIndex] = {
        ...classes.value[classIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
      return classes.value[classIndex]
    }
    return null
  }

  const deleteClass = async (classId) => {
    classes.value = classes.value.filter(c => c.id !== classId)
    saveToLocalStorage()
  }

  const getClassById = (classId) => {
    return classes.value.find(c => c.id === classId)
  }

  const getClassesForTeacher = (teacherId) => {
    return classes.value.filter(c => c.teacherId === teacherId)
  }

  const getUpcomingClasses = computed(() => {
    const now = new Date()
    return classes.value
      .filter(c => new Date(c.startAt) > now && c.status === 'scheduled')
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
  })

  const getOngoingClasses = computed(() => {
    return classes.value.filter(c => c.status === 'ongoing')
  })

  const startSession = async (classId) => {
    const classItem = getClassById(classId)
    if (classItem) {
      const session = {
        sessionId: `session_${Date.now()}`,
        startedAt: new Date().toISOString(),
        endedAt: null,
        attendanceId: null,
        notes: '',
        resources: []
      }
      
      classItem.sessions.push(session)
      classItem.status = 'ongoing'
      saveToLocalStorage()
      return session
    }
    return null
  }

  const endSession = async (classId, sessionId, notes = '') => {
    const classItem = getClassById(classId)
    if (classItem) {
      const session = classItem.sessions.find(s => s.sessionId === sessionId)
      if (session) {
        session.endedAt = new Date().toISOString()
        session.notes = notes
        classItem.status = 'completed'
        saveToLocalStorage()
        return session
      }
    }
    return null
  }

  const addSessionResource = async (classId, sessionId, resource) => {
    const classItem = getClassById(classId)
    if (classItem) {
      const session = classItem.sessions.find(s => s.sessionId === sessionId)
      if (session) {
        session.resources.push({
          id: `resource_${Date.now()}`,
          ...resource,
          addedAt: new Date().toISOString()
        })
        saveToLocalStorage()
        return session
      }
    }
    return null
  }

  return {
    classes,
    loading,
    loadClasses,
    createClass,
    updateClass,
    deleteClass,
    getClassById,
    getClassesForTeacher,
    getUpcomingClasses,
    getOngoingClasses,
    startSession,
    endSession,
    addSessionResource
  }
})
