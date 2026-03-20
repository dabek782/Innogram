// refreshToken.ts
"use client";
import { authService } from "./authenticationService";

export default async function refreshToken(): Promise<string | null> {
  return authService.refresh();
}
