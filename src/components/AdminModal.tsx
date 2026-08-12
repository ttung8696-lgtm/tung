import React, { useState, useEffect } from "react";
import { 
  X, 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  Search, 
  RefreshCw, 
  Trash2, 
  Users, 
  BookOpen, 
  Bookmark, 
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  History,
  FileCheck,
  XCircle,
  Check
} from "lucide-react";
import { 
  UserProfileSummary, 
  fetchAllUserAccounts, 
  deleteUserAccount, 
  verifyAdminPasscode,
  isStoredAdmin,
  setAdminSession,
  ActivityLog,
  fetchUserActivityLogs,
  clearUserActivityLogs,
  formatTimeAgo
} from "../lib/userAccount";
import { 
  PendingSubmission, 
  fetchPendingSubmissions, 
  approveSubmission, 
  rejectSubmission, 
  deleteSubmissionRecord 
} from "../lib/submissionService";
import { VocabItem, GrammarItem } from "../types";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => isStoredAdmin());
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState<string | null>(null);

  const [adminTab, setAdminTab] = useState<"accounts" | "activity" | "submissions">("submissions");

  // Accounts state
  const [accounts, setAccounts] = useState<UserProfileSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [showPins, setShowPins] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<string>("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [logSearchQuery, setLogSearchQuery] = useState("");

  // Submissions state
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subTypeFilter, setSubTypeFilter] = useState<"all" | "vocab" | "grammar">("all");
  const [subStatusFilter, setSubStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [processingSubId, setProcessingSubId] = useState<string | null>(null);

  const loadAccounts = async () => {
    setLoading(true);
    setActionMsg(null);
    try {
      const data = await fetchAllUserAccounts();
      setAccounts(data);
    } catch (err: any) {
      console.error("Lỗi tải danh sách tài khoản:", err);
      setActionMsg("Không thể tải tài khoản từ Firestore. Vui lòng kiểm tra kết nối.");
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    setLogsLoading(true);
    try {
      const targetId = selectedAccountFilter === "all" ? undefined : selectedAccountFilter;
      const logs = await fetchUserActivityLogs(targetId, 150);
      setActivityLogs(logs);
    } catch (err) {
      console.error("Lỗi tải lịch sử hoạt động:", err);
    } finally {
      setLogsLoading(false);
    }
  };

  const loadSubmissions = async () => {
    setSubsLoading(true);
    try {
      const data = await fetchPendingSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error("Lỗi tải danh sách yêu cầu nạp:", err);
    } finally {
      setSubsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdminAuth) {
      loadAccounts();
      loadActivityLogs();
      loadSubmissions();
    }
  }, [isOpen, isAdminAuth]);

  useEffect(() => {
    if (isOpen && isAdminAuth && adminTab === "activity") {
      loadActivityLogs();
    } else if (isOpen && isAdminAuth && adminTab === "submissions") {
      loadSubmissions();
    }
  }, [isOpen, isAdminAuth, selectedAccountFilter, adminTab]);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    if (verifyAdminPasscode(passcode)) {
      setAdminSession(true);
      setIsAdminAuth(true);
      setPasscode("");
      loadAccounts();
      loadSubmissions();
    } else {
      setPassError("Mật khẩu Quản Trị Viên không đúng. Vui lòng thử lại!");
    }
  };

  const handleAdminLogout = () => {
    setAdminSession(false);
    setIsAdminAuth(false);
  };

  const handleDeleteAccount = async (account: UserProfileSummary) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${account.username}" (ID: ${account.id}) khỏi Cloud Firestore? Hành động này không thể hoàn tác.`)) {
      return;
    }

    setDeletingId(account.id);
    try {
      await deleteUserAccount(account.id);
      setActionMsg(`Đã xóa tài khoản "${account.username}" thành công.`);
      setAccounts((prev) => prev.filter((a) => a.id !== account.id));
    } catch (err: any) {
      setActionMsg(`Lỗi khi xóa tài khoản: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Submission approval handlers
  const handleApproveSub = async (sub: PendingSubmission) => {
    setProcessingSubId(sub.id);
    setActionMsg(null);
    try {
      await approveSubmission(sub, "Trần Ngọc Tùng (Owner)");
      setActionMsg(`🎉 Đã duyệt & đăng tải công khai ${sub.type === "vocab" ? "từ vựng" : "mẫu ngữ pháp"} do ${sub.submittedBy.username} gửi!`);
      setSubmissions((prev) =>
        prev.map((item) => (item.id === sub.id ? { ...item, status: "approved" } : item))
      );
    } catch (err: any) {
      setActionMsg(`Lỗi khi phê duyệt: ${err.message}`);
    } finally {
      setProcessingSubId(null);
    }
  };

  const handleRejectSub = async (sub: PendingSubmission) => {
    const reason = window.prompt(
      `Lý do từ chối bài đóng góp "${sub.type === "vocab" ? (sub.data as VocabItem).kanji || (sub.data as VocabItem).hiragana : (sub.data as GrammarItem).title}":`,
      "Chưa đạt tiêu chuẩn ngữ pháp/từ vựng JLPT hoặc đã tồn tại."
    );
    if (reason === null) return;

    setProcessingSubId(sub.id);
    setActionMsg(null);
    try {
      await rejectSubmission(sub.id, reason);
      setActionMsg(`Đã từ chối yêu cầu từ ${sub.submittedBy.username}.`);
      setSubmissions((prev) =>
        prev.map((item) => (item.id === sub.id ? { ...item, status: "rejected", rejectionReason: reason } : item))
      );
    } catch (err: any) {
      setActionMsg(`Lỗi từ chối: ${err.message}`);
    } finally {
      setProcessingSubId(null);
    }
  };

  const handleDeleteSubRecord = async (subId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hẳn bản ghi yêu cầu này?")) return;
    setProcessingSubId(subId);
    try {
      await deleteSubmissionRecord(subId);
      setSubmissions((prev) => prev.filter((s) => s.id !== subId));
      setActionMsg("Đã xóa bản ghi yêu cầu.");
    } catch (err: any) {
      setActionMsg(`Lỗi xóa: ${err.message}`);
    } finally {
      setProcessingSubId(null);
    }
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  const filteredSubmissions = submissions.filter((s) => {
    if (subTypeFilter !== "all" && s.type !== subTypeFilter) return false;
    if (subStatusFilter !== "all" && s.status !== subStatusFilter) return false;
    return true;
  });

  const filteredAccounts = accounts.filter(
    (a) =>
      a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl text-stone-100 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Bảng Phê Duyệt & Quản Lý Owner Admin</span>
                {isAdminAuth && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Trần Ngọc Tùng (Owner)
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-stone-400">
                Kiểm duyệt Yêu cầu Nạp Ngữ pháp/Từ vựng JLPT & Quản lý toàn bộ ứng dụng.
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
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {!isAdminAuth ? (
            /* Admin Password Gate */
            <div className="max-w-md mx-auto py-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Xác Thực Mật Khẩu Owner Admin</h4>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Nhập mã PIN / Mật khẩu Quản Trị Viên của bạn để mở giao diện duyệt yêu cầu nạp từ vựng & ngữ pháp.
                </p>
              </div>

              {passError && (
                <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{passError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Mã Khóa Admin / Passcode
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
                    <input
                      type="password"
                      required
                      autoFocus
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Nhập mã PIN Admin..."
                      className="w-full bg-stone-950 border border-stone-800 focus:border-red-500 rounded-xl py-2.5 pl-9 pr-3 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mở Bảng Phê Duyệt & Quản Trị</span>
                </button>
              </form>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] text-stone-400 space-y-1">
                <p className="font-semibold text-stone-300">💡 Ghi chú dành cho Chủ App (Trần Ngọc Tùng):</p>
                <p>Mỗi khi học viên gửi yêu cầu nạp thêm Từ vựng hoặc Mẫu ngữ pháp JLPT, thông báo sẽ hiển thị tại đây để bạn kiểm tra và duyệt OK trước khi cho xuất hiện trên app.</p>
              </div>
            </div>
          ) : (
            /* Admin Account & Activity History & Submissions Dashboard */
            <div className="space-y-5">
              {/* Top Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between border-b border-stone-800 pb-3 gap-2">
                <div className="flex items-center gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
                  <button
                    onClick={() => setAdminTab("submissions")}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                      adminTab === "submissions"
                        ? "bg-amber-500 text-stone-950 shadow"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Duyệt Yêu Cầu Nạp Bài</span>
                    {pendingCount > 0 && (
                      <span className="bg-red-600 text-white font-bold px-1.5 py-0.2 text-[10px] rounded-full animate-pulse">
                        {pendingCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setAdminTab("accounts")}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                      adminTab === "accounts"
                        ? "bg-amber-500 text-stone-950 shadow"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Tài Khoản Học Viên ({accounts.length})</span>
                  </button>

                  <button
                    onClick={() => setAdminTab("activity")}
                    className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                      adminTab === "activity"
                        ? "bg-amber-500 text-stone-950 shadow"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <History className="w-4 h-4" />
                    <span>Nhật Ký Hoạt Động ({activityLogs.length})</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPins(!showPins)}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {showPins ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-stone-400" />}
                    <span>{showPins ? "Ẩn PIN" : "Hiện PIN"}</span>
                  </button>

                  <button
                    onClick={handleAdminLogout}
                    className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Khóa Admin</span>
                  </button>
                </div>
              </div>

              {/* Action / Notification Banner */}
              {actionMsg && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{actionMsg}</span>
                </div>
              )}

              {/* TAB 1: PENDING SUBMISSIONS APPROVAL */}
              {adminTab === "submissions" && (
                <div className="space-y-4">
                  {/* Filter Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 p-3 rounded-2xl border border-stone-800 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-stone-400 font-semibold">Phân loại:</span>
                        <select
                          value={subTypeFilter}
                          onChange={(e) => setSubTypeFilter(e.target.value as any)}
                          className="bg-stone-900 border border-stone-700 text-stone-200 rounded-lg py-1 px-2.5 outline-none"
                        >
                          <option value="all">🌐 Tất cả (Từ vựng & Ngữ pháp)</option>
                          <option value="vocab">📖 Chỉ Từ vựng JLPT</option>
                          <option value="grammar">⛩️ Chỉ Mẫu Ngữ pháp JLPT</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-stone-400 font-semibold">Trạng thái:</span>
                        <select
                          value={subStatusFilter}
                          onChange={(e) => setSubStatusFilter(e.target.value as any)}
                          className="bg-stone-900 border border-stone-700 text-stone-200 rounded-lg py-1 px-2.5 outline-none font-bold text-amber-300"
                        >
                          <option value="pending">⏳ Chờ duyệt ({pendingCount})</option>
                          <option value="approved">✅ Đã duyệt OK</option>
                          <option value="rejected">❌ Đã từ chối</option>
                          <option value="all">Tất cả bài đóng góp</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={loadSubmissions}
                      disabled={subsLoading}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-semibold flex items-center gap-1.5 text-xs transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${subsLoading ? "animate-spin text-amber-400" : ""}`} />
                      <span>Làm mới danh sách</span>
                    </button>
                  </div>

                  {/* Submissions List */}
                  {subsLoading ? (
                    <div className="py-12 text-center text-stone-400 text-xs space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                      <p>Đang tải danh sách yêu cầu phê duyệt từ Cloud Firestore...</p>
                    </div>
                  ) : filteredSubmissions.length > 0 ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {filteredSubmissions.map((sub) => {
                        const isVocab = sub.type === "vocab";
                        const vocabData = sub.data as VocabItem;
                        const grammarData = sub.data as GrammarItem;

                        return (
                          <div
                            key={sub.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              sub.status === "pending"
                                ? "bg-stone-950 border-amber-500/40 shadow-lg shadow-amber-950/20"
                                : sub.status === "approved"
                                ? "bg-stone-950/60 border-emerald-800/60"
                                : "bg-stone-950/40 border-red-900/40 opacity-80"
                            }`}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-stone-800/80">
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                  isVocab
                                    ? "bg-amber-950 text-amber-300 border-amber-800/60"
                                    : "bg-purple-950 text-purple-300 border-purple-800/60"
                                }`}>
                                  {isVocab ? "Từ Vựng JLPT" : "Mẫu Ngữ Pháp JLPT"}
                                </span>

                                <span className="text-xs font-semibold text-stone-300">
                                  Gửi bởi: <strong className="text-amber-300">{sub.submittedBy.username}</strong> ({sub.submittedBy.id})
                                </span>

                                <span className="text-[10px] text-stone-500 font-mono">
                                  ⏱️ {formatTimeAgo(sub.createdAt)} ({sub.timeFormatted})
                                </span>
                              </div>

                              <div>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                                  sub.status === "pending"
                                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                    : sub.status === "approved"
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                    : "bg-red-500/20 text-red-300 border-red-500/40"
                                }`}>
                                  {sub.status === "pending" && "⏳ Đang Chờ Admin Duyệt"}
                                  {sub.status === "approved" && "✅ Đã Duyệt & Đăng Tải App"}
                                  {sub.status === "rejected" && "❌ Đã Từ Chối"}
                                </span>
                              </div>
                            </div>

                            {/* Item Content Preview */}
                            <div className="py-3 text-xs space-y-2">
                              {isVocab ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                                  <div>
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-xl font-bold text-amber-300 font-serif">
                                        {vocabData.kanji}
                                      </span>
                                      <span className="text-sm font-mono text-stone-300">
                                        ({vocabData.hiragana})
                                      </span>
                                      <span className="text-xs text-amber-500 font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-900/60">
                                        {vocabData.jlpt}
                                      </span>
                                    </div>
                                    <p className="text-stone-200 font-bold mt-1">
                                      Nghĩa: {vocabData.vietnamese}
                                    </p>
                                    {vocabData.hanViet && (
                                      <p className="text-stone-400 text-[11px]">
                                        Hán Việt: {vocabData.hanViet}
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-1 text-stone-300">
                                    <p className="text-[11px] text-stone-400">
                                      Chủ đề: <span className="text-stone-200">{vocabData.category}</span>
                                    </p>
                                    <p className="text-[11px] italic bg-stone-950 p-2 rounded border border-stone-800">
                                      VD: {vocabData.example.japanese} ({vocabData.example.vietnamese})
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-base font-bold text-amber-300 font-serif">
                                      {grammarData.title}
                                    </h4>
                                    <span className="text-xs text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                                      {grammarData.level}
                                    </span>
                                  </div>

                                  <p className="text-amber-400 font-mono font-semibold bg-stone-950 p-2 rounded border border-stone-800">
                                    Công thức: {grammarData.formula}
                                  </p>

                                  <p className="text-stone-100 font-bold">
                                    Ý nghĩa: {grammarData.summary}
                                  </p>

                                  <p className="text-stone-300 text-[11px]">
                                    Giải thích: {grammarData.explanation}
                                  </p>

                                  {grammarData.examples && grammarData.examples.length > 0 && (
                                    <div className="bg-stone-950 p-2 rounded border border-stone-800 text-[11px] text-stone-300">
                                      <strong>Ví dụ:</strong> {grammarData.examples[0].japanese} ({grammarData.examples[0].vietnamese})
                                    </div>
                                  )}
                                </div>
                              )}

                              {sub.rejectionReason && (
                                <div className="p-2.5 bg-red-950/60 border border-red-900/60 rounded-xl text-red-300 text-[11px]">
                                  <strong>Lý do từ chối:</strong> {sub.rejectionReason}
                                </div>
                              )}
                            </div>

                            {/* Admin Approve & Action Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800/80">
                              {sub.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleRejectSub(sub)}
                                    disabled={processingSubId === sub.id}
                                    className="px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Từ chối</span>
                                  </button>

                                  <button
                                    onClick={() => handleApproveSub(sub)}
                                    disabled={processingSubId === sub.id}
                                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all"
                                  >
                                    {processingSubId === sub.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )}
                                    <span>Xác nhận OK & Đăng Tải App</span>
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => handleDeleteSubRecord(sub.id)}
                                disabled={processingSubId === sub.id}
                                className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-xs"
                                title="Xóa bản ghi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-stone-500 text-xs bg-stone-950 rounded-2xl border border-stone-800 p-8 space-y-2">
                      <FileCheck className="w-10 h-10 text-stone-600 mx-auto" />
                      <p className="text-stone-300 font-bold text-sm">Không có yêu cầu nạp bài nào trong danh sách!</p>
                      <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
                        Khi học viên bấm gửi yêu cầu nạp thêm Mẫu Ngữ Pháp JLPT hoặc Từ Vựng JLPT, thông báo sẽ xuất hiện tại đây để bạn bấm xác nhận OK.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ACCOUNTS LIST */}
              {adminTab === "accounts" && (
                <div className="space-y-4">
                  {/* Search and Refresh Toolbar */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm bạn bè theo tên tài khoản hoặc mã ID..."
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-3 text-xs text-stone-100 placeholder-stone-600 outline-none transition-colors"
                      />
                    </div>

                    <button
                      onClick={loadAccounts}
                      disabled={loading}
                      className="px-3 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-400" : ""}`} />
                      <span>Tải lại</span>
                    </button>
                  </div>

                  {/* Account List Table */}
                  {loading ? (
                    <div className="py-12 text-center text-stone-400 text-xs space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                      <p>Đang kết nối Firestore & lấy danh sách tài khoản học viên...</p>
                    </div>
                  ) : filteredAccounts.length > 0 ? (
                    <div className="border border-stone-800 rounded-xl overflow-hidden bg-stone-950/50">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-stone-300">
                          <thead className="bg-stone-950 text-stone-400 text-[11px] uppercase font-bold border-b border-stone-800">
                            <tr>
                              <th className="py-3 px-4">Tên Tài Khoản</th>
                              <th className="py-3 px-4">Mã PIN</th>
                              <th className="py-3 px-4 text-center">Đã thuộc</th>
                              <th className="py-3 px-4 text-center">Yêu thích</th>
                              <th className="py-3 px-4 text-center">Tự tạo</th>
                              <th className="py-3 px-4 text-right">Nhật Ký & Thao Tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-800/60">
                            {filteredAccounts.map((acc) => (
                              <tr key={acc.id} className="hover:bg-stone-900/60 transition-colors">
                                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                                    {acc.username[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-amber-300">{acc.username}</div>
                                    <div className="text-[10px] font-mono text-stone-500">{acc.id}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 font-mono">
                                  {showPins ? (
                                    <span className="bg-stone-900 border border-stone-700 text-emerald-400 px-2 py-0.5 rounded font-bold">
                                      {acc.pin}
                                    </span>
                                  ) : (
                                    <span className="text-stone-600">••••</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                                    <BookOpen className="w-3 h-3" />
                                    {acc.learnedCount}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                                    <Bookmark className="w-3 h-3" />
                                    {acc.bookmarkedCount}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-flex items-center gap-1 font-semibold text-stone-300 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                                    <PlusCircle className="w-3 h-3" />
                                    {acc.customWordsCount}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setSelectedAccountFilter(acc.id);
                                        setAdminTab("activity");
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                                      title="Xem lịch sử hoạt động của bạn này"
                                    >
                                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Lịch sử</span>
                                    </button>

                                    <button
                                      onClick={() => handleDeleteAccount(acc)}
                                      disabled={deletingId === acc.id}
                                      className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 transition-colors disabled:opacity-50"
                                      title="Xóa tài khoản này"
                                    >
                                      {deletingId === acc.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-stone-500 text-xs bg-stone-950 rounded-xl border border-stone-800 p-6">
                      Chưa có tài khoản nào trùng khớp. Tất cả dữ liệu học viên của ứng dụng sẽ liệt kê ở đây.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ACTIVITY HISTORY LOGS */}
              {adminTab === "activity" && (
                <div className="space-y-4">
                  {/* Activity Filter Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs">
                    {/* Filter Account */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                        Lọc theo Bạn Bè / Tài khoản:
                      </label>
                      <select
                        value={selectedAccountFilter}
                        onChange={(e) => setSelectedAccountFilter(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg py-1.5 px-2.5 text-xs text-stone-200 outline-none focus:border-amber-500"
                      >
                        <option value="all">🌐 Tất cả tài khoản bạn bè</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            👤 {acc.username} ({acc.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Category */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                        Lọc Phân Loại:
                      </label>
                      <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg py-1.5 px-2.5 text-xs text-stone-200 outline-none focus:border-amber-500"
                      >
                        <option value="all">Tất cả phân loại</option>
                        <option value="Học tập">📖 Học tập (Đã thuộc)</option>
                        <option value="Kiểm tra">🏆 Kiểm tra (Quiz)</option>
                        <option value="Từ vựng">⭐ Từ vựng & Thêm mới</option>
                        <option value="Hệ thống">🔐 Hệ thống & Đăng nhập</option>
                      </select>
                    </div>

                    {/* Search Text */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                        Từ khóa tìm trong nhật ký:
                      </label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-500" />
                        <input
                          type="text"
                          value={logSearchQuery}
                          onChange={(e) => setLogSearchQuery(e.target.value)}
                          placeholder="Ví dụ: Đăng nhập, thuộc từ..."
                          className="w-full bg-stone-900 border border-stone-700 rounded-lg py-1.5 pl-8 pr-2.5 text-xs text-stone-200 outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Toolbar Actions */}
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-300">
                        Hiển thị {activityLogs.filter((log) => {
                          if (selectedAccountFilter !== "all" && log.accountId !== selectedAccountFilter) return false;
                          if (selectedCategoryFilter !== "all" && log.category !== selectedCategoryFilter) return false;
                          if (logSearchQuery.trim()) {
                            const q = logSearchQuery.toLowerCase().trim();
                            return log.username.toLowerCase().includes(q) || log.title.toLowerCase().includes(q) || (log.details?.toLowerCase().includes(q) || false);
                          }
                          return true;
                        }).length} nhật ký
                      </span>
                      {selectedAccountFilter !== "all" && (
                        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px]">
                          Lọc riêng: {accounts.find(a => a.id === selectedAccountFilter)?.username || selectedAccountFilter}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={loadActivityLogs}
                        disabled={logsLoading}
                        className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw className={`w-3 h-3 ${logsLoading ? "animate-spin text-amber-400" : ""}`} />
                        <span>Tải lại</span>
                      </button>

                      <button
                        onClick={async () => {
                          const targetName = selectedAccountFilter === "all" 
                            ? "TẤT CẢ bạn bè" 
                            : accounts.find(a => a.id === selectedAccountFilter)?.username || selectedAccountFilter;

                          if (!window.confirm(`Bạn có chắc muốn dọn nhật ký hoạt động của ${targetName}?`)) return;

                          try {
                            await clearUserActivityLogs(selectedAccountFilter === "all" ? undefined : selectedAccountFilter);
                            setActionMsg(`Đã dọn dẹp nhật ký hoạt động.`);
                            loadActivityLogs();
                          } catch (err: any) {
                            setActionMsg(`Lỗi dọn dẹp nhật ký: ${err.message}`);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                        <span>Dọn nhật ký</span>
                      </button>
                    </div>
                  </div>

                  {/* Logs Timeline List */}
                  {logsLoading ? (
                    <div className="py-12 text-center text-stone-400 text-xs space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                      <p>Đang truy xuất nhật ký hoạt động từ Cloud Firestore...</p>
                    </div>
                  ) : activityLogs.length > 0 ? (
                    <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                      {activityLogs
                        .filter((log) => {
                          if (selectedAccountFilter !== "all" && log.accountId !== selectedAccountFilter) return false;
                          if (selectedCategoryFilter !== "all" && log.category !== selectedCategoryFilter) return false;
                          if (logSearchQuery.trim()) {
                            const q = logSearchQuery.toLowerCase().trim();
                            return log.username.toLowerCase().includes(q) || log.title.toLowerCase().includes(q) || (log.details?.toLowerCase().includes(q) || false);
                          }
                          return true;
                        })
                        .map((log) => (
                          <div
                            key={log.id}
                            className="bg-stone-950 border border-stone-800/80 hover:border-stone-700/80 p-3.5 rounded-xl flex items-start justify-between gap-3 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 shrink-0 mt-0.5 text-amber-400">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-amber-300 text-xs flex items-center gap-1">
                                    <span>{log.username}</span>
                                    <span className="text-[10px] text-stone-500 font-mono">({log.accountId})</span>
                                  </span>

                                  <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                                    log.category === "Học tập"
                                      ? "bg-emerald-950 text-emerald-300 border-emerald-800/60"
                                      : log.category === "Kiểm tra"
                                      ? "bg-rose-950 text-rose-300 border-rose-800/60"
                                      : log.category === "Từ vựng"
                                      ? "bg-amber-950 text-amber-300 border-amber-800/60"
                                      : "bg-blue-950 text-blue-300 border-blue-800/60"
                                  }`}>
                                    {log.category}
                                  </span>
                                </div>

                                <p className="text-xs text-stone-100 font-medium">{log.title}</p>

                                {log.details && (
                                  <p className="text-[11px] text-stone-400 bg-stone-900/80 p-2 rounded-lg border border-stone-800/60 font-mono">
                                    {log.details}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="text-[10px] font-mono text-stone-500 shrink-0 text-right space-y-1">
                              <div className="inline-block px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold">
                                ⏱️ {formatTimeAgo(log.timestamp)}
                              </div>
                              <div className="flex items-center justify-end gap-1 text-stone-400 text-[10px]">
                                <Clock className="w-3 h-3 text-stone-500" />
                                <span>{log.timeFormatted || "Gần đây"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-stone-500 text-xs bg-stone-950 rounded-xl border border-stone-800 p-6 space-y-2">
                      <Clock className="w-8 h-8 text-stone-600 mx-auto" />
                      <p className="text-stone-400 font-semibold">Chưa có nhật ký hoạt động nào!</p>
                      <p className="text-[11px] text-stone-500">
                        Khi bạn bè thực hiện thao tác như đăng nhập, học từ vựng, kiểm tra quiz, nhật ký sẽ xuất hiện tại đây.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
