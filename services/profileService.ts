import { apiClient } from '@/lib/api'

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

export class ProfileService {
  /**
   * Obtener perfil del usuario actual
   */
  static async getProfile(): Promise<ProfileData> {
    const data = await apiClient.get<{ user: ProfileData }>('api/users/profile')

    const profile = data.user
    profile.avatarUrl = profile.avatar_url || profile.avatarUrl

    return profile
  }

  /**
   * Actualizar perfil del usuario
   */
  static async updateProfile(updates: UpdateProfileData): Promise<ProfileData> {
    const data = await apiClient.patch<{ user: ProfileData }>('api/users/profile', updates)

    const profile = data.user
    profile.avatarUrl = profile.avatar_url || profile.avatarUrl

    return profile
  }

  /**
   * Subir avatar a través del backend
   */
  static async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('avatar', file)

    console.log('[ProfileService] Subiendo avatar al backend:', {
      fileName: file.name,
      fileSize: file.size
    })

    const data = await apiClient.post<{
      avatarUrl?: string
      url?: string
      publicUrl?: string
    }>('api/users/profile/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const avatarUrl = data.avatarUrl || data.url || data.publicUrl

    if (!avatarUrl) {
      throw new Error('El servidor no devolvió una URL válida')
    }

    console.log('[ProfileService] Avatar subido exitosamente:', avatarUrl)

    return avatarUrl
  }

  /**
   * Actualizar avatar en el backend
   */
  static async updateAvatar(avatarUrl: string): Promise<ProfileData> {
    const data = await apiClient.patch<{ user: ProfileData }>('api/users/profile/avatar', { avatarUrl })

    const profile = data.user
    profile.avatarUrl = profile.avatar_url || profile.avatarUrl

    return profile
  }

  /**
   * Actualizar perfil con avatar todo en uno
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