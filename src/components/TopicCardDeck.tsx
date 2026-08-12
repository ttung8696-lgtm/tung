import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Sparkles, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Bookmark, 
  Shuffle, 
  RotateCcw, 
  BookOpen, 
  Layers, 
  Award, 
  Search, 
  ArrowRight,
  Lightbulb,
  Check,
  Zap,
  Grid
} from "lucide-react";
import { VocabItem, GrammarItem } from "../types";
import { INITIAL_GRAMMAR_DATA } from "../data/grammarData";
import { playJapaneseSpeech } from "../utils/audio";
import { playMokugyoSound, playCorrectChime, playCardFlipSound, triggerHaptic } from "../utils/soundEffects";
import { UserAccount } from "../lib/userAccount";

export interface UnifiedDeckItem {
  id: string;
  type: "vocab" | "grammar";
  title: string;          // Kanji or Grammar Title (e.g. "私" or "〜てから")
  subTitle: string;       // Hiragana or Formula (e.g. "わたし")
  romaji?: string;
  hanViet?: string;
  meaning: string;        // Vietnamese meaning
  formula?: string;       // For grammar
  explanation?: string;   // For grammar details
  category: string;       // Category name
  level: string;          // "N5", "N4", "N3", "N2", "N1"
  example?: {
    japanese: string;
    hiragana?: string;
    vietnamese: string;
  };
  note?: string;
  learned: boolean;
  bookmarked: boolean;
  originalVocabId?: string;
  originalGrammarId?: string;
}

export interface TopicDeck {
  id: string;
  title: string;
  type: "vocab" | "grammar";
  categoryGroup: "topic_vocab" | "jlpt_vocab" | "grammar";
  icon: string;
  description: string;
  items: UnifiedDeckItem[];
  totalCount: number;
  learnedCount: number;
  percent: number;
}

interface TopicCardDeckProps {
  vocabularyList: VocabItem[];
  grammarList?: GrammarItem[];
  currentAccount?: UserAccount | null;
  onToggleVocabLearned: (id: string) => void;
  onToggleVocabBookmark: (id: string) => void;
  onRequireAccount?: (msg: string) => boolean;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  "Giao tiếp": "💬",
  "Ẩm thực": "🍱",
  "Trường học": "🏫",
  "Công việc": "💼",
  "Du lịch": "✈️",
  "Cảm xúc": "❤️",
  "Thiên nhiên": "🌿",
  "Gia đình": "👨‍👩‍👧",
  "Văn hóa": "⛩️",
  "Thời gian": "⏰",
  "Khác": "📦",
  "N5": "🟢",
  "N4": "🔵",
  "N3": "🟡",
  "N2": "🟠",
  "N1": "🔴",
};

export const TopicCardDeck: React.FC<TopicCardDeckProps> = ({
  vocabularyList = [],
  grammarList = INITIAL_GRAMMAR_DATA,
  currentAccount,
  onToggleVocabLearned,
  onToggleVocabBookmark,
  onRequireAccount,
}) => {
  // Navigation & Selection state
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [activeTabFilter, setActiveTabFilter] = useState<"all" | "topic_vocab" | "jlpt_vocab" | "grammar">("all");
  const [searchTopicQuery, setSearchTopicQuery] = useState("");

  // In-Deck Card Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardDeckItems, setCardDeckItems] = useState<UnifiedDeckItem[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showInkBrushSweep, setShowInkBrushSweep] = useState(false);
  const [grammarLearnedMap, setGrammarLearnedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("nihongo_grammar_learned_deck_v1");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Touch Gesture Handling
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Save local grammar learned map
  useEffect(() => {
    try {
      localStorage.setItem("nihongo_grammar_learned_deck_v1", JSON.stringify(grammarLearnedMap));
    } catch (e) {
      console.warn("Lỗi lưu local grammar progress:", e);
    }
  }, [grammarLearnedMap]);

  // Build All Topic Decks
  const allTopicDecks = useMemo<TopicDeck[]>(() => {
    const decks: TopicDeck[] = [];

    // 1. Vocabulary Decks by Category
    const vocabCategoryMap: Record<string, VocabItem[]> = {};
    vocabularyList.forEach((item) => {
      const cat = item.category || "Khác";
      if (!vocabCategoryMap[cat]) vocabCategoryMap[cat] = [];
      vocabCategoryMap[cat].push(item);
    });

    Object.entries(vocabCategoryMap).forEach(([cat, items]) => {
      if (items.length === 0) return;
      const mappedItems: UnifiedDeckItem[] = items.map((v) => ({
        id: `v_${v.id}`,
        type: "vocab",
        title: v.kanji || v.hiragana,
        subTitle: v.hiragana,
        romaji: v.romaji,
        hanViet: v.hanViet,
        meaning: v.vietnamese,
        category: v.category,
        level: v.jlpt,
        example: v.example ? {
          japanese: v.example.japanese,
          hiragana: v.example.hiragana,
          vietnamese: v.example.vietnamese,
        } : undefined,
        note: v.note,
        learned: !!v.learned,
        bookmarked: !!v.bookmarked,
        originalVocabId: v.id,
      }));

      const learnedCount = mappedItems.filter((i) => i.learned).length;
      const percent = Math.round((learnedCount / mappedItems.length) * 100);

      decks.push({
        id: `vocab_cat_${cat}`,
        title: `Chủ đề: ${cat}`,
        type: "vocab",
        categoryGroup: "topic_vocab",
        icon: CATEGORY_EMOJIS[cat] || "📖",
        description: `Tập hợp ${mappedItems.length} từ vựng giao tiếp thực tế theo chủ đề ${cat}.`,
        items: mappedItems,
        totalCount: mappedItems.length,
        learnedCount,
        percent,
      });
    });

    // 2. Vocabulary Decks by JLPT Level
    const jlptLevels: Array<"N5" | "N4" | "N3" | "N2" | "N1"> = ["N5", "N4", "N3", "N2", "N1"];
    jlptLevels.forEach((lvl) => {
      const items = vocabularyList.filter((v) => v.jlpt === lvl);
      if (items.length === 0) return;

      const mappedItems: UnifiedDeckItem[] = items.map((v) => ({
        id: `v_${v.id}`,
        type: "vocab",
        title: v.kanji || v.hiragana,
        subTitle: v.hiragana,
        romaji: v.romaji,
        hanViet: v.hanViet,
        meaning: v.vietnamese,
        category: v.category,
        level: v.jlpt,
        example: v.example ? {
          japanese: v.example.japanese,
          hiragana: v.example.hiragana,
          vietnamese: v.example.vietnamese,
        } : undefined,
        note: v.note,
        learned: !!v.learned,
        bookmarked: !!v.bookmarked,
        originalVocabId: v.id,
      }));

      const learnedCount = mappedItems.filter((i) => i.learned).length;
      const percent = Math.round((learnedCount / mappedItems.length) * 100);

      decks.push({
        id: `vocab_jlpt_${lvl}`,
        title: `Từ vựng JLPT ${lvl}`,
        type: "vocab",
        categoryGroup: "jlpt_vocab",
        icon: CATEGORY_EMOJIS[lvl] || "🎌",
        description: `Bộ ${mappedItems.length} từ vựng JLPT ${lvl} chuẩn bám sát đề thi chính thức.`,
        items: mappedItems,
        totalCount: mappedItems.length,
        learnedCount,
        percent,
      });
    });

    // 3. Grammar Decks by Level
    jlptLevels.forEach((lvl) => {
      const items = grammarList.filter((g) => g.level === lvl);
      if (items.length === 0) return;

      const mappedItems: UnifiedDeckItem[] = items.map((g) => {
        const ex = g.examples && g.examples.length > 0 ? g.examples[0] : undefined;
        return {
          id: `g_${g.id}`,
          type: "grammar",
          title: g.title,
          subTitle: g.formula,
          meaning: g.summary,
          formula: g.formula,
          explanation: g.explanation,
          category: g.category,
          level: g.level,
          example: ex ? {
            japanese: ex.japanese,
            hiragana: ex.hiragana,
            vietnamese: ex.vietnamese,
          } : undefined,
          note: g.comparison ? `So sánh: ${g.comparison.similarPattern} — ${g.comparison.difference}` : undefined,
          learned: !!grammarLearnedMap[g.id],
          bookmarked: false,
          originalGrammarId: g.id,
        };
      });

      const learnedCount = mappedItems.filter((i) => i.learned).length;
      const percent = Math.round((learnedCount / mappedItems.length) * 100);

      decks.push({
        id: `grammar_lvl_${lvl}`,
        title: `Ngữ pháp JLPT ${lvl}`,
        type: "grammar",
        categoryGroup: "grammar",
        icon: "📚",
        description: `Tổng hợp ${mappedItems.length} cấu trúc ngữ pháp ${lvl} trọng tâm kèm ví dụ.`,
        items: mappedItems,
        totalCount: mappedItems.length,
        learnedCount,
        percent,
      });
    });

    return decks;
  }, [vocabularyList, grammarList, grammarLearnedMap]);

  // Filtered Decks based on Search & Tabs
  const filteredDecks = useMemo(() => {
    return allTopicDecks.filter((deck) => {
      if (activeTabFilter !== "all" && deck.categoryGroup !== activeTabFilter) {
        return false;
      }
      if (searchTopicQuery.trim()) {
        const q = searchTopicQuery.toLowerCase().trim();
        return (
          deck.title.toLowerCase().includes(q) ||
          deck.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allTopicDecks, activeTabFilter, searchTopicQuery]);

  // Active Deck Object
  const currentDeck = useMemo(() => {
    return allTopicDecks.find((d) => d.id === selectedDeckId) || null;
  }, [allTopicDecks, selectedDeckId]);

  // Start Studying A Deck
  const handleSelectDeck = (deck: TopicDeck) => {
    setSelectedDeckId(deck.id);
    setCardDeckItems(deck.items);
    setCurrentIndex(0);
    setIsFlipped(false);
    triggerHaptic(20);
  };

  // Back to Deck Grid Selection
  const handleBackToDecks = () => {
    setSelectedDeckId(null);
    setIsFlipped(false);
  };

  // Active Item in Deck
  const currentCardItem = cardDeckItems[currentIndex] || cardDeckItems[0];

  // Navigation: Next & Prev
  const handleNextCard = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setShowInkBrushSweep(true);
    setIsFlipped(false);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cardDeckItems.length);
      setIsTransitioning(false);
      setTimeout(() => setShowInkBrushSweep(false), 300);
    }, 200);
  };

  const handlePrevCard = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setShowInkBrushSweep(true);
    setIsFlipped(false);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cardDeckItems.length) % cardDeckItems.length);
      setIsTransitioning(false);
      setTimeout(() => setShowInkBrushSweep(false), 300);
    }, 200);
  };

  // Shuffle Cards in current deck
  const handleShuffleDeck = () => {
    const shuffled = [...cardDeckItems].sort(() => Math.random() - 0.5);
    setCardDeckItems(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    playMokugyoSound();
  };

  // Flip 3D Card
  const handleToggleFlip = () => {
    setIsFlipped((prev) => !prev);
    playCardFlipSound();
  };

  // Mark Card as Learned (✓ Emerald)
  const handleMarkLearned = (item: UnifiedDeckItem) => {
    if (item.type === "vocab" && item.originalVocabId) {
      if (onRequireAccount && !currentAccount) {
        if (!onRequireAccount("Vui lòng đăng nhập để lưu tiến độ bài học!")) return;
      }
      onToggleVocabLearned(item.originalVocabId);
    } else if (item.type === "grammar" && item.originalGrammarId) {
      setGrammarLearnedMap((prev) => ({
        ...prev,
        [item.originalGrammarId!]: !prev[item.originalGrammarId!],
      }));
    }

    // Update local card item
    setCardDeckItems((prev) =>
      prev.map((c, idx) => (idx === currentIndex ? { ...c, learned: true } : c))
    );

    playCorrectChime();
    triggerHaptic([20, 30]);

    // Auto Advance after short delay
    setTimeout(() => {
      handleNextCard();
    }, 250);
  };

  // Mark Card as Needs Review (↻ Amber)
  const handleMarkNeedsReview = (item: UnifiedDeckItem) => {
    if (item.type === "vocab" && item.originalVocabId && item.learned) {
      onToggleVocabLearned(item.originalVocabId);
    } else if (item.type === "grammar" && item.originalGrammarId) {
      setGrammarLearnedMap((prev) => ({
        ...prev,
        [item.originalGrammarId!]: false,
      }));
    }

    setCardDeckItems((prev) =>
      prev.map((c, idx) => (idx === currentIndex ? { ...c, learned: false } : c))
    );

    playMokugyoSound();

    setTimeout(() => {
      handleNextCard();
    }, 250);
  };

  // Toggle Bookmark
  const handleToggleBookmarkCurrent = (item: UnifiedDeckItem) => {
    if (item.type === "vocab" && item.originalVocabId) {
      if (onRequireAccount && !currentAccount) {
        if (!onRequireAccount("Vui lòng đăng nhập để lưu từ yêu thích!")) return;
      }
      onToggleVocabBookmark(item.originalVocabId);
      setCardDeckItems((prev) =>
        prev.map((c, idx) => (idx === currentIndex ? { ...c, bookmarked: !c.bookmarked } : c))
      );
    }
  };

  // Touch Swipe Handler for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Horizontal Swipe
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swipe Left -> Next
        handleNextCard();
      } else {
        // Swipe Right -> Previous
        handlePrevCard();
      }
    } 
    // Vertical Swipe Up -> Mark Learned
    else if (deltaY < -55 && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (currentCardItem) {
        handleMarkLearned(currentCardItem);
      }
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    if (!selectedDeckId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        handleToggleFlip();
      } else if (e.key === "l" || e.key === "L" || e.key === "1") {
        if (currentCardItem) handleMarkLearned(currentCardItem);
      } else if (e.key === "r" || e.key === "R" || e.key === "2") {
        if (currentCardItem) handleMarkNeedsReview(currentCardItem);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDeckId, currentIndex, currentCardItem, isTransitioning]);

  // Find Next Suggested Deck after completion
  const nextSuggestedDeck = useMemo(() => {
    if (!currentDeck) return null;
    const index = allTopicDecks.findIndex((d) => d.id === currentDeck.id);
    if (index >= 0 && index < allTopicDecks.length - 1) {
      return allTopicDecks[index + 1];
    }
    return allTopicDecks[0] || null;
  }, [allTopicDecks, currentDeck]);

  // Check if Deck is Fully Completed
  const isDeckCompleted = currentIndex === cardDeckItems.length - 1 && cardDeckItems.every((i) => i.learned);

  // ==================== VIEW 1: TOPIC DECK SELECTION GRID ====================
  if (!selectedDeckId) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-900/95 to-amber-950/40 p-5 sm:p-7 rounded-3xl border border-stone-800 shadow-xl relative overflow-hidden washi-texture">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold mb-2">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Chế Độ Học Theo Chủ Đề (Card Deck)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-wide">
                Bộ Thẻ Học Tương Tác Phong Cách Nhật
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
                Chọn chủ đề yêu thích, học từng thẻ bài mẫu ví dụ trực quan. Hỗ trợ lật thẻ 3D, vuốt trên điện thoại và lưu tiến độ thông minh.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-stone-950/80 p-3 rounded-2xl border border-stone-800 shrink-0">
              <div className="text-center px-3 border-r border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Tổng Bộ Thẻ</span>
                <strong className="text-lg text-amber-400 font-bold">{allTopicDecks.length}</strong>
              </div>
              <div className="text-center px-3">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Chủ Đề Hoàn Thành</span>
                <strong className="text-lg text-emerald-400 font-bold">
                  {allTopicDecks.filter((d) => d.percent === 100).length}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900/80 p-3 rounded-2xl border border-stone-800">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTabFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTabFilter === "all"
                  ? "bg-amber-500 text-stone-950 shadow-md font-black"
                  : "bg-stone-800/80 text-stone-300 hover:bg-stone-700"
              }`}
            >
              🌟 Tất cả ({allTopicDecks.length})
            </button>
            <button
              onClick={() => setActiveTabFilter("topic_vocab")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTabFilter === "topic_vocab"
                  ? "bg-amber-500 text-stone-950 shadow-md font-black"
                  : "bg-stone-800/80 text-stone-300 hover:bg-stone-700"
              }`}
            >
              💬 Từ vựng Chủ đề
            </button>
            <button
              onClick={() => setActiveTabFilter("jlpt_vocab")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTabFilter === "jlpt_vocab"
                  ? "bg-amber-500 text-stone-950 shadow-md font-black"
                  : "bg-stone-800/80 text-stone-300 hover:bg-stone-700"
              }`}
            >
              🎌 Từ vựng JLPT
            </button>
            <button
              onClick={() => setActiveTabFilter("grammar")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTabFilter === "grammar"
                  ? "bg-amber-500 text-stone-950 shadow-md font-black"
                  : "bg-stone-800/80 text-stone-300 hover:bg-stone-700"
              }`}
            >
              📚 Ngữ pháp
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm chủ đề..."
              value={searchTopicQuery}
              onChange={(e) => setSearchTopicQuery(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        {/* Decks Grid */}
        {filteredDecks.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/60 border border-stone-800 rounded-3xl p-8 max-w-md mx-auto text-stone-300">
            <Search className="w-10 h-10 text-stone-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-stone-200">Không tìm thấy bộ thẻ phù hợp!</p>
            <p className="text-xs text-stone-400 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc lọc chủ đề khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDecks.map((deck) => (
              <div
                key={deck.id}
                onClick={() => handleSelectDeck(deck)}
                className="group relative bg-stone-900/90 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden card-ink-hover"
              >
                {/* Washi Texture Background */}
                <div className="absolute inset-0 washi-texture opacity-30 pointer-events-none" />

                <div>
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 bg-stone-950 rounded-xl border border-stone-800/80 shadow-inner group-hover:scale-110 transition-transform">
                        {deck.icon}
                      </span>
                      <div>
                        <h3 className="font-bold font-serif text-white group-hover:text-amber-300 transition-colors text-base">
                          {deck.title}
                        </h3>
                        <span className="text-[10px] font-semibold text-stone-400 bg-stone-950 px-2 py-0.5 rounded-full border border-stone-800 inline-block mt-0.5">
                          {deck.type === "vocab" ? "Từ Vựng" : "Ngữ Pháp"} • {deck.totalCount} thẻ
                        </span>
                      </div>
                    </div>

                    {deck.percent === 100 && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full shadow">
                        <Check className="w-3 h-3" /> Hoàn thành
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4 relative z-10">
                    {deck.description}
                  </p>
                </div>

                {/* Progress Bar & Footer */}
                <div className="space-y-2 pt-3 border-t border-stone-800/80 relative z-10">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 font-medium">Tiến độ đã học:</span>
                    <strong className="text-amber-400 font-mono font-bold">
                      {deck.learnedCount} / {deck.totalCount} ({deck.percent}%)
                    </strong>
                  </div>

                  <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        deck.percent === 100
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                          : "bg-gradient-to-r from-amber-600 to-amber-400"
                      }`}
                      style={{ width: `${deck.percent}%` }}
                    />
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {deck.learnedCount > 0 ? "Tiếp tục học" : "Bắt đầu học"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==================== VIEW 2: IN-DECK CAROUSEL VIEW ====================
  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-stone-900/90 p-3 sm:p-4 rounded-2xl border border-stone-800 text-stone-200 shadow-xl">
        <button
          onClick={handleBackToDecks}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 font-bold transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 text-amber-400" />
          <span>Danh sách chủ đề</span>
        </button>

        <div className="flex items-center gap-2 text-center">
          <span className="text-xl hidden sm:inline">{currentDeck?.icon}</span>
          <span className="text-xs sm:text-sm font-black text-amber-300 font-serif">
            {currentDeck?.title}
          </span>
          <span className="text-xs text-stone-400 font-mono bg-stone-950 px-2 py-0.5 rounded-full border border-stone-800">
            {currentIndex + 1} / {cardDeckItems.length}
          </span>
        </div>

        <button
          onClick={handleShuffleDeck}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 font-medium transition-all shadow-sm"
          title="Xáo trộn ngẫu nhiên thứ tự thẻ"
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Xáo bài</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800 shadow-inner">
        <div
          className="bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cardDeckItems.length) * 100}%` }}
        />
      </div>

      {/* ==================== 3D CARD STACK & CAROUSEL ==================== */}
      <div
        className="relative w-full min-h-[380px] sm:min-h-[420px] my-2 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* STACKED CARD 2 (Furthest back) */}
        <div className="absolute inset-0 top-6 scale-[0.90] opacity-30 bg-stone-900 border-2 border-stone-800 rounded-3xl shadow-md pointer-events-none z-10 transition-transform duration-300" />

        {/* STACKED CARD 1 (Middle stack) */}
        <div className="absolute inset-0 top-3 scale-[0.95] opacity-60 bg-stone-900 border-2 border-stone-800 rounded-3xl shadow-lg pointer-events-none z-20 transition-transform duration-300" />

        {/* ACTIVE PRIMARY CARD (3D Flip) */}
        <div
          className={`relative z-30 w-full bg-stone-900 border-2 ${
            currentCardItem.learned
              ? "border-emerald-500/50 shadow-emerald-950/30"
              : "border-stone-800 shadow-2xl"
          } rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 washi-texture ${
            isTransitioning ? "opacity-0 scale-95 translate-x-12" : "opacity-100 scale-100 translate-x-0"
          }`}
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* CARD TOP BAR */}
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800/60 shadow-sm">
                {currentCardItem.level}
              </span>
              <span className="text-[11px] font-semibold text-stone-300 bg-stone-950/80 px-2.5 py-1 rounded-full border border-stone-800">
                {currentCardItem.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  playJapaneseSpeech(
                    currentCardItem.example?.japanese || currentCardItem.title
                  )
                }
                className="p-2 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 transition-all shadow-sm"
                title="Phát âm tiếng Nhật"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {currentCardItem.type === "vocab" && (
                <button
                  onClick={() => handleToggleBookmarkCurrent(currentCardItem)}
                  className={`p-2 rounded-xl transition-all shadow-sm ${
                    currentCardItem.bookmarked
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-stone-800 text-stone-400 hover:text-amber-300"
                  }`}
                  title="Lưu yêu thích"
                >
                  <Bookmark
                    className={`w-4 h-4 ${currentCardItem.bookmarked ? "fill-amber-400" : ""}`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* CARD CONTENT BODY (FLIPABLE) */}
          <div
            onClick={handleToggleFlip}
            className="cursor-pointer my-auto py-2 text-center space-y-3 relative z-10 group"
          >
            {!isFlipped ? (
              /* FRONT FACE */
              <div className="space-y-3 transition-opacity duration-300">
                {currentCardItem.subTitle && (
                  <p className="text-sm sm:text-base font-mono text-amber-300 font-bold tracking-widest">
                    {currentCardItem.subTitle}
                  </p>
                )}

                <h2 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-wider drop-shadow-md group-hover:scale-105 transition-transform duration-200">
                  {currentCardItem.title}
                </h2>

                {currentCardItem.romaji && (
                  <p className="text-xs text-stone-400 italic font-mono">
                    [{currentCardItem.romaji}]
                  </p>
                )}

                {currentCardItem.hanViet && (
                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-stone-950 text-amber-400 border border-amber-900/40 shadow-inner">
                    Hán Việt: {currentCardItem.hanViet}
                  </span>
                )}

                {/* Main Meaning */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
                    Nghĩa Tiếng Việt
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-stone-100">
                    {currentCardItem.meaning}
                  </h3>
                </div>

                {/* Flip Prompt Hint */}
                <div className="pt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400/80 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-900/30 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Bấm vào thẻ để xem câu ví dụ mặt sau 🔄</span>
                </div>
              </div>
            ) : (
              /* BACK FACE (EXAMPLES & NOTES) */
              <div className="space-y-3 text-left bg-stone-950/90 p-4 sm:p-5 rounded-2xl border border-stone-800 transition-opacity duration-300 shadow-inner">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Mặt Sau: Ví Dụ & Ghi Chú
                  </span>
                  <span className="text-[10px] text-stone-400 italic">Bấm để lật về mặt trước</span>
                </div>

                {currentCardItem.example ? (
                  <div className="space-y-1.5">
                    <p className="text-sm sm:text-base font-bold text-stone-100 font-serif">
                      {currentCardItem.example.japanese}
                    </p>
                    {currentCardItem.example.hiragana && (
                      <p className="text-xs text-amber-300 font-mono">
                        {currentCardItem.example.hiragana}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-stone-300 font-medium italic">
                      👉 {currentCardItem.example.vietnamese}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">Chưa có câu ví dụ riêng cho thẻ này.</p>
                )}

                {currentCardItem.note && (
                  <div className="pt-2 border-t border-stone-800 text-xs text-amber-200/90">
                    💡 <strong>Ghi chú:</strong> {currentCardItem.note}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CARD FOOTER QUICK MARK BUTTONS */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800 relative z-10 gap-2">
            <button
              onClick={() => handleMarkNeedsReview(currentCardItem)}
              className="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
              title="Cần học lại từ này"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Cần ôn lại</span>
            </button>

            <button
              onClick={() => handleMarkLearned(currentCardItem)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow ${
                currentCardItem.learned
                  ? "bg-emerald-500 text-stone-950 border border-emerald-400"
                  : "bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/50"
              }`}
              title="Đã thuộc từ này"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{currentCardItem.learned ? "Đã thuộc ✓" : "Đánh dấu thuộc"}</span>
            </button>
          </div>
        </div>

        {/* INK BRUSH SWEEP ACCENT ANIMATION */}
        {showInkBrushSweep && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full animate-pulse z-40" />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrevCard}
          className="flex-1 py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Thẻ trước</span>
        </button>

        <button
          onClick={handleNextCard}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all active:scale-95"
        >
          <span>Thẻ tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Gesture / Mobile Hint */}
      <div className="text-center text-[11px] text-stone-500 font-medium">
        💡 Mẹo: Vuốt Trái/Phải để chuyển thẻ • Vuốt Lên để thuộc • Phím Spacebar để lật thẻ
      </div>

      {/* ==================== ENSO COMPLETATION CELEBRATION MODAL ==================== */}
      {isDeckCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl relative overflow-hidden washi-texture">
            {/* Animated Drawing Enso Ring SVG */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="264"
                  strokeDashoffset="0"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <Sparkles className="w-10 h-10 text-amber-400 absolute animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
                Hoàn Thành Bộ Thẻ!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-serif text-white mt-2">
                Chúc mừng bạn! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Bạn đã hoàn thành toàn bộ thẻ trong chủ đề <strong className="text-amber-300">{currentDeck?.title}</strong>.
              </p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Tổng Thẻ Đã Học</span>
                <strong className="text-base text-emerald-400 font-bold">{cardDeckItems.length} Thẻ</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Thưởng Kinh Nghiệm</span>
                <strong className="text-base text-amber-400 font-bold">+{cardDeckItems.length * 15} XP</strong>
              </div>
            </div>

            {/* Next Topic Deck Suggestion */}
            {nextSuggestedDeck && (
              <div className="bg-stone-950/80 p-4 rounded-2xl border border-amber-500/30 text-left space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Gợi Ý Chủ Đề Tiếp Theo
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{nextSuggestedDeck.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-xs">{nextSuggestedDeck.title}</h4>
                      <p className="text-[10px] text-stone-400">{nextSuggestedDeck.totalCount} thẻ cần học</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectDeck(nextSuggestedDeck)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow"
                  >
                    Học ngay ➔
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleShuffleDeck}
                className="flex-1 py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all"
              >
                Học lại bộ này (Trộn)
              </button>
              <button
                onClick={handleBackToDecks}
                className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-all shadow-lg"
              >
                Chọn chủ đề khác
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicCardDeck;
