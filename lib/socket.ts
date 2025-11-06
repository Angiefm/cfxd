import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

function getBackendUrl(): string {
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const fullUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!port || !fullUrl) {
    throw new Error('NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_PORT must be defined');
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    if (isIp) {
      return `http://${hostname}:${port}`;
    } else {
      return fullUrl;
    }
  } else {
    return `http://localhost:${port}`;
  }
}

export const socketClient = {
  connect: () => {
    if (socketInstance?.connected) {
      console.log('Socket already connected');
      return;
    }

    if (typeof window === 'undefined') {
      console.log('Socket client only works in browser environment');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('No token available for WebSocket connection');
      return;
    }

    try {
      const backendUrl = getBackendUrl();
      socketInstance = io(backendUrl, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected');
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  },
  disconnect: () => {
    if (socketInstance) {
      socketInstance.close();
      socketInstance = null;
      console.log('Socket disconnected');
    }
  },
  getSocket: (): Socket | null => {
    return socketInstance;
  },
};