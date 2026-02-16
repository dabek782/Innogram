import { Strategy as GithubStrategy } from "passport-github2";
import axios from "axios";
import { ConfigService } from "../config/config_service";
const configService = new ConfigService();
export const githubStrategy = new GithubStrategy(
  {
    clientID: configService.getGithubClient(),
    callbackURL: configService.getGithubCallback(),
    clientSecret: configService.getGithubSecret(),
    scope: ["user:email"],
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ) => {
    try {
      const githubData = {
        providerId: profile.id,
        username: profile.username,
        email: profile.emails?.[0]?.value || null,
        displayName: profile.displayName || profile.username,
        avatarUrl: profile.photos?.[0]?.value || null,
      };
      const response = await axios.post(
        `${configService.getCoreServiceUrl()}/api/v3/auth/oauth/github`,
        githubData,
      );
      done(null, response.data);
    } catch (err) {
      throw new Error(`Something went wrong ${err}`);
    }
  },
);
