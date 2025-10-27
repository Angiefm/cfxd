"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { showToast } from "@/components/Toast"
import { ImageUpload } from "@/components/ImageUpload"
import { ImageGallery } from "@/components/ImageGallery"
import type { ImageData } from "@/services/imageService"

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' }
  ]
}

function ProjectPage() {
  const params = useParams()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const projectId = params.id as string

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login"
      return
    }
  }, [isAuthenticated, isLoading])

  const handleImageSelect = (image: ImageData) => {
    setSelectedImage(image)
  }

  const handleApplyPrompt = async () => {
    if (!prompt.trim()) {
      showToast("Por favor ingresa un prompt", "error")
      return
    }

    if (!selectedImage) {
      showToast("Selecciona una imagen primero", "error")
      return
    }

    setIsProcessing(true)
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Proyecto Demo</h1>
                <p className="text-sm text-muted-foreground">0 imágenes</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Compartir
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar
            </button>
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
                  <ImageUpload projectId={projectId} />
                </div>

                {/* Image Gallery */}
                <ImageGallery
                  projectId={projectId}
                  selectedImage={selectedImage}
                  onImageSelect={handleImageSelect}
                />
              </div>

              {/* Selected Image Preview */}
              <div className="glass-strong rounded-2xl p-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Imagen Seleccionada</h3>
                  <button className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="aspect-video rounded-xl overflow-hidden bg-secondary/20">
                  {selectedImage ? (
                    <img
                      src={selectedImage.signed_url || selectedImage.url}
                      alt={selectedImage.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Selecciona una imagen para ver la vista previa
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Tools and Prompt */}
            <div className="space-y-6">
              {/* Prompt Section */}
              <div className="glass-strong rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
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
                    <button
                      onClick={handleApplyPrompt}
                      disabled={isProcessing || !selectedImage}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Aplicar Prompt
                        </>
                      )}
                    </button>
                    <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    Ajustes de Color
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a4 4 0 01-8 0V5a2 2 0 012-2h4a2 2 0 012 2v12zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 008 0V5z" />
                    </svg>
                    Recortar Imagen
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Efectos IA
                  </button>
                </div>
              </div>

              {/* Project Info */}
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Información del Proyecto</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creado:</span>
                    <span className="text-foreground">15 ene 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última modificación:</span>
                    <span className="text-foreground">20 ene 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Imágenes:</span>
                    <span className="text-foreground">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
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

export default ProjectPage