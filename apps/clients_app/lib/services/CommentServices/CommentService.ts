import api from "../authenticateService/authFetch";
import { CommentResponseData } from "@/lib/types/types";

export class CommentService {
  async getCommentsByPostId(postId: string): Promise<CommentResponseData[]> {
    if (!postId) {
      throw new Error("Missing postId");
    }

    const res = await api.get<CommentResponseData[]>(
      `/api/v3/comment/post/${postId}`,
    );
    return res.data;
  }

  async createComment(
    postId: string,
    content: string,
    parentCommentId?: string,
  ): Promise<CommentResponseData> {
    if (!postId) {
      throw new Error("Missing postId");
    }
    if (!content.trim()) {
      throw new Error("Comment content cannot be empty");
    }

    const res = await api.post<CommentResponseData>(
      `/api/v3/comment/post/${postId}`,
      {
        content,
        parentCommentId,
      },
    );

    return res.data;
  }
}

export const commentService = new CommentService();
