"use client";
import { useEffect, useMemo, useState } from "react";

type CreateGroupModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    groupName: string;
    description?: string;
    targetProfileIds: string[];
  }) => void;
  isSubmitting?: boolean;
  error?: string;
};

export default function CreateGroupModal({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  error = "",
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [membersRaw, setMembersRaw] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!open) return;
    setLocalError("");
  }, [open]);

  const parsedIds = useMemo(
    () =>
      membersRaw
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    [membersRaw],
  );

  const handleCancel = () => {
    setGroupName("");
    setDescription("");
    setMembersRaw("");
    setLocalError("");
    onClose();
  };

  const handleSubmit = () => {
    const uniqueIds = [...new Set(parsedIds)];
    if (!groupName.trim()) {
      setLocalError("Nazwa grupy jest wymagana");
      return;
    }
    if (uniqueIds.length === 0) {
      setLocalError("Podaj co najmniej jeden profileId");
      return;
    }

    onSubmit({
      groupName: groupName.trim(),
      description: description.trim() || undefined,
      targetProfileIds: uniqueIds,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-105 rounded-2xl bg-white p-4 shadow-2xl">
        <h2 className="mb-3 text-lg font-semibold">Utwórz grupę</h2>

        <label className="text-sm">Nazwa grupy</label>
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mt-1 mb-3 w-full rounded-md border px-3 py-2"
          placeholder="np. Frontend Team"
        />

        <label className="text-sm">Opis (opcjonalnie)</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 mb-3 w-full rounded-md border px-3 py-2"
          placeholder="Krótki opis grupy"
        />

        <label className="text-sm">Profile ID uczestników (po przecinku)</label>
        <textarea
          value={membersRaw}
          onChange={(e) => setMembersRaw(e.target.value)}
          className="mt-1 mb-2 min-h-24 w-full rounded-md border px-3 py-2"
          placeholder="id1,id2,id3"
        />

        {(localError || error) && (
          <p className="mb-2 text-sm text-red-600">{localError || error}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border px-3 py-2 text-sm"
            disabled={isSubmitting}
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Tworzenie..." : "Utwórz"}
          </button>
        </div>
      </div>
    </div>
  );
}
