"use client";

import usePostCreate from "@/lib/hooks/usePostCreate";
export default function CreatePostForm() {
  const { postState, setPostState, handleSubmit } = usePostCreate();

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-y-1.5  flex-col justify-center items-center w-full ">
        <div>
          <label htmlFor="postText">
            <p className="text-center">Text of your post </p>
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
              className="w-full h-32 border-gray-800 border-2  mb-1 hover:border-customBG text-center "
            />
          </label>
        </div>
        <label>
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
            {postState.post.asset?.name ?? "No file selected"}
          </p>
        </div>
        <button
          className="border-2 border-customBG text-black rounded-2xl px-3 hover:border-customBG/80 active:scale-[0.98]"
          disabled={postState.isLoading}
          type="submit"
        >
          {postState.isLoading ? "Creating:.." : "Create Post"}
        </button>
      </div>
    </form>
  );
}
