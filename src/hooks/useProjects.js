import { useState, useCallback, useEffect } from 'react'
import { loadProjects, saveProjects, generateId } from '../utils/storage'
import { DEFAULT_PROJECT } from '../constants/defaults'

export function useProjects() {
  const [projects, setProjects] = useState(() => loadProjects())
  const [activeProjectId, setActiveProjectId] = useState(null)

  useEffect(() => {
    saveProjects(projects)
  }, [projects])

  const activeProject = projects.find((p) => p.id === activeProjectId) || null

  const createProject = useCallback((name = '') => {
    const newProject = {
      ...structuredClone(DEFAULT_PROJECT),
      id: generateId(),
      name: name || `โปรเจค ${projects.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setProjects((prev) => [...prev, newProject])
    setActiveProjectId(newProject.id)
    return newProject.id
  }, [projects.length])

  const updateProject = useCallback((id, updates) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    )
  }, [])

  const updateProjectData = useCallback((id, dataUpdates) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              data: { ...p.data, ...dataUpdates },
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    )
  }, [])

  const deleteProject = useCallback((id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    if (activeProjectId === id) setActiveProjectId(null)
  }, [activeProjectId])

  const duplicateProject = useCallback((id) => {
    const source = projects.find((p) => p.id === id)
    if (!source) return
    const newProject = {
      ...structuredClone(source),
      id: generateId(),
      name: `${source.name} (สำเนา)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setProjects((prev) => [...prev, newProject])
    return newProject.id
  }, [projects])

  const importProjects = useCallback((imported, mode = 'merge') => {
    if (mode === 'replace') {
      setProjects(imported)
      setActiveProjectId(null)
    } else {
      setProjects((prev) => {
        const existingIds = new Set(prev.map((p) => p.id))
        const newOnes = imported.filter((p) => !existingIds.has(p.id))
        return [...prev, ...newOnes]
      })
    }
  }, [])

  return {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    updateProject,
    updateProjectData,
    deleteProject,
    duplicateProject,
    importProjects,
  }
}
