import React, { useState, useEffect } from "react";
import { 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Volume2, 
  Trophy 
} from "lucide-react";
import { VocabItem, QuizQuestion } from "../types";
import { playJapaneseSpeech } from "../utils/audio";
import { UserAccount, recordActivityLog } from "../lib/userAccount";

interface QuizModeProps {
  vocabularyList: VocabItem[];
  currentAccount?: UserAccount | null;
}

export const QuizMode: React.FC<QuizModeProps> = ({ vocabularyList, currentAccount }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Generate quiz questions randomly from vocabulary
  const generateQuiz = () => {
    if (vocabularyList.length < 4) return;

    const shuffled = [...vocabularyList].sort(() => Math.random() - 0.5);
    const selectedVocabs = shuffled.slice(0, Math.min(10, shuffled.length));

    const generatedQuestions: QuizQuestion[] = selectedVocabs.map((vocab, i) => {
      // Pick 3 random wrong answers
      const wrongCandidates = vocabularyList
        .filter((v) => v.id !== vocab.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const isMeaningPrompt = i % 2 === 0;
      const promptType = isMeaningPrompt ? "kanji-to-meaning" : "hiragana-to-kanji";

      let correctAnswer = "";
      let wrongAnswers: string[] = [];

      if (promptType === "kanji-to-meaning") {
        correctAnswer = vocab.vietnamese;
        wrongAnswers = wrongCandidates.map((v) => v.vietnamese);
      } else {
        correctAnswer = vocab.kanji;
        wrongAnswers = wrongCandidates.map((v) => v.kanji);
      }

      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        id: `q-${i}`,
        vocab,
        promptType,
        options,
        correctAnswer,
      };
    });

    setQuestions(generatedQuestions);
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  useEffect(() => {
    generateQuiz();
  }, [vocabularyList]);

  if (vocabularyList.length < 4) {
    return (
      <div className="text-center py-16 bg-stone-900/60 border border-stone-800 rounded-3xl p-8 max-w-lg mx-auto text-stone-300">
        <Award className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Cần ít nhất 4 từ vựng để tạo bài trắc nghiệm!</h3>
        <p className="text-sm text-stone-400">
          Hãy bỏ lọc hoặc dùng AI Lọc Từ Mới để thêm từ vựng trước khi kiểm tra.
        </p>
      </div>
    );
  }

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-lg mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center text-stone-100 shadow-2xl space-y-6">
        <div className="w-20 h-20 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Hoàn thành bài kiểm tra!</h2>
          <p className="text-sm text-stone-400">Kết quả thử thách từ vựng tiếng Nhật của bạn:</p>
        </div>

        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-2">
          <div className="text-5xl font-extrabold text-amber-400 font-mono">
            {score} / {questions.length}
          </div>
          <p className="text-xs text-stone-400">
            Tỷ lệ chính xác: <strong className="text-emerald-400 font-bold">{percentage}%</strong>
          </p>
        </div>

        <button
          onClick={generateQuiz}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Làm bài kiểm tra mới</span>
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  if (!currentQ) return null;

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      setQuizFinished(true);
      if (currentAccount) {
        const accuracy = Math.round((score / questions.length) * 100);
        recordActivityLog(currentAccount.id, currentAccount.username, {
          action: "quiz",
          title: `Hoàn thành bài kiểm tra Trắc Nghiệm (${score}/${questions.length})`,
          details: `Tỷ lệ chính xác: ${accuracy}% - ${accuracy >= 80 ? "Xuất sắc! 🎉" : "Cần cố gắng thêm 💪"}`,
          category: "Kiểm tra",
        });
      }
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between bg-stone-900/80 p-4 rounded-2xl border border-stone-800 text-stone-200">
        <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
          Câu {currentIdx + 1} / {questions.length}
        </span>

        <span className="text-xs text-stone-400">
          Điểm hiện tại: <strong className="text-amber-400">{score}</strong>
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl text-stone-100 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-400/90 uppercase tracking-wider">
            {currentQ.promptType === "kanji-to-meaning"
              ? "Chọn nghĩa Tiếng Việt đúng:"
              : "Chọn chữ Kanji / Hiragana tương ứng:"}
          </span>

          <div className="flex items-center justify-center gap-2">
            <h2 className="text-4xl sm:text-5xl font-bold font-serif text-white tracking-wide">
              {currentQ.promptType === "kanji-to-meaning"
                ? currentQ.vocab.kanji
                : currentQ.vocab.hiragana}
            </h2>

            <button
              onClick={() => playJapaneseSpeech(currentQ.vocab.kanji || currentQ.vocab.hiragana)}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-amber-500 text-stone-300 hover:text-stone-950 transition-all"
              title="Nghe phát âm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-400 font-mono">
            Phiên âm: {currentQ.vocab.hiragana} ({currentQ.vocab.romaji})
          </p>
        </div>

        {/* Option Grid */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isCorrect = opt === currentQ.correctAnswer;
            const isSelected = opt === selectedOption;

            let btnStyle = "bg-stone-950/70 border-stone-800 text-stone-200 hover:border-amber-500/50";
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold";
              } else if (isSelected) {
                btnStyle = "bg-red-950/80 border-red-500 text-red-200";
              } else {
                btnStyle = "bg-stone-950/40 border-stone-900 text-stone-500 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
              </button>
            );
          })}
        </div>

        {/* Bottom Next Button */}
        {isAnswered && (
          <div className="pt-4 border-t border-stone-800 animate-fade-in flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg transition-all"
            >
              {currentIdx + 1 >= questions.length ? "Xem kết quả" : "Câu tiếp theo"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
