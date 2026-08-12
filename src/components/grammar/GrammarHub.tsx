import React, { useState, useEffect, useMemo, useDeferredValue } from "react";
import { 
  GrammarItem, 
  GrammarLevel, 
  GrammarStatus, 
  UserGrammarProgress 
} from "../../types";
import { INITIAL_GRAMMAR_DATA } from "../../data/grammarData";
import { GrammarCard } from "./GrammarCard";
import { GrammarDetailModal } from "./GrammarDetailModal";
import { GrammarPractice } from "./GrammarPractice";
import { GrammarAITutor } from "./GrammarAITutor";
import { GrammarMindMap } from "./GrammarMindMap";
import { GrammarSentenceBuilder } from "./GrammarSentenceBuilder";
import { ScrollableHorizontalBar } from "../common/ScrollableHorizontalBar";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Award, 
  Flame, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Bookmark, 
  GitBranch, 
  Puzzle, 
  MessageSquare,
  Trophy,
  RefreshCw,
  Layers,
  ChevronRight,
  User as UserIcon
} from "lucide-react";

import { 
  UserAccount,
  recordActivityLog,
  loadUserProgress,
  saveUserProgress
} from "../../lib/userAccount";
import { apiUrl } from "../../utils/api";
import { fetchApprovedGlobalGrammar } from "../../lib/submissionService";
import { AddGrammarModal } from "./AddGrammarModal";
import { EnsoEmptyState } from "../EnsoEmptyState";

interface GrammarHubProps {
  currentAccountId?: string;
  currentAccount?: UserAccount | null;
  onRequireAccount?: (actionNotice: string) => boolean;
}

const STORAGE_KEY_PROGRESS = "nihongo_grammar_progress_v1";
const STORAGE_KEY_CUSTOM_ITEMS = "nihongo_custom_grammar_v1";
const STORAGE_KEY_GAMIFICATION = "nihongo_grammar_gamification_v1";

function deduplicateGrammarList(items: GrammarItem[]): GrammarItem[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const result: GrammarItem[] = [];

  for (const item of items) {
    if (seenIds.has(item.id)) continue;

    const normalizedTitle = item.title
      .split("(")[0]
      .replace(/[^a-zA-Z0-9ぁ-んァ-ン一-龯]/g, "")
      .toLowerCase();

    if (normalizedTitle && seenTitles.has(normalizedTitle)) continue;

    seenIds.add(item.id);
    if (normalizedTitle) seenTitles.add(normalizedTitle);
    result.push(item);
  }

  return result;
}

export const GrammarHub: React.FC<GrammarHubProps> = ({ 
  currentAccountId, 
  currentAccount,
  onRequireAccount
}) => {
  const [activeTab, setActiveTab] = useState<"library" | "practice" | "ai-tutor" | "mindmap" | "builder">("library");

  // Custom Items State (added by AI on demand)
  const [customGrammar, setCustomGrammar] = useState<GrammarItem[]>(() => {
    if (!currentAccount) return [];
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_CUSTOM_ITEMS}_${currentAccount.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Progress Map: grammarId -> UserGrammarProgress
  const [progressMap, setProgressMap] = useState<Record<string, UserGrammarProgress>>(() => {
    if (!currentAccount) return {};
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PROGRESS}_${currentAccount.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load account grammar progress whenever active account changes
  useEffect(() => {
    if (!currentAccount) {
      setProgressMap({});
      setCustomGrammar([]);
      return;
    }

    let isMounted = true;
    async function initGrammarWorkspace() {
      try {
        const accountData = await loadUserProgress(currentAccount!);
        if (!isMounted) return;

        if (accountData.grammarProgressMap) {
          setProgressMap(accountData.grammarProgressMap);
        } else {
          const saved = localStorage.getItem(`${STORAGE_KEY_PROGRESS}_${currentAccount!.id}`);
          if (saved) setProgressMap(JSON.parse(saved));
        }

        if (accountData.grammarCustomItems) {
          setCustomGrammar(accountData.grammarCustomItems);
        } else {
          const savedCustom = localStorage.getItem(`${STORAGE_KEY_CUSTOM_ITEMS}_${currentAccount!.id}`);
          if (savedCustom) setCustomGrammar(JSON.parse(savedCustom));
        }
      } catch (err) {
        console.error("Lỗi đồng bộ tiến độ ngữ pháp tài khoản:", err);
      }
    }

    initGrammarWorkspace();
    return () => {
      isMounted = false;
    };
  }, [currentAccount]);

  // Save Progress to Cloud Firestore & Local Storage when changed for logged-in account
  useEffect(() => {
    if (!currentAccount) return;

    try {
      localStorage.setItem(`${STORAGE_KEY_PROGRESS}_${currentAccount.id}`, JSON.stringify(progressMap));
      localStorage.setItem(`${STORAGE_KEY_CUSTOM_ITEMS}_${currentAccount.id}`, JSON.stringify(customGrammar));
    } catch (err) {
      console.error("Lỗi lưu cache local grammar:", err);
    }

    saveUserProgress(currentAccount, {
      grammarProgressMap: progressMap,
      grammarCustomItems: customGrammar
    });
  }, [progressMap, customGrammar, currentAccount]);

  // Approved global grammar items from Cloud Firestore
  const [approvedGlobalGrammar, setApprovedGlobalGrammar] = useState<GrammarItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch approved global grammar from Cloud Firestore
  useEffect(() => {
    let isMounted = true;
    async function loadGlobalApproved() {
      try {
        const approved = await fetchApprovedGlobalGrammar();
        if (isMounted && approved.length > 0) {
          setApprovedGlobalGrammar(approved);
        }
      } catch (err) {
        console.error("Lỗi tải mẫu ngữ pháp đã duyệt:", err);
      }
    }
    loadGlobalApproved();
    return () => {
      isMounted = false;
    };
  }, []);

  // Combined full dataset (auto-deduplicated)
  const allGrammarList = useMemo(() => {
    return deduplicateGrammarList([...INITIAL_GRAMMAR_DATA, ...approvedGlobalGrammar, ...customGrammar]);
  }, [approvedGlobalGrammar, customGrammar]);

  // AI Generator Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateKeyword, setGenerateKeyword] = useState("");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<GrammarLevel | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<GrammarStatus | "All" | "bookmarked">("All");

  const handleGenerateGrammar = async (keywordToGen?: string, levelToGen?: string) => {
    if (!currentAccount) {
      if (onRequireAccount) {
        onRequireAccount("Tài khoản khách chỉ ở Chế độ Xem. Vui lòng tạo hoặc đăng nhập tài khoản cá nhân để nạp thêm ngữ pháp mới!");
      }
      return;
    }

    const kw = keywordToGen || generateKeyword || searchQuery;
    if (!kw.trim()) {
      alert("Vui lòng nhập tên mẫu ngữ pháp hoặc từ khóa (VD: 〜にほかならない hoặc 5 mẫu N2)!");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch(apiUrl("/api/gemini/generate-grammar-item"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: kw,
          level: levelToGen || (selectedLevel !== "All" ? selectedLevel : undefined)
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.items) && data.items.length > 0) {
        // Filter out existing duplicates
        const newItems = data.items.filter(
          (item: GrammarItem) => !allGrammarList.some((existing) => existing.title.toLowerCase().includes(item.title.toLowerCase()) || existing.id === item.id)
        );

        if (newItems.length > 0) {
          setCustomGrammar((prev) => [...newItems, ...prev]);
          alert(`🎉 Đã nạp thành công ${newItems.length} mẫu ngữ pháp JLPT chuẩn mới vào hệ thống!`);
          setGenerateKeyword("");
        } else {
          alert("Mẫu ngữ pháp này đã có sẵn trong danh sách của bạn!");
        }
      } else {
        alert(data.message || data.error || "Không thể tạo mẫu ngữ pháp từ AI.");
      }
    } catch (err) {
      console.error("Error generating grammar:", err);
      alert("Lỗi khi kết nối dịch vụ AI Gemini.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Selected Detail Item
  const [detailItem, setDetailItem] = useState<GrammarItem | null>(null);

  // Gamification State (XP, Streak, Achievements)
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_GAMIFICATION}_xp`);
      return saved ? parseInt(saved, 10) : 120;
    } catch {
      return 120;
    }
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_GAMIFICATION}_streak`);
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  // Save XP
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_GAMIFICATION}_xp`, xp.toString());
  }, [xp]);

  const handleEarnXP = (earned: number) => {
    if (!currentAccount) return;
    setXp((prev) => prev + earned);
  };

  const handleToggleBookmark = (id: string) => {
    if (!currentAccount) {
      if (onRequireAccount) {
        onRequireAccount("Tài khoản khách chỉ ở Chế độ Xem. Vui lòng tạo hoặc đăng nhập tài khoản cá nhân để lưu ngữ pháp vào danh sách yêu thích!");
      }
      return;
    }

    const item = allGrammarList.find((g) => g.id === id);
    if (item && currentAccount) {
      const nextBookmarked = !progressMap[id]?.bookmarked;
      recordActivityLog(currentAccount.id, currentAccount.username, {
        action: nextBookmarked ? "bookmark" : "unbookmark",
        title: nextBookmarked ? `Lưu ngữ pháp: "${item.title}"` : `Bỏ lưu ngữ pháp: "${item.title}"`,
        details: `${item.summary}`,
        category: "Từ vựng",
      });
    }

    setProgressMap((prev) => {
      const current = prev[id] || { status: "unlearned", bookmarked: false, reviewCount: 0 };
      return {
        ...prev,
        [id]: {
          ...current,
          bookmarked: !current.bookmarked
        }
      };
    });
  };

  const handleChangeStatus = (id: string, newStatus: GrammarStatus) => {
    if (!currentAccount) {
      if (onRequireAccount) {
        onRequireAccount("Tài khoản khách chỉ ở Chế độ Xem. Vui lòng tạo hoặc đăng nhập tài khoản cá nhân để đánh dấu trạng thái đang học hoặc thành thục ngữ pháp!");
      }
      return;
    }

    const item = allGrammarList.find((g) => g.id === id);
    if (item && currentAccount) {
      const statusLabel = newStatus === "mastered" ? "Thành thục 🌟" : newStatus === "studying" ? "Đang học 📖" : "Chưa học";
      recordActivityLog(currentAccount.id, currentAccount.username, {
        action: "learned",
        title: `Học Ngữ Pháp (${statusLabel}): "${item.title}"`,
        details: `Công thức: ${item.formula} — ${item.summary}`,
        category: "Học tập",
      });
    }

    setProgressMap((prev) => {
      const current = prev[id] || { status: "unlearned", bookmarked: false, reviewCount: 0 };
      if (newStatus === "mastered" && current.status !== "mastered") {
        setXp((x) => x + 30); // Bonus 30 XP when mastering
      }
      return {
        ...prev,
        [id]: {
          ...current,
          status: newStatus,
          lastReviewedAt: Date.now(),
          reviewCount: (current.reviewCount || 0) + 1
        }
      };
    });
  };

  // Deferred Search Query for smooth input responsiveness
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Filtered List with useMemo
  const filteredGrammar = useMemo(() => {
    return allGrammarList.filter((item) => {
      const p = progressMap[item.id] || { status: "unlearned", bookmarked: false };

      // Search query
      if (deferredSearchQuery.trim()) {
        const q = deferredSearchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchFormula = item.formula.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchFormula) return false;
      }

      // Level
      if (selectedLevel !== "All" && item.level !== selectedLevel) return false;

      // Category
      if (selectedCategory !== "All" && item.category !== selectedCategory) return false;

      // Status
      if (selectedStatus === "bookmarked") {
        if (!p.bookmarked) return false;
      } else if (selectedStatus !== "All") {
        if (p.status !== selectedStatus) return false;
      }

      return true;
    });
  }, [allGrammarList, progressMap, deferredSearchQuery, selectedLevel, selectedCategory, selectedStatus]);

  // Pagination Chunking for high-fps Grammar rendering
  const [grammarVisibleLimit, setGrammarVisibleLimit] = useState<number>(36);

  useEffect(() => {
    setGrammarVisibleLimit(36);
  }, [searchQuery, selectedLevel, selectedCategory, selectedStatus]);

  const displayedGrammar = useMemo(() => {
    return filteredGrammar.slice(0, grammarVisibleLimit);
  }, [filteredGrammar, grammarVisibleLimit]);

  // Calculate Progress Stats
  const totalCount = allGrammarList.length;
  const masteredCount = allGrammarList.filter((g) => progressMap[g.id]?.status === "mastered").length;
  const studyingCount = allGrammarList.filter((g) => progressMap[g.id]?.status === "studying").length;
  const bookmarkedCount = allGrammarList.filter((g) => progressMap[g.id]?.bookmarked).length;

  // Categories list
  const categories = Array.from(new Set(allGrammarList.map((g) => g.category)));

  // Daily Grammar Challenge (Pick one item for today)
  const todayChallenge = allGrammarList[0];

  return (
    <div className="space-y-6">
      {/* Guest Mode Restriction Notice Banner */}
      {!currentAccount && (
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200 shadow-md">
          <div className="flex items-center gap-2.5">
            <UserIcon className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-amber-300">Bạn đang ở Chế độ Xem (Chưa đăng nhập tài khoản cá nhân)</p>
              <p className="text-stone-300 text-[11px] mt-0.5">
                Để đánh dấu ngữ pháp "Đang học", "Thành thục", lưu danh sách yêu thích và bảo lưu tiến độ riêng biệt trên Cloud, bạn hoặc bạn bè cần tạo tài khoản riêng.
              </p>
            </div>
          </div>
          <button
            onClick={() => onRequireAccount?.("Vui lòng tạo hoặc đăng nhập tài khoản cá nhân để lưu và đánh dấu tiến độ học ngữ pháp!")}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold whitespace-nowrap transition-all shadow-sm shrink-0"
          >
            Tạo tài khoản / Đăng nhập ngay
          </button>
        </div>
      )}

      {/* Gamification & Motivation Header Bar */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/60 border border-amber-900/40 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-amber-200 tracking-tight">
                  Học Ngữ Pháp Tiếng Nhật Chuẩn JLPT (N5 - N1)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Master System
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5 font-medium">
                Hệ thống ghi nhớ ngữ pháp thông minh, so sánh sắc thái, luyện tập & AI giải thích chuyên sâu.
              </p>
            </div>
          </div>

          {/* Gamification Badges */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Streak */}
            <div className="px-3.5 py-2 rounded-2xl bg-stone-950/80 border border-orange-500/30 flex items-center gap-2 text-xs shadow-sm">
              <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
              <div>
                <div className="text-[10px] text-stone-400 font-bold uppercase">Chuỗi học</div>
                <div className="font-black text-orange-400">{streakDays} Ngày liên tục</div>
              </div>
            </div>

            {/* XP Points */}
            <div className="px-3.5 py-2 rounded-2xl bg-stone-950/80 border border-amber-500/30 flex items-center gap-2 text-xs shadow-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-stone-400 font-bold uppercase">Điểm thưởng</div>
                <div className="font-black text-amber-300">{xp} XP</div>
              </div>
            </div>

            {/* Level Badge */}
            <div className="px-3.5 py-2 rounded-2xl bg-stone-950/80 border border-emerald-500/30 flex items-center gap-2 text-xs shadow-sm">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-stone-400 font-bold uppercase">Thành tựu</div>
                <div className="font-black text-emerald-300">
                  {masteredCount >= 5 ? "Bậc Thầy N5 🥇" : "Tập Sự Ngữ Pháp 🎯"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar & Summary Stats */}
        <div className="pt-3 border-t border-stone-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-300 font-medium">
            <span>Tiến độ thành thục tổng quan:</span>
            <span className="font-bold text-amber-300">
              {masteredCount} / {totalCount} cấu trúc ({Math.round((masteredCount / totalCount) * 100)}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, Math.round((masteredCount / totalCount) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Module Nav Tabs */}
      <div className="w-full">
        <ScrollableHorizontalBar className="gap-2 pb-1 text-xs">
          <button
            onClick={() => setActiveTab("library")}
            className={`px-4 py-2.5 rounded-2xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap shadow-sm shrink-0 ${
              activeTab === "library"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Kho Mẫu Ngữ Pháp & Tra Cứu</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-stone-950 text-amber-300">
              {filteredGrammar.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("practice")}
            className={`px-4 py-2.5 rounded-2xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap shadow-sm shrink-0 ${
              activeTab === "practice"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. Luyện Tập Interactive</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-tutor")}
            className={`px-4 py-2.5 rounded-2xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap shadow-sm shrink-0 ${
              activeTab === "ai-tutor"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>3. Trợ Lý AI & Sửa Lỗi Câu</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">Gemini</span>
          </button>

          <button
            onClick={() => setActiveTab("mindmap")}
            className={`px-4 py-2.5 rounded-2xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap shadow-sm shrink-0 ${
              activeTab === "mindmap"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800"
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>4. Sơ Đồ Ngữ Pháp (Mind Map)</span>
          </button>

          <button
            onClick={() => setActiveTab("builder")}
            className={`px-4 py-2.5 rounded-2xl font-extrabold flex items-center gap-2 transition-all whitespace-nowrap shadow-sm shrink-0 ${
              activeTab === "builder"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800"
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>5. Xưởng Ghép Câu Tương Tác</span>
          </button>
        </ScrollableHorizontalBar>
      </div>

      {/* TAB 1: LIBRARY & SEARCH */}
      {activeTab === "library" && (
        <div className="space-y-6">
          {/* AI Generator Tool Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/40 border border-amber-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] uppercase tracking-wider">
                    AI Auto-Expansion
                  </span>
                  <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Generative Gemini N5-N1 Engine
                  </span>
                </div>
                <h3 className="text-lg font-black text-amber-100">
                  Nạp thêm Mẫu Ngữ Pháp JLPT (N5 - N1) Tự Động Bằng AI
                </h3>
                <p className="text-xs text-stone-300">
                  Nhập tên bất kỳ mẫu ngữ pháp nào (VD: <code className="text-amber-300 font-mono">〜わけがない</code>, <code className="text-amber-300 font-mono">〜にほかならない</code>) hoặc gõ <code className="text-amber-300 font-mono">5 mẫu N2 mới</code> để AI tự động bổ sung vào thư viện!
                </p>
              </div>

              {/* Instant Level Loading Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-stone-400">Nạp nhanh:</span>
                {(["N5", "N4", "N3", "N2", "N1"] as GrammarLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    disabled={isGenerating}
                    onClick={() => handleGenerateGrammar(`5 mẫu ngữ pháp tiêu biểu trình độ ${lvl}`, lvl)}
                    className="px-2.5 py-1.5 rounded-xl bg-stone-950/80 hover:bg-amber-500 hover:text-stone-950 text-amber-300 font-extrabold text-xs border border-amber-500/30 transition-all disabled:opacity-50"
                  >
                    + {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyword Input & Action */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type="text"
                  value={generateKeyword}
                  onChange={(e) => setGenerateKeyword(e.target.value)}
                  placeholder="Gõ mẫu ngữ pháp bất kỳ (VD: 〜てから, 〜ざるを得ない, 3 mẫu N3...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-950/90 border border-amber-500/30 text-stone-100 text-xs focus:outline-none focus:border-amber-400 font-medium placeholder-stone-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGenerateGrammar();
                  }}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  disabled={isGenerating}
                  onClick={() => handleGenerateGrammar()}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all shrink-0 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                      <span>Đang khởi tạo AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Nạp Về Thư Viện</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!currentAccount) {
                      onRequireAccount?.("Vui lòng tạo hoặc đăng nhập tài khoản cá nhân để gửi yêu cầu nạp mẫu ngữ pháp mới!");
                      return;
                    }
                    setShowAddModal(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg border border-red-500/30 transition-all shrink-0"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>➕ Tự Nạp Mẫu Ngữ Pháp (Gửi duyệt Owner)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Daily Grammar Challenge Card */}
          {todayChallenge && (
            <div className="p-4 md:p-5 rounded-3xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-stone-900 border border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase">Thử thách Ngữ Pháp Hôm Nay</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-extrabold text-[10px]">
                      +30 XP
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-amber-100">{todayChallenge.title}</h4>
                  <p className="text-xs text-stone-300 font-medium">{todayChallenge.summary}</p>
                </div>
              </div>

              <button
                onClick={() => setDetailItem(todayChallenge)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow transition-colors shrink-0"
              >
                <span>Học ngay mẫu này</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-stone-900 p-4 rounded-3xl border border-stone-800 text-xs">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mẫu ngữ pháp, công thức (VD: てから, わけがない...)..."
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-2xl py-2.5 pl-9 pr-3 text-xs text-stone-100 placeholder-stone-600 outline-none transition-colors"
              />
            </div>

            {/* Level Selector */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-200 rounded-2xl py-2.5 px-3 font-semibold outline-none focus:border-amber-500"
              >
                <option value="All">🌐 Tất cả trình độ (N5 - N1)</option>
                <option value="N5">Trình độ N5</option>
                <option value="N4">Trình độ N4</option>
                <option value="N3">Trình độ N3</option>
                <option value="N2">Trình độ N2</option>
                <option value="N1">Trình độ N1</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-200 rounded-2xl py-2.5 px-3 font-semibold outline-none focus:border-amber-500"
              >
                <option value="All">🎯 Tất cả trạng thái</option>
                <option value="unlearned">Chưa học</option>
                <option value="studying">Đang học</option>
                <option value="mastered">Thành thục 🌟</option>
                <option value="bookmarked">Đã lưu yêu thích ⭐</option>
              </select>
            </div>
          </div>

          {/* Grammar Grid List */}
          {filteredGrammar.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedGrammar.map((item) => {
                  const p = progressMap[item.id] || { status: "unlearned", bookmarked: false };
                  return (
                    <GrammarCard
                      key={item.id}
                      item={item}
                      status={p.status}
                      bookmarked={p.bookmarked}
                      onToggleBookmark={handleToggleBookmark}
                      onChangeStatus={handleChangeStatus}
                      onSelectDetail={(itm) => setDetailItem(itm)}
                    />
                  );
                })}
              </div>

              {/* Load More Pagination Bar */}
              {filteredGrammar.length > grammarVisibleLimit && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:p-5 bg-stone-900/80 border border-stone-800/90 rounded-2xl shadow-lg mt-6">
                  <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>
                      Đang hiển thị <strong className="text-amber-300 font-bold">{displayedGrammar.length}</strong> / <strong className="text-stone-100 font-bold">{filteredGrammar.length}</strong> mẫu ngữ pháp
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={() => setGrammarVisibleLimit((prev) => prev + 36)}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs transition-all shadow-md active:scale-95"
                    >
                      <span>Hiển thị thêm (+36 mẫu)</span>
                    </button>
                    <button
                      onClick={() => setGrammarVisibleLimit(filteredGrammar.length)}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all shrink-0"
                    >
                      Tải tất cả ({filteredGrammar.length} mẫu)
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <EnsoEmptyState
              character="無"
              title="Không tìm thấy mẫu ngữ pháp nào phù hợp!"
              description="Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trình độ JLPT."
            />
          )}
        </div>
      )}

      {/* TAB 2: PRACTICE */}
      {activeTab === "practice" && (
        <GrammarPractice
          grammarList={INITIAL_GRAMMAR_DATA}
          onEarnXP={handleEarnXP}
        />
      )}

      {/* TAB 3: AI TUTOR */}
      {activeTab === "ai-tutor" && <GrammarAITutor />}

      {/* TAB 4: MIND MAP */}
      {activeTab === "mindmap" && (
        <GrammarMindMap
          grammarList={INITIAL_GRAMMAR_DATA}
          onSelectGrammar={(itm) => setDetailItem(itm)}
        />
      )}

      {/* TAB 5: SENTENCE BUILDER */}
      {activeTab === "builder" && <GrammarSentenceBuilder />}

      {/* Detail Modal */}
      {detailItem && (
        <GrammarDetailModal
          item={detailItem}
          status={progressMap[detailItem.id]?.status || "unlearned"}
          bookmarked={progressMap[detailItem.id]?.bookmarked || false}
          onClose={() => setDetailItem(null)}
          onToggleBookmark={handleToggleBookmark}
          onChangeStatus={handleChangeStatus}
          onAskAIAboutThis={(query) => {
            setActiveTab("ai-tutor");
          }}
        />
      )}

      {/* Add Grammar Item Modal (Requests Owner Approval) */}
      {showAddModal && (
        <AddGrammarModal
          onClose={() => setShowAddModal(false)}
          currentAccount={currentAccount}
          onAdd={(newItem) => {
            setCustomGrammar((prev) => [newItem, ...prev]);
          }}
        />
      )}
    </div>
  );
};
