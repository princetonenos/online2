// Simple MediaRecorder composable to record a MediaStream, download, and upload
import { ref } from 'vue'

export function useMediaRecorder() {
  const mediaRecorder = ref(null)
  const isRecording = ref(false)
  const chunks = ref([])
  const mimeType = ref('')

  function pickSupportedMime() {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4' // some browsers may not allow this for MediaRecorder
    ]
    for (const type of candidates) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(type)) return type
    }
    return ''
  }

  async function start(stream) {
    if (!stream) throw new Error('No MediaStream provided to recorder')
    if (isRecording.value) return

    chunks.value = []
    mimeType.value = pickSupportedMime()

    mediaRecorder.value = new MediaRecorder(stream, mimeType.value ? { mimeType: mimeType.value } : undefined)

    mediaRecorder.value.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.value.push(e.data)
    }
    mediaRecorder.value.onstop = () => {}

    mediaRecorder.value.start(500) // gather data every 500ms
    isRecording.value = true
  }

  async function stop() {
    if (!mediaRecorder.value) return null
    return new Promise((resolve) => {
      mediaRecorder.value.onstop = () => {
        const blob = new Blob(chunks.value, { type: mimeType.value || 'video/webm' })
        isRecording.value = false
        resolve(blob)
      }
      mediaRecorder.value.stop()
    })
  }

  function download(blob, filename = `recording-${Date.now()}.webm`) {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function upload(blob, apiBaseUrl, token, filename = `recording-${Date.now()}.webm`) {
    if (!blob) throw new Error('No blob to upload')
    const form = new FormData()
    const file = new File([blob], filename, { type: blob.type || 'video/webm' })
    form.append('file', file)

    const res = await fetch(`${apiBaseUrl}/files/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Upload failed (${res.status}) ${text}`)
    }
    return res.json()
  }

  return { mediaRecorder, isRecording, start, stop, download, upload }
}
