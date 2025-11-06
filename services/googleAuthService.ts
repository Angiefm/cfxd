import type { LoginResponse, GoogleLoginResponse } from "@/types/auth";
import { apiClient } from "@/lib/api";

export function initializeGoogleOneTap(callback: (credential: string) => void) {
  if (typeof window === "undefined") return;

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn("Google Client ID missing");
    return;
  }

  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;

  script.onload = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => {
          callback(response.credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  };

  document.body.appendChild(script);
}

export function showGoogleOneTap() {
  if (typeof window === "undefined") return;
  if (!window.google) return;

  window.google.accounts.id.prompt();
}

export function renderGoogleButton(
  elementId: string,
  callback: (credential: string) => void
) {
  if (typeof window === "undefined") return;
  if (!window.google) return;

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn("Google Client ID missing");
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: any) => {
      callback(response.credential);
    },
  });

  window.google.accounts.id.renderButton(document.getElementById(elementId)!, {
    theme: "outline",
    size: "large",
    type: "standard",
    text: "continue_with",
    width: 400,
  });
}

// Send token to backend
export async function loginWithGoogleToken(
  credential: string
): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<GoogleLoginResponse>(
      "/api/auth/google/token",
      {
        credential,
        provider: "google",
      }
    );

    const transformedResponse: LoginResponse = {
      status: "success",
      message: "Login exitoso con Google",
      user: response.user,
      token: {
        access_token: response.access_token,
      },
    };

    return transformedResponse;
  } catch (error: any) {
    console.error("Google token error:", error);
    throw new Error(error.message || "Google auth failed");
  }
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}
