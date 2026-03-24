"use client";
import SearchBar from "@/components/ui/searchBar/chatSearchBar/searchBar";
import { UserRound } from "lucide-react";
import { chatService } from "@/lib/services/chatService/ChatService";
import { useEffect, useState } from "react";
import { ChatWithParticipant, MessageResponseData } from "@/lib/types/types";
import { messageService } from "@/lib/services/messageService/MessageService";
import { profileService } from "@/lib/services/ProfileServices/ProfileService";

export default function ChatPage() {
  const [chatData, setChatData] = useState<ChatWithParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMesssage] = useState<MessageResponseData[]>([]);
  const [profileId, setProfileId] = useState<string>();
  const [avatars, setAvatars] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (chatData.length === 0) return;

    const fetchAvatars = async () => {
      const token = localStorage.getItem("accessToken");
      const results: Record<string, string | null> = {};

      await Promise.all(
        chatData.map(async ({ participant }) => {
          const avatar = await profileService.getAvatarUrl(
            participant.profileId,
            token,
          );
          console.log(avatar);
          results[participant.profileId] = avatar;
          console.log(results);
        }),
      );

      setAvatars(results);
    };

    fetchAvatars();
  }, [chatData]);

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("accessToken");
      const profileId = localStorage.getItem("profileId");
      setProfileId(profileId);
      try {
        setIsLoading(true);
        const res = await chatService.getChat(profileId, token);
        setChatData(res);
      } catch (error) {
        setIsError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, []);
  useEffect(() => {
    if (selectedChat === null) {
      return;
    }

    const profileId = localStorage.getItem("profileId");
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const res = await messageService.getMessages(selectedChat, profileId);
        setMesssage(res);
      } catch (error) {
        setIsError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [selectedChat]);
  return (
    <div className="flex h-screen border-2 border-black rounded-r-2xl">
      <section className="flex flex-col w-90 border-r-2 border-black">
        <SearchBar />
        <div className="flex flex-col overflow-y-auto">
          {isLoading && <p>Loading...</p>}
          {isError && <p className="text-red-500">{isError}</p>}
          {chatData.map(({ participant, chat }) => (
            <div
              key={participant.id}
              onClick={() => setSelectedChat(participant.chatId)}
              className="cursor-pointer border-b border-t border-slate-500 w-full px-4 py-2 hover:bg-slate-100"
            >
              <div className="flex items-center">
                {avatars[participant.profileId] ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL}${avatars[participant.profileId]}`}
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

      <section className="flex flex-col flex-1 p-4 overflow-y-auto">
        {selectedChat === null ? (
          <p className="text-slate-400">
            Wybierz czat żeby zobaczyć wiadomości
          </p>
        ) : (
          message.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-2 ${msg.profileId === profileId ? "justify-end" : "justify-start"}`}
            >
              <div className="bg-slate-100 rounded-2xl px-4 py-2 max-w-xs">
                <p>{msg.content}</p>
                <p className="text-xs text-slate-400">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
