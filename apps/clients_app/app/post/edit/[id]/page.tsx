"use client";

import usePostCreate from "@/lib/hooks/usePostCreate";
import { useParams } from "next/navigation";

export default function EditPostForm() {
  const params = useParams<{ id: string }>();
  const postId = params?.id;
  const { postState, setPostState, handleSubmit } = usePostCreate(postId);
  const isEditMode = Boolean(postId);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 m-3 flex flex-col justify-center items-center w-full max-w-sm md:w-96 border border-gray-200">
        <h1 className="text-3xl shadow-4xl text-center font-bold mb-3">
          {isEditMode ? "Edit Post" : "Create Post"}
        </h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex space-y-1.5 flex-col justify-center items-center w-full">
            <div className="w-full">
              <label htmlFor="postText" className="w-full">
                <p className="text-center">Text of your post</p>
                <textarea
                  id="postText"
                  value={postState.post.content}
                  onChange={(e) =>
                    setPostState((prevState) => ({
                      ...prevState,
                      post: { ...prevState.post, content: e.target.value },
                    }))
                  }
                  placeholder="Today I ..."
                  className="w-full h-32 border-gray-800 border-2 mb-1 hover:border-customBG text-center"
                />
              </label>
            </div>
            <label className="justify-center align-middle">
              <input
                type="checkbox"
                checked={postState.post.isArchived}
                onChange={(e) =>
                  setPostState((prevState) => ({
                    ...prevState,
                    post: { ...prevState.post, isArchived: e.target.checked },
                  }))
                }
                className="mt-3 mb-2"
              />
              Archive post
            </label>
            <div className="w-full flex flex-col items-center gap-2">
              <label
                htmlFor="inp-file"
                className="text-sm font-medium text-gray-700"
              >
                {postState.post.asset ? "Change image" : "Add image"}
              </label>
              <input
                type="file"
                id="inp-file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setPostState((prevState) => ({
                    ...prevState,
                    post: { ...prevState.post, asset: e.target.files?.[0] },
                  }))
                }
              />
              <p className="text-xs max-w-55 truncate">
                {postState.post.asset?.name ??
                  postState.post.existingAssetName ??
                  "No file selected"}
              </p>
            </div>
            <button
              className="border-2 border-customBG text-black rounded-2xl px-3 hover:border-customBG/80 active:scale-[0.98]"
              disabled={postState.isLoading}
              type="submit"
            >
              {postState.isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Post"
                  : "Create Post"}
            </button>
            {postState.error && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {postState.error}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
