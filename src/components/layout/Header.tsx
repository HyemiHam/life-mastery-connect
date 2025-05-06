import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User } from "lucide-react";
import { useLogout } from "@/hooks/auth/useLogout";
import { toast } from "@/hooks/use-toast";
import { User as UserType } from "@/api/auth";

type HeaderProps = {
  isLoggedIn?: boolean;
  user?: UserType | null;
};

const Header = ({ isLoggedIn = false, user = null }: HeaderProps) => {
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const { isLoading, handleLogout } = useLogout();

  const showUnderConstruction = () => {
    toast({
      title: "안내",
      description: "준비 중입니다."
    });
  };

  return (
    <header className="border-b border-border bg-background py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link 
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
            <circle cx="12" cy="10" r="1" />
            <path d="M12 11v3" />
          </svg>
          <span>라이프 마스터리</span>
        </Link>

        {/* Auth Buttons or User Menu */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="font-medium">알림</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setUnreadNotifications(0)}
                    >
                      모두 읽음
                    </Button>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-auto">
                    <DropdownMenuItem className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">내 글에 새 댓글이 달렸습니다</span>
                        <span className="text-sm text-muted-foreground">
                          ADHD 극복 꿀팁 공유 게시판 - 30분 전
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">내 댓글에 답글이 달렸습니다</span>
                        <span className="text-sm text-muted-foreground">
                          자유게시판 - 1시간 전
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url || "/avatar.png"} alt="사용자 아바타" />
                      <AvatarFallback>
                        {user?.user_metadata?.username?.charAt(0) || user?.email?.charAt(0) || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={showUnderConstruction}>
                    <span className="flex w-full">프로필 관리</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={showUnderConstruction}>
                    <span className="flex w-full">내가 쓴 글</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={showUnderConstruction}>
                    <span className="flex w-full">북마크한 글</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={showUnderConstruction}>
                    <span className="flex w-full">알림 설정</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button 
                      className="flex w-full" 
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      {isLoading ? "로그아웃 중..." : "로그아웃"}
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">회원가입</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
