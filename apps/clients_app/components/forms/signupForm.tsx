"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { OAuthButtons } from "../ui/githubOauthButton";
import { useRouter } from "next/navigation";
import api from "@/lib/authFetch";
export const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("1. Starting sign up...");

      const { data } = await api.post(
        `${process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_URL}/register`,
        { email, password },
      );

      console.log("2. Response data:", data);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      console.log("4. Tokens saved");

      let userId: string | undefined;

      try {
        const profileRes = await api.get(`/api/v3/profile/get/${userId}`);
        if (profileRes.data) {
          router.push(`/profile/${profileRes.data.username}`);
        } else {
          router.push("/profile/create");
        }
      } catch (profileErr: any) {
        if (profileErr.response?.status === 404) {
          router.push("/profile/create");
        } else {
          throw profileErr;
        }
      }
    } catch (error: any) {
      console.log("ERROR:", error);
      if (error.response?.status === 404) {
        router.push("/profile/create");
      } else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Registration failed",
        );
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-2 flex-col gap-4 mt-3 justify-center">
        <div>
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            name="email"
            id="inp-email"
            placeholder="Write your email"
            className=" w-70  hover:bg-gray-100 mb-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
        </div>

        <div>
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <Input
            type="password"
            id="inp-pass"
            placeholder="Write your password"
            className=" hover:bg-gray-100 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
        </div>
        <div className="flex justify-center items-center mt-5">
          <Button
            type="submit"
            disabled={loading}
            className="rounded-2xl border-2 text-white border-emerald-700 w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
        <p className="flex justify-center">Or registrate using github</p>
        <OAuthButtons />
      </div>
    </form>
  );
};
export default SignupForm;
