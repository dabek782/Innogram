"use client";
import { PostResponse, AssetResponse, ApiError } from "../types/types";
import { profileService } from "../services/ProfileServices/ProfileService";
import { useState } from "react";
import api from "../services/authenticateService/authFetch";
import { useRouter } from "next/navigation";
export default function usePostCreate() {
  const router = useRouter();
  const [postState, setPostState] = useState({
    post: {
      content: "",
      isArchived: false,
      asset: null,
    },
    isLoading: false,
    error: "",
    postCreated: false,
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostState((prevState) => ({ ...prevState, error: "" }));
    setPostState((prevState) => ({ ...prevState, isLoading: true }));
    const content = postState.post.content;
    const isArchived = postState.post.isArchived;
    const asset = postState.post.asset;
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
      let profileUsername = await profileService.getUsernameByProfileId(
        postData.profileId,
        token,
      );
      setPostState((prevState) => ({
        ...prevState,
        postCreated: true,
        post: {
          ...prevState.post,
          isArchived: isArchived,
          content: "",
          asset: null,
        },
      }));
      router.push(`/profile/${profileUsername}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPostState((prevState) => ({ ...prevState, error: err.message }));
      } else {
        setPostState((prevState) => ({
          ...prevState,
          error: "Unexpected error",
        }));
      }
    } finally {
      setPostState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };
  return {
    postState,
    setPostState,
    handleSubmit,
  };
}
