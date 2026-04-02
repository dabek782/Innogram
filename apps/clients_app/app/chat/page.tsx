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

export default function ChatPage() {
  const [chatData, setChatData] = useState<ChatWithParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageResponseData[]>([]);
  const [avatars, setAvatars] = useState<Record<string, string | null>>({});

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

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchAvatars = async (guestProfileId: string) => {
    const token = localStorage.getItem("accessToken");
    const avatarUrl = profileService.getAvatarUrl(guestProfileId, token);
    return avatarUrl;
  };

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setIsError("");

        const token = localStorage.getItem("accessToken");
        const res = await messageService.getMessages(selectedChat, token);

        console.log("selectedChat:", selectedChat);
        console.log("messages response:", res);
        console.log("is array?", Array.isArray(res));

        if (Array.isArray(res)) {
          setMessages(res);
        } else {
          console.error("getMessages did not return an array:", res);
          setMessages([]);
          setIsError("Messages response is not an array");
        }
      } catch (error) {
        console.error("fetchMessages error:", error);
        setIsError(
          error instanceof Error ? error.message : "Failed to fetch messages",
        );
      } finally {
        setIsLoading(false);
      }
    };

    const handleIncomingMessage = (newMessage: MessageResponseData) => {
      console.log("incoming socket message:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    fetchMessages();

    socketRef.current?.on("message", handleIncomingMessage);

    return () => {
      socketRef.current?.off("message", handleIncomingMessage);
    };
  }, [selectedChat]);

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
      "createRoom",
      {
        chatInfo: {
          name: targetProfileId,
          description: undefined,
          type: "private",
        },
        targetProfileId,
      },
      (ack: {
        ok: boolean;
        message?: string;
        data?: { newChat?: { id: string } };
      }) => {
        if (!ack?.ok) {
          setIsError(ack?.message ?? "Failed to create room");
        }
        const chatId = ack.data?.newChat.id;
        setSelectedChat(chatId);
        fetchChats();
      },
    );
    // fetchAvatars(targetProfileId);
  };

  return (
    <div className="flex h-screen border-2 border-black ">
      <section className="flex flex-col w-90 border-r-2 border-black">
        <SearchBar onProfileClicked={(id) => handleNewChatRoom(id)} />

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
                {avatars[participant.profileId] ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}/${fetchAvatars(profileId)}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                ) : (
                  <UserRound className="text-customBG border-2 border-black rounded-2xl mr-2" />
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
                  <p className="text-xs text-slate-400">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedChat && <MessageInput onSend={sendMessage} />}
      </section>
    </div>
  );
}
