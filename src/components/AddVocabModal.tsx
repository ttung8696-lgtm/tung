import React, { useState } from "react";
import { X, Sparkles, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { VocabItem, JLPTLevel } from "../types";
import { UserAccount } from "../lib/userAccount";
import { submitItemForApproval } from "../lib/submissionService";

interface AddVocabModalProps {
  onClose: () => void;
  onAdd: (item: VocabItem) => void;
  currentAccount?: UserAccount | null;
}

export const AddVocabModal: React.FC<AddVocabModalProps> = ({ onClose, onAdd, currentAccount }) => {
  const [kanji, setKanji] = useState("");
  const [hiragana, setHiragana] = useState("");
  const [romaji, setRomaji] = useState("");
  const [vietnamese, setVietnamese] = useState("");
  const [hanViet, setHanViet] = useState("");
  const [jlpt, setJlpt] = useState<JLPTLevel>("N5");
  const [category, setCategory] = useState("Giao tiếp");
  const [exampleJp, setExampleJp] = useState("");
  const [exampleVn, setExampleVn] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hiragana.trim() || !vietnamese.trim()) return;

    setIsSubmitting(true);

    const newItem: VocabItem = {
      id: `custom-${Date.now()}`,
      kanji: kanji.trim() || hiragana.trim(),
      hiragana: hiragana.trim(),
      romaji: romaji.trim() || hiragana.trim(),
      vietnamese: vietnamese.trim(),
      hanViet: hanViet.trim(),
      type: "noun",
      jlpt: jlpt === "All" ? "N5" : jlpt,
      category: category.trim() || "Giao tiếp",
      example: {
        japanese: exampleJp.trim() || `${kanji || hiragana}を使います。`,
        hiragana: hiragana.trim(),
        vietnamese: exampleVn.trim() || `Dùng từ ${vietnamese}`,
      },
      note: note.trim() || "Từ vựng do người dùng nạp vào.",
      learned: false,
      bookmarked: true,
      custom: true,
    };

    // Add locally for active user
    onAdd(newItem);

    // Submit request to Cloud Firestore for Admin Approval
    if (currentAccount) {
      try {
        await submitItemForApproval(newItem, "vocab", {
          id: currentAccount.id,
          username: currentAccount.username,
        });
      } catch (err) {
        console.error("Lỗi gửi yêu cầu duyệt:", err);
      }
    }

    setIsSubmitting(false);
    setSubmittedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">Nạp Thêm Từ Vựng JLPT Mới</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
              <h4 className="text-lg font-bold text-white">Đã Gửi Yêu Cầu Phê Duyệt!</h4>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-4 rounded-2xl border border-stone-800 text-left">
                Từ vựng JLPT <strong>"{kanji || hiragana}"</strong> đã được gửi lên hệ thống.
                <br /><br />
                👑 <strong>Quy trình kiểm duyệt:</strong> Yêu cầu của bạn đã được chuyển tới Chủ ứng dụng (<strong>Trần Ngọc Tùng</strong>). Sau khi Admin xác nhận <strong>OK</strong>, từ vựng này sẽ chính thức xuất hiện trên app cho tất cả học viên!
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Owner Approval Banner Info */}
            <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-2xl text-[11px] text-amber-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Yêu cầu xác nhận trước khi công khai:</p>
                <p className="text-stone-300">
                  Từ vựng bạn nạp sẽ được gửi yêu cầu phê duyệt trực tiếp đến Chủ ứng dụng (Trần Ngọc Tùng). Khi được xác nhận <strong>OK</strong>, bài học sẽ đăng tải công khai lên app.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Chữ Kanji (nếu có):
                </label>
                <input
                  type="text"
                  placeholder="VD: 友達"
                  value={kanji}
                  onChange={(e) => setKanji(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Cách đọc Hiragana *:
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: ともだち"
                  value={hiragana}
                  onChange={(e) => setHiragana(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Phiên âm Romaji:
                </label>
                <input
                  type="text"
                  placeholder="VD: tomodachi"
                  value={romaji}
                  onChange={(e) => setRomaji(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Âm Hán Việt:
                </label>
                <input
                  type="text"
                  placeholder="VD: HỮU ĐẠT"
                  value={hanViet}
                  onChange={(e) => setHanViet(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-400 mb-1">
                Nghĩa Tiếng Việt *:
              </label>
              <input
                type="text"
                required
                placeholder="VD: Bạn bè, người bạn"
                value={vietnamese}
                onChange={(e) => setVietnamese(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Trình độ JLPT:
                </label>
                <select
                  value={jlpt}
                  onChange={(e) => setJlpt(e.target.value as JLPTLevel)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100"
                >
                  <option value="N5">N5</option>
                  <option value="N4">N4</option>
                  <option value="N3">N3</option>
                  <option value="N2">N2</option>
                  <option value="N1">N1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Chủ đề:
                </label>
                <input
                  type="text"
                  placeholder="VD: Giao tiếp, Ẩm thực..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-400 mb-1">
                Câu ví dụ tiếng Nhật:
              </label>
              <input
                type="text"
                placeholder="VD: 友達と一緒に旅行に行きます。"
                value={exampleJp}
                onChange={(e) => setExampleJp(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600 mb-2"
              />
              <input
                type="text"
                placeholder="Nghĩa tiếng Việt của câu ví dụ"
                value={exampleVn}
                onChange={(e) => setExampleVn(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-400 mb-1">
                Ghi chú ngữ cảnh:
              </label>
              <input
                type="text"
                placeholder="VD: Dùng cho bạn bè thân thiết"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100"
              />
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-xl text-xs text-stone-300 font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Yêu Cầu Phê Duyệt</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
