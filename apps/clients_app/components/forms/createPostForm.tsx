"use client";

import usePostCreate from "@/lib/hooks/usePostCreate";
export default function CreatePostForm() {
  const {
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
  } = usePostCreate();

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-y-1.5  flex-col justify-center items-center w-full ">
        <div>
          <label htmlFor="postText">
            <p className="text-center">Text of your post </p>
            <textarea
              id="postText"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Today I ..."
              className="w-full h-32 border-gray-800 border-2  mb-1 hover:border-customBG text-center "
            />
          </label>
        </div>
        <label>
          <input
            type="checkbox"
            checked={isArchived}
            onChange={(e) => setIsArchived(e.target.checked)}
            className="mt-3 mb-2"
          />
          Archive post
        </label>
        <div className="w-full flex flex-col items-center gap-2">
          <label
            htmlFor="inp-file"
            className="text-sm font-medium text-gray-700"
          >
            {asset ? "Change image" : "Add image"}
          </label>
          <input
            type="file"
            id="inp-file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setAsset(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs max-w-55 truncate">
            {asset?.name ?? "No file selected"}
          </p>
        </div>
        <button
          className="border-2 border-customBG text-black rounded-2xl px-3 hover:border-customBG/80 active:scale-[0.98]"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Creating:.." : "Create Post"}
        </button>
      </div>
    </form>
  );
}
