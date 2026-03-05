"use client";
import ProfileNameCall from "@/lib/api/profileNameCall";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
type JwtPayload = { userId?: string };

function getUserIdFromJwt(token: string): string | null {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const payload = JSON.parse(atob(payloadBase64)) as JwtPayload;
    return payload.userId ?? null;
  } catch {
    return null;
  }
}
export default function CallbackValidation() {
  const query = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const accessToken = query.get("access_token");
      const refreshToken = query.get("refresh_token");
      if (!accessToken || !refreshToken) {
        router.replace("/auth/signin");
        return;
      }
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const userId = getUserIdFromJwt(accessToken);
      if (!userId) {
        router.replace("/profile/create");
        return;
      }
      try {
        const username = await ProfileNameCall(userId, accessToken);
        if (username) {
          router.replace(`/profile/${username}`);
        } else {
          router.replace("/profile/create");
        }
      } catch (error) {
        router.replace("/profile/create");
      }
    };
    run();
  }, [query, router]);

  return <div>Please wait</div>;
}
