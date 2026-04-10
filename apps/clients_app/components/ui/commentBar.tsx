"use client";

import { useState } from "react";

type CommentBarProps = {
  onSubmit: (content: string) => void;
  disabled?: boolean;
};

export default function CommentBar({ onSubmit, disabled }: CommentBarProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Add a comment
      </label>
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <textarea
          value={value}
          placeholder="Share your thoughts..."
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          disabled={disabled}
          className="w-full resize-none rounded-2xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-customBG focus:ring-2 focus:ring-customBG/20 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className="inline-flex items-center rounded-full bg-customBG px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Post comment
          </button>
        </div>
      </div>
    </div>
  );
}
