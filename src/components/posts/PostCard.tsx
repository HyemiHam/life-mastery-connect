import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BoardType = "tips" | "free" | "positive" | "knowledge";

export interface PostData {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  commentsCount: number;
  likesCount: number;
  isBookmarked?: boolean;
  tags?: string[];
  boardType: BoardType;
}

interface PostCardProps {
  post: PostData;
  compact?: boolean;
  onPostClick?: (id: string) => void;
}

const PostCard = ({ post, compact = false, onPostClick }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handlePostClick = () => {
    if (onPostClick) {
      onPostClick(post.id);
    }
  };

  return (
    <Card className={cn("h-full overflow-hidden transition-shadow hover:shadow-md",
      compact ? "border-0 shadow-none hover:shadow-none" : ""
    )}>
      <CardContent className={compact ? "p-3" : "p-6"}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          {post.boardType && !compact && (
            <Link
              to={`/${post.boardType}`}
              className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
            >
              {post.boardType === "tips" && "ADHD 극복 꿀팁"}
              {post.boardType === "free" && "자유게시판"}
              {post.boardType === "positive" && "긍정·자랑"}
              {post.boardType === "knowledge" && "지식정보"}
            </Link>
          )}
        </div>

        <div onClick={handlePostClick} className="cursor-pointer">
          <h3 className={cn("mb-2 font-semibold line-clamp-2", 
            compact ? "text-base" : "text-xl")}>
            {post.title}
          </h3>
          <p className={cn("mb-4 text-muted-foreground line-clamp-3", 
            compact ? "text-sm" : "text-base")}>
            {truncateText(post.content, compact ? 100 : 150)}
          </p>
        </div>

        {post.tags && post.tags.length > 0 && !compact && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className={cn(
        "border-t border-border flex items-center justify-between",
        compact ? "p-3" : "px-6 py-4"
      )}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8">
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentsCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8">
            <Heart className={cn("h-4 w-4", post.isBookmarked ? "fill-primary text-primary" : "")} />
            <span>{post.likesCount}</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className={cn("h-4 w-4", post.isBookmarked ? "fill-primary text-primary" : "")} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
