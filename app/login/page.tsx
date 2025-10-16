"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/AuthLayout";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { showToast } from "@/components/Toast";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState("");

  const { values, errors, handleChange, handleBlur, validateForm } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validationRules: {
      email: (value) => {
        if (!value) return "El correo es obligatorio";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Formato de correo inválido";
        return "";
      },
      password: (value) => {
        if (!value) return "La contraseña es obligatoria";
        return "";
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await login(values.email, values.password);
      showToast("¡Bienvenido de nuevo!", "success");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
      showToast(err.message || "Error al iniciar sesión", "error");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-muted-foreground">Accede a tu cuenta de PixPro</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            placeholder="tu@email.com"
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-primary hover:text-accent transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Iniciar Sesión
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O continúa con
              </span>
            </div>
          </div>

          <GoogleLoginButton text="signin_with" />

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-primary hover:text-accent transition-colors font-medium"
            >
              Regístrate aquí
            </Link>
          </p>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-8 p-4 rounded-xl glass text-sm text-muted-foreground text-center">
          <p className="font-medium mb-1">Credenciales de prueba:</p>
          <p>user@example.com / Password1</p>
        </div>
      </div>
    </AuthLayout>
  );
}
