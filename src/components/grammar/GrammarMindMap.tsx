import React, { useState } from "react";
import { GrammarItem } from "../../types";
import { GitBranch, Layers, ChevronRight, Volume2, Sparkles, BookOpen } from "lucide-react";
import { speakJapanese } from "../../utils/speech";

interface GrammarMindMapProps {
  grammarList: GrammarItem[];
  onSelectGrammar: (item: GrammarItem) => void;
}

export const GrammarMindMap: React.FC<GrammarMindMapProps> = ({ grammarList, onSelectGrammar }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>("All");

  // Group grammar items by mindMapGroup
  const groups: Record<string, GrammarItem[]> = {};
  grammarList.forEach((item) => {
    const groupKey = item.mindMapGroup || item.category || "Khác";
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
  });

  const groupKeys = Object.keys(groups);

  const groupThemeColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    "Trật tự thời gian (Sequence)": {
      bg: "bg-blue-950/40",
      border: "border-blue-700/60",
      text: "text-blue-200",
      badge: "bg-blue-900/80 text-blue-300"
    },
    "Quyền hạn & Quy tắc": {
      bg: "bg-emerald-950/40",
      border: "border-emerald-700/60",
      text: "text-emerald-200",
      badge: "bg-emerald-900/80 text-emerald-300"
    },
    "Mục đích & Động cơ": {
      bg: "bg-purple-950/40",
      border: "border-purple-700/60",
      text: "text-purple-200",
      badge: "bg-purple-900/80 text-purple-300"
    },
    "Tương quan & So sánh": {
      bg: "bg-amber-950/40",
      border: "border-amber-700/60",
      text: "text-amber-200",
      badge: "bg-amber-900/80 text-amber-300"
    },
    "Đánh giá & Phán đoán": {
      bg: "bg-rose-950/40",
      border: "border-rose-700/60",
      text: "text-rose-200",
      badge: "bg-rose-900/80 text-rose-300"
    },
    "Nguyên nhân & Hậu quả": {
      bg: "bg-orange-950/40",
      border: "border-orange-700/60",
      text: "text-orange-200",
      badge: "bg-orange-900/80 text-orange-300"
    }
  };

  const activeGroups = selectedGroup === "All" ? groupKeys : [selectedGroup];

  return (
    <div className="space-y-6">
      {/* Mind Map Controls */}
      <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <GitBranch className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-amber-200">
                Bản Đồ Tư Duy Quan Hệ Ngữ Pháp (Grammar Mind Map)
              </h3>
              <p className="text-xs text-stone-400">
                Hệ thống hóa các mẫu ngữ pháp có cùng chủ đề logic để so sánh, phân biệt và ghi nhớ lâu dài.
              </p>
            </div>
          </div>
        </div>

        {/* Group Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedGroup("All")}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedGroup === "All"
                ? "bg-amber-500 text-stone-950 shadow"
                : "bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800"
            }`}
          >
            🌐 Tất cả nhóm chủ đề ({groupKeys.length})
          </button>
          {groupKeys.map((gk) => (
            <button
              key={gk}
              onClick={() => setSelectedGroup(gk)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedGroup === gk
                  ? "bg-amber-500 text-stone-950 shadow"
                  : "bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800"
              }`}
            >
              {gk} ({groups[gk].length})
            </button>
          ))}
        </div>
      </div>

      {/* Visual Tree Rendering */}
      <div className="space-y-8">
        {activeGroups.map((gKey) => {
          const items = groups[gKey] || [];
          const style = groupThemeColors[gKey] || {
            bg: "bg-stone-900/50",
            border: "border-stone-800",
            text: "text-amber-300",
            badge: "bg-stone-800 text-stone-300"
          };

          return (
            <div key={gKey} className={`p-6 rounded-3xl border ${style.border} ${style.bg} space-y-5 shadow-xl relative overflow-hidden`}>
              {/* Central Topic Node */}
              <div className="flex items-center gap-3 border-b border-stone-800/80 pb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${style.border} ${style.text}`}>
                  Chủ đề trung tâm
                </span>
                <h4 className={`text-xl font-black ${style.text} tracking-tight`}>
                  {gKey}
                </h4>
                <span className="text-xs font-mono text-stone-400">
                  ({items.length} mẫu ngữ pháp)
                </span>
              </div>

              {/* Connected Grammar Branch Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectGrammar(item)}
                    className="group cursor-pointer bg-stone-950 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/50 p-4 rounded-2xl transition-all duration-300 space-y-2 relative shadow-md hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-stone-900 text-amber-300 border border-amber-500/30">
                        {item.level}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(item.title);
                        }}
                        className="p-1 rounded-lg hover:bg-stone-800 text-stone-500 hover:text-amber-300 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h5 className="text-lg font-bold text-amber-200 group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h5>

                    <p className="text-xs text-stone-400 font-mono font-medium line-clamp-1">
                      {item.formula}
                    </p>

                    <p className="text-xs text-stone-300 line-clamp-2">
                      💡 {item.summary}
                    </p>

                    <div className="pt-2 flex items-center justify-end text-[11px] font-bold text-amber-400 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>Xem sơ đồ & chi tiết</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
