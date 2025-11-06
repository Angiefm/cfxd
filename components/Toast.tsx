"use client"

import { createContext, useState, useCallback, useEffect } from "react"
import { CheckCircle2, XCircle, X, Info } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      const id = Math.random().toString(36).substring(7)
      setToasts((prev) => [...prev, { id, message, type }])

      setTimeout(() => {
        removeToast(id)
      }, 5000)
    },
    [removeToast],
  )

  // Listen for custom events
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleShowToast = (e: Event) => {
        const customEvent = e as CustomEvent<{ message: string; type: ToastType }>
        showToast(customEvent.detail.message, customEvent.detail.type)
      }

      window.addEventListener("show-toast", handleShowToast as EventListener)

      return () => {
        window.removeEventListener("show-toast", handleShowToast as EventListener)
      }
    }
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              rounded-lg p-3 shadow-lg
              flex items-center gap-3 min-w-[280px] max-w-[400px]
              animate-fade-in-up
              ${
                toast.type === "success" 
                  ? "bg-green-50 border-2 border-green-500 text-green-900" 
                  : toast.type === "error"
                  ? "bg-red-50 border-2 border-red-500 text-red-900"
                  : "bg-blue-50 border-2 border-blue-500 text-blue-900"
              }
            `}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            ) : toast.type === "error" ? (
              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            )}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function showToast(message: string, type: ToastType) {
  // This is a helper function that will be called from components
  // The actual implementation is in the context
  const event = new CustomEvent("show-toast", { detail: { message, type } })
  window.dispatchEvent(event)
}

// Update Toaster to listen for custom events
export function ToasterWithEvents() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const handleShowToast = useCallback(
    (message: string, type: ToastType) => {
      const id = Math.random().toString(36).substring(7)
      setToasts((prev) => [...prev, { id, message, type }])

      setTimeout(() => {
        removeToast(id)
      }, 5000)
    },
    [removeToast],
  )

  // Listen for custom events
  if (typeof window !== "undefined") {
    window.addEventListener("show-toast", ((e: CustomEvent) => {
      handleShowToast(e.detail.message, e.detail.type)
    }) as EventListener)
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
            className={`
            rounded-lg p-3 shadow-lg
            flex items-center gap-3 min-w-[280px] max-w-[400px]
            animate-fade-in-up
            ${
              toast.type === "success" 
                ? "bg-green-50 border-2 border-green-500 text-green-900" 
                : toast.type === "error"
                ? "bg-red-50 border-2 border-red-500 text-red-900"
                : "bg-blue-50 border-2 border-blue-500 text-blue-900"
            }
          `}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : toast.type === "error" ? (
            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          )}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
