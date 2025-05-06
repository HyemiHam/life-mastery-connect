import { ReactNode } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import { useAuth } from "@/contexts/AuthContext";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn={isAuthenticated} user={user} />
      <Navigation />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      <footer className="border-t border-border bg-secondary py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© 2025 라이프 마스터리. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
