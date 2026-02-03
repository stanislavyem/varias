import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, Building2, Clock } from "lucide-react";
import type { Comment } from "@shared/schema";

interface CommentWithDetails extends Comment {
  organizationName: string;
  authorName: string;
  authorImage: string | null;
}

export default function CommentsPage() {
  const [search, setSearch] = useState("");

  const { data: comments, isLoading } = useQuery<CommentWithDetails[]>({
    queryKey: ["/api/comments"],
  });

  const filteredComments = comments?.filter(
    (comment) =>
      comment.body.toLowerCase().includes(search.toLowerCase()) ||
      comment.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      comment.authorName.toLowerCase().includes(search.toLowerCase())
  );

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
        <p className="text-muted-foreground">
          View all comments across assessments and action items
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search comments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-testid="input-search-comments"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredComments && filteredComments.length > 0 ? (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <Card key={comment.id} data-testid={`card-comment-${comment.id}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={comment.authorImage || undefined} />
                    <AvatarFallback>
                      {comment.authorName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.authorName}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {comment.organizationName}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(comment.createdAt!)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.body}</p>
                    {(comment.assessmentId || comment.actionItemId) && (
                      <p className="text-xs text-muted-foreground">
                        {comment.assessmentId && `Assessment #${comment.assessmentId.slice(0, 8)}`}
                        {comment.actionItemId && `Action Item #${comment.actionItemId.slice(0, 8)}`}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No comments found</h3>
            <p className="text-muted-foreground text-center">
              {search
                ? "Try adjusting your search terms"
                : "Comments will appear here when added to assessments or action items"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
