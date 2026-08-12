import { VocabItem } from "../types";

export interface SRSItemState {
  interval: number; // in days
  repetition: number; // count of consecutive successful reviews
  easeFactor: number; // starting at 2.5
  nextReviewAt: number; // timestamp in ms
  lastReviewedAt: number; // timestamp in ms
  reviewCount: number;
}

export type SRSGrade = 0 | 1 | 2 | 3; // 0: Again, 1: Hard, 2: Good, 3: Easy

const SRS_STORAGE_KEY = "nihongo_srs_state_map_v1";

/**
 * SM-2 Spaced Repetition Algorithm implementation
 * Recalculates interval, repetition count, and ease factor based on performance grade.
 */
export function calculateSM2(
  grade: SRSGrade,
  prevState?: SRSItemState
): SRSItemState {
  const now = Date.now();
  let interval = prevState?.interval ?? 0;
  let repetition = prevState?.repetition ?? 0;
  let easeFactor = prevState?.easeFactor ?? 2.5;
  const reviewCount = (prevState?.reviewCount ?? 0) + 1;

  if (grade === 0) {
    // Again / Forget: Reset interval to 1 day & repetition to 0
    repetition = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (grade === 1) {
    // Hard
    repetition += 1;
    interval = repetition === 1 ? 1 : Math.max(1, Math.round(interval * 1.2));
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (grade === 2) {
    // Good
    repetition += 1;
    if (repetition === 1) {
      interval = 1;
    } else if (repetition === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  } else {
    // Easy
    repetition += 1;
    if (repetition === 1) {
      interval = 2;
    } else if (repetition === 2) {
      interval = 8;
    } else {
      interval = Math.round(interval * easeFactor * 1.3);
    }
    easeFactor = Math.min(3.0, easeFactor + 0.15);
  }

  const nextReviewAt = now + interval * 24 * 60 * 60 * 1000;

  return {
    interval,
    repetition,
    easeFactor,
    nextReviewAt,
    lastReviewedAt: now,
    reviewCount,
  };
}

/**
 * Load SRS state map from localStorage or profile data
 */
export function loadSRSMap(accountId?: string): Record<string, SRSItemState> {
  const key = accountId ? `nihongo_srs_map_${accountId}` : SRS_STORAGE_KEY;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi đọc dữ liệu SRS:", e);
  }
  return {};
}

/**
 * Save SRS state map
 */
export function saveSRSMap(
  srsMap: Record<string, SRSItemState>,
  accountId?: string
): void {
  const key = accountId ? `nihongo_srs_map_${accountId}` : SRS_STORAGE_KEY;
  try {
    localStorage.setItem(key, JSON.stringify(srsMap));
  } catch (e) {
    console.error("Lỗi lưu dữ liệu SRS:", e);
  }
}

/**
 * Returns vocabulary items that are due for review today or unreviewed
 */
export function getDueVocabItems(
  vocabulary: VocabItem[],
  srsMap: Record<string, SRSItemState>
): { dueItems: VocabItem[]; newItems: VocabItem[] } {
  const now = Date.now();
  const dueItems: VocabItem[] = [];
  const newItems: VocabItem[] = [];

  vocabulary.forEach((item) => {
    const srs = srsMap[item.id];
    if (!srs) {
      newItems.push(item);
    } else if (srs.nextReviewAt <= now) {
      dueItems.push(item);
    }
  });

  return { dueItems, newItems };
}

/**
 * Format next review time remaining in friendly Vietnamese text
 */
export function formatNextReviewTime(nextReviewAt?: number): string {
  if (!nextReviewAt) return "Chưa học (Cần bắt đầu)";
  const diffMs = nextReviewAt - Date.now();
  if (diffMs <= 0) return "Cần ôn hôm nay!";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 24) {
    return `Ôn lại sau ${hours || 1} giờ`;
  }
  const days = Math.floor(hours / 24);
  return `Ôn lại sau ${days} ngày`;
}
