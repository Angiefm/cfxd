"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, X, ChevronLeft, ChevronRight, ImageIcon, Loader2 } from "lucide-react"
import { GalleryService, type ImageData, type GalleryResponse } from "@/services/galleryService"

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const GALLERY_ITEMS_PER_PAGE = 12

  useEffect(() => {
    fetchGalleryImages(currentPage)
  }, [currentPage])

  const fetchGalleryImages = async (page: number) => {
    try {
      setLoading(true)
      setError(null)

      const data: GalleryResponse = await GalleryService.getPublicImages({
        page,
        limit: GALLERY_ITEMS_PER_PAGE
      })

      setGalleryImages(data.data.data)
      setTotal(data.data.total)
      setTotalPages(Math.ceil(data.data.total / GALLERY_ITEMS_PER_PAGE))
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setLoading(false)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const openLightbox = (image: ImageData) => {
    setSelectedImage(image)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'unset'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-gradient-to-r from-[#eddcf8] to-[#cd98e8] shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center purple-glow">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PixPro
            </h1>
          </Link>

          <Link 
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gallery-hero pt-20">
        <div className="gallery-hero-content animate-fade-in-up">
          <h2 className="gallery-hero-title">
            Galería de Arte IA
          </h2>
          <p className="gallery-hero-subtitle">
            Explora una colección única de imágenes creadas y transformadas por inteligencia artificial
          </p>
          
          {/* Stats */}
          <div className="stats-container">
            <div className="stat-item animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="stat-number">{total}</div>
              <div className="stat-label">Imágenes</div>
            </div>
            <div className="stat-item animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="stat-number">{totalPages}</div>
              <div className="stat-label">Páginas</div>
            </div>
            <div className="stat-item animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <div className="stat-number">
                <ImageIcon className="w-8 h-8 inline-block" />
              </div>
              <div className="stat-label">IA Powered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        {/* Efectos de fondo flotantes */}
        <div className="gallery-background-effects">
          <div className="floating-orb floating-orb-1" />
          <div className="floating-orb floating-orb-2" />
          <div className="floating-orb floating-orb-3" />
        </div>

        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p className="loading-text">Cargando obras maestras...</p>
            </div>
          ) : error ? (
            <div className="loading-container">
              <p className="text-destructive text-lg">{error}</p>
            </div>
          ) : (
            <>
              {/* Gallery Grid */}
              <div className="gallery-grid">
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="gallery-card"
                    style={{ animationDelay: `${index * 0.08}s` }}
                    onClick={() => openLightbox(image)}
                  >
                    <div className="gallery-card-wrapper">
                      <div className="gallery-card-image-container">
                        <Image
                          src={image.url}
                          alt={image.file_name}
                          fill
                          className="gallery-card-image"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="gallery-card-overlay">
                          <h3 className="gallery-card-title">{image.file_name}</h3>
                          <p className="gallery-card-info">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1} 
                    className="pagination-button"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Anterior</span>
                  </button>

                  <div className="pagination-info">
                    Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                  </div>

                  <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages} 
                    className="pagination-button"
                    aria-label="Página siguiente"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="lightbox-close-button"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-wrapper">
              <Image
                src={selectedImage.url}
                alt={selectedImage.file_name}
                width={1200}
                height={800}
                className="max-w-full max-h-[70vh] object-contain"
                priority
              />
            </div>

            <div className="lightbox-info">
              <h3 className="lightbox-title">{selectedImage.file_name}</h3>
              <p className="lightbox-meta">
                Tamaño: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {selectedImage.tags.length > 0 && (
                <div className="lightbox-tags">
                  {selectedImage.tags.map((tag, idx) => (
                    <span key={idx} className="lightbox-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}