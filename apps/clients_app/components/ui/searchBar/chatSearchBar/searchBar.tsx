"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { profileService } from "@/lib/services/ProfileServices/ProfileService";
import { Input } from "../../input/input";
import { ProfileResult } from "@/lib/types/types";

type Props = {
  onProfileClicked: (targetProfileId: string) => void;
};
type TokenPayload = {
  userId: string;
  profileId: string;
  accountId: string;
  exp: number;
  iat: number;
};
function getPayloadFromToken(token: string | null): TokenPayload | null {
  if (!token) return null;
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}
export default function SearchBar({ onProfileClicked }: Props) {
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
    <div className="relative w-70 rounded-2xl ">
      <form
        onSubmit={handleSearch}
        className="flex flex-row gap-2 m-2 w-full"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setResults([]);
          }
        }}
      >
        <Input
          type="text"
          value={query}
          placeholder="Search for avaiable profiles to chat"
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-lg border-2 border-white px-3 py-2 text-customBG text-center"
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
                onProfileClicked(profile.id);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                console.log("onMouseDown fired, profile.id:", profile.id);
                onProfileClicked(profile.id);
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
