import { MessageResponseData } from "@/lib/types/types";
import api from "../authenticateService/authFetch";
import { MessageAssetData } from "@/lib/types/types";
class MessageService {
  async getMessagesByProfileIdAndChatId(
    chatId: string,
    profileId: string,
    token: string,
  ): Promise<MessageResponseData[] | null> {
    try {
      const res = await api.get(`/api/v3/chat/${chatId}/messages/${profileId}`);
      return res.data ?? null;
    } catch (error: any) {
      throw new Error(
        `getMessagesByProfileIdAndChatId failed: ${error?.response?.status ?? "NO_STATUS"} ${JSON.stringify(error?.response?.data)}`,
      );
    }
  }

  async getMessages(
    chatId: string | null,
    token: string,
  ): Promise<MessageResponseData[]> {
    if (!chatId || !token) {
      throw new Error("chatId and token are required");
    }

    const res = await api.get(`/api/v3/chat/${chatId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const messages = res.data;
    return messages ?? [];
  }
  async deleteMessages(
    id: string,
    token: string,
  ): Promise<MessageResponseData> {
    if (!id || !token) {
      throw new Error("id and token are required");
    }

    try {
      const res = await api.delete(`/api/v3/chat/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error: any) {
      throw new Error(
        `deleteMessages failed: ${error?.response?.status ?? "NO_STATUS"} ${JSON.stringify(error?.response?.data)}`,
      );
    }
  }

  async editMessage(
    id: string,
    content: string,
    token: string,
  ): Promise<MessageResponseData> {
    if (!id || !content || !token) {
      throw new Error("id, content and token are required");
    }

    try {
      const res = await api.put(
        `/api/v3/chat/messages/${id}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    } catch (error: any) {
      throw new Error(
        `editMessage failed: ${error?.response?.status ?? "NO_STATUS"} ${JSON.stringify(error?.response?.data)}`,
      );
    }
  }
  async attach(messageId: string, assetId: string) {
    try {
      const res = await api.post<MessageAssetData>(
        `/api/v3/chat/message/${messageId}/assets/${assetId}`,
        {},
      );
      return res.data;
    } catch (error: any) {
      throw new Error(
        `editMessage failed: ${error?.response?.status ?? "NO_STATUS"} ${JSON.stringify(error?.response?.data)}`,
      );
    }
  }

  async getAll(messageId: string) {
    const res = await api.get<MessageAssetData[]>(
      `/api/v3/chat/message/${messageId}/assets`,
    );
    return res.data ?? [];
  }
}

export const messageService = new MessageService();
