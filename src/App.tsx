import React, { useState, useEffect, useMemo, useRef, useDeferredValue } from "react";
import { 
  Sparkles, 
  Search, 
  RotateCcw,
  Cloud,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  Brain,
  Flame,
  Award
} from "lucide-react";

import { VocabItem, FilterState } from "./types";
import { INITIAL_VOCABULARY, deduplicateVocabList } from "./data/vocabulary";
import { Header, NavTabType } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { VocabCard } from "./components/VocabCard";
import { VocabDetailModal } from "./components/VocabDetailModal";
import { EnsoEmptyState } from "./components/EnsoEmptyState";

import TopicCardDeck from "./components/TopicCardDeck";
import { QuizMode } from "./components/QuizMode";
import { AIExtractor } from "./components/AIExtractor";
import { AddVocabModal } from "./components/AddVocabModal";
import { ExportShareModal } from "./components/ExportShareModal";
import { AuthModal } from "./components/AuthModal";
import { AdminModal } from "./components/AdminModal";
import { GrammarHub } from "./components/grammar/GrammarHub";
import { KanjiHub } from "./components/kanji/KanjiHub";
import { LearningDashboard } from "./components/LearningDashboard";
import { SRSReviewSection } from "./components/SRSReviewSection";
import { KanjiBrushCanvas } from "./components/KanjiBrushCanvas";
import { AIPronunciationShadowing } from "./components/AIPronunciationShadowing";
import { AIReadingPassages } from "./components/AIReadingPassages";
import { OnboardingModal } from "./components/OnboardingModal";
import { StudyGroupModal } from "./components/StudyGroupModal";
import { AccessibilitySettingsModal } from "./components/AccessibilitySettingsModal";

import { loadSRSMap, saveSRSMap, getDueVocabItems, SRSItemState } from "./utils/srsEngine";
import { loadUserStats, addXPAndCheckBadges, UserStats } from "./utils/gamification";

import { 
  UserAccount, 
  getStoredAccount, 
  storeAccount, 
  loadUserProgress, 
  saveUserProgress,
  recordActivityLog,
  resetAccountData,
  resetGuestAppData
} from "./lib/userAccount";
import { fetchApprovedGlobalVocab } from "./lib/submissionService";

const STORAGE_KEY_VOCAB = "nihongo_master_vocab_v1";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>("vocab");

  // User Account & Isolated Workspace state
  const [currentAccount, setCurrentAccount] = useState<UserAccount | null>(() => getStoredAccount());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptNotice, setAuthPromptNotice] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const isSyncingRef = useRef(false);

  // Gamification & SRS State
  const [userStats, setUserStats] = useState<UserStats>(() => loadUserStats(currentAccount?.id));
  const [srsMap, setSrsMap] = useState<Record<string, SRSItemState>>(() => loadSRSMap(currentAccount?.id));

  // Accessibility & Theme State
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return localStorage.getItem("nihongo_onboarded_v1") !== "true";
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStudyGroupOpen, setIsStudyGroupOpen] = useState<boolean>(false);

  // Keyboard shortcut Ctrl+Shift+A for Admin Panel
  useEffect(() => {
    const search = window.location.search.toLowerCase();
    if (search.includes("admin") || search.includes("8696")) {
      setIsAdminModalOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSecretAdminTrigger = () => {
    setIsAdminModalOpen(true);
  };

  // Vocabulary State
  const [vocabulary, setVocabulary] = useState<VocabItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOCAB);
      if (saved) {
        const parsed: VocabItem[] = JSON.parse(saved);
        return deduplicateVocabList([...parsed, ...INITIAL_VOCABULARY]);
      }
    } catch (err) {
      console.error("Lỗi đọc LocalStorage:", err);
    }
    return INITIAL_VOCABULARY;
  });

  // Filter State
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: "",
    jlpt: "All",
    category: "All",
    wordType: "all",
    status: "all",
  });

  // Modal States
  const [selectedWord, setSelectedWord] = useState<VocabItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // SRS Due items computation
  const { dueItems: dueSRSItems } = useMemo(() => {
    return getDueVocabItems(vocabulary, srsMap);
  }, [vocabulary, srsMap]);

  const handleUpdateSRS = (vocabId: string, newState: SRSItemState) => {
    const nextMap = { ...srsMap, [vocabId]: newState };
    setSrsMap(nextMap);
    saveSRSMap(nextMap, currentAccount?.id);

    // Reward XP
    const { updatedStats } = addXPAndCheckBadges(20, { learnedWordsCount: vocabulary.filter(v=>v.learned).length }, currentAccount?.id);
    setUserStats(updatedStats);
  };

  // Load account user progress & approved global vocab
  useEffect(() => {
    async function initAccountWorkspace() {
      let approvedGlobal: VocabItem[] = [];
      try {
        approvedGlobal = await fetchApprovedGlobalVocab();
      } catch (e) {
        console.warn("Lỗi tải vocabulary đã duyệt từ Firestore:", e);
      }

      if (!currentAccount) {
        try {
          const saved = localStorage.getItem(STORAGE_KEY_VOCAB);
          if (saved) {
            const parsed: VocabItem[] = JSON.parse(saved);
            setVocabulary(deduplicateVocabList([...parsed, ...approvedGlobal, ...INITIAL_VOCABULARY]));
          } else {
            setVocabulary(deduplicateVocabList([...approvedGlobal, ...INITIAL_VOCABULARY]));
          }
        } catch (e) {
          console.error("Lỗi tải guest data:", e);
        }
        return;
      }

      isSyncingRef.current = true;
      try {
        const accountData = await loadUserProgress(currentAccount);
        const { learnedIds, bookmarkedIds, customWords } = accountData;

        const combined = deduplicateVocabList([...customWords, ...approvedGlobal, ...INITIAL_VOCABULARY]).map((item) => ({
          ...item,
          learned: learnedIds.includes(item.id),
          bookmarked: bookmarkedIds.includes(item.id),
        }));
        setVocabulary(combined);
      } catch (err) {
        console.error("Lỗi kết nối không gian cá nhân:", err);
      } finally {
        isSyncingRef.current = false;
      }
    }

    initAccountWorkspace();
  }, [currentAccount]);

  // Sync state changes to Cloud Firestore / LocalStorage
  useEffect(() => {
    if (isSyncingRef.current) return;

    if (currentAccount) {
      const learnedIds = vocabulary.filter((v) => v.learned).map((v) => v.id);
      const bookmarkedIds = vocabulary.filter((v) => v.bookmarked).map((v) => v.id);
      const customWords = vocabulary.filter((v) => v.custom);

      saveUserProgress(currentAccount, {
        learnedIds,
        bookmarkedIds,
        customWords,
      });
    } else {
      try {
        localStorage.setItem(STORAGE_KEY_VOCAB, JSON.stringify(vocabulary));
      } catch (err) {
        console.error("Lỗi lưu LocalStorage:", err);
      }
    }
  }, [vocabulary, currentAccount]);

  const requireAccountGuard = (actionMessage: string): boolean => {
    if (!currentAccount) {
      setAuthPromptNotice(actionMessage);
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  const handleImportVocabulary = (imported: VocabItem[]) => {
    if (!requireAccountGuard("Vui lòng đăng nhập tài khoản riêng để nhập từ mới!")) return;
    setVocabulary((prev) => deduplicateVocabList([...imported, ...prev]));
  };

  const handleToggleLearned = (id: string) => {
    if (!requireAccountGuard("Vui lòng tạo/đăng nhập tài khoản cá nhân để lưu từ đã thuộc!")) return;
    setVocabulary((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, learned: !item.learned } : item
      )
    );
    const { updatedStats } = addXPAndCheckBadges(15, { learnedWordsCount: vocabulary.filter(v=>v.learned).length + 1 }, currentAccount?.id);
    setUserStats(updatedStats);
  };

  const handleToggleBookmark = (id: string) => {
    if (!requireAccountGuard("Vui lòng tạo/đăng nhập tài khoản cá nhân để lưu từ yêu thích!")) return;
    setVocabulary((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
      )
    );
  };

  const handleAddWords = (newWords: VocabItem[]) => {
    if (!requireAccountGuard("Chỉ tài khoản đã đăng nhập mới có thể thêm từ vựng mới!")) return;
    const customItems = newWords.map((w) => ({ ...w, custom: true }));
    setVocabulary((prev) => deduplicateVocabList([...customItems, ...prev]));
    const { updatedStats } = addXPAndCheckBadges(30 * newWords.length, {}, currentAccount?.id);
    setUserStats(updatedStats);
  };

  const handleResetFilters = () => {
    setFilter({
      searchQuery: "",
      jlpt: "All",
      category: "All",
      wordType: "all",
      status: "all",
    });
  };

  const handleLoginSuccess = (account: UserAccount) => {
    setCurrentAccount(account);
  };

  const handleLogout = () => {
    storeAccount(null);
    setCurrentAccount(null);
  };

  const handleResetCurrentAccountData = async () => {
    if (currentAccount) {
      await resetAccountData(currentAccount);
      setVocabulary((prev) =>
        prev.map((item) => ({ ...item, learned: false, bookmarked: false })).filter((item) => !item.custom)
      );
    } else {
      resetGuestAppData();
      setVocabulary(INITIAL_VOCABULARY);
    }
  };

  const handleResetEntireAppData = () => {
    resetGuestAppData();
    setVocabulary(INITIAL_VOCABULARY);
    setCurrentAccount(null);
  };

  // Deferred Filter State for instant input responsiveness
  const deferredFilter = useDeferredValue(filter);

  // Filtered Vocabulary Computation
  const filteredVocabulary = useMemo(() => {
    return vocabulary.filter((item) => {
      if (deferredFilter.searchQuery.trim()) {
        const q = deferredFilter.searchQuery.toLowerCase().trim();
        const matchKanji = item.kanji.toLowerCase().includes(q);
        const matchHiragana = item.hiragana.toLowerCase().includes(q);
        const matchRomaji = item.romaji.toLowerCase().includes(q);
        const matchVietnamese = item.vietnamese.toLowerCase().includes(q);
        const matchHanViet = item.hanViet?.toLowerCase().includes(q) || false;

        if (!matchKanji && !matchHiragana && !matchRomaji && !matchVietnamese && !matchHanViet) {
          return false;
        }
      }

      if (deferredFilter.jlpt !== "All" && item.jlpt !== deferredFilter.jlpt) return false;
      if (deferredFilter.category !== "All" && item.category !== deferredFilter.category) return false;
      if (deferredFilter.wordType !== "all" && item.type !== deferredFilter.wordType) return false;

      if (deferredFilter.status === "learned" && !item.learned) return false;
      if (deferredFilter.status === "unlearned" && item.learned) return false;
      if (deferredFilter.status === "bookmarked" && !item.bookmarked) return false;

      return true;
    });
  }, [vocabulary, deferredFilter]);

  // Pagination Chunking for high-fps UI rendering
  const [vocabVisibleLimit, setVocabVisibleLimit] = useState<number>(36);

  useEffect(() => {
    setVocabVisibleLimit(36);
  }, [filter]);

  const displayedVocabulary = useMemo(() => {
    return filteredVocabulary.slice(0, vocabVisibleLimit);
  }, [filteredVocabulary, vocabVisibleLimit]);

  const learnedCount = vocabulary.filter((v) => v.learned).length;
  const bookmarkedCount = vocabulary.filter((v) => v.bookmarked).length;

  // Font size class mapping
  const fontSizeClass = fontSizeLevel === 2 ? "text-lg" : fontSizeLevel === 1 ? "text-base" : "text-sm";

  return (
    <div className={`min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans ${isHighContrast ? "contrast-125 bg-black" : ""} ${fontSizeClass}`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalCount={vocabulary.length}
        learnedCount={learnedCount}
        bookmarkedCount={bookmarkedCount}
        currentAccount={currentAccount}
        userStreak={userStats.streak}
        userXP={userStats.xp}
        dueSRSCount={dueSRSItems.length}
        onOpenAddModal={() => {
          if (!requireAccountGuard("Vui lòng đăng nhập tài khoản cá nhân để thêm từ vựng mới!")) return;
          setIsAddModalOpen(true);
        }}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminModal={handleSecretAdminTrigger}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        onOpenStudyGroupModal={() => setIsStudyGroupOpen(true)}
      />

      {/* Cloud Environment Notice Banner */}
      <div className="bg-stone-900/90 border-b border-stone-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs gap-3">
          {currentAccount ? (
            <div className="flex items-center gap-2 text-emerald-300">
              <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">Môi trường riêng trên Cloud:</span>
              <span className="text-stone-300 font-medium truncate">
                Tài khoản: <strong className="text-amber-300">{currentAccount.username}</strong>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-300">
              <UserIcon className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Chưa đăng nhập. Bấm <strong>"Tạo tài khoản"</strong> để lưu tiến độ riêng trên Cloud!
              </span>
            </div>
          )}

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-[11px] font-semibold shrink-0 transition-colors"
          >
            {currentAccount ? "Tài khoản cá nhân" : "Tạo tài khoản"}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {/* Prominent SRS Due Section on Top of Vocabulary/Home Page */}
          {(activeTab === "vocab" || activeTab === "srs") && (
            <SRSReviewSection
              dueItems={dueSRSItems}
              srsMap={srsMap}
              onUpdateSRS={handleUpdateSRS}
              onNavigateToQuiz={() => setActiveTab("quiz")}
            />
          )}

          {/* TAB 1: VOCABULARY GRID */}
          {activeTab === "vocab" && (
            <div className="space-y-6">
              <FilterBar
                filter={filter}
                setFilter={setFilter}
                totalFiltered={filteredVocabulary.length}
                totalAll={vocabulary.length}
                onResetFilters={handleResetFilters}
              />

              {filteredVocabulary.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayedVocabulary.map((item) => (
                      <VocabCard
                        key={item.id}
                        item={item}
                        onToggleLearned={handleToggleLearned}
                        onToggleBookmark={handleToggleBookmark}
                        onOpenDetail={(i) => setSelectedWord(i)}
                      />
                    ))}
                  </div>

                  {/* Load More Pagination Bar */}
                  {filteredVocabulary.length > vocabVisibleLimit && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:p-5 bg-stone-900/80 border border-stone-800/90 rounded-2xl shadow-lg mt-6">
                      <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span>
                          Đang hiển thị <strong className="text-amber-300 font-bold">{displayedVocabulary.length}</strong> / <strong className="text-stone-100 font-bold">{filteredVocabulary.length}</strong> từ vựng phù hợp
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                          onClick={() => setVocabVisibleLimit((prev) => prev + 36)}
                          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <span>Hiển thị thêm (+36 từ)</span>
                        </button>
                        <button
                          onClick={() => setVocabVisibleLimit(filteredVocabulary.length)}
                          className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all shrink-0"
                        >
                          Tải tất cả ({filteredVocabulary.length} từ)
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <EnsoEmptyState
                  character="無"
                  title="Không tìm thấy từ vựng phù hợp!"
                  description="Thử thay đổi từ khóa tìm kiếm hoặc bấm nút bên dưới để đặt lại bộ lọc."
                  actionButton={
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-stone-800/90 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all border border-amber-500/30"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Đặt lại tất cả bộ lọc</span>
                    </button>
                  }
                />
              )}
            </div>
          )}

          {/* TAB: KANJI PRACTICE & BRUSH CANVAS */}
          {activeTab === "kanji" && (
            <div className="space-y-6">
              <KanjiBrushCanvas
                onKanjiMastered={(kanjiChar) => {
                  const { updatedStats } = addXPAndCheckBadges(50, { kanjiWrittenCount: 1 }, currentAccount?.id);
                  setUserStats(updatedStats);
                }}
              />
              <KanjiHub
                currentAccount={currentAccount}
                onRequireAccount={(msg) => requireAccountGuard(msg)}
              />
            </div>
          )}

          {/* TAB: AI PRONUNCIATION & SHADOWING */}
          {activeTab === "speech" && (
            <AIPronunciationShadowing
              onScoreEarned={(score) => {
                const { updatedStats } = addXPAndCheckBadges(score, { speechPracticeCount: 1 }, currentAccount?.id);
                setUserStats(updatedStats);
              }}
            />
          )}

          {/* TAB: AI READING PASSAGES */}
          {activeTab === "reading" && (
            <AIReadingPassages
              userLearnedWords={vocabulary.filter((v) => v.learned).map((v) => v.kanji || v.hiragana)}
            />
          )}

          {/* TAB: GRAMMAR HUB */}
          {activeTab === "grammar" && (
            <GrammarHub 
              currentAccount={currentAccount} 
              onRequireAccount={(msg) => requireAccountGuard(msg)}
            />
          )}

          {/* TAB: AI WORD EXTRACTOR */}
          {activeTab === "ai-filter" && (
            <AIExtractor onAddWordsToApp={handleAddWords} currentAccount={currentAccount} />
          )}

          {/* TAB: FLASHCARDS & TOPIC CARD DECKS */}
          {activeTab === "flashcard" && (
            <TopicCardDeck
              vocabularyList={vocabulary}
              currentAccount={currentAccount}
              onToggleVocabLearned={handleToggleLearned}
              onToggleVocabBookmark={handleToggleBookmark}
              onRequireAccount={(msg) => requireAccountGuard(msg)}
            />
          )}

          {/* TAB: QUIZ PRACTICE */}
          {activeTab === "quiz" && (
            <QuizMode vocabularyList={filteredVocabulary} currentAccount={currentAccount} />
          )}

          {/* TAB: LEARNING DASHBOARD */}
          {activeTab === "dashboard" && (
            <LearningDashboard
              vocabulary={vocabulary}
              currentAccount={currentAccount}
              onNavigateToFlashcards={() => setActiveTab("flashcard")}
              onNavigateToQuiz={() => setActiveTab("quiz")}
            />
          )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900/60 border-t border-stone-800/80 py-6 text-center text-xs text-stone-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} <strong>Trần Ngọc Tùng - Nihongo Master</strong> — Hệ thống học tiếng Nhật phong cách Nhật Bản.
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>SM-2 SRS • Kanji Brush • AI Speech • JLPT Exam</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VocabDetailModal
        item={selectedWord}
        onClose={() => setSelectedWord(null)}
        onToggleLearned={handleToggleLearned}
        onToggleBookmark={handleToggleBookmark}
      />

      {isAddModalOpen && (
        <AddVocabModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(newItem) => handleAddWords([newItem])}
        />
      )}

      {isShareModalOpen && (
        <ExportShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          vocabulary={vocabulary}
          onImportVocabulary={handleImportVocabulary}
          onResetAllData={handleResetEntireAppData}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthPromptNotice(null);
        }}
        currentAccount={currentAccount}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        promptNotice={authPromptNotice}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onResetAccountData={handleResetCurrentAccountData}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => {
          setIsOnboardingOpen(false);
          localStorage.setItem("nihongo_onboarded_v1", "true");
        }}
      />

      <StudyGroupModal
        isOpen={isStudyGroupOpen}
        onClose={() => setIsStudyGroupOpen(false)}
        currentUserXP={userStats.xp}
        currentUserStreak={userStats.streak}
        currentUsername={currentAccount?.username || "Bạn"}
      />

      <AccessibilitySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSizeLevel={fontSizeLevel}
        onChangeFontSize={setFontSizeLevel}
        isHighContrast={isHighContrast}
        onToggleHighContrast={setIsHighContrast}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />
    </div>
  );
}

