import React, { useState, useRef, useEffect } from "react";
import { X, Volume2, Sparkles, Check, Bookmark, RefreshCw, PenTool, BookOpen, Layers } from "lucide-react";
import { KanjiItem } from "../../data/kanjiData";

interface KanjiDetailModalProps {
  item: KanjiItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  isMastered: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleMastered: (id: string) => void;
}

export const KanjiDetailModal: React.FC<KanjiDetailModalProps> = ({
  item,
  onClose,
  isBookmarked,
  isMastered,
  onToggleBookmark,
  onToggleMastered,
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "practice">("info");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (item) {
      setActiveTab("info");
    }
  }, [item]);

  // Setup Canvas when practice tab opens
  useEffect(() => {
    if (activeTab === "practice" && canvasRef.current && item) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = 300;
      canvas.height = 300;

      // Draw faint grid background
      ctx.strokeStyle = "rgba(217, 119, 6, 0.15)"; // faint amber grid
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(150, 0); ctx.lineTo(150, 300);
      ctx.moveTo(0, 150); ctx.lineTo(300, 150);
      ctx.moveTo(0, 0); ctx.lineTo(300, 300);
      ctx.moveTo(300, 0); ctx.lineTo(0, 300);
      ctx.stroke();

      // Draw trace watermark of Kanji
      ctx.font = "200px 'Noto Serif JP', 'Zen Maru Gothic', serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.kanji, 150, 150);
    }
  }, [activeTab, item]);

  if (!item) return null;

  // Speak audio using Web Speech API
  const speakJapanese = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#f59e0b"; // vibrant amber brush

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (canvasRef.current && item) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw grid & watermark
      ctx.strokeStyle = "rgba(217, 119, 6, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(150, 0); ctx.lineTo(150, 300);
      ctx.moveTo(0, 150); ctx.lineTo(300, 150);
      ctx.moveTo(0, 0); ctx.lineTo(300, 300);
      ctx.moveTo(300, 0); ctx.lineTo(0, 300);
      ctx.stroke();

      ctx.font = "200px 'Noto Serif JP', 'Zen Maru Gothic', serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.kanji, 150, 150);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-amber-900/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header Modal Bar */}
        <div className="sticky top-0 z-10 bg-stone-900/95 backdrop-blur px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              JLPT {item.jlpt}
            </span>
            <span className="text-xs font-semibold text-stone-400">
              Bộ thủ: <strong className="text-stone-200">{item.radical}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-stone-800 text-stone-400 border-stone-700 hover:text-white"
              }`}
              title="Lưu yêu thích"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleMastered(item.id)}
              className={`p-2 rounded-xl border transition-all ${
                isMastered
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                  : "bg-stone-800 text-stone-400 border-stone-700 hover:text-white"
              }`}
              title="Đánh dấu đã thuộc"
            >
              <Check className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Main Hero Showcase */}
          <div className="bg-gradient-to-b from-stone-950 to-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <div className="flex items-baseline gap-3">
                <h2 className="text-6xl md:text-7xl font-extrabold text-amber-300 font-serif-jp tracking-wide">
                  {item.kanji}
                </h2>
                <button
                  onClick={() => speakJapanese(item.kanji)}
                  className="p-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all cursor-pointer"
                  title="Phát âm Hán tự"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-red-400 uppercase tracking-widest font-mono">
                  【{item.hanViet}】
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  ({item.strokes} nét)
                </span>
              </div>

              <p className="text-sm font-medium text-stone-300 mt-1">
                {item.meaningVi}
              </p>
            </div>

            {/* Quick Switch Tabs: Chi tiết vs Luyện viết */}
            <div className="flex md:flex-col gap-2 w-full md:w-auto">
              <button
                onClick={() => setActiveTab("info")}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  activeTab === "info"
                    ? "bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md"
                    : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Chi tiết & Từ ghép</span>
              </button>

              <button
                onClick={() => setActiveTab("practice")}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  activeTab === "practice"
                    ? "bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md"
                    : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700"
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>Luyện viết nét Hán tự</span>
              </button>
            </div>
          </div>

          {/* TAB 1: INFO & READINGS */}
          {activeTab === "info" ? (
            <div className="space-y-6">
              {/* Readings Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-800/60 border border-stone-700/60 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <span>音読み (Âm On)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.onyomi.length > 0 ? (
                      item.onyomi.map((on, idx) => (
                        <span
                          key={idx}
                          onClick={() => speakJapanese(on)}
                          className="px-2.5 py-1 bg-stone-900 text-amber-300 border border-amber-500/30 rounded-lg text-sm font-bold font-serif-jp cursor-pointer hover:bg-amber-500/20 transition-colors"
                        >
                          {on}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-500 italic">Không có âm On thông dụng</span>
                    )}
                  </div>
                </div>

                <div className="bg-stone-800/60 border border-stone-700/60 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <span>訓読み (Âm Kun)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.kunyomi.length > 0 ? (
                      item.kunyomi.map((kun, idx) => (
                        <span
                          key={idx}
                          onClick={() => speakJapanese(kun)}
                          className="px-2.5 py-1 bg-stone-900 text-emerald-300 border border-emerald-500/30 rounded-lg text-sm font-bold font-serif-jp cursor-pointer hover:bg-emerald-500/20 transition-colors"
                        >
                          {kun}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-500 italic">Không có âm Kun thông dụng</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Compound Words Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Từ ghép thông dụng (熟語)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.compounds.map((comp, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-950/70 border border-stone-800 hover:border-stone-700 p-3 rounded-xl flex items-center justify-between transition-all"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-amber-200 font-serif-jp">
                            {comp.word}
                          </span>
                          <span className="text-xs text-stone-400 font-medium">
                            ({comp.reading})
                          </span>
                        </div>
                        <p className="text-xs text-stone-300">{comp.meaning}</p>
                      </div>

                      <button
                        onClick={() => speakJapanese(comp.word)}
                        className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-300 transition-colors"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Sentences */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  <span>Ví dụ câu ứng dụng</span>
                </h3>

                <div className="space-y-2">
                  {item.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-800/40 border border-stone-700/40 p-3.5 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-amber-100 font-serif-jp">
                            {ex.japanese}
                          </p>
                          <p className="text-xs text-stone-400">{ex.reading}</p>
                        </div>
                        <button
                          onClick={() => speakJapanese(ex.japanese)}
                          className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-amber-300 transition-colors shrink-0"
                          title="Phát âm câu"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-300 pt-1 border-t border-stone-800">
                        👉 {ex.vietnamese}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: CANVAS PRACTICE */
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-stone-400">
                  Dùng chuột hoặc ngón tay vẽ theo mờ của chữ <strong>{item.kanji}</strong> bên dưới:
                </p>
              </div>

              <div className="relative border-2 border-amber-500/40 rounded-2xl bg-stone-950 p-2 shadow-inner">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                  className="cursor-crosshair touch-none rounded-xl bg-stone-950"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={clearCanvas}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-all border border-stone-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Xóa vẽ lại</span>
                </button>

                <button
                  onClick={() => speakJapanese(item.kanji)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Phát âm lại</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
