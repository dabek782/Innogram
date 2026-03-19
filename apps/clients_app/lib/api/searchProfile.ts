import api from "../authFetch";
type ProfileResult = {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
};
export default async function profileSearch(query: string, token: string) {
  try {
    const res = await api.get<ProfileResult[]>(
      `/api/v3/profile/search?query=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
