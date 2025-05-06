import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Bookmark, Share2, MessageSquare, Flag, ChevronLeft } from "lucide-react";
import { getPostById } from "@/api/posts";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// 게시판 유형과 이름 매핑
const boardNames = {
  tips: "ADHD 극복 꿀팁",
  free: "자유게시판",
  positive: "긍정·자랑",
  knowledge: "지식정보"
};

const PostDetail = () => {
  const { boardType = "free", postId } = useParams<{ boardType: string; postId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!postId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getPostById(postId);
        
        if (response.success && response.data) {
          setPost({
            id: response.data.id,
            title: response.data.title,
            content: response.data.content,
            author: {
              id: response.data.author?.id || "",
              name: response.data.author?.username || "익명",
              avatar: response.data.author?.avatar_url || ""
            },
            createdAt: response.data.created_at,
            views: response.data.view_count,
            commentsCount: 0, // API에서 제공하지 않는 경우 기본값
            likesCount: 0, // API에서 제공하지 않는 경우 기본값
            isBookmarked: false,
            isLiked: false,
            tags: response.data.tags?.map((tag: any) => tag.name) || [],
            boardType: boardType
          });
        } else {
          setError(response.message || "게시글을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("게시글을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId, boardType]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 좋아요 토글
  const toggleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "좋아요를 누르려면 로그인이 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    // 좋아요 API 호출 구현 (추후 구현)
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1
    }));
  };

  // 북마크 토글
  const toggleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "북마크를 추가하려면 로그인이 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    // 북마크 API 호출 구현 (추후 구현)
    setPost(prev => ({
      ...prev,
      isBookmarked: !prev.isBookmarked
    }));
  };

  // 댓글 작성
  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "댓글을 작성하려면 로그인이 필요합니다.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) return;

    // 댓글 작성 API 호출 구현 (추후 구현)
    toast({
      title: "기능 준비 중",
      description: "댓글 기능은 현재 개발 중입니다."
    });

    setNewComment("");
  };

  // 답글 작성
  const submitReply = (commentId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "답글을 작성하려면 로그인이 필요합니다.",
        variant: "destructive"
      });
      return;
    }
    
    const replyContent = replyText[commentId];
    if (!replyContent?.trim()) return;

    // 답글 작성 API 호출 구현 (추후 구현)
    toast({
      title: "기능 준비 중",
      description: "답글 기능은 현재 개발 중입니다."
    });

    // 답글 입력창 초기화
    setReplyText(prev => ({ ...prev, [commentId]: "" }));
  };

  // 게시판으로 돌아가기
  const goBack = () => {
    navigate(`/${boardType}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl p-8 text-center">
          <p>게시글을 불러오는 중...</p>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl p-8 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">오류 발생</h2>
          <p>{error || "게시글을 찾을 수 없습니다."}</p>
          <Button className="mt-4" onClick={goBack}>게시판으로 돌아가기</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
              {boardNames[post.boardType as keyof typeof boardNames] || post.boardType}
            </Link>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-8">
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((line: string, i: number) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
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
              disabled={!isAuthenticated}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!isAuthenticated}>
                댓글 작성
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment: any) => (
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
                        disabled={!isAuthenticated}
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => submitReply(comment.id)}
                          disabled={!isAuthenticated}
                        >
                          답글 작성
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 mt-4 space-y-4 border-l-2 border-border pl-4">
                      {comment.replies.map((reply: any) => (
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
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">첫 번째 댓글을 작성해보세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
