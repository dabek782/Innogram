import { MessageResponseData } from "@/lib/types/types";
import api from "../authenticateService/authFetch";
class MessageService {
  async getMessagesByProfileIdAndChatId(
    chatId: string,
    profileId: string,
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
    profileId: string | null,
  ): Promise<MessageResponseData[]> {
    if (!chatId || !profileId) {
      throw new Error("chatId and profileId are required");
    }

    const messages = await this.getMessagesByProfileIdAndChatId(
      chatId,
      profileId,
    );
    return messages ?? [];
  }
}

export const messageService = new MessageService();
