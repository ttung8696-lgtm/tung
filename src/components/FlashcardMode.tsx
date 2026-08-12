import React, { useState, useEffect } from "react";
import { 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Bookmark, 
  Sparkles, 
  Shuffle,
  Keyboard
} from "lucide-react";
import { VocabItem } from "../types";
import { playJapaneseSpeech } from "../utils/audio";

interface FlashcardModeProps {
  items: VocabItem[];
  onToggleLearned: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({
  items,
  onToggleLearned,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [list, setList] = useState<VocabItem[]>(items);

  // Synchronize when items update
  useEffect(() => {
    setList(items);
  }, [items]);

  // Keyboard navigation (ArrowLeft: Prev, ArrowRight / Space / Enter: Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when focused inside input fields
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [list.length, currentIndex]);

  if (list.length === 0) {
    return (
      <div className="text-center py-16 bg-stone-900/60 border border-stone-800 rounded-3xl p-8 max-w-lg mx-auto text-stone-300">
        <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-white mb-2">Chưa có từ vựng nào trong danh sách!</h3>
        <p className="text-sm text-stone-400">
          Hãy thay đổi bộ lọc hoặc dùng tính năng AI Lọc Từ Mới để thêm từ vào Flashcard.
        </p>
      </div>
    );
  }

  const currentItem = list[currentIndex] || list[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleShuffle = () => {
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    setList(shuffled);
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-3 sm:space-y-6">
      {/* Flashcard Header Controls */}
      <div className="flex items-center justify-between bg-stone-900/80 p-3 sm:p-4 rounded-2xl border border-stone-800 text-stone-200 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
            Thẻ {currentIndex + 1} / {list.length}
          </span>
          <span className="text-xs text-stone-400 hidden sm:inline">
            Cấp độ: <strong className="text-stone-200">{currentItem.jlpt}</strong>
          </span>
        </div>

        {/* Progress bar */}
        <div className="hidden md:flex items-center gap-2 w-36">
          <div className="flex-1 bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800">
            <div 
              className="bg-amber-500 h-full transition-all duration-300" 
              style={{ width: `${((currentIndex + 1) / list.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 font-medium transition-all shadow-sm"
            title="Xáo trộn thứ tự từ vựng"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Xáo trộn</span>
          </button>
        </div>
      </div>

      {/* SINGLE FLASHCARD DISPLAY */}
      <div className="w-full relative">
        <div className="w-full bg-stone-900 border-2 border-stone-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-200">
          {/* Background Glow Effect */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header Badges & Actions */}
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] sm:text-xs font-semibold text-stone-300 bg-stone-950/80 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-stone-800">
              {currentItem.category}
            </span>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => playJapaneseSpeech(currentItem.kanji || currentItem.hiragana)}
                className="p-2 sm:p-2.5 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-300 transition-all shadow-sm"
                title="Phát âm tiếng Nhật"
              >
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => onToggleBookmark(currentItem.id)}
                className={`p-2 sm:p-2.5 rounded-xl transition-all shadow-sm ${
                  currentItem.bookmarked
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-stone-800 text-stone-400 hover:text-amber-300"
                }`}
                title="Lưu từ yêu thích"
              >
                <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${currentItem.bookmarked ? "fill-amber-400" : ""}`} />
              </button>
            </div>
          </div>

          {/* Card Body Content */}
          <div className="text-center my-auto py-3 sm:py-5 space-y-2.5 sm:space-y-4 relative z-10">
            <p className="text-sm sm:text-base font-mono text-amber-300 font-bold tracking-widest">
              {currentItem.hiragana}
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-wider drop-shadow-md">
              {currentItem.kanji || currentItem.hiragana}
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-400 italic">
              [{currentItem.romaji}]
            </p>
            {currentItem.hanViet && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-stone-950/90 text-amber-400 border border-amber-900/40 shadow-inner">
                Hán Việt: {currentItem.hanViet}
              </span>
            )}
            
            {/* Vietnamese Meaning */}
            <div className="pt-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                Nghĩa Tiếng Việt
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-stone-100">
                {currentItem.vietnamese}
              </h3>
            </div>

            {/* Example Sentence */}
            {currentItem.example && (
              <div className="bg-stone-950/90 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-stone-800 text-left space-y-0.5 sm:space-y-1 shadow-inner max-w-lg mx-auto">
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-400/80 uppercase tracking-wider block">
                  Ví dụ minh họa
                </span>
                <p className="text-[11px] sm:text-xs font-bold text-stone-200">
                  {currentItem.example.japanese}
                </p>
                {currentItem.example.hiragana && (
                  <p className="text-[10px] sm:text-[11px] text-amber-300 font-mono">
                    {currentItem.example.hiragana}
                  </p>
                )}
                <p className="text-[11px] sm:text-xs text-stone-400 italic">
                  👉 {currentItem.example.vietnamese}
                </p>
              </div>
            )}

            {/* Note if present */}
            {currentItem.note && (
              <p className="text-[11px] sm:text-xs text-amber-200/90 bg-amber-950/40 p-2 sm:p-2.5 rounded-xl border border-amber-900/40 text-left max-w-lg mx-auto">
                💡 {currentItem.note}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2.5 sm:pt-4 border-t border-stone-800/80 relative z-10">
            <button
              onClick={() => onToggleLearned(currentItem.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-sm ${
                currentItem.learned
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${currentItem.learned ? "fill-emerald-400/20" : ""}`} />
              <span>{currentItem.learned ? "Đã thuộc bài này" : "Đánh dấu thuộc"}</span>
            </button>

            <span className="text-[10px] sm:text-[11px] font-medium text-stone-500">
              Cấp độ {currentItem.jlpt}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation & Keyboard Shortcut Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-bold text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Từ trước</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all active:scale-95"
          >
            <span>Từ tiếp theo</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard hints */}
        <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-stone-400/80 py-1">
          <div className="flex items-center gap-1">
            <Keyboard className="w-3.5 h-3.5 text-stone-400" />
            <span>Phím tắt:</span>
          </div>
          <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-stone-300 font-mono">
            ← / → : Chuyển từ vựng
          </span>
        </div>
      </div>
    </div>
  );
};


