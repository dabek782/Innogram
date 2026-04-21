"use client";

import { profileService } from "@/lib/services/ProfileServices/ProfileService";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { Trash2, Share2, Heart, Archive, Pencil } from "lucide-react";
import { postService } from "@/lib/services/PostServices/PostServices";
import { commentService } from "@/lib/services/CommentServices/CommentService";
import DeleteModal from "@/components/ui/modal/deleteModal";
import ArchiveModal from "@/components/ui/modal/archiveModal";
import CommentBar from "@/components/ui/commentBar";
import CommentCard from "@/components/ui/commentCard";
import { getPayloadFromToken } from "@/app/auth/callback/helperFunctions/helpers";
import { CommentResponseData, PostData } from "@/lib/types/types";

export default function PostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = params?.id;
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [authorUsername, setAuthorUsername] = useState<string | null>(null);
  const [postData, setPostData] = useState<PostData | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [comments, setComments] = useState<CommentResponseData[]>([]);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL ?? "";

  const handleArchive = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token || !postId || !postData) {
      setIsError("Token, post id, or post data is missing");
      return;
    }

    setIsError(null);
    setIsLoading(true);

    const nextArchivedState = !postData.isArchived;

    try {
      await postService.archivePost(postId, token, nextArchivedState);

      setPostData((prev) =>
        prev ? { ...prev, isArchived: nextArchivedState } : prev,
      );

      setShowArchiveModal(false);
    } catch (error) {
      setIsError("Something went wrong with archiving post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateComment = async (content: string) => {
    const token = localStorage.getItem("accessToken");

    if (!token || !postId) {
      setCommentError("Please sign in to post comments.");
      return;
    }

    setCommentError(null);
    setCommentsLoading(true);

    try {
      const newComment = await commentService.createComment(postId, content);
      setComments((prevComments) => [newComment, ...prevComments]);
    } catch (error) {
      setCommentError("Unable to post comment. Please try again.");
    } finally {
      setCommentsLoading(false);
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
        const userId = tokenPayload?.userId ?? null;
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
        console.log(postData);
        setIsOwner(
          Boolean(currentProfileId && currentProfileId === postData.profileId),
        );
        if (postData.profileId && token) {
          if (userId !== null) {
            try {
              const username = await profileService.ProfileNameCall(
                userId,
                token,
              );
              console.log(username);
              setAuthorUsername(username);
              console.log(authorUsername);
            } catch (error) {
              setAuthorUsername(null);
            }
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
  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsError("No jwt token found");
      return;
    }
    try {
      await postService.deletePost(postId, token);
      setShowDeleteModal(false);
      router.push(`/profile/${authorUsername}`);
    } catch (error) {
      setIsError("Something went wrong with deleting post");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!postId) {
      return;
    }

    if (!token) {
      setComments([]);
      setCommentError("Sign in to view and add comments.");
      return;
    }

    const fetchComments = async () => {
      setCommentsLoading(true);
      setCommentError(null);

      try {
        const commentsData = await commentService.getCommentsByPostId(postId);
        setComments(commentsData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setCommentError(
            error.message.includes("401")
              ? "Please sign in to view comments."
              : "Failed to load comments.",
          );
        } else {
          setCommentError("Failed to load comments.");
        }
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

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
                  <Trash2
                    onClick={() => {
                      setShowDeleteModal(true);
                    }}
                  />
                </p>
              )}
              {isOwner && (
                <p className="transition-all duration-300 ease-out hover:scale-90 hover:cursor-pointer hover:drop-shadow-xs active:scale-90">
                  {postData.isArchived ? (
                    <Archive
                      className="text-customBG"
                      onClick={() => {
                        setShowArchiveModal(true);
                      }}
                    />
                  ) : (
                    <Archive
                      className="text-black"
                      onClick={() => {
                        setShowArchiveModal(true);
                      }}
                    />
                  )}
                </p>
              )}
              {isOwner && (
                <p
                  className="transition-all duration-300 ease-out hover:scale-90 hover:cursor-pointer hover:drop-shadow-xs active:scale-90"
                  onClick={() => router.push(`/post/edit/${postId}`)}
                >
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
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Comments
                </h2>
                <p className="text-sm text-slate-500">
                  Share your thoughts on that post
                </p>
              </div>
            </div>

            <CommentBar
              onSubmit={handleCreateComment}
              disabled={commentsLoading}
            />

            {commentError && (
              <p className="text-sm text-red-600">{commentError}</p>
            )}

            {commentsLoading ? (
              <div className="space-y-3">
                <div className="h-20 rounded-2xl bg-slate-100 animate-pulse"></div>
                <div className="h-20 rounded-2xl bg-slate-100 animate-pulse"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No comments yet. Be the first to comment.
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
          }}
        />
      )}
      {showArchiveModal && (
        <ArchiveModal
          onConfirm={handleArchive}
          onCancel={() => {
            setShowArchiveModal(false);
          }}
        />
      )}
    </main>
  );
}
