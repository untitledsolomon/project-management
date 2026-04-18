"use client";

import { useState } from "react";
import { TaskComment, useCreateComment } from "@/lib/tasks/queries";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";

interface TaskCommentsProps {
  taskId: string;
  comments: TaskComment[];
}

export function TaskComments({ taskId, comments }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const createCommentMutation = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || createCommentMutation.isPending) return;

    await createCommentMutation.mutateAsync({
      task_id: taskId,
      body: newComment.trim(),
    });

    setNewComment("");
  };

  return (
    <div className="space-y-8">
      {/* Comment Feed */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar
              fallback={comment.user?.full_name?.charAt(0) || "U"}
              src={comment.user?.avatar_url}
              size="sm"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  {comment.user?.full_name || "Unknown User"}
                </span>
                <span className="text-[10px] text-muted font-mono uppercase">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="text-sm text-secondary leading-relaxed bg-surface-1 p-3 rounded-lg border border-border-base">
                {comment.body}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-4 items-start">
        <Avatar fallback="Me" size="sm" />
        <div className="flex-1 space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full min-h-[100px] p-3 text-sm bg-white border border-border-base rounded-lg focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all resize-none shadow-sm"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              className="gap-2"
              disabled={!newComment.trim() || createCommentMutation.isPending}
            >
              <Send size={14} />
              {createCommentMutation.isPending ? "Sending..." : "Send Comment"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
