import { db } from "./firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { VocabItem, GrammarItem, UserGrammarProgress } from "../types";

export interface UserAccount {
  id: string;
  username: string;
  pin: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityLog {
  id: string;
  accountId: string;
  username: string;
  action: "login" | "register" | "learned" | "unlearned" | "bookmark" | "unbookmark" | "add_word" | "quiz" | "ai_extract";
  title: string;
  details?: string;
  category: "Học tập" | "Hệ thống" | "Kiểm tra" | "Từ vựng";
  timestamp: number;
  timeFormatted?: string;
}

export interface UserAccountData {
  learnedIds: string[];
  bookmarkedIds: string[];
  customWords: VocabItem[];
  grammarProgressMap?: Record<string, UserGrammarProgress>;
  grammarCustomItems?: GrammarItem[];
}

export interface UserProfileSummary {
  id: string;
  username: string;
  pin: string;
  learnedCount: number;
  bookmarkedCount: number;
  customWordsCount: number;
  updatedAt?: any;
}

const LOCAL_ACCOUNT_KEY = "nihongo_active_user_account";
const ADMIN_SESSION_KEY = "nihongo_admin_authorized";

// Default Master Admin PINs for Trần Ngọc Tùng (Owner)
const ADMIN_MASTER_PASSCODES = ["8696", "admin8696", "tung8696", "1785497100287"];

// Generate clean account ID from username
export function generateAccountId(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
  return `acc_${clean || "user"}`;
}

// Get saved active account from localStorage
export function getStoredAccount(): UserAccount | null {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi đọc tài khoản local:", e);
  }
  return null;
}

// Save active account to localStorage
export function storeAccount(account: UserAccount | null) {
  if (!account) {
    localStorage.removeItem(LOCAL_ACCOUNT_KEY);
  } else {
    localStorage.setItem(LOCAL_ACCOUNT_KEY, JSON.stringify(account));
  }
}

// Check if currently authenticated as Admin
export function isStoredAdmin(): boolean {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

// Set Admin session
export function setAdminSession(isAuthorized: boolean) {
  if (isAuthorized) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
  } else {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

// Verify Admin Master Passcode
export function verifyAdminPasscode(inputCode: string): boolean {
  const clean = inputCode.trim().toLowerCase();
  return ADMIN_MASTER_PASSCODES.includes(clean);
}

// Register or Login user account
export async function authenticateAccount(
  usernameInput: string,
  pinInput: string,
  mode: "login" | "register"
): Promise<UserAccount> {
  const username = usernameInput.trim();
  const pin = pinInput.trim();

  if (!username) {
    throw new Error("Vui lòng nhập tên tài khoản hoặc tên của bạn.");
  }
  if (!pin || pin.length < 4) {
    throw new Error("Mã PIN hoặc mật khẩu phải từ 4 ký tự trở lên.");
  }

  const accountId = generateAccountId(username);
  const userRef = doc(db, "user_profiles", accountId);

  let existingCloudAccount: UserAccount | null = null;
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      existingCloudAccount = {
        id: accountId,
        username: data.username || username,
        pin: data.pin || "",
      };
    }
  } catch (err) {
    console.warn("Lỗi kiểm tra Cloud account, sẽ dùng mã địa phương:", err);
  }

  if (mode === "register") {
    if (existingCloudAccount) {
      if (existingCloudAccount.pin !== pin) {
        throw new Error(`Tên tài khoản "${username}" đã tồn tại trên Cloud. Vui lòng chọn tên khác hoặc nhập đúng mã PIN để đăng nhập.`);
      }
    }
    const newAccount: UserAccount = {
      id: accountId,
      username,
      pin,
    };
    try {
      await setDoc(
        userRef,
        {
          username,
          pin,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Không thể tạo Cloud doc ngay lập tức, lưu tạm local:", e);
    }
    storeAccount(newAccount);
    recordActivityLog(newAccount.id, newAccount.username, {
      action: "register",
      title: "Tạo tài khoản & Môi trường mới",
      details: `Khởi tạo không gian học cá nhân cho "${username}"`,
      category: "Hệ thống",
    });
    return newAccount;
  } else {
    // Mode login
    if (existingCloudAccount) {
      if (existingCloudAccount.pin && existingCloudAccount.pin !== pin) {
        throw new Error("Mã PIN hoặc mật khẩu không chính xác.");
      }
    }
    const loggedAccount: UserAccount = {
      id: accountId,
      username,
      pin,
    };
    storeAccount(loggedAccount);
    recordActivityLog(loggedAccount.id, loggedAccount.username, {
      action: "login",
      title: "Đăng nhập hệ thống",
      details: `Đăng nhập thành công vào không gian học của "${username}"`,
      category: "Hệ thống",
    });
    return loggedAccount;
  }
}

// Save progress for account (Cloud Firestore + LocalStorage fallback)
export async function saveUserProgress(
  account: UserAccount,
  data: Partial<UserAccountData>
) {
  const localKey = `nihongo_progress_${account.id}`;
  try {
    const raw = localStorage.getItem(localKey);
    const existing = raw ? JSON.parse(raw) : {};
    const merged = { ...existing, ...data };
    localStorage.setItem(localKey, JSON.stringify(merged));
  } catch (e) {
    console.error("Lỗi lưu cache local:", e);
  }

  try {
    const ref = doc(db, "user_profiles", account.id);
    const payload: any = {
      username: account.username,
      pin: account.pin,
      updatedAt: serverTimestamp(),
    };
    if (data.learnedIds !== undefined) payload.learnedIds = data.learnedIds;
    if (data.bookmarkedIds !== undefined) payload.bookmarkedIds = data.bookmarkedIds;
    if (data.customWords !== undefined) payload.customWords = data.customWords;
    if (data.grammarProgressMap !== undefined) payload.grammarProgressMap = data.grammarProgressMap;
    if (data.grammarCustomItems !== undefined) payload.grammarCustomItems = data.grammarCustomItems;

    await setDoc(ref, payload, { merge: true });
  } catch (err) {
    console.error("Lỗi lưu Cloud Firestore:", err);
  }
}

// Load progress for account (Cloud Firestore with LocalStorage fallback)
export async function loadUserProgress(
  account: UserAccount
): Promise<UserAccountData> {
  const localKey = `nihongo_progress_${account.id}`;
  let localData: UserAccountData | null = null;
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) localData = JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi đọc progress local:", e);
  }

  try {
    const ref = doc(db, "user_profiles", account.id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const cloud = snap.data();
      const cloudData: UserAccountData = {
        learnedIds: cloud.learnedIds || localData?.learnedIds || [],
        bookmarkedIds: cloud.bookmarkedIds || localData?.bookmarkedIds || [],
        customWords: cloud.customWords || localData?.customWords || [],
        grammarProgressMap: cloud.grammarProgressMap || localData?.grammarProgressMap || {},
        grammarCustomItems: cloud.grammarCustomItems || localData?.grammarCustomItems || [],
      };
      localStorage.setItem(localKey, JSON.stringify(cloudData));
      return cloudData;
    }
  } catch (err) {
    console.error("Lỗi đọc Cloud Firestore, sử dụng cache local:", err);
  }

  return localData || { 
    learnedIds: [], 
    bookmarkedIds: [], 
    customWords: [],
    grammarProgressMap: {},
    grammarCustomItems: []
  };
}

// Admin API: Fetch all registered student accounts from Cloud Firestore
export async function fetchAllUserAccounts(): Promise<UserProfileSummary[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "user_profiles"));
    const results: UserProfileSummary[] = [];
    querySnapshot.forEach((docSnap) => {
      const d = docSnap.data();
      results.push({
        id: docSnap.id,
        username: d.username || docSnap.id,
        pin: d.pin || "****",
        learnedCount: Array.isArray(d.learnedIds) ? d.learnedIds.length : 0,
        bookmarkedCount: Array.isArray(d.bookmarkedIds) ? d.bookmarkedIds.length : 0,
        customWordsCount: Array.isArray(d.customWords) ? d.customWords.length : 0,
        updatedAt: d.updatedAt,
      });
    });
    return results;
  } catch (e) {
    console.error("Lỗi lấy danh sách tài khoản Firestore:", e);
    throw e;
  }
}

// Admin API: Delete account from Firestore
export async function deleteUserAccount(accountId: string): Promise<void> {
  try {
    const ref = doc(db, "user_profiles", accountId);
    await deleteDoc(ref);
  } catch (e) {
    console.error("Lỗi xóa tài khoản Firestore:", e);
    throw e;
  }
}

// Activity History Logging API
export async function recordActivityLog(
  accountId: string,
  username: string,
  logData: {
    action: ActivityLog["action"];
    title: string;
    details?: string;
    category: ActivityLog["category"];
  }
): Promise<void> {
  const timestamp = Date.now();
  const timeFormatted = new Date(timestamp).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const newLog: ActivityLog = {
    id: `log_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
    accountId,
    username,
    action: logData.action,
    title: logData.title,
    details: logData.details || "",
    category: logData.category,
    timestamp,
    timeFormatted,
  };

  // Local storage cache
  const localKey = `nihongo_logs_${accountId}`;
  try {
    const raw = localStorage.getItem(localKey);
    const existing: ActivityLog[] = raw ? JSON.parse(raw) : [];
    const updated = [newLog, ...existing].slice(0, 100);
    localStorage.setItem(localKey, JSON.stringify(updated));
  } catch (e) {
    console.error("Lỗi lưu activity log local:", e);
  }

  // Cloud Firestore
  try {
    const logsRef = collection(db, "user_activity_logs");
    await addDoc(logsRef, {
      ...newLog,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Lỗi lưu activity log lên Cloud Firestore:", err);
  }
}

export async function fetchUserActivityLogs(
  targetAccountId?: string,
  maxResults: number = 100
): Promise<ActivityLog[]> {
  const logsList: ActivityLog[] = [];

  try {
    const logsRef = collection(db, "user_activity_logs");
    const querySnapshot = await getDocs(logsRef);
    querySnapshot.forEach((docSnap) => {
      const d = docSnap.data();
      if (!targetAccountId || d.accountId === targetAccountId) {
        logsList.push({
          id: docSnap.id,
          accountId: d.accountId || "unknown",
          username: d.username || "Ẩn danh",
          action: d.action || "learned",
          title: d.title || "Hoạt động",
          details: d.details || "",
          category: d.category || "Học tập",
          timestamp: typeof d.timestamp === "number" ? d.timestamp : Date.now(),
          timeFormatted: d.timeFormatted || (d.timestamp ? new Date(d.timestamp).toLocaleString("vi-VN") : "Gần đây"),
        });
      }
    });

    logsList.sort((a, b) => b.timestamp - a.timestamp);

    if (logsList.length > 0) {
      return logsList.slice(0, maxResults);
    }
  } catch (e) {
    console.warn("Lỗi tải activity logs từ Firestore, chuyển sang cache local:", e);
  }

  // Fallback to local storage if Firestore is empty or errored
  if (targetAccountId) {
    try {
      const localKey = `nihongo_logs_${targetAccountId}`;
      const raw = localStorage.getItem(localKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Lỗi đọc local activity logs:", e);
    }
  } else {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("nihongo_logs_")) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed: ActivityLog[] = JSON.parse(raw);
            logsList.push(...parsed);
          }
        }
      }
      logsList.sort((a, b) => b.timestamp - a.timestamp);
      return logsList.slice(0, maxResults);
    } catch (e) {
      console.error("Lỗi đọc tất cả local activity logs:", e);
    }
  }

  return logsList;
}

export function formatTimeAgo(timestamp?: number): string {
  if (!timestamp) return "Gần đây";
  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return "vừa xong";
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "vừa xong";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} tiếng trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ngày trước`;
  return new Date(timestamp).toLocaleDateString("vi-VN");
}

export async function clearUserActivityLogs(targetAccountId?: string): Promise<void> {
  if (targetAccountId) {
    localStorage.removeItem(`nihongo_logs_${targetAccountId}`);
  } else {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("nihongo_logs_")) {
        localStorage.removeItem(key);
      }
    }
  }

  try {
    const logsRef = collection(db, "user_activity_logs");
    const snap = await getDocs(logsRef);
    const deletePromises: Promise<void>[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      if (!targetAccountId || d.accountId === targetAccountId) {
        deletePromises.push(deleteDoc(doc(db, "user_activity_logs", docSnap.id)));
      }
    });
    await Promise.all(deletePromises);
  } catch (e) {
    console.error("Lỗi xóa activity logs trên Firestore:", e);
  }
}

// Reset data for specific account (requires password verification before execution)
export async function resetAccountData(account: UserAccount): Promise<void> {
  localStorage.removeItem(`nihongo_progress_${account.id}`);
  localStorage.removeItem(`nihongo_logs_${account.id}`);

  try {
    const ref = doc(db, "user_profiles", account.id);
    await setDoc(
      ref,
      {
        learnedIds: [],
        bookmarkedIds: [],
        customWords: [],
        grammarProgressMap: {},
        grammarCustomItems: [],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Lỗi reset dữ liệu tài khoản trên Firestore:", err);
  }
}

// Clear local guest cache data
export function resetGuestAppData(): void {
  localStorage.removeItem("nihongo_master_vocab_v1");
  localStorage.removeItem("nihongo_active_user_account");
  localStorage.removeItem("nihongo_admin_authorized");
}

