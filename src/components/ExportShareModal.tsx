import React, { useState } from "react";
import { X, Share2, Download, Upload, Copy, Check, ShieldCheck, ExternalLink, Info, FileText, Lock, Trash2, ShieldAlert, Smartphone } from "lucide-react";
import { VocabItem } from "../types";
import { SecurityPasswordModal } from "./SecurityPasswordModal";

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabulary: VocabItem[];
  onImportVocabulary: (imported: VocabItem[]) => void;
  onResetAllData?: () => void;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  isOpen,
  onClose,
  vocabulary,
  onImportVocabulary,
  onResetAllData,
}) => {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  if (!isOpen) return null;

  // App Share URL
  const appUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vocabulary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nihongo_master_vocab_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].kanji) {
          onImportVocabulary(parsed);
          setImportStatus(`Đã nhập thành công ${parsed.length} từ vựng!`);
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus("Định dạng file JSON không hợp lệ.");
        }
      } catch (err) {
        setImportStatus("Lỗi đọc file JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 text-stone-100 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100">Chia sẻ & Lưu trữ ứng dụng</h2>
              <p className="text-xs text-stone-400">Gửi link cho bạn bè học cùng & không bị sửa mã nguồn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 my-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Section 1: How to share without allowing edits */}
          <div className="bg-stone-800/60 border border-stone-700/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Cách chia sẻ chỉ cho phép xem & học (Không bị chỉnh sửa):</span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Bạn có thể yên tâm gửi đường link ứng dụng bên dưới cho bạn bè. Khi bạn bè mở đường link này:
            </p>

            <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-5">
              <li>Họ sử dụng ứng dụng web bình thường để học từ, flashcard, làm bài kiểm tra.</li>
              <li><strong className="text-emerald-400">Hoàn toàn không thể chỉnh sửa mã nguồn (code)</strong> hoặc xóa các thiết lập dự án của bạn.</li>
              <li>Dữ liệu tiến độ học (từ đã thuộc, đánh dấu) của họ chỉ lưu trên máy cá nhân họ, <strong>không ảnh hưởng đến dữ liệu của bạn</strong>.</li>
            </ul>

            {/* Share Link Copy Box */}
            <div className="pt-2">
              <label className="text-[11px] font-medium text-stone-400 uppercase tracking-wider block mb-1">
                Link ứng dụng để gửi cho bạn bè:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-300 truncate font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-600 hover:bg-amber-500 text-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Mẹo:</strong> Nếu bạn đang chạy ứng dụng trong Google AI Studio, bạn cũng có thể nhấn trực tiếp vào nút <strong>Share</strong> ở góc trên bên phải màn hình để lấy liên kết chính thức.
              </span>
            </div>
          </div>

          {/* Section 2: Backup and Data Export/Import */}
          <div className="bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-stone-200 font-semibold text-sm">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Lưu trữ & Xuất/Nhập dữ liệu từ vựng (File .JSON):</span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Tải file danh sách từ vựng hiện tại (bao gồm các từ bạn tự thêm) để sao lưu hoặc chia sẻ file cho người khác nhập vào máy họ:
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-medium text-amber-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Xuất File từ vựng ({vocabulary.length} từ)</span>
              </button>

              <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-medium text-stone-200 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Nhập File từ vựng</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-800/50 p-2 rounded-lg mt-2">
                {importStatus}
              </p>
            )}
          </div>

          {/* Section 3: Capacitor Native Packaging Guide */}
          <div className="bg-stone-800/40 border border-stone-700/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-stone-200 font-semibold text-sm">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Đóng gói App Mobile Android (.apk) & iOS (.ipa) bằng Capacitor:</span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Codebase đã cấu hình sẵn <strong>Capacitor</strong> (<code className="text-amber-300 font-mono text-[11px]">capacitor.config.ts</code>). Bạn có thể dễ dàng build ra app Android & iOS native chỉ với 3 lệnh đơn giản:
            </p>

            <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 font-mono text-[11px] text-amber-300/90 space-y-1.5">
              <p><span className="text-stone-500"># 1. Build trang web thành thư mục dist/ :</span><br /><span className="text-emerald-400">npm run build</span></p>
              <p><span className="text-stone-500"># 2. Thêm nền tảng Android và iOS :</span><br /><span className="text-emerald-400">npx cap add android</span><br /><span className="text-emerald-400">npx cap add ios</span></p>
              <p><span className="text-stone-500"># 3. Đồng bộ và mở Android Studio / Xcode để xuất .apk hoặc .ipa :</span><br /><span className="text-emerald-400">npx cap copy</span><br /><span className="text-emerald-400">npx cap open android</span></p>
            </div>
          </div>

          {/* Section 3: Password Security & App Data Reset */}
          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Bảo Vệ Xóa & Đặt Lại Cài Đặt Gốc (Cần Mật Khẩu):</span>
              </div>
              <span className="text-[10px] font-bold text-red-300 bg-red-950 border border-red-800 px-2 py-0.5 rounded">
                Bảo vệ Owner
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Nếu bạn muốn xóa sạch tiến độ học local hoặc đặt lại ứng dụng về cài đặt ban đầu, thao tác bắt buộc phải nhập đúng mật khẩu Chủ App (<strong>8696</strong>).
            </p>

            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/80 hover:bg-red-800 border border-red-700 text-xs font-bold text-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-300" />
              <span>Xóa Toàn Bộ Dữ Liệu Local / Reset App (Cần Mật Khẩu)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Security Password Modal */}
      <SecurityPasswordModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        title="Bảo Vệ Xóa Dữ Liệu Ứng Dụng"
        description="Mọi thao tác đặt lại dữ liệu ứng dụng đều được khóa bằng mật khẩu. Nhập mật khẩu Owner Admin (8696) để tiếp tục."
        onSuccess={() => {
          if (onResetAllData) {
            onResetAllData();
            setImportStatus("Đã xác thực mật khẩu thành công! Đã reset toàn bộ dữ liệu local.");
          }
        }}
      />
    </div>
  );
};
