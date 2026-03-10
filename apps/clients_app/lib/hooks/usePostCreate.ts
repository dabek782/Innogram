"use client";

type AssetResponse = {
  filePath: string;
  id: string;
};

type PostResponse = {
  id: string;
};
type ApiError = { message?: string };
import { useState } from "react";
export default function usePostCreate() {
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/asset/create`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          },
        );

        const uploadData: AssetResponse | ApiError = await response.json();
        if (!response.ok)
          throw new Error(
            "message" in uploadData
              ? uploadData.message ||
                "Something went wrong with uploading asset"
              : "Something went wrong with uploading asset",
          );
        if (!("id" in uploadData)) {
          throw new Error("Upload succeeded but missing asset id");
        }

        uploadedAssetId = uploadData.id;
      }

      const postRes = await fetch(
        `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/post/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            isArchived,
          }),
        },
      );
      const postData: PostResponse | ApiError = await postRes.json();
      if (!postRes.ok)
        throw new Error(
          "message" in postData
            ? postData.message || "Something went wrong with creating post"
            : "Something went wrong with creating post",
        );
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

      setPostCreated(true);
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
