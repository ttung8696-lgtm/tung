import { GrammarItem } from "../types";
import { USER_REQUESTED_100_GRAMMAR } from "./user100Grammar";
import { N3_N2_GRAMMAR_DATA } from "./grammarN3N2";
import { GRAMMAR_BATCH_51_100 } from "./grammarBatch51_100";
import { GRAMMAR_BATCH_101_150 } from "./grammarBatch101_150";
import { GRAMMAR_BATCH_151_200 } from "./grammarBatch151_200";
import { GRAMMAR_BATCH_201_250 } from "./grammarBatch201_250";
import { GRAMMAR_BATCH_251_300 } from "./grammarBatch251_300";
import { GRAMMAR_BATCH_301_350 } from "./grammarBatch301_350";

const BASE_GRAMMAR_DATA: GrammarItem[] = [
  // --- N5 GRAMMAR ---
  {
    id: "g_n5_01",
    title: "〜てから (Te kara)",
    level: "N5",
    summary: "Sau khi làm (V1) thì làm (V2)",
    formula: "Động từ thể て + から",
    explanation: "Dùng để diễn tả một hành động V2 được thực hiện ngay sau khi hành động V1 hoàn thành theo trình tự thời gian rõ ràng.",
    category: "Thời gian & Trật tự",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "手を洗ってから、ご飯を食べます。",
        hiragana: "てをあらってから、ごはんをたべます。",
        romaji: "Te wo aratte kara, gohan wo tabemasu.",
        vietnamese: "Sau khi rửa tay xong thì tôi ăn cơm."
      },
      {
        japanese: "宿題をしてから、寝ます。",
        hiragana: "しゅくだいをしてから、ねます。",
        romaji: "Shukudai wo shite kara, nemasu.",
        vietnamese: "Sau khi làm xong bài tập về nhà thì tôi đi ngủ."
      }
    ],
    comparison: {
      similarPattern: "〜たあとで (Ta ato de)",
      difference: "〜てから nhấn mạnh trình tự thời gian liên tiếp không đứt đoạn (ngay sau khi V1), còn 〜たあとで chỉ đơn thuần mô tả thời điểm sau khi V1 đã xảy ra (có thể có khoảng nghỉ)."
    }
  },
  {
    id: "g_n5_02",
    title: "〜てもいいです (Te mo ii desu)",
    level: "N5",
    summary: "Làm... cũng được / Có thể làm...",
    formula: "Động từ thể て + もいいです",
    explanation: "Dùng để cho phép hoặc xin phép ai đó thực hiện một hành động.",
    category: "Cho phép & Nghĩa vụ",
    mindMapGroup: "Quyền hạn & Quy tắc",
    examples: [
      {
        japanese: "ここで写真を撮ってもいいですか。",
        hiragana: "ここで しゃしんを とっても いいですか。",
        romaji: "Koko de shashin wo totte mo ii desu ka.",
        vietnamese: "Tôi có thể chụp ảnh ở đây được không?"
      },
      {
        japanese: "はい、入ってもいいですよ。",
        hiragana: "はい、はいっても いいですよ。",
        romaji: "Hai, hautte mo ii desu yo.",
        vietnamese: "Vâng, bạn vào đây cũng được."
      }
    ],
    comparison: {
      similarPattern: "〜てはいけません (Te wa ikemasen)",
      difference: "〜てもいいです là cho phép, còn 〜てはいけません là cấm đoán (Không được làm...)."
    }
  },
  {
    id: "g_n5_03",
    title: "〜なければなりません (Nakereba narimansen)",
    level: "N5",
    summary: "Bắt buộc phải làm...",
    formula: "V-ない (bỏ い) + ければなりません",
    explanation: "Diễn tả nghĩa vụ hoặc sự cần thiết thiết yếu phải làm một việc gì đó, không làm không được.",
    category: "Cho phép & Nghĩa vụ",
    mindMapGroup: "Quyền hạn & Quy tắc",
    examples: [
      {
        japanese: "毎日漢字を 10 個覚えなければなりません。",
        hiragana: "まいにち かんじを じゅっこ おぼえなければなりません。",
        romaji: "Mainichi kanji wo jukko oboenakereba narimansen.",
        vietnamese: "Mỗi ngày tôi phải nhớ 10 chữ Hán."
      }
    ]
  },
  {
    id: "g_n5_04",
    title: "〜まえに (Mae ni)",
    level: "N5",
    summary: "Trước khi làm...",
    formula: "V-辞書形 (Thể từ điển) / N の + まえに",
    explanation: "Diễn tả một hành động xảy ra trước một thời điểm hoặc trước một hành động khác.",
    category: "Thời gian & Trật tự",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "寝る前に、薬を飲みます。",
        hiragana: "ねるまえに、くすりをのみます。",
        romaji: "Neru mae ni, kusuri wo nomimasu.",
        vietnamese: "Trước khi đi ngủ, tôi uống thuốc."
      }
    ]
  },
  {
    id: "g_n5_05",
    title: "〜ことができます (Koto ga dekimasu)",
    level: "N5",
    summary: "Có thể làm...",
    formula: "V-辞書形 + ことができます",
    explanation: "Diễn tả năng lực, khả năng thực hiện một hành động của ai đó hoặc điều kiện cho phép.",
    category: "Khả năng & Mục đích",
    mindMapGroup: "Năng lực & Ý chí",
    examples: [
      {
        japanese: "私は日本語を話すことができます。",
        hiragana: "わたしは にほんごを はなすことが できます。",
        romaji: "Watashi wa nihongo wo hanasu koto ga dekimasu.",
        vietnamese: "Tôi có thể nói tiếng Nhật."
      }
    ]
  },

  // --- N4 GRAMMAR ---
  {
    id: "g_n4_01",
    title: "〜たあとで (Ta ato de)",
    level: "N4",
    summary: "Sau khi làm (V1) thì...",
    formula: "Động từ thể た / N の + あとで",
    explanation: "Nhấn mạnh mốc thời gian sau khi một sự việc V1 đã hoàn thành thì mới thực hiện V2.",
    category: "Thời gian & Trật tự",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "仕事が終わったあとで、飲みに行きましょう。",
        hiragana: "しごとがおわったあとで、のみにいきましょう。",
        romaji: "Shigoto ga owatta ato de, nomi ni ikimashou.",
        vietnamese: "Sau khi công việc kết thúc, chúng ta cùng đi uống nước nhé."
      }
    ],
    comparison: {
      similarPattern: "〜てから (Te kara)",
      difference: "〜たあとで có thể dùng với Danh từ (N の あとで), trong khi 〜てから bắt buộc phải đi cùng động từ thể て."
    }
  },
  {
    id: "g_n4_02",
    title: "〜ために (Tame ni)",
    level: "N4",
    summary: "Để... / Vì mục đích...",
    formula: "V-辞書形 / N の + ために",
    explanation: "Diễn tả mục đích có ý chí rõ ràng của người nói, sẵn sàng cố gắng để đạt được mục tiêu đó.",
    category: "Mục đích & Lý do",
    mindMapGroup: "Mục đích & Động cơ",
    examples: [
      {
        japanese: "日本へ留学するために、日本語を勉強しています。",
        hiragana: "にほんへ りゅうがくするために、にほんごを べんきょうしています。",
        romaji: "Nihon he ryuugaku suru tame ni, nihongo wo benkyou shite imasu.",
        vietnamese: "Tôi đang học tiếng Nhật để đi du học Nhật Bản."
      }
    ],
    comparison: {
      similarPattern: "〜ように (You ni)",
      difference: "〜ために đi với động từ thể hiện ý chí (chủ động làm để đạt được), còn 〜ように đi với động từ khả năng/không có ý chí (để sao cho, nhằm đạt trạng thái)."
    }
  },
  {
    id: "g_n4_03",
    title: "〜ように (You ni)",
    level: "N4",
    summary: "Để sao cho... / Nhằm mục đích...",
    formula: "V-辞書形 / V-ない / V-可能形 (Thể khả năng) + ように",
    explanation: "Diễn tả mục đích hướng tới một trạng thái nào đó (thường dùng với động từ khả năng hoặc thể phủ định).",
    category: "Mục đích & Lý do",
    mindMapGroup: "Mục đích & Động cơ",
    examples: [
      {
        japanese: "忘れないように、ノートに書いておきます。",
        hiragana: "わすれないように、のーとに かいておきます。",
        romaji: "Wasurenai you ni, nooto ni kaite okimasu.",
        vietnamese: "Tôi ghi sẵn vào sổ để không bị quên."
      }
    ]
  },
  {
    id: "g_n4_04",
    title: "〜そうです (Soo desu - Nghe nói)",
    level: "N4",
    summary: "Nghe nói là...",
    formula: "Thể thông thường (Trực tiếp) + そうです",
    explanation: "Dùng để truyền đạt lại thông tin nghe được từ nguồn khác mà không tự mình kiểm chứng.",
    category: "Truyền đạt & Suy đoán",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "天気予報によると、明日は雨が降るそうです。",
        hiragana: "てんきよほうによると、あしたは あめが ふるそうです。",
        romaji: "Tenki yohou ni yoruto, ashita wa ame ga furu soo desu.",
        vietnamese: "Theo dự báo thời tiết thì nghe nói ngày mai trời sẽ mưa."
      }
    ]
  },
  {
    id: "g_n4_05",
    title: "〜ば〜ほど (Ba... hodo)",
    level: "N4",
    summary: "Càng... thì càng...",
    formula: "V-ば + V-辞書形 + ほど / Adj-ければ + Adj-い + ほど",
    explanation: "Diễn tả mức độ của sự việc V2 thay đổi tương ứng theo sự gia tăng mức độ của V1.",
    category: "So sánh & Mức độ",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "日本語は勉強すればするほど、面白くなります。",
        hiragana: "にほんごは べんきょうすれば するほど、おもしろくなります。",
        romaji: "Nihongo wa benkyou sureba suru hodo, omoshiroku narimasu.",
        vietnamese: "Tiếng Nhật càng học thì càng thấy thú vị."
      }
    ]
  },

  // --- N3 GRAMMAR ---
  {
    id: "g_n3_01",
    title: "〜わけがない (Wake ga nai)",
    level: "N3",
    summary: "Tuyệt đối không thể / Làm gì có chuyện...",
    formula: "Thể thông thường + わけがない (Adj-な -> な/である, N -> の/である)",
    explanation: "Thể hiện phán đoán phủ định mang tính khẳng định tuyệt đối của người nói dựa trên căn cứ logic rõ ràng.",
    category: "Phủ định & Khẳng định",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "あんなに練習したんだから、負けるわけがない。",
        hiragana: "あんなに れんしゅうしたんだから、まけるわけがない。",
        romaji: "Anna ni renshuu shitan dakara, makeru wake ga nai.",
        vietnamese: "Đã luyện tập đến mức đó rồi thì làm gì có chuyện thua được!"
      }
    ],
    comparison: {
      similarPattern: "〜はずがない (Hazu ga nai)",
      difference: "Cả hai đều phủ định mạnh mẽ, nhưng わけがない mang tính chủ quan dựa trên lý do cá nhân, còn はずがない dựa trên quy luật khách quan tự nhiên."
    }
  },
  {
    id: "g_n3_02",
    title: "〜にもかかわらず (Ni mo kakawarazu)",
    level: "N3",
    summary: "Mặc dù... nhưng vẫn...",
    formula: "V/Adj/N thể thông thường + にもかかわらず (N / Adj-な không kèm だ)",
    explanation: "Diễn tả sự việc kết quả xảy ra trái ngược hoàn toàn với mong đợi hoặc dự đoán thông thường từ hoàn cảnh trước đó.",
    category: "Nghịch lý & Nhượng bộ",
    mindMapGroup: "Ngược đời & Nhượng bộ",
    examples: [
      {
        japanese: "大雨にもかかわらず、多くの人がコンサートに来た。",
        hiragana: "おおあめにもかかわらず、おおくのひとが こんさーとに きた。",
        romaji: "Ooame ni mo kakawarazu, ooku no hito ga konsaato ni kita.",
        vietnamese: "Bất chấp trời mưa lớn, rất nhiều người vẫn đến dự buổi hòa nhạc."
      }
    ]
  },
  {
    id: "g_n3_03",
    title: "〜おかげで (Okage de)",
    level: "N3",
    summary: "Nhờ có... (kết quả tốt)",
    formula: "V/Adj/N thể ngắn + おかげで (N の / Adj-な な)",
    explanation: "Dùng để bày tỏ sự biết ơn đối với lý do/sự việc đã đem lại kết quả tích cực, may mắn.",
    category: "Nguyên nhân & Lý do",
    mindMapGroup: "Nguyên nhân & Hậu quả",
    examples: [
      {
        japanese: "先生のおかげで、JLPT N3に合格できました。",
        hiragana: "せんせいのおかげで、JLPT N3に ごうかくできました。",
        romaji: "Sensei no okage de, JLPT N3 ni goukaku dekimashita.",
        vietnamese: "Nhờ có thầy cô giúp đỡ, em đã đỗ kỳ thi JLPT N3."
      }
    ],
    comparison: {
      similarPattern: "〜せいで (Sei de)",
      difference: "おかげで dùng cho kết quả tốt (nhờ có), còn せいで dùng cho kết quả xấu/trách móc (tại vì, do xui xẻo)."
    }
  },
  {
    id: "g_n3_04",
    title: "〜せいで (Sei de)",
    level: "N3",
    summary: "Tại vì... / Do... (kết quả xấu)",
    formula: "V/Adj/N thể ngắn + せいで (N の / Adj-な な)",
    explanation: "Chỉ nguyên nhân dẫn đến kết quả không mong muốn, mang thái độ đổ lỗi, trách móc hoặc tiếc nuối.",
    category: "Nguyên nhân & Lý do",
    mindMapGroup: "Nguyên nhân & Hậu quả",
    examples: [
      {
        japanese: "台風のせいで、飛行機が遅れました。",
        hiragana: "たいふうのせいで、ひこうきが おくれました。",
        romaji: "Taifuu no sei de, hikouki ga okuremashita.",
        vietnamese: "Do ảnh hưởng của bão nên máy bay đã bị trễ chuyến."
      }
    ]
  },
  {
    id: "g_n3_05",
    title: "〜た途端に (Ta totan ni)",
    level: "N3",
    summary: "Ngay sau khi... thì bất ngờ...",
    formula: "Động từ thể た + 途端に (とたんに)",
    explanation: "Diễn tả hành động V2 xảy ra ngay lập tức sau V1, thường là sự việc bất ngờ ngoài dự tính.",
    category: "Thời gian & Trật tự",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "窓を開けた途端に、強い風が入ってきた。",
        hiragana: "まどをあけたとたんに、つよいかぜが はいってきた。",
        romaji: "Mado wo aketa totan ni, tsuyoi kaze ga hairikita.",
        vietnamese: "Vừa mới mở cửa sổ ra một cái thì gió mạnh lùa ngay vào."
      }
    ]
  },

  // --- N2 GRAMMAR ---
  {
    id: "g_n2_01",
    title: "〜にともなって (Ni tomonatte)",
    level: "N2",
    summary: "Cùng với việc... kéo theo...",
    formula: "V-辞書形 / N + にともなって / にともない",
    explanation: "Diễn tả sự thay đổi của A kéo theo sự thay đổi tương ứng của B (thường dùng trong văn viết, báo chí).",
    category: "Tương quan & Biến đổi",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "人口の減少に伴って、労働力が不足している。",
        hiragana: "じんこうのげんしょうにともなって、ろうどうりょくが ふそくしている。",
        romaji: "Jinkou no genshou ni tomonatte, roudouryoku ga fusoku shite iru.",
        vietnamese: "Cùng với sự suy giảm dân số, lực lượng lao động đang bị thiếu hụt."
      }
    ]
  },
  {
    id: "g_n2_02",
    title: "〜を契機に (Wo keiki ni)",
    level: "N2",
    summary: "Nhân cơ hội... / Lấy mốc...",
    formula: "N / V-たの + を契機に（して） / を契機として",
    explanation: "Chỉ một sự kiện quan trọng làm bước ngoặt khơi mào cho sự thay đổi lớn phía sau.",
    category: "Thời gian & Bước ngoặt",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "結婚を契機に、タバコをやめました。",
        hiragana: "けっこんをけいきに、たばこをやめました。",
        romaji: "Kekkon wo keiki ni, tabako wo yamemashita.",
        vietnamese: "Lấy mốc kết hôn làm bước ngoặt, tôi đã quyết định bỏ thuốc lá."
      }
    ]
  },
  {
    id: "g_n2_03",
    title: "〜ざるを得ない (Zaru wo enai)",
    level: "N2",
    summary: "Đành phải / Đành lòng phải...",
    formula: "V-ない (bỏ ない) + ざるを得ない (Suru -> せざるを得ない)",
    explanation: "Mặc dù không hề muốn, nhưng vì tình thế bắt buộc nên đành phải thực hiện hành động đó.",
    category: "Cưỡng chế & Bắt buộc",
    mindMapGroup: "Quyền hạn & Quy tắc",
    examples: [
      {
        japanese: "台風が近づいているので、旅行を中止せざるを得ない。",
        hiragana: "たいふうが ちかづいているので、りょこうを ちゅうしせざるをえない。",
        romaji: "Taifuu ga chikadzuite iru node, ryokou wo chuushi sezaru wo enai.",
        vietnamese: "Vì bão đang tiến gần nên đành phải hủy chuyến đi du lịch."
      }
    ]
  },

  // --- N1 GRAMMAR ---
  {
    id: "g_n1_01",
    title: "〜を余儀なくされる (Wo yoginaku sareru)",
    level: "N1",
    summary: "Rơi vào thế buộc phải...",
    formula: "N + を余儀なくされる / を余儀なくさせる",
    explanation: "Do tình thế hoặc sự cố nghiêm trọng đẩy tới, buộc phải thay đổi kế hoạch hoặc gánh chịu hậu quả.",
    category: "Cưỡng chế & Khách quan",
    mindMapGroup: "Quyền hạn & Quy tắc",
    examples: [
      {
        japanese: "資金不足のため、計画の変更を余儀なくされた。",
        hiragana: "しきんふそくのため、けいかくのへんこうを よぎなくされた。",
        romaji: "Shikin fusoku no tame, keikaku no henkou wo yoginaku sareda.",
        vietnamese: "Do thiếu hụt nguồn vốn, dự án buộc lòng phải thay đổi kế hoạch."
      }
    ]
  },
  {
    id: "g_n1_02",
    title: "〜極まる / 極まりない (Kiwamaru / Kiwamarimai)",
    level: "N1",
    summary: "Cực kỳ... / Tột cùng...",
    formula: "Na-adj (bỏ な) + 極まる / 極まりない",
    explanation: "Nhấn mạnh trạng thái đạt đến mức cực hạn, đỉnh điểm (thường mang thái độ tiêu cực hoặc lên án).",
    category: "Mức độ & Cảm xúc",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "彼の失礼極まる態度に、誰もが怒りを覚えた。",
        hiragana: "かれの しつれいきわまる たいどに、だれもが いかりをおぼえた。",
        romaji: "Kare no shitsurei kiwamaru taido ni, daremo ga ikari wo oboeta.",
        vietnamese: "Thái độ vô cùng bất lịch sự của anh ta khiến ai nấy đều phẫn nộ."
      }
    ]
  },
  {
    id: "g_n1_03",
    title: "〜たるもの (Taru mono)",
    level: "N1",
    summary: "Xứng danh là... / Đã là... thì phải...",
    formula: "N (Chỉ danh vị/thành phần) + たるもの",
    explanation: "Nhấn mạnh tinh thần trách nhiệm, tư cách hoặc tác phong cần có của một người giữ chức vị hay địa vị đó.",
    category: "Tư cách & Nghĩa vụ",
    mindMapGroup: "Quyền hạn & Quy tắc",
    examples: [
      {
        japanese: "指導者たるものは、常に謙虚でなければならない。",
        hiragana: "しどうしゃたるものは、つねに けんきょでなければならない。",
        romaji: "Shidousha taru mono wa, tsune ni kenkyo de nakereba naranai.",
        vietnamese: "Đã xứng danh là người lãnh đạo thì lúc nào cũng phải khiêm tốn."
      }
    ]
  },
  {
    id: "g_n1_04",
    title: "〜を皮切りに (Wo kawakiri ni)",
    level: "N1",
    summary: "Mở đầu bằng... rồi liên tiếp...",
    formula: "N + を皮切りに（して） / を皮切りとして",
    explanation: "Chỉ sự việc mở đầu cho một chuỗi sự kiện tương tự bùng nổ diễn ra liên tiếp sau đó.",
    category: "Thời gian & Trật tự",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "東京公演を皮切りに、全国ツアーが始まった。",
        hiragana: "とうきょうこうえんをかわきりに、ぜんこくつあーが はじまった。",
        romaji: "Toukyou kouen wo kawakiri ni, zenkoku tsuaa ga hajimatta.",
        vietnamese: "Khởi đầu bằng đêm diễn tại Tokyo, chuyến lưu diễn toàn quốc đã bùng nổ bắt đầu."
      }
    ]
  }
];

export const INITIAL_GRAMMAR_DATA: GrammarItem[] = [
  ...USER_REQUESTED_100_GRAMMAR,
  ...BASE_GRAMMAR_DATA,
  ...N3_N2_GRAMMAR_DATA,
  ...GRAMMAR_BATCH_51_100,
  ...GRAMMAR_BATCH_101_150,
  ...GRAMMAR_BATCH_151_200,
  ...GRAMMAR_BATCH_201_250,
  ...GRAMMAR_BATCH_251_300,
  ...GRAMMAR_BATCH_301_350
];
