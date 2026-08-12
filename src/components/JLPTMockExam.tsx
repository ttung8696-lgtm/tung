import React, { useState, useEffect } from "react";
import { JLPTLevel } from "../types";
import { Award, Clock, CheckCircle2, AlertTriangle, Calendar, Volume2, Sparkles, RotateCcw } from "lucide-react";
import { playJapaneseSpeech } from "../utils/audio";
import { playMokugyoSound, playCorrectChime, playIncorrectSound } from "../utils/soundEffects";

interface JLPTMockExamProps {
  onExamCompleted?: (score: number) => void;
}

const MOCK_QUESTIONS: Record<"N5" | "N4" | "N3" | "N2" | "N1", any[]> = {
  N5: [
    {
      section: "Từ vựng",
      question: "Chữ Hán nào tương ứng với từ 「わたし」?",
      options: ["私", "彼", "友", "人"],
      answer: "私",
      explanation: "私 (Tư - Tôi/Watashi)",
    },
    {
      section: "Từ vựng",
      question: "Chọn từ đúng nghĩa với 「たべます」:",
      options: ["Ăn", "Uống", "Đi", "Xem"],
      answer: "Ăn",
      explanation: "食べます (Ăn)",
    },
    {
      section: "Ngữ pháp",
      question: "Điền trợ từ thích hợp: わたし (  ) がくせいです。",
      options: ["は", "が", "に", "で"],
      answer: "は",
      explanation: "Trợ từ は đánh dấu chủ ngữ câu.",
    },
    {
      section: "Đọc hiểu",
      question: "Đọc đoạn văn: 「きのう　ともだちと　えいがを　みました。」Họ đã làm gì hôm qua?",
      options: ["Xem phim với bạn", "Ăn cơm với bạn", "Đọc sách ở thư viện", "Đi học"],
      answer: "Xem phim với bạn",
      explanation: "映画を見ました = Xem phim.",
    },
    {
      section: "Nghe hiểu",
      question: "Nghe audio và chọn đáp án: 「おはようございます。」có nghĩa là gì?",
      audioText: "おはようございます",
      options: ["Chào buổi sáng", "Chào buổi chiều", "Tạm biệt", "Cảm ơn"],
      answer: "Chào buổi sáng",
      explanation: "おはようございます = Chào buổi sáng lịch sự.",
    },
  ],
  N4: [
    {
      section: "Từ vựng",
      question: "Từ nào đồng nghĩa với 「しんぱいします」?",
      options: ["An tâm", "Lo lắng", "Vui vẻ", "Tức giận"],
      answer: "Lo lắng",
      explanation: "心配します = Lo lắng.",
    },
    {
      section: "Ngữ pháp",
      question: "Điền mẫu câu: 雨が降り (  ) です。",
      options: ["そう", "よう", "みたい", "らしい"],
      answer: "そう",
      explanation: "V-ます + そう = Có vẻ như sắp...",
    },
    {
      section: "Đọc hiểu",
      question: "Đọc câu: 「日本へ行く前に、ひらがなを覚えておきます。」Họ làm gì trước khi đi Nhật?",
      options: ["Ghi nhớ Hiragana trước", "Mua vé máy bay", "Tìm khách sạn", "Học Kanji"],
      answer: "Ghi nhớ Hiragana trước",
      explanation: "V-ておく = Làm sẵn điều gì trước.",
    },
    {
      section: "Nghe hiểu",
      question: "Nghe câu: 「すみません、ちょっと待ってください。」Nghĩa là:",
      audioText: "すみません、ちょっと待ってください。",
      options: ["Xin lỗi, vui lòng đợi một chút", "Xin lỗi, tôi phải đi ngay", "Cảm ơn đã giúp đỡ", "Hẹn gặp lại"],
      answer: "Xin lỗi, vui lòng đợi một chút",
      explanation: "ちょっと待ってください = Xin chờ một chút.",
    },
  ],
  N3: [
    {
      section: "Ngữ pháp",
      question: "Chọn mẫu câu phù hợp: どんなに努力した (  )、合格できなかった。",
      options: ["ところで", "としても", "ものの", "ことから"],
      answer: "ところで",
      explanation: "どんなに...ところで = Dù có nỗ lực đến đâu thì...",
    },
    {
      section: "Đọc hiểu",
      question: "Nghĩa của cụm 「～に違いない」là gì?",
      options: ["Chắc chắn là...", "Không thể nào là...", "Nên làm...", "Có lẽ là..."],
      answer: "Chắc chắn là...",
      explanation: "に違いない = Chắc chắn là, không sai vào đâu được.",
    },
  ],
  N2: [
    {
      section: "Ngữ pháp",
      question: "Chọn mẫu câu thích hợp: 彼の成功は、努力の賜物に (  )。",
      options: ["ほかならない", "かぎらない", "すやまない", "すぎない"],
      answer: "ほかならない",
      explanation: "～にほかならない = Chính là, không gì khác ngoài...",
    },
  ],
  N1: [
    {
      section: "Ngữ pháp",
      question: "Mẫu câu 「～をおいてほかにない」có nghĩa là:",
      options: ["Ngoài... ra thì không còn ai/cái gì khác", "Dù thế nào cũng không", "Giả sử nếu như", "Mặc dù là"],
      answer: "Ngoài... ra thì không còn ai/cái gì khác",
      explanation: "～をおいてほかにない = Ngoại trừ...",
    },
  ],
};

export const JLPTMockExam: React.FC<JLPTMockExamProps> = ({ onExamCompleted }) => {
  const [selectedLevel, setSelectedLevel] = useState<"N5" | "N4" | "N3" | "N2" | "N1">("N5");
  const [examStatus, setExamStatus] = useState<"idle" | "running" | "completed">("idle");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60); // 15 mins default
  const [examTargetDate, setExamTargetDate] = useState<string>(() => {
    return localStorage.getItem("nihongo_exam_date") || "2026-12-06";
  });

  const questions = MOCK_QUESTIONS[selectedLevel] || MOCK_QUESTIONS.N5;
  const currentQ = questions[currentQIndex];

  // Countdown timer interval
  useEffect(() => {
    if (examStatus !== "running") return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStatus]);

  const handleStartExam = () => {
    setExamStatus("running");
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTimeLeftSeconds(15 * 60);
    playMokugyoSound();
  };

  const handleSelectOption = (opt: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQIndex]: opt }));
    playMokugyoSound();
  };

  const handleFinishExam = () => {
    setExamStatus("completed");

    // Calculate score
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) correct += 1;
    });

    const scorePercent = Math.round((correct / questions.length) * 100);
    if (scorePercent >= 70) playCorrectChime();
    else playIncorrectSound();

    if (onExamCompleted) onExamCompleted(scorePercent);
  };

  // Days until target exam date calculation
  const getDaysUntilExam = () => {
    if (!examTargetDate) return 0;
    const diff = new Date(examTargetDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
      {/* Target Exam Date Countdown Widget */}
      <div className="bg-gradient-to-r from-red-950/60 via-stone-950 to-stone-900 border border-red-500/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <span className="text-xs text-stone-400 font-semibold">
              Kỳ thi JLPT Sắp Tới:
            </span>
            <div className="text-sm font-bold text-amber-300">
              {examTargetDate} — Còn lại <span className="text-red-400 font-extrabold text-base">{getDaysUntilExam()} ngày</span>
            </div>
          </div>
        </div>

        <input
          type="date"
          value={examTargetDate}
          onChange={(e) => {
            setExamTargetDate(e.target.value);
            localStorage.setItem("nihongo_exam_date", e.target.value);
          }}
          className="bg-stone-900 text-xs text-amber-300 border border-stone-700 px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Exam Setup Header */}
      {examStatus === "idle" && (
        <div className="text-center py-6 space-y-5">
          <Award className="w-12 h-12 text-amber-400 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-stone-100 font-serif-jp">
              Mô Phỏng Đề Thi JLPT Thật
            </h2>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Đề thi thử đầy đủ các phần Từ vựng, Ngữ pháp, Đọc hiểu & Nghe hiểu. Có đếm giờ và chấm điểm tự động.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {(["N5", "N4", "N3", "N2", "N1"] as JLPTLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? "bg-amber-500 text-stone-950 shadow-md scale-105"
                    : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                }`}
              >
                Cấp độ {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleStartExam}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
          >
            Bắt đầu thi thử ngay ({questions.length} câu - 15 phút)
          </button>
        </div>
      )}

      {/* Running Exam Mode */}
      {examStatus === "running" && currentQ && (
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
            <span className="font-bold text-amber-300">
              Phần: {currentQ.section} ({currentQIndex + 1}/{questions.length})
            </span>
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-red-400">
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>
          </div>

          <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-4">
            <h3 className="text-base font-bold text-stone-100">
              Câu {currentQIndex + 1}: {currentQ.question}
            </h3>

            {currentQ.audioText && (
              <button
                onClick={() => playJapaneseSpeech(currentQ.audioText)}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg text-xs font-semibold inline-flex items-center gap-2 border border-stone-700"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe câu đố tiếng Nhật</span>
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {currentQ.options.map((opt: string) => {
                const isSelected = selectedAnswers[currentQIndex] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md"
                        : "bg-stone-900 border-stone-800 hover:bg-stone-800 text-stone-200"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-xs font-semibold rounded-xl text-stone-200"
            >
              Câu trước
            </button>

            {currentQIndex + 1 < questions.length ? (
              <button
                onClick={() => setCurrentQIndex((prev) => prev + 1)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-md"
              >
                Câu tiếp theo
              </button>
            ) : (
              <button
                onClick={handleFinishExam}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Nộp bài & Chấm điểm
              </button>
            )}
          </div>
        </div>
      )}

      {/* Completed Exam Result Mode */}
      {examStatus === "completed" && (
        <div className="bg-stone-950 p-6 rounded-xl border border-stone-800 text-center space-y-5 animate-fadeIn">
          <Award className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-xl font-bold text-stone-100 font-serif-jp">
            Kết Quả Bài Thi Thử {selectedLevel}
          </h3>

          <div className="text-3xl font-extrabold text-amber-300">
            {Object.keys(selectedAnswers).filter((k) => selectedAnswers[Number(k)] === questions[Number(k)].answer).length} / {questions.length} câu đúng
          </div>

          <div className="space-y-2 text-xs text-stone-300 max-w-md mx-auto text-left">
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.answer;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    isCorrect
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-200"
                      : "bg-red-950/40 border-red-800 text-red-200"
                  }`}
                >
                  <p className="font-bold">
                    Câu {idx + 1} ({q.section}): {isCorrect ? "Đúng ✓" : "Sai ✗"}
                  </p>
                  <p className="text-[11px] opacity-80">Đáp án chuẩn: {q.answer} — {q.explanation}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setExamStatus("idle")}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs rounded-xl border border-stone-700 inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thi thử lại</span>
          </button>
        </div>
      )}
    </div>
  );
};
