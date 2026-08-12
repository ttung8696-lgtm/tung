import React, { useState } from "react";
import { JLPTLevel } from "../types";
import { BookOpen, Sparkles, Volume2, RefreshCw, Compass, HelpCircle, CheckCircle, XCircle, Tag } from "lucide-react";
import { playJapaneseSpeech } from "../utils/audio";
import { playMokugyoSound, playCorrectChime } from "../utils/soundEffects";

interface AIReadingPassagesProps {
  userLearnedWords?: string[];
}

const TOPIC_PRESETS = [
  "🎲 Ngẫu nhiên đa dạng (AI tự chọn chủ đề mới)",
  "🏯 Văn hóa & Du lịch Nhật Bản (Lễ hội, Onsen, Kyoto)",
  "🍱 Ẩm thực & Món ăn Nhật (Ramen, Sushi, Bento, Matcha)",
  "💼 Công việc & Môi trường công sở Nhật",
  "🏫 Trường học & Tình bạn thanh xuân",
  "🌸 Thiên nhiên & Bốn mùa (Hoa anh đào, Lá đỏ, Tuyết)",
  "🧙‍♂️ Truyện cổ tích & Truyền thuyết Nhật Bản",
  "🛍️ Đời sống thường nhật & Mua sắm tại Konbini",
  "✏️ Tự nhập chủ đề..."
];

export const AIReadingPassages: React.FC<AIReadingPassagesProps> = ({ userLearnedWords = [] }) => {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>("N5");
  const [selectedPresetTopic, setSelectedPresetTopic] = useState<string>(TOPIC_PRESETS[0]);
  const [customTopicInput, setCustomTopicInput] = useState<string>("");
  const [recentTopicsHistory, setRecentTopicsHistory] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [passage, setPassage] = useState<any | null>(null);
  const [selectedWordGloss, setSelectedWordGloss] = useState<any | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const getEffectiveTopic = (): string => {
    if (selectedPresetTopic === "✏️ Tự nhập chủ đề...") {
      return customTopicInput.trim() || "Ngẫu nhiên";
    }
    return selectedPresetTopic;
  };

  const handleGeneratePassage = async (overrideTopic?: string) => {
    setIsLoading(true);
    setPassage(null);
    setSelectedWordGloss(null);
    setUserAnswers({});
    playMokugyoSound();

    const topicToUse = overrideTopic || getEffectiveTopic();

    try {
      const res = await fetch("/api/gemini/reading-passage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jlptLevel: selectedLevel,
          targetVocabList: userLearnedWords.slice(0, 10),
          topic: topicToUse,
          excludeTopics: recentTopicsHistory.slice(-5),
        }),
      });

      const data = await res.json();
      if (data.success && data.passage) {
        setPassage(data.passage);
        if (data.passage.topic) {
          setRecentTopicsHistory((prev) => [...prev, data.passage.topic]);
        }
        playCorrectChime();
      } else {
        console.warn("Notice generating passage:", data.message);
      }
    } catch (err) {
      console.error("Lỗi tạo bài đọc:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Bài Đọc Ngắn AI
            </span>
            <span className="text-xs text-stone-400 font-medium">
              Tự động lồng ghép từ vựng cá nhân
            </span>
          </div>
          <h2 className="text-lg font-bold text-stone-100 font-serif-jp mt-1">
            Luyện Đọc Hiểu Tiếng Nhật Đa Dạng Chủ Đề
          </h2>
        </div>

        {/* Level Controls */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-stone-400 font-medium">Cấp độ:</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as JLPTLevel)}
            className="bg-stone-950 text-xs text-amber-300 font-bold border border-stone-700 px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-500"
          >
            <option value="N5">JLPT N5 (Cơ bản)</option>
            <option value="N4">JLPT N4 (Sơ cấp)</option>
            <option value="N3">JLPT N3 (Trung cấp)</option>
            <option value="N2">JLPT N2 (Thượng cấp)</option>
            <option value="N1">JLPT N1 (Cao cấp)</option>
          </select>
        </div>
      </div>

      {/* Topic Selection Bar */}
      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Chọn chủ đề bài đọc mong muốn:</span>
          </label>
          {recentTopicsHistory.length > 0 && (
            <span className="text-[11px] text-stone-400">
              Đã khám phá {recentTopicsHistory.length} chủ đề
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {TOPIC_PRESETS.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedPresetTopic(t)}
              className={`px-3 py-2 text-left rounded-xl text-xs font-semibold transition-all border ${
                selectedPresetTopic === t
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm"
                  : "bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700 hover:bg-stone-850"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {selectedPresetTopic === "✏️ Tự nhập chủ đề..." && (
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              placeholder="Nhập chủ đề tùy chỉnh (VD: Mẫu kỉ niệm chuyến đi Osaka, Món mì Udon, Tàu Shinkansen...)"
              className="flex-1 bg-stone-900 border border-stone-700 px-3.5 py-2 rounded-xl text-xs text-amber-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-850">
          <p className="text-[11px] text-stone-400 italic">
            Mỗi lần chọn "Tạo bài mới", AI sẽ sáng tác đoạn văn phong phú không lặp lại.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedPresetTopic("🎲 Ngẫu nhiên đa dạng (AI tự chọn chủ đề mới)");
                handleGeneratePassage("Ngẫu nhiên");
              }}
              disabled={isLoading}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-750 text-amber-300 text-xs font-bold rounded-xl border border-stone-700 transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>🎲 Đổi chủ đề ngẫu nhiên</span>
            </button>

            <button
              onClick={() => handleGeneratePassage()}
              disabled={isLoading}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Tạo bài đọc mới ngay</span>
            </button>
          </div>
        </div>
      </div>

      {!passage && !isLoading && (
        <div className="text-center py-10 space-y-3 bg-stone-950 rounded-xl border border-stone-800 p-6">
          <BookOpen className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-200">
            Tạo bài đọc ngắn vừa sức theo cấp độ {selectedLevel}
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            AI sẽ tự động lồng ghép các từ vựng bạn đã học vào bài văn ngắn tự nhiên để bạn thực hành đọc hiểu ngay lập tức.
          </p>
          <button
            onClick={() => handleGeneratePassage()}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bắt đầu tạo bài đọc AI ngay</span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12 space-y-3 bg-stone-950 rounded-xl border border-stone-800 p-6">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-amber-300">
            AI đang sáng tác bài đọc tiếng Nhật {selectedLevel} cho bạn...
          </p>
        </div>
      )}

      {passage && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-400" />
                  {passage.level} — Chủ đề: {passage.topic}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGeneratePassage("Ngẫu nhiên")}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold rounded-xl border border-stone-700 inline-flex items-center gap-1.5 transition-all"
                  title="Tạo bài đọc ở chủ đề mới hoàn toàn"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chủ đề khác</span>
                </button>

                <button
                  onClick={() => playJapaneseSpeech(passage.contentJapanese)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border border-stone-700"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe giọng đọc AI</span>
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-amber-200 font-serif-jp">
              {passage.titleJapanese}
            </h3>
            <p className="text-xs text-stone-400 italic">
              {passage.titleVietnamese}
            </p>
          </div>

          {/* Reading Body */}
          <div className="bg-stone-950 p-6 rounded-xl border border-stone-800 space-y-4">
            <div className="text-base md:text-lg text-stone-100 font-serif-jp leading-relaxed whitespace-pre-line tracking-wide">
              {passage.contentJapanese}
            </div>

            <div className="pt-4 border-t border-stone-800 space-y-1">
              <span className="text-xs font-bold text-amber-400">Bản dịch tiếng Việt:</span>
              <p className="text-xs text-stone-300 whitespace-pre-line leading-relaxed">
                {passage.contentVietnamese}
              </p>
            </div>
          </div>

          {/* Vocabulary Glossary Pills */}
          {passage.wordGlosses && passage.wordGlosses.length > 0 && (
            <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Tra từ nhanh xuất hiện trong bài ({passage.wordGlosses.length} từ):
              </h4>
              <div className="flex flex-wrap gap-2">
                {passage.wordGlosses.map((w: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedWordGloss(w);
                      playJapaneseSpeech(w.word);
                    }}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 rounded-xl text-xs font-bold text-stone-200 inline-flex items-center gap-1.5 transition-all"
                  >
                    <span className="text-amber-300 font-serif-jp">{w.word}</span>
                    <span className="text-[10px] text-stone-400">({w.reading})</span>
                  </button>
                ))}
              </div>

              {/* Active Selected Gloss Popup */}
              {selectedWordGloss && (
                <div className="p-4 bg-stone-900 border border-amber-500/50 rounded-xl space-y-1 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-amber-300 font-serif-jp">
                      {selectedWordGloss.word} ({selectedWordGloss.reading})
                    </span>
                    <button
                      onClick={() => playJapaneseSpeech(selectedWordGloss.word)}
                      className="p-1 text-amber-300 hover:bg-stone-800 rounded"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-stone-200">
                    Nghĩa: <span className="font-bold text-amber-200">{selectedWordGloss.meaning}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Comprehension Quiz Questions */}
          {passage.comprehensionQuestions && passage.comprehensionQuestions.length > 0 && (
            <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-850 pb-3">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-stone-200">
                  Câu hỏi kiểm tra đọc hiểu ({passage.comprehensionQuestions.length} câu)
                </h4>
              </div>

              <div className="space-y-5">
                {passage.comprehensionQuestions.map((q: any, qIdx: number) => {
                  const selectedOpt = userAnswers[qIdx];
                  const isAnswered = selectedOpt !== undefined;
                  const isCorrect = selectedOpt === q.correctAnswer;

                  return (
                    <div key={qIdx} className="p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-3">
                      <p className="text-xs md:text-sm font-bold text-amber-200 font-serif-jp">
                        Câu {qIdx + 1}: {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options?.map((opt: string, oIdx: number) => {
                          let btnStyle = "bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-500/50";

                          if (isAnswered) {
                            if (opt === q.correctAnswer) {
                              btnStyle = "bg-emerald-950/80 text-emerald-200 border-emerald-500/80 font-bold";
                            } else if (opt === selectedOpt) {
                              btnStyle = "bg-rose-950/80 text-rose-200 border-rose-500/80";
                            } else {
                              btnStyle = "bg-stone-950 text-stone-500 border-stone-850 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                setUserAnswers((prev) => ({ ...prev, [qIdx]: opt }));
                                if (opt === q.correctAnswer) {
                                  playCorrectChime();
                                }
                              }}
                              className={`p-2.5 rounded-xl text-xs text-left border transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {isAnswered && opt === q.correctAnswer && (
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              {isAnswered && opt === selectedOpt && opt !== q.correctAnswer && (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <div className={`p-3 rounded-lg text-xs space-y-1 ${isCorrect ? "bg-emerald-950/50 border border-emerald-800/60 text-emerald-300" : "bg-stone-950 border border-amber-800/60 text-stone-300"}`}>
                          <p className="font-bold flex items-center gap-1.5">
                            {isCorrect ? "✅ Chính xác!" : "💡 Đáp án đúng: " + q.correctAnswer}
                          </p>
                          {q.explanation && <p className="text-[11px] text-stone-300">{q.explanation}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
