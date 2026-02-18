"use client";

import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { UserRound } from "lucide-react";
export default function ProfilePage() {
  const params = useParams();
  const username = params.username;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/profile/get/username/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const profileData = await response.json();
        if (!response.ok) {
          throw new Error(
            profileData.message || "Something went wrong with fetching profile",
          );
        }
        setProfile(profileData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!profile) return <div>Profile not found</div>;
  return (
    <div>
      <div className="w-72 min-h-screen">
        <div className="w-72 h-30 flex-col flex justify-center align-middle">
          <div className="rounded-full w-24 h-24 overflow-hidden  border-gray-500 border-2">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={`${username}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound className="w-full h-full text-customBG object-cover" />
            )}
          </div>
          <h1>{username}'s Profile</h1>
        </div>
      </div>
    </div>
  );
}
