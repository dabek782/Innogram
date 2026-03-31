"use client";
import { profileService } from "@/lib/services/ProfileServices/ProfileService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getUserIdFromJwt } from "./helperFunctions/helpers";
import { JwtPayload } from "./helperFunctions/helpers";

export default function Page() {
  const query = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const gettingTokensToLocalStorage = async () => {
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
    };
    gettingTokensToLocalStorage();
  }, [query, router]);

  return <div>Please wait</div>;
}
