import axios from "axios";
import api from "../authenticateService/authFetch";
export default async function ProfileNameCall(
  userId: string,
  token: string,
): Promise<string | null> {
  if (!userId || !token) {
    return null;
  }
  try {
    const res = await api.get(
      `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/profile/getusername/${userId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res?.data?.username) {
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
