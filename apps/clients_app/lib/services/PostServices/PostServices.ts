import api from "../authenticateService/authFetch";
import { ArchivePostResponse } from "@/lib/types/types";
import { DeletePostResponse } from "@/lib/types/types";

export class PostService {
  async archivePost(
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
  async deletePost(postId: string, token: string): Promise<DeletePostResponse> {
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
}
export const postService = new PostService();
