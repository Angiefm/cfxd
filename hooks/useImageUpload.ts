import { useState, useCallback } from 'react'
import { uploadImages, listImages, deleteImage, type ImageData } from '@/services/imageService'
import { showToast } from '@/components/Toast'

interface UseImageUploadReturn {
  images: ImageData[]
  total: number
  page: number
  limit: number
  isUploading: boolean
  isLoading: boolean
  isDeleting: boolean
  uploadFiles: (files: FileList, projectId: string) => Promise<void>
  loadImages: (projectId: string, page?: number, limit?: number) => Promise<void>
  deleteImageById: (imageId: string) => Promise<void>
  setPage: (page: number) => void
  setLimit: (limit: number) => void
}

export function useImageUpload(): UseImageUploadReturn {
  const [images, setImages] = useState<ImageData[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadImages = useCallback(async (projectId: string, pageParam?: number, limitParam?: number) => {
    setIsLoading(true)
    try {
      const currentPage = pageParam || page
      const currentLimit = limitParam || limit
      const response = await listImages({
        ...(projectId && projectId !== 'undefined' && projectId.trim() !== '' ? { project_id: projectId } : {}),
        page: currentPage,
        limit: currentLimit,
        sort_by: 'created_at',
        sort_order: 'desc'
      })
      setImages(response.data.data)
      setTotal(response.data.total)
      setPage(response.data.page)
      setLimit(response.data.limit)
    } catch (error) {
      console.error('Failed to load images:', error)
      showToast("Error al cargar imágenes", "error")
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])

  const deleteImageById = useCallback(async (imageId: string) => {
    setIsDeleting(true)
    try {
      await deleteImage(imageId)
      showToast("Imagen eliminada exitosamente", "success")
      // Remove the image from the local state
      setImages(prev => prev.filter(img => img.id !== imageId))
    } catch (error: any) {
      console.error('Failed to delete image:', error)
      showToast(error.message || "Error al eliminar imagen", "error")
    } finally {
      setIsDeleting(false)
    }
  }, [])

  const uploadFiles = useCallback(async (files: FileList, projectId: string) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const response = await uploadImages(files, projectId)
      showToast(`Se subieron ${response.data.length} imagen(es) exitosamente`, "success")
      // Reload images after successful upload
      await loadImages(projectId)
    } catch (error: any) {
      console.error('Upload failed:', error)
      showToast(error.message || "Error al subir imágenes", "error")
    } finally {
      setIsUploading(false)
    }
  }, [loadImages])

  return {
    images,
    total,
    page,
    limit,
    isUploading,
    isLoading,
    isDeleting,
    uploadFiles,
    loadImages,
    deleteImageById,
    setPage,
    setLimit,
  }
}