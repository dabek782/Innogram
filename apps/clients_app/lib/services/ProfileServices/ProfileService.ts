import { ProfileResult } from "@/lib/types/types";
import api from "../authenticateService/authFetch";
import { ProfileNameCallResponse } from "@/lib/types/types";
export class ProfileService {
  async ProfileNameCall(userId: string, token: string): Promise<string | null> {
    if (!userId || !token) {
      return null;
    }
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/profile/getusername/${userId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res?.data?.username) {
        throw new Error("something went wrong");
      }
      return res.data.username;
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404) {
        return null;
      }
      const data = error?.response?.data;
      throw new Error(
        `ProfileNameCall failed: ${status ?? "NO_STATUS"} ${JSON.stringify(data)}`,
      );
    }
  }

  async resolveProfileRedirect(userId: string, token: string): Promise<string> {
    const username = await this.ProfileNameCall(userId, token);
    if (!username) {
      return "/profile/create";
    }

    return `/profile/${username}`;
  }

  async profileSearch(query: string, token: string) {
    try {
      const res = await api.get<ProfileResult[]>(
        `/api/v3/profile/search?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async getProfilePath(profileId: string, token: string): Promise<string> {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/profile/get/username/profileId/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      return `/profile/${data.username}`;
    } catch {
      return "/";
    }
  }
  async ProfileUsernameById(
    profileId: string,
    token: string,
  ): Promise<string | null> {
    if (!profileId || !token) {
      return null;
    }
    try {
      const res = await api.get<ProfileNameCallResponse>(
        `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/profile/get/username/profileId/${profileId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res?.data.username) {
        throw new Error("something went wrong");
      }
      return res.data.username;
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      throw new Error(
        `ProfileNameCall failed: ${status ?? "NO_STATUS"} ${JSON.stringify(data)}`,
      );
    }
  }
  async getAvatarUrl(profileId: string, token: string): Promise<string | null> {
    try {
      const res = await api.get<{ avatarUrl: string | null }>(
        `/api/v3/profile/avatar/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.avatarUrl ?? null;
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      throw new Error(
        `getAvatarUrl failed: ${status ?? "NO_STATUS"} ${JSON.stringify(data)}`,
      );
    }
  }
}
export const profileService = new ProfileService();
