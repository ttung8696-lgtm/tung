import React from "react";
import { 
  X, 
  Volume2, 
  Bookmark, 
  CheckCircle, 
  BookOpen, 
  Sparkles, 
  Tag, 
  Lightbulb 
} from "lucide-react";
import { VocabItem } from "../types";
import { playJapaneseSpeech } from "../utils/audio";

interface VocabDetailModalProps {
  item: VocabItem | null;
  onClose: () => void;
  onToggleLearned: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const VocabDetailModal: React.FC<VocabDetailModalProps> = ({
  item,
  onClose,
  onToggleLearned,
  onToggleBookmark,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-stone-900 border border-amber-900/40 rounded-3xl p-6 shadow-2xl text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-500/30">
              {item.jlpt}
            </span>
            <span className="text-xs text-stone-400 bg-stone-800 px-3 py-1 rounded-full border border-stone-700">
              {item.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Kanji & Furigana display */}
        <div className="my-6 text-center">
          <p className="text-lg font-mono text-amber-300 font-semibold mb-1">
            {item.hiragana}
          </p>
          <h2 className="text-5xl font-bold font-serif text-white tracking-wider my-2">
            {item.kanji}
          </h2>
          <p className="text-sm text-stone-400 italic">
            Romaji: {item.romaji}
          </p>

          {item.hanViet && (
            <div className="mt-3 inline-block bg-amber-950/60 border border-amber-700/50 px-3 py-1 rounded-xl text-xs font-bold text-amber-300">
              Âm Hán Việt: {item.hanViet}
            </div>
          )}
        </div>

        {/* Audio Action Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => playJapaneseSpeech(item.kanji || item.hiragana)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-semibold text-sm shadow-lg shadow-amber-900/30 transition-all transform hover:scale-105"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe phát âm chuẩn</span>
          </button>
        </div>

        {/* Detailed Info Cards */}
        <div className="space-y-4">
          {/* Vietnamese Meaning */}
          <div className="bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Nghĩa Tiếng Việt
            </h4>
            <p className="text-base font-semibold text-stone-100">
              {item.vietnamese}
            </p>
          </div>

          {/* Example Sentence */}
          {item.example && (
            <div className="bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Ví dụ sử dụng
              </h4>
              <p className="text-sm font-semibold text-stone-100 mb-1">
                {item.example.japanese}
              </p>
              <p className="text-xs text-amber-300/90 font-mono mb-1">
                {item.example.hiragana}
              </p>
              <p className="text-xs text-stone-300 italic">
                👉 {item.example.vietnamese}
              </p>
              <button
                onClick={() => playJapaneseSpeech(item.example.japanese)}
                className="mt-2 text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <Volume2 className="w-3 h-3" /> Nghe toàn bộ câu ví dụ
              </button>
            </div>
          )}

          {/* Context Note */}
          {item.note && (
            <div className="bg-amber-950/20 p-3.5 rounded-2xl border border-amber-900/40">
              <h4 className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Ghi chú ngữ cảnh
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {item.note}
              </p>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                item.bookmarked
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${item.bookmarked ? "fill-amber-400" : ""}`} />
              <span>{item.bookmarked ? "Đã lưu" : "Lưu bài"}</span>
            </button>

            <button
              onClick={() => onToggleLearned(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                item.learned
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${item.learned ? "fill-emerald-400/20" : ""}`} />
              <span>{item.learned ? "Đã thuộc" : "Đánh dấu thuộc"}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
