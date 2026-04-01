"use client";
import { profileService } from "@/lib/services/ProfileServices/ProfileService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getUserIdFromJwt } from "./helperFunctions/helpers";

export default function Page() {
  const query = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const gettingTokensFromLocalStorage = async () => {
      let existingAcessToken, existingRefreshToken;
      existingAcessToken = localStorage.getItem("accessToken");
      existingRefreshToken = localStorage.getItem("refreshToken");
      if (existingAcessToken || existingRefreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("profileId");
      }
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
      const redirect = await profileService.resolveProfileRedirect(
        userId,
        accessToken,
      );
      const profileId = await profileService.getProfileIdUserId(
        accessToken,
        userId,
      );
      localStorage.setItem("profileId", profileId);
      router.replace(redirect);
    };
    gettingTokensFromLocalStorage();
  }, [query, router]);

  return <div>Please wait</div>;
}
