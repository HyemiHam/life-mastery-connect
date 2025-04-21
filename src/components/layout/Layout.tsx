
import { ReactNode } from "react";
import Header from "./Header";
import Navigation from "./Navigation";

type LayoutProps = {
  children: ReactNode;
  isLoggedIn?: boolean;
};

const Layout = ({ children, isLoggedIn = false }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn={isLoggedIn} />
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
