import { log } from "console";
import ProfileNameCall from "./profileNameCall";
type account = {
  id: string;
  userId: string;
};
type AuthenticateCallResponse = {
  accessToken: string;
  refreshToken: string;
  account: account;
};

type AuthenticateCallResult = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

export default async function AuthenticateCall(
  email: string,
  password: string,
): Promise<AuthenticateCallResult> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_URL}/auth/authenticate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    if (!response.ok) {
      throw new Error(response.status + " something went wrong with auth");
    }

    const data = (await response.json()) as AuthenticateCallResponse;
    const userId = data.account.userId;
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;

    return {
      userId: userId,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Something went wrong ${message}`);
  }
}
