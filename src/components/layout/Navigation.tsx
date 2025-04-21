
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    name: "ADHD 극복 꿀팁공유",
    path: "/tips",
    description: "ADHD 관리 방법, 생활 팁 등을 공유하는 공간",
  },
  {
    name: "자유게시판",
    path: "/free",
    description: "일상적인 대화와 소통을 위한 공간",
  },
  {
    name: "긍정·자랑 게시판",
    path: "/positive",
    description: "성취나 긍정적 경험을 공유하는 공간",
  },
  {
    name: "지식정보·칼럼",
    path: "/knowledge",
    description: "ADHD 관련 전문 지식, 연구 정보, 칼럼 등 제공",
  },
];

const Navigation = () => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="border-b border-border bg-background">
      {/* Desktop Navigation */}
      <div className="container mx-auto hidden items-center justify-center px-4 md:flex">
        <ul className="flex space-x-8">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "block py-4 text-base font-medium relative",
                  "transition-colors hover:text-primary",
                  location.pathname === item.path
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                    : "text-foreground"
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Mobile Navigation */}
      <div className="container mx-auto px-4 md:hidden">
        <div className="flex items-center justify-between py-4">
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex items-center text-base font-medium text-foreground"
          >
            <span>메뉴</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn("ml-2 h-4 w-4 transition-transform", 
                showMobileMenu ? "rotate-180" : "")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={showMobileMenu ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>
        </div>
        
        {showMobileMenu && (
          <ul className="space-y-3 pb-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "block py-2 text-base font-medium",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-foreground"
                  )}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
