export interface User {
  id: string;
  name: string;
  displayName: string;
  email: string;
  phone: string;
  avatar?: string;
  provider?: "email" | "google";
}

export interface RegisterCredentials {
  name: string;
  displayName: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface GoogleAuthCredentials {
  idToken: string;
  accessToken: string;
  provider: "google";
}

export interface LoginResponse {
  status: string;
  message: string;
  user: User;
  token: {
    access_token: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
}
