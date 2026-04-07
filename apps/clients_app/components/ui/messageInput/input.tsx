import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";

type Props = {
  onSend: (content: string, file?: File | null) => void;
};

export default function MessageInput({ onSend }: Props) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if (!message.trim() && !file) return;
    onSend(message.trim(), file);
    setMessage("");
    setFile(null);
  };
  return (
    <div className="mx-2 my-2">
      <div className="flex items-center gap-2 border-2 w-5xl border-customBG rounded-full px-4 py-2 mx-2 my-2  bg-white">
        <input
          type="text"
          placeholder="Write your message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 outline-none text-gray-700 bg-transparent"
          value={message}
        />

        <label className="cursor-pointer">
          <Paperclip />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <button
          type="submit"
          onClick={handleSend}
          className="bg-customBG text-white p-2 rounded-full hover:scale-110 hover:opacity-90 transition-all duration-200"
        >
          <Send size={16} />
        </button>
      </div>

      {file && (
        <div className="mt-2 inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
          <span className="max-w-52 truncate">{file.name}</span>
          <button type="button" onClick={clearFile}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
