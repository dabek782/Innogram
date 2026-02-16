"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { OAuthButtons } from "../ui/githubOauthButton";
export const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    (e.preventDefault(), setError(""), setLoading(false));

    try {
      const response = await fetch(
        `${process.env.CORE_MICROSERVICE_URL}/authenticate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "something went wrong with auth");
      }
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    } catch (error: any) {
      setError(error.message);
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
export default SigninForm;
