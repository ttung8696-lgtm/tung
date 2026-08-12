import React, { useState } from "react";
import { GrammarItem, GrammarStatus } from "../../types";
import { 
  X, 
  Volume2, 
  Bookmark, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  GitCompare, 
  HelpCircle,
  Check,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { speakJapanese } from "../../utils/speech";

interface GrammarDetailModalProps {
  item: GrammarItem | null;
  status: GrammarStatus;
  bookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: (id: string) => void;
  onChangeStatus: (id: string, newStatus: GrammarStatus) => void;
  onAskAIAboutThis: (query: string) => void;
}

export const GrammarDetailModal: React.FC<GrammarDetailModalProps> = ({
  item,
  status,
  bookmarked,
  onClose,
  onToggleBookmark,
  onChangeStatus,
  onAskAIAboutThis
}) => {
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!item) return null;

  // Generate a quick test question for this grammar item
  const quizOptions = [
    item.examples[0]?.japanese || "手を洗ってから、ご飯を食べます。",
    "手を洗う前に、ご飯を食べます。",
    "手を洗ったあとで、ご飯を食べない。",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900 border border-amber-900/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-stone-950 border-b border-stone-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {item.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700">
                {item.category}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-amber-200 tracking-tight flex items-center gap-2">
              <span>{item.title}</span>
              <button
                onClick={() => speakJapanese(item.title)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-amber-500/20 text-amber-400 transition-colors"
                title="Phát âm"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </h2>
            <p className="text-sm font-semibold text-stone-300 mt-1">
              Ý nghĩa: {item.summary}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                bookmarked
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-stone-900 text-stone-400 border-stone-700"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6 text-stone-200 custom-scrollbar">
          {/* Formula & Conjugation Rules */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Cấu trúc & Cú pháp kết nối</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/90 font-mono text-sm md:text-base text-amber-300 font-bold border border-stone-800">
              {item.formula}
            </div>
            <p className="text-xs text-stone-300 leading-relaxed pt-1">
              {item.explanation}
            </p>
          </div>

          {/* Comparison / Nuances Box */}
          {item.comparison && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                <GitCompare className="w-4 h-4 text-amber-400" />
                <span>Phân biệt sắc thái với mẫu câu tương tự</span>
              </div>
              <div className="text-xs font-bold text-amber-200">
                Mẫu câu tương tự: <span className="underline font-mono">{item.comparison.similarPattern}</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
                {item.comparison.difference}
              </p>
            </div>
          )}

          {/* Example Sentences Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase text-stone-400 tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Các câu ví dụ mẫu ({item.examples.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {item.examples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 hover:border-stone-700/80 space-y-2 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base md:text-lg font-bold text-stone-100 tracking-wide">{ex.japanese}</p>
                      <p className="text-xs font-mono text-amber-400/90">{ex.hiragana}</p>
                      <p className="text-[11px] text-stone-500 font-mono">{ex.romaji}</p>
                    </div>
                    <button
                      onClick={() => speakJapanese(ex.japanese)}
                      className="p-2 rounded-xl bg-stone-900 hover:bg-amber-500/20 text-amber-400 border border-stone-800 shrink-0 transition-colors"
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-stone-300 font-medium pt-1 border-t border-stone-900">
                    ➔ {ex.vietnamese}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Helper Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/50 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300">Vẫn chưa hiểu rõ mẫu ngữ pháp này?</h4>
                <p className="text-[11px] text-stone-400">Hỏi Trợ lý AI Gemini để phân tích theo ví dụ của bạn.</p>
              </div>
            </div>
            <button
              onClick={() => {
                onAskAIAboutThis(`Hãy giải thích mẫu ngữ pháp ${item.title} (${item.summary}) bằng cách cho thêm ví dụ và cách ứng dụng thực tế.`);
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shrink-0"
            >
              <span>Hỏi Trợ lý AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium">Trạng thái:</span>
            <select
              value={status}
              onChange={(e) => onChangeStatus(item.id, e.target.value as GrammarStatus)}
              className="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-xl py-1.5 px-3 font-semibold outline-none focus:border-amber-500"
            >
              <option value="unlearned">Chưa học</option>
              <option value="studying">Đang học</option>
              <option value="mastered">Thành thục 🌟</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
