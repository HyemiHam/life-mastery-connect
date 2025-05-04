import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { useLogin } from "../hooks/auth/useLogin";
import { useToast } from "../hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, handleLogin } = useLogin();

  // useEffect를 사용하여 컴포넌트 마운트 시 또는 location.state가 변경될 때만 토스트 표시
  useEffect(() => {
    // 회원가입 등에서 넘어온 메시지가 있으면 토스트로 표시
    const message = location.state?.message;
    if (message) {
      toast({
        title: "알림",
        description: message,
      });
      
      // 메시지를 표시한 후에는 state에서 제거
      // history API 대신 window.history 사용
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state, toast]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">로그인</CardTitle>
            <CardDescription>아이디와 비밀번호를 입력하세요</CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
              <div className="flex w-full justify-between text-sm text-muted-foreground">
                <Button variant="link" asChild className="h-auto p-0">
                  <Link to="/signup">회원가입</Link>
                </Button>
                <Button variant="link" asChild className="h-auto p-0">
                  <Link to="/forgot-password">비밀번호 찾기</Link>
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage; 