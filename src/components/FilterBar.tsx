import React from "react";
import { 
  Search, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  Bookmark, 
  Tag, 
  Layers
} from "lucide-react";
import { FilterState, JLPTLevel, Category, WordType, MemoryStatus } from "../types";
import { JLPT_CATEGORIES } from "../data/vocabulary";
import { ScrollableHorizontalBar } from "./common/ScrollableHorizontalBar";

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalFiltered: number;
  totalAll: number;
  onResetFilters: () => void;
}

const JLPT_LEVELS: JLPTLevel[] = ["All", "N5", "N4", "N3", "N2", "N1"];

const WORD_TYPES: { label: string; value: WordType }[] = [
  { label: "Tất cả loại từ", value: "all" },
  { label: "Danh từ (Noun)", value: "noun" },
  { label: "Động từ (Verb)", value: "verb" },
  { label: "Tính từ -i", value: "i-adj" },
  { label: "Tính từ -na", value: "na-adj" },
  { label: "Phó từ (Adverb)", value: "adverb" },
  { label: "Cụm từ / Mẫu câu", value: "phrase" },
];

const STATUS_OPTIONS: { label: string; value: MemoryStatus; icon: React.ReactNode }[] = [
  { label: "Tất cả từ", value: "all", icon: <Layers className="w-3.5 h-3.5" /> },
  { label: "Chưa thuộc", value: "unlearned", icon: <Filter className="w-3.5 h-3.5 text-amber-500" /> },
  { label: "Đã thuộc", value: "learned", icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
  { label: "Đã đánh dấu", value: "bookmarked", icon: <Bookmark className="w-3.5 h-3.5 text-amber-400" /> },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  totalFiltered,
  totalAll,
  onResetFilters,
}) => {
  return (
    <div className="bg-stone-900/80 backdrop-blur border border-stone-800 rounded-2xl p-4 md:p-5 shadow-sm mb-6 text-stone-200">
      <div className="flex flex-col gap-4">
        {/* Top Row: Search Input & Level Selection */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Tìm kiếm Kanji, Hiragana, Romaji, Nghĩa tiếng Việt..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
            {filter.searchQuery && (
              <button
                onClick={() => setFilter((prev) => ({ ...prev, searchQuery: "" }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200 px-1.5 py-0.5 rounded bg-stone-800"
              >
                Xóa
              </button>
            )}
          </div>

          {/* JLPT Level Pills */}
          <div className="flex-1 min-w-0">
            <ScrollableHorizontalBar className="gap-1.5 pb-1 md:pb-0">
              <span className="text-xs font-semibold text-stone-400 mr-1 hidden lg:inline shrink-0">Cấp độ:</span>
              {JLPT_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter((prev) => ({ ...prev, jlpt: level }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    filter.jlpt === level
                      ? "bg-gradient-to-r from-red-700 to-amber-700 text-white shadow border border-red-500/30"
                      : "bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-stone-100 border border-stone-700/50"
                  }`}
                >
                  {level === "All" ? "Tất cả JLPT" : level}
                </button>
              ))}
            </ScrollableHorizontalBar>
          </div>
        </div>

        {/* Bottom Row: Dropdowns & Status filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800/80">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Memory Status Buttons */}
            <div className="flex items-center gap-1 bg-stone-950/70 p-1 rounded-xl border border-stone-800">
              {STATUS_OPTIONS.map((st) => (
                <button
                  key={st.value}
                  onClick={() => setFilter((prev) => ({ ...prev, status: st.value }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter.status === st.value
                      ? "bg-amber-600/30 text-amber-200 border border-amber-500/40"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {st.icon}
                  <span>{st.label}</span>
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={filter.category}
                onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value as Category }))}
                className="appearance-none pl-9 pr-8 py-1.5 bg-stone-950/70 border border-stone-800 rounded-xl text-xs font-medium text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {JLPT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-stone-900 text-stone-100">
                    {cat === "All" ? "Tất cả chủ đề" : `Chủ đề: ${cat}`}
                  </option>
                ))}
              </select>
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>

            {/* Word Type Dropdown */}
            <div className="relative">
              <select
                value={filter.wordType}
                onChange={(e) => setFilter((prev) => ({ ...prev, wordType: e.target.value as WordType }))}
                className="appearance-none pl-9 pr-8 py-1.5 bg-stone-950/70 border border-stone-800 rounded-xl text-xs font-medium text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {WORD_TYPES.map((wt) => (
                  <option key={wt.value} value={wt.value} className="bg-stone-900 text-stone-100">
                    {wt.label}
                  </option>
                ))}
              </select>
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Status Summary & Reset */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">
              Hiển thị <strong className="text-amber-300 font-bold">{totalFiltered}</strong> / {totalAll} từ
            </span>

            <button
              onClick={onResetFilters}
              title="Đặt lại bộ lọc"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs transition-all border border-stone-700/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
