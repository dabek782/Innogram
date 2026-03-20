"use client";

type AssetResponse = {
  filePath: string;
  id: string;
};

type PostResponse = {
  id: string;
  profileId: string;
};
type ApiError = { message?: string };
import ProfileUsernameById from "../api/profileUsernameById";
import { useState } from "react";
import api from "../services/authenticateService/authFetch";
import { useRouter } from "next/navigation";
export default function usePostCreate() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [asset, setAsset] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [postCreated, setPostCreated] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      let uploadedAssetId: string | null = null;

      if (asset) {
        const fd = new FormData();
        fd.append("file", asset);
        const res = await api.post<AssetResponse>("/api/v3/asset/create", fd);

        const uploadData: AssetResponse | ApiError = await res.data;

        if (!("id" in uploadData)) {
          throw new Error("Upload succeeded but missing asset id");
        }

        uploadedAssetId = uploadData.id;
      }

      const postRes = await api.post<PostResponse>(`/api/v3/post/create`, {
        content,
        isArchived,
      });
      const postData: PostResponse | ApiError = postRes.data;
      console.log(postData);
      if (!("id" in postData)) {
        throw new Error("post created without id");
      }
      if (uploadedAssetId) {
        const postAssetRes = await fetch(
          `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/post/${postData.id}/assets/${uploadedAssetId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!postAssetRes.ok) {
          const attachData = await postAssetRes.json().catch(() => null);
          throw new Error(
            attachData?.message || "Failed to attach asset to post",
          );
        }
      }
      let profileUsername = await ProfileUsernameById(
        postData.profileId,
        token,
      );
      console.log(profileUsername);
      setPostCreated(true);
      router.push(`/profile/${profileUsername}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setIsLoading(false);
      setContent("");
      setAsset(null);
      setIsArchived(false);
    }
  };
  return {
    content,
    setContent,
    isArchived,
    setIsArchived,
    asset,
    setAsset,
    postCreated,
    setPostCreated,
    isLoading,
    setIsLoading,
    setError,
    error,
    handleSubmit,
  };
}
