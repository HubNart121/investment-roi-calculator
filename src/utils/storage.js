import { STORAGE_KEY } from '../constants/defaults'

export function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function exportBackup(projects) {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    projects,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `investment-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.projects && Array.isArray(data.projects)) {
          resolve(data.projects)
        } else if (Array.isArray(data)) {
          resolve(data)
        } else {
          reject(new Error('รูปแบบไฟล์ไม่ถูกต้อง'))
        }
      } catch {
        reject(new Error('ไม่สามารถอ่านไฟล์ได้'))
      }
    }
    reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'))
    reader.readAsText(file)
  })
}
