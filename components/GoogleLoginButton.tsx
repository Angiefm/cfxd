"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/components/Toast";
import { Loader2 } from "lucide-react";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

export function GoogleLoginButton({
  onSuccess,
  onError,
  text = "continue_with",
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        setIsScriptLoaded(true);
        setTimeout(initializeGoogleButton, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsScriptLoaded(true);
        setTimeout(initializeGoogleButton, 100);
      };
      script.onerror = () => {
        console.error("Google script load failed");
        showToast("Failed to load Google service", "error");
      };

      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  useEffect(() => {
    if (isScriptLoaded && buttonRef.current) {
      initializeGoogleButton();
    }
  }, [isScriptLoaded, buttonRef.current]);

  const initializeGoogleButton = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.warn("Google Client ID missing");
      return;
    }

    if (!window.google || !buttonRef.current) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        type: "standard",
        text: text,
        width: buttonRef.current.offsetWidth || 400,
        logo_alignment: "left",
      });
    } catch (error) {
      console.error("Google init failed:", error);
    }
  };

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true);
    try {
      await loginWithGoogle(response.credential);
      showToast("Login successful!", "success");

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      showToast(error.message || "Google login failed", "error");

      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isScriptLoaded) {
    return (
      <div className="w-full h-[44px] rounded-lg border border-input bg-background flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return (
      <div className="w-full p-4 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10">
        <p className="text-xs text-muted-foreground text-center">
          Google Sign-In not configured
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}
      <div ref={buttonRef} className="w-full" />
    </div>
  );
}
