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
      if (!res?.data) {
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

  async resolveProfileRedirect(userId: string, token: string): Promise<string> {
    try {
      const data = await this.ProfileNameCall(userId, token);
      if (!data) {
        const profileId = await this.getProfileIdUserId(token, userId);
        if (profileId === null) {
          return `/profile/create`;
        }
        const username = await this.getUsernameByProfileId(profileId, token);
        if (!username) return `/profile/create`;
        return `/profile/${username}`;
      }

      return `/profile/${data}`;
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.message ?? "";

      if (status === 404 || message.includes("404")) {
        return `/profile/create`;
      }

      throw new Error("Something went wrong with redirecting " + message);
    }
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
  async getProfileIdUserId(
    token: string,
    userId: string,
  ): Promise<string | null> {
    try {
      const res = await api.get<string | null>(
        `/api/v3/profile/profile-Id/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data ?? null;
    } catch (error) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      throw new Error(
        `getProfileId failed: ${status ?? "NO_STATUS"} ${JSON.stringify(data)}`,
      );
    }
  }
  async getUsernameByProfileId(
    profileId: string,
    token: string,
  ): Promise<string | null> {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/profile/get/${profileId}`,
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
      const data = error?.response?.data;
      throw new Error(
        `Failed to get username by profile id: ${status ?? "NO_STATUS"} ${JSON.stringify(data)}`,
      );
    }
  }
}
export const profileService = new ProfileService();
