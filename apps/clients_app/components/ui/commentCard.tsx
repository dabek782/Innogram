import { CommentResponseData } from "@/lib/types/types";

type CommentCardProps = {
  comment: CommentResponseData;
  level?: number;
};

export default function CommentCard({ comment, level = 0 }: CommentCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 ${level > 0 ? "ml-6" : ""}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {comment.createdById}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-slate-800">{comment.content}</p>
        {comment.replies?.length ? (
          <div className="mt-4 space-y-3">
            {comment.replies.map((reply) => (
              <CommentCard key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
