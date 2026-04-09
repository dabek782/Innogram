"use client";
import { useEffect, useState } from "react";
import { PostData } from "@/lib/types/types";
import { postService } from "@/lib/services/PostServices/PostServices";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/ui/searchBar/profileSearchBar/searchBar";
import { profileService } from "@/lib/services/ProfileServices/ProfileService";
interface ProfileInfo {
  avatarUrl: string;
  username: string;
}

export default function Page() {
  const [post, setPosts] = useState<PostData[]>([]);
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getProfileInfo = async (profileId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return null;
    }
    try {
      const [avatarUrl, username] = await Promise.all([
        profileService.getAvatarUrl(profileId, token),
        profileService.getUsernameByProfileId(profileId, token),
      ]);

      const profileData: ProfileInfo = { avatarUrl, username };
      return profileData;
    } catch (error) {
      console.error("Failed to fetch profile info:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsError("Invalid token");
        setIsLoading(false);
        return;
      }
      try {
        const postsData = await postService.getAllPosts(token);
        setPosts(postsData);
      } catch (error) {
        if (error instanceof Error) {
          setIsError(
            "Something went wrong with fetching posts" + error.message,
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading)
    return (
      <div className=" text-center text-customBG w-screen h-screen flex justify-center">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className=" text-center text-red-500 w-screen h-screen flex justify-center">
        {isError}
      </div>
    );
  return (
    <main className="min-h-screen bg-linear-to-t from-white to-customBG  px-4 py-6 md:px-8">
      <section className="flex justify-center items-center">
        <SearchBar />
      </section>
      <section className="mx-auto max-w-md">
        <div className="space-y-6">
          {post.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="px-4 py-3 flex items-center justify-between border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-300" />
                  <div>
                    <p className="font-semibold text-sm">{post.profileId}</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => router.push(`/post/${post.id}`)}
                className="cursor-pointer"
              >
                {post.postAssets && post.postAssets.length > 0 ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/${post.postAssets[0].asset?.filePath}`}
                    alt="post"
                    className="w-full aspect-auto object-cover"
                  />
                ) : (
                  <div className="bg-slate-100 aspect-square flex items-center justify-center">
                    <p className="text-center px-4">{post.content}</p>
                  </div>
                )}
              </div>

              <div className="px-4 pb-3">
                <p className="text-sm text-center">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
