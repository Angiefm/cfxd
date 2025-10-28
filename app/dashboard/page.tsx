"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useProject } from "@/hooks/useProject"
import { Button } from "@/components/Button"
import { showToast } from "@/components/Toast"
import { ProjectCard } from "@/components/ProjectCard"
import { CreateProjectModal } from "@/components/CreateProjectModal"
import { LogOut, Sparkles, ImageIcon, Zap, Plus, FolderOpen, User } from "lucide-react"
import type { Project } from "@/services/projectService"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const { projects, isLoading: isProjectsLoading, createNewProject, isCreating } = useProject()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      
      try {
        await logout()
      } catch (backendError) {
        console.log("Backend logout failed, but continuing with local logout")
      }
      
      showToast("Sesión cerrada correctamente", "success")
      router.push("/login")
    } catch (err: any) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      showToast("Sesión cerrada localmente", "success")
      router.push("/login")
    }
  }

  const handleProjectClick = (project: Project) => {
    router.push(`/project/${project.id}`)
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleCreateProject = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateProjectSubmit = async (name: string, description: string) => {
    await createNewProject({ name, description })
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PixPro
            </h1>
          </div>
          
          {/* botones de navegacion */}
          <div className="flex items-center gap-3">
            <Button onClick={handleProfileClick} variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="animate-fade-in-up">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Bienvenido de vuelta, {user?.name || 'Usuario'}!
                </h1>
                <p className="text-gray-600">
                  Tienes {projects.length} proyecto{projects.length !== 1 ? 's' : ''} en tu cuenta
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white rounded-full p-3 shadow-sm">
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
                Mis Proyectos
              </h2>
              <Button
                onClick={handleCreateProject}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={handleProjectClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes proyectos aún
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  Crea tu primer proyecto para comenzar a procesar imágenes
                </p>
                <Button 
                  onClick={() => showToast("Función de crear proyecto próximamente", "info")}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Proyecto
                </Button>
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Herramientas Disponibles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Procesar Imágenes
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Optimiza y procesa tus imágenes con herramientas avanzadas
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => showToast("Función próximamente disponible", "info")}
                  className="w-full"
                >
                  Comenzar
                </Button>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Optimización Rápida
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Reduce el tamaño de tus imágenes sin perder calidad
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => showToast("Función próximamente disponible", "info")}
                  className="w-full"
                >
                  Optimizar
                </Button>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Efectos IA
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Aplica efectos inteligentes usando inteligencia artificial
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => showToast("Función próximamente disponible", "info")}
                  className="w-full"
                >
                  Explorar
                </Button>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="mt-12 glass-strong rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-4">Información de la Cuenta</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">Nombre:</span>
                <span>{user?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">Email:</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">Estado:</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Activo
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProjectSubmit}
        isCreating={isCreating}
      />
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  return (
    <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer group">
      <div
        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:purple-glow transition-shadow`}
      >
        <div className="text-primary-foreground">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
