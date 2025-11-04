"use client"

import type React from "react"
import { useRef } from "react"
import { Upload } from "lucide-react"
import { useImageUpload } from "@/hooks/useImageUpload"

interface ImageUploadProps {
  projectId: string
  onUploadSuccess?: () => void
}

export function ImageUpload({ projectId, onUploadSuccess }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadFiles, isUploading } = useImageUpload()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    await uploadFiles(files, projectId)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Trigger callback to refresh gallery
    onUploadSuccess?.()
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={handleClick}
        disabled={isUploading}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Subir Imagen
          </>
        )}
      </button>
    </>
  )
}