import { playBadgeUnlockSound } from "./soundEffects";

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  learnedWordsCount: number;
  kanjiWrittenCount: number;
  speechPracticeCount: number;
  jlptTestsTakenCount: number;
  unlockedBadgeIds: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or Lucide icon key
  category: "streak" | "words" | "kanji" | "speech" | "exam" | "srs";
  xpBonus: number;
  checkUnlocked: (stats: UserStats) => boolean;
}

const STATS_STORAGE_KEY = "nihongo_user_stats_v1";

export const ALL_BADGES: Badge[] = [
  {
    id: "badge_first_word",
    title: "Khởi Đầu Đam Mê",
    description: "Học từ vựng tiếng Nhật đầu tiên",
    icon: "🌱",
    category: "words",
    xpBonus: 50,
    checkUnlocked: (s) => s.learnedWordsCount >= 1,
  },
  {
    id: "badge_vocab_50",
    title: "Ngũ Thập Từ",
    description: "Đã học thuộc 50 từ vựng",
    icon: "📚",
    category: "words",
    xpBonus: 150,
    checkUnlocked: (s) => s.learnedWordsCount >= 50,
  },
  {
    id: "badge_vocab_100",
    title: "Bách Từ Thông",
    description: "Chinh phục 100 từ vựng tiếng Nhật",
    icon: "🎖️",
    category: "words",
    xpBonus: 300,
    checkUnlocked: (s) => s.learnedWordsCount >= 100,
  },
  {
    id: "badge_streak_3",
    title: "Tam Nhật Liên Tục",
    description: "Duy trì chuỗi học 3 ngày liên tiếp",
    icon: "🔥",
    category: "streak",
    xpBonus: 100,
    checkUnlocked: (s) => s.streak >= 3,
  },
  {
    id: "badge_streak_7",
    title: "Thất Nhật Học Sĩ",
    description: "Học tập kiên trì 7 ngày liên tục",
    icon: "⚡",
    category: "streak",
    xpBonus: 250,
    checkUnlocked: (s) => s.streak >= 7,
  },
  {
    id: "badge_streak_30",
    title: "Nguyện Trung Thành",
    description: "Duy trì chuỗi 30 ngày học liên tục!",
    icon: "👑",
    category: "streak",
    xpBonus: 1000,
    checkUnlocked: (s) => s.streak >= 30,
  },
  {
    id: "badge_kanji_artist",
    title: "Bút Thần Kanji",
    description: "Luyện viết Kanji thành công 10 chữ",
    icon: "🖌️",
    category: "kanji",
    xpBonus: 200,
    checkUnlocked: (s) => s.kanjiWrittenCount >= 10,
  },
  {
    id: "badge_speech_master",
    title: "Âm Điệu Bản Xứ",
    description: "Hoàn thành 5 lượt luyện nói & shadowing cùng AI",
    icon: "🎙️",
    category: "speech",
    xpBonus: 200,
    checkUnlocked: (s) => s.speechPracticeCount >= 5,
  },
  {
    id: "badge_jlpt_warrior",
    title: "Dũng Sĩ JLPT",
    description: "Hoàn thành 1 bài thi thử JLPT",
    icon: "🎯",
    category: "exam",
    xpBonus: 300,
    checkUnlocked: (s) => s.jlptTestsTakenCount >= 1,
  },
];

export function calculateLevelFromXP(xp: number): {
  level: number;
  title: string;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
} {
  // Each level requires level * 200 XP
  let level = 1;
  let accumulatedXP = 0;

  while (xp >= accumulatedXP + level * 200) {
    accumulatedXP += level * 200;
    level += 1;
  }

  const currentLevelXP = xp - accumulatedXP;
  const nextLevelXP = level * 200;
  const progressPercent = Math.min(100, Math.round((currentLevelXP / nextLevelXP) * 100));

  let title = "Tập Sự (初心)";
  if (level >= 3) title = "Sơ Cấp (初級)";
  if (level >= 7) title = "Trung Cấp (中級)";
  if (level >= 12) title = "Thượng Cấp (上級)";
  if (level >= 20) title = "Cao Thủ (達人)";
  if (level >= 30) title = "Bổn Sư (師範)";
  if (level >= 50) title = "Nihongo Master (日本語マスター)";

  return { level, title, currentLevelXP, nextLevelXP, progressPercent };
}

export function loadUserStats(accountId?: string): UserStats {
  const key = accountId ? `nihongo_stats_${accountId}` : STATS_STORAGE_KEY;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return checkStreakUpdate(parsed);
    }
  } catch (e) {
    console.error("Lỗi đọc stats:", e);
  }

  const defaultStats: UserStats = {
    xp: 0,
    level: 1,
    streak: 1,
    lastActiveDate: new Date().toISOString().split("T")[0],
    learnedWordsCount: 0,
    kanjiWrittenCount: 0,
    speechPracticeCount: 0,
    jlptTestsTakenCount: 0,
    unlockedBadgeIds: [],
  };
  return defaultStats;
}

export function saveUserStats(stats: UserStats, accountId?: string): void {
  const key = accountId ? `nihongo_stats_${accountId}` : STATS_STORAGE_KEY;
  try {
    localStorage.setItem(key, JSON.stringify(stats));
  } catch (e) {
    console.error("Lỗi lưu stats:", e);
  }
}

/**
 * Automatically update streak based on calendar days
 */
export function checkStreakUpdate(stats: UserStats): UserStats {
  const today = new Date().toISOString().split("T")[0];
  if (stats.lastActiveDate === today) return stats;

  const last = new Date(stats.lastActiveDate);
  const now = new Date(today);
  const diffTime = Math.abs(now.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let newStreak = stats.streak;
  if (diffDays === 1) {
    newStreak += 1;
  } else if (diffDays > 1) {
    newStreak = 1; // Reset streak if missed a day
  }

  return {
    ...stats,
    streak: newStreak,
    lastActiveDate: today,
  };
}

/**
 * Add XP and check for newly unlocked badges
 */
export function addXPAndCheckBadges(
  earnedXP: number,
  updates?: Partial<UserStats>,
  accountId?: string
): { updatedStats: UserStats; newlyUnlockedBadges: Badge[] } {
  let stats = loadUserStats(accountId);
  stats = checkStreakUpdate(stats);

  const nextXP = stats.xp + earnedXP;
  const mergedStats: UserStats = {
    ...stats,
    xp: nextXP,
    learnedWordsCount: updates?.learnedWordsCount ?? stats.learnedWordsCount,
    kanjiWrittenCount: (stats.kanjiWrittenCount || 0) + (updates?.kanjiWrittenCount || 0),
    speechPracticeCount: (stats.speechPracticeCount || 0) + (updates?.speechPracticeCount || 0),
    jlptTestsTakenCount: (stats.jlptTestsTakenCount || 0) + (updates?.jlptTestsTakenCount || 0),
  };

  const newlyUnlocked: Badge[] = [];
  ALL_BADGES.forEach((badge) => {
    if (!mergedStats.unlockedBadgeIds.includes(badge.id)) {
      if (badge.checkUnlocked(mergedStats)) {
        mergedStats.unlockedBadgeIds.push(badge.id);
        mergedStats.xp += badge.xpBonus;
        newlyUnlocked.push(badge);
      }
    }
  });

  const levelInfo = calculateLevelFromXP(mergedStats.xp);
  mergedStats.level = levelInfo.level;

  saveUserStats(mergedStats, accountId);

  if (newlyUnlocked.length > 0) {
    playBadgeUnlockSound();
  }

  return { updatedStats: mergedStats, newlyUnlockedBadges: newlyUnlocked };
}
