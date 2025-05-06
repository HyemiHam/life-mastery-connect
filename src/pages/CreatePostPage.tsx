import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createPost, CreatePostRequest } from "@/api/posts";
import { toast } from "@/hooks/use-toast";

// Board configuration
const boardConfig = {
  tips: {
    title: "ADHD 극복 꿀팁공유",
    description: "ADHD 관리 방법, 생활 팁 등을 공유하는 공간",
    path: "/tips",
    apiSlug: "freeboard" // 게시판 slug
  },
  free: {
    title: "자유게시판",
    description: "일상적인 대화와 소통을 위한 공간",
    path: "/free",
    apiSlug: "freeboard" // 게시판 slug
  },
  positive: {
    title: "긍정·자랑 게시판",
    description: "성취나 긍정적 경험을 공유하는 공간",
    path: "/positive",
    apiSlug: "freeboard" // 게시판 slug
  },
  knowledge: {
    title: "지식정보·칼럼",
    description: "ADHD 관련 전문 지식, 연구 정보, 칼럼 등 제공",
    path: "/knowledge",
    apiSlug: "freeboard" // 게시판 slug
  }
};

const CreatePostPage = () => {
  const { boardType = "tips" } = useParams<{ boardType: keyof typeof boardConfig }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 현재 게시판 설정
  const currentBoard = boardConfig[boardType as keyof typeof boardConfig] || boardConfig.tips;

  // 로그인 상태 확인
  if (!isAuthenticated || !user) {
    // 로그인 페이지로 리다이렉트
    navigate('/login', { state: { message: "게시글 작성을 위해 로그인이 필요합니다." } });
    return null;
  }

  // 게시글 작성 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 게시글 데이터 준비
      const postData: CreatePostRequest = {
        board_id: currentBoard.apiSlug, // 게시판 ID
        title: title.trim(),
        content: content.trim()
      };
      
      // API 호출
      const response = await createPost(postData);
      
      if (response.success && response.data) {
        toast({
          title: "게시글 작성 완료",
          description: "게시글이 성공적으로 작성되었습니다."
        });
        
        // 게시판 페이지로 이동
        navigate(`/${boardType}`);
      } else {
        toast({
          title: "오류",
          description: response.message || "게시글 작성에 실패했습니다.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("게시글 작성 오류:", error);
      toast({
        title: "오류",
        description: "게시글 작성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 뒤로 가기
  const goBack = () => {
    navigate(`/${boardType}`);
  };

  return (
    <Layout>
      <div className="mx-auto">
        {/* 뒤로 가기 버튼 */}
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-1"
          onClick={goBack}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>게시판으로 돌아가기</span>
        </Button>

        <Card className="mx-auto">
          <CardHeader>
            <CardTitle>{currentBoard.title} - 새 글 작성</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  placeholder="게시글 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <Textarea
                  id="content"
                  placeholder="게시글 내용을 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px]"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreatePostPage; 