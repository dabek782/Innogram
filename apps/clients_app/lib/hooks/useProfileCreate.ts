import React, { useState } from "react";

export function useProfileCreate() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileCreated, setProfileCreated] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      let avatarUrl: string | undefined;
      if (avatar) {
        const fd = new FormData();
        fd.append("file", avatar);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/asset/create`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          },
        );
        const uploadRes = await response.json();
        if (!response.ok)
          throw new Error(
            uploadRes.message || "Something went wrong with uploading asset",
          );
        avatarUrl = uploadRes.filePath;
      }

      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/profile/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            displayName,
            birthday,
            bio: bio || undefined,
            avatarUrl,
            isPublic: isPublic,
          }),
        },
      );
      const profileData = await profileRes.json();
      if (!profileRes.ok)
        throw new Error(
          profileData.message || "Something went wrong creating profile",
        );
      setProfileCreated(true);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };
  return {
    username,
    setUsername,
    displayName,
    setDisplayName,
    birthday,
    setBirthday,
    bio,
    setBio,
    avatar,
    setAvatar,
    isPublic,
    setIsPublic,
    profileCreated,
    setProfileCreated,
    loading,
    error,
    handleSubmit,
  };
}
