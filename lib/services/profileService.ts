import { supabase } from '@/lib/supabaseClient'

export interface ProfileData {
  id: string
  name: string
  displayName: string
  email: string
  phone?: string
  avatar_url?: string
  avatarUrl?: string
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  name?: string
  displayName?: string
  email?: string
  phone?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export class ProfileService {
  /**
   * aqui obtener perfil del usuario actual
   */
  static async getProfile(): Promise<ProfileData> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('No hay sesión activa')
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener perfil')
    }

    const profile = data.user
    profile.avatarUrl = profile.avatar_url || profile.avatarUrl
    
    return profile
  }

  /**
   * aqui actualizar perfil del usuario
   */
  static async updateProfile(updates: UpdateProfileData): Promise<ProfileData> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('No hay sesión activa')
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar perfil')
    }

    const profile = data.user
    profile.avatarUrl = profile.avatar_url || profile.avatarUrl
    
    return profile
  }

  /**
   * subir avatar a traves del backend
   */
  static async uploadAvatar(file: File): Promise<string> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('No hay sesión activa')
    }

    const formData = new FormData()
    formData.append('avatar', file)

    console.log('[ProfileService] Subiendo avatar al backend:', { 
      fileName: file.name, 
      fileSize: file.size 
    })

    const response = await fetch(`${API_URL}/users/profile/avatar/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[ProfileService] Error del servidor:', data)
      throw new Error(data.message || 'Error al subir la imagen')
    }

    const avatarUrl = data.avatarUrl || data.url || data.publicUrl

    if (!avatarUrl) {
      throw new Error('El servidor no devolvió una URL válida')
    }

    console.log('[ProfileService] Avatar subido exitosamente:', avatarUrl)

    return avatarUrl
  }

  /**
   * actualizo avatar en el back
   */
  static async updateAvatar(avatarUrl: string): Promise<ProfileData> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('No hay sesión activa')
    }

    const response = await fetch(`${API_URL}/users/profile/avatar`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ avatarUrl })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar avatar')
    }

    const profile = data.user
    profile.avatarUrl = profile.avatar_url || profile.avatarUrl
    
    return profile
  }

  /**
   * actualizo perfil con avatar todo en uno
   */
  static async updateProfileWithAvatar(
    updates: UpdateProfileData,
    avatarFile?: File
  ): Promise<ProfileData> {
    let avatarUrl: string | undefined

    if (avatarFile) {
      avatarUrl = await this.uploadAvatar(avatarFile)
      
      await this.updateAvatar(avatarUrl)
    }

    const updatedProfile = await this.updateProfile(updates)

    if (avatarUrl) {
      updatedProfile.avatarUrl = avatarUrl
      updatedProfile.avatar_url = avatarUrl
    }

    return updatedProfile
  }
}