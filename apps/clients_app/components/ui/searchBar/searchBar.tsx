"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { profileService } from "@/lib/services/ProfileServices/ProfileService";
import { Input } from "../input/input";
import { useRouter } from "next/navigation";
import { ProfileResult } from "@/lib/types/types";
export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileResult[]>([]);
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token || !query) {
      return;
    }
    const data = await profileService.profileSearch(query, token);
    setResults(data);
  };

  return (
    <div className="relative w-70 rounded-2xl">
      <form onSubmit={handleSearch} className="flex flex-row gap-2 m-2 w-full">
        <Input
          type="text"
          value={query}
          placeholder="Search for profile"
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-lg border-2 border-white px-3 py-2 text-white text-center"
        />
        <button type="submit">
          <Search />
        </button>
      </form>
      {results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-xl border border-slate-500  bg-white shadow-lg">
          {results.map((profile) => (
            <div
              key={profile.id}
              onClick={() => {
                router.push(`/profile/${profile.username}`);
              }}
              className="cursor-pointer px-4 py-2 hover:scale-110 text-sm"
            >
              {profile.displayName || profile.username}
              <span className="ml-1 text-slate-400">@{profile.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
