import api from "../authenticateService/authFetch";
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
      const data = error?.response?.data;
      throw new Error(
        `ProfileNameCall failed: ${status ?? "NO_STATUS"} ${JSON.stringify(data)}`,
      );
    }
  }
  async getUsername(userId: string, token: string): Promise<string | null> {
    return this.ProfileNameCall(userId, token);
  }

  async resolveProfileRedirect(userId: string, token: string): Promise<string> {
    const username = await this.getUsername(userId, token);

    if (!username) {
      return "/profile/create";
    }

    return `/profile/${username}`;
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
