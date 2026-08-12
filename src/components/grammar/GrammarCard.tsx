import React from "react";
import { GrammarItem, GrammarStatus } from "../../types";
import { 
  Volume2, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ChevronRight,
  BookOpen,
  Sparkles,
  GitCompare
} from "lucide-react";
import { speakJapanese } from "../../utils/speech";

interface GrammarCardProps {
  item: GrammarItem;
  status: GrammarStatus;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onChangeStatus: (id: string, newStatus: GrammarStatus) => void;
  onSelectDetail: (item: GrammarItem) => void;
}

export const GrammarCard: React.FC<GrammarCardProps> = React.memo(({
  item,
  status,
  bookmarked,
  onToggleBookmark,
  onChangeStatus,
  onSelectDetail
}) => {
  const levelColors: Record<string, string> = {
    N5: "bg-emerald-950/80 text-emerald-300 border-emerald-700/60",
    N4: "bg-blue-950/80 text-blue-300 border-blue-700/60",
    N3: "bg-amber-950/80 text-amber-300 border-amber-700/60",
    N2: "bg-purple-950/80 text-purple-300 border-purple-700/60",
    N1: "bg-rose-950/80 text-rose-300 border-rose-700/60",
  };

  const statusColors: Record<GrammarStatus, { bg: string; text: string; label: string }> = {
    unlearned: { bg: "bg-stone-900 border-stone-800 text-stone-400", text: "text-stone-400", label: "Chưa học" },
    studying: { bg: "bg-amber-950/60 border-amber-800/80 text-amber-300", text: "text-amber-300", label: "Đang học" },
    mastered: { bg: "bg-emerald-950/60 border-emerald-800/80 text-emerald-300", text: "text-emerald-300", label: "Thành thục" },
  };

  return (
    <div className="group relative bg-stone-900/90 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-4 md:p-5 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-amber-950/20 flex flex-col justify-between">
      {/* Top Header: Badge, Level, Bookmark */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${levelColors[item.level]}`}>
            {item.level}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-800 text-stone-300 border border-stone-700">
            {item.category}
          </span>
          {item.comparison && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
              <GitCompare className="w-3 h-3 text-amber-400" />
              <span>Phân biệt sắc thái</span>
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleBookmark(item.id)}
          className={`p-2 rounded-xl border transition-all ${
            bookmarked
              ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
              : "bg-stone-950 text-stone-500 border-stone-800 hover:text-stone-300"
          }`}
          title={bookmarked ? "Đã lưu yêu thích" : "Lưu điểm ngữ pháp"}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
        </button>
      </div>

      {/* Main Title & Formula */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg md:text-xl font-extrabold text-amber-200 tracking-tight group-hover:text-amber-300 transition-colors">
            {item.title}
          </h3>
          <button
            onClick={() => speakJapanese(item.title)}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-amber-500/20 text-stone-400 hover:text-amber-300 transition-colors"
            title="Nghe phát âm"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Formula Box */}
        <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80 font-mono text-xs text-amber-400/90 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span className="font-semibold text-stone-200">Cấu trúc:</span>
          <span className="truncate">{item.formula}</span>
        </div>

        {/* Short Summary */}
        <p className="text-xs md:text-sm text-stone-300 font-medium line-clamp-2 leading-relaxed">
          💡 {item.summary}
        </p>
      </div>

      {/* First Example snippet */}
      {item.examples.length > 0 && (
        <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/60 mb-4 text-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400 font-medium text-[11px]">
            <span>Ví dụ minh họa:</span>
            <button
              onClick={() => speakJapanese(item.examples[0].japanese)}
              className="text-amber-400 hover:underline text-[10px] flex items-center gap-1"
            >
              <Volume2 className="w-3 h-3" />
              <span>Nghe câu</span>
            </button>
          </div>
          <p className="text-stone-100 font-semibold">{item.examples[0].japanese}</p>
          <p className="text-amber-300/80 text-[11px]">{item.examples[0].vietnamese}</p>
        </div>
      )}

      {/* Footer: Status Toggle & Details Button */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-800/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const next: Record<GrammarStatus, GrammarStatus> = {
                unlearned: "studying",
                studying: "mastered",
                mastered: "unlearned"
              };
              onChangeStatus(item.id, next[status]);
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 ${statusColors[status].bg}`}
            title="Bấm để thay đổi trạng thái thuộc"
          >
            {status === "mastered" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            {status === "studying" && <Clock className="w-3.5 h-3.5 text-amber-400" />}
            {status === "unlearned" && <BookOpen className="w-3.5 h-3.5 text-stone-500" />}
            <span>{statusColors[status].label}</span>
          </button>
        </div>

        <button
          onClick={() => onSelectDetail(item)}
          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-all group/btn"
        >
          <span>Xem chi tiết</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
});
