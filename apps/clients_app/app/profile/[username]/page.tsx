"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  UserRound,
  CalendarDays,
  Globe,
  Lock,
  Users,
  FileText,
  Heart,
} from "lucide-react";

type Profile = {
  username?: string;
  displayName?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  isPublic?: boolean;
  createdAt?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
};

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/profile/get/username/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const profileData = await response.json();

        if (!response.ok) {
          throw new Error(
            profileData.message || "Something went wrong with fetching profile",
          );
        }

        setProfile(profileData);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl animate-pulse rounded-2xl border bg-white p-6">
          <div className="h-36 rounded-xl bg-slate-200" />
          <div className="-mt-10 ml-6 h-20 w-20 rounded-full bg-slate-200" />
          <div className="mt-4 h-6 w-56 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-80 rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!profile) return <div className="p-6">Profile not found</div>;

  const displayName = profile.displayName || username;
  const joined = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : null;

  return (
    <main className="min-h-screen bg-linear-to-t from-white to-customBG  px-4 py-6 md:px-8">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200  shadow-sm">
        <div className="h-36" />

        <div className="px-5 pb-6 md:px-8">
          <div className="-mt-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={`${username}'s avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-full w-full p-4" />
                )}
              </div>

              <div className="pb-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  {displayName}
                </h1>
                <p className="text-sm text-slate-500">@{username}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                Follow
              </button>
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Message
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1">
              {profile.isPublic ? <Globe size={14} /> : <Lock size={14} />}
              {profile.isPublic ? "Public profile" : "Private profile"}
            </span>
            {joined && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={14} />
                Joined {joined}
              </span>
            )}
          </div>

          <p className="mt-4 text-slate-700">{profile.bio || "No bio yet."}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 p-4 text-center">
              <div className="inline-flex items-center gap-1 text-slate-500">
                <FileText size={14} />
                <span className="text-xs uppercase tracking-wide">Posts</span>
              </div>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {profile.postsCount ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 text-center">
              <div className="inline-flex items-center gap-1 text-slate-500">
                <Users size={14} />
                <span className="text-xs uppercase tracking-wide">
                  Followers
                </span>
              </div>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {profile.followersCount ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 text-center">
              <div className="inline-flex items-center gap-1 text-slate-500">
                <Heart size={14} />
                <span className="text-xs uppercase tracking-wide">
                  Following
                </span>
              </div>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {profile.followingCount ?? 0}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
