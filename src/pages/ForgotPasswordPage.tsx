import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 실제 비밀번호 찾기 구현은 API 연결 시 추가 예정
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      console.log("비밀번호 찾기 요청:", email);
    }, 1000);
  };

  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">비밀번호 찾기</CardTitle>
            <CardDescription>
              {/* 가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다 */}
            </CardDescription>
          </CardHeader>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="가입한 이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "요청 중..." : "비밀번호 재설정 링크 받기"}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  <Button variant="link" asChild className="h-auto p-0">
                    <Link to="/login">로그인으로 돌아가기</Link>
                  </Button>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="rounded-md bg-primary/10 p-4 text-center">
                <p className="text-primary">
                  비밀번호 재설정 링크가 <strong>{email}</strong>로 발송되었습니다.
                  <br />이메일을 확인해주세요.
                </p>
              </div>
              <div className="text-center">
                <Button variant="link" asChild className="mt-4">
                  <Link to="/login">로그인으로 돌아가기</Link>
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage; 