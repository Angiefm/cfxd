"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useUserGallery, type GalleryFilters } from "@/hooks/useUserGallery"
import { useProject } from "@/hooks/useProject"
import { Button } from "@/components/Button"
import { showToast } from "@/components/Toast"
import {
  ArrowLeft,
  Filter,
  Search,
  Calendar,
  Tag,
  Download,
  Eye,
  Grid,
  List,
  ChevronDown,
  X
} from "lucide-react"

export default function GalleryPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const { projects } = useProject()
  const {
    images,
    isLoading,
    error,
    total,
    page,
    limit,
    filters,
    updateFilters,
    loadMore,
    hasMore
  } = useUserGallery()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isAuthLoading, router])

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleFilterChange = (newFilters: Partial<GalleryFilters>) => {
    updateFilters(newFilters)
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      const newTags = [...selectedTags, tagInput.trim()]
      setSelectedTags(newTags)
      handleFilterChange({ tags: newTags })
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove)
    setSelectedTags(newTags)
    handleFilterChange({ tags: newTags })
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTagAdd()
    }
  }

  const handleSearch = () => {
    // For now, we'll implement basic filename search
    // In a real implementation, you might want to search in tags, filename, etc.
    handleFilterChange({ page: 1 }) // Reset to first page when searching
  }

  const handleClearFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
    updateFilters({
      project_id: undefined,
      tags: undefined,
      created_from: undefined,
      created_to: undefined,
      page: 1
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isAuthLoading || !isAuthenticated) {
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
          <div className="flex items-center gap-3">
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Grid className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mi Galería
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              variant="outline"
              size="sm"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Panel */}
        {showFilters && (
          <div className="glass-strong rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filtros</h3>
              <Button onClick={handleClearFilters} variant="outline" size="sm">
                Limpiar Filtros
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">Buscar</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre..."
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background/50 focus:border-primary/50 focus:outline-none text-sm"
                  />
                  <Button onClick={handleSearch} size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Project Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Proyecto</label>
                <select
                  value={filters.project_id || ''}
                  onChange={(e) => handleFilterChange({
                    project_id: e.target.value || undefined,
                    page: 1
                  })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 focus:border-primary/50 focus:outline-none text-sm"
                >
                  <option value="">Todos los proyectos</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium mb-2">Ordenar por</label>
                <select
                  value={filters.sort_by || 'created_at'}
                  onChange={(e) => handleFilterChange({ sort_by: e.target.value as any, page: 1 })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 focus:border-primary/50 focus:outline-none text-sm"
                >
                  <option value="created_at">Fecha de creación</option>
                  <option value="updated_at">Fecha de actualización</option>
                  <option value="file_name">Nombre del archivo</option>
                  <option value="size">Tamaño</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium mb-2">Orden</label>
                <select
                  value={filters.sort_order || 'desc'}
                  onChange={(e) => handleFilterChange({ sort_order: e.target.value as any, page: 1 })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 focus:border-primary/50 focus:outline-none text-sm"
                >
                  <option value="desc">Descendente</option>
                  <option value="asc">Ascendente</option>
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Etiquetas</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Agregar etiqueta..."
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background/50 focus:border-primary/50 focus:outline-none text-sm"
                />
                <Button onClick={handleTagAdd} size="sm">
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {total > 0 ? (
              <>Mostrando {images.length} de {total} imágenes</>
            ) : (
              <>No se encontraron imágenes</>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Página {page} • {limit} por página
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="glass-strong rounded-2xl p-6 mb-6 border border-destructive/20">
            <div className="text-center text-destructive">
              <p>{error}</p>
              <Button
                onClick={() => updateFilters({ page: 1 })}
                className="mt-4"
                variant="outline"
              >
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* Gallery Grid/List */}
        {images.length > 0 && (
          <div className={`mb-6 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-4'}`}>
            {images.map((image) => (
              <div
                key={image.id}
                className={`glass-strong rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 ${
                  viewMode === 'list' ? 'flex gap-4 p-4' : 'group cursor-pointer'
                }`}
              >
                <div className={`${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'} relative overflow-hidden`}>
                  <img
                    src={image.signed_url}
                    alt={image.file_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="secondary">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                  </div>
                </div>

                <div className={`${viewMode === 'list' ? 'flex-1' : 'p-3'}`}>
                  <h3 className="font-medium text-sm truncate mb-1">{image.file_name}</h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(image.created_at)}
                    </div>
                    <div>{formatFileSize(image.size)}</div>
                    {image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {image.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {image.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{image.tags.length - 3} más
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {viewMode === 'list' && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="text-center">
            <Button onClick={loadMore} variant="outline">
              Cargar más imágenes
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando imágenes...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && images.length === 0 && (
          <div className="text-center py-16">
            <Grid className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No se encontraron imágenes
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              No tienes imágenes que coincidan con los filtros aplicados.
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Limpiar filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
