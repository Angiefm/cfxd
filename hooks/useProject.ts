import { useState, useCallback, useEffect } from 'react'
import {
  createProject,
  listProjects,
  updateProject,
  deleteProject,
  type Project,
  type CreateProjectData,
  type UpdateProjectData,
  type ProjectListResponse
} from '@/services/projectService'
import { showToast } from '@/components/Toast'

interface UseProjectReturn {
  projects: Project[]
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  createNewProject: (data: CreateProjectData) => Promise<void>
  updateExistingProject: (projectId: string, data: UpdateProjectData) => Promise<void>
  deleteExistingProject: (projectId: string) => Promise<void>
  refreshProjects: () => Promise<void>
}

export function useProject(): UseProjectReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Initialize projects as empty array if undefined
  const safeProjects = projects || []

  const refreshProjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const response: ProjectListResponse = await listProjects()
      setProjects(response.data.data)
      console.log('Projects loaded:', response.data.data)
    } catch (error: any) {
      console.error('Failed to load projects:', error)
      showToast("Error al cargar proyectos", "error")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createNewProject = useCallback(async (data: CreateProjectData) => {
    setIsCreating(true)
    try {
      const newProject = await createProject(data)
      setProjects(prev => {
        const currentProjects = Array.isArray(prev) ? prev : []
        return [newProject, ...currentProjects]
      })
      showToast("Proyecto creado exitosamente", "success")
    } catch (error: any) {
      console.error('Failed to create project:', error)
      showToast(error.message || "Error al crear proyecto", "error")
      throw error
    } finally {
      setIsCreating(false)
    }
  }, [])

  const updateExistingProject = useCallback(async (projectId: string, data: UpdateProjectData) => {
    setIsUpdating(true)
    try {
      const updatedProject = await updateProject(projectId, data)
      setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p))
      showToast("Proyecto actualizado exitosamente", "success")
    } catch (error: any) {
      console.error('Failed to update project:', error)
      showToast(error.message || "Error al actualizar proyecto", "error")
      throw error
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const deleteExistingProject = useCallback(async (projectId: string) => {
    setIsDeleting(true)
    try {
      await deleteProject(projectId)
      setProjects(prev => prev.filter(p => p.id !== projectId))
      showToast("Proyecto eliminado exitosamente", "success")
    } catch (error: any) {
      console.error('Failed to delete project:', error)
      showToast(error.message || "Error al eliminar proyecto", "error")
      throw error
    } finally {
      setIsDeleting(false)
    }
  }, [])

  useEffect(() => {
    // Only load projects if we have an access token
    const token = localStorage.getItem('access_token')
    if (token) {
      refreshProjects()
    }
  }, [refreshProjects])

  return {
    projects,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createNewProject,
    updateExistingProject,
    deleteExistingProject,
    refreshProjects,
  }
}