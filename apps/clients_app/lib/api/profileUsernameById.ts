import api from "../authFetch";

type Response = {
  username: string;
};

export default async function ProfileUsernameById(
  profileId: string,
  token: string,
): Promise<string | null> {
  if (!profileId || !token) {
    return null;
  }
  try {
    const res = await api.get<Response>(
      `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/profile/get/username/profileId/${profileId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res?.data.username) {
      throw new Error("something went wrong");
    }
    return res.data.username;
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    throw new Error(
      `ProfileNameCall failed: ${status ?? "NO_STATUS"} ${JSON.stringify(data)}`,
    );
  }
}
