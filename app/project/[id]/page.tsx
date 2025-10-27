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

function ProjectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vista del Proyecto</h1>
          <p className="text-muted-foreground">Esta página requiere configuración adicional para funcionar con static export.</p>
        </div>
      </div>
    </div>
  )
}

export default ProjectPage