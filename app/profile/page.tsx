"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { showToast } from "@/components/Toast"
import { ProfileService } from "@/lib/services/profileService"
import { Camera, ArrowLeft, Sparkles } from "lucide-react"
import type { ProfileData, UpdateProfileData } from "@/lib/services/profileService"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    email: "",
    phone: ""
  })
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const loadProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true)
      console.log('[ProfilePage] Iniciando carga de perfil...')
      const profileData = await ProfileService.getProfile()
      console.log('[ProfilePage] Perfil cargado:', profileData)
      
      setProfile(profileData)
      setFormData({
        name: profileData.name || "",
        displayName: profileData.displayName || "",
        email: profileData.email || "",
        phone: profileData.phone || ""
      })
      setAvatarPreview(profileData.avatarUrl || profileData.avatar_url || "")
      setHasLoadedOnce(true)
    } catch (error: any) {
      console.error('[ProfilePage] Error al cargar perfil:', error)
      showToast(error.message || "Error al cargar perfil", "error")
      setHasLoadedOnce(true)
    } finally {
      setIsLoadingProfile(false)
      console.log('[ProfilePage] Carga de perfil finalizada')
    }
  }, [router])

  useEffect(() => {
    console.log('[ProfilePage] useEffect ejecutado:', {
      isLoading,
      isAuthenticated,
      hasProfile: !!profile,
      isLoadingProfile,
      hasLoadedOnce
    })

    if (isLoading) {
      console.log('[ProfilePage] Esperando autenticación...')
      return
    }

    if (!isAuthenticated) {
      console.log('[ProfilePage] No autenticado, redirigiendo a login')
      router.push("/login")
      return
    }

    if (!hasLoadedOnce && !isLoadingProfile) {
      console.log('[ProfilePage] Cargando perfil...')
      loadProfile()
    }
  }, [isLoading, isAuthenticated, hasLoadedOnce, isLoadingProfile, router, loadProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if (!validTypes.includes(file.type)) {
      showToast("Solo se permiten imágenes JPG, PNG o WEBP", "error")
      return
    }

    // aqui valido tamaño max 2MB
    if (file.size > 2 * 1024 * 1024) {
      showToast("La imagen no debe superar 2MB", "error")
      return
    }

    setAvatarFile(file)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      showToast("El nombre es obligatorio", "error")
      return false
    }

    if (!formData.displayName.trim()) {
      showToast("El nombre de usuario es obligatorio", "error")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showToast("Email inválido", "error")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSaving(true)

    try {
      const updates: UpdateProfileData = {
        name: formData.name,
        displayName: formData.displayName,
        phone: formData.phone || undefined
      }

      const emailChanged = formData.email !== profile?.email
      if (emailChanged) {
        updates.email = formData.email
      }

      const updatedProfile = await ProfileService.updateProfileWithAvatar(
        updates,
        avatarFile || undefined
      )

      if (emailChanged) {
        showToast(
          "Perfil actualizado. Revisa tu email para verificar el cambio de correo.",
          "success"
        )
      } else {
        showToast("¡Perfil actualizado con éxito!", "success")
      }

      setProfile(updatedProfile)
      setAvatarFile(null)
      
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        localStorage.setItem("user", JSON.stringify({
          ...userData,
          name: updatedProfile.name,
          email: updatedProfile.email
        }))
      }
    } catch (error: any) {
      showToast(error.message || "Error al actualizar perfil", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* header */}
      <header className="border-b border-border/50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PixPro
            </h1>
          </div>
          <Button onClick={handleBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </header>

      {/* main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="animate-fade-in-up">
          {/* title Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Editar Perfil
            </h1>
            <p className="text-muted-foreground">
              Actualiza tu información personal y configuración de cuenta
            </p>
          </div>

          {/* form Card */}
          <div className="glass-strong rounded-2xl p-8">
            {/* avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-3xl font-bold">
                      {formData.name.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full cursor-pointer shadow-lg transition-all duration-200 hover:scale-110 purple-glow"
                >
                  <Camera size={20} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                JPG, PNG o WEBP. Máx 2MB
              </p>
            </div>

            {/* form Fields */}
            <div className="space-y-6">
              <Input
                label="Nombre completo"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
                required
              />

              <Input
                label="Nombre de usuario"
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Tu nombre de usuario"
                required
              />

              <div>
                <Input
                  label="Correo electrónico"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Si cambias tu email, recibirás un correo de verificación
                </p>
              </div>

              <Input
                label="Teléfono (opcional)"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+52 123 456 7890"
              />
            </div>

            {/* submit Button */}
            <div className="mt-8">
              <Button
                onClick={handleSubmit}
                isLoading={isSaving}
                disabled={isSaving}
                className="w-full"
                size="lg"
              >
                {isSaving ? "Guardando cambios..." : "Guardar cambios"}
              </Button>
            </div>
          </div>

          {/* info Card */}
          <div className="mt-8 glass-strong rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Información de la cuenta
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Cuenta creada:</span>
                <span className="text-foreground">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString('es-MX')
                    : "N/A"
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Última actualización:</span>
                <span className="text-foreground">
                  {profile?.updated_at 
                    ? new Date(profile.updated_at).toLocaleDateString('es-MX')
                    : "N/A"
                  }
                </span>
              </div>
              
             { /* aqui comento porque era una prueba para ver el id del user jsjs
              
              <div className="flex justify-between">
                <span>ID de usuario:</span>
                <span className="text-foreground font-mono text-xs">
                  {profile?.id || "N/A"}
                </span>
              </div>

*/}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}