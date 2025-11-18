"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"

export interface GalleryImage {
  id: string
  file_name: string
  mime_type: string
  size: number
  user_id: string
  project_id: string | null
  created_at: string
  url: string
  signed_url: string
  tags: string[]
}

export interface GalleryFilters {
  project_id?: string
  page?: number
  limit?: number
  sort_by?: 'created_at' | 'updated_at' | 'file_name' | 'mime_type' | 'size'
  sort_order?: 'asc' | 'desc'
  created_from?: string
  created_to?: string
  tags?: string[]
}

export interface GalleryResponse {
  status: string
  message: string | null
  data: {
    total: number
    page: number
    limit: number
    data: GalleryImage[]
  }
}

export function useUserGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [filters, setFilters] = useState<GalleryFilters>({})

  const fetchImages = useCallback(async (filtersOverride?: Partial<GalleryFilters>) => {
    setIsLoading(true)
    setError(null)

    try {
      const currentFilters = { ...filters, ...filtersOverride }
      const params = new URLSearchParams()

      // Get user_id from localStorage user data
      const userData = localStorage.getItem("user")
      if (userData) {
        const user = JSON.parse(userData)
        params.append("user_id", user.id)
      }

      // Add filters
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v))
          } else {
            params.append(key, value.toString())
          }
        }
      })

      const response = await apiClient.get<GalleryResponse>(`/api/images/list?${params.toString()}`)

      setImages(response.data.data)
      setTotal(response.data.total)
      setPage(response.data.page)
      setLimit(response.data.limit)
    } catch (err: any) {
      console.error('Failed to fetch gallery images:', err)
      setError(err.message || 'Error al cargar las imágenes')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const updateFilters = useCallback((newFilters: Partial<GalleryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchImages(updatedFilters)
  }, [filters, fetchImages])

  const loadMore = useCallback(() => {
    if (!isLoading && images.length < total) {
      updateFilters({ page: page + 1 })
    }
  }, [isLoading, images.length, total, page, updateFilters])

  const refresh = useCallback(() => {
    fetchImages()
  }, [fetchImages])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  return {
    images,
    isLoading,
    error,
    total,
    page,
    limit,
    filters,
    fetchImages,
    updateFilters,
    loadMore,
    refresh,
    hasMore: images.length < total
  }
}
