"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { profileService } from "@/lib/services/ProfileServices/ProfileService";
import api from "../services/authenticateService/authFetch";
import {
  ApiError,
  AssetResponse,
  PostData,
  PostResponse,
} from "@/lib/types/types";

type PostFormState = {
  content: string;
  isArchived: boolean;
  asset: File | null;
  existingAssetName?: string | null;
};

type UsePostCreateState = {
  post: PostFormState;
  isLoading: boolean;
  error: string;
  postCreated: boolean;
};

export default function usePostCreate(postId?: string) {
  const router = useRouter();

  const [postState, setPostState] = useState<UsePostCreateState>({
    post: {
      content: "",
      isArchived: false,
      asset: null,
      existingAssetName: null,
    },
    isLoading: false,
    error: "",
    postCreated: false,
  });
  const [originalArchivedState, setOriginalArchivedState] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    if (!postId) {
      return;
    }

    const fetchPost = async () => {
      setPostState((prevState) => ({
        ...prevState,
        isLoading: true,
        error: "",
      }));

      try {
        const postRes = await api.get<PostData>(`/api/v3/post/${postId}`);
        const postData = postRes.data;

        setPostState((prevState) => ({
          ...prevState,
          post: {
            content: postData.content || "",
            isArchived: postData.isArchived || false,
            asset: null,
            existingAssetName:
              postData.postAssets?.[0]?.asset?.fileName ?? null,
          },
        }));
        setOriginalArchivedState(postData.isArchived ?? false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setPostState((prevState) => ({
            ...prevState,
            error: err.message,
          }));
        } else {
          setPostState((prevState) => ({
            ...prevState,
            error: "Failed to load post for editing.",
          }));
        }
      } finally {
        setPostState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostState((prevState) => ({ ...prevState, isLoading: true, error: "" }));

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
        const assetRes = await api.post<AssetResponse>(
          "/api/v3/asset/create",
          fd,
        );
        const uploadData: AssetResponse | ApiError = assetRes.data;

        if (!("id" in uploadData)) {
          throw new Error("Upload succeeded but missing asset id");
        }
        uploadedAssetId = uploadData.id;
      }

      let postData: PostData | PostResponse;
      if (postId) {
        const updateRes = await api.put<PostData>(
          `/api/v3/post/update/${postId}`,
          {
            content,
          },
        );
        postData = updateRes.data;

        if (
          originalArchivedState !== null &&
          isArchived !== originalArchivedState
        ) {
          const archiveRes = await api.put<{ id: string; isArchived: boolean }>(
            `/api/v3/post/archive/${postId}`,
            {
              isArchived,
            },
          );
          postData = {
            ...postData,
            isArchived: archiveRes.data.isArchived,
          } as PostData;
        }
      } else {
        const postRes = await api.post<PostResponse>(`/api/v3/post/create`, {
          content,
          isArchived,
        });
        postData = postRes.data;
      }

      if (!("id" in postData)) {
        throw new Error("Post submission failed without an id");
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

      const redirect = await profileService.getProfilePath(
        postData.profileId,
        token,
      );
      router.push(redirect);

      setPostState((prevState) => ({
        ...prevState,
        postCreated: true,
        post: { ...prevState.post, isArchived },
      }));

      if (!postId) {
        setPostState((prevState) => ({
          ...prevState,
          post: {
            ...prevState.post,
            content: "",
            asset: null,
            isArchived: false,
            existingAssetName: null,
          },
        }));
      }
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
