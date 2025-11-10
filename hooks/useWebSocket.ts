"use client";

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface ProcessedImageData {
  id: string;
  file_name: string;
  url: string;
  storage_path: string;
  mime_type: string;
  size: number;
  user_id: string;
  project_id: string | null;
  created_at: string;
  tags?: string[];
  original_image_id: string;
  gemini_analysis?: {
    description: string;
  };
}

interface ImageProcessedEvent {
  success: boolean;
  data: ProcessedImageData;
  timestamp: string;
}

interface ProcessingError {
  image_id: string;
  error: string;
}

interface ImageProcessingErrorEvent {
  success: false;
  error: ProcessingError;
  timestamp: string;
}

export function useWebSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImageData[]>([]);
  const [errors, setErrors] = useState<ProcessingError[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      console.warn('No token provided for WebSocket connection');
      return;
    }

    const port = process.env.NEXT_PUBLIC_API_PORT;
    const fullUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!port || !fullUrl) {
      console.error('NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_PORT must be defined');
      return;
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

    const newSocket = io(backendUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setSocket(newSocket);
      socketRef.current = newSocket;
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setSocket(null);
      socketRef.current = null;
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      setIsConnected(false);
    });

    newSocket.on('image:processed', (data: ImageProcessedEvent) => {
      console.log('Image processed:', data);
      if (data.success && data.data) {
        setProcessedImages((prev) => [...prev, data.data]);
      }
    });

    newSocket.on('image:processing_error', (data: ImageProcessingErrorEvent) => {
      console.error('Processing error:', data);
      if (data.error) {
        setErrors((prev) => [...prev, data.error]);
      }
    });

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [token]);

  return {
    socket,
    isConnected,
    processedImages,
    errors,
    clearProcessedImages: () => setProcessedImages([]),
    clearErrors: () => setErrors([]),
  };
}

