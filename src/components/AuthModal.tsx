import React, { useState, useEffect } from "react";
import { 
  X, 
  User as UserIcon, 
  KeyRound, 
  LogOut, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck, 
  Cloud, 
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldAlert,
  History,
  Clock,
  Trash2,
  Lock
} from "lucide-react";
import { 
  UserAccount, 
  authenticateAccount, 
  isStoredAdmin, 
  ActivityLog, 
  fetchUserActivityLogs 
} from "../lib/userAccount";
import { SecurityPasswordModal } from "./SecurityPasswordModal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccount: UserAccount | null;
  onLoginSuccess: (account: UserAccount) => void;
  onLogout: () => void;
  promptNotice?: string | null;
  onOpenAdminModal?: () => void;
  onResetAccountData?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentAccount,
  onLoginSuccess,
  onLogout,
  promptNotice,
  onOpenAdminModal,
  onResetAccountData,
}) => {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showSocialInfo, setShowSocialInfo] = useState(false);
  const [userLogs, setUserLogs] = useState<ActivityLog[]>([]);
  const [showUserLogs, setShowUserLogs] = useState(false);
  const [userLogsLoading, setUserLogsLoading] = useState(false);

  // Security Lock Modal State for Data Reset
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && currentAccount && showUserLogs) {
      loadUserLogs();
    }
  }, [isOpen, currentAccount, showUserLogs]);

  const loadUserLogs = async () => {
    if (!currentAccount) return;
    setUserLogsLoading(true);
    try {
      const logs = await fetchUserActivityLogs(currentAccount.id, 20);
      setUserLogs(logs);
    } catch (err) {
      console.error("Lỗi tải lịch sử cá nhân:", err);
    } finally {
      setUserLogsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const acc = await authenticateAccount(username, pin, mode);
      setSuccessMsg(
        mode === "register"
          ? `Tạo tài khoản "${acc.username}" thành công! Đã kết nối môi trường học cá nhân.`
          : `Đăng nhập thành công! Đã tải dữ liệu học của "${acc.username}".`
      );
      onLoginSuccess(acc);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error("Lỗi xác thực:", err);
      setError(err.message || "Đã xảy ra lỗi khi tạo tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAction = () => {
    onLogout();
    setSuccessMsg("Đã đăng xuất khỏi tài khoản cá nhân.");
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-stone-100 relative">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {currentAccount ? "Tài Khoản Cá Nhân" : "Tài Khoản & Không Gian Học"}
              </h3>
              <p className="text-[11px] text-stone-400">
                Môi trường lưu trữ độc lập trên Cloud
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {currentAccount ? (
            /* User Info & Logout View */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center font-extrabold text-lg shadow-md">
                    {currentAccount.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{currentAccount.username}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h4>
                    <p className="text-xs text-stone-400">
                      Mã không gian: <span className="font-mono text-amber-400">{currentAccount.id}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-700/50 flex items-center justify-between text-xs text-stone-300">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đồng bộ riêng trên Cloud
                  </span>
                  <span className="text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-700 font-mono">
                    Độc lập
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 leading-relaxed">
                💡 <strong>Không gian riêng của bạn:</strong> Tất cả từ vựng đã thuộc, danh sách yêu thích và từ tự tạo được lưu trữ riêng cho tài khoản <strong>{currentAccount.username}</strong>, hoàn toàn tách biệt với bạn bè.
              </div>

              {/* Toggle User Activity Log */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowUserLogs(!showUserLogs)}
                  className="w-full py-2 px-3 bg-stone-950 hover:bg-stone-800 text-amber-300 border border-stone-800 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <History className="w-4 h-4 text-amber-400" />
                    <span>Lịch sử học tập gần đây của tôi</span>
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {showUserLogs ? "Ẩn danh sách" : "Xem nhật ký"}
                  </span>
                </button>

                {showUserLogs && (
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-2 max-h-48 overflow-y-auto">
                    {userLogsLoading ? (
                      <div className="py-4 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                        <span>Đang tải lịch sử...</span>
                      </div>
                    ) : userLogs.length > 0 ? (
                      <div className="space-y-2">
                        {userLogs.map((log) => (
                          <div key={log.id} className="p-2 bg-stone-900 rounded-lg border border-stone-800/80 text-[11px] space-y-0.5">
                            <div className="flex items-center justify-between text-stone-300 font-semibold">
                              <span>{log.title}</span>
                              <span className="text-[10px] text-stone-500 font-mono">{log.timeFormatted || "Gần đây"}</span>
                            </div>
                            {log.details && (
                              <p className="text-[10px] text-stone-400 font-mono">{log.details}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="py-3 text-center text-[11px] text-stone-500">
                        Chưa ghi nhận lịch sử học tập nào gần đây.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Password Protected Reset Data Action */}
              <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-300 font-semibold">
                  <span className="flex items-center gap-1.5 text-red-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Xóa / Đặt lại dữ liệu học tập:</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Bảo mật PIN / Password</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Để chống ai đó vô tình hay cố ý xóa dữ liệu app, thao tác đặt lại tiến độ học tập hoặc xóa tài khoản bắt buộc phải nhập đúng mật khẩu.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSecurityModalOpen(true)}
                  className="w-full py-2 px-3 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Xóa & Đặt lại dữ liệu (Cần Mật Khẩu)</span>
                </button>
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                onClick={handleLogoutAction}
                className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Đăng xuất (Chuyển tài khoản)</span>
              </button>
            </div>
          ) : (
            /* Login & Register Form */
            <div className="space-y-4">
              {/* Optional Prompt Notice when user tried an action without login */}
              {promptNotice && (
                <div className="p-3 bg-amber-950/80 border border-amber-600/60 rounded-xl text-xs text-amber-200 flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300 font-bold mb-0.5">Yêu cầu tài khoản cá nhân:</strong>
                    <span>{promptNotice}</span>
                  </div>
                </div>
              )}

              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    mode === "register"
                      ? "bg-amber-500 text-stone-950 shadow"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tạo tài khoản mới</span>
                </button>
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    mode === "login"
                      ? "bg-amber-500 text-stone-950 shadow"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </button>
              </div>

              <div className="p-3 bg-stone-800/50 border border-stone-800 rounded-xl text-[11px] text-stone-300 leading-relaxed">
                ✨ <strong>Không gian học biệt lập:</strong> Tạo một tên tài khoản (ví dụ: <span className="text-amber-300">Tùng</span> hoặc <span className="text-amber-300">Hùng</span>) và mã PIN. Bạn và bạn bè khi vào ứng dụng có thể tạo tài khoản riêng để không bị đè dữ liệu lên nhau!
              </div>

              {/* Social Login Notice Accordion */}
              <div className="bg-stone-950/60 rounded-xl border border-stone-800 p-2.5 text-xs text-stone-400">
                <button
                  type="button"
                  onClick={() => setShowSocialInfo(!showSocialInfo)}
                  className="w-full flex items-center justify-between text-[11px] text-stone-400 hover:text-stone-200 transition-colors"
                >
                  <span>🌐 Đăng nhập bằng Google / Facebook?</span>
                  <span className="text-amber-400 font-bold">{showSocialInfo ? "Thu gọn" : "Xem thêm"}</span>
                </button>
                {showSocialInfo && (
                  <p className="mt-2 text-[11px] text-stone-400 leading-relaxed border-t border-stone-800 pt-2">
                    Để đăng nhập bằng Google hoặc Facebook cần đăng ký OAuth App Key với Meta/Google Cloud. Để tiện lợi và tức thì nhất, hệ thống đã chuẩn bị tính năng <strong>Tạo Tài Khoản Riêng Nhanh</strong> (chỉ 3 giây với Tên & PIN), giúp bạn và bạn bè có ngay môi trường lưu trữ độc lập trên Cloud mà không cần liên kết mạng xã hội!
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Tên tài khoản / Tên hiển thị
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ví dụ: Tung, Bao, Linh_N2..."
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-3 text-xs text-stone-100 placeholder-stone-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Mã PIN / Mật khẩu (ít nhất 4 số hoặc chữ)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                    <input
                      type="password"
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Nhập mã PIN riêng của bạn (vd: 1234)"
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-3 text-xs text-stone-100 placeholder-stone-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mode === "register" ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>
                    {loading
                      ? "Đang kết nối..."
                      : mode === "register"
                      ? "Tạo Tài Khoản & Môi Trường Mới"
                      : "Đăng Nhập Không Gian Học"}
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Security Password Modal for Data Reset Protection */}
      <SecurityPasswordModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        accountPin={currentAccount?.pin}
        title="Xác Thực Mật Khẩu Trước Khi Xóa Dữ Liệu"
        description="Bạn đang yêu cầu Đặt Lại / Xóa Toàn Bộ dữ liệu học tập cá nhân. Vui lòng nhập Mật khẩu Owner Admin (8696) hoặc mã PIN tài khoản của bạn để tiếp tục."
        onSuccess={() => {
          if (onResetAccountData) {
            onResetAccountData();
            setSuccessMsg("Xác thực mật khẩu thành công! Đã đặt lại dữ liệu học tập.");
          }
        }}
      />
    </div>
  );
};
