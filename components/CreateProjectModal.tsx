"use client"

import type React from "react"
import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject: (name: string, description: string) => Promise<void>
  isCreating: boolean
}

export function CreateProjectModal({ isOpen, onClose, onCreateProject, isCreating }: CreateProjectModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {}

    if (!name.trim()) {
      newErrors.name = "El nombre del proyecto es requerido"
    } else if (name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }

    if (description && description.length > 500) {
      newErrors.description = "La descripción no puede exceder 500 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onCreateProject(name.trim(), description.trim())
      setName("")
      setDescription("")
      setErrors({})
      onClose()
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleClose = () => {
    setName("")
    setDescription("")
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Crear Nuevo Proyecto</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Nombre del Proyecto *
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa el nombre del proyecto"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente el propósito del proyecto"
              className={`w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none resize-none ${
                errors.description ? "border-destructive" : ""
              }`}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {description.length}/500 caracteres
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Proyecto
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}