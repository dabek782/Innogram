import { useState } from "react";
import { Send } from "lucide-react";
type Props = {
  onSend: (content: string) => void;
};

export default function MessageInput({ onSend }: Props) {
  const [message, setMessage] = useState("");
  const handleSend = async () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };
  return (
    <div className="flex items-center gap-2 border-2 w-full border-customBG rounded-full px-4 py-2 mx-2 bg-white">
      <input
        type="text"
        placeholder="Write your message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 outline-none text-gray-700 bg-transparent"
        value={message}
      />
      <button
        type="submit"
        onClick={handleSend}
        className="bg-customBG text-white p-2 rounded-full hover:scale-110 hover:opacity-90 transition-all duration-200"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
