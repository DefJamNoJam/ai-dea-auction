"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider"; 
import { useLanguage } from "./language-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Globe, Brain, User, LogOut } from "lucide-react";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
  ];
  
  // --- ✨ 수정된 부분: 로컬 AuthProvider의 user 객체 구조에 맞게 되돌립니다 ---
  const displayName = user?.name || user?.email || 'My Account';

  const renderAuthSection = () => {
    if (isLoading) {
      return <div className="h-7 w-28 bg-gray-200 animate-pulse rounded-md"></div>;
    }
    if (user) {
      return (
        <div className="flex items-center space-x-2">
          <Link href="/mypage">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2"/>
              {displayName}
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      );
    }
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
      >
        {t("auth.login")}
      </Link>
    );
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">AI-dea Auction</span>
        </Link>

        <nav className="hidden md:flex items-center justify-center flex-1 space-x-12">
            <Link href="/" className="text-base font-bold hover:text-purple-800 hover:scale-105 transition-all duration-200 ease-in-out">{t("nav.home")}</Link>
            <Link href="/browse" className="text-base font-bold hover:text-purple-800 hover:scale-105 transition-all duration-200 ease-in-out">{t("nav.browse")}</Link>
            <Link href="/marketplace" className="text-base font-bold hover:text-purple-800 hover:scale-105 transition-all duration-200 ease-in-out">{t("nav.marketplace")}</Link>
            <Link href="/ideas/submit" className="text-base font-bold hover:text-purple-800 hover:scale-105 transition-all duration-200 ease-in-out">{t("nav.sell")}</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
            <SelectTrigger className="w-[160px]">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {renderAuthSection()}
          
        </div>
      </div>
    </header>
  );
}