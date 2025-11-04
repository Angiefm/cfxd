"use client"

import type React from "react"
import { useEffect } from "react"
import { useImageUpload } from "@/hooks/useImageUpload"
import type { ImageData } from "@/services/imageService"

interface ImageGalleryProps {
  projectId: string
  selectedImage: ImageData | null
  onImageSelect: (image: ImageData) => void
}

export function ImageGallery({ projectId, selectedImage, onImageSelect }: ImageGalleryProps) {
  const { images, loadImages, isLoading } = useImageUpload()

  useEffect(() => {
    loadImages(projectId)
  }, [projectId, loadImages])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="aspect-square rounded-xl bg-secondary/20 animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.length > 0 ? (
        images.map((image) => (
          <div
            key={image.id}
            className={`aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border-2 ${
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
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No hay imágenes en este proyecto
        </div>
      )}
    </div>
  )
}