"use client";
import SearchBar from "@/components/ui/searchBar/chatSearchBar/searchBar";
import { UserRound } from "lucide-react";
import { chatService } from "@/lib/services/chatService/ChatService";
import { useEffect, useState } from "react";
import { ChatWithParticipant, MessageResponseData } from "@/lib/types/types";
import { messageService } from "@/lib/services/messageService/MessageService";
import { profileService } from "@/lib/services/ProfileServices/ProfileService";
import MessageInput from "@/components/ui/messageInput/input";
import { useSocket } from "@/lib/hooks/useSocket";
import { getPayloadFromToken } from "../auth/callback/helperFunctions/helpers";
import CreateGroupModal from "@/components/ui/modal/createGroupModal";
export default function ChatPage() {
  const [chatData, setChatData] = useState<ChatWithParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageResponseData[]>([]);
  const [avatars, setAvatars] = useState<Record<string, string | null>>({});
  const [isCreateGroupModal, setIsCreateGroupModal] = useState(false);

  const socketRef = useSocket();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const profileId = getPayloadFromToken(token)?.profileId ?? "";
  const fetchChats = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      setIsLoading(true);
      setIsError("");

      if (!token) {
        setIsError("Missing  token");
        return;
      }
      const res = await chatService.getChat(profileId, token);
      console.log("fetched chats:", res);
      setChatData(res);
    } catch (error) {
      console.error("fetchChats error:", error);
      setIsError(
        error instanceof Error ? error.message : "Failed to fetch chats",
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchChats();
  }, []);
  const sendMessage = async (content: string) => {
    if (!profileId || !selectedChat) return;

    socketRef.current?.emit(
      "sendMessage",
      {
        message: { content },
        chatParticipant: { profileId, chatId: selectedChat },
      },
      (ack: { ok: boolean; message?: string }) => {
        if (!ack.ok) {
          setIsError(ack?.message ?? "failed to send message");
          return;
        }
      },
    );
  };
  const editMessage = async (content: string, messageId: string) => {
    if (!profileId || !selectedChat || !messageId || !content) return;

    socketRef.current?.emit(
      "editMessage",
      {
        message: { id: messageId, content },
        chatParticipant: { profileId, chatId: selectedChat },
      },
      (ack: { ok: boolean; message?: string }) => {
        if (!ack?.ok) {
          setIsError(ack?.message ?? "failed to edit message");
          return;
        }

        setMessages((prev) =>
          prev.map((msg) =>
            String(msg.id) === String(messageId) ? { ...msg, content } : msg,
          ),
        );
      },
    );
  };

  const deleteMessage = async (messageId: string) => {
    if (!profileId || !selectedChat || !messageId) return;

    socketRef.current?.emit(
      "deleteMessage",
      {
        message: { id: messageId },
        chatParticipant: { profileId, chatId: selectedChat },
      },
      (ack: { ok: boolean; message?: string }) => {
        if (!ack?.ok) {
          setIsError(ack?.message ?? "failed to delete message");
          return;
        }

        setMessages((prev) =>
          prev.filter((msg) => String(msg.id) !== String(messageId)),
        );
      },
    );
  };

  const handleChatRooms = async (chatId: string) => {
    console.log("clicked chatId:", chatId);

    if (selectedChat) {
      socketRef.current?.emit("leaveRoom", { chatId: selectedChat });
    }

    if (!profileId) {
      console.log("profileId missing");
      return;
    }

    socketRef.current?.emit(
      "joinRoom",
      {
        chatParticipant: { profileId, chatId },
      },
      (ack: { ok: boolean; message?: string }) => {
        if (!ack?.ok) {
          setIsError(ack.message ?? "Failed to join room");
          return;
        }
        setSelectedChat(chatId);
      },
    );
  };

  async function fetchAvatars(targetProfileId: string): Promise<string | null> {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;
      const avatarUrl = profileService.getAvatarUrl(targetProfileId, token);
      console.log(avatarUrl);
      const url = await avatarUrl;
      if (url === null) return null;

      const base = (
        process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL ?? ""
      ).replace(/\/+$/, "");

      const newUrl = `${base}/${url}`;
      if (newUrl === "http://localhost:3001/null") return null;
      return newUrl;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`avatar fetch failed for ${targetProfileId}`, error);
        setIsError(error.message);
        return null;
      }
    }
  }
  useEffect(() => {
    const runFetchingAvatars = async () => {
      try {
        const profileIds = [
          ...new Set(
            chatData.map((p) =>
              p.chat.type === "private" ? p.chat.name : null,
            ),
          ),
        ].filter(Boolean) as string[];
        if (profileIds.length === 0) {
          setAvatars({});
          return;
        }
        const entries = await Promise.all(
          profileIds.map(async (id) => {
            try {
              return [id, await fetchAvatars(id)] as const;
            } catch {
              return [id, null] as const;
            }
          }),
        );
        console.log(entries);
        setAvatars(Object.fromEntries(entries));
      } catch (error) {
        if (error instanceof Error) {
          setIsError(
            "Something went wrong with avatar pictures" + error.message,
          );
        }
      }
    };
    runFetchingAvatars();
  }, [chatData]);
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setIsError("");

        const token = localStorage.getItem("accessToken");
        const res = await messageService.getMessages(selectedChat, token);

        if (Array.isArray(res)) {
          setMessages(res);
        } else {
          setMessages([]);
          setIsError("Messages response is not an array");
        }
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : "Failed to fetch messages",
        );
      } finally {
        setIsLoading(false);
      }
    };

    const handleIncomingMessage = (newMessage: MessageResponseData) => {
      setMessages((prev) => {
        const exists = prev.some(
          (msg) => String(msg.id) === String(newMessage.id),
        );
        if (exists) {
          return prev.map((msg) =>
            String(msg.id) === String(newMessage.id)
              ? { ...msg, ...newMessage }
              : msg,
          );
        }
        return [...prev, newMessage];
      });
    };

    const handleUpdatedMessage = (updatedMessage: MessageResponseData) => {
      setMessages((prev) =>
        prev.map((msg) =>
          String(msg.id) === String(updatedMessage.id)
            ? { ...msg, ...updatedMessage }
            : msg,
        ),
      );
    };

    const handleDeletedMessage = (deletedMessage: MessageResponseData) => {
      setMessages((prev) =>
        prev.filter((msg) => String(msg.id) !== String(deletedMessage.id)),
      );
    };

    fetchMessages();

    socketRef.current?.on("message", handleIncomingMessage);
    socketRef.current?.on("messageUpdated", handleUpdatedMessage);
    socketRef.current?.on("messageDeleted", handleDeletedMessage);

    return () => {
      socketRef.current?.off("message", handleIncomingMessage);
      socketRef.current?.off("messageUpdated", handleUpdatedMessage);
      socketRef.current?.off("messageDeleted", handleDeletedMessage);
    };
  }, [selectedChat, socketRef]);

  useEffect(() => {
    const handleCreated = (newChat: { id: string }) => {
      socketRef.current?.emit(
        "joinRoom",
        {
          chatParticipant: { profileId, chatId: newChat.id },
        },
        (ack: { ok: boolean; message?: string }) => {
          if (!ack?.ok) {
            setIsError(ack.message ?? "Failed to join room");
            return;
          }
          setSelectedChat(newChat.id);
          fetchChats();
        },
      );
    };

    socketRef.current?.on("chatRoomCreated", handleCreated);

    return () => {
      socketRef.current?.off("chatRoomCreated", handleCreated);
    };
  }, [profileId]);

  const handleNewChatRoom = async (targetProfileId: string) => {
    console.log("handleNewChatRoom called:", targetProfileId);
    console.log("socketRef.current:", socketRef.current);

    socketRef.current?.emit(
      "createPrivateRoom",
      {
        chatInfo: {
          name: targetProfileId,
          description: undefined,
          type: "private",
        },
        targetProfileId,
      },
      (ack: { ok: boolean; message?: string; data?: { chatId?: string } }) => {
        if (!ack?.ok) {
          setIsError(ack.message ?? "Failed to create room");
          return;
        }
        const chatId = ack.data?.chatId;
        if (!(typeof chatId === "string")) {
          setIsError("Chat id is has wrong type");
          return;
        }
        setSelectedChat(chatId);
        fetchChats();
      },
    );
  };
  const handleNewGroupChatRoom = async (
    targetProfileIds: string[],
    groupName: string,
    description?: string,
  ) => {
    if (!Array.isArray(targetProfileIds) || targetProfileIds.length === 0) {
      setIsError("Wybierz co najmniej jednego użytkownika");
      return;
    }

    if (!groupName || !groupName.trim()) {
      setIsError("Nazwa grupy jest wymagana");
      return;
    }

    socketRef.current?.emit(
      "createGroupRoom",
      {
        chatInfo: {
          name: groupName.trim(),
          description,
          type: "group",
        },
        targetProfileIds,
      },
      (ack: { ok: boolean; message?: string; data?: { chatId?: string } }) => {
        if (!ack?.ok) {
          setIsError(ack.message ?? "Failed to create group room");
          return;
        }

        const chatId = ack.data?.chatId;
        if (!(typeof chatId === "string")) {
          setIsError("Chat id is has wrong type");
          return;
        }

        setSelectedChat(chatId);
        fetchChats();
        setIsCreateGroupModal(false);
      },
    );
  };
  return (
    <div className="flex h-screen border-2 border-black ">
      <section className="flex flex-col w-90 border-r-2 border-black">
        <SearchBar onProfileClicked={(id) => handleNewChatRoom(id)} />
        <button
          type="button"
          onClick={() => {
            setIsCreateGroupModal(true);
          }}
          className="rounded-md border px-3 py-2 text-sm bg-customBG text-white"
        >
          Nowa grupa
        </button>
        <div className="flex flex-col overflow-y-auto">
          {isLoading && <p>Loading...</p>}
          {isError && <p className="text-red-500">{isError}</p>}

          {chatData.map(({ participant, chat }) => (
            <div
              key={participant.id}
              onClick={() => handleChatRooms(chat.id)}
              className="cursor-pointer border-b border-t border-slate-500 w-full px-4 py-2 hover:bg-slate-100"
            >
              <div className="flex items-center">
                {avatars[chat.name] ? (
                  <img
                    src={avatars[chat.name]}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                ) : (
                  <UserRound className="text-customBG border-2 border-black rounded-2xl mr-2 w-8 h-8" />
                )}

                <div>
                  <h2>{chat.name}</h2>
                  <p className="text-xs text-slate-400">{chat.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 p-4 overflow-y-auto">
          {selectedChat === null ? (
            <p className="text-slate-400">
              Wybierz czat żeby zobaczyć wiadomości
            </p>
          ) : messages.length === 0 ? (
            <p className="text-slate-400">Brak wiadomości</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-2 ${String(msg.profileId) === String(profileId) ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-xs ${
                    String(msg.profileId) === String(profileId)
                      ? "bg-blue-200"
                      : "bg-slate-100"
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.isEdited && !msg.deleted && (
                    <span className="text-[10px] text-slate-500">
                      (edytowano)
                    </span>
                  )}
                  {msg.deleted && (
                    <p className="text-slate-600">Message edited</p>
                  )}
                  <p className="text-xs text-slate-400">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                  {String(msg.profileId) === String(profileId) && (
                    <div className="mt-1 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const newContent = window.prompt(
                            "Nowa treść wiadomości",
                            msg.content,
                          );
                          if (newContent && newContent.trim()) {
                            editMessage(newContent.trim(), String(msg.id));
                          }
                        }}
                        className="text-xs text-blue-700 hover:underline"
                      >
                        Edytuj
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMessage(String(msg.id))}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Usuń
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {selectedChat && <MessageInput onSend={sendMessage} />}
      </section>
      <CreateGroupModal
        open={isCreateGroupModal}
        onClose={() => setIsCreateGroupModal(false)}
        error={isError}
        onSubmit={({ groupName, description, targetProfileIds }) =>
          handleNewGroupChatRoom(targetProfileIds, groupName, description)
        }
      />
    </div>
  );
}
