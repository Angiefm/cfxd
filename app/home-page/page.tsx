"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/Button"
import { Sparkles, ImageIcon, Zap, Wand2, Shield } from "lucide-react"

import imagen1 from "./image-header/imagen1.png";
import imagen2 from "./image-header/imagen2.jpg";
import imagen3 from "./image-header/imagen3.jpg";
import imagen4 from "./image-header/imagen4.jpg";
import imagen5 from "./image-header/imagen5.jpg";


export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = [imagen1, imagen2, imagen3, imagen4, imagen5];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  const handleCtaClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/register")
    }
  }

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features")
    featuresSection?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-gradient-to-r from-[#eddcf8] to-[#cd98e8] shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center purple-glow">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PixPro
            </h1>
          </div>

          {/* navegación central */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={scrollToTop}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={scrollToFeatures}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Características
            </button>
            <Link
              href="/gallery-page"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Galería
            </Link>
          </nav>

          {/* botones de auth */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${image.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(8px)",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#b8a9d9]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Procesamiento Inteligente de Imágenes con IA
          </h2>

          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transforma, optimiza y mejora tus imágenes con el poder de la inteligencia artificial.
            Rápido, elegante y seguro.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleCtaClick}
              size="lg"
              className="min-w-[220px] text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
              Comienza Ahora
            </Button>
            <Button
              onClick={scrollToFeatures}
              variant="outline"
              size="lg"
              className="min-w-[220px] text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
              Explora Características
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      <section
        id="features" 
        className="relative py-24 px-6 bg-gradient-to-br from-[#d8b4fe]/40 via-[#c084fc]/30 to-[#a855f7]/20 backdrop-blur-sm overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Herramientas Poderosas para tus Imágenes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todo lo que necesitas para procesar, optimizar y crear imágenes increíbles con inteligencia artificial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div 
              className="feature-card feature-card-blue group"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="feature-card-inner">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#a5d8ff] to-[#74c0fc] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 feature-icon-glow">
                  <ImageIcon className="w-8 h-8 text-[#1e293b]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Procesamiento Avanzado
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Optimiza y mejora imágenes automáticamente con algoritmos de IA de última generación
                </p>
              </div>
            </div>

            <div 
              className="feature-card feature-card-orange group"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="feature-card-inner">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ffe066] to-[#ffc078] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 feature-icon-glow">
                  <Zap className="w-8 h-8 text-[#1e293b]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Velocidad Increíble
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Resultados en segundos, no minutos. Procesamiento optimizado para máxima eficiencia
                </p>
              </div>
            </div>

            <div 
              className="feature-card feature-card-pink group"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="feature-card-inner">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ffc9dc] to-[#ff9cc5] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 feature-icon-glow">
                  <Wand2 className="w-8 h-8 text-[#1e293b]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Efectos IA
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Aplica filtros inteligentes y transformaciones avanzadas con un solo clic
                </p>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl w-full">
                <div 
                  className="feature-card feature-card-purple group"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="feature-card-inner">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#d8b4fe] to-[#c084fc] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 feature-icon-glow">
                      <Sparkles className="w-8 h-8 text-[#1e293b]" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Generación con IA
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Crea imágenes únicas desde un prompt de texto usando inteligencia artificial
                    </p>
                  </div>
                </div>

                <div 
                  className="feature-card feature-card-green group"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="feature-card-inner">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#96f2d7] to-[#63e6be] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 feature-icon-glow">
                      <Shield className="w-8 h-8 text-[#1e293b]" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Seguro y Privado
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Tus imágenes están protegidas con encriptación de nivel empresarial
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* titulo principal */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            ¿List@ para transformar tus Imágenes?
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya procesan sus imágenes con IA
          </p>

          <Button
            onClick={handleCtaClick}
            size="lg"
            className="relative text-lg px-12 py-6 font-semibold text-white bg-gradient-to-r from-[#b388ff] via-[#9c4dcc] to-[#7e57c2] rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.3)] border border-black/20 hover:border-black/40 hover:shadow-[0_0_35px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300"
          >
            Comenzar Ahora
          </Button>
        </div>
      </section>
    </div>
  )
}