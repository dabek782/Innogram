"use client";
import React, { JSX, useEffect, useState } from "react";
import { Label } from "../ui/label/label";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useRouter } from "next/navigation";
import { useProfileCreate } from "@/lib/hooks/useProfileCreate";

export default function ProfileCreate(): JSX.Element {
  const router = useRouter();
  const {
    username,
    setUsername,
    displayName,
    setDisplayName,
    bio,
    setBio,
    avatar,
    setAvatar,
    isPublic,
    setIsPublic,
    birthday,
    setBirthday,
    loading,
    error,
    handleSubmit,
    profileCreated,
    setProfileCreated,
  } = useProfileCreate();
  useEffect(() => {
    if (profileCreated) {
      router.push(`/profile/${username}`);
    }
  }, [profileCreated]);
  return (
    <section className="flex items-center justify-center min-h-screen bg-linear-to-b from-customBG to-white px-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label
              htmlFor="inp-username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </Label>
            <Input
              name="username"
              id="inp-username"
              placeholder="Write your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="inp-displayname"
              className="text-sm font-medium text-gray-700"
            >
              Display Name
            </Label>
            <Input
              name="displayname"
              id="inp-displayname"
              placeholder="Write your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="inp-date"
              className="text-sm font-medium text-gray-700"
            >
              Birthday
            </Label>
            <Input
              name="birthday"
              type="date"
              id="inp-date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="inp-bio"
              className="text-sm font-medium text-gray-700"
            >
              Bio
            </Label>
            <Input
              name="bio"
              id="inp-bio"
              placeholder="Write your bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="inp-file"
              className="text-sm font-medium text-gray-700"
            >
              Avatar
            </Label>
            <Input
              type="file"
              id="inp-file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Input
              name="isPublic"
              id="inp-public"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="inp-public" className="text-sm text-gray-700">
              Make profile public
            </Label>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition"
          >
            {loading ? "Creating..." : "Create Profile"}
          </Button>
        </form>
      </div>
    </section>
  );
}
