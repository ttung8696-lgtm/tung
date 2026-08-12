import React, { useState } from "react";
import { Puzzle, Volume2, CheckCircle2, RotateCcw, Sparkles, Layers, Play } from "lucide-react";
import { speakJapanese } from "../../utils/speech";

interface SentenceSlot {
  subjects: string[];
  time: string[];
  objects: string[];
  verbs: string[];
  grammarEndings: { label: string; formula: string; meaning: string }[];
}

const SLOT_DATA: SentenceSlot = {
  subjects: ["私 (Tôi)", "友達 (Bạn bè)", "先生 (Thầy cô)", "彼 (Anh ấy)"],
  time: ["毎日 (Mỗi ngày)", "今朝 (Sáng nay)", "仕事が終わったあと (Sau khi làm xong)", "寝る前 (Trước khi đi ngủ)"],
  objects: ["日本語 (Tiếng Nhật)", "漢字 (Chữ Hán)", "ご飯 (Cơm)", "薬 (Thuốc)"],
  verbs: ["勉強する (Học)", "食べる (Ăn)", "飲む (Uống)", "覚える (Ghi nhớ)"],
  grammarEndings: [
    { label: "〜なければなりません", formula: "phải làm...", meaning: "Nghĩa vụ bắt buộc" },
    { label: "〜ことができます", formula: "có thể làm...", meaning: "Năng lực khả năng" },
    { label: "〜てもいいです", formula: "được phép làm...", meaning: "Cho phép" },
    { label: "〜ために、頑張ります", formula: "cố gắng để...", meaning: "Mục đích" },
    { label: "〜わけがない", formula: "tuyệt đối không...", meaning: "Phủ định tuyệt đối" },
  ]
};

export const GrammarSentenceBuilder: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("私 (Tôi)");
  const [selectedTime, setSelectedTime] = useState<string>("毎日 (Mỗi ngày)");
  const [selectedObject, setSelectedObject] = useState<string>("日本語 (Tiếng Nhật)");
  const [selectedVerb, setSelectedVerb] = useState<string>("勉強する (Học)");
  const [selectedEnding, setSelectedEnding] = useState(SLOT_DATA.grammarEndings[0]);

  // Clean pure Japanese sentence string
  const cleanJapanese = `${selectedSubject.split(" ")[0]}は、${selectedTime.split(" ")[0]}、${selectedObject.split(" ")[0]}を${selectedVerb.split(" ")[0].replace("する", "")}${selectedEnding.label}`;

  // Vietnamese translation summary
  const vietnameseMeaning = `${selectedSubject.split("(")[1]?.replace(")", "") || ""} ${selectedEnding.formula} ${selectedVerb.split("(")[1]?.replace(")", "") || ""} ${selectedObject.split("(")[1]?.replace(")", "") || ""} (${selectedTime.split("(")[1]?.replace(")", "") || ""}).`;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Puzzle className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-black text-amber-200">
            Xưởng Lắp Ghép Câu Ngữ Pháp Tương Tác (Sentence Builder)
          </h3>
          <p className="text-xs text-stone-400">
            Lựa chọn linh hoạt từng thành phần câu để tạo câu tiếng Nhật tự nhiên chuẩn ngữ pháp!
          </p>
        </div>
      </div>

      {/* Generated Result Preview Box */}
      <div className="p-5 rounded-2xl bg-stone-950 border border-amber-500/40 space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Câu tiếng Nhật hoàn chỉnh</span>
          </span>

          <button
            onClick={() => speakJapanese(cleanJapanese)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs flex items-center gap-1.5 shadow transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Đọc phát âm chuẩn</span>
          </button>
        </div>

        <p className="text-xl md:text-2xl font-black text-amber-100 tracking-wide font-sans">
          {cleanJapanese}
        </p>

        <p className="text-sm font-semibold text-stone-300 pt-2 border-t border-stone-900">
          ➔ Dịch nghĩa tiếng Việt: <span className="text-amber-300">{vietnameseMeaning}</span>
        </p>
      </div>

      {/* Interactive Slot Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Slot 1: Chủ ngữ */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
          <label className="font-extrabold text-amber-400 block">1. Chủ ngữ (Subject + は)</label>
          <div className="space-y-1.5">
            {SLOT_DATA.subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`w-full text-left p-2.5 rounded-xl border font-semibold transition-all ${
                  selectedSubject === sub
                    ? "bg-amber-500/20 text-amber-300 border-amber-500 font-bold"
                    : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Slot 2: Thời gian / Bối cảnh */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
          <label className="font-extrabold text-amber-400 block">2. Trạng ngữ thời gian (Time)</label>
          <div className="space-y-1.5">
            {SLOT_DATA.time.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`w-full text-left p-2.5 rounded-xl border font-semibold transition-all ${
                  selectedTime === t
                    ? "bg-amber-500/20 text-amber-300 border-amber-500 font-bold"
                    : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Slot 3: Tân ngữ */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
          <label className="font-extrabold text-amber-400 block">3. Tân ngữ (Object + を)</label>
          <div className="space-y-1.5">
            {SLOT_DATA.objects.map((obj) => (
              <button
                key={obj}
                onClick={() => setSelectedObject(obj)}
                className={`w-full text-left p-2.5 rounded-xl border font-semibold transition-all ${
                  selectedObject === obj
                    ? "bg-amber-500/20 text-amber-300 border-amber-500 font-bold"
                    : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200"
                }`}
              >
                {obj}
              </button>
            ))}
          </div>
        </div>

        {/* Slot 4: Động từ */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
          <label className="font-extrabold text-amber-400 block">4. Động từ chính (Verb)</label>
          <div className="space-y-1.5">
            {SLOT_DATA.verbs.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVerb(v)}
                className={`w-full text-left p-2.5 rounded-xl border font-semibold transition-all ${
                  selectedVerb === v
                    ? "bg-amber-500/20 text-amber-300 border-amber-500 font-bold"
                    : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Slot 5: Mẫu ngữ pháp kết thúc */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 space-y-2 md:col-span-2">
          <label className="font-extrabold text-amber-300 block">
            5. Đuôi Mẫu Ngữ Pháp (Grammar Pattern)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SLOT_DATA.grammarEndings.map((ge, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEnding(ge)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedEnding.label === ge.label
                    ? "bg-amber-500/20 text-amber-200 border-amber-500 font-bold shadow"
                    : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200"
                }`}
              >
                <div className="font-extrabold text-sm">{ge.label}</div>
                <div className="text-[11px] text-amber-400/80">{ge.formula}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
