import { apiClient } from '@/lib/api'

export interface ImageData {
  id: string
  file_name: string
  url: string
  signed_url: string
  mime_type: string
  size: number
  user_id: string
  project_id: string | null
  tags: string[]
}

export interface GalleryResponse {
  status: string
  message: string | null
  data: {
    total: number
    page: number
    limit: number
    data: ImageData[]
  }
}

export class GalleryService {
  /**
   * Obtener imágenes públicas para la galería
   */
  static async getPublicImages(params?: {
    page?: number
    limit?: number
  }): Promise<GalleryResponse> {
    const queryParams = new URLSearchParams()

    if (params?.page) {
      queryParams.append('page', params.page.toString())
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString())
    }

    const queryString = queryParams.toString()
    const url = `/api/images/public${queryString ? `?${queryString}` : ''}`

    return await apiClient.get(url)
  }
}