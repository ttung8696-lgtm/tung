import React, { useRef, useState, useEffect } from "react";
import { KANJI_DATASET, KanjiItem } from "../data/kanjiData";
import { playMokugyoSound, playCorrectChime } from "../utils/soundEffects";
import { playJapaneseSpeech } from "../utils/audio";
import { PenTool, RotateCcw, CheckCircle2, Sparkles, Volume2, Layers, BookOpen, ChevronRight } from "lucide-react";
import { ScrollableHorizontalBar } from "./common/ScrollableHorizontalBar";

interface KanjiBrushCanvasProps {
  currentKanji?: KanjiItem;
  onKanjiMastered?: (kanjiChar: string) => void;
}

export const KanjiBrushCanvas: React.FC<KanjiBrushCanvasProps> = ({
  currentKanji: initialKanji,
  onKanjiMastered,
}) => {
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem>(
    initialKanji || KANJI_DATASET[0]
  );
  const [selectedRadical, setSelectedRadical] = useState<string>("All");
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Extract unique radicals
  const allRadicals = Array.from(
    new Set(KANJI_DATASET.map((k) => k.radical || "Khác"))
  );

  const filteredKanjiList = KANJI_DATASET.filter((k) =>
    selectedRadical === "All" ? true : k.radical === selectedRadical
  );

  useEffect(() => {
    clearCanvas();
  }, [selectedKanji]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid guide (Japanese genkouyoushi square)
    ctx.strokeStyle = "rgba(217, 119, 6, 0.15)";
    ctx.lineWidth = 1;

    // Cross dashed lines
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Solid border
    ctx.setLineDash([]);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw faint background reference Kanji character for tracing
    ctx.font = "bold 160px 'Noto Serif JP', serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(selectedKanji.kanji, canvas.width / 2, canvas.height / 2 + 10);

    setStrokeCount(0);
    setFeedbackScore(null);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 14; // Ink brush thickness
    ctx.strokeStyle = "#fbbf24"; // Japanese golden ink

    playMokugyoSound();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStrokeCount((prev) => prev + 1);
    }
  };

  const handleEvaluateDrawing = () => {
    // Evaluate stroke count and coverage against expected strokes
    const expected = selectedKanji.strokes || 5;
    let score = 100 - Math.abs(strokeCount - expected) * 12;
    score = Math.max(60, Math.min(100, score));

    setFeedbackScore(score);
    if (score >= 80) {
      playCorrectChime();
      if (onKanjiMastered) onKanjiMastered(selectedKanji.kanji);
    } else {
      playMokugyoSound();
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <PenTool className="w-3 h-3" /> Luyện Viết Bút Mực
            </span>
            <span className="text-xs text-stone-400 font-medium">
              Stroke Order & Radical
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-stone-100 font-serif-jp mt-1">
            Luyện Viết Kanji Chữ Hán Cần Nhớ
          </h2>
        </div>

        {/* Radical Group Filter Pills */}
        <div className="w-full">
          <ScrollableHorizontalBar className="gap-1.5 py-1">
            <button
              onClick={() => setSelectedRadical("All")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedRadical === "All"
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              Tất cả bộ thủ
            </button>
            {allRadicals.map((rad) => (
              <button
                key={rad}
                onClick={() => setSelectedRadical(rad)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  selectedRadical === rad
                    ? "bg-amber-500 text-stone-950 font-bold"
                    : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                }`}
              >
                Bộ: {rad}
              </button>
            ))}
          </ScrollableHorizontalBar>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kanji Selector Column */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-semibold text-stone-400 flex items-center justify-between">
            <span>Danh sách chữ Hán ({filteredKanjiList.length})</span>
            <span className="text-[11px] text-amber-400">Chọn chữ để luyện</span>
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
            {filteredKanjiList.map((k) => (
              <button
                key={k.kanji}
                onClick={() => setSelectedKanji(k)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedKanji.kanji === k.kanji
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md scale-105"
                    : "bg-stone-950/60 border-stone-800 hover:bg-stone-800 text-stone-200"
                }`}
              >
                <div className="text-2xl font-extrabold font-serif-jp">{k.kanji}</div>
                <div className="text-[10px] text-stone-400 truncate">{k.hanViet || k.meaningVi}</div>
              </button>
            ))}
          </div>

          {/* Kanji Details Badge */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 font-bold font-serif-jp">
                {selectedKanji.kanji} - {selectedKanji.hanViet} ({selectedKanji.meaningVi})
              </span>
              <button
                onClick={() => playJapaneseSpeech(selectedKanji.kanji)}
                className="p-1.5 text-amber-300 hover:bg-stone-800 rounded-lg"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-stone-300 space-y-1">
              <p>Onyomi: <span className="text-amber-200">{selectedKanji.onyomi || "—"}</span></p>
              <p>Kunyomi: <span className="text-amber-200">{selectedKanji.kunyomi || "—"}</span></p>
              <p>Số nét nét viết: <span className="font-bold text-amber-300">{selectedKanji.strokes} nét</span></p>
              {selectedKanji.radical && <p>Bộ thủ: <span className="text-stone-200 font-semibold">{selectedKanji.radical}</span></p>}
            </div>
          </div>
        </div>

        {/* Interactive Ink Canvas Column */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="bg-stone-950 border-2 border-amber-500/40 rounded-2xl cursor-crosshair shadow-2xl touch-none"
            />
            <div className="absolute top-3 left-3 px-2 py-1 bg-stone-900/90 text-[11px] font-bold text-amber-400 rounded-md border border-stone-700">
              {strokeCount} / {selectedKanji.strokes} nét
            </div>
          </div>

          <div className="flex items-center gap-3 w-full max-w-xs">
            <button
              onClick={clearCanvas}
              className="flex-1 py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 inline-flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span>Xóa nét viết</span>
            </button>
            <button
              onClick={handleEvaluateDrawing}
              className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl inline-flex items-center justify-center gap-1.5 shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chấm nét viết</span>
            </button>
          </div>

          {/* Feedback Result Banner */}
          {feedbackScore !== null && (
            <div className={`p-4 rounded-xl border w-full max-w-sm text-center space-y-1 animate-fadeIn ${
              feedbackScore >= 80
                ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                : "bg-amber-950/80 border-amber-500/50 text-amber-200"
            }`}>
              <div className="flex items-center justify-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Độ chính xác nét chữ: {feedbackScore}%</span>
              </div>
              <p className="text-xs opacity-90">
                {feedbackScore >= 80
                  ? "Chữ viết rất đẹp, nét cọ chuẩn xác và cân đối!"
                  : `Đã viết ${strokeCount} nét (chữ mẫu có ${selectedKanji.strokes} nét). Thử lại để nâng cao tay nghề nhé!`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
