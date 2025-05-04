import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { useSignup } from "../hooks/auth/useSignup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SignupRequest } from "@/api/auth";

const SignupPage = () => {
  const { isLoading, error, handleSignup } = useSignup();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
    adhd_diagnosis: false,
    diagnosis_date: "",
    interests: "",
    avatar_url: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // 비밀번호 확인 필드 변경 시 일치 여부 검사
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password' && confirmPassword && value !== confirmPassword) {
        setPasswordError('비밀번호가 일치하지 않습니다.');
      } else if (name === 'confirmPassword' && formData.password !== value) {
        setPasswordError('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (formData.password !== value) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // 회원가입 API 호출
    await handleSignup({
      email: formData.email,
      password: formData.password,
      username: formData.username,
      fullname: formData.fullname,
      // API에 필요한 다른 필드들도 전달
      adhd_diagnosis: formData.adhd_diagnosis,
      diagnosis_date: formData.diagnosis_date || null,
      interests: formData.interests || null,
      avatar_url: formData.avatar_url || null
    });
  };

  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
            <CardDescription>라이프 마스터리 커뮤니티에 가입하세요</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
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
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">닉네임</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="사용할 닉네임을 입력하세요"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullname">이름</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  placeholder="이름을 입력하세요"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="adhd_diagnosis" 
                    name="adhd_diagnosis"
                    checked={formData.adhd_diagnosis}
                    onCheckedChange={(checked) => 
                      setFormData({
                        ...formData,
                        adhd_diagnosis: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="adhd_diagnosis">ADHD 진단을 받았습니다</Label>
                </div>
              </div>
              {formData.adhd_diagnosis && (
                <div className="space-y-2">
                  <Label htmlFor="diagnosis_date">진단일자 (선택사항)</Label>
                  <Input
                    id="diagnosis_date"
                    name="diagnosis_date"
                    type="date"
                    value={formData.diagnosis_date || ''}
                    onChange={handleChange}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="interests">관심사 (선택사항)</Label>
                <Input
                  id="interests"
                  name="interests"
                  placeholder="관심 주제를 입력하세요"
                  value={formData.interests || ''}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  예: 업무 집중력, 루틴 관리, 감정 조절 등
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading || !!passwordError}>
                {isLoading ? "가입 중..." : "가입하기"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <Button variant="link" asChild className="h-auto p-0">
                  <Link to="/login">로그인하기</Link>
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default SignupPage; 