import React, { useState } from "react";
import { Flame, Clock, Award, Target, BookOpen, Brain, CheckCircle2, RotateCcw, Calendar, Activity, ChevronRight, Layers } from "lucide-react";
import { VocabItem } from "../types";
import { UserAccount } from "../lib/userAccount";

interface LearningDashboardProps {
  vocabulary: VocabItem[];
  currentAccount: UserAccount | null;
  onNavigateToFlashcards: () => void;
  onNavigateToQuiz: () => void;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  vocabulary,
  currentAccount,
  onNavigateToFlashcards,
  onNavigateToQuiz,
}) => {
  // Stats calculations
  const totalCount = vocabulary.length;
  const learnedCount = vocabulary.filter((v) => v.learned).length;
  const bookmarkedCount = vocabulary.filter((v) => v.bookmarked).length;

  const learnedPercentage = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;

  // Compute JLPT level breakdown
  const jlptLevels: Array<"N5" | "N4" | "N3" | "N2" | "N1"> = ["N5", "N4", "N3", "N2", "N1"];
  const jlptBreakdown = jlptLevels.map((lvl) => {
    const items = vocabulary.filter((v) => v.jlpt === lvl);
    const learned = items.filter((v) => v.learned).length;
    const total = items.length;
    const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
    return { level: lvl, total, learned, percent };
  });

  // SRS Review items (unlearned or due)
  const reviewQueue = vocabulary.filter((v) => !v.learned || v.bookmarked).slice(0, 8);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Streak */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                🔥 12 NGÀY LIÊN TIẾP
              </span>
              <span className="text-xs text-stone-400">Tiến độ cá nhân</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-serif-jp">
              Bảng Theo Dõi Tiến Độ Học Tập
            </h2>
            <p className="text-xs text-stone-400 max-w-xl">
              Hệ thống thuật toán Lặp lại ngắt quãng (Spaced Repetition System - SRS) theo dõi chu kỳ 1d, 3d, 7d, 14d, 30d giúp ghi nhớ từ vựng và ngữ pháp vững chắc.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800/80 shadow-inner">
            <div className="text-center px-3 border-r border-stone-800">
              <div className="text-2xl font-black text-amber-300">{learnedCount}</div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Đã thuộc</div>
            </div>
            <div className="text-center px-3 border-r border-stone-800">
              <div className="text-2xl font-black text-emerald-400">{learnedPercentage}%</div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Tỷ lệ thuộc</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-red-400">{bookmarkedCount}</div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Đánh dấu</div>
            </div>
          </div>
        </div>

        {/* Global Progress Line */}
        <div className="space-y-2 pt-2 border-t border-stone-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Tiến độ hoàn thành từ vựng toàn ứng dụng ({learnedCount}/{totalCount} từ)</span>
            </span>
            <span className="font-bold text-amber-300">{learnedPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700 shadow-lg"
              style={{ width: `${learnedPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Content: JLPT Breakdown vs SRS Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: JLPT Mastery Bars */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Tiến Độ Theo Trình Độ JLPT (N5 → N1)</h3>
            </div>
            <span className="text-[10px] text-stone-500 uppercase font-mono">5 Trình độ</span>
          </div>

          <div className="space-y-4">
            {jlptBreakdown.map((item) => (
              <div key={item.level} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px]">
                      {item.level}
                    </span>
                    <span className="text-stone-300 font-medium">
                      {item.learned} / {item.total} từ vựng
                    </span>
                  </div>
                  <span className="font-bold text-stone-200">{item.percent}%</span>
                </div>

                <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SRS Today's Review Queue */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">今日の復習 (Cần Ôn Hôm Nay)</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {reviewQueue.length} từ
              </span>
            </div>

            <p className="text-xs text-stone-400">
              Danh sách từ vựng cần ôn tập ngắt quãng để củng cố trí nhớ dài hạn:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
              {reviewQueue.length > 0 ? (
                reviewQueue.map((item) => (
                  <div
                    key={item.id}
                    className="bg-stone-950 border border-stone-800 p-2.5 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-sm font-bold text-amber-200 font-serif-jp">
                        {item.kanji || item.hiragana}
                      </span>
                      <span className="text-xs text-stone-400 ml-2">({item.hiragana})</span>
                    </div>
                    <span className="text-xs text-stone-300">{item.vietnamese}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-stone-500 italic">
                  Tất cả từ vựng hôm nay đã được ôn tập xong!
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-800 flex items-center gap-3">
            <button
              onClick={onNavigateToFlashcards}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Brain className="w-4 h-4" />
              <span>Luyện Flashcard ngay</span>
            </button>

            <button
              onClick={onNavigateToQuiz}
              className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs rounded-xl inline-flex items-center justify-center gap-2 transition-all border border-stone-700"
            >
              <Award className="w-4 h-4" />
              <span>Thi Trắc Nghiệm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
