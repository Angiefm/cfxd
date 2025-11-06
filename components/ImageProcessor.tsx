"use client";

import { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';

export function ImageProcessor() {
  const [imageId, setImageId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const { isAuthenticated } = useAuth();

  // Obtener token del localStorage (mismo lugar donde se guarda en useAuth)
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const { isConnected, processedImages, errors, clearProcessedImages, clearErrors } = useWebSocket(token);

  const handleProcessImage = async () => {
    if (!imageId || !prompt) {
      alert('Por favor completa el Image ID y el Prompt');
      return;
    }

    try {
      setProcessing(true);

      const port = process.env.NEXT_PUBLIC_API_PORT;
      const fullUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!port || !fullUrl) {
        throw new Error('NEXT_PUBLIC_API_URL y NEXT_PUBLIC_API_PORT deben estar definidos');
      }

      const isBrowser = typeof window !== 'undefined';
      let backendUrl: string;

      if (isBrowser) {
        const hostname = window.location.hostname;
        const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

        if (isIp) {
          backendUrl = `http://${hostname}:${port}`;
        } else {
          backendUrl = fullUrl;
        }
      } else {
        backendUrl = `http://localhost:${port}`;
      }

      const response = await fetch(`${backendUrl}/api/images/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_id: imageId,
          prompt: prompt,
          tags: tags,
        }),
      });

      const result = await response.json();

      if (result.code === 202) {
        console.log('Image queued for processing');
        // El WebSocket notificará cuando termine
      } else {
        throw new Error(result.message || 'Error processing image');
      }
    } catch (error: unknown) {
      console.error('Error processing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert('Error al procesar la imagen: ' + errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4">
        <p>Por favor inicia sesión para usar el procesador de imágenes.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <label className="font-semibold">Estado de Conexión:</label>
        {isConnected ? (
          <span className="text-green-600">● Conectado</span>
        ) : (
          <span className="text-red-600">● Desconectado</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Image ID</label>
        <input
          type="text"
          placeholder="Image ID"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Prompt</label>
        <input
          type="text"
          placeholder="Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Tags (separados por comas)</label>
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags.join(', ')}
          onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()).filter(t => t))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button 
        onClick={handleProcessImage} 
        disabled={processing || !isConnected}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {processing ? 'Procesando...' : 'Procesar Imagen'}
      </button>

      {processedImages.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Imágenes Procesadas:</h3>
            <button
              onClick={clearProcessedImages}
              className="text-sm text-blue-600 hover:underline"
            >
              Limpiar
            </button>
          </div>
          {processedImages.map((img, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <img 
                src={img.url} 
                alt={img.file_name} 
                className="max-w-xs rounded-md mb-2" 
              />
              <p className="text-sm"><strong>ID:</strong> {img.id}</p>
              <p className="text-sm"><strong>Archivo:</strong> {img.file_name}</p>
              <p className="text-sm"><strong>Tags:</strong> {img.tags?.join(', ') || 'N/A'}</p>
              {img.gemini_analysis?.description && (
                <p className="text-sm mt-2"><strong>Descripción:</strong> {img.gemini_analysis.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-red-600">Errores:</h3>
            <button
              onClick={clearErrors}
              className="text-sm text-blue-600 hover:underline"
            >
              Limpiar
            </button>
          </div>
          {errors.map((error, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              <p><strong>Image ID:</strong> {error.image_id}</p>
              <p><strong>Error:</strong> {error.error}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

