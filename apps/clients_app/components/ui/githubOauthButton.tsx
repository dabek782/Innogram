"use client";
import { GithubLoginButton } from "react-social-login-buttons";

export function OAuthButtons() {
  const handleLogin = () => {
    const url = process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_URL;
    console.log(url);
    window.location.href = `http://localhost:3002/auth/oauth/github`;
  };
  return (
    <div className="pt-1 rounded-2xl">
      <GithubLoginButton
        onClick={handleLogin}
        text="Continue with Github"
        style={{ width: "100%" }}
      />
    </div>
  );
}
