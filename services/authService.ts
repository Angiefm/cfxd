import type {
  RegisterCredentials,
  LoginCredentials,
  LoginResponse,
} from "@/types/auth";
import { apiClient } from "@/lib/api";

export async function register(
  credentials: RegisterCredentials
): Promise<{ success: boolean; message: string }> {
  return await apiClient.post("/api/auth/register", credentials);
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  return await apiClient.post("/api/auth/login", credentials);
}

export async function logout(): Promise<{ success: boolean }> {
  return await apiClient.post("/api/auth/logout");
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    await apiClient.post("/api/auth/validate", { token });
    return true;
  } catch {
    return false;
  }
}
