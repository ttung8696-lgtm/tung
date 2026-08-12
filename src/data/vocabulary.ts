import { VocabItem } from "../types";
import { N2_VOCABULARY_LIST } from "./n2_vocabulary";
import { EXTRA_VOCABULARY_LIST } from "./extra_vocabulary";
import { MORE_VOCABULARY_LIST } from "./more_vocabulary";
import { N2_EXPANDED_PART1 } from "./n2_expanded_part1";
import { N2_EXPANDED_PART2 } from "./n2_expanded_part2";
import { USER_BATCH_1 } from "./user_batch1";
import { USER_BATCH_2 } from "./user_batch2";
import { USER_BATCH_3 } from "./user_batch3";
import { USER_BATCH_4 } from "./user_batch4";
import { USER_BATCH_5 } from "./user_batch5";
import { USER_BATCH_6 } from "./user_batch6";
import { USER_BATCH_7 } from "./user_batch7";
import { USER_BATCH_8 } from "./user_batch8";
import { USER_BATCH_9 } from "./user_batch9";
import { USER_BATCH_10 } from "./user_batch10";
import { USER_BATCH_11 } from "./user_batch11";

export function deduplicateVocabList(items: VocabItem[]): VocabItem[] {
  const seenKeys = new Set<string>();
  const seenIds = new Set<string>();
  const result: VocabItem[] = [];

  for (const item of items) {
    if (!item || !item.id) continue;
    const id = item.id;
    const kanji = (item.kanji || "").trim().toLowerCase();
    const hiragana = (item.hiragana || "").trim().toLowerCase();

    // Key representation for strict duplicate detection
    const wordKey = kanji ? `${kanji}::${hiragana}` : hiragana;

    if (!seenIds.has(id) && !seenKeys.has(wordKey)) {
      seenIds.add(id);
      seenKeys.add(wordKey);
      result.push(item);
    }
  }

  return result;
}

const RAW_VOCABULARY: VocabItem[] = [
  // --- N5 VOCABULARY ---
  {
    id: "n5-1",
    kanji: "私",
    hiragana: "わたし",
    romaji: "watashi",
    vietnamese: "Tôi, bản thân tôi",
    hanViet: "TƯ",
    type: "noun",
    jlpt: "N5",
    category: "Giao tiếp",
    example: {
      japanese: "私はベトナム人です。",
      hiragana: "わたしは ベトナムじん です。",
      vietnamese: "Tôi là người Việt Nam."
    },
    note: "Đại từ nhân xưng ngôi thứ nhất phổ biến và lịch sự nhất trong tiếng Nhật.",
    imageIcon: "User"
  },
  {
    id: "n5-2",
    kanji: "食べる",
    hiragana: "たべる",
    romaji: "taberu",
    vietnamese: "Ăn",
    hanViet: "THỰC",
    type: "verb",
    jlpt: "N5",
    category: "Ẩm thực",
    example: {
      japanese: "毎朝、パンを食べます。",
      hiragana: "まいあさ、パンを たべます。",
      vietnamese: "Mỗi sáng tôi đều ăn bánh mì."
    },
    note: "Động từ nhóm 2. Dạng lịch sự là 食べます (tabemasu).",
    imageIcon: "Utensils"
  },
  {
    id: "n5-3",
    kanji: "飲む",
    hiragana: "のむ",
    romaji: "nomu",
    vietnamese: "Uống",
    hanViet: "ẨM",
    type: "verb",
    jlpt: "N5",
    category: "Ẩm thực",
    example: {
      japanese: "温かい緑茶を飲みます。",
      hiragana: "あたたかい りょくちゃを のみます。",
      vietnamese: "Tôi uống trà xanh nóng."
    },
    note: "Động từ nhóm 1 (u-verb).",
    imageIcon: "Coffee"
  },
  {
    id: "n5-4",
    kanji: "学校",
    hiragana: "がっこう",
    romaji: "gakkou",
    vietnamese: "Trường học",
    hanViet: "HỌC GIÁO",
    type: "noun",
    jlpt: "N5",
    category: "Trường học",
    example: {
      japanese: "8時に学校へ行きます。",
      hiragana: "8じに がっこうへ いきます。",
      vietnamese: "Tôi đến trường lúc 8 giờ."
    },
    note: "Ghép bởi 學 (Học) + 校 (Giáo - ngôi trường).",
    imageIcon: "GraduationCap"
  },
  {
    id: "n5-5",
    kanji: "友達",
    hiragana: "ともだち",
    romaji: "tomodachi",
    vietnamese: "Bạn bè",
    hanViet: "HỮU ĐẠT",
    type: "noun",
    jlpt: "N5",
    category: "Giao tiếp",
    example: {
      japanese: "友達と一緒に公園へ行きました。",
      hiragana: "ともだちと いっしょに こうえんへ いきました。",
      vietnamese: "Tôi đã đi công viên cùng với bạn bè."
    },
    note: "Cách xưng呼 bạn bè thân thiết.",
    imageIcon: "Users"
  },
  {
    id: "n5-6",
    kanji: "大きい",
    hiragana: "おおきい",
    romaji: "ookii",
    vietnamese: "To, lớn",
    hanViet: "ĐẠI",
    type: "i-adj",
    jlpt: "N5",
    category: "Khác",
    example: {
      japanese: "この家はとても大きいです。",
      hiragana: "この いえは とても おおきいです。",
      vietnamese: "Ngôi nhà này rất lớn."
    },
    note: "Tính từ đuôi -i. Trái nghĩa là 小さい (chiisai - nhỏ).",
    imageIcon: "Maximize2"
  },
  {
    id: "n5-7",
    kanji: "今日",
    hiragana: "きょう",
    romaji: "kyou",
    vietnamese: "Hôm nay",
    hanViet: "KIM NHẬT",
    type: "noun",
    jlpt: "N5",
    category: "Thời gian",
    example: {
      japanese: "今日はいい天気ですね。",
      hiragana: "きょうは いい てんきですね。",
      vietnamese: "Hôm nay thời tiết đẹp nhỉ."
    },
    note: "Kim (bây giờ) + Nhật (ngày).",
    imageIcon: "Sun"
  },
  {
    id: "n5-8",
    kanji: "家族",
    hiragana: "かぞく",
    romaji: "kazoku",
    vietnamese: "Gia đình",
    hanViet: "GIA TỘC",
    type: "noun",
    jlpt: "N5",
    category: "Gia đình",
    example: {
      japanese: "私の家族は4人います。",
      hiragana: "わたしの かぞくは 4にん います。",
      vietnamese: "Gia đình tôi có 4 người."
    },
    note: "Gia (nhà) + Tộc (dòng họ).",
    imageIcon: "Home"
  },
  {
    id: "n5-9",
    kanji: "美しい",
    hiragana: "うつくしい",
    romaji: "utsukushii",
    vietnamese: "Đẹp đẽ, xinh đẹp, lộng lẫy",
    hanViet: "MỸ",
    type: "i-adj",
    jlpt: "N5",
    category: "Cảm xúc",
    example: {
      japanese: "桜の花がとても美しいです。",
      hiragana: "さくらの はなが とても うつくしいです。",
      vietnamese: "Hoa anh đào rất đẹp."
    },
    note: "Dùng miêu tả vẻ đẹp tự nhiên, nghệ thuật hoặc tâm hồn.",
    imageIcon: "Sparkles"
  },
  {
    id: "n5-10",
    kanji: "桜",
    hiragana: "さくら",
    romaji: "sakura",
    vietnamese: "Hoa anh đào",
    hanViet: "ANH",
    type: "noun",
    jlpt: "N5",
    category: "Thiên nhiên",
    example: {
      japanese: "春になると桜が咲きます。",
      hiragana: "はるに なると さくらが さきます。",
      vietnamese: "Khi mùa xuân đến hoa anh đào sẽ nở."
    },
    note: "Biểu tượng văn hóa đặc trưng của Nhật Bản.",
    imageIcon: "Flower2"
  },

  // --- N4 VOCABULARY ---
  {
    id: "n4-1",
    kanji: "約束",
    hiragana: "やくそく",
    romaji: "yakusoku",
    vietnamese: "Lời hứa, cuộc hẹn",
    hanViet: "ƯỚC THÚC",
    type: "noun",
    jlpt: "N4",
    category: "Giao tiếp",
    example: {
      japanese: "友達と約束があります。",
      hiragana: "ともだちと やくそくが あります。",
      vietnamese: "Tôi có cuộc hẹn với bạn."
    },
    note: "Ước (giao ước) + Thúc (ràng buộc). Động từ: 約束する (lập cuộc hẹn/hứa).",
    imageIcon: "CalendarCheck"
  },
  {
    id: "n4-2",
    kanji: "説明",
    hiragana: "せつめい",
    romaji: "setsumei",
    vietnamese: "Giải thích, thuyết minh",
    hanViet: "THUYẾT MINH",
    type: "noun",
    jlpt: "N4",
    category: "Công việc",
    example: {
      japanese: "先生がわかりやすく説明してくれました。",
      hiragana: "せんせいが わかりやすく せつめいして くれました。",
      vietnamese: "Thầy giáo đã giải thích rất dễ hiểu cho tôi."
    },
    note: "Thuyết (nói) + Minh (sáng tỏ).",
    imageIcon: "HelpCircle"
  },
  {
    id: "n4-3",
    kanji: "経験",
    hiragana: "けいけん",
    romaji: "keiken",
    vietnamese: "Kinh nghiệm, trải nghiệm",
    hanViet: "KINH NGHIỆM",
    type: "noun",
    jlpt: "N4",
    category: "Công việc",
    example: {
      japanese: "日本での生活はいい経験になりました。",
      hiragana: "にほんでの せいかつは いい けいけんになりました。",
      vietnamese: "Cuộc sống ở Nhật đã trở thành kinh nghiệm quý báu."
    },
    note: "Kinh (trải qua) + Nghiệm (thử nghiệm).",
    imageIcon: "Award"
  },
  {
    id: "n4-4",
    kanji: "準備",
    hiragana: "じゅんび",
    romaji: "junbi",
    vietnamese: "Chuẩn bị",
    hanViet: "CHUẨN BỊ",
    type: "noun",
    jlpt: "N4",
    category: "Công việc",
    example: {
      japanese: "旅行の準備を始めましょう。",
      hiragana: "りょこうの じゅんびを はじめましょう。",
      vietnamese: "Hãy bắt đầu chuẩn bị cho chuyến đi du lịch nào."
    },
    note: "Chuẩn (tiêu chuẩn) + Bị (sẵn sàng).",
    imageIcon: "Briefcase"
  },
  {
    id: "n4-5",
    kanji: "飛行機",
    hiragana: "ひこうき",
    romaji: "hikouki",
    vietnamese: "Máy bay",
    hanViet: "PHI HÀNH CƠ",
    type: "noun",
    jlpt: "N4",
    category: "Du lịch",
    example: {
      japanese: "飛行機で東京へ行きます。",
      hiragana: "ひこうきで とうきょうへ いきます。",
      vietnamese: "Tôi đi Tokyo bằng máy bay."
    },
    note: "Phi (bay) + Hành (di chuyển) + Cơ (máy móc).",
    imageIcon: "Plane"
  },
  {
    id: "n4-6",
    kanji: "素晴らしい",
    hiragana: "すばらしい",
    romaji: "subarashii",
    vietnamese: "Tuyệt vời, tráng lệ",
    hanViet: "TỐ HIỂU",
    type: "i-adj",
    jlpt: "N4",
    category: "Cảm xúc",
    example: {
      japanese: "富士山の景色は素晴らしいです。",
      hiragana: "ふじさんの けしきは すばらしいです。",
      vietnamese: "Phong cảnh núi Phú Sĩ thật tuyệt vời."
    },
    note: "Tính từ đuôi -i diễn tả sự khen ngợi nồng nhiệt.",
    imageIcon: "ThumbsUp"
  },

  // --- N3 VOCABULARY ---
  {
    id: "n3-1",
    kanji: "解決",
    hiragana: "かいけつ",
    romaji: "kaiketsu",
    vietnamese: "Giải quyết, tháo gỡ vấn đề",
    hanViet: "GIẢI QUYẾT",
    type: "noun",
    jlpt: "N3",
    category: "Công việc",
    example: {
      japanese: "問題を解決するために話合いましょう。",
      hiragana: "もんだいを かいけつするために はなしあいましょう。",
      vietnamese: "Hãy thảo luận để giải quyết vấn đề."
    },
    note: "Giải (cởi bỏ) + Quyết (dứt khoát). 解決する (động từ suru).",
    imageIcon: "CheckCircle2"
  },
  {
    id: "n3-2",
    kanji: "印象",
    hiragana: "いんしょう",
    romaji: "inshou",
    vietnamese: "Ấn tượng",
    hanViet: "ẤN TƯỢNG",
    type: "noun",
    jlpt: "N3",
    category: "Giao tiếp",
    example: {
      japanese: "彼女の優しい笑顔が強い印象を残しました。",
      hiragana: "かのじょの やさしい えがおが つよい いんしょうを のこしました。",
      vietnamese: "Nụ cười dịu dàng của cô ấy để lại ấn tượng mạnh mẽ."
    },
    note: "Ấn (in dấu) + Tượng (hình ảnh).",
    imageIcon: "Smile"
  },
  {
    id: "n3-3",
    kanji: "環境",
    hiragana: "かんきょう",
    romaji: "kankyou",
    vietnamese: "Môi trường",
    hanViet: "HOÀN CẢNH",
    type: "noun",
    jlpt: "N3",
    category: "Thiên nhiên",
    example: {
      japanese: "地球の環境を守ることが大切です。",
      hiragana: "ちきゅうの かんきょうを まもることが たいせつです。",
      vietnamese: "Bảo vệ môi trường Trái Đất là điều rất quan trọng."
    },
    note: "Hoàn (vòng quanh) + Cảnh (xung quanh).",
    imageIcon: "Globe"
  },
  {
    id: "n3-4",
    kanji: "成功",
    hiragana: "せいこう",
    romaji: "seikou",
    vietnamese: "Thành công",
    hanViet: "THÀNH CÔNG",
    type: "noun",
    jlpt: "N3",
    category: "Công việc",
    example: {
      japanese: "新しいプロジェクトが成功しました。",
      hiragana: "あたらしい プロジェクトが せいこうしました。",
      vietnamese: "Dự án mới đã thành công rực rỡ."
    },
    note: "Thành (hoàn thành) + Công (công sức).",
    imageIcon: "Trophy"
  },
  {
    id: "n3-5",
    kanji: "協力",
    hiragana: "きょうりょく",
    romaji: "kyouryoku",
    vietnamese: "Hợp lực, hợp tác",
    hanViet: "HIỆP LỰC",
    type: "noun",
    jlpt: "N3",
    category: "Công việc",
    example: {
      japanese: "みんなで協力して準備を進めましょう。",
      hiragana: "みんなで きょうりょくして じゅんびを すすめましょう。",
      vietnamese: "Mọi người hãy cùng hợp lực đẩy nhanh việc chuẩn bị."
    },
    note: "Hiệp (cùng chung) + Lực (sức mạnh).",
    imageIcon: "Handshake"
  },

  // --- N2 VOCABULARY ---
  {
    id: "n2-1",
    kanji: "意識",
    hiragana: "いしき",
    romaji: "ishiki",
    vietnamese: "Ý thức, nhận thức, tỉnh táo",
    hanViet: "Ý THỨC",
    type: "noun",
    jlpt: "N2",
    category: "Cảm xúc",
    example: {
      japanese: "健康に対する意識が高まっています。",
      hiragana: "けんこうに たいする いしきが たかまっています。",
      vietnamese: "Nhận thức đối với sức khỏe đang ngày càng tăng cao."
    },
    note: "Ý (suy nghĩ) + Thức (biết). 意識を失う (ngất xỉu), 意識が高い (ý thức cao).",
    imageIcon: "Brain"
  },
  {
    id: "n2-2",
    kanji: "提案",
    hiragana: "ていあん",
    romaji: "teian",
    vietnamese: "Đề xuất, phương án kiến nghị",
    hanViet: "ĐỀ ÁN",
    type: "noun",
    jlpt: "N2",
    category: "Công việc",
    example: {
      japanese: "会議で新しいマーケティング案を提案しました。",
      hiragana: "かいぎで あたらしい マーケティングあんを ていあんしました。",
      vietnamese: "Tôi đã đề xuất phương án marketing mới trong cuộc họp."
    },
    note: "Đề (đưa ra) + Án (dự thảo/phương án).",
    imageIcon: "Lightbulb"
  },
  {
    id: "n2-3",
    kanji: "柔軟",
    hiragana: "じゅうなん",
    romaji: "juunan",
    vietnamese: "Linh hoạt, mềm dẻo, ứng biến tốt",
    hanViet: "NHU NHUYỄN",
    type: "na-adj",
    jlpt: "N2",
    category: "Công việc",
    example: {
      japanese: "状況に応じて柔軟に対応することが求められます。",
      hiragana: "じょうきょうに おうじて じゅうなんに たいおうすることが もとめられます。",
      vietnamese: "Ứng biến linh hoạt tùy theo tình hình là điều được yêu cầu."
    },
    note: "Nhu (mềm mại) + Nhuyễn (dẻo dai). 柔軟な発想 (tư duy linh hoạt).",
    imageIcon: "Layers"
  },

  // --- N1 VOCABULARY ---
  {
    id: "n1-1",
    kanji: "飛躍",
    hiragana: "ひやく",
    romaji: "hiyaku",
    vietnamese: "Nhảy vọt, tiến bộ vượt bậc",
    hanViet: "PHI DƯỢC",
    type: "noun",
    jlpt: "N1",
    category: "Công việc",
    example: {
      japanese: "技術革新により経済が飛躍的に発展した。",
      hiragana: "ぎじゅつかくしんにより けいざいが ひやくてきに はってんした。",
      vietnamese: "Nhờ đổi mới công nghệ, nền kinh tế đã phát triển nhảy vọt."
    },
    note: "Phi (bay) + Dược (nhảy). 飛躍的 (mang tính nhảy vọt).",
    imageIcon: "TrendingUp"
  },
  {
    id: "n1-2",
    kanji: "吟味",
    hiragana: "ぎんみ",
    romaji: "ginmi",
    vietnamese: "Cân nhắc kỹ lưỡng, chọn lọc suy xét chu đáo",
    hanViet: "NGÂM VỊ",
    type: "noun",
    jlpt: "N1",
    category: "Công việc",
    example: {
      japanese: "厳選された素材を慎重に吟味して調理する。",
      hiragana: "げんせんされた そざいを しんちょうに ぎんみして ちょうりする。",
      vietnamese: "Xem xét chọn lọc cẩn thận các nguyên liệu đã qua tuyển chọn trước khi chế biến."
    },
    note: "Ngâm (suy ngẫm) + Vị (nếm trải/thưởng thức).",
    imageIcon: "Search"
  },
  ...N2_VOCABULARY_LIST,
  ...EXTRA_VOCABULARY_LIST,
  ...MORE_VOCABULARY_LIST,
  ...N2_EXPANDED_PART1,
  ...N2_EXPANDED_PART2,
  ...USER_BATCH_1,
  ...USER_BATCH_2,
  ...USER_BATCH_3,
  ...USER_BATCH_4,
  ...USER_BATCH_5,
  ...USER_BATCH_6,
  ...USER_BATCH_7,
  ...USER_BATCH_8,
  ...USER_BATCH_9,
  ...USER_BATCH_10,
  ...USER_BATCH_11
];

export const INITIAL_VOCABULARY: VocabItem[] = deduplicateVocabList(RAW_VOCABULARY);

export const JLPT_CATEGORIES = [
  "All",
  "Giao tiếp",
  "Ẩm thực",
  "Trường học",
  "Công việc",
  "Du lịch",
  "Cảm xúc",
  "Thiên nhiên",
  "Gia đình",
  "Văn hóa",
  "Thời gian",
  "Khác"
] as const;
