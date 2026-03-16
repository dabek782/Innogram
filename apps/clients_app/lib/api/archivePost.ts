import api from "../authFetch";

type ArchivePostResponse = {
  id: string;
  isArchived: boolean;
};

export default async function archivePost(
  postId: string,
  token: string,
  isArchived: boolean,
): Promise<ArchivePostResponse> {
  if (!postId || !token) {
    throw new Error("Missing postId or token");
  }

  try {
    const res = await api.put<ArchivePostResponse>(
      `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/post/archive/${postId}`,
      { isArchived },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    throw new Error(
      `archivePost failed: ${status ?? "NO_STATUS"} ${JSON.stringify(data)}`,
    );
  }
}
