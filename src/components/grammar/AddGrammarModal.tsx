import React, { useState } from "react";
import { X, Sparkles, Send, CheckCircle2, ShieldCheck, BookOpen } from "lucide-react";
import { GrammarItem, GrammarLevel } from "../../types";
import { UserAccount } from "../../lib/userAccount";
import { submitItemForApproval } from "../../lib/submissionService";

interface AddGrammarModalProps {
  onClose: () => void;
  onAdd: (item: GrammarItem) => void;
  currentAccount?: UserAccount | null;
}

export const AddGrammarModal: React.FC<AddGrammarModalProps> = ({
  onClose,
  onAdd,
  currentAccount,
}) => {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<GrammarLevel>("N3");
  const [summary, setSummary] = useState("");
  const [formula, setFormula] = useState("");
  const [explanation, setExplanation] = useState("");
  const [category, setCategory] = useState("Nguyên nhân - Lý do");
  
  // Example sentences
  const [jpEx, setJpEx] = useState("");
  const [hiraEx, setHiraEx] = useState("");
  const [vnEx, setVnEx] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !formula.trim()) return;

    setIsSubmitting(true);

    const newGrammarItem: GrammarItem = {
      id: `g_custom_${Date.now()}`,
      title: title.trim(),
      level,
      summary: summary.trim(),
      formula: formula.trim(),
      explanation: explanation.trim() || "Cấu trúc ngữ pháp do người dùng đóng góp.",
      category: category.trim() || "Khác",
      examples: jpEx.trim() ? [
        {
          japanese: jpEx.trim(),
          hiragana: hiraEx.trim() || jpEx.trim(),
          romaji: "",
          vietnamese: vnEx.trim() || "Ví dụ minh họa ngữ pháp",
        }
      ] : [
        {
          japanese: `${title.split("(")[0]}を使った例文です。`,
          hiragana: `${title.split("(")[0]}をつかったれいぶんです。`,
          romaji: "",
          vietnamese: `Ví dụ sử dụng cấu trúc ${summary}`,
        }
      ],
      mindMapGroup: category.trim(),
    };

    // Add locally for active user
    onAdd(newGrammarItem);

    // Submit request to Cloud Firestore for Admin Approval
    if (currentAccount) {
      try {
        await submitItemForApproval(newGrammarItem, "grammar", {
          id: currentAccount.id,
          username: currentAccount.username,
        });
      } catch (err) {
        console.error("Lỗi gửi yêu cầu duyệt ngữ pháp:", err);
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
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">Nạp Thêm Mẫu Ngữ Pháp JLPT</h3>
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
                Mẫu ngữ pháp JLPT <strong>"{title}"</strong> ({level}) đã được nạp lên hệ thống.
                <br /><br />
                👑 <strong>Quy trình kiểm duyệt:</strong> Yêu cầu của bạn đã được chuyển tới Chủ ứng dụng (<strong>Trần Ngọc Tùng</strong>). Sau khi Admin xác nhận <strong>OK</strong>, mẫu ngữ pháp này sẽ chính thức đăng tải công khai trên app cho tất cả mọi người!
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
                  Mẫu ngữ pháp bạn đóng góp sẽ được gửi yêu cầu phê duyệt đến Chủ ứng dụng (Trần Ngọc Tùng). Khi được xác nhận <strong>OK</strong>, bài sẽ xuất hiện trên ứng dụng.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-400 mb-1">
                Tên Mẫu Ngữ Pháp JLPT *:
              </label>
              <input
                type="text"
                required
                placeholder="VD: 〜おかげで (Okage de) hoặc 〜にほかならない"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Cấp độ JLPT:
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as GrammarLevel)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100"
                >
                  <option value="N5">JLPT N5</option>
                  <option value="N4">JLPT N4</option>
                  <option value="N3">JLPT N3</option>
                  <option value="N2">JLPT N2</option>
                  <option value="N1">JLPT N1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Phân loại ý nghĩa:
                </label>
                <input
                  type="text"
                  placeholder="VD: Nguyên nhân - Lý do, Điều kiện..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-400 mb-1">
                Cấu trúc ngữ pháp (Công thức) *:
              </label>
              <input
                type="text"
                required
                placeholder="VD: V-plain + おかげで / N + のおかげで"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-amber-300 font-mono placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-400 mb-1">
                Ý nghĩa ngắn (Tóm tắt Tiếng Việt) *:
              </label>
              <input
                type="text"
                required
                placeholder="VD: Nhờ có..., Nhờ vào... (kết quả tốt)"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-400 mb-1">
                Giải thích cách dùng chi tiết:
              </label>
              <textarea
                rows={3}
                placeholder="VD: Dùng khi biểu thị nguyên nhân dẫn đến kết quả tích cực, thể hiện sự biết ơn hoặc may mắn..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
              <label className="block text-xs font-bold text-amber-400">
                Câu ví dụ minh họa:
              </label>
              <input
                type="text"
                placeholder="Câu Tiếng Nhật (VD: 先生のおかげで合格しました。)"
                value={jpEx}
                onChange={(e) => setJpEx(e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-600"
              />
              <input
                type="text"
                placeholder="Cách đọc Hiragana (VD: せんせいのおかげでごうかくしました。)"
                value={hiraEx}
                onChange={(e) => setHiraEx(e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-600"
              />
              <input
                type="text"
                placeholder="Dịch nghĩa tiếng Việt (VD: Nhờ có thầy mà tôi đã đỗ.)"
                value={vnEx}
                onChange={(e) => setVnEx(e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-100 placeholder-stone-600"
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
