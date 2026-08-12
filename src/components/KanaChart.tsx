import React, { useState, useRef, useEffect } from "react";
import { Volume2, Grid, PenTool, X, RefreshCw } from "lucide-react";
import { KANA_DATA } from "../data/kana";
import { playJapaneseSpeech } from "../utils/audio";

export const KanaChart: React.FC = () => {
  const [tab, setTab] = useState<"hiragana" | "katakana">("hiragana");
  const [writingKana, setWritingKana] = useState<{ char: string; romaji: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (writingKana && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 260;
      canvas.height = 260;

      // Draw grid
      ctx.strokeStyle = "rgba(217, 119, 6, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(130, 0); ctx.lineTo(130, 260);
      ctx.moveTo(0, 130); ctx.lineTo(260, 130);
      ctx.moveTo(0, 0); ctx.lineTo(260, 260);
      ctx.moveTo(260, 0); ctx.lineTo(0, 260);
      ctx.stroke();

      // Watermark
      ctx.font = "170px 'Noto Serif JP', 'Zen Maru Gothic', serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(writingKana.char, 130, 130);
    }
  }, [writingKana]);

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

    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#f59e0b";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (canvasRef.current && writingKana) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(217, 119, 6, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(130, 0); ctx.lineTo(130, 260);
      ctx.moveTo(0, 130); ctx.lineTo(260, 130);
      ctx.moveTo(0, 0); ctx.lineTo(260, 260);
      ctx.moveTo(260, 0); ctx.lineTo(0, 260);
      ctx.stroke();

      ctx.font = "170px 'Noto Serif JP', 'Zen Maru Gothic', serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(writingKana.char, 130, 130);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/90 p-5 rounded-3xl border border-stone-800 text-stone-100 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Bảng Chữ Cái Tiếng Nhật (Kana) & Luyện Viết</h2>
            <p className="text-xs text-stone-400">
              Bấm vào từng ô để nghe âm chuẩn hoặc nhấp biểu tượng bút để tập vẽ nét chữ Kana.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-stone-950 p-1.5 rounded-2xl border border-stone-800">
          <button
            onClick={() => setTab("hiragana")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "hiragana"
                ? "bg-amber-600 text-white shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Hiragana (あ)
          </button>
          <button
            onClick={() => setTab("katakana")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "katakana"
                ? "bg-amber-600 text-white shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Katakana (ア)
          </button>
        </div>
      </div>

      {/* Grid of Kana Characters */}
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
        {KANA_DATA.map((char, idx) => {
          const displayChar = tab === "hiragana" ? char.hiragana : char.katakana;
          return (
            <div
              key={idx}
              className="group relative flex flex-col items-center justify-center p-3.5 bg-stone-900/80 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-500/50 rounded-2xl transition-all shadow-sm"
            >
              <button
                onClick={() => playJapaneseSpeech(displayChar)}
                className="w-full flex flex-col items-center justify-center"
              >
                <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                  {displayChar}
                </span>
                <span className="text-[11px] font-mono text-stone-400 group-hover:text-amber-200 mt-1">
                  {char.romaji}
                </span>
              </button>

              <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => playJapaneseSpeech(displayChar)}
                  className="p-1 text-amber-400 hover:text-amber-300"
                  title="Nghe âm"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setWritingKana({ char: displayChar, romaji: char.romaji })}
                  className="p-1 text-amber-400 hover:text-amber-300"
                  title="Luyện viết"
                >
                  <PenTool className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kana Writing Canvas Modal */}
      {writingKana && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-amber-500/40 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Luyện Viết Chữ 【{writingKana.char}】 ({writingKana.romaji})
                </h3>
              </div>
              <button
                onClick={() => setWritingKana(null)}
                className="p-1 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
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

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={clearCanvas}
                className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Xóa vẽ lại</span>
              </button>

              <button
                onClick={() => playJapaneseSpeech(writingKana.char)}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe phát âm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
