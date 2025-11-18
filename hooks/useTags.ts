import { useState, useCallback, useEffect } from 'react'
import { getTags, createTag, type Tag, type TagsResponse } from '@/services/tagService'
import { showToast } from '@/components/Toast'

interface UseTagsReturn {
  tags: Tag[]
  total: number
  page: number
  limit: number
  isLoading: boolean
  isCreating: boolean
  loadTags: (page?: number, limit?: number) => Promise<void>
  createNewTag: (name: string) => Promise<Tag | null>
  setPage: (page: number) => void
  setLimit: (limit: number) => void
}

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<Tag[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const loadTags = useCallback(async (pageParam?: number, limitParam?: number) => {
    setIsLoading(true)
    try {
      const currentPage = pageParam || page
      const currentLimit = limitParam || limit
      const response: TagsResponse = await getTags({
        page: currentPage,
        limit: currentLimit,
        sort_by: 'name',
        sort_order: 'asc'
      })
      setTags(response.data.tags)
      setTotal(response.data.pagination.total)
      setPage(response.data.pagination.page)
      setLimit(response.data.pagination.limit)
    } catch (error) {
      console.error('Failed to load tags:', error)
      showToast("Error al cargar tags", "error")
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])

  const createNewTag = useCallback(async (name: string): Promise<Tag | null> => {
    setIsCreating(true)
    try {
      const response = await createTag(name)
      if (response.status === "success") {
        showToast("Tag creado exitosamente", "success")
        // Force refresh of tags
        setRefreshTrigger(prev => prev + 1)
        return response.data
      } else {
        showToast(response.message || "Error al crear tag", "error")
        return null
      }
    } catch (error: any) {
      console.error('Failed to create tag:', error)
      showToast(error.message || "Error al crear tag", "error")
      return null
    } finally {
      setIsCreating(false)
    }
  }, [])

  // Load tags on mount
  useEffect(() => {
    loadTags()
  }, [loadTags])

  // Reload tags when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadTags()
    }
  }, [refreshTrigger, loadTags])

  return {
    tags,
    total,
    page,
    limit,
    isLoading,
    isCreating,
    loadTags,
    createNewTag,
    setPage,
    setLimit,
  }
}
