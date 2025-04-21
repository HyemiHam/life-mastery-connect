
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Bookmark, Share2, MessageSquare, Flag, ChevronLeft } from "lucide-react";

// Mock post data - would be fetched from API in real app
const mockPost = {
  id: "1",
  title: "ADHD와 함께하는 업무 집중력 향상 전략",
  content: `<p>ADHD가 있는 성인들이 업무 환경에서 집중력을 높일 수 있는 실용적인 전략과 기술을 공유합니다.</p>
  
  <h2>1. 작업 환경 최적화</h2>
  <p>ADHD에 친화적인 작업 환경을 만드는 것은 집중력 향상에 매우 중요합니다. 소음을 차단하거나 백색 소음을 활용하고, 시각적 산만함을 줄이는 것이 좋습니다. 또한 조명과 온도도 적절하게 유지하세요.</p>
  
  <h2>2. 포모도로 기법 활용</h2>
  <p>25분 작업 후 5분 휴식하는 포모도로 기법은 ADHD가 있는 사람들에게 특히 효과적입니다. 짧은 집중 시간을 설정함으로써 지속적인 집중력을 유지할 수 있습니다.</p>
  
  <h2>3. 작업 분할하기</h2>
  <p>큰 프로젝트나 작업을 작은 단위로 나누면 압도감을 줄이고 성취감을 자주 느낄 수 있습니다. 각 단계를 완료할 때마다 자신에게 작은 보상을 주는 것도 도움이 됩니다.</p>
  
  <h2>4. 시각적 리마인더 활용</h2>
  <p>포스트잇, 화이트보드, 디지털 캘린더 등 시각적 리마인더는 할 일을 잊지 않게 도와줍니다. 눈에 잘 보이는 곳에 작업 목록이나 중요한 마감일을 표시하세요.</p>
  
  <h2>5. 바디더블링 전략</h2>
  <p>집중이 필요한 작업을 할 때 가볍게 몸을 움직이는 것(예: 다리 흔들기, 피젯 토이 사용)이 일부 ADHD 성인에게는 집중력을 향상시킬 수 있습니다.</p>`,
  author: { id: "u1", name: "집중력마스터", avatar: "/avatar1.png" },
  createdAt: "2025-04-18T10:30:00Z",
  views: 342,
  commentsCount: 24,
  likesCount: 105,
  isBookmarked: false,
  isLiked: false,
  tags: ["집중력", "업무효율", "시간관리"],
  boardType: "tips"
};

// Mock comments
const mockComments = [
  {
    id: "c1",
    author: { id: "u5", name: "마음챙김", avatar: "/avatar5.png" },
    content: "포모도로 기법 정말 효과적이에요! 저는 25분이 아닌 15분 단위로 쪼개서 하니까 더 잘 되더라구요.",
    createdAt: "2025-04-18T14:35:00Z",
    likesCount: 12,
    isLiked: false,
    replies: [
      {
        id: "r1",
        author: { id: "u1", name: "집중력마스터", avatar: "/avatar1.png" },
        content: "좋은 의견 감사합니다! 개인에 맞게 시간을 조절하는 것도 좋은 방법이네요.",
        createdAt: "2025-04-18T15:20:00Z",
        likesCount: 5,
        isLiked: false,
      }
    ]
  },
  {
    id: "c2",
    author: { id: "u8", name: "학습전략가", avatar: "/avatar8.png" },
    content: "시각적 리마인더는 정말 중요한 것 같아요. 저는 디지털보다 실물 화이트보드가 더 효과적이더라구요. 눈에 항상 보이니까 잊어버리지 않게 되는 것 같습니다.",
    createdAt: "2025-04-18T11:42:00Z",
    likesCount: 8,
    isLiked: false,
    replies: []
  }
];

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn] = useState(false); // In a real app, this would come from auth context
  const [post, setPost] = useState(mockPost);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Toggle like for post
  const toggleLike = () => {
    if (!isLoggedIn) {
      // Redirect to login in a real app
      alert("로그인이 필요합니다.");
      return;
    }

    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1
    }));
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    if (!isLoggedIn) {
      // Redirect to login in a real app
      alert("로그인이 필요합니다.");
      return;
    }

    setPost(prev => ({
      ...prev,
      isBookmarked: !prev.isBookmarked
    }));
  };

  // Submit comment
  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      // Redirect to login in a real app
      alert("로그인이 필요합니다.");
      return;
    }
    
    if (!newComment.trim()) return;

    // In a real app, this would make an API call
    const newCommentObj = {
      id: `c${Date.now()}`,
      author: { id: "current-user", name: "나", avatar: "/avatar-user.png" },
      content: newComment,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
      replies: []
    };

    setComments(prev => [newCommentObj, ...prev]);
    setNewComment("");
  };

  // Submit reply
  const submitReply = (commentId: string) => {
    if (!isLoggedIn) {
      // Redirect to login in a real app
      alert("로그인이 필요합니다.");
      return;
    }
    
    const replyContent = replyText[commentId];
    if (!replyContent?.trim()) return;

    // In a real app, this would make an API call
    const newReply = {
      id: `r${Date.now()}`,
      author: { id: "current-user", name: "나", avatar: "/avatar-user.png" },
      content: replyContent,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
    };

    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );

    // Clear the reply text for this comment
    setReplyText(prev => ({ ...prev, [commentId]: "" }));
  };

  // Go back to board
  const goBack = () => {
    navigate(`/${post.boardType}`);
  };

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-1"
          onClick={goBack}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>돌아가기</span>
        </Button>

        {/* Post Header */}
        <div className="mb-6 border-b border-border pb-6">
          <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.createdAt)} · 조회 {post.views}
                </p>
              </div>
            </div>
            
            <Link
              to={`/${post.boardType}`}
              className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground"
            >
              {post.boardType === "tips" && "ADHD 극복 꿀팁"}
              {post.boardType === "free" && "자유게시판"}
              {post.boardType === "positive" && "긍정·자랑"}
              {post.boardType === "knowledge" && "지식정보"}
            </Link>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-8">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Actions */}
        <div className="mb-8 flex items-center justify-between border-t border-b border-border py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={toggleLike}
            >
              <Heart
                className={`h-5 w-5 ${
                  post.isLiked ? "fill-primary text-primary" : ""
                }`}
              />
              <span>좋아요 {post.likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={toggleBookmark}
            >
              <Bookmark
                className={`h-5 w-5 ${
                  post.isBookmarked ? "fill-primary text-primary" : ""
                }`}
              />
              <span>북마크</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Flag className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold">댓글 {post.commentsCount}</h2>

          {/* Comment Form */}
          <form onSubmit={submitComment} className="mb-8">
            <Textarea
              placeholder="댓글을 남겨보세요"
              className="mb-3 min-h-[120px]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!isLoggedIn}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!isLoggedIn}>
                댓글 작성
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-border pb-6">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-3 text-base">{comment.content}</div>

                <div className="mb-4 flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground"
                  >
                    <Heart className="mr-1 h-4 w-4" />
                    <span>{comment.likesCount}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground"
                    onClick={() => 
                      setReplyText(prev => ({ 
                        ...prev, 
                        [comment.id]: prev[comment.id] === undefined ? "" : undefined 
                      }))}
                  >
                    <MessageSquare className="mr-1 h-4 w-4" />
                    <span>답글</span>
                  </Button>
                </div>

                {/* Reply Form */}
                {replyText[comment.id] !== undefined && (
                  <div className="mb-4">
                    <Textarea
                      placeholder="답글을 남겨보세요"
                      className="mb-2 min-h-[80px]"
                      value={replyText[comment.id] || ""}
                      onChange={(e) => 
                        setReplyText(prev => ({ 
                          ...prev, 
                          [comment.id]: e.target.value 
                        }))
                      }
                      disabled={!isLoggedIn}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => submitReply(comment.id)}
                        disabled={!isLoggedIn}
                      >
                        답글 작성
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-4 border-l-2 border-border pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div className="mb-2 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                            <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{reply.author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(reply.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm">{reply.content}</div>
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-muted-foreground"
                          >
                            <Heart className="mr-1 h-3 w-3" />
                            <span>{reply.likesCount}</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
