import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BoardHeader from "@/components/board/BoardHeader";
import BoardFilters from "@/components/board/BoardFilters";
import PostsList from "@/components/posts/PostsList";
import { PostData, BoardType } from "@/components/posts/PostCard";
import { getPosts, Post, GetPostsParams } from "@/api/posts";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Board configuration
const boardConfig = {
  tips: {
    title: "ADHD 극복 꿀팁공유",
    description: "ADHD 관리 방법, 생활 팁 등을 공유하는 공간",
    path: "/tips",
    apiSlug: "freeboard"  // 모든 게시판이 freeboard를 사용
  },
  free: {
    title: "자유게시판",
    description: "일상적인 대화와 소통을 위한 공간",
    path: "/free",
    apiSlug: "freeboard"
  },
  positive: {
    title: "긍정·자랑 게시판",
    description: "성취나 긍정적 경험을 공유하는 공간",
    path: "/positive",
    apiSlug: "freeboard"
  },
  knowledge: {
    title: "지식정보·칼럼",
    description: "ADHD 관련 전문 지식, 연구 정보, 칼럼 등 제공",
    path: "/knowledge",
    apiSlug: "freeboard"
  }
};

// Mock posts data
const mockPosts: Record<string, PostData[]> = {
  tips: [
    {
      id: "t1",
      title: "ADHD와 함께하는 업무 집중력 향상 전략",
      content: "ADHD가 있는 성인들이 업무 환경에서 집중력을 높일 수 있는 실용적인 전략과 기술을 공유합니다. 작업 분할부터 포모도로 기법까지 다양한 방법을 소개합니다.",
      author: { id: "u1", name: "집중력마스터", avatar: "/avatar1.png" },
      createdAt: "2025-04-18T10:30:00Z",
      commentsCount: 24,
      likesCount: 105,
      isBookmarked: true,
      tags: ["집중력", "업무효율", "시간관리"],
      boardType: "tips"
    },
    {
      id: "t2",
      title: "잊어버리지 않는 습관 만들기: ADHD 친화적 기억력 향상법",
      content: "일상에서 자주 물건을 잊어버리거나 약속을 잊는 문제를 해결하는 실용적인 방법들을 공유합니다.",
      author: { id: "u4", name: "기억력장인", avatar: "/avatar4.png" },
      createdAt: "2025-04-15T14:20:00Z",
      commentsCount: 35,
      likesCount: 128,
      tags: ["기억력", "습관형성", "일상관리"],
      boardType: "tips"
    },
    {
      id: "t3",
      title: "감정 조절 어려움 극복하기: ADHD와 정서 관리",
      content: "ADHD로 인한 감정 기복과 충동성을 조절하는 방법과 마음 챙김 기술을 소개합니다.",
      author: { id: "u5", name: "마음챙김", avatar: "/avatar5.png" },
      createdAt: "2025-04-14T11:10:00Z",
      commentsCount: 27,
      likesCount: 96,
      tags: ["감정조절", "마음챙김", "충동성"],
      boardType: "tips"
    },
    {
      id: "t4",
      title: "ADHD에 효과적인 시간 관리 시스템 구축하기",
      content: "ADHD 특성을 고려한 효과적인 시간 관리 시스템을 만들고 유지하는 방법을 단계별로 설명합니다.",
      author: { id: "u6", name: "시간관리전문가", avatar: "/avatar6.png" },
      createdAt: "2025-04-12T09:45:00Z",
      commentsCount: 31,
      likesCount: 84,
      tags: ["시간관리", "계획세우기", "우선순위"],
      boardType: "tips"
    },
    {
      id: "t5",
      title: "ADHD와 함께 살아가기: 일상 루틴 최적화 방법",
      content: "일상 생활에서 루틴을 만들고 유지하는 것이 어렵다면? ADHD 친화적인 방식으로 루틴을 최적화하는 방법을 소개합니다.",
      author: { id: "u7", name: "루틴마스터", avatar: "/avatar7.png" },
      createdAt: "2025-04-10T16:20:00Z",
      commentsCount: 19,
      likesCount: 72,
      tags: ["루틴", "생활습관", "일상관리"],
      boardType: "tips"
    },
    {
      id: "t6",
      title: "ADHD와 공부법: 학습 효율을 높이는 10가지 방법",
      content: "ADHD가 있는 학생들과 성인 학습자들을 위한 효율적인 공부 방법과 지식 습득 전략을 정리했습니다.",
      author: { id: "u8", name: "학습전략가", avatar: "/avatar8.png" },
      createdAt: "2025-04-08T13:15:00Z",
      commentsCount: 42,
      likesCount: 115,
      tags: ["학습법", "공부전략", "집중력향상"],
      boardType: "tips"
    }
  ],
  free: [
    {
      id: "f1",
      title: "ADHD와 함께 살아가는 일상 이야기",
      content: "어제는 또 열쇠를 잃어버려서 집 앞에서 30분을 기다렸네요. 여러분도 이런 경험 있으신가요?",
      author: { id: "u10", name: "일상공유자", avatar: "/avatar10.png" },
      createdAt: "2025-04-19T08:30:00Z",
      commentsCount: 28,
      likesCount: 36,
      boardType: "free"
    },
    {
      id: "f2",
      title: "약물 복용 경험 공유해요",
      content: "콘서타를 처음 복용하기 시작했는데, 다른 분들의 경험도 궁금합니다. 효과와 부작용에 대해 이야기해요.",
      author: { id: "u11", name: "약물경험자", avatar: "/avatar11.png" },
      createdAt: "2025-04-18T15:45:00Z",
      commentsCount: 47,
      likesCount: 52,
      boardType: "free"
    },
    {
      id: "f3",
      title: "추천하는 ADHD 관련 도서가 있나요?",
      content: "ADHD에 대해 더 알고 싶은데 추천할 만한 책이 있으면 공유해주세요!",
      author: { id: "u12", name: "독서광", avatar: "/avatar12.png" },
      createdAt: "2025-04-17T10:20:00Z",
      commentsCount: 32,
      likesCount: 41,
      boardType: "free"
    }
  ],
  positive: [
    {
      id: "p1",
      title: "ADHD 진단 후 달라진 내 삶의 이야기",
      content: "30대에 ADHD 진단을 받은 후 겪은 변화와 새롭게 찾은 자아에 대한 이야기입니다. 진단이 주는 안도감과 자기 이해의 여정을 함께 나눕니다.",
      author: { id: "u2", name: "새로운시작", avatar: "/avatar2.png" },
      createdAt: "2025-04-17T15:45:00Z",
      commentsCount: 42,
      likesCount: 87,
      tags: ["진단경험", "자기수용", "치료경험"],
      boardType: "positive"
    },
    {
      id: "p2",
      title: "작은 성취: 일주일 동안 모든 일정 지키기 성공!",
      content: "항상 약속 시간을 놓치곤 했는데, 새로운 알림 시스템 덕분에 일주일 동안 모든 약속을 제시간에 지켰어요!",
      author: { id: "u13", name: "성취달성", avatar: "/avatar13.png" },
      createdAt: "2025-04-15T09:10:00Z",
      commentsCount: 31,
      likesCount: 64,
      boardType: "positive"
    },
    {
      id: "p3",
      title: "하이퍼포커스의 힘으로 프로젝트 완성했어요",
      content: "ADHD의 하이퍼포커스를 활용해 3년간 미루던 작업을 일주일 만에 완성했습니다. 저만의 집중력 활용법을 공유합니다.",
      author: { id: "u14", name: "하이퍼포커서", avatar: "/avatar14.png" },
      createdAt: "2025-04-12T14:30:00Z",
      commentsCount: 24,
      likesCount: 73,
      tags: ["하이퍼포커스", "창의성", "성취"],
      boardType: "positive"
    }
  ],
  knowledge: [
    {
      id: "k1",
      title: "최신 ADHD 연구 동향: 성인 ADHD의 이해",
      content: "성인 ADHD에 관한 최신 연구 결과와 치료 접근법에 관한 정보를 정리했습니다. 신경학적 기전부터 효과적인 약물 및 비약물 치료까지 전문 정보를 공유합니다.",
      author: { id: "u3", name: "연구자", avatar: "/avatar3.png" },
      createdAt: "2025-04-16T09:15:00Z",
      commentsCount: 18,
      likesCount: 64,
      tags: ["연구", "약물치료", "신경과학"],
      boardType: "knowledge"
    },
    {
      id: "k2",
      title: "ADHD와 공존질환: 불안장애와 우울증의 관계",
      content: "ADHD와 함께 자주 나타나는 공존질환에 대한 이해와 통합적 접근에 관한 최신 연구 정보를 공유합니다.",
      author: { id: "u15", name: "정신건강전문가", avatar: "/avatar15.png" },
      createdAt: "2025-04-14T11:30:00Z",
      commentsCount: 26,
      likesCount: 57,
      tags: ["공존질환", "불안", "우울증"],
      boardType: "knowledge"
    },
    {
      id: "k3",
      title: "ADHD의 뇌과학: 실행기능과 도파민의 역할",
      content: "ADHD의 신경생물학적 이해와 뇌의 실행기능, 도파민 체계에 대한 최신 연구 결과를 정리했습니다.",
      author: { id: "u16", name: "뇌과학연구자", avatar: "/avatar16.png" },
      createdAt: "2025-04-10T10:00:00Z",
      commentsCount: 32,
      likesCount: 81,
      tags: ["뇌과학", "실행기능", "도파민"],
      boardType: "knowledge"
    }
  ]
};

const BoardPage = () => {
  const { boardType = "tips" } = useParams<{ boardType: keyof typeof boardConfig }>();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [currentSort, setCurrentSort] = useState<"latest" | "popular" | "views">("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Board configuration based on route
  const currentBoard = boardConfig[boardType as keyof typeof boardConfig] || boardConfig.tips;

  // Fetch posts on mount and when filters change
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // API 호출 파라미터 설정
        const params: GetPostsParams = {
          page: 1,
          limit: 20
        };
        
        // 정렬 옵션 설정
        if (currentSort === "latest") {
          params.sort = "created_at";
          params.order = "desc";
        } else if (currentSort === "popular") {
          params.sort = "view_count";
          params.order = "desc";
        }
        
        // API 호출
        const response = await getPosts(currentBoard.apiSlug, params);
        
        if (response.success && response.data) {
          // API 응답 데이터를 컴포넌트 형식에 맞게 변환
          const formattedPosts: PostData[] = response.data.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content || "",
            author: {
              id: post.author?.id || "",
              name: post.author?.username || "익명",
              avatar: post.author?.avatar_url || ""
            },
            createdAt: post.created_at,
            commentsCount: 0, // API에서 제공하지 않는 경우 기본값
            likesCount: 0, // API에서 제공하지 않는 경우 기본값
            tags: post.tags?.map(tag => tag.name) || [],
            boardType: boardType
          }));
          
          setPosts(formattedPosts);
        } else {
          setError(response.message || "게시글을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("게시글을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [boardType, currentSort, searchQuery, currentBoard.apiSlug]);

  // Go to post detail
  const goToPostDetail = (id: string) => {
    navigate(`/${boardType}/${id}`);
  };

  // Go to create post
  const goToCreatePost = () => {
    navigate(`/${boardType}/create`);
  };

  return (
    <Layout>
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentBoard.title}
            </h1>
            <p className="mt-2 text-muted-foreground">{currentBoard.description}</p>
          </div>
          
          {isAuthenticated && (
            <Button onClick={goToCreatePost} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>글 작성</span>
            </Button>
          )}
        </div>
        
        <BoardFilters 
          currentSort={currentSort}
          onSortChange={setCurrentSort}
          onSearch={setSearchQuery}
        />
        
        {isLoading ? (
          <div className="my-12 text-center">
            <p>게시글을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="my-12 text-center">
            <h3 className="text-xl font-medium text-destructive">{error}</h3>
          </div>
        ) : posts.length > 0 ? (
          <PostsList posts={posts} onPostClick={goToPostDetail} />
        ) : (
          <div className="my-12 text-center">
            <h3 className="text-xl font-medium">게시글이 없습니다</h3>
            <p className="mt-2 text-muted-foreground">
              {searchQuery 
                ? "검색 조건에 맞는 게시글이 없습니다. 다른 검색어로 시도해보세요." 
                : "첫 번째 게시글을 작성해보세요!"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BoardPage;
