"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  UserRound,
  CalendarDays,
  Globe,
  Lock,
  Users,
  FileText,
  Heart,
  Archive,
} from "lucide-react";

type Profile = {
  id: string;
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

type Asset = {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  orderIndex: number;
  createdAt: string;
  createdById: string;
  updatedAt: string;
  updatedById: string | null;
};

type PostAsset = {
  id: string;
  postId: string;
  assetId: string;
  asset: Asset;
};

type Posts = {
  id: string;
  content: string;
  profileId: string;
  isArchived: boolean;
  postAssets: PostAsset[];
};

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const username = params?.username;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [postCount, setPostCount] = useState(0);
  const [posts, setPosts] = useState<Posts[] | null>(null);

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
  useEffect(() => {
    if (!profile?.id) return;
    const fetchPostCount = async () => {
      try {
        const profileId = profile.id;
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/post/profile/${profileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const postCount = await response.json();
        setPostCount(Array.isArray(postCount) ? postCount.length : 0);
        console.log(
          "postAssets:",
          JSON.stringify(postCount[0].postAssets, null, 2),
        );
        console.log("typ:", typeof postCount);
        console.log("czy tablica:", Array.isArray(postCount));
        console.log("postData:", JSON.stringify(postCount, null, 2));
        setPosts(postCount);
      } catch (error) {
        setPostCount(0);
      }
    };
    fetchPostCount();
  }, [profile?.id]);
  useEffect(() => {});
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

            <div className="flex flex-wrap space-x-2.5">
              <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                Follow
              </button>
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Message
              </button>
              <button
                onClick={() => router.push("/post/create")}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Create post
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm ">
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

          <p className="mt-4 text-xl">{profile.bio || "No bio yet."}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 p-4 text-center">
              <div className="inline-flex items-center gap-1  ">
                <FileText size={14} />
                <span className="text-xs uppercase tracking-wide">Posts</span>
              </div>
              <p className="mt-1 text-xl font-semibold ">{postCount ?? 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 text-center">
              <div className="inline-flex items-center gap-1 ">
                <Users size={14} />
                <span className="text-xs uppercase tracking-wide">
                  Followers
                </span>
              </div>
              <p className="mt-1 text-xl font-semibold">
                {profile.followersCount ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 text-center">
              <div className="inline-flex items-center gap-1 ">
                <Heart size={14} />
                <span className="text-xs uppercase tracking-wide">
                  Following
                </span>
              </div>
              <p className="mt-1 text-xl font-semibold ">
                {profile.followingCount ?? 0}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-3">
        {!posts || posts.length === 0 ? (
          <div className="flex justify-center align-middle">
            <h2 className="text=center text-slate-400"> You have no posts</h2>
          </div>
        ) : (
          <div>
            <h2 className="text-slate-800 text-center mb-3">Your posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-3 gap-4">
              {posts.map((posts) => (
                <div
                  key={posts.id}
                  onClick={() => router.push(`/post/${posts.id}`)}
                  className="cursor-pointer rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow  "
                >
                  {!posts.postAssets || posts.postAssets.length === 0 ? (
                    <p className=" line-clamp-3 text-center">{posts.content}</p>
                  ) : (
                    <div>
                      <img
                        src={`${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/${posts.postAssets[0].asset.filePath}`}
                        alt={posts.postAssets[0].asset.fileName}
                        className="w-full h-48 object-cover rounded-lg"
                      />

                      <p className="text-center text-slate-600 line-clamp-2">
                        {posts.content}
                      </p>
                    </div>
                  )}
                  {posts.isArchived && (
                    <div className=" flex justify-center items-center">
                      <Archive className=" hover:scale-110  " />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
