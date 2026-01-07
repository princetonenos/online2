// exportHelpers.js - Utilities for exporting data
export function exportToJSON(data, filename = 'export.json') {
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, filename, 'application/json')
}

export function exportToCSV(data, filename = 'export.csv', columns = null) {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Get headers
  const headers = columns || Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ].join('\n')

  downloadFile(csvContent, filename, 'text/csv')
}

export function exportToExcel(data, filename = 'export.xlsx') {
  // For now, export as CSV (can be enhanced with a library like xlsx later)
  exportToCSV(data, filename.replace('.xlsx', '.csv'))
}

export function importFromCSV(fileContent) {
  const lines = fileContent.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row')
  }

  const headers = parseCSVLine(lines[0])
  const data = lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    return row
  })

  return data
}

export function importFromJSON(fileContent) {
  try {
    return JSON.parse(fileContent)
  } catch (error) {
    throw new Error('Invalid JSON format')
  }
}

export function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Start or end of quoted value
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Add last field
  result.push(current.trim())

  return result
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export function generateCSVTemplate(columns) {
  return columns.join(',') + '\n'
}

export function downloadCSVTemplate(columns, filename = 'template.csv') {
  const template = generateCSVTemplate(columns)
  downloadFile(template, filename, 'text/csv')
}
