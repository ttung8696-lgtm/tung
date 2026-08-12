import React, { useState } from "react";
import { VocabItem } from "../types";
import { SRSItemState, SRSGrade, calculateSM2, formatNextReviewTime } from "../utils/srsEngine";
import { playMokugyoSound, playCorrectChime, playCardFlipSound } from "../utils/soundEffects";
import { playJapaneseSpeech } from "../utils/audio";
import { Volume2, RotateCcw, Check, Sparkles, Brain, Award, ArrowRight } from "lucide-react";

interface SRSReviewSectionProps {
  dueItems: VocabItem[];
  srsMap: Record<string, SRSItemState>;
  onUpdateSRS: (vocabId: string, newState: SRSItemState) => void;
  onNavigateToQuiz?: () => void;
}

export const SRSReviewSection: React.FC<SRSReviewSectionProps> = ({
  dueItems,
  srsMap,
  onUpdateSRS,
  onNavigateToQuiz,
}) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0);

  const currentItem = dueItems[currentIndex];

  const handleStartReview = () => {
    if (dueItems.length === 0) return;
    setIsReviewing(true);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionReviewedCount(0);
    playCardFlipSound();
  };

  const handleRateSRS = (grade: SRSGrade) => {
    if (!currentItem) return;

    if (grade >= 2) {
      playCorrectChime();
    } else {
      playMokugyoSound();
    }

    const prevState = srsMap[currentItem.id];
    const newState = calculateSM2(grade, prevState);
    onUpdateSRS(currentItem.id, newState);

    setSessionReviewedCount((prev) => prev + 1);

    if (currentIndex + 1 < dueItems.length) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      // Completed current batch
      setIsReviewing(false);
      setShowAnswer(false);
    }
  };

  if (!isReviewing) {
    return (
      <div className="bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border-2 border-amber-500/40 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden my-4">
        {/* Background Washi & Enso Accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
          </svg>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-stone-950 uppercase tracking-wider flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" /> SM-2 Anki SRS
              </span>
              <span className="text-xs text-amber-300 font-semibold">
                Lặp lại ngắt quãng thông minh
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-extrabold text-stone-100 font-serif-jp flex items-center gap-2">
              <span>Thẻ Cần Ôn Hôm Nay</span>
              <span className="px-2.5 py-0.5 rounded-full text-sm font-bold bg-amber-500/30 text-amber-300 border border-amber-500/40">
                {dueItems.length} từ
              </span>
            </h3>
            <p className="text-xs text-stone-400 max-w-xl">
              Thuật toán tự động đẩy các từ bạn dễ quên lên ôn sớm hơn và giãn cách xa các từ bạn đã nhớ tốt, giúp ghi nhớ lâu gấp 5 lần.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {dueItems.length > 0 ? (
              <button
                onClick={handleStartReview}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-900/30 text-sm inline-flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bắt đầu ôn ({dueItems.length} từ)</span>
              </button>
            ) : (
              <div className="px-4 py-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Tuyệt vời! Bạn đã hoàn thành bài ôn hôm nay!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active SRS Review Card Mode
  return (
    <div className="bg-stone-900 border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto my-6 space-y-5">
      {/* Progress header */}
      <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400 font-serif-jp">
            Đang ôn: {currentIndex + 1} / {dueItems.length}
          </span>
          <span className="text-stone-400">({sessionReviewedCount} đã thuộc buổi này)</span>
        </div>
        <button
          onClick={() => setIsReviewing(false)}
          className="text-stone-400 hover:text-stone-200 text-xs font-semibold px-2 py-1 rounded hover:bg-stone-800"
        >
          Thoát ôn tập
        </button>
      </div>

      {/* Flashcard Content */}
      {currentItem && (
        <div className="text-center py-6 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {currentItem.jlpt}
            </span>
            <span className="text-xs text-stone-400 font-medium">
              {currentItem.category}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-extrabold text-amber-200 font-serif-jp tracking-wider">
              {currentItem.kanji || currentItem.hiragana}
            </h2>
            <p className="text-lg text-stone-300 font-medium">
              {currentItem.hiragana}
            </p>
          </div>

          <button
            onClick={() => playJapaneseSpeech(currentItem.kanji || currentItem.hiragana)}
            className="p-3 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-full inline-flex items-center justify-center transition-colors shadow-md"
            title="Nghe phát âm"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {/* Reveal Answer Section */}
          {showAnswer ? (
            <div className="pt-4 border-t border-stone-800/80 space-y-3 animate-fadeIn">
              <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 text-left space-y-1.5">
                <p className="text-base font-bold text-amber-300">
                  Nghĩa: {currentItem.vietnamese}
                </p>
                {currentItem.hanViet && (
                  <p className="text-xs text-amber-400/80 font-medium">
                    Âm Hán Việt: {currentItem.hanViet}
                  </p>
                )}
                {currentItem.example && (
                  <div className="text-xs text-stone-300 pt-1 border-t border-stone-800/50 space-y-0.5">
                    <p className="font-serif-jp text-stone-200">{currentItem.example.japanese}</p>
                    <p className="text-stone-400">{currentItem.example.vietnamese}</p>
                  </div>
                )}
              </div>

              {/* SM-2 Grade Rating Buttons */}
              <div className="space-y-1.5 pt-2">
                <p className="text-xs font-semibold text-stone-400">
                  Mức độ ghi nhớ của bạn đối với từ này:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRateSRS(0)}
                    className="py-2.5 px-2 bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Quên (1 ngày)
                  </button>
                  <button
                    onClick={() => handleRateSRS(1)}
                    className="py-2.5 px-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/80 text-amber-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Khó
                  </button>
                  <button
                    onClick={() => handleRateSRS(2)}
                    className="py-2.5 px-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Tốt
                  </button>
                  <button
                    onClick={() => handleRateSRS(3)}
                    className="py-2.5 px-2 bg-blue-950/80 hover:bg-blue-900 border border-blue-700/80 text-blue-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Rất Dễ
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-4">
              <button
                onClick={() => {
                  setShowAnswer(true);
                  playMokugyoSound();
                }}
                className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold rounded-xl text-sm border border-stone-700 transition-all shadow-md"
              >
                Hiển thị đáp án & Nghĩa tiếng Việt
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
