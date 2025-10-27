"use client"

import type React from "react"

export async function generateStaticParams() {
  // For static export, we need to provide possible IDs
  // Since this is a demo, we'll return some mock IDs
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' }
  ]
}

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { showToast } from "@/components/Toast"
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Edit3,
  Sparkles,
  Settings,
  Download,
  Share2,
  Eye,
  Zap,
  Wand2,
  Palette,
  RotateCcw,
  Save,
  Trash2
} from "lucide-react"
import type { Project } from "@/types/project"

export default function ProjectPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock project data - in real app this would come from API
  const mockProject: Project = {
    id: params.id as string,
    title: "Fotografías de Paisajes",
    description: "Colección de imágenes de paisajes naturales para procesamiento",
    imageCount: 24,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    thumbnailUrl: "/placeholder.jpg"
  }

  const mockImages = [
    "/placeholder.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg"
  ]

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated) {
      // Load project data
      setProject(mockProject)
    }
  }, [isAuthenticated, isLoading, router, params.id])

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const handleImageUpload = () => {
    showToast("Función de subida de imágenes próximamente", "info")
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const handleApplyPrompt = async () => {
    if (!prompt.trim()) {
      showToast("Por favor ingresa un prompt", "error")
      return
    }

    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      showToast("Prompt aplicado exitosamente", "success")
    }, 2000)
  }

  const handleSaveChanges = () => {
    showToast("Cambios guardados exitosamente", "success")
  }

  const handleDownload = () => {
    showToast("Descarga iniciada", "success")
  }

  const handleShare = () => {
    showToast("Enlace copiado al portapapeles", "success")
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Proyecto no encontrado</h2>
          <Button onClick={handleBackToDashboard}>Volver al Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBackToDashboard}
              variant="ghost"
              size="sm"
              className="hover:bg-secondary/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{project.title}</h1>
                <p className="text-sm text-muted-foreground">{project.imageCount} imágenes</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
            <Button onClick={handleSaveChanges} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Image Gallery */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Section */}
              <div className="glass-strong rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Imágenes del Proyecto</h2>
                  <Button onClick={handleImageUpload} size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Imagen
                  </Button>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mockImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border border-border/50 hover:border-primary/50"
                      onClick={() => handleImageClick(image)}
                    >
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Image Preview */}
              {selectedImage && (
                <div className="glass-strong rounded-2xl p-6 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Imagen Seleccionada</h3>
                    <Button
                      onClick={() => setSelectedImage(null)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="aspect-video rounded-xl overflow-hidden bg-secondary/20">
                    <img
                      src={selectedImage}
                      alt="Imagen seleccionada"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Tools and Prompt */}
            <div className="space-y-6">
              {/* Prompt Section */}
              <div className="glass-strong rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Editor de Prompt</h3>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe cómo quieres editar la imagen... (ej: 'Haz que el cielo sea más azul y agrega nubes dramáticas')"
                    className="w-full h-32 px-4 py-3 rounded-xl border border-border/50 bg-background/50 focus:border-primary/50 focus:outline-none resize-none text-sm"
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={handleApplyPrompt}
                      disabled={isProcessing || !selectedImage}
                      className="flex-1"
                      size="sm"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Aplicar Prompt
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setPrompt("")}
                      variant="outline"
                      size="sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => showToast("Función próximamente", "info")}
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Palette className="w-4 h-4 mr-3" />
                    Ajustes de Color
                  </Button>
                  <Button
                    onClick={() => showToast("Función próximamente", "info")}
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-3" />
                    Recortar Imagen
                  </Button>
                  <Button
                    onClick={() => showToast("Función próximamente", "info")}
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4 mr-3" />
                    Efectos IA
                  </Button>
                </div>
              </div>

              {/* Project Info */}
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Información del Proyecto</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creado:</span>
                    <span className="text-foreground">
                      {new Date(project.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última modificación:</span>
                    <span className="text-foreground">
                      {new Date(project.updatedAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Imágenes:</span>
                    <span className="text-foreground">{project.imageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-success/10 text-success text-xs">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      Activo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}