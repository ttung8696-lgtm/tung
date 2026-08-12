import React, { useState } from "react";
import { 
  Sparkles, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  Volume2, 
  MessageSquare, 
  PenTool,
  HelpCircle,
  Lightbulb
} from "lucide-react";
import { speakJapanese } from "../../utils/speech";
import { apiUrl } from "../../utils/api";

interface GrammarAITutorProps {
  initialPrompt?: string;
}

export const GrammarAITutor: React.FC<GrammarAITutorProps> = ({ initialPrompt = "" }) => {
  const [activeSubTab, setActiveSubTab] = useState<"explain" | "checker">("explain");

  // Explain State
  const [explainQuery, setExplainQuery] = useState(initialPrompt || "");
  const [explainLevel, setExplainLevel] = useState("All");
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainResult, setExplainResult] = useState<any | null>(null);

  // Checker State
  const [checkSentence, setCheckSentence] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<any | null>(null);

  const handleExplainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explainQuery.trim()) return;

    setExplainLoading(true);
    try {
      const res = await fetch(apiUrl("/api/gemini/explain-grammar"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grammarQuery: explainQuery,
          levelHint: explainLevel !== "All" ? explainLevel : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setExplainResult(data.result);
      } else {
        alert(data.message || data.error || "Không thể kết nối AI Gemini.");
      }
    } catch (err: any) {
      console.error("Explain error:", err);
      alert("Lỗi khi kết nối dịch vụ AI. Vui lòng kiểm tra lại GEMINI_API_KEY.");
    } finally {
      setExplainLoading(false);
    }
  };

  const handleCheckerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkSentence.trim()) return;

    setCheckLoading(true);
    try {
      const res = await fetch(apiUrl("/api/gemini/check-grammar-sentence"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: checkSentence })
      });

      const data = await res.json();
      if (data.success) {
        setCheckResult(data.result);
      } else {
        alert(data.message || data.error || "Không thể kết nối AI Gemini.");
      }
    } catch (err: any) {
      console.error("Checker error:", err);
      alert("Lỗi khi kết nối dịch vụ AI.");
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtab Toggle */}
      <div className="flex items-center gap-2 bg-stone-900 p-1.5 rounded-2xl border border-stone-800 w-fit">
        <button
          onClick={() => setActiveSubTab("explain")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === "explain"
              ? "bg-amber-500 text-stone-950 shadow"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Hỏi & Giải thích Ngữ pháp</span>
        </button>

        <button
          onClick={() => setActiveSubTab("checker")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === "checker"
              ? "bg-amber-500 text-stone-950 shadow"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>AI Sửa Lỗi Câu & Luyện Viết</span>
        </button>
      </div>

      {/* SUBTAB 1: EXPLAIN GRAMMAR */}
      {activeSubTab === "explain" && (
        <div className="space-y-6">
          <form onSubmit={handleExplainSubmit} className="bg-stone-900 border border-stone-800 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-black text-amber-200">
                  Trợ Lý AI Giải Thích Ngữ Pháp (Gemini 3.6 Flash)
                </h3>
                <p className="text-xs text-stone-400">
                  Nhập mẫu ngữ pháp, từ nghi vấn hoặc câu tiếng Nhật bất kỳ để AI phân tích chuyên sâu.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <input
                type="text"
                value={explainQuery}
                onChange={(e) => setExplainQuery(e.target.value)}
                placeholder="Ví dụ: Phân biệt 〜てから và 〜たあとで hoặc Giải thích 〜わけがない..."
                className="flex-1 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-2xl py-3 px-4 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors"
              />

              <select
                value={explainLevel}
                onChange={(e) => setExplainLevel(e.target.value)}
                className="bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded-2xl px-3 font-semibold outline-none focus:border-amber-500"
              >
                <option value="All">Tất cả cấp độ</option>
                <option value="N5">Trình độ N5</option>
                <option value="N4">Trình độ N4</option>
                <option value="N3">Trình độ N3</option>
                <option value="N2">Trình độ N2</option>
                <option value="N1">Trình độ N1</option>
              </select>

              <button
                type="submit"
                disabled={explainLoading || !explainQuery.trim()}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all shrink-0"
              >
                {explainLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Giải thích ngay</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Quick Suggestions */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1">
              <span className="text-stone-500 font-medium shrink-0">Gợi ý câu hỏi:</span>
              {[
                "Phân biệt 〜てから và 〜たあとで",
                "Cách chia động từ thể khả năng N5",
                "Mẫu câu 〜わけがない khác gì 〜はずがない?",
                "Giải thích mẫu 〜にもかかわらず"
              ].map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setExplainQuery(sug)}
                  className="px-3 py-1 rounded-full bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 text-[11px] whitespace-nowrap transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </form>

          {/* Result Card */}
          {explainResult && (
            <div className="bg-stone-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn">
              <div className="flex items-start justify-between border-b border-stone-800 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase">
                    AI Giải Thích
                  </span>
                  <h3 className="text-2xl font-black text-amber-100 mt-2">{explainResult.title}</h3>
                  <p className="text-sm text-stone-300 font-semibold mt-1">Ý nghĩa: {explainResult.summary}</p>
                </div>
                <button
                  onClick={() => speakJapanese(explainResult.title)}
                  className="p-2.5 rounded-xl bg-stone-800 hover:bg-amber-500/20 text-amber-400 border border-stone-700"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Formula & Explanation */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 font-mono text-sm text-amber-400 font-bold">
                  ⚡ Cấu trúc: {explainResult.formula}
                </div>
                <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs md:text-sm text-stone-200 leading-relaxed space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Chi tiết hoàn cảnh & quy tắc sử dụng:</span>
                  </div>
                  <p>{explainResult.explanation}</p>
                </div>
              </div>

              {/* Nuance & Comparison */}
              {explainResult.nuance && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-1">
                  <div className="font-extrabold text-amber-300 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>Sắc thái & Mẹo ghi nhớ:</span>
                  </div>
                  <p className="text-stone-200 leading-relaxed">{explainResult.nuance}</p>
                </div>
              )}

              {/* Examples */}
              {explainResult.examples && explainResult.examples.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                    Các câu ví dụ thực tế do AI tổng hợp:
                  </h4>
                  <div className="space-y-3">
                    {explainResult.examples.map((ex: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-base font-bold text-stone-100">{ex.japanese}</p>
                          <p className="text-xs font-mono text-amber-400">{ex.hiragana}</p>
                          <p className="text-xs text-stone-300 font-medium">➔ {ex.vietnamese}</p>
                        </div>
                        <button
                          onClick={() => speakJapanese(ex.japanese)}
                          className="p-2 rounded-xl bg-stone-900 hover:bg-amber-500/20 text-amber-400 border border-stone-800 shrink-0"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: CHECK GRAMMAR SENTENCE */}
      {activeSubTab === "checker" && (
        <div className="space-y-6">
          <form onSubmit={handleCheckerSubmit} className="bg-stone-900 border border-stone-800 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <PenTool className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-black text-amber-200">
                  AI Kiểm Tra Câu & Luyện Viết Tiếng Nhật
                </h3>
                <p className="text-xs text-stone-400">
                  Thử tự đặt một câu tiếng Nhật. AI sẽ thẩm định ngữ pháp, chỉ ra lỗi sai và đề xuất cách viết chuẩn baản ngữ!
                </p>
              </div>
            </div>

            <textarea
              rows={3}
              value={checkSentence}
              onChange={(e) => setCheckSentence(e.target.value)}
              placeholder="Ví dụ nhập: 毎日日本語を勉強しますために、日本へ行きます。"
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-2xl p-4 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors"
            />

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-stone-500">
                Thử viết câu sử dụng các mẫu N5 - N1 bạn vừa học.
              </div>

              <button
                type="submit"
                disabled={checkLoading || !checkSentence.trim()}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                {checkLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sửa lỗi & Chấm điểm</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Checker Result Card */}
          {checkResult && (
            <div className="bg-stone-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn">
              {/* Score & Verdict Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl border font-black text-2xl flex items-center justify-center shrink-0 ${
                    checkResult.isCorrect
                      ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                      : "bg-amber-950 text-amber-300 border-amber-700"
                  }`}>
                    {checkResult.score} / 10
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-stone-100 flex items-center gap-2">
                      {checkResult.isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-5 h-5" /> Câu ngữ pháp chuẩn xác!
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-5 h-5" /> Phát hiện lỗi ngữ pháp!
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">Dịch nghĩa: {checkResult.translation}</p>
                  </div>
                </div>

                <button
                  onClick={() => speakJapanese(checkResult.correctedSentence)}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-500/20 text-amber-400 border border-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe câu sửa</span>
                </button>
              </div>

              {/* Corrected Sentence Box */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-1">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Câu tiếng Nhật chuẩn sau khi sửa:
                </div>
                <p className="text-lg font-bold text-emerald-100">{checkResult.correctedSentence}</p>
                {checkResult.correctedHiragana && (
                  <p className="text-xs font-mono text-emerald-300/80">{checkResult.correctedHiragana}</p>
                )}
              </div>

              {/* Mistakes Breakdown */}
              {checkResult.mistakes && checkResult.mistakes.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase text-stone-400">Chi tiết vị trí cần chỉnh sửa:</h5>
                  <div className="space-y-1.5">
                    {checkResult.mistakes.map((m: string, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-amber-200 font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Native Tips */}
              {checkResult.nativeTips && (
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1 text-xs">
                  <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>Mẹo viết tự nhiên như người bản ngữ:</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed font-medium">{checkResult.nativeTips}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
