<template>
  <div class="flex items-center space-x-3 p-3 border border-classroom-gray-200 rounded-classroom hover:border-classroom-gray-300 transition-colors cursor-pointer">
    <!-- File icon -->
    <div class="flex-shrink-0">
      <div 
        class="w-12 h-12 rounded-classroom flex items-center justify-center"
        :class="getFileTypeClass(attachment.type)"
      >
        <span class="material-icons text-white text-lg">
          {{ getFileTypeIcon(attachment.type) }}
        </span>
      </div>
    </div>

    <!-- File info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-classroom-gray-900 truncate">
        {{ attachment.name }}
      </p>
      <p class="text-xs text-classroom-gray-500">
        {{ attachment.size }}
      </p>
    </div>

    <!-- Download button -->
    <button 
      @click.stop="downloadFile"
      class="p-1 rounded-full hover:bg-classroom-gray-100 transition-colors focus-classroom"
      aria-label="Download file"
    >
      <span class="material-icons text-classroom-gray-600 text-lg">download</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  attachment: {
    type: Object,
    required: true
  }
})

const getFileTypeClass = (fileType) => {
  const typeClasses = {
    'application/pdf': 'bg-red-500',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'bg-blue-500',
    'application/msword': 'bg-blue-500',
    'application/vnd.ms-excel': 'bg-green-500',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'bg-green-500',
    'application/vnd.ms-powerpoint': 'bg-orange-500',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'bg-orange-500',
    'image/jpeg': 'bg-purple-500',
    'image/png': 'bg-purple-500',
    'image/gif': 'bg-purple-500',
    'text/plain': 'bg-gray-500',
    'application/zip': 'bg-yellow-500',
    'application/x-rar-compressed': 'bg-yellow-500'
  }

  // Check for file extensions if type is not available
  if (!fileType && props.attachment.name) {
    const ext = props.attachment.name.split('.').pop().toLowerCase()
    const extensionClasses = {
      'pdf': 'bg-red-500',
      'doc': 'bg-blue-500',
      'docx': 'bg-blue-500',
      'xls': 'bg-green-500',
      'xlsx': 'bg-green-500',
      'ppt': 'bg-orange-500',
      'pptx': 'bg-orange-500',
      'jpg': 'bg-purple-500',
      'jpeg': 'bg-purple-500',
      'png': 'bg-purple-500',
      'gif': 'bg-purple-500',
      'txt': 'bg-gray-500',
      'zip': 'bg-yellow-500',
      'rar': 'bg-yellow-500'
    }
    return extensionClasses[ext] || 'bg-classroom-gray-500'
  }

  return typeClasses[fileType] || 'bg-classroom-gray-500'
}

const getFileTypeIcon = (fileType) => {
  const typeIcons = {
    'application/pdf': 'picture_as_pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'description',
    'application/msword': 'description',
    'application/vnd.ms-excel': 'table_chart',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'table_chart',
    'application/vnd.ms-powerpoint': 'slideshow',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'slideshow',
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'text/plain': 'text_snippet',
    'application/zip': 'folder_zip',
    'application/x-rar-compressed': 'folder_zip'
  }

  // Check for file extensions if type is not available
  if (!fileType && props.attachment.name) {
    const ext = props.attachment.name.split('.').pop().toLowerCase()
    const extensionIcons = {
      'pdf': 'picture_as_pdf',
      'doc': 'description',
      'docx': 'description',
      'xls': 'table_chart',
      'xlsx': 'table_chart',
      'ppt': 'slideshow',
      'pptx': 'slideshow',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'txt': 'text_snippet',
      'zip': 'folder_zip',
      'rar': 'folder_zip'
    }
    return extensionIcons[ext] || 'insert_drive_file'
  }

  return typeIcons[fileType] || 'insert_drive_file'
}

const downloadFile = () => {
  // In a real app, this would download the actual file
  // For now, we'll just show a toast message
  showToast(`Downloading ${props.attachment.name}`)
}

// Toast utility
const showToast = (message) => {
  if (window.showToast) {
    window.showToast(message)
  }
}
</script>
