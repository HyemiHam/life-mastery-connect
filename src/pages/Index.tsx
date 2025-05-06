import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PostsList from "@/components/posts/PostsList";
import { BoardType } from "@/components/posts/PostCard";

// Mock data for featured posts
const featuredPosts = [
  {
    id: "1",
    title: "ADHD와 함께하는 업무 집중력 향상 전략",
    content: "ADHD가 있는 성인들이 업무 환경에서 집중력을 높일 수 있는 실용적인 전략과 기술을 공유합니다. 작업 분할부터 포모도로 기법까지 다양한 방법을 소개합니다.",
    author: { id: "u1", name: "집중력마스터", avatar: "/avatar1.png" },
    createdAt: "2025-04-18T10:30:00Z",
    commentsCount: 24,
    likesCount: 105,
    isBookmarked: true,
    tags: ["집중력", "업무효율", "시간관리"],
    boardType: "tips" as BoardType
  },
  {
    id: "2",
    title: "ADHD 진단 후 달라진 내 삶의 이야기",
    content: "30대에 ADHD 진단을 받은 후 겪은 변화와 새롭게 찾은 자아에 대한 이야기입니다. 진단이 주는 안도감과 자기 이해의 여정을 함께 나눕니다.",
    author: { id: "u2", name: "새로운시작", avatar: "/avatar2.png" },
    createdAt: "2025-04-17T15:45:00Z",
    commentsCount: 42,
    likesCount: 87,
    tags: ["진단경험", "자기수용", "치료경험"],
    boardType: "positive" as BoardType
  },
  {
    id: "3",
    title: "최신 ADHD 연구 동향: 성인 ADHD의 이해",
    content: "성인 ADHD에 관한 최신 연구 결과와 치료 접근법에 관한 정보를 정리했습니다. 신경학적 기전부터 효과적인 약물 및 비약물 치료까지 전문 정보를 공유합니다.",
    author: { id: "u3", name: "연구자", avatar: "/avatar3.png" },
    createdAt: "2025-04-16T09:15:00Z",
    commentsCount: 18,
    likesCount: 64,
    tags: ["연구", "약물치료", "신경과학"],
    boardType: "knowledge" as BoardType
  }
];

const popularTips = [
  {
    id: "4",
    title: "잊어버리지 않는 습관 만들기: ADHD 친화적 기억력 향상법",
    content: "일상에서 자주 물건을 잊어버리거나 약속을 잊는 문제를 해결하는 실용적인 방법들을 공유합니다.",
    author: { id: "u4", name: "기억력장인", avatar: "/avatar4.png" },
    createdAt: "2025-04-15T14:20:00Z",
    commentsCount: 35,
    likesCount: 128,
    boardType: "tips" as BoardType
  },
  {
    id: "5",
    title: "감정 조절 어려움 극복하기: ADHD와 정서 관리",
    content: "ADHD로 인한 감정 기복과 충동성을 조절하는 방법과 마음 챙김 기술을 소개합니다.",
    author: { id: "u5", name: "마음챙김", avatar: "/avatar5.png" },
    createdAt: "2025-04-14T11:10:00Z",
    commentsCount: 27,
    likesCount: 96,
    boardType: "tips" as BoardType
  }
];

const welcomeMessages = [
  "ADHD의 강점을 발견하고 성장하는 여정에 함께해요.",
  "당신의 고유한 경험과 통찰을 나눠주세요.",
  "함께 배우고 성장하는 ADHD 커뮤니티에 오신 것을 환영합니다.",
  "어려움은 나눌수록 가벼워지고, 기쁨은 나눌수록 커집니다.",
  "당신이 겪는 도전과 성취를 이해하는 사람들이 여기 있습니다."
];

const Index = () => {
  const [isLoggedIn] = useState(false); // In a real app, this would come from auth context
  const [welcomeIndex] = useState(Math.floor(Math.random() * welcomeMessages.length));
  
  return (
    <Layout>
      {/* Hero Message */}
      <div className="mx-auto max-w-4xl text-center py-16 px-6">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block">성취와 성장을 위한</span>
          <span className="block text-primary">라이프 마스터리 커뮤니티</span>
        </h1>
      </div>

      {/* Featured Posts */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">주목할 만한 글</h2>
          <Button variant="ghost" asChild>
            <Link to="/explore">더보기</Link>
          </Button>
        </div>
        <PostsList posts={featuredPosts} />
      </section>

      {/* Board Categories */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">게시판</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="bg-primary/10 pb-2">
              <CardTitle>ADHD 극복 꿀팁공유</CardTitle>
              <CardDescription>ADHD 관리 방법, 생활 팁 등을 공유하는 공간</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <PostsList posts={popularTips} compact />
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link to="/tips">바로가기</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="bg-accent/50 pb-2">
              <CardTitle>자유게시판</CardTitle>
              <CardDescription>일상적인 대화와 소통을 위한 공간</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-muted-foreground">
                생각과 경험을 자유롭게 나눠보세요. 진지한 고민부터 가벼운 일상까지 모두 환영합니다.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/free">바로가기</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="bg-[#f5e9ff] pb-2">
              <CardTitle>긍정·자랑 게시판</CardTitle>
              <CardDescription>성취나 긍정적 경험을 공유하는 공간</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-muted-foreground">
                작은 성취도 큰 의미가 있습니다. 자신의 성공 경험과 긍정적인 순간을 자랑해보세요.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/positive">바로가기</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="bg-[#e3f1fc] pb-2">
              <CardTitle>지식정보·칼럼</CardTitle>
              <CardDescription>ADHD 관련 전문 지식, 연구 정보, 칼럼 등 제공</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-muted-foreground">
                최신 연구 결과와 검증된 정보를 통해 ADHD에 대한 이해를 높이세요.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/knowledge">바로가기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community Stats */}
      <section className="rounded-lg bg-muted p-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center text-2xl font-bold">성장하는 커뮤니티</h2>
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div className="rounded-lg bg-background p-4 shadow-sm">
              <p className="text-3xl font-bold text-primary">1,240+</p>
              <p className="text-sm text-muted-foreground">회원</p>
            </div>
            <div className="rounded-lg bg-background p-4 shadow-sm">
              <p className="text-3xl font-bold text-primary">5,800+</p>
              <p className="text-sm text-muted-foreground">게시글</p>
            </div>
            <div className="rounded-lg bg-background p-4 shadow-sm">
              <p className="text-3xl font-bold text-primary">24,500+</p>
              <p className="text-sm text-muted-foreground">댓글</p>
            </div>
            <div className="rounded-lg bg-background p-4 shadow-sm">
              <p className="text-3xl font-bold text-primary">150+</p>
              <p className="text-sm text-muted-foreground">매일 방문자</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
