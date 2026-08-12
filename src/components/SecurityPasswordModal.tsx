import React, { useState } from "react";
import { X, Lock, ShieldAlert, KeyRound, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { verifyAdminPasscode } from "../lib/userAccount";

interface SecurityPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  accountPin?: string;
}

export const SecurityPasswordModal: React.FC<SecurityPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Xác Thực Mật Khẩu Bảo Vệ",
  description = "Thao tác này sẽ xóa dữ liệu. Vui lòng nhập mật khẩu Owner Admin (hoặc mã PIN cá nhân) để xác nhận.",
  accountPin,
}) => {
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanInput = inputPassword.trim();
    if (!cleanInput) {
      setError("Vui lòng nhập mật khẩu hoặc mã PIN.");
      return;
    }

    // Verify against Owner Admin Passcode ("8696", etc.) or Account PIN
    const isOwnerPasscode = verifyAdminPasscode(cleanInput);
    const isAccountPin = accountPin && cleanInput === accountPin.trim();

    if (isOwnerPasscode || isAccountPin) {
      setInputPassword("");
      setError(null);
      onSuccess();
      onClose();
    } else {
      setError("Mật khẩu hoặc mã PIN không chính xác. Thao tác xóa đã bị chặn!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-stone-100 relative">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>{title}</span>
              </h3>
              <p className="text-[11px] text-stone-400">Bảo mật ứng dụng & Chống xóa dữ liệu trái phép</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
              {description}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Nhập Mật Khẩu Owner Admin hoặc mã PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Mật khẩu (ví dụ: 8696)..."
                  className="w-full bg-stone-950 border border-stone-800 focus:border-red-500 rounded-xl py-2.5 pl-9 pr-3 text-xs text-stone-100 placeholder-stone-600 outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Mật khẩu mặc định dành cho Chủ App (Trần Ngọc Tùng):</span>
              </div>
              <p>Mật khẩu Master: <code className="text-amber-400 font-bold bg-stone-900 px-1.5 py-0.5 rounded">8696</code> hoặc mã PIN cá nhân của bạn.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Cho Phép Xóa</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
