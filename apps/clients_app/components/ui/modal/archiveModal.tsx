type ArchiveModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ArchiveModal({
  onConfirm,
  onCancel,
}: ArchiveModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-80 h-auto px-2 py-2 ">
        <h2 className="text-center font-semibold">
          Are you sure you want to archive this post
        </h2>
        <h3 className="text-slate-600 font-semibold text-center">
          If you archive this post only you will be able to see this post
        </h3>
        <div className="mt-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50   text-sm "
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}
