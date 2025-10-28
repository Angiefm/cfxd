"use client"

import type React from "react"
import { Folder, Image, Calendar } from "lucide-react"
import type { Project } from "@/services/projectService"

interface ProjectCardProps {
  project: Project
  onClick?: (project: Project) => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(project)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div 
      className="glass-strong rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group border border-border/50 hover:border-primary/30"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:purple-glow transition-shadow">
          <Folder className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Image className="w-4 h-4" />
          <span>0</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {project.name}
        </h3>
        
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <Calendar className="w-3 h-3" />
          <span>Creado {formatDate(project.createdAt)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Sin imágenes
          </span>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        </div>
      </div>
    </div>
  )
}