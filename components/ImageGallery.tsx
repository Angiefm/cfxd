"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useImageUpload } from "@/hooks/useImageUpload"
import type { ImageData } from "@/services/imageService"
import { processImage, listImages } from "@/services/imageService"
import { showToast } from "@/components/Toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ImageGalleryProps {
  projectId: string
  selectedImage: ImageData | null
  onImageSelect: (image: ImageData) => void
  onImageDelete?: (imageId: string) => void
  refreshTrigger?: number // Optional prop to trigger refresh
  onRefresh?: () => void // Callback to trigger refresh
  total?: number
  page?: number
  limit?: number
  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void
}

export function ImageGallery({ projectId, selectedImage, onImageSelect, onImageDelete, refreshTrigger, onRefresh, total = 0, page = 1, limit = 20, onPageChange, onLimitChange }: ImageGalleryProps) {
   const { images, loadImages, isLoading, isDeleting, deleteImageById } = useImageUpload()
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [selectedImageForPrompt, setSelectedImageForPrompt] = useState<ImageData | null>(null)
   const [prompt, setPrompt] = useState("")
   const [isProcessing, setIsProcessing] = useState(false)

   // Modal gallery state
   const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
   const [modalImages, setModalImages] = useState<ImageData[]>([])
   const [modalTotal, setModalTotal] = useState(0)
   const [modalPage, setModalPage] = useState(1)
   const [modalLimit, setModalLimit] = useState(20)
   const [isModalLoading, setIsModalLoading] = useState(false)

  useEffect(() => {
    loadImages(projectId)
  }, [projectId, loadImages, refreshTrigger])

  const handleApplyPrompt = (image: ImageData) => {
    setSelectedImageForPrompt(image)
    setPrompt("")
    setIsModalOpen(true)
  }

  const handleConfirmPrompt = async () => {
    if (!prompt.trim() || !selectedImageForPrompt) return

    setIsProcessing(true)
    try {
      await processImage(selectedImageForPrompt.id, prompt)
      showToast("Prompt aplicado exitosamente", "success")
      setIsModalOpen(false)
      setSelectedImageForPrompt(null)
      setPrompt("")
      // Trigger refresh
      if (onRefresh) {
        onRefresh()
      } else {
        loadImages(projectId)
      }
    } catch (error: any) {
      console.error('Failed to process image:', error)
      showToast(error.message || "Error al procesar la imagen", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  // Modal gallery functions
  const openGalleryModal = () => {
    setIsGalleryModalOpen(true)
    loadModalImages(1, modalLimit)
  }

  const loadModalImages = async (page: number, limit: number) => {
    setIsModalLoading(true)
    try {
      const response = await listImages({
        project_id: projectId,
        page,
        limit,
        sort_by: 'created_at',
        sort_order: 'desc'
      })
      setModalImages(response.data.data)
      setModalTotal(response.data.total)
      setModalPage(response.data.page)
      setModalLimit(response.data.limit)
    } catch (error) {
      console.error('Failed to load modal images:', error)
      showToast("Error al cargar imágenes", "error")
    } finally {
      setIsModalLoading(false)
    }
  }

  const handleModalPageChange = (newPage: number) => {
    setModalPage(newPage)
    loadModalImages(newPage, modalLimit)
  }

  const handleModalLimitChange = (newLimit: number) => {
    setModalLimit(newLimit)
    setModalPage(1)
    loadModalImages(1, newLimit)
  }

  const handleModalImageSelect = (image: ImageData) => {
    onImageSelect(image)
    setIsGalleryModalOpen(false)
  }

  const handleModalImageDelete = async (imageId: string) => {
    if (onImageDelete) {
      onImageDelete(imageId)
      // Refresh modal images
      loadModalImages(modalPage, modalLimit)
    } else {
      await deleteImageById(imageId)
      // Refresh modal images
      loadModalImages(modalPage, modalLimit)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 h-32 rounded-xl bg-secondary/20 animate-pulse"
            />
          ))}
        </div>
        <div className="flex justify-center">
          <div className="w-24 h-8 bg-secondary/20 animate-pulse rounded" />
        </div>
      </div>
    )
  }

  const handleDelete = async (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation() // Prevent triggering image selection
    if (onImageDelete) {
      onImageDelete(imageId)
    } else {
      await deleteImageById(imageId)
    }
  }

  return (
    <div className="space-y-4">
      {/* Horizontal row of images */}
      {images.length > 0 ? (
        <>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map((image) => (
              <div
                key={image.id}
                className={`flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border-2 relative group ${
                  selectedImage?.id === image.id
                    ? 'border-primary'
                    : 'border-border/50 hover:border-primary/50'
                }`}
                onClick={() => onImageSelect(image)}
              >
                <img
                  src={image.signed_url || image.url}
                  alt={image.file_name}
                  className="w-full h-full object-cover"
                />
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Apply Prompt button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleApplyPrompt(image)
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white p-1 rounded-full"
                    title="Aplicar Prompt"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(e, image.id)}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full disabled:opacity-50"
                    title="Eliminar imagen"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* "Ver más" button */}
          <div className="flex justify-center">
            <Button
              onClick={openGalleryModal}
              variant="outline"
              className="text-sm"
            >
              Ver más
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No hay imágenes en este proyecto
        </div>
      )}


      {/* Gallery Modal */}
      <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background border border-border/50 glass-strong">
          <DialogHeader>
            <DialogTitle>Galería de Imágenes</DialogTitle>
            <DialogDescription>
              Explora todas las imágenes del proyecto con paginación.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {isModalLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl bg-secondary/20 animate-pulse"
                  />
                ))}
              </div>
            ) : modalImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {modalImages.map((image) => (
                  <div
                    key={image.id}
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border-2 relative group ${
                      selectedImage?.id === image.id
                        ? 'border-primary'
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                    onClick={() => handleModalImageSelect(image)}
                  >
                    <img
                      src={image.signed_url || image.url}
                      alt={image.file_name}
                      className="w-full h-full object-cover"
                    />
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Apply Prompt button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApplyPrompt(image)
                        }}
                        className="bg-purple-500 hover:bg-purple-600 text-white p-1 rounded-full"
                        title="Aplicar Prompt"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={(e) => handleModalImageDelete(image.id)}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full disabled:opacity-50"
                        title="Eliminar imagen"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay imágenes disponibles
              </div>
            )}
          </div>

          {/* Modal Pagination Controls */}
          {modalTotal > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Mostrando {Math.min((modalPage - 1) * modalLimit + 1, modalTotal)} - {Math.min(modalPage * modalLimit, modalTotal)} de {modalTotal} imágenes
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Items per page selector */}
                <select
                  value={modalLimit}
                  onChange={(e) => handleModalLimitChange(parseInt(e.target.value))}
                  className="px-2 py-1 text-sm border border-border rounded bg-background"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>

                {/* Previous button */}
                <button
                  onClick={() => handleModalPageChange(modalPage - 1)}
                  disabled={modalPage <= 1}
                  className="px-3 py-1 text-sm border border-border rounded bg-background hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(modalTotal / modalLimit)) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(Math.ceil(modalTotal / modalLimit) - 4, modalPage - 2)) + i
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handleModalPageChange(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        pageNum === modalPage
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border bg-background hover:bg-secondary/50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {/* Next button */}
                <button
                  onClick={() => handleModalPageChange(modalPage + 1)}
                  disabled={modalPage >= Math.ceil(modalTotal / modalLimit)}
                  className="px-3 py-1 text-sm border border-border rounded bg-background hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Prompt Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Aplicar Prompt a la Imagen</DialogTitle>
            <DialogDescription>
              Ingresa el prompt para procesar la imagen seleccionada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Prompt
              </label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe cómo quieres editar la imagen..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPrompt}
              disabled={isProcessing || !prompt.trim()}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  Procesando...
                </>
              ) : (
                "Aplicar Prompt"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}