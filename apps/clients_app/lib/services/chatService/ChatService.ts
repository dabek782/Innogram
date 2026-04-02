import api from "../authenticateService/authFetch";
import {
  ChatParticipant,
  ChatResponseData,
  ChatWithParticipant,
} from "@/lib/types/types";
export default class ChatService {
  async getChatInfo(
    profileId: string,
    token: string,
  ): Promise<ChatParticipant[] | null> {
    if (!profileId || token) {
      throw new Error("Missing profileId or token");
    }
    try {
      const res = await api.get(`/api/v3/chat/participants/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data ?? null;
    } catch (error) {
      throw new Error(
        `getChatsByProfileId failed: ${error?.response?.status ?? "NO_STATUS"} ${JSON.stringify(error?.response?.data)}`,
      );
    }
  }
  async getChatsByProfileId(
    profileId: string,
    token: string,
  ): Promise<ChatParticipant[] | null> {
    try {
      const res = await api.get(`/api/v3/chat/participants/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data ?? null;
    } catch (error: any) {
      throw new Error(
        `getChatsByProfileId failed: ${error?.response?.status ?? "NO_STATUS"} ${JSON.stringify(error?.response?.data)}`,
      );
    }
  }

  async getChatById(
    chatId: string,
    token: string,
  ): Promise<ChatResponseData | null> {
    try {
      const res = await api.get(`/api/v3/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data ?? null;
    } catch (error: any) {
      throw new Error(
        `getChatById failed: ${error?.response?.status ?? "NO_STATUS"} ${JSON.stringify(error?.response?.data)}`,
      );
    }
  }
  async getChat(
    profileId: string | null,
    token: string | null,
  ): Promise<ChatWithParticipant[]> {
    if (!profileId || !token) throw new Error("Not authenticated");

    const participants = await this.getChatsByProfileId(profileId, token);
    if (!participants) return [];

    const chats = await Promise.all(
      participants.map(async (participant) => {
        const chat = await this.getChatById(participant.chatId, token);
        return chat ? { participant, chat } : null;
      }),
    );

    return chats.filter(Boolean) as ChatWithParticipant[];
  }
  async getAllChatParticipants(
    creatorProfileId: string,
    targetProfileId: string,
    token: string,
  ) {
    try {
      if (!creatorProfileId || !targetProfileId || !token) {
        throw new Error(
          "Creator profile id or target profile id or token is not defined",
        );
      }
      const res = await api.get(`/api/v3/chat/chatParticipants/profilesId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          creatorProfileId,
          targetProfileId,
        },
      });
      return res.data ?? null;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Something went wrong", error.message as unknown);
      }
    }
  }
}
export const chatService = new ChatService();
