import { Strategy as GithubStrategy } from "passport-github2";
import axios from "axios";
import { ConfigService } from "../config/config_service";

const configService = new ConfigService();
const clientID = configService.get("GITHUB_CLIENT_ID");
const callbackURL = configService.get("GITHUB_CALLBACK_URL");
const clientSecret = configService.get("GITHUB_CLIENT_SECRET");

if (!clientID) {
  throw new Error("GITHUB_CLIENT_ID is not defined in the configuration.");
}
if (!callbackURL) {
  throw new Error("GITHUB_CALLBACK_URL is not defined in the configuration.");
}
if (!clientSecret) {
  throw new Error("GITHUB_CLIENT_SECRET is not defined in the configuration.");
}

export const githubStrategy = new GithubStrategy(
  {
    clientID,
    callbackURL,
    clientSecret,
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
        `${configService.get("CORE_SERVICE_URL")}/api/v3/auth/oauth/github`,
        githubData,
      );
      done(null, response.data);
    } catch (err) {
      throw new Error(`Something went wrong ${err}`);
    }
  },
);
