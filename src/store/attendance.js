import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAttendanceStore = defineStore('attendance', () => {
  const attendanceRecords = ref([])
  const loading = ref(false)

  const loadAttendance = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const savedAttendance = localStorage.getItem('teacher-attendance')
      if (savedAttendance) {
        attendanceRecords.value = JSON.parse(savedAttendance)
      } else {
        const response = await fetch('/src/data/mock/attendance.json')
        const data = await response.json()
        attendanceRecords.value = data.attendance
        saveToLocalStorage()
      }
    } catch (error) {
      console.error('Error loading attendance:', error)
      attendanceRecords.value = []
    } finally {
      loading.value = false
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('teacher-attendance', JSON.stringify(attendanceRecords.value))
  }

  const createAttendanceRecord = async (sessionId, classId, studentRecords) => {
    const attendanceRecord = {
      id: `attendance_${Date.now()}`,
      sessionId,
      classId,
      records: studentRecords.map(student => ({
        studentId: student.id,
        status: student.status || 'present',
        timestamp: new Date().toISOString()
      })),
      createdAt: new Date().toISOString()
    }
    
    attendanceRecords.value.push(attendanceRecord)
    saveToLocalStorage()
    return attendanceRecord
  }

  const updateAttendanceRecord = async (attendanceId, studentRecords) => {
    const recordIndex = attendanceRecords.value.findIndex(a => a.id === attendanceId)
    if (recordIndex !== -1) {
      attendanceRecords.value[recordIndex].records = studentRecords.map(student => ({
        studentId: student.id,
        status: student.status,
        timestamp: new Date().toISOString()
      }))
      saveToLocalStorage()
      return attendanceRecords.value[recordIndex]
    }
    return null
  }

  const getAttendanceBySession = (sessionId) => {
    return attendanceRecords.value.find(a => a.sessionId === sessionId)
  }

  const getAttendanceByClass = (classId) => {
    return attendanceRecords.value.filter(a => a.classId === classId)
  }

  const exportAttendanceCSV = (classId) => {
    const classAttendance = getAttendanceByClass(classId)
    if (classAttendance.length === 0) return null

    const headers = ['Student Name', 'Session Date', 'Status', 'Timestamp']
    const csvData = []

    classAttendance.forEach(attendance => {
      attendance.records.forEach(record => {
        csvData.push([
          `Student ${record.studentId}`, // In real app, get student name
          new Date(attendance.createdAt).toLocaleDateString(),
          record.status,
          new Date(record.timestamp).toLocaleString()
        ])
      })
    })

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    return csvContent
  }

  return {
    attendanceRecords,
    loading,
    loadAttendance,
    createAttendanceRecord,
    updateAttendanceRecord,
    getAttendanceBySession,
    getAttendanceByClass,
    exportAttendanceCSV
  }
})
