// authenticateCall.ts
import { authService } from "./authenticationService";
import { AuthenticateCallResult } from "../../types/types";

export default async function AuthenticateCall(
  email: string,
  password: string,
): Promise<AuthenticateCallResult> {
  try {
    return await authService.authenticate(email, password);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Something went wrong ${message}`);
  }
}
