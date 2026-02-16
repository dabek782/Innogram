"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackValidation() {
  const query = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const accessToken = query.get("access_token");
    const refreshToken = query.get("refresh_token");
    if (!accessToken || !refreshToken) {
      router.replace("/auth/signin");
      return;
    }
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    router.replace("/");
  }, [query, router]);
  return <div>Please wait</div>;
}
