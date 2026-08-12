export interface KanjiItem {
  id: string;
  kanji: string;
  hanViet: string;
  onyomi: string[];
  kunyomi: string[];
  jlpt: "N5" | "N4" | "N3" | "N2" | "N1";
  strokes: number;
  radical: string;
  meaningVi: string;
  meaningEn: string;
  compounds: Array<{
    word: string;
    reading: string;
    meaning: string;
  }>;
  examples: Array<{
    japanese: string;
    reading: string;
    vietnamese: string;
  }>;
}

export const KANJI_DATASET: KanjiItem[] = [
  // N5 Kanji
  {
    id: "k_n5_1",
    kanji: "日",
    hanViet: "NHẬT",
    onyomi: ["ニチ", "ジツ"],
    kunyomi: ["ひ", "-び", "-か"],
    jlpt: "N5",
    strokes: 4,
    radical: "日 (Nhật - Mặt trời)",
    meaningVi: "Mặt trời, ngày, Nhật Bản",
    meaningEn: "Sun, day, Japan",
    compounds: [
      { word: "日本", reading: "にほん", meaning: "Nhật Bản" },
      { word: "日曜日", reading: "にちようび", meaning: "Chủ nhật" },
      { word: "毎日", reading: "まいにち", meaning: "Mỗi ngày" },
      { word: "休日", reading: "きゅうじつ", meaning: "Ngày nghỉ" }
    ],
    examples: [
      { japanese: "今日はいい日ですね。", reading: "きょうは いい ひですね。", vietnamese: "Hôm nay là một ngày đẹp trời nhỉ." },
      { japanese: "毎日日本語を勉強します。", reading: "まいにち にほんごを べんきょうします。", vietnamese: "Tôi học tiếng Nhật mỗi ngày." }
    ]
  },
  {
    id: "k_n5_2",
    kanji: "月",
    hanViet: "NGUYỆT",
    onyomi: ["ゲツ", "ガツ"],
    kunyomi: ["つき"],
    jlpt: "N5",
    strokes: 4,
    radical: "月 (Nguyệt - Mặt trăng)",
    meaningVi: "Mặt trăng, tháng",
    meaningEn: "Moon, month",
    compounds: [
      { word: "月曜日", reading: "げつようび", meaning: "Thứ hai" },
      { word: "今月", reading: "こんげつ", meaning: "Tháng này" },
      { word: "一月", reading: "いちがつ", meaning: "Tháng 1" },
      { word: "毎月", reading: "まいつき / まいげつ", meaning: "Mỗi tháng" }
    ],
    examples: [
      { japanese: "今月はとても忙しいです。", reading: "こんげつは とても いそがしいです。", vietnamese: "Tháng này tôi rất bận." }
    ]
  },
  {
    id: "k_n5_3",
    kanji: "水",
    hanViet: "THỦY",
    onyomi: ["スイ"],
    kunyomi: ["みず"],
    jlpt: "N5",
    strokes: 4,
    radical: "水 (Thủy - Nước)",
    meaningVi: "Nước",
    meaningEn: "Water",
    compounds: [
      { word: "水曜日", reading: "すいようび", meaning: "Thứ tư" },
      { word: "水泳", reading: "すいえい", meaning: "Bơi lội" },
      { word: "水道", reading: "すいどう", meaning: "Nước máy" }
    ],
    examples: [
      { japanese: "冷たい水を飲みます。", reading: "つめたい みずを のみます。", vietnamese: "Tôi uống nước lạnh." }
    ]
  },
  {
    id: "k_n5_4",
    kanji: "火",
    hanViet: "HỎA",
    onyomi: ["カ"],
    kunyomi: ["ひ", "-び", "ほ-"],
    jlpt: "N5",
    strokes: 4,
    radical: "火 (Hỏa - Lửa)",
    meaningVi: "Lửa",
    meaningEn: "Fire",
    compounds: [
      { word: "火曜日", reading: "かようび", meaning: "Thứ ba" },
      { word: "火山", reading: "かざん", meaning: "Núi lửa" },
      { word: "火事", reading: "かじ", meaning: "Hỏa hoạn" }
    ],
    examples: [
      { japanese: "火気厳禁です。", reading: "かき げんきんです。", vietnamese: "Cấm lửa." }
    ]
  },
  {
    id: "k_n5_5",
    kanji: "木",
    hanViet: "MỘC",
    onyomi: ["ボク", "モク"],
    kunyomi: ["き", "こ-"],
    jlpt: "N5",
    strokes: 4,
    radical: "木 (Mộc - Cây)",
    meaningVi: "Cây, gỗ",
    meaningEn: "Tree, wood",
    compounds: [
      { word: "木曜日", reading: "もくようび", meaning: "Thứ năm" },
      { word: "大木", reading: "たいぼく", meaning: "Cây cổ thụ" },
      { word: "木材", reading: "もくざい", meaning: "Gỗ xây dựng" }
    ],
    examples: [
      { japanese: "庭に大きな木があります。", reading: "にわに おおきな きが あります。", vietnamese: "Trong khu vườn có một cái cây lớn." }
    ]
  },
  {
    id: "k_n5_6",
    kanji: "金",
    hanViet: "KIM",
    onyomi: ["キン", "コン"],
    kunyomi: ["かね", "かな-"],
    jlpt: "N5",
    strokes: 8,
    radical: "金 (Kim - Kim loại)",
    meaningVi: "Vàng, tiền, kim loại",
    meaningEn: "Gold, money",
    compounds: [
      { word: "金曜日", reading: "きんようび", meaning: "Thứ sáu" },
      { word: "お金", reading: "おかね", meaning: "Tiền bạc" },
      { word: "料金", reading: "りょうきん", meaning: "Phí dịch vụ" }
    ],
    examples: [
      { japanese: "お金を節約しましょう。", reading: "おかねを せつやくしましょう。", vietnamese: "Hãy tiết kiệm tiền nào." }
    ]
  },
  {
    id: "k_n5_7",
    kanji: "土",
    hanViet: "THỔ",
    onyomi: ["ド", "ト"],
    kunyomi: ["つち"],
    jlpt: "N5",
    strokes: 3,
    radical: "土 (Thổ - Đất)",
    meaningVi: "Đất, trái đất",
    meaningEn: "Earth, soil",
    compounds: [
      { word: "土曜日", reading: "どようび", meaning: "Thứ bảy" },
      { word: "土地", reading: "とち", meaning: "Đất đai" },
      { word: "土産", reading: "みやげ", meaning: "Quà lưu niệm" }
    ],
    examples: [
      { japanese: "土曜日に買い物をします。", reading: "どようびに かいものを します。", vietnamese: "Tôi đi mua sắm vào thứ Bảy." }
    ]
  },
  {
    id: "k_n5_8",
    kanji: "人",
    hanViet: "NHÂN",
    onyomi: ["ジン", "ニン"],
    kunyomi: ["ひと"],
    jlpt: "N5",
    strokes: 2,
    radical: "人 (Nhân - Người)",
    meaningVi: "Con người",
    meaningEn: "Person, human",
    compounds: [
      { word: "日本人", reading: "にほんじん", meaning: "Người Nhật" },
      { word: "一人", reading: "ひとり", meaning: "Một người" },
      { word: "大人", reading: "おとな", meaning: "Người lớn" },
      { word: "人口", reading: "じんこう", meaning: "Dân số" }
    ],
    examples: [
      { japanese: "あの人は優しい先生です。", reading: "あの ひとは やさしい せんせいです。", vietnamese: "Người đó là một thầy giáo hiền lành." }
    ]
  },

  // N4 Kanji
  {
    id: "k_n4_1",
    kanji: "学",
    hanViet: "HỌC",
    onyomi: ["ガク"],
    kunyomi: ["まな.ぶ"],
    jlpt: "N4",
    strokes: 8,
    radical: "子 (Tử - Con)",
    meaningVi: "Học tập, nghiên cứu",
    meaningEn: "Study, learn",
    compounds: [
      { word: "学生", reading: "がくせい", meaning: "Học sinh, sinh viên" },
      { word: "学校", reading: "がっこう", meaning: "Trường học" },
      { word: "大学", reading: "だいがく", meaning: "Trường đại học" },
      { word: "学習", reading: "がくしゅう", meaning: "Học tập" }
    ],
    examples: [
      { japanese: "毎日学校で勉強します。", reading: "まいにち がっこうで べんきょうします。", vietnamese: "Mỗi ngày tôi học ở trường." }
    ]
  },
  {
    id: "k_n4_2",
    kanji: "校",
    hanViet: "HIỆU",
    onyomi: ["コウ"],
    kunyomi: [],
    jlpt: "N4",
    strokes: 10,
    radical: "木 (Mộc - Cây)",
    meaningVi: "Trường học, kiểm tra",
    meaningEn: "School",
    compounds: [
      { word: "学校", reading: "がっこう", meaning: "Trường học" },
      { word: "校長", reading: "こうちょう", meaning: "Hiệu trưởng" },
      { word: "高校", reading: "こうこう", meaning: "Trường cấp 3" }
    ],
    examples: [
      { japanese: "高校の時、サッカーをしました。", reading: "こうこうの とき、サッカーを しました。", vietnamese: "Thời cấp 3 tôi đã chơi bóng đá." }
    ]
  },
  {
    id: "k_n4_3",
    kanji: "語",
    hanViet: "NGỮ",
    onyomi: ["ゴ"],
    kunyomi: ["かた.る", "かた.らう"],
    jlpt: "N4",
    strokes: 14,
    radical: "言 (Ngôn - Lời nói)",
    meaningVi: "Ngôn ngữ, lời nói",
    meaningEn: "Language, word",
    compounds: [
      { word: "日本語", reading: "にほんご", meaning: "Tiếng Nhật" },
      { word: "単語", reading: "たんご", meaning: "Từ vựng" },
      { word: "外国語", reading: "がいこくご", meaning: "Ngoại ngữ" }
    ],
    examples: [
      { japanese: "日本語の単語を暗記する。", reading: "にほんごの たんごを あんきする。", vietnamese: "Học thuộc từ vựng tiếng Nhật." }
    ]
  },

  // N3 Kanji
  {
    id: "k_n3_1",
    kanji: "議",
    hanViet: "NIGHỊ",
    onyomi: ["ギ"],
    kunyomi: [],
    jlpt: "N3",
    strokes: 20,
    radical: "言 (Ngôn - Lời nói)",
    meaningVi: "Nghị luận, bàn bạc, hội nghị",
    meaningEn: "Deliberation, discussion",
    compounds: [
      { word: "会議", reading: "かいぎ", meaning: "Cuộc họp" },
      { word: "議員", reading: "ぎいん", meaning: "Nghị sĩ" },
      { word: "議題", reading: "ぎだい", meaning: "Chủ đề thảo luận" }
    ],
    examples: [
      { japanese: "明日大きな会議があります。", reading: "あした おおきな かいぎが あります。", vietnamese: "Ngày mai có cuộc họp lớn." }
    ]
  },
  {
    id: "k_n3_2",
    kanji: "政",
    hanViet: "CHÍNH",
    onyomi: ["セイ", "ショウ"],
    kunyomi: ["まつりごと"],
    jlpt: "N3",
    strokes: 9,
    radical: "攴 (Phộc - Đánh)",
    meaningVi: "Chính trị, chính phủ",
    meaningEn: "Politics, government",
    compounds: [
      { word: "政治", reading: "せいじ", meaning: "Chính trị" },
      { word: "政府", reading: "せいふ", meaning: "Chính phủ" },
      { word: "政策", reading: "せいさく", meaning: "Chính sách" }
    ],
    examples: [
      { japanese: "日本の政治について学ぶ。", reading: "にほんの せいじに ついて まなぶ。", vietnamese: "Học về chính trị Nhật Bản." }
    ]
  },

  // N2 Kanji
  {
    id: "k_n2_1",
    kanji: "優",
    hanViet: "ƯU",
    onyomi: ["ユウ"],
    kunyomi: ["やさ.しい", "優れる"],
    jlpt: "N2",
    strokes: 17,
    radical: "人 (Nhân - Người)",
    meaningVi: "Hiền lành, xuất sắc, ưu tú",
    meaningEn: "Kind, superior, actor",
    compounds: [
      { word: "優秀", reading: "ゆうしゅう", meaning: "Ưu tú, xuất sắc" },
      { word: "優しい", reading: "やさしい", meaning: "Hiền lành, dịu dàng" },
      { word: "優先", reading: "ゆうせん", meaning: "Ưu tiên" },
      { word: "女優", reading: "じょゆう", meaning: "Nữ diễn viên" }
    ],
    examples: [
      { japanese: "彼は優秀なエンジニアです。", reading: "かれは ゆうしゅうな えんじにあです。", vietnamese: "Anh ấy là một kỹ sư xuất sắc." }
    ]
  },
  {
    id: "k_n2_2",
    kanji: "確",
    hanViet: "XÁC",
    onyomi: ["カク"],
    kunyomi: ["たしか", "たしか.める"],
    jlpt: "N2",
    strokes: 15,
    radical: "石 (Thạch - Đá)",
    meaningVi: "Chính xác, xác nhận, vững chắc",
    meaningEn: "Certain, confirm",
    compounds: [
      { word: "確認", reading: "かくにん", meaning: "Xác nhận" },
      { word: "正確", reading: "せいかく", meaning: "Chính xác" },
      { word: "確信", reading: "かくしん", meaning: "Xác tín, tin tưởng" }
    ],
    examples: [
      { japanese: "スケジュールを確認してください。", reading: "すけじゅーるを かくにんしてください。", vietnamese: "Vui lòng xác nhận lại lịch trình." }
    ]
  },

  // N1 Kanji
  {
    id: "k_n1_1",
    kanji: "繁",
    hanViet: "PHỒN",
    onyomi: ["ハン"],
    kunyomi: ["しげ.る"],
    jlpt: "N1",
    strokes: 16,
    radical: "糸 (Mịch - Tơ)",
    meaningVi: "Phồn vinh, phồn hưng, đông đúc",
    meaningEn: "Luxuriant, busy, prosper",
    compounds: [
      { word: "繁栄", reading: "はんえい", meaning: "Phồn vinh" },
      { word: "繁華街", reading: "はんかがい", meaning: "Khu phố sầm uất" },
      { word: "繁昌", reading: "はんじょう", meaning: "Buôn bán phát đạt" }
    ],
    examples: [
      { japanese: "東京の繁華街はいつも賑やかだ。", reading: "とうきょうの はんかがいは いつも にぎやかだ。", vietnamese: "Khu phố sầm uất ở Tokyo lúc nào cũng nhộn nhịp." }
    ]
  },
  {
    id: "k_n1_2",
    kanji: "繊",
    hanViet: "TIÊM",
    onyomi: ["セン"],
    kunyomi: [],
    jlpt: "N1",
    strokes: 17,
    radical: "糸 (Mịch - Tơ)",
    meaningVi: "Mảnh mai, tinh tế, sợi tơ",
    meaningEn: "Slender, fine, delicate",
    compounds: [
      { word: "繊細", reading: "せんさい", meaning: "Tinh tế, nhạy cảm" },
      { word: "繊維", reading: "せんい", meaning: "Sợi, chất xơ" }
    ],
    examples: [
      { japanese: "彼女の感情はとても繊細だ。", reading: "かのじょの かんじょうは とても せんさいだ。", vietnamese: "Cảm xúc của cô ấy vô cùng tinh tế." }
    ]
  }
];
