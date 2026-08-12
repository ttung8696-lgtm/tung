import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { VocabItem, GrammarItem } from "../types";
import { recordActivityLog } from "./userAccount";

export interface PendingSubmission {
  id: string;
  type: "vocab" | "grammar";
  data: VocabItem | GrammarItem;
  submittedBy: {
    id: string;
    username: string;
  };
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: number;
  timeFormatted?: string;
}

// 1. Submit a item for Admin Approval
export async function submitItemForApproval(
  item: VocabItem | GrammarItem,
  type: "vocab" | "grammar",
  user: { id: string; username: string }
): Promise<string> {
  const timestamp = Date.now();
  const timeFormatted = new Date(timestamp).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const submissionDoc: Omit<PendingSubmission, "id"> = {
    type,
    data: item,
    submittedBy: user,
    status: "pending",
    createdAt: timestamp,
    timeFormatted,
  };

  try {
    const collRef = collection(db, "pending_submissions");
    const docRef = await addDoc(collRef, {
      ...submissionDoc,
      timestampServer: serverTimestamp(),
    });

    // Record activity log for owner notification
    const itemTitle = type === "vocab" 
      ? ((item as VocabItem).kanji || (item as VocabItem).hiragana || (item as VocabItem).vietnamese) 
      : (item as GrammarItem).title;

    await recordActivityLog(user.id, user.username, {
      action: "add_word",
      title: `Gửi yêu cầu nạp ${type === "vocab" ? "Từ vựng" : "Ngữ pháp"} JLPT: "${itemTitle}"`,
      details: `Đang chờ Owner Admin (Trần Ngọc Tùng) kiểm tra và xác nhận OK để đăng tải lên app.`,
      category: "Từ vựng",
    });

    return docRef.id;
  } catch (err: any) {
    console.error("Lỗi khi gửi yêu cầu phê duyệt lên Firestore:", err);
    
    // Save to local storage cache if offline
    const localKey = "nihongo_pending_submissions_local";
    const existingRaw = localStorage.getItem(localKey);
    const existing: PendingSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
    const newLocal: PendingSubmission = {
      id: `pending_${timestamp}_${Math.random().toString(36).substring(2, 6)}`,
      ...submissionDoc,
    };
    localStorage.setItem(localKey, JSON.stringify([newLocal, ...existing]));
    return newLocal.id;
  }
}

// 2. Fetch all pending submissions for Owner Admin
export async function fetchPendingSubmissions(): Promise<PendingSubmission[]> {
  const results: PendingSubmission[] = [];

  try {
    const collRef = collection(db, "pending_submissions");
    const querySnapshot = await getDocs(collRef);
    querySnapshot.forEach((docSnap) => {
      const d = docSnap.data();
      results.push({
        id: docSnap.id,
        type: d.type || "vocab",
        data: d.data,
        submittedBy: d.submittedBy || { id: "unknown", username: "Ẩn danh" },
        status: d.status || "pending",
        rejectionReason: d.rejectionReason || "",
        createdAt: d.createdAt || Date.now(),
        timeFormatted: d.timeFormatted || "Gần đây",
      });
    });

    results.sort((a, b) => b.createdAt - a.createdAt);
    if (results.length > 0) return results;
  } catch (err) {
    console.warn("Lỗi tải pending_submissions từ Firestore, kiểm tra local cache:", err);
  }

  // Fallback to local cache
  try {
    const localKey = "nihongo_pending_submissions_local";
    const raw = localStorage.getItem(localKey);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi đọc local submissions cache:", e);
  }

  return results;
}

// 3. Approve a submission (Store in approved_global_vocab or approved_global_grammar)
export async function approveSubmission(
  submission: PendingSubmission,
  adminUsername: string = "Trần Ngọc Tùng (Owner)"
): Promise<void> {
  const isVocab = submission.type === "vocab";
  const targetCollection = isVocab ? "approved_global_vocab" : "approved_global_grammar";

  try {
    // 1. Add item to approved global collection
    const globalRef = doc(db, targetCollection, submission.data.id);
    await setDoc(globalRef, {
      ...submission.data,
      approvedAt: serverTimestamp(),
      approvedBy: adminUsername,
      submittedBy: submission.submittedBy,
    });

    // 2. Update pending submission status to 'approved'
    const pendingRef = doc(db, "pending_submissions", submission.id);
    await updateDoc(pendingRef, {
      status: "approved",
      approvedAt: serverTimestamp(),
      approvedBy: adminUsername,
    });

    // 3. Log activity
    const itemTitle = isVocab
      ? ((submission.data as VocabItem).kanji || (submission.data as VocabItem).hiragana)
      : (submission.data as GrammarItem).title;

    await recordActivityLog("owner_admin", adminUsername, {
      action: "add_word",
      title: `✅ Đã duyệt & đăng tải ${isVocab ? "Từ vựng" : "Ngữ pháp"} JLPT: "${itemTitle}"`,
      details: `Do học viên ${submission.submittedBy.username} đóng góp. Nội dung hiện đã công khai trên toàn bộ ứng dụng!`,
      category: "Từ vựng",
    });
  } catch (err: any) {
    console.error("Lỗi khi duyệt submission:", err);
    throw new Error(`Không thể phê duyệt yêu cầu: ${err.message}`);
  }
}

// 4. Reject a submission
export async function rejectSubmission(
  submissionId: string,
  reason?: string
): Promise<void> {
  try {
    const pendingRef = doc(db, "pending_submissions", submissionId);
    await updateDoc(pendingRef, {
      status: "rejected",
      rejectionReason: reason || "Nội dung chưa đạt tiêu chuẩn JLPT hoặc đã bị trùng lặp.",
      rejectedAt: serverTimestamp(),
    });
  } catch (err: any) {
    console.error("Lỗi khi từ chối submission:", err);
    throw new Error(`Không thể từ chối yêu cầu: ${err.message}`);
  }
}

// 5. Delete submission record
export async function deleteSubmissionRecord(submissionId: string): Promise<void> {
  try {
    const pendingRef = doc(db, "pending_submissions", submissionId);
    await deleteDoc(pendingRef);
  } catch (err: any) {
    console.error("Lỗi xóa record submission:", err);
    throw new Error(`Không thể xóa bản ghi: ${err.message}`);
  }
}

// 6. Fetch all approved global vocabulary items from Firestore
export async function fetchApprovedGlobalVocab(): Promise<VocabItem[]> {
  const items: VocabItem[] = [];
  try {
    const collRef = collection(db, "approved_global_vocab");
    const snap = await getDocs(collRef);
    snap.forEach((docSnap) => {
      const data = docSnap.data() as VocabItem;
      items.push({
        ...data,
        id: docSnap.id,
      });
    });
  } catch (e) {
    console.warn("Lỗi tải approved_global_vocab từ Firestore:", e);
  }
  return items;
}

// 7. Fetch all approved global grammar items from Firestore
export async function fetchApprovedGlobalGrammar(): Promise<GrammarItem[]> {
  const items: GrammarItem[] = [];
  try {
    const collRef = collection(db, "approved_global_grammar");
    const snap = await getDocs(collRef);
    snap.forEach((docSnap) => {
      const data = docSnap.data() as GrammarItem;
      items.push({
        ...data,
        id: docSnap.id,
      });
    });
  } catch (e) {
    console.warn("Lỗi tải approved_global_grammar từ Firestore:", e);
  }
  return items;
}
