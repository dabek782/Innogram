import ProfileNameCall from "./profileNameCall";

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
}

export const profileService = new ProfileService();
