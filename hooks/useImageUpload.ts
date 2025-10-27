import { useState, useCallback } from 'react'
import { uploadImages, listImages, type ImageData } from '@/services/imageService'
import { showToast } from '@/components/Toast'

interface UseImageUploadReturn {
  images: ImageData[]
  isUploading: boolean
  isLoading: boolean
  uploadFiles: (files: FileList, projectId: string) => Promise<void>
  loadImages: (projectId: string) => Promise<void>
}

export function useImageUpload(): UseImageUploadReturn {
  const [images, setImages] = useState<ImageData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const uploadFiles = useCallback(async (files: FileList, projectId: string) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const response = await uploadImages(files, projectId)
      showToast(`Se subieron ${response.data.length} imagen(es) exitosamente`, "success")
      await loadImages(projectId)
    } catch (error: any) {
      console.error('Upload failed:', error)
      showToast(error.message || "Error al subir imágenes", "error")
    } finally {
      setIsUploading(false)
    }
  }, [])

  const loadImages = useCallback(async (projectId: string) => {
    setIsLoading(true)
    try {
      const response = await listImages({ project_id: projectId })
      setImages(response.data)
    } catch (error) {
      console.error('Failed to load images:', error)
      showToast("Error al cargar imágenes", "error")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    images,
    isUploading,
    isLoading,
    uploadFiles,
    loadImages,
  }
}