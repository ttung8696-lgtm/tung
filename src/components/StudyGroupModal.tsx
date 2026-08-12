import React, { useState } from "react";
import { Users, Trophy, Flame, Share2, Plus, Sparkles, Award } from "lucide-react";
import { playMokugyoSound, playCorrectChime } from "../utils/soundEffects";

interface StudyGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserXP: number;
  currentUserStreak: number;
  currentUsername: string;
}

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Trần Ngọc Tùng", xp: 3450, streak: 14, title: "Cao Thủ N2" },
  { rank: 2, name: "Yuki Tanaka", xp: 2980, streak: 9, title: "Siêu Nhớ Kanji" },
  { rank: 3, name: "Nguyễn Minh Anh", xp: 2410, streak: 7, title: "Sơ Cấp N4" },
  { rank: 4, name: "Satoshi_JP", xp: 1890, streak: 5, title: "Chăm Chỉ N5" },
];

export const StudyGroupModal: React.FC<StudyGroupModalProps> = ({
  isOpen,
  onClose,
  currentUserXP,
  currentUserStreak,
  currentUsername,
}) => {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "groups">("leaderboard");
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  const userLeaderboard = [
    ...MOCK_LEADERBOARD,
    {
      rank: 5,
      name: currentUsername || "Bạn (Tài khoản hiện tại)",
      xp: currentUserXP,
      streak: currentUserStreak,
      title: "Học Viên Tích Cực",
    },
  ].sort((a, b) => b.xp - a.xp);

  const handleShareAchievement = () => {
    playCorrectChime();
    const text = `🏆 Tôi đang học tiếng Nhật trên app Trần Ngọc Tùng - Nihongo Master với chuỗi ${currentUserStreak} ngày học liên tiếp & ${currentUserXP} XP! Học cùng tôi tại: https://nihongo-master.app`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-stone-100">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-stone-100 font-serif-jp">
              Học Cùng Bạn Bè & Bảng Xếp Hạng
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 text-xs font-semibold px-2 py-1 rounded"
          >
            Đóng
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "leaderboard"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-stone-800 text-stone-300"
            }`}
          >
            🏆 Bảng Xếp Hạng Tuần
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "groups"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-stone-800 text-stone-300"
            }`}
          >
            👥 Nhóm Học Tập
          </button>
        </div>

        {activeTab === "leaderboard" ? (
          <div className="space-y-3">
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {userLeaderboard.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    item.name.includes("Bạn")
                      ? "bg-amber-500/20 border-amber-500 text-amber-200 font-bold"
                      : "bg-stone-950 border-stone-800 text-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-extrabold text-amber-400">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-[10px] text-stone-400">{item.title}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-red-400 font-bold">
                      <Flame className="w-3.5 h-3.5" /> {item.streak}d
                    </span>
                    <span className="font-extrabold text-amber-300">{item.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleShareAchievement}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold rounded-xl text-xs inline-flex items-center justify-center gap-2 border border-stone-700 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedShare ? "Đã sao chép link thành tích!" : "Chia sẻ thành tích học tập với bạn bè"}</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3 bg-stone-950 p-5 rounded-xl border border-stone-800">
            <Users className="w-10 h-10 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-stone-200">
              Tạo hoặc Tham gia Nhóm Cùng Tiến
            </h4>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              Lập nhóm học 3-5 người để thi đua chuỗi học Streak hàng ngày và nhắc nhở nhau ôn tập.
            </p>
            <button
              onClick={() => alert("Tính năng nhóm học đang kết nối danh sách bạn bè...")}
              className="px-4 py-2 bg-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo nhóm học mới</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
