"use client";
import { JSX, useEffect } from "react";
import { Label } from "../ui/label/label";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useRouter } from "next/navigation";
import { useProfileCreate } from "@/lib/hooks/useProfileCreate";

export default function ProfileCreateForm(): JSX.Element {
  const router = useRouter();
  const { handleSubmit, profileState, setProfileState } = useProfileCreate();
  const username = profileState.profile.username;

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("profileId", username);
    }

    if (profileState.profileCreated) {
      router.push(`/profile/${username}`);
    }
  }, [profileState.profileCreated]);
  return (
    <section className="flex items-center justify-center min-h-screen bg-line-to-b from-customBG to-white px-6">
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
              value={profileState.profile.username}
              onChange={(e) =>
                setProfileState((prevState) => ({
                  ...prevState,
                  profile: {
                    ...prevState.profile,
                    username: e.target.value,
                  },
                }))
              }
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
              value={profileState.profile.displayName}
              onChange={(e) =>
                setProfileState((prevState) => ({
                  ...prevState,
                  profile: {
                    ...prevState.profile,
                    displayName: e.target.value,
                  },
                }))
              }
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
              value={profileState.profile.birthday}
              onChange={(e) =>
                setProfileState((prevState) => ({
                  ...prevState,
                  profile: {
                    ...prevState.profile,
                    birthday: e.target.value,
                  },
                }))
              }
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
              value={profileState.profile.bio}
              onChange={(e) =>
                setProfileState((prevState) => ({
                  ...prevState,
                  profile: {
                    ...prevState.profile,
                    bio: e.target.value,
                  },
                }))
              }
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
              onChange={(e) =>
                setProfileState((prevState) => ({
                  ...prevState,
                  profile: {
                    ...prevState.profile,
                    avatar: e.target.files?.[0] ?? null,
                  },
                }))
              }
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Input
              name="isPublic"
              id="inp-public"
              type="checkbox"
              checked={profileState.profile.isPublic}
              onChange={(e) =>
                setProfileState((prevState) => ({
                  ...prevState,
                  profile: {
                    ...prevState.profile,
                    isPublic: e.target.checked,
                  },
                }))
              }
              className="h-4 w-4"
            />
            <Label htmlFor="inp-public" className="text-sm text-gray-700">
              Make profile public
            </Label>
          </div>

          {profileState.error && (
            <p className="text-sm text-red-600 text-center">
              {profileState.error}
            </p>
          )}

          <Button
            type="submit"
            disabled={profileState.loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition"
          >
            {profileState.loading ? "Creating..." : "Create Profile"}
          </Button>
        </form>
      </div>
    </section>
  );
}
