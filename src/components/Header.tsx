import React, { useState, useEffect } from "react";
import logoImg from "../assets/images/tran_ngoc_tung_logo_1785497100287.jpg";
import { 
  BookOpen, 
  Sparkles, 
  Brain, 
  Award, 
  Grid, 
  Bookmark, 
  CheckCircle,
  PlusCircle,
  Share2,
  User as UserIcon,
  ShieldCheck,
  Layers,
  Sun,
  Moon,
  PenTool,
  Youtube,
  Activity,
  Flame,
  Mic,
  FileText,
  Users,
  Settings
} from "lucide-react";
import { UserAccount, isStoredAdmin } from "../lib/userAccount";
import { ScrollableHorizontalBar } from "./common/ScrollableHorizontalBar";

export type NavTabType = "vocab" | "kanji" | "grammar" | "ai-filter" | "flashcard" | "quiz" | "dashboard" | "srs" | "speech" | "reading";

interface HeaderProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  totalCount: number;
  learnedCount: number;
  bookmarkedCount: number;
  currentAccount: UserAccount | null;
  userStreak?: number;
  userXP?: number;
  dueSRSCount?: number;
  onOpenAddModal: () => void;
  onOpenShareModal: () => void;
  onOpenAuthModal: () => void;
  onOpenAdminModal: () => void;
  onOpenSettingsModal?: () => void;
  onOpenStudyGroupModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalCount,
  learnedCount,
  bookmarkedCount,
  currentAccount,
  userStreak = 1,
  userXP = 0,
  dueSRSCount = 0,
  onOpenAddModal,
  onOpenShareModal,
  onOpenAuthModal,
  onOpenAdminModal,
  onOpenSettingsModal,
  onOpenStudyGroupModal,
}) => {
  const isAdmin = isStoredAdmin();

  // Dark/Light Theme state
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "light";
    }
    return false;
  });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    const nextLight = !isLightMode;
    setIsLightMode(nextLight);
    if (nextLight) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur border-b border-amber-900/30 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          {/* Logo, Streak & Gamification Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="relative group cursor-pointer"
                title="Trần Ngọc Tùng 日本語 Master"
              >
                <img 
                  src={logoImg} 
                  alt="Trần Ngọc Tùng Logo" 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border-2 border-amber-500/40 shadow-lg group-hover:scale-105 transition-transform relative z-10"
                />
                <div 
                  onClick={onOpenAdminModal}
                  className="absolute -bottom-1 -right-1 z-20 w-4 h-4 rounded-full bg-red-600 border border-stone-900 flex items-center justify-center text-[9px] text-white font-bold hover:scale-125 transition-transform cursor-pointer shadow-sm"
                  title="Master Badge"
                >
                  日
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base md:text-lg font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-stone-100 to-amber-400 bg-clip-text text-transparent font-serif-jp">
                    Trần Ngọc Tùng
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    日本語 Master
                  </span>
                </div>

                {/* Gamification Streak & XP Display */}
                <div className="flex items-center gap-2 text-[11px] font-bold mt-0.5">
                  <span className="flex items-center gap-1 text-red-400 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 fill-red-400" />
                    <span>Streak: {userStreak} ngày</span>
                  </span>
                  <span className="text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                    ⚡ {userXP} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Mobile Action Buttons */}
            <div className="md:hidden flex items-center gap-1.5">
              {onOpenSettingsModal && (
                <button
                  onClick={onOpenSettingsModal}
                  className="p-1.5 rounded-lg bg-stone-800 text-amber-300 border border-stone-700"
                  title="Cài đặt"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
              {onOpenStudyGroupModal && (
                <button
                  onClick={onOpenStudyGroupModal}
                  className="p-1.5 rounded-lg bg-stone-800 text-amber-300 border border-stone-700"
                  title="Bảng xếp hạng"
                >
                  <Users className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onOpenAuthModal}
                className="px-2 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-[11px] text-emerald-300"
              >
                <UserIcon className="w-3.5 h-3.5 inline mr-1" />
                {currentAccount ? currentAccount.username : "TK"}
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex-1 min-w-0">
            <ScrollableHorizontalBar className="gap-1 pb-1 md:pb-0">
            {/* SRS Review Tab */}
            <button
              onClick={() => setActiveTab("srs")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === "srs"
                  ? "bg-amber-500 text-stone-950 shadow-md font-extrabold"
                  : dueSRSCount > 0
                  ? "bg-amber-950/80 text-amber-300 border border-amber-500/50 animate-pulse"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/80"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Ôn SRS SM-2</span>
              {dueSRSCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-extrabold">
                  {dueSRSCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("vocab")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "vocab"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/80"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Từ vựng ({totalCount})</span>
            </button>

            <button
              onClick={() => setActiveTab("flashcard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === "flashcard"
                  ? "bg-amber-500 text-stone-950 shadow-md font-black"
                  : "text-amber-300 bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Học Theo Chủ Đề</span>
            </button>

            <button
              onClick={() => setActiveTab("kanji")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === "kanji"
                  ? "bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-inner"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/80"
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-amber-400" />
              <span>Viết Kanji</span>
            </button>

            <button
              onClick={() => setActiveTab("speech")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === "speech"
                  ? "bg-red-600/30 text-red-300 border border-red-500/50 shadow-inner"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/80"
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-red-400" />
              <span>Luyện Nói AI</span>
            </button>

            <button
              onClick={() => setActiveTab("reading")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === "reading"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/80"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Bài Đọc AI</span>
            </button>

            <button
              onClick={() => setActiveTab("grammar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === "grammar"
                  ? "bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-inner"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/80"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Ngữ Pháp</span>
            </button>

            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "quiz"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/80"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === "dashboard"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-inner"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/80"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tiến Độ</span>
            </button>
            </ScrollableHorizontalBar>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {onOpenStudyGroupModal && (
              <button
                onClick={onOpenStudyGroupModal}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-all"
                title="Bảng xếp hạng & Nhóm học"
              >
                <Users className="w-4 h-4" />
              </button>
            )}

            {onOpenSettingsModal && (
              <button
                onClick={onOpenSettingsModal}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-all"
                title="Cài đặt & Trợ năng"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={toggleTheme}
              className={`relative inline-flex items-center h-7 w-12 rounded-full p-0.5 transition-colors border ${
                isLightMode ? "bg-amber-100 border-amber-300" : "bg-stone-800 border-stone-700"
              }`}
              title={isLightMode ? "Chuyển sang Tối" : "Chuyển sang Sáng"}
            >
              <span
                className={`transform transition-transform flex items-center justify-center w-6 h-6 rounded-full shadow-md ${
                  isLightMode ? "translate-x-5 bg-amber-500 text-stone-950" : "translate-x-0 bg-stone-900 text-amber-300"
                }`}
              >
                {isLightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </span>
            </button>

            <button
              onClick={onOpenAuthModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                currentAccount
                  ? "bg-emerald-950/80 border-emerald-700 text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="max-w-[100px] truncate">
                {currentAccount ? currentAccount.username : "Tài khoản"}
              </span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-xs font-bold text-white shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

