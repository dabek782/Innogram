"use client";
type response = {
  refreshToken?: string;
  accessToken: string;
};
export default async function refreshToken(): Promise<String | null> {
  const API_URL = process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_URL;
  const token = localStorage.getItem("refreshToken");
  if (!token) return null;
  if (!API_URL) throw new Error("Missing NEXT_PUBLIC_AUTH_MICROSERVICE_URL");
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: token }),
  });
  if (!res.ok) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
  const data: response = await res.json();
  if (!data?.accessToken) return null;
  localStorage.setItem("accessToken", data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  return data.accessToken;
}
