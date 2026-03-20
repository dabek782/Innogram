"use client";
import React, { useState } from "react";
import ProfileNameCall from "../services/ProfileServices/profileNameCall";
import { profile } from "console";

export function useProfileCreate() {
  const [profileState, setProfileState] = useState({
    profile: {
      username: "",
      displayName: "",
      birthday: "",
      bio: "",
      avatar: null,
      isPublic: true,
    },
    loading: false,
    error: "",
    profileCreated: false,
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileState((prevState) => ({ ...prevState, error: "" }));
    setProfileState((prevState) => ({ ...prevState, loading: true }));

    try {
      const token = localStorage.getItem("accessToken");
      let avatarUrl: string | undefined;
      const username = profileState.profile.username;
      const displayName = profileState.profile.displayName;
      const birthday = profileState.profile.birthday;
      const avatar = profileState.profile.avatar;
      const isPublic = profileState.profile.isPublic;
      const bio = profileState.profile.bio;
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
        console.log(uploadRes);
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
      setProfileState((prevState) => ({ ...prevState, profileCreated: true }));
    } catch (err: any) {
      setProfileState((prevState) => ({ ...prevState, error: err.message }));
    } finally {
      setProfileState((prevState) => ({ ...prevState, loading: false }));
    }
  };
  return {
    profileState,
    handleSubmit,
    setProfileState,
  };
}
