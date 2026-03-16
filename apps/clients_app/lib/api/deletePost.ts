import api from "../authFetch";

type DeletePostResponse = {
  id: string;
  deleted: boolean;
};

export default async function deletePost(
  postId: string,
  token: string,
): Promise<DeletePostResponse> {
  if (!postId || !token) {
    throw new Error("Missing postId or token");
  }

  try {
    const res = await api.delete<DeletePostResponse>(
      `${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/api/v3/post/delete/${postId}`,
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
      `deletePost failed: ${status ?? "NO_STATUS"} ${JSON.stringify(data)}`,
    );
  }
}
