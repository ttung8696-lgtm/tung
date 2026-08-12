import { GrammarItem } from "../types";

export const N3_N2_GRAMMAR_DATA: GrammarItem[] = [
  // ==================== N3 GRAMMAR PATTERNS ====================
  {
    id: "g_n3_101",
    title: "〜うちに (Uchi ni)",
    level: "N3",
    summary: "Trong lúc còn... / Nhân lúc...",
    formula: "V-る / V-ている / V-ない / Adj-い / Adj-な + うちに",
    explanation: "Thực hiện hành động trước khi trạng thái hiện tại thay đổi, nếu để lâu thì sẽ không làm được nữa.",
    category: "Thời gian & Trật tự",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "温かいうちに、召し上がってください。",
        hiragana: "あたたかいうちに、めしあがってください。",
        romaji: "Atatakai uchi ni, meshagatte kudasai.",
        vietnamese: "Xin mời ăn nhân lúc đồ ăn còn nóng."
      },
      {
        japanese: "日本にいるうちに、富士山に登りたい。",
        hiragana: "にほんにいるうちに、ふじさんにのぼりたい。",
        romaji: "Nihon ni iru uchi ni, Fujisan ni noboritai.",
        vietnamese: "Tranh thủ trong lúc còn ở Nhật, tôi muốn leo núi Phú Sĩ."
      }
    ]
  },
  {
    id: "g_n3_102",
    title: "〜わりに（は） (Wari ni wa)",
    level: "N3",
    summary: "Dù... nhưng so với... thì lại...",
    formula: "V / Adj / N (修飾形) + わりに（は）",
    explanation: "Diễn tả sự đánh giá kết quả khác so với mức độ dự đoán thông thường từ tiêu chuẩn đó.",
    category: "So sánh & Mức độ",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "このレストランの料理は、値段のわりにおいしい。",
        hiragana: "このれすとらんのりょうりは、ねだんのわりにおいしい。",
        romaji: "Kono resutoran no ryouri wa, nedan no wari ni oishii.",
        vietnamese: "Món ăn nhà hàng này khá ngon so với mức giá của nó."
      }
    ]
  },
  {
    id: "g_n3_103",
    title: "〜くせに (Kuse ni)",
    level: "N3",
    summary: "Dù... mà lại (mang thái độ trách móc, coi thường)",
    formula: "V / Adj / N (の) + くせに",
    explanation: "Thể hiện thái độ bất bình, trách móc khi đối phương có hành vi trái ngược với tư cách hoặc sự thật.",
    category: "Trách móc & Phủ định",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "知っているくせに、教えてくれない。",
        hiragana: "しっているくせに、おしえてくれない。",
        romaji: "Shitte iru kuse ni, oshiete kurenai.",
        vietnamese: "Rõ ràng là biết mà lại không chịu nói cho tôi."
      }
    ]
  },
  {
    id: "g_n3_104",
    title: "〜として (To shite)",
    level: "N3",
    summary: "Với tư cách là... / Với vai trò là...",
    formula: "N + として（は／も／の）",
    explanation: "Nhấn mạnh tư cách, vai trò, lập trường hoặc tư vị của một người, vật hoặc tổ chức.",
    category: "Tư cách & Lập trường",
    mindMapGroup: "Quyền hạn & Quy tắc",
    examples: [
      {
        japanese: "彼は留学生として日本に来ました。",
        hiragana: "かれはりゅうがくせいとしてにほんにきました。",
        romaji: "Kare wa ryuugakusei to shite Nihon ni kimashita.",
        vietnamese: "Anh ấy đến Nhật Bản với tư cách là du học sinh."
      }
    ]
  },
  {
    id: "g_n3_105",
    title: "〜反面 (Hanmen)",
    level: "N3",
    summary: "Mặt khác... / Tuy nhiên mặt ngược lại...",
    formula: "V / Adj / N (である) + 反面",
    explanation: "Diễn tả hai mặt đối lập cùng tồn tại song song trong cùng một sự vật hoặc hiện tượng.",
    category: "So sánh & Nhượng bộ",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "一人暮らしは自由な反面、寂しいこともある。",
        hiragana: "ひとりぐらしはじゆうなはんめん、さびしいこともある。",
        romaji: "Hitorigurashi wa jiyuu na hanmen, sabishii koto mo aru.",
        vietnamese: "Sống một mình tự do nhưng mặt khác đôi lúc cũng cô đơn."
      }
    ]
  },
  {
    id: "g_n3_106",
    title: "〜っけ (Kke)",
    level: "N3",
    summary: "Có phải là... không nhỉ? (xác nhận lại ký nhớ)",
    formula: "Thể ngắn quá quá / Thể quá quá + っけ",
    explanation: "Dùng trong văn nói khi tự hỏi mình hoặc muốn xác nhận lại một thông tin mà mình quên mất.",
    category: "Xác nhận & Văn nói",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "今日の会議は何時からだっけ？",
        hiragana: "きょうのかいぎはなんじからだっけ？",
        romaji: "Kyou no kaigi wa nanji kara dakke?",
        vietnamese: "Cuộc họp hôm nay bắt đầu lúc mấy giờ ấy nhỉ?"
      }
    ]
  },
  {
    id: "g_n3_107",
    title: "〜ついでに (Tsuide ni)",
    level: "N3",
    summary: "Nhân tiện làm A thì tiện thể làm B luôn",
    formula: "V-る / V-た / N の + ついでに",
    explanation: "Lợi dụng lúc đang làm một việc chính A để thực hiện thêm việc phụ B cho đỡ tốn công.",
    category: "Cơ hội & Nhân tiện",
    mindMapGroup: "Mục đích & Động cơ",
    examples: [
      {
        japanese: "散歩のついでに、手紙を出してきた。",
        hiragana: "さんぽのついでに、てがみをだしてきた。",
        romaji: "Sanpo no tsuide ni, tegami wo dashite kita.",
        vietnamese: "Nhân tiện đi dạo tôi đã tiện tay gửi thư luôn."
      }
    ]
  },
  {
    id: "g_n3_108",
    title: "〜っ切り (Kkiri)",
    level: "N3",
    summary: "Kể từ sau khi làm... thì biệt tăm / không thấy nữa",
    formula: "V-た + っきり",
    explanation: "Sau khi một hành động xảy ra thì trạng thái đó kéo dài liên tục, không có sự thay đổi nào tiếp theo.",
    category: "Thời gian & Trạng thái",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "彼とは去年会ったっきり、連絡がない。",
        hiragana: "かれとはきょねんあったっきり、れんらくがない。",
        romaji: "Kare to wa kyonen atta kkiri, renraku ga nai.",
        vietnamese: "Kể từ lần gặp anh ấy năm ngoái thì hoàn toàn bặt tin tức."
      }
    ]
  },
  {
    id: "g_n3_109",
    title: "〜気味 (Gimi)",
    level: "N3",
    summary: "Có vẻ... / Hơi có triệu chứng...",
    formula: "V-ます (bỏ ます) / N + 気味（ぎみ）",
    explanation: "Diễn tả cảm giác có xu hướng hoặc dấu hiệu nhẹ của một trạng thái tiêu cực (cảm cúm, mệt mỏi...).",
    category: "Trạng thái & Cảm giác",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "風邪気味なので、今日は早く寝ます。",
        hiragana: "かぜぎみなので、きょうははやくねます。",
        romaji: "Kaze gimi na node, kyou wa hayaku nemasu.",
        vietnamese: "Vì hơi có triệu chứng cảm cúm nên hôm nay tôi sẽ đi ngủ sớm."
      }
    ]
  },
  {
    id: "g_n3_110",
    title: "〜がち (Gachi)",
    level: "N3",
    summary: "Thường hay... / Dễ có xu hướng... (tiêu cực)",
    formula: "V-ます (bỏ ます) / N + がち",
    explanation: "Chỉ một xu hướng, thói quen hay xảy ra ngoài ý muốn hoặc lặp đi lặp lại mang tính chất không tốt.",
    category: "Thói quen & Trạng thái",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "一人暮らしの人は、栄養が偏りがちだ。",
        hiragana: "ひとりぐらしのひとは、えいようがかたよりがちだ。",
        romaji: "Hitorigurashi no hito wa, eiyou ga katayori gachi da.",
        vietnamese: "Người sống một mình thường hay bị thiếu hụt dinh dưỡng."
      }
    ]
  },
  {
    id: "g_n3_111",
    title: "〜たて (Tate)",
    level: "N3",
    summary: "Vừa mới xong... (còn tươi, còn nóng)",
    formula: "V-ます (bỏ ます) + たて",
    explanation: "Diễn tả một sản phẩm vừa mới làm xong nên vẫn giữ nguyên sự tươi ngon, mới mẻ.",
    category: "Trạng thái & Thời gian",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "焼きたてのパンはとてもおいしい。",
        hiragana: "やきたてのぱんはとてもおいしい。",
        romaji: "Yakitate no pan wa totemo oishii.",
        vietnamese: "Bánh mì vừa mới nướng xong rất ngon."
      }
    ]
  },
  {
    id: "g_n3_112",
    title: "〜っぱなし (Ppanashi)",
    level: "N3",
    summary: "Cứ để nguyên trạng thái... (không dọn, không tắt)",
    formula: "V-ます (bỏ ます) + っぱなし",
    explanation: "Để nguyên một trạng thái đáng lẽ phải xử lý dọn dẹp, gây cảm giác phiền phức hoặc bừa bộn.",
    category: "Trạng thái & Trách móc",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "テレビをつけっぱなしで寝てしまった。",
        hiragana: "てれびをつけっぱなしでねてしまった。",
        romaji: "Terebi wo tsuke ppanashi de nete shimatta.",
        vietnamese: "Tôi đã lỡ ngủ quên trong khi vẫn để tivi bật nguyên như thế."
      }
    ]
  },
  {
    id: "g_n3_113",
    title: "〜ふりをする (Furi wo suru)",
    level: "N3",
    summary: "Giả vờ như...",
    formula: "V / Adj / N (の) + ふりをする",
    explanation: "Cố tình tạo ra vẻ ngoài giống như vậy dù thực tế bên trong hoàn toàn không phải.",
    category: "Hành vi & Thái độ",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "彼は聞こえないふりをした。",
        hiragana: "かれはきこえないふりをした。",
        romaji: "Kare wa kikoenai furi wo shita.",
        vietnamese: "Anh ấy đã giả vờ như không nghe thấy."
      }
    ]
  },
  {
    id: "g_n3_114",
    title: "〜たとたん（に） (Totan ni)",
    level: "N3",
    summary: "Vừa mới... thì ngay lập tức (bất ngờ)",
    formula: "V-た + とたんに",
    explanation: "Hành động B xảy ra ngay tức thì sau khi V-た hoàn thành ngoài dự tính của người nói.",
    category: "Thời gian & Biến đổi",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "一口食べた途端、辛くて涙が出た。",
        hiragana: "ひとくちたべたとたん、からくてなみだがでた。",
        romaji: "Hitokuchi tabeta totan, karakute namida ga deta.",
        vietnamese: "Vừa mới ăn thử một miếng thì cay quá chảy cả nước mắt."
      }
    ]
  },
  {
    id: "g_n3_115",
    title: "〜最中に (Saichuu ni)",
    level: "N3",
    summary: "Đúng lúc đang đỉnh điểm làm... thì bị cắt ngang",
    formula: "V-ている / N の + 最中に",
    explanation: "Sự việc khác bất ngờ xen ngang đúng vào thời điểm cao trào của hành động chính.",
    category: "Thời gian & Gián đoạn",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "テストの最中に、お腹が鳴ってしまった。",
        hiragana: "てすとのでさいちゅうに、おなかがなってしまった。",
        romaji: "Tesuto no saichuu ni, onaka ga natte shimatta.",
        vietnamese: "Đúng lúc đang tập trung làm bài kiểm tra thì bụng tôi reo lên."
      }
    ]
  },
  {
    id: "g_n3_116",
    title: "〜と同時に (To douji ni)",
    level: "N3",
    summary: "Đồng thời với... / Ngay cùng lúc...",
    formula: "V-る / N + と同時に",
    explanation: "Diễn tả hai sự việc cùng diễn ra đồng thời tại một thời điểm.",
    category: "Thời gian & Đồng thời",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "ベルが鳴ると同時に、生徒たちは飛び出した。",
        hiragana: "べるがなるとどうじに、せいとたちはとびだした。",
        romaji: "Beru ga naru to douji ni, seitotachi wa tobidashita.",
        vietnamese: "Đồng thời với tiếng chuông reo, các học sinh ùa chạy ra ngoài."
      }
    ]
  },
  {
    id: "g_n3_117",
    title: "〜とおり（に） (Toori ni)",
    level: "N3",
    summary: "Làm đúng theo như... / Giống như...",
    formula: "V-る / V-た / N の + とおりに",
    explanation: "Thực hiện hành động chính xác như chỉ dẫn, kế hoạch hoặc dự đoán ban đầu.",
    category: "Mô phỏng & Quy chuẩn",
    mindMapGroup: "Quyền hạn & Quy tắc",
    examples: [
      {
        japanese: "先生が教えたとおりに、書いてみてください。",
        hiragana: "せんせいがおしえたとおりに、かいてみてください。",
        romaji: "Sensei ga oshieta toori ni, kaite mite kudasai.",
        vietnamese: "Hãy thử viết đúng theo như thầy giáo đã chỉ bảo."
      }
    ]
  },
  {
    id: "g_n3_118",
    title: "〜によって / により (Ni yotte)",
    level: "N3",
    summary: "Tùy thuộc vào... / Do nguyên nhân...",
    formula: "N + によって / により",
    explanation: "Dùng để chỉ nguyên nhân, phương tiện, hoặc sự thay đổi tương ứng theo từng đối tượng.",
    category: "Nguyên nhân & Tương quan",
    mindMapGroup: "Nguyên nhân & Hậu quả",
    examples: [
      {
        japanese: "人によって、考え方が違います。",
        hiragana: "ひとによって、かんがえかたがちがいます。",
        romaji: "Hito ni yotte, kangaekata ga chigaimasu.",
        vietnamese: "Tùy thuộc vào từng người mà cách suy nghĩ khác nhau."
      }
    ]
  },
  {
    id: "g_n3_119",
    title: "〜たびに (Tabi ni)",
    level: "N3",
    summary: "Mỗi lần... thì đều...",
    formula: "V-る / N の + たびに",
    explanation: "Mỗi khi sự việc A xảy ra thì sự việc B lặp lại như một quy luật.",
    category: "Tương quan & Tần suất",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "この写真を見るたびに、故郷を思い出す。",
        hiragana: "このしゃしんをみるたびに、ふるさとをおもいだす。",
        romaji: "Kono shashin wo miru tabi ni, furusato wo omoidasu.",
        vietnamese: "Mỗi lần nhìn bức ảnh này tôi lại nhớ về quê hương."
      }
    ]
  },
  {
    id: "g_n3_123",
    title: "〜のだから / んだから (No dakara)",
    level: "N3",
    summary: "Vì lý do hiển nhiên là... nên phải...",
    formula: "V / Adj / N な + のだから",
    explanation: "Đưa ra thực tế rõ ràng để hối thúc, khuyên nhủ hoặc giải thích cho hành động của đối phương.",
    category: "Giải thích & Thuyết phục",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "もう子供じゃないんだから、自分のことは自分でしなさい。",
        hiragana: "もうこどもじゃないんだから、じぶんのことはじぶんでしなさい。",
        romaji: "Mou kodomo janai n dakara, jibun no koto wa jibun de shinasai.",
        vietnamese: "Vì đâu còn là trẻ con nữa nên việc của mình hãy tự làm lấy đi."
      }
    ]
  },
  {
    id: "g_n3_124",
    title: "〜なら（ば） (Nara ba)",
    level: "N3",
    summary: "Nếu là... thì (đưa ra gợi ý)",
    formula: "N / V thể ngắn + なら",
    explanation: "Tiếp nhận thông tin từ đối phương và đưa ra lời khuyên, nhận xét tương ứng.",
    category: "Giả định & Gợi ý",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "日本へ行くなら、京都が一番おすすめですよ。",
        hiragana: "にほんへいくなら、きょうとがいちばんおすすめですよ。",
        romaji: "Nihon e iku nara, Kyoto ga ichiban osusume desu yo.",
        vietnamese: "Nếu đi du lịch Nhật Bản thì Kyoto là nơi tôi khuyên nên đến nhất."
      }
    ]
  },
  {
    id: "g_n3_125",
    title: "〜そうにない / そうもない (Sou ni nai)",
    level: "N3",
    summary: "Khó mà... / Chắc là không thể...",
    formula: "V-ます (bỏ ます) + そうにない",
    explanation: "Dựa vào quan sát thực tế để phán đoán sự việc khó có khả năng xảy ra.",
    category: "Dự đoán & Phủ định",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "この雨は夕方までやみそうにない。",
        hiragana: "このあめはゆうがたまでやみそうにない。",
        romaji: "Kono ame wa yuugata made yami sou ni nai.",
        vietnamese: "Cơn mưa này xem chừng khó mà tạnh trước chiều tối."
      }
    ]
  },

  // ==================== N2 GRAMMAR PATTERNS ====================
  {
    id: "g_n2_101",
    title: "〜に際して / にあたって (Ni saishite / Ni atatte)",
    level: "N2",
    summary: "Khi bắt đầu... / Nhân dịp trọng đại...",
    formula: "N / V-辞書形 + に際して / にあたって",
    explanation: "Dùng trong bối cảnh trang trọng khi chuẩn bị bước vào một sự kiện quan trọng.",
    category: "Thời gian & Sự kiện",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "新事業を開始するにあたって、スタッフを募集します。",
        hiragana: "しんじぎょうをかいしするにあたって、すたっふをぼしゅうします。",
        romaji: "Shin jigyou wo kaishi suru ni atatte, sutaffu wo boshuu shimasu.",
        vietnamese: "Nhân dịp bắt đầu dự án mới, chúng tôi tiến hành tuyển dụng nhân viên."
      }
    ]
  },
  {
    id: "g_n2_102",
    title: "〜にわたって (Ni watatte)",
    level: "N2",
    summary: "Suốt / Khắp / Trên diện rộng...",
    formula: "N (Chỉ thời gian/khoảng không gian) + にわたって",
    explanation: "Diễn tả phạm vi quy mô lớn kéo dài liên tục về mặt thời gian hoặc không gian.",
    category: "Phạm vi & Mức độ",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "会議は 3 時間にわたって行われた。",
        hiragana: "かいぎはさんじかんにわたっておこなわれた。",
        romaji: "Kaigi wa san jikan ni watatte okonawareta.",
        vietnamese: "Cuộc họp đã diễn ra kéo dài suốt 3 tiếng đồng hồ."
      }
    ]
  },
  {
    id: "g_n2_103",
    title: "〜を込めて (Wo komete)",
    level: "N2",
    summary: "Với tất cả tình cảm / Gửi gắm...",
    formula: "N (Chỉ cảm xúc: 愛、心、感謝...) + を込めて",
    explanation: "Dồn hết tình cảm, sự chân thành hoặc nguyện vọng vào một hành động quà tặng/lời chúc.",
    category: "Cảm xúc & Thái độ",
    mindMapGroup: "Mục đích & Động cơ",
    examples: [
      {
        japanese: "感謝の気持ちを込めて、プレゼントを贈ります。",
        hiragana: "かんしゃのきもちをこめて、ぷれぜんとをおくります。",
        romaji: "Kansha no kimochi wo komete, purezento wo okurimasu.",
        vietnamese: "Gửi gắm tất cả lòng biết ơn, tôi xin dành tặng món quà này."
      }
    ]
  },
  {
    id: "g_n2_104",
    title: "〜をめぐって (Wo megutte)",
    level: "N2",
    summary: "Xoay quanh tranh chấp / Vấn đề...",
    formula: "N + をめぐって / をめぐる",
    explanation: "Diễn tả sự tranh luận, bất đồng ý kiến hoặc cạnh tranh xoay quanh một chủ đề nổi cộm.",
    category: "Chủ đề & Tranh luận",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "遺産相続をめぐって、親族が対立している。",
        hiragana: "いさんそうぞくをめぐって、しんぞくがたいりつしている。",
        romaji: "Isan souzoku wo megutte, shinzoku ga tairitsu shite iru.",
        vietnamese: "Xoay quanh việc thừa kế tài sản, các dòng họ đang đối đầu gay gắt."
      }
    ]
  },
  {
    id: "g_n2_105",
    title: "〜わけにはいかない (Wake ni wa ikanai)",
    level: "N2",
    summary: "Không thể làm... (vì đạo đức, trách nhiệm xã hội)",
    formula: "V-辞書形 + わけにはいかない",
    explanation: "Không thể thực hiện hành động đó vì vướng phải rào cản đạo đức, tâm lý hoặc quy tắc.",
    category: "Cấm đoán & Đạo đức",
    mindMapGroup: "Quyền hạn & Quy tắc",
    examples: [
      {
        japanese: "大事な会議があるから、休むわけにはいかない。",
        hiragana: "だいじなかいぎがあるから、やすむわけにはいかない。",
        romaji: "Daiji na kaigi ga aru kara, yasumu wake ni wa ikanai.",
        vietnamese: "Vì có cuộc họp quan trọng nên tôi không thể tự ý nghỉ được."
      }
    ]
  },
  {
    id: "g_n2_106",
    title: "〜かねない (Kanenai)",
    level: "N2",
    summary: "E rằng có thể sẽ... (dẫn tới nguy cơ xấu)",
    formula: "V-ます (bỏ ます) + かねない",
    explanation: "Cảnh báo một mối nguy hại hoặc kết quả tiêu cực hoàn toàn có khả năng xảy ra.",
    category: "Cảnh báo & Nguy cơ",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "このままでは、事故を起こしかねない。",
        hiragana: "このままでは、じこをおこしかねない。",
        romaji: "Kono mama de wa, jiko wo okoshikanenai.",
        vietnamese: "Cứ tiếp tục thế này e rằng rất dễ gây ra tai nạn."
      }
    ]
  },
  {
    id: "g_n2_107",
    title: "〜かねる (Kaneru)",
    level: "N2",
    summary: "Khó lòng mà... / Khó có thể...",
    formula: "V-ます (bỏ ます) + かねる",
    explanation: "Từ chối khéo léo trong giao tiếp kinh doanh lịch sự khi khó đáp ứng yêu cầu của khách.",
    category: "Lịch sự & Từ chối",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "そのご要望には、応じかねます。",
        hiragana: "そのごようぼうには、おうじかねます。",
        romaji: "Sono goyoubou ni wa, oujikanemasu.",
        vietnamese: "Về yêu cầu đó của quý khách, chúng tôi rất tiếc khó lòng đáp ứng được."
      }
    ]
  },
  {
    id: "g_n2_108",
    title: "〜に相違ない (Ni soui nai)",
    level: "N2",
    summary: "Chắc chắn là... không thể sai được",
    formula: "V / Adj / N (không だ) + に相違ない",
    explanation: "Khẳng định chắc chắn 100% dựa trên chứng cứ hoặc phán đoán logic vững chắc (văn viết).",
    category: "Khẳng định & Bằng chứng",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "犯人は彼に相違ない。",
        hiragana: "はんにんはかれにそういない。",
        romaji: "Hannin wa kare ni soui nai.",
        vietnamese: "Hung thủ chắc chắn là anh ta, không thể sai lệch được."
      }
    ]
  },
  {
    id: "g_n2_109",
    title: "〜っこない (Kkonai)",
    level: "N2",
    summary: "Tuyệt đối không thể nào... (văn nói)",
    formula: "V-ます (bỏ ます) + っこない",
    explanation: "Phủ định mạnh mẽ khả năng xảy ra của sự việc theo chủ quan của người nói.",
    category: "Phủ định & Khả năng",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "こんな難しい問題、分かりっこないよ。",
        hiragana: "こんなむずかしいもんだい、わかりっこないよ。",
        romaji: "Konna muzukashii mondai, wakarikkonai yo.",
        vietnamese: "Bài toán khó thế này tuyệt đối không thể nào hiểu nổi đâu."
      }
    ]
  },
  {
    id: "g_n2_110",
    title: "〜げ (Ge)",
    level: "N2",
    summary: "Có vẻ... (mang tâm trạng, vẻ mặt)",
    formula: "Adj-い (bỏ い) / Adj-な (bỏ な) + げ",
    explanation: "Diễn tả vẻ mặt hoặc thần thái lộ ra bên ngoài phản ánh tâm trạng nội tâm.",
    category: "Cảm xúc & Biểu cảm",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "彼女は寂しげに微笑んだ。",
        hiragana: "かのじょはさびしげにほほえんだ。",
        romaji: "Kanojo wa sabishige ni hohoenda.",
        vietnamese: "Cô ấy mỉm cười với vẻ mặt đượm buồn."
      }
    ]
  },
  {
    id: "g_n2_111",
    title: "〜に決まっている (Ni kimatte iru)",
    level: "N2",
    summary: "Chắc chắn là... / Nhất định là...",
    formula: "V / Adj / N (không だ) + に決まっている",
    explanation: "Thể hiện khẳng định chắc chắn 100% của người nói dựa trên cảm nhận hoặc lý do chủ quan.",
    category: "Phán đoán & Khẳng định",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "そんなの嘘に決まっている。",
        hiragana: "そんなの うそに きまっている。",
        romaji: "Sonna no uso ni kimatte iru.",
        vietnamese: "Chuyện đó chắc chắn là nói dối rồi."
      }
    ]
  },

  // --- ADDITIONAL JLPT GRAMMAR (N3 BATCH 2) ---
  {
    id: "g_n3_201",
    title: "〜うちは (Uchi wa)",
    level: "N3",
    summary: "Trong khi còn... (trạng thái duy trì)",
    formula: "V-る / V-ている / Adj-い / Adj-な / N の + うちは",
    explanation: "Diễn tả trong khoảng thời gian một trạng thái duy trì thì điều gì đó diễn ra, nhưng sau khi trạng thái đó kết thúc thì sẽ thay đổi.",
    category: "Thời gian & Trật tự",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "若いうちは、いろいろなことに挑戦したほうがいい。",
        hiragana: "わかいうちは、いろいろなことに ちょうせんしたほうがいい。",
        romaji: "Wakai uchi wa, iroiro na koto ni chousen shita hou ga ii.",
        vietnamese: "Trong khi còn trẻ, nên thử sức thách thức với nhiều điều."
      }
    ]
  },
  {
    id: "g_n3_202",
    title: "〜ようになる (You ni naru)",
    level: "N3",
    summary: "Trở nên... / Bắt đầu có thể...",
    formula: "V-辞書形 / V-可能形 / V-ない + ようになる",
    explanation: "Diễn tả sự chuyển biến trạng thái từ không thể làm sang có thể làm được hoặc phát triển thói quen mới.",
    category: "Biến đổi & Trạng thái",
    mindMapGroup: "Năng lực & Ý chí",
    examples: [
      {
        japanese: "毎日練習して、日本語が話せるようになりました。",
        hiragana: "まいにち れんしゅうして、にほんごが はなせるようになりました。",
        romaji: "Mainichi renshuu shite, nihongo ga hanaseru you ni narimashita.",
        vietnamese: "Luyện tập mỗi ngày nên tôi đã có thể nói được tiếng Nhật."
      }
    ]
  },
  {
    id: "g_n3_132",
    title: "〜ようにする (You ni suru)",
    level: "N3",
    summary: "Cố gắng... / Tạo thói quen làm...",
    formula: "V-辞書形 / V-ない + ようにする",
    explanation: "Thể hiện nỗ lực của bản thân trong việc hình thành một thói quen tích cực hoặc tránh thói quen xấu.",
    category: "Nỗ lực & Thói quen",
    mindMapGroup: "Mục đích & Động cơ",
    examples: [
      {
        japanese: "健康のために、毎日野菜を食べるようにしています。",
        hiragana: "けんこうのために、まいにち やさいを たべるようにしています。",
        romaji: "Kenkou no tame ni, mainichi yasai wo taberu you ni shite imasu.",
        vietnamese: "Vì sức khỏe, tôi luôn cố gắng ăn rau củ mỗi ngày."
      }
    ]
  },
  {
    id: "g_n3_133",
    title: "〜ようとする (You to suru)",
    level: "N3",
    summary: "Định làm... / Đang tính làm thì...",
    formula: "V-意向形 (Thẻ ý định) + とする",
    explanation: "Diễn tả khoảnh khắc chuẩn bị thực hiện hành động hoặc nỗ lực thử làm điều gì đó ngay tại thời điểm nói.",
    category: "Ý định & Thời gian",
    mindMapGroup: "Năng lực & Ý chí",
    examples: [
      {
        japanese: "出かけようとした時、雨が降り出した。",
        hiragana: "でかけようとしたとき、あめが ふりだした。",
        romaji: "Dekakeyou to shita toki, ame ga furidashita.",
        vietnamese: "Đúng lúc tôi đang định đi ra ngoài thì trời bắt đầu đổ mưa."
      }
    ]
  },
  {
    id: "g_n3_134",
    title: "〜ことになる (Koto ni naru)",
    level: "N3",
    summary: "Được quyết định... / Thành ra là...",
    formula: "V-辞書形 / V-ない + ことになる",
    explanation: "Diễn tả quy định, quyết định của tập thể hoặc kết quả mang tính khách quan mà không do ý chí cá nhân người nói quyết định.",
    category: "Quy tắc & Quyết định",
    mindMapGroup: "Quyền hạn & Quy tắc",
    examples: [
      {
        japanese: "来月から東京へ転勤することになりました。",
        hiragana: "らいげつから とうきょうへ てんきんすることになりました。",
        romaji: "Raigetsu kara Toukyou e tenkin suru koto ni narimashita.",
        vietnamese: "Đã có quyết định từ tháng sau tôi sẽ chuyển công tác sang Tokyo."
      }
    ]
  },
  {
    id: "g_n3_135",
    title: "〜ことにする (Koto ni suru)",
    level: "N3",
    summary: "Quyết định làm...",
    formula: "V-辞書形 / V-ない + ことにする",
    explanation: "Diễn tả quyết định mang tính chủ quan xuất phát từ ý chí lựa chọn của bản thân người nói.",
    category: "Quyết định & Ý chí",
    mindMapGroup: "Năng lực & Ý chí",
    examples: [
      {
        japanese: "今年 JLPT N2 を受験することにしました。",
        hiragana: "ことし JLPT N2 を じゅけんすることにしました。",
        romaji: "Kotoshi JLPT N2 wo juken suru koto ni shimashita.",
        vietnamese: "Tôi đã quyết định năm nay sẽ dự thi JLPT N2."
      }
    ]
  },
  {
    id: "g_n3_136",
    title: "〜ことがある (Koto ga aru)",
    level: "N3",
    summary: "Có lúc... / Thỉnh thoảng có khi...",
    formula: "V-辞書形 / V-ない + ことがある",
    explanation: "Diễn tả một thói quen hoặc sự việc thỉnh thoảng xảy ra không cố định.",
    category: "Tần suất & Trạng thái",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "たまに仕事が忙しくて、残業することがあります。",
        hiragana: "たまに しごとが いそがしくて、ざんぎょうすることがあります。",
        romaji: "Tamani shigoto ga isogashikute, zangyou suru koto ga arimasu.",
        vietnamese: "Đôi khi công việc bận rộn nên tôi có lúc phải làm thêm giờ."
      }
    ]
  },
  {
    id: "g_n3_137",
    title: "〜ことはない (Koto wa nai)",
    level: "N3",
    summary: "Không cần thiết phải...",
    formula: "V-辞書形 + ことはない",
    explanation: "Dùng để khuyên nhủ hoặc trấn an đối phương rằng không nhất thiết hay không đến mức phải làm như vậy.",
    category: "Khuyên nhủ & Đánh giá",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "そんなに心配することはありませんよ。大丈夫です。",
        hiragana: "そんなに しんぱいすることは ありませんよ。だいじょうぶです。",
        romaji: "Sonna ni shinpai suru koto wa arimasen yo. Daijoubu desu.",
        vietnamese: "Không cần phải lo lắng đến thế đâu. Mọi chuyện sẽ ổn thôi."
      }
    ]
  },
  {
    id: "g_n3_138",
    title: "〜ような (You na)",
    level: "N3",
    summary: "Giống như... / Như là...",
    formula: "N の / V-普通形 + ような + N",
    explanation: "Dùng để so sánh ví von hoặc đưa ra ví dụ minh họa trực quan.",
    category: "So sánh & Ví dụ",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "彼女のように優しくてきれいな人になりたい。",
        hiragana: "かのじょのように やさしくて きれいな ひとになりたい。",
        romaji: "Kanojo no you ni yasashikute kirei na hito ni naritai.",
        vietnamese: "Tôi muốn trở thành một người dịu dàng và xinh đẹp như cô ấy."
      }
    ]
  },
  {
    id: "g_n3_139",
    title: "〜みたいだ (Mitai da)",
    level: "N3",
    summary: "Trông có vẻ như... / Rất giống...",
    formula: "N / Adj / V-普通形 + みたいだ",
    explanation: "Dùng trong văn nói để phán đoán dựa trên quan sát trực quan hoặc so sánh ví von.",
    category: "Phán đoán & So sánh",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "外は雨が降っているみたいだね。",
        hiragana: "そとは あめが ふっているみたいだね。",
        romaji: "Soto wa ame ga futte iru mitai da ne.",
        vietnamese: "Bên ngoài hình như đang mưa thì phải nhỉ."
      }
    ]
  },
  {
    id: "g_n3_140",
    title: "〜らしい (Rashii)",
    level: "N3",
    summary: "Nghe nói... / Đậm chất... / Đúng kiểu...",
    formula: "N / Adj / V-普通形 + らしい",
    explanation: "Đưa ra phán đoán dựa trên tin đồn nghe được hoặc thể hiện bản chất đặc trưng tiêu biểu của đối tượng.",
    category: "Thông tin & Bản chất",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "今日は春らしい暖かい一日ですね。",
        hiragana: "きょうは はるらしい あたたかい ついたちですね。",
        romaji: "Kyou wa haru rashii atatakai一日 desu ne.",
        vietnamese: "Hôm nay đúng là một ngày ấm áp đậm chất mùa xuân."
      }
    ]
  },
  {
    id: "g_n3_141",
    title: "〜そうだ (Phỏng đoán) (Sou da)",
    level: "N3",
    summary: "Trông có vẻ sắp... / Có dáng vẻ...",
    formula: "V-ます(bỏ ます) / Adj-い(bỏ い) / Adj-な + そうだ",
    explanation: "Dựa vào cảm nhận trực quan bề ngoài để phán đoán một sự việc sắp sửa xảy ra hoặc trạng thái hiện tại.",
    category: "Dự đoán & Cảm nhận",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "今にも雨が降りそうな空模様だ。",
        hiragana: "いまにも あめが ふりそうな そらもようだ。",
        romaji: "Ima ni mo ame ga furisou na soramoyou da.",
        vietnamese: "Sắc trời trông có vẻ như sắp đổ mưa đến nơi rồi."
      }
    ]
  },
  {
    id: "g_n3_142",
    title: "〜はずだ (Hazu da)",
    level: "N3",
    summary: "Chắc chắn là... (dựa trên lý do/logic)",
    formula: "V / Adj / N (の) thể thông thường + はずだ",
    explanation: "Thể hiện niềm tin phán đoán chắc chắn của người nói dựa trên căn cứ logic hoặc kế hoạch trước đó.",
    category: "Phán đoán & Khẳng định",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "彼は毎日勉強していたから、合格するはずだ。",
        hiragana: "かれは まいにち べんきょうしていたから、ごうかくするはずだ。",
        romaji: "Kare wa mainichi benkyou shite ita kara, goukaku suru hazu da.",
        vietnamese: "Anh ấy học tập chăm chỉ mỗi ngày nên chắc chắn sẽ thi đỗ."
      }
    ]
  },
  {
    id: "g_n3_143",
    title: "〜はずがない (Hazu ga nai)",
    level: "N3",
    summary: "Không thể nào... / Làm sao mà... được",
    formula: "V / Adj / N (の) thể thông thường + はずがない",
    explanation: "Phủ định tuyệt đối khả năng xảy ra của một sự việc dựa trên chứng cứ thực tế hoặc quy luật.",
    category: "Phủ định & Phán đoán",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "真面目な彼が嘘をつくはずがない。",
        hiragana: "まじめな かれが うそをつくはずがない。",
        romaji: "Majime na kare ga uso wo tsuku hazu ga nai.",
        vietnamese: "Một người nghiêm túc như anh ấy không thể nào nói dối được."
      }
    ]
  },
  {
    id: "g_n3_144",
    title: "〜かもしれない (Kamoshirenai)",
    level: "N3",
    summary: "Có lẽ... / Có thể là...",
    formula: "V / Adj / N (không だ) + かもしれない",
    explanation: "Diễn tả khả năng xảy ra khoảng 50% theo phán đoán chừng mực của người nói.",
    category: "Phán đoán & Khả năng",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "明日は雪が降るかもしれない。",
        hiragana: "あしたは ゆきが ふるかもしれない。",
        romaji: "Ashita wa yuki ga furu kamoshirenai.",
        vietnamese: "Có lẽ ngày mai trời sẽ có tuyết rơi."
      }
    ]
  },
  {
    id: "g_n3_145",
    title: "〜わけだ (Wake da)",
    level: "N3",
    summary: "Thảo nào... / Hóa ra lý do là...",
    formula: "V / Adj / N thể thông thường + わけだ",
    explanation: "Rút ra kết luận thấu hiểu lý do nguyên nhân sau khi đã làm sáng tỏ được bản chất vấn đề.",
    category: "Giải thích & Thấu hiểu",
    mindMapGroup: "Nguyên nhân & Hậu quả",
    examples: [
      {
        japanese: "外は 35 度もある。暑いわけだ。",
        hiragana: "そとは さんじゅうごどもある。あついわけだ。",
        romaji: "Soto wa sanjuugo do mo aru. Atsui wake da.",
        vietnamese: "Bên ngoài tận 35 độ cơ à. Thảo nào mà nóng thế!"
      }
    ]
  },
  {
    id: "g_n3_146",
    title: "〜わけではない (Wake de wa nai)",
    level: "N3",
    summary: "Không hẳn là... / Không có nghĩa là...",
    formula: "V / Adj / N thể thông thường + わけではない",
    explanation: "Phủ định một phần nhận định toàn bộ, tránh gây hiểu nhầm tuyệt đối.",
    category: "Phủ định một phần",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "嫌いなわけではないが、辛い料理は苦手だ。",
        hiragana: "きらいなわけではないが、からいりょうりは にがてだ。",
        romaji: "Kirai na wake de wa nai ga, karai ryouri wa nigate da.",
        vietnamese: "Không hẳn là tôi ghét, nhưng tôi không ăn tốt đồ cay."
      }
    ]
  },
  {
    id: "g_n3_147",
    title: "〜ということだ (To iu koto da)",
    level: "N3",
    summary: "Nghe nói là... / Có nghĩa là...",
    formula: "V / Adj / N thể thông thường + ということだ",
    explanation: "Truyền đạt lại thông tin nghe được một cách chính thức hoặc tóm tắt lại ý nghĩa kết luận.",
    category: "Truyền đạt & Tóm tắt",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "ニュースによると、物価が上がるそうだ。生活が厳しくなるということだ。",
        hiragana: "にゅーすによると、ぶっかが あがるそうだ。せいかつが きびしくなるということだ。",
        romaji: "Nyuusu ni yoruto, bukka ga agaru sou da. Seikatsu ga kibishiku naru to iu koto da.",
        vietnamese: "Theo tin tức nghe nói giá cả sẽ tăng. Điều đó có nghĩa là cuộc sống sẽ khó khăn hơn."
      }
    ]
  },
  {
    id: "g_n3_148",
    title: "〜という (To iu)",
    level: "N3",
    summary: "Gọi là... / Có tên là...",
    formula: "N1 + という + N2",
    explanation: "Dùng để giới thiệu định danh tên gọi của một người, vật hoặc khái niệm chưa quen thuộc.",
    category: "Định danh & Định nghĩa",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "「サクラ」という名前の犬を飼っています。",
        hiragana: "「さくら」という なまえの いぬを かっています。",
        romaji: "'Sakura' to iu namae no inu wo katte imasu.",
        vietnamese: "Tôi đang nuôi một chú chó có tên gọi là 'Sakura'."
      }
    ]
  },
  {
    id: "g_n3_149",
    title: "〜によると (Ni yoruto)",
    level: "N3",
    summary: "Theo như... (nguồn tin/dự báo)",
    formula: "N + によると",
    explanation: "Dẫn nguồn tin cậy (dự báo thời tiết, báo chí, khảo sát) để trích dẫn sự việc phía sau.",
    category: "Trích dẫn & Nguồn tin",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "天気予報によると、午後は晴れるそうです。",
        hiragana: "てんきよほうによると、ごごは はれるそうです。",
        romaji: "Tenki yohou ni yoruto, gogo wa hareru sou desu.",
        vietnamese: "Theo dự báo thời tiết thì nghe nói chiều nay trời sẽ nắng."
      }
    ]
  },
  {
    id: "g_n3_150",
    title: "〜によれば (Ni yoreba)",
    level: "N3",
    summary: "Căn cứ theo... / Theo như...",
    formula: "N + によれば",
    explanation: "Chỉ nguồn thông tin làm căn cứ đưa ra nhận định hoặc trích dẫn phía sau (văn viết trang trọng).",
    category: "Trích dẫn & Nguồn tin",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "専門家の話によれば、この病気は予防可能だ。",
        hiragana: "せんもんかの はなしによれば、このびょうきは よぼうかのうだ。",
        romaji: "Senmonka no hanashi ni yoreba, kono byouki wa yobou kanou da.",
        vietnamese: "Theo như lời của chuyên gia thì căn bệnh này hoàn toàn có thể phòng ngừa được."
      }
    ]
  },
  {
    id: "g_n3_151",
    title: "〜に対して (Ni taishite)",
    level: "N3",
    summary: "Đối với... / Trái ngược với...",
    formula: "N + に対して / に対する + N",
    explanation: "Chỉ đối tượng hướng tới của thái độ/hành động, hoặc so sánh sự đối lập giữa 2 sự việc.",
    category: "Thái độ & So sánh đối lập",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "お客様に対して、丁寧な言葉を使いましょう。",
        hiragana: "おきゃくさまに対して、ていねいな ことばを つかいましょう。",
        romaji: "Okyakusama ni taishite, teinei na kotoba wo tsukaimashou.",
        vietnamese: "Đối với khách hàng, hãy sử dụng ngôn từ lịch sự."
      }
    ]
  },
  {
    id: "g_n3_152",
    title: "〜について (Ni tsuite)",
    level: "N3",
    summary: "Về (chủ đề / nội dung)...",
    formula: "N + について / についての + N",
    explanation: "Chỉ chủ đề, nội dung đang được suy nghĩ, thảo luận, điều tra hay trình bày.",
    category: "Chủ đề & Nội dung",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "日本の文化について勉強しています。",
        hiragana: "にほんの ぶんかについて べんきょうしています。",
        romaji: "Nihon no bunka ni tsuite benkyou shite imasu.",
        vietnamese: "Tôi đang nghiên cứu tìm hiểu về văn hóa Nhật Bản."
      }
    ]
  },
  {
    id: "g_n3_153",
    title: "〜に関して (Ni kanshite)",
    level: "N3",
    summary: "Liên quan đến... / Về vấn đề...",
    formula: "N + に関して / に関する + N",
    explanation: "Chỉ phạm vi thông tin liên quan rộng hơn so với 〜について (văn phong trang trọng hơn).",
    category: "Chủ đề & Phạm vi",
    mindMapGroup: "Thông tin & Truyền đạt",
    examples: [
      {
        japanese: "この問題に関して、ご意見があれば教えてください。",
        hiragana: "このもんだいにかんして、ごいけんがあれば おしえてください。",
        romaji: "Kono mondai ni kanshite, go-iken ga areba oshiete kudasai.",
        vietnamese: "Liên quan đến vấn đề này, nếu có ý kiến xin hãy đóng góp cho chúng tôi."
      }
    ]
  },
  {
    id: "g_n3_154",
    title: "〜に比べて (Ni kurabete)",
    level: "N3",
    summary: "So với... thì...",
    formula: "N + に比べて",
    explanation: "Dùng để đặt hai đối tượng lên bàn cân so sánh sự chênh lệch mức độ.",
    category: "So sánh mức độ",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "今年は去年に比べて、雨が多い。",
        hiragana: "ことしは きょねんにくらべて、あめがおおい。",
        romaji: "Kotoshi wa kyonen ni kurabete, ame ga ooi.",
        vietnamese: "Năm nay so với năm ngoái thì mưa nhiều hơn hẳn."
      }
    ]
  },
  {
    id: "g_n3_155",
    title: "〜としても (To shite mo)",
    level: "N3",
    summary: "Cho dù / Dù cho ngay cả khi...",
    formula: "V / Adj / N thể thông thường + としても",
    explanation: "Giả định một tình huống cho dù có xảy ra đi nữa thì quyết định hay kết quả phía sau vẫn không thay đổi.",
    category: "Giả định & Nhượng bộ",
    mindMapGroup: "Ngược đời & Nhượng bộ",
    examples: [
      {
        japanese: "たとえ失敗したとしても、後悔はしない。",
        hiragana: "たとえ しっぱいしたとしても、こうかいはしない。",
        romaji: "Tatoe shippai shita to shite mo, koukai wa shinai.",
        vietnamese: "Cho dù có thất bại đi chăng nữa thì tôi cũng không hối hận."
      }
    ]
  },
  {
    id: "g_n3_156",
    title: "〜にとって (Ni totte)",
    level: "N3",
    summary: "Đối với (góc nhìn/đánh giá cá nhân)...",
    formula: "N + にとって / にとっては / にとっても",
    explanation: "Đưa ra góc nhìn, quan điểm hay giá trị đánh giá từ vị thế của đối tượng N.",
    category: "Quan điểm & Quan niệm",
    mindMapGroup: "Đánh giá & Phán đoán",
    examples: [
      {
        japanese: "私にとって、家族が一番大切です。",
        hiragana: "わたしにとって、かぞくがいちばん たいせつです。",
        romaji: "Watashi ni totte, kazoku ga ichiban taisetsu desu.",
        vietnamese: "Đối với tôi, gia đình là điều quan trọng nhất."
      }
    ]
  },
  {
    id: "g_n3_157",
    title: "〜において (Ni oite)",
    level: "N3",
    summary: "Tại / Ở / Trong (lĩnh vực, địa điểm, thời gian)...",
    formula: "N + において / においては / においても",
    explanation: "Chỉ bối cảnh địa điểm, thời gian hay lĩnh vực hoạt động (văn viết trang trọng tương đương với で).",
    category: "Bối cảnh & Phạm vi",
    mindMapGroup: "Phạm vi & Trọng tâm",
    examples: [
      {
        japanese: "オリンピックが東京において開催された。",
        hiragana: "おりんぴっくが とうきょうにおいて かいさいされた。",
        romaji: "Orinpikku ga Toukyou ni oite kaisai sareta.",
        vietnamese: "Thế vận hội Olympic đã được tổ chức tại Tokyo."
      }
    ]
  },
  {
    id: "g_n3_158",
    title: "〜における (Ni okeru)",
    level: "N3",
    summary: "Ở / Trong / Tại (bổ nghĩa danh từ)",
    formula: "N1 + における + N2",
    explanation: "Dạng bổ nghĩa cho danh từ đứng sau của cấu trúc において.",
    category: "Bối cảnh & Định ngữ",
    mindMapGroup: "Phạm vi & Trọng tâm",
    examples: [
      {
        japanese: "現代社会における IT の役割は大きい。",
        hiragana: "げんだいしゃかいにおける IT の やくわりは おおきい。",
        romaji: "Gendai shakai ni okeru IT no yakuwari wa ookii.",
        vietnamese: "Vai trò của IT trong xã hội hiện đại là vô cùng to lớn."
      }
    ]
  },
  {
    id: "g_n3_159",
    title: "〜に応じて (Ni ouji te)",
    level: "N3",
    summary: "Tùy theo / Tương ứng với...",
    formula: "N + に応じて / に応じた + N",
    explanation: "Thực hiện hành động linh hoạt biến đổi sao cho phù hợp tương ứng với yêu cầu hay năng lực.",
    category: "Thích ứng & Tương ứng",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "体力に応じた練習をしましょう。",
        hiragana: "たいりょくにおうじた れんしゅうを しましょう。",
        romaji: "Tairyoku ni oujita renshuu wo shimashou.",
        vietnamese: "Hãy luyện tập tương ứng phù hợp với thể lực của bản thân."
      }
    ]
  },
  {
    id: "g_n3_160",
    title: "〜にしたがって (Ni shitagatte)",
    level: "N3",
    summary: "Theo... / Cùng với sự thay đổi của...",
    formula: "N / V-辞書形 + にしたがって",
    explanation: "Diễn tả A thay đổi kéo theo B biến đổi tự nhiên đồng thời.",
    category: "Biến đổi đồng thời",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "標高が高くなるにしたがって、気温が下がる。",
        hiragana: "ひょうこうが たかくなるにしたがって、きおんが さがる。",
        romaji: "Hyoukou ga takaku naru ni shitagatte, kion ga sagaru.",
        vietnamese: "Cùng với việc độ cao tăng lên, nhiệt độ sẽ giảm xuống."
      }
    ]
  },
  {
    id: "g_n3_161",
    title: "〜につれて (Ni tsurete)",
    level: "N3",
    summary: "Càng... thì càng... / Cùng với...",
    formula: "N / V-辞書形 + につれて",
    explanation: "Diễn tả quá trình A biến đổi thì B cũng chuyển biến tỉ lệ thuận theo chiều hướng tự nhiên.",
    category: "Tương quan biến đổi",
    mindMapGroup: "Tương quan & So sánh",
    examples: [
      {
        japanese: "時間が経つにつれて、記憶が薄れていく。",
        hiragana: "じかんが たつにつれて、きおくが うすれていく。",
        romaji: "Jikan ga tatsu ni tsurete, kioku ga usurete iku.",
        vietnamese: "Cùng với thời gian trôi qua, ký ức cũng dần nhạt hòa đi."
      }
    ]
  },
  {
    id: "g_n3_162",
    title: "〜たばかり (Ta bakari)",
    level: "N3",
    summary: "Vừa mới làm... xong (cảm giác chủ quan)",
    formula: "V-た + ばかり",
    explanation: "Nhấn mạnh cảm giác của người nói rằng hành động vừa mới xảy ra cách đây chưa lâu.",
    category: "Thời gian chủ quan",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "先月日本に来たばかりです。",
        hiragana: "せんげつ にほんに きたばかりです。",
        romaji: "Sengetsu Nihon ni kita bakari desu.",
        vietnamese: "Tôi mới vừa tới Nhật Bản vào tháng trước thôi."
      }
    ]
  },
  {
    id: "g_n3_163",
    title: "〜て以来 (Te irai)",
    level: "N3",
    summary: "Kể từ sau khi... cho đến nay",
    formula: "V-て + 以来",
    explanation: "Một hành động xảy ra trong quá khứ và trạng thái đó tiếp tục duy trì không đổi cho tới tận bây giờ.",
    category: "Thời gian liên tục",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "卒業して以来、彼とは一度も会っていない。",
        hiragana: "そつぎょうしていらい、かれとは いちども あっていない。",
        romaji: "Sotsugyou shite irai, kare to wa ichido mo atte inai.",
        vietnamese: "Kể từ sau khi tốt nghiệp đến nay, tôi chưa từng gặp lại anh ấy lần nào."
      }
    ]
  },
  {
    id: "g_n3_164",
    title: "〜てからでないと (Te kara denaito)",
    level: "N3",
    summary: "Nếu chưa làm A... thì không thể làm B",
    formula: "V-て + からでないと / からでなければ",
    explanation: "Nhấn mạnh điều kiện tiên quyết A bắt buộc phải hoàn thành trước thì B mới có thể tiến hành.",
    category: "Điều kiện tiên quyết",
    mindMapGroup: "Quyền hạn & Quy tắc",
    examples: [
      {
        japanese: "手を洗ってからでないと、ご飯を食べてはいけません。",
        hiragana: "てを あらってからでないと、ごはんを たべてはいけません。",
        romaji: "Te wo aratte kara denaito, gohan wo tabete wa ikemasen.",
        vietnamese: "Nếu chưa rửa tay xong thì không được ăn cơm."
      }
    ]
  },
  {
    id: "g_n3_165",
    title: "〜てしまう (Te shimau)",
    level: "N3",
    summary: "Lỡ / Trót / Hoàn thành xong hết...",
    formula: "V-て + しまう (Văn nói: 〜ちゃう / 〜じゃう)",
    explanation: "Diễn tả sự hối hận vì lỡ làm sai hoặc nhấn mạnh sự hoàn thành dốt ráo toàn bộ công việc.",
    category: "Hối tiếc & Hoàn thành",
    mindMapGroup: "Trạng thái & Kết quả",
    examples: [
      {
        japanese: "大切な資料を家に忘れてしまいました。",
        hiragana: "たいせつな しりょうを いえに わすれてしまいました。",
        romaji: "Taisetsu na shiryou wo ie ni wasurete shimaimashita.",
        vietnamese: "Tôi trót lỡ quên mất tài liệu quan trọng ở nhà rồi."
      }
    ]
  },
  {
    id: "g_n3_166",
    title: "〜ていく (Te iku)",
    level: "N3",
    summary: "Tiếp tục... (hướng tới tương lai / rời xa)",
    formula: "V-て + いく",
    explanation: "Diễn tả sự di chuyển xa dần hoặc hành động tiếp diễn từ hiện tại hướng về tương lai.",
    category: "Xu hướng tương lai",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "これからも日本語の勉強を続けていきます。",
        hiragana: "これからも にほんごの べんきょうを つづけていきます。",
        romaji: "Kore kara mo nihongo no benkyou wo tsuduzete ikimasu.",
        vietnamese: "Từ nay trở đi tôi sẽ tiếp tục duy trì việc học tiếng Nhật."
      }
    ]
  },
  {
    id: "g_n3_167",
    title: "〜てくる (Te kuru)",
    level: "N3",
    summary: "Dần dần... (từ quá khứ tới nay / tiến lại gần)",
    formula: "V-て + くる",
    explanation: "Diễn tả xu hướng thay đổi tiến triển từ quá khứ kéo dài đến hiện tại hoặc xuất hiện bất ngờ.",
    category: "Tiến trình quá khứ",
    mindMapGroup: "Trật tự thời gian (Sequence)",
    examples: [
      {
        japanese: "だんだん寒くなってきましたね。",
        hiragana: "だんだん さむくなってきましたね。",
        romaji: "Dandan samuku natte kimashita ne.",
        vietnamese: "Trời đã bắt đầu trở nên lạnh dần rồi nhỉ."
      }
    ]
  },
  {
    id: "g_n3_168",
    title: "〜てみる (Te miru)",
    level: "N3",
    summary: "Thử làm... (xem kết quả ra sao)",
    formula: "V-て + みる",
    explanation: "Thực hiện một hành động mang tính chất trải nghiệm thử nghiệm lần đầu.",
    category: "Thử nghiệm & Trải nghiệm",
    mindMapGroup: "Mục đích & Động cơ",
    examples: [
      {
        japanese: "日本の納豆を食べてみました。",
        hiragana: "にほんの なっとうを たべてみました。",
        romaji: "Nihon no nattou wo tabete mimashita.",
        vietnamese: "Tôi đã ăn thử món Natto của Nhật Bản rồi."
      }
    ]
  }
];
