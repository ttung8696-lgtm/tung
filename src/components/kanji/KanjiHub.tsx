import React, { useState, useEffect, useMemo, useDeferredValue } from "react";
import { Search, RotateCcw, Filter, CheckCircle2, Bookmark, Sparkles, BookOpen } from "lucide-react";
import { KANJI_DATASET, KanjiItem } from "../../data/kanjiData";
import { KanjiDetailModal } from "./KanjiDetailModal";
import { EnsoEmptyState } from "../EnsoEmptyState";
import { UserAccount } from "../../lib/userAccount";
import { ScrollableHorizontalBar } from "../common/ScrollableHorizontalBar";

interface KanjiHubProps {
  currentAccount: UserAccount | null;
  onRequireAccount: (msg: string) => boolean;
}

export const KanjiHub: React.FC<KanjiHubProps> = ({ currentAccount, onRequireAccount }) => {
  const [selectedJlpt, setSelectedJlpt] = useState<"All" | "N5" | "N4" | "N3" | "N2" | "N1">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "mastered" | "bookmarked">("all");

  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);

  // Local storage state for Kanji progress
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("nihongo_kanji_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("nihongo_kanji_mastered");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (id: string) => {
    if (!onRequireAccount("Vui lòng đăng nhập tài khoản để lưu Kanji yêu thích!")) return;
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("nihongo_kanji_bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const toggleMastered = (id: string) => {
    if (!onRequireAccount("Vui lòng đăng nhập tài khoản để đánh dấu đã thuộc Kanji!")) return;
    setMasteredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("nihongo_kanji_mastered", JSON.stringify(next));
      return next;
    });
  };

  // Deferred Search Query for smooth input responsiveness
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Filter computation
  const filteredKanji = useMemo(() => {
    return KANJI_DATASET.filter((item) => {
      if (selectedJlpt !== "All" && item.jlpt !== selectedJlpt) return false;

      if (deferredSearchQuery.trim()) {
        const q = deferredSearchQuery.toLowerCase().trim();
        const matchKanji = item.kanji.includes(q);
        const matchHanViet = item.hanViet.toLowerCase().includes(q);
        const matchMeaning = item.meaningVi.toLowerCase().includes(q);
        const matchOn = item.onyomi.some((o) => o.toLowerCase().includes(q));
        const matchKun = item.kunyomi.some((k) => k.toLowerCase().includes(q));

        if (!matchKanji && !matchHanViet && !matchMeaning && !matchOn && !matchKun) {
          return false;
        }
      }

      if (statusFilter === "mastered" && !masteredIds.includes(item.id)) return false;
      if (statusFilter === "bookmarked" && !bookmarkedIds.includes(item.id)) return false;

      return true;
    });
  }, [selectedJlpt, deferredSearchQuery, statusFilter, bookmarkedIds, masteredIds]);

  // Pagination Chunking for high-fps Kanji rendering
  const [kanjiVisibleLimit, setKanjiVisibleLimit] = useState<number>(36);

  useEffect(() => {
    setKanjiVisibleLimit(36);
  }, [selectedJlpt, searchQuery, statusFilter]);

  const displayedKanji = useMemo(() => {
    return filteredKanji.slice(0, kanjiVisibleLimit);
  }, [filteredKanji, kanjiVisibleLimit]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                漢字 KANJI MASTER
              </span>
              <span className="text-xs text-stone-400 font-medium">N5 → N1</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-serif-jp">
              Học & Luyện Viết Hán Tự Tiếng Nhật
            </h2>
            <p className="text-xs text-stone-400 max-w-xl">
              Tra cứu đầy đủ Âm On, Âm Kun, Hán Việt, Số nét, Bộ thủ, Từ ghép và tập vẽ nét Hán tự trực tiếp trên màn hình.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-950 p-3 rounded-2xl border border-stone-800">
            <div className="text-center px-3 border-r border-stone-800">
              <div className="text-lg font-bold text-amber-300">{masteredIds.length}</div>
              <div className="text-[10px] text-stone-500 uppercase">Đã thuộc</div>
            </div>
            <div className="text-center px-3">
              <div className="text-lg font-bold text-emerald-400">{bookmarkedIds.length}</div>
              <div className="text-[10px] text-stone-500 uppercase">Yêu thích</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="pt-4 border-t border-stone-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm Kanji, Hán Việt, Nghĩa, Âm On/Kun..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* JLPT Level Tabs */}
          <div className="flex-1 min-w-0">
            <ScrollableHorizontalBar className="gap-1 pb-1 md:pb-0">
              {(["All", "N5", "N4", "N3", "N2", "N1"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedJlpt(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    selectedJlpt === level
                      ? "bg-amber-500 text-stone-950 font-extrabold shadow-md"
                      : "bg-stone-800 text-stone-400 hover:text-white"
                  }`}
                >
                  {level === "All" ? "Tất cả" : level}
                </button>
              ))}
            </ScrollableHorizontalBar>
          </div>
        </div>
      </div>

      {/* Kanji Grid */}
      {filteredKanji.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {displayedKanji.map((item) => {
              const isBookmarked = bookmarkedIds.includes(item.id);
              const isMastered = masteredIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedKanji(item)}
                  className={`group relative bg-stone-900 border rounded-2xl p-4 flex flex-col items-center justify-between gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isMastered
                      ? "border-emerald-500/40 bg-emerald-950/10"
                      : "border-stone-800 hover:border-amber-500/50"
                  }`}
                >
                  {/* Top Badges */}
                  <div className="w-full flex items-center justify-between text-[10px]">
                    <span className="px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.jlpt}
                    </span>
                    <span className="text-stone-500 font-mono">
                      {item.strokes} nét
                    </span>
                  </div>

                  {/* Big Kanji Character */}
                  <div className="my-1 text-center">
                    <div className="text-5xl font-extrabold text-white font-serif-jp group-hover:scale-110 group-hover:text-amber-300 transition-transform duration-300">
                      {item.kanji}
                    </div>
                    <div className="text-xs font-bold text-red-400 mt-1 uppercase tracking-wider">
                      【{item.hanViet}】
                    </div>
                  </div>

                  {/* Short Meaning */}
                  <p className="text-[11px] text-stone-400 text-center line-clamp-1 w-full">
                    {item.meaningVi}
                  </p>

                  {/* Quick Status Bar */}
                  <div className="w-full pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item.id);
                      }}
                      className={`p-1 rounded hover:bg-stone-800 transition-colors ${
                        isBookmarked ? "text-amber-400" : "text-stone-600 hover:text-stone-400"
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(item.id);
                      }}
                      className={`p-1 rounded hover:bg-stone-800 transition-colors ${
                        isMastered ? "text-emerald-400" : "text-stone-600 hover:text-stone-400"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Pagination Bar */}
          {filteredKanji.length > kanjiVisibleLimit && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:p-5 bg-stone-900/80 border border-stone-800/90 rounded-2xl shadow-lg mt-6">
              <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>
                  Đang hiển thị <strong className="text-amber-300 font-bold">{displayedKanji.length}</strong> / <strong className="text-stone-100 font-bold">{filteredKanji.length}</strong> Hán tự Kanji
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setKanjiVisibleLimit((prev) => prev + 36)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs transition-all shadow-md active:scale-95"
                >
                  <span>Hiển thị thêm (+36 Kanji)</span>
                </button>
                <button
                  onClick={() => setKanjiVisibleLimit(filteredKanji.length)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all shrink-0"
                >
                  Tải tất cả ({filteredKanji.length} Kanji)
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EnsoEmptyState
          character="無"
          title="Không tìm thấy Hán tự Kanji phù hợp!"
          description="Thử thay đổi từ khóa tìm kiếm hoặc chọn cấp độ JLPT khác."
          actionButton={
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedJlpt("All");
              }}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all border border-amber-500/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại bộ lọc</span>
            </button>
          }
        />
      )}

      {/* Kanji Detail Modal */}
      {selectedKanji && (
        <KanjiDetailModal
          item={selectedKanji}
          onClose={() => setSelectedKanji(null)}
          isBookmarked={bookmarkedIds.includes(selectedKanji.id)}
          isMastered={masteredIds.includes(selectedKanji.id)}
          onToggleBookmark={toggleBookmark}
          onToggleMastered={toggleMastered}
        />
      )}
    </div>
  );
};
