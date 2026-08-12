export interface ReadingPassageData {
  titleJapanese: string;
  titleVietnamese: string;
  contentJapanese: string;
  contentVietnamese: string;
  level: string;
  topic: string;
  wordGlosses: Array<{
    word: string;
    reading: string;
    meaning: string;
    jlpt?: string;
  }>;
  comprehensionQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

export const FALLBACK_PASSAGES: ReadingPassageData[] = [
  // 1. Onsen Culture (N5)
  {
    titleJapanese: "日本の温泉文化 (温泉の楽しみ方)",
    titleVietnamese: "Văn hóa suối nước nóng Onsen Nhật Bản",
    contentJapanese: "日本にはたくさんの温泉(おんせん)があります。冬(ふゆ)になると、人々(ひとびと)は温(あたた)かい温泉に入(はい)ってリラックスします。温泉に入る前(まえ)に、体(からだ)を綺麗(きれい)に洗(あら)うのがルールです。お風呂(ふろ)からあがった後(あと)で、冷(つめ)たい牛乳(ぎゅうにゅう)を飲むととても美味しいです。",
    contentVietnamese: "Ở Nhật Bản có rất nhiều suối nước nóng. Khi mùa đông đến, mọi người ngâm mình trong suối nước nóng ấm áp để thư giãn. Quy tắc là phải tắm rửa sạch sẽ trước khi vào bồn. Sau khi bước ra khỏi bồn tắm, uống một chai sữa tươi lạnh thì rất là ngon.",
    level: "N5",
    topic: "Văn hóa tắm Onsen",
    wordGlosses: [
      { word: "温泉", reading: "おんせん", meaning: "Suối nước nóng", jlpt: "N5" },
      { word: "冬", reading: "ふゆ", meaning: "Mùa đông", jlpt: "N5" },
      { word: "リラックス", reading: "りらっくす", meaning: "Thư giãn", jlpt: "N5" },
      { word: "牛乳", reading: "ぎゅうにゅう", meaning: "Sữa bò tươi", jlpt: "N5" },
    ],
    comprehensionQuestions: [
      {
        question: "温泉に入る前に何をしなければなりませんか。(Trước khi vào Onsen phải làm gì?)",
        options: [
          "牛乳を飲む (Uống sữa)",
          "体を綺麗に洗う (Tắm rửa sạch cơ thể)",
          "服を着たまま入る (Mặc nguyên quần áo vào)",
          "ご飯を食べる (Ăn cơm)"
        ],
        correctAnswer: "体を綺麗に洗う (Tắm rửa sạch cơ thể)",
        explanation: "Quy tắc khi tắm Onsen ở Nhật là luôn tắm gội sạch sẽ cơ thể trước khi bước vào bồn chung."
      },
      {
        question: "お風呂からあがった後で何を選ぶと美味しいですか。(Sau khi tắm xong uống gì ngon?)",
        options: ["冷たい牛乳 (Sữa tươi lạnh)", "温かいお茶 (Trà nóng)", "ジュース (Nước trái cây)", "ビール (Bia)"],
        correctAnswer: "冷たい牛乳 (Sữa tươi lạnh)",
        explanation: "Truyền thống tắm Onsen ở Nhật là thưởng thức một chai sữa tươi lạnh sau khi ngâm mình."
      }
    ]
  },

  // 2. Bento Culture (N5)
  {
    titleJapanese: "手作りのお弁当 (Bento Nhật Bản)",
    titleVietnamese: "Hộp cơm Bento tự làm đậm đà tình yêu",
    contentJapanese: "日本のお弁当(べんとう)は見た目(みため)がとても綺麗(きれい)です。お母(かあ)さんは毎朝(まいあさ)、子供(こども)のために卵焼き(たまごやき)や野菜(やさい)を入(い)れたお弁当を作(つく)ります。可愛いアニメのキャラクターの形(かたち)にした「キャラ弁」も人気(にんき)があります。",
    contentVietnamese: "Cơm hộp Bento Nhật Bản có hình thức rất đẹp mắt. Mỗi buổi sáng người mẹ chuẩn bị cơm hộp gồm trứng cuộn và rau củ cho con. 'Kyaraben' - hộp cơm xếp hình nhân vật hoạt hình dễ thương cũng rất được ưa chuộng.",
    level: "N5",
    topic: "Ẩm thực & Cơm hộp Bento",
    wordGlosses: [
      { word: "お弁当", reading: "おべんとう", meaning: "Cơm hộp Bento", jlpt: "N5" },
      { word: "見た目", reading: "みため", meaning: "Vẻ bề ngoài, hình thức", jlpt: "N4" },
      { word: "卵焼き", reading: "たまごやき", meaning: "Trứng cuộn", jlpt: "N5" },
      { word: "キャラ弁", reading: "きゃらべん", meaning: "Bento xếp hình nhân vật", jlpt: "N4" },
    ],
    comprehensionQuestions: [
      {
        question: "「キャラ弁」とはどんなお弁当ですか。(Kyaraben là loại cơm hộp thế nào?)",
        options: [
          "アニメのキャラクターの形にしたお弁当 (Cơm hộp tạo hình nhân vật hoạt hình)",
          "辛いラーメンのお弁当 (Cơm hộp mì cay)",
          "夜遅くに食べるお弁当 (Cơm hộp ăn đêm)",
          "果物だけのお弁当 (Cơm hộp chỉ có hoa quả)"
        ],
        correctAnswer: "アニメのキャラクターの形にしたお弁当 (Cơm hộp tạo hình nhân vật hoạt hình)",
        explanation: "Kyaraben (Character Bento) là nghệ thuật tạo hình nhân vật hoạt hình từ đồ ăn trong cơm hộp."
      }
    ]
  },

  // 3. Hanami Season (N4)
  {
    titleJapanese: "春のお花見 (Mùa hoa anh đào)",
    titleVietnamese: "Lễ hội ngắm hoa Sakura mùa xuân",
    contentJapanese: "春(はる)になると、日本中(にほんじゅう)で桜(さくら)の花(はな)が咲(さ)きます。家族(かぞく)や友達(ともだち)と一緒に公園(こうえん)へ行(い)って、桜の木(き)の下(した)でお弁当(べんとう)を食べたり歌(うた)を歌ったりします。これを「お花見(はなみ)」と言います。夜(よる)の「夜桜(よざくら)」も幻想的(げんそうてき)で美しいです。",
    contentVietnamese: "Khi mùa xuân đến, hoa anh đào nở rộ khắp Nhật Bản. Gia đình và bạn bè cùng đến công viên, ăn cơm hộp và hát ca dưới cây hoa anh đào. Hoạt động này gọi là 'O-hanami'. 'Yozakura' - hoa anh đào ngắm vào ban đêm cũng vô cùng mộng mơ và tuyệt đẹp.",
    level: "N4",
    topic: "Mùa xuân & Hoa anh đào Hanami",
    wordGlosses: [
      { word: "桜", reading: "さくら", meaning: "Hoa anh đào", jlpt: "N5" },
      { word: "お花見", reading: "おはなみ", meaning: "Lễ hội ngắm hoa", jlpt: "N5" },
      { word: "夜桜", reading: "よざくら", meaning: "Ngắm hoa anh đào ban đêm", jlpt: "N3" },
      { word: "幻想的", reading: "げんそうてき", meaning: "Huyền ảo, mộng mơ", jlpt: "N3" },
    ],
    comprehensionQuestions: [
      {
        question: "「夜桜」とは何ですか。(Yozakura là gì?)",
        options: [
          "夜に見る桜の花 (Hoa anh đào ngắm vào ban đêm)",
          "夜に食べるお弁当 (Cơm hộp ăn đêm)",
          "春に降る雨 (Cơn mưa mùa xuân)",
          "赤い桜の花 (Hoa anh đào màu đỏ)"
        ],
        correctAnswer: "夜に見る桜の花 (Hoa anh đào ngắm vào ban đêm)",
        explanation: "Yozakura (Dạ anh đào) là trải nghiệm thưởng thức hoa anh đào dưới ánh đèn lung linh vào ban đêm."
      }
    ]
  },

  // 4. Konbini Convenience Store (N4)
  {
    titleJapanese: "便利で楽しい日本のコンビニ",
    titleVietnamese: "Cửa hàng tiện lợi Konbini kỳ diệu ở Nhật",
    contentJapanese: "日本のコンビニは24時間(じかん)開(あ)いていて、とても便利(べんり)です。美味しいおにぎりやサンドイッチを買(か)うだけでなく、公共料金(こうきょうりょうきん)の支払(しはら)いや、チケットの発行(はっこう)もできます。新(あたら)しいスイーツが毎週(まいしゅう)登場(とうじょう)するのも楽しみの一つです。",
    contentVietnamese: "Cửa hàng tiện lợi Konbini ở Nhật mở cửa 24 giờ và vô cùng tiện lợi. Không chỉ mua được cơm nắm onigiri hay bánh mì sandwich thơm ngon, bạn còn có thể thanh toán hóa đơn điện nước hay in vé sự kiện. Các món bánh ngọt tráng miệng mới ra mắt mỗi tuần cũng là một niềm vui lớn.",
    level: "N4",
    topic: "Trải nghiệm mua sắm Konbini",
    wordGlosses: [
      { word: "コンビニ", reading: "こんびに", meaning: "Cửa hàng tiện lợi", jlpt: "N5" },
      { word: "公共料金", reading: "こうきょうりょうきん", meaning: "Hóa đơn điện nước, tiền ích", jlpt: "N3" },
      { word: "スイーツ", reading: "すいーつ", meaning: "Bánh ngọt tráng miệng", jlpt: "N4" },
    ],
    comprehensionQuestions: [
      {
        question: "日本のコンビニでできることは何ですか。(Ở Konbini Nhật có thể làm gì?)",
        options: [
          "買い物のほかに支払いやチケット発行もできる (Ngoài mua sắm còn thanh toán hóa đơn và in vé)",
          "寝泊まりができる (Có thể ngủ lại qua đêm)",
          "車を買うことができる (Có thể mua xe ô tô)",
          "無料で服をもらえる (Được nhận quần áo miễn phí)"
        ],
        correctAnswer: "買い物のほかに支払いやチケット発行もできる (Ngoài mua sắm còn thanh toán hóa đơn và in vé)",
        explanation: "Konbini ở Nhật là một trung tâm dịch vụ đa năng cung cấp cả thanh toán và in vé tự động."
      }
    ]
  },

  // 5. Shinkansen Trains (N3)
  {
    titleJapanese: "新幹線と日本の鉄道技術",
    titleVietnamese: "Tàu siêu tốc Shinkansen và công nghệ đường sắt Nhật",
    contentJapanese: "新幹線(しんかんせん)は最高速度(さいこうそくど)300km/h以上(いじょう)で走(はし)る夢(ゆめ)の超特急(ちょうとっきゅう)です。驚(おどろ)くべきことに、年間(ねんかん)の平均遅延時間(へいきんちえんじかん)はわずか数十秒(すうじゅうびょう)しかありません。車内(しゃない)は清潔(せいけつ)で、駅弁(えきべん)を食べながら窓(まど)の外(そと)の景色(けしき)を楽しむ旅(たび)は最高(さいこう)です。",
    contentVietnamese: "Tàu Shinkansen là chuyến tàu siêu tốc chạy với tốc độ tối đa hơn 300 km/h. Đáng kinh ngạc là thời gian trễ trung bình mỗi năm chỉ tính bằng vài chục giây. Bên trong tàu rất sạch sẽ, vừa ăn Ekiben (cơm hộp ga tàu) vừa ngắm cảnh qua cửa sổ là trải nghiệm du lịch tuyệt vời nhất.",
    level: "N3",
    topic: "Công nghệ Tàu Shinkansen",
    wordGlosses: [
      { word: "新幹線", reading: "しんかんせん", meaning: "Tàu siêu tốc Shinkansen", jlpt: "N4" },
      { word: "遅延時間", reading: "ちえんじかん", meaning: "Thời gian trễ / muộn giờ", jlpt: "N3" },
      { word: "駅弁", reading: "えきべん", meaning: "Cơm hộp bán tại ga tàu", jlpt: "N3" },
    ],
    comprehensionQuestions: [
      {
        question: "新幹線の特徴として正しいものはどれですか。(Đặc điểm đúng của Shinkansen là gì?)",
        options: [
          "正確で遅れがほとんどない (Chính xác giờ giấc, hầu như không trễ)",
          "速度が遅い (Tốc độ rất chậm)",
          "車内が汚い (Bên trong tàu bẩn)",
          "駅弁を食べてはいけない (Không được phép ăn cơm hộp)"
        ],
        correctAnswer: "正確で遅れがほとんどない (Chính xác giờ giấc, hầu như không trễ)",
        explanation: "Shinkansen nổi tiếng thế giới nhờ sự chính xác về thời gian gần như tuyệt đối."
      }
    ]
  }
];

export function getFallbackReadingPassage(
  jlptLevel: string = "N5",
  requestedTopic: string = "Ngẫu nhiên",
  excludeTopics: string[] = []
): ReadingPassageData {
  const normalizedTopic = (requestedTopic || "").toLowerCase();

  // Try matching level and topic
  let candidates = FALLBACK_PASSAGES.filter((p) => {
    const levelMatch = p.level === jlptLevel || jlptLevel === "All";
    const notExcluded = !excludeTopics.includes(p.topic);
    return levelMatch && notExcluded;
  });

  if (candidates.length === 0) {
    candidates = FALLBACK_PASSAGES;
  }

  // Pick random passage from candidates
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  // Customize topic display if requested custom topic
  if (requestedTopic && !requestedTopic.includes("Ngẫu nhiên") && requestedTopic !== "random") {
    return {
      ...chosen,
      level: jlptLevel,
      topic: requestedTopic,
    };
  }

  return chosen;
}
