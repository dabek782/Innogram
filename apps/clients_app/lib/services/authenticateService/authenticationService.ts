// lib/services/auth.service.ts
import {
  AuthenticateCallResponse,
  AuthenticateCallResult,
} from "../../types/types";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_URL;

class AuthService {
  private getAuthUrl(): string {
    if (!AUTH_URL) throw new Error("Missing NEXT_PUBLIC_AUTH_MICROSERVICE_URL");
    return AUTH_URL;
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  async authenticate(
    email: string,
    password: string,
  ): Promise<AuthenticateCallResult> {
    const response = await fetch(`${this.getAuthUrl()}/auth/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`${response.status} something went wrong with auth`);
    }

    const data = (await response.json()) as AuthenticateCallResponse;

    return {
      userId: data.account.userId,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  async refresh(): Promise<string | null> {
    const token = this.getRefreshToken();
    if (!token) return null;

    const res = await fetch(`${this.getAuthUrl()}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token }),
    });

    if (!res.ok) {
      this.clearTokens();
      return null;
    }

    const data = await res.json();
    if (!data?.accessToken) return null;

    this.setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  }
}

export const authService = new AuthService();
