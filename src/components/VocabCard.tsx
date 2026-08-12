import React, { useState } from "react";
import { Volume2, Bookmark, CheckCircle, Info, Sparkles } from "lucide-react";
import { VocabItem } from "../types";
import { playJapaneseSpeech } from "../utils/audio";

interface VocabCardProps {
  item: VocabItem;
  onToggleLearned: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onOpenDetail: (item: VocabItem) => void;
}

const JLPT_COLOR_MAP: Record<string, string> = {
  N5: "bg-emerald-950/80 text-emerald-300 border-emerald-700/60",
  N4: "bg-cyan-950/80 text-cyan-300 border-cyan-700/60",
  N3: "bg-blue-950/80 text-blue-300 border-blue-700/60",
  N2: "bg-amber-950/80 text-amber-300 border-amber-700/60",
  N1: "bg-red-950/80 text-red-300 border-red-700/60",
};

export const VocabCard: React.FC<VocabCardProps> = React.memo(({
  item,
  onToggleLearned,
  onToggleBookmark,
  onOpenDetail,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    playJapaneseSpeech(item.kanji || item.hiragana);
    setTimeout(() => setIsPlaying(false), 800);
  };

  return (
    <div
      onClick={() => onOpenDetail(item)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 ${
        item.learned
          ? "bg-stone-900/60 border-emerald-900/40 hover:border-emerald-600/60"
          : "bg-stone-900/90 border-stone-800 hover:border-amber-500/50"
      }`}
    >
      {/* Top badges & action buttons */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider ${
              JLPT_COLOR_MAP[item.jlpt] || "bg-stone-800 text-stone-300"
            }`}
          >
            {item.jlpt}
          </span>
          <span className="text-[11px] font-medium text-stone-400 bg-stone-950/60 px-2.5 py-0.5 rounded-full border border-stone-800">
            {item.category}
          </span>
          {item.custom && (
            <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Sparkles className="w-2.5 h-2.5" /> Thêm bởi bạn
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Audio Button */}
          <button
            onClick={handleAudio}
            title="Phát âm tiếng Nhật"
            className={`p-2 rounded-xl transition-all ${
              isPlaying
                ? "bg-amber-500 text-stone-950 scale-110"
                : "bg-stone-800/80 text-stone-300 hover:text-amber-300 hover:bg-stone-700"
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(item.id);
            }}
            title={item.bookmarked ? "Bỏ lưu từ" : "Lưu vào danh sách yêu thích"}
            className={`p-2 rounded-xl transition-all ${
              item.bookmarked
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "bg-stone-800/80 text-stone-400 hover:text-amber-300 hover:bg-stone-700"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${item.bookmarked ? "fill-amber-400" : ""}`} />
          </button>

          {/* Learned Status Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLearned(item.id);
            }}
            title={item.learned ? "Đánh dấu chưa thuộc" : "Đánh dấu đã thuộc"}
            className={`p-2 rounded-xl transition-all ${
              item.learned
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-stone-800/80 text-stone-400 hover:text-emerald-400 hover:bg-stone-700"
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${item.learned ? "fill-emerald-400/20" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Content: Kanji, Furigana, Meaning */}
      <div className="my-2 text-center py-2">
        {/* Furigana / Hiragana */}
        <p className="text-sm font-semibold text-amber-300/90 mb-1 tracking-wider font-mono">
          {item.hiragana}
        </p>

        {/* Kanji Main Title */}
        <h3 className="text-3xl md:text-4xl font-bold font-serif text-stone-100 tracking-wide my-1 group-hover:text-amber-200 transition-colors">
          {item.kanji}
        </h3>

        {/* Romaji */}
        <p className="text-xs text-stone-400 italic mb-2">
          [{item.romaji}]
        </p>

        {/* Han-Viet Sino Vietnamese */}
        {item.hanViet && (
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-stone-950 text-amber-400/90 border border-amber-900/30">
            Hán Việt: {item.hanViet}
          </span>
        )}
      </div>

      {/* Vietnamese Meaning */}
      <div className="mt-3 pt-3 border-t border-stone-800/80 text-center">
        <p className="text-sm font-medium text-stone-200 line-clamp-2">
          {item.vietnamese}
        </p>
      </div>

      {/* Footer hint */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 group-hover:text-amber-400/80 transition-colors">
        <span className="capitalize text-stone-400">{item.type}</span>
        <span className="flex items-center gap-1 font-medium">
          Xem chi tiết <Info className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
});
