"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#bba6df] via-[#d2c7eb] to-[#bba6df] border-t border-primary/20 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div
        className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PixPro
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Procesamiento inteligente de imágenes con IA. Transforma, optimiza y crea contenido visual increíble.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-footer"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-footer"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                </svg>
              </a>
              <a
                href="mailto:contacto@pixpro.com"
                className="social-icon-footer"
                aria-label="Email"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-3 text-lg">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#">Términos</Link></li>
              <li><Link href="#">Privacidad</Link></li>
              <li><Link href="#">Centro de Ayuda</Link></li>
              <li><Link href="#">Documentación</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center">
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © {new Date().getFullYear()} PixPro. Todos los derechos reservados.
            </p>
            <p className="text-sm text-muted-foreground italic mt-2">
              Una app hecha con 💜
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <Link href="#">Términos</Link>
              <Link href="#">Privacidad</Link>
              <Link href="#">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
