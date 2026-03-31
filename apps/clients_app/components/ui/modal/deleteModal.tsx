type DeleteModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteModal({ onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-80 h-30 px-2 py-2 ">
        <h2 className="text-center font-semibold">
          Are you sure you want to delete this post
        </h2>
        <h3 className="text-red-600 font-semibold text-center">
          You can't reverse that action
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
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
