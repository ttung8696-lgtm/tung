import React, { useState } from "react";
import { GrammarItem } from "../../types";
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Volume2,
  Check,
  Zap,
  BookOpen,
  Layers
} from "lucide-react";
import { speakJapanese } from "../../utils/speech";

interface GrammarPracticeProps {
  grammarList: GrammarItem[];
  onEarnXP: (xp: number) => void;
}

type PracticeMode = "multiple-choice" | "sentence-ordering" | "fill-blank";

interface PracticeQuestion {
  grammarId: string;
  type: PracticeMode;
  questionText: string;
  hint: string;
  options: string[];
  correctAnswer: string;
  wordsToOrder?: string[];
  explanation: string;
}

export const GrammarPractice: React.FC<GrammarPracticeProps> = ({ grammarList, onEarnXP }) => {
  const [activeMode, setActiveMode] = useState<PracticeMode>("multiple-choice");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Generate question list based on current grammar items
  const generateQuestions = (): PracticeQuestion[] => {
    return grammarList.map((item) => {
      const ex = item.examples[0] || {
        japanese: "手を洗ってから、ご飯を食べます。",
        hiragana: "てをあらってから、ごはんをたべます。",
        vietnamese: "Sau khi rửa tay xong thì tôi ăn cơm."
      };

      if (activeMode === "multiple-choice") {
        return {
          grammarId: item.id,
          type: "multiple-choice",
          questionText: `Chọn mẫu ngữ pháp phù hợp nhất điền vào khoảng trống: "${ex.vietnamese}"`,
          hint: `Mẫu ngữ pháp: ${item.summary} (Trình độ ${item.level})`,
          options: [
            item.formula,
            "〜ないで (Nai de)",
            "〜たあとで (Ta ato de)",
            "〜ために (Tame ni)"
          ].sort(() => Math.random() - 0.5),
          correctAnswer: item.formula,
          explanation: `Đáp án đúng là ${item.formula} (${item.title}): ${item.explanation}`
        };
      } else if (activeMode === "sentence-ordering") {
        const words = ex.japanese.split(/(?=.)/).filter(Boolean); // fallback
        const chunked = ex.japanese.includes("、")
          ? ex.japanese.split("、")
          : [ex.japanese.slice(0, 4), ex.japanese.slice(4, 8), ex.japanese.slice(8)];
        
        return {
          grammarId: item.id,
          type: "sentence-ordering",
          questionText: `Sắp xếp các mảnh từ sau thành câu tiếng Nhật hoàn chỉnh nghĩa: "${ex.vietnamese}"`,
          hint: `Mẫu ngữ pháp áp dụng: ${item.title}`,
          options: [],
          wordsToOrder: chunked.sort(() => Math.random() - 0.5),
          correctAnswer: chunked.join(""),
          explanation: `Câu hoàn chỉnh: ${ex.japanese} (${ex.vietnamese})`
        };
      } else {
        // Fill blank
        return {
          grammarId: item.id,
          type: "fill-blank",
          questionText: `Hoàn thành cấu trúc: ${item.title} -> ${item.summary}`,
          hint: item.explanation,
          options: [
            item.formula,
            "V-ない + から",
            "V-辞書形 + ほど",
            "N + だけで"
          ].sort(() => Math.random() - 0.5),
          correctAnswer: item.formula,
          explanation: item.explanation
        };
      }
    });
  };

  const questions = generateQuestions();
  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (opt: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(opt);
  };

  const handleWordClick = (word: string) => {
    if (isSubmitted) return;
    if (orderedWords.includes(word)) {
      setOrderedWords(orderedWords.filter((w) => w !== word));
    } else {
      setOrderedWords([...orderedWords, word]);
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    let isCorrect = false;
    if (activeMode === "sentence-ordering") {
      const userSentence = orderedWords.join("");
      isCorrect = userSentence === currentQ.correctAnswer || userSentence.length > 0;
    } else {
      isCorrect = selectedAnswer === currentQ.correctAnswer;
    }

    setIsSubmitted(true);
    if (isCorrect) {
      setScore((s) => s + 1);
      onEarnXP(20); // Award 20 XP
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setOrderedWords([]);
    setIsSubmitted(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      // Completed all
      alert(`🎉 Chúc mừng bạn đã hoàn thành bài luyện tập! Điểm số: ${score + (selectedAnswer === currentQ.correctAnswer ? 1 : 0)}/${questions.length}`);
      setCurrentIdx(0);
      setScore(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900 p-3 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveMode("multiple-choice");
              setCurrentIdx(0);
              setIsSubmitted(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeMode === "multiple-choice"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-400 hover:text-stone-200 bg-stone-950"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Trắc nghiệm Cấu trúc</span>
          </button>

          <button
            onClick={() => {
              setActiveMode("sentence-ordering");
              setCurrentIdx(0);
              setIsSubmitted(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeMode === "sentence-ordering"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-400 hover:text-stone-200 bg-stone-950"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Sắp xếp ghép câu</span>
          </button>

          <button
            onClick={() => {
              setActiveMode("fill-blank");
              setCurrentIdx(0);
              setIsSubmitted(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeMode === "fill-blank"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-400 hover:text-stone-200 bg-stone-950"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Điền công thức đúng</span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="font-mono text-stone-400">
            Câu <strong className="text-amber-400">{currentIdx + 1}</strong> / {questions.length}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-extrabold border border-emerald-800 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>{score * 20} XP</span>
          </span>
        </div>
      </div>

      {/* Main Question Box */}
      {currentQ && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          {/* Question Prompt */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentQ.hint}</span>
            </div>
            <h3 className="text-lg md:text-2xl font-black text-amber-100 tracking-tight leading-relaxed">
              {currentQ.questionText}
            </h3>
          </div>

          {/* Interactive Answer Area */}
          {activeMode === "sentence-ordering" ? (
            <div className="space-y-4">
              {/* Output Sentence Slots */}
              <div className="min-h-[60px] p-4 rounded-2xl bg-stone-950 border border-amber-500/30 flex flex-wrap items-center gap-2">
                {orderedWords.length > 0 ? (
                  orderedWords.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleWordClick(word)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-extrabold text-sm shadow animate-scaleIn"
                    >
                      {word}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-stone-600 font-mono">
                    Bấm các từ phía dưới để xếp vào đây...
                  </span>
                )}
              </div>

              {/* Pool of Words */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {currentQ.wordsToOrder?.map((word, idx) => {
                  const isSelected = orderedWords.includes(word);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleWordClick(word)}
                      disabled={isSelected || isSubmitted}
                      className={`px-4 py-2.5 rounded-2xl font-bold text-sm border transition-all ${
                        isSelected
                          ? "bg-stone-950 text-stone-700 border-stone-900 opacity-40 cursor-not-allowed"
                          : "bg-stone-800 hover:bg-stone-700 text-stone-100 border-stone-700 hover:border-amber-400"
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Multiple Choice Options */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let btnStyle = "bg-stone-950 hover:bg-stone-800/80 text-stone-200 border-stone-800";
                if (isSelected) {
                  btnStyle = "bg-amber-500/20 text-amber-200 border-amber-500 font-bold shadow-md";
                }
                if (isSubmitted) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-950 text-emerald-200 border-emerald-600 font-bold";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-rose-950 text-rose-200 border-rose-600 font-bold";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isSubmitted}
                    className={`p-4 rounded-2xl border text-left font-semibold text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Feedback & Explanation Box */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <HelpCircle className="w-4 h-4" />
                <span>Giải thích đáp án:</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-medium">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-800">
            <button
              onClick={() => {
                setSelectedAnswer(null);
                setOrderedWords([]);
                setIsSubmitted(false);
              }}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại câu này</span>
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={activeMode === "sentence-ordering" ? orderedWords.length === 0 : !selectedAnswer}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <span>Kiểm tra đáp án</span>
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
