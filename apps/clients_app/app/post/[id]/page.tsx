"use client";

import ProfileUsernameById from "@/lib/api/profileUsernameById";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Share2 } from "lucide-react";
import { Heart } from "lucide-react";
import { Archive } from "lucide-react";
import { Pencil } from "lucide-react";
import archivePost from "@/lib/api/archivePost";
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
  asset?: Asset;
};

type PostData = {
  id: string;
  content: string;
  profileId: string;
  isArchived: boolean;
  postAssets?: PostAsset[];
};

type TokenPayload = {
  userId: string;
  profileId: string;
  accountId: string;
  exp: number;
  iat: number;
};
function getPayloadFromToken(token: string | null): TokenPayload | null {
  if (!token) return null;
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

export default function PostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = params?.id;
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [authorUsername, setAuthorUsername] = useState<string | null>(null);
  const [postData, setPostData] = useState<PostData | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL ?? "";
  const archivePostHelper = async () => {
    const token = localStorage.getItem("accessToken");
    setIsError(null);
    try {
      if (!token || !postId) {
        setIsError("Token or post id is wrong");
        return;
      }
      const res = await archivePost(postId, token, true);
      if (res) {
        setPostData((prev) => {
          if (!prev) return prev;
          return { ...prev, isArchived: true };
        });
      }
    } catch (error) {
      setIsError("Something went wrong with archiving post");
      return;
    }
  };
  useEffect(() => {
    setIsError(null);
    setIsLoading(true);
    const fetchPost = async () => {
      if (!postId) {
        setIsError("cannot find post id");
        setIsLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        const tokenPayload = getPayloadFromToken(token);
        const currentProfileId = tokenPayload?.profileId ?? null;
        const postRes = await fetch(`${baseUrl}/api/v3/post/${postId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const postData = await postRes.json();
        if (!postRes.ok) {
          throw new Error(postData?.message || "Failed to fetch post");
        }
        if (!postData?.id) {
          setPostData(null);
          return;
        }

        setPostData(postData);
        setIsOwner(
          Boolean(currentProfileId && currentProfileId === postData.profileId),
        );
        if (postData.profileId && token) {
          try {
            const username = await ProfileUsernameById(
              postData.profileId,
              token,
            );
            setAuthorUsername(username);
          } catch (error) {
            setAuthorUsername(null);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) setIsError(err.message);
        else setIsError("Unexpected error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId, baseUrl]);
  const coverUrl = useMemo(() => {
    const filePath = postData?.postAssets?.[0]?.asset?.filePath;
    if (!filePath) return null;
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    const normalized = filePath.replace(/^\/+/, "");
    return `${baseUrl}/${normalized}`;
  }, [postData, baseUrl]);
  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-t from-white to-customBG ">
        <div className="space-y-3 w-full border-slate-500 rounded-2xl bg-cover bg-amber-100 animate-pulse">
          <div className="  bg-slate-500  h-72 w-full "></div>
          <div className=" bg-slate-500 h-5 w-full rounded-2xl"></div>
          <div className=" bg-slate-500 h-32 w-full"></div>
        </div>
      </main>
    );
  }
  if (isError) {
    return (
      <main className="min-h-screen bg-linear-to-t from-white to-customBG px-4 py-6 md:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-6">
          <h2 className="text-center text-red-600 font-semibold">
            Error loading post
          </h2>
          <p className="mt-2 text-center text-red-600">{isError}</p>
        </div>
      </main>
    );
  }

  if (!postData) {
    return (
      <main className="min-h-screen bg-linear-to-t from-white to-customBG px-4 py-6 md:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-center text-slate-700">Post not found.</p>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-linear-to-t from-white to-customBG px-4 py-6 md:px-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              {authorUsername && (
                <button
                  onClick={() => router.push(`/profile/${authorUsername}`)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                >
                  @{authorUsername}
                </button>
              )}
              {isOwner && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Your post
                </span>
              )}
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={postData.postAssets?.[0]?.asset?.fileName || "Post image"}
              className="h-72 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300">
              <h2 className="text-lg text-slate-500">No image attached</h2>
            </div>
          )}
          <div className="flex align-middle items-center w-full justify-between">
            <p className="mt-4 text-slate-800 text-lg">{postData.content}</p>
            <div className="flex justify-center">
              {isOwner && (
                <p className="transition-all duration-300 ease-out hover:scale-90 hover:cursor-pointer hover:drop-shadow-xs active:scale-90">
                  <Trash2 />
                </p>
              )}
              {isOwner && (
                <p className="transition-all duration-300 ease-out hover:scale-90 hover:cursor-pointer hover:drop-shadow-xs active:scale-90">
                  <Archive onClick={archivePostHelper} />
                </p>
              )}
              {isOwner && (
                <p className="transition-all duration-300 ease-out hover:scale-90 hover:cursor-pointer hover:drop-shadow-xs active:scale-90">
                  <Pencil />
                </p>
              )}

              <p className="transition-all duration-300 ease-out hover:scale-90 hover:cursor-pointer hover:drop-shadow-xs active:scale-90">
                <Heart />
              </p>
              <p className="transition-all duration-300 ease-out hover:scale-90 hover:cursor-pointer hover:drop-shadow-xs active:scale-90">
                <Share2 />
              </p>
            </div>
          </div>
        </section>
        <section>
          <div className="w-full h-32 bg-white rounded-2xl">
            <div className="text-center  rounded-2xl">
              <p className="text-slate-400">Comments coming soon</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
