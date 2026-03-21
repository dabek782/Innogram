import ProfileNameCall from "./profileNameCall";
import { ProfileResult } from "@/lib/types/types";
import api from "../authenticateService/authFetch";
export class ProfileService {
  async getUsername(userId: string, token: string): Promise<string | null> {
    return ProfileNameCall(userId, token);
  }

  async resolveProfileRedirect(userId: string, token: string): Promise<string> {
    const username = await this.getUsername(userId, token);

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
}

export const profileService = new ProfileService();
