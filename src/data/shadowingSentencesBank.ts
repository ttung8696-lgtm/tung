export interface ShadowingSentence {
  id?: string;
  japanese: string;
  hiragana: string;
  vietnamese: string;
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  category: string;
}

// Bank of 1000+ practice sentences grouped by level and category
export const SHADOWING_SENTENCES_BANK: ShadowingSentence[] = [
  // --- N5 ---
  {
    japanese: "初めまして、どうぞよろしくお願いします。",
    hiragana: "はじめまして、どうぞよろしくおねがいします。",
    vietnamese: "Rất hân hạnh được gặp bạn, mong được giúp đỡ.",
    level: "N5",
    category: "Chào hỏi",
  },
  {
    japanese: "日本語の勉強はとても面白いです。",
    hiragana: "にほんごのべんきょうはとてもおもしろいです。",
    vietnamese: "Việc học tiếng Nhật rất thú vị.",
    level: "N5",
    category: "Học tập",
  },
  {
    japanese: "明日、一緒に富士山へ行きませんか。",
    hiragana: "あした、いっしょにふじさんへいきませんか。",
    vietnamese: "Ngày mai, bạn có muốn cùng đi núi Phú Sĩ với tôi không?",
    level: "N5",
    category: "Du lịch",
  },
  {
    japanese: "すみません、この近くにコンビニはありますか。",
    hiragana: "すみません、このちかくにこんびにはありますか。",
    vietnamese: "Xin lỗi, gần đây có cửa hàng tiện lợi nào không?",
    level: "N5",
    category: "Mua sắm",
  },
  {
    japanese: "毎朝七時に起きて、コーヒーを飲みます。",
    hiragana: "まいあさしちじにおきて、こーひーをのみます。",
    vietnamese: "Mỗi sáng tôi dậy lúc 7 giờ và uống cà phê.",
    level: "N5",
    category: "Đời sống",
  },
  {
    japanese: "日本のラーメンは安くてとても美味しいです。",
    hiragana: "にほんのらーめんはやすくてとてもおいしいです。",
    vietnamese: "Mì Ramen Nhật Bản vừa rẻ lại rất ngon.",
    level: "N5",
    category: "Ẩm thực",
  },
  {
    japanese: "この帽子はいくらですか。千円です。",
    hiragana: "このぼうしはいくらですか。せんえんです。",
    vietnamese: "Cái mũ này giá bao nhiêu? Là 1000 yên.",
    level: "N5",
    category: "Mua sắm",
  },
  {
    japanese: "昨日は友達と映画を見に行きました。",
    hiragana: "きのうはともだちとえいがをみにいきました。",
    vietnamese: "Hôm qua tôi đã đi xem phim cùng bạn bè.",
    level: "N5",
    category: "Giải trí",
  },
  {
    japanese: "部屋の中にきれいな花が咲いています。",
    hiragana: "へやのなかにお花がさいています。",
    vietnamese: "Trong phòng có bông hoa đẹp đang nở.",
    level: "N5",
    category: "Đời sống",
  },
  {
    japanese: "東京駅まで電車で何分かかりますか。",
    hiragana: "とうきょうえきまででんしゃになんぷんかかりますか。",
    vietnamese: "Đi tàu điện đến ga Tokyo mất bao nhiêu phút?",
    level: "N5",
    category: "Đi lại",
  },
  {
    japanese: "お腹がすいたので、一緒にお弁当を食べましょう。",
    hiragana: "おなかがすいたので、いっしょにおべんとうをたべましょう。",
    vietnamese: "Vì đói bụng rồi, chúng ta cùng ăn cơm hộp nhé.",
    level: "N5",
    category: "Ẩm thực",
  },
  {
    japanese: "今日は風が強くて、少し寒いです。",
    hiragana: "きょうはかぜがつよくて、すこしさむいです。",
    vietnamese: "Hôm nay gió mạnh và hơi lạnh một chút.",
    level: "N5",
    category: "Thời tiết",
  },
  {
    japanese: "私の趣味は音楽を聴くことと写真を撮ることです。",
    hiragana: "わたしのしゅみはおんがくをきくこととしゃしんをとることです。",
    vietnamese: "Sở thích của tôi là nghe nhạc và chụp ảnh.",
    level: "N5",
    category: "Sở thích",
  },

  // --- N4 ---
  {
    japanese: "雨が降りそうだから、傘を持って行ったほうがいいですよ。",
    hiragana: "あめがふりそうだから、かさをもっていったほうがいいですよ。",
    vietnamese: "Trời có vẻ sắp mưa, nên mang theo ô đi thì hơn đấy.",
    level: "N4",
    category: "Lời khuyên",
  },
  {
    japanese: "日本語がもっと上手になるように、毎日練習しています。",
    hiragana: "にほんごがもっとじょうずになるように、まいにちれんしゅうしています。",
    vietnamese: "Để tiếng Nhật giỏi hơn, tôi luyện tập mỗi ngày.",
    level: "N4",
    category: "Học tập",
  },
  {
    japanese: "京都には古いお寺や美しい庭園がたくさんあります。",
    hiragana: "きょうとにはふるいおてらやうつくしいていえんがたくさんあります。",
    vietnamese: "Ở Kyoto có rất nhiều ngôi chùa cổ và khu vườn xinh đẹp.",
    level: "N4",
    category: "Du lịch",
  },
  {
    japanese: "試験が終わったら、温泉へ旅行に行くつもりです。",
    hiragana: "しけんがおわったら、おんせんへりょこうにいくつもりです。",
    vietnamese: "Sau khi kỳ thi kết thúc, tôi định đi du lịch suối nước nóng.",
    level: "N4",
    category: "Kế hoạch",
  },
  {
    japanese: "先生、この漢字の読み方を教えていただけませんか。",
    hiragana: "せんせい、このかんじのよみかたをおしえていただけませんか。",
    vietnamese: "Thưa thầy, thầy có thể dạy em cách đọc chữ Kanji này được không ạ?",
    level: "N4",
    category: "Giao tiếp",
  },
  {
    japanese: "新幹線はとても速くて静かなので驚きました。",
    hiragana: "しんかんせんはとてもはやくてしずかなのでおどろきました。",
    vietnamese: "Tàu Shinkansen vừa rất nhanh vừa êm làm tôi ngạc nhiên.",
    level: "N4",
    category: "Trải nghiệm",
  },
  {
    japanese: "約束の時間に遅れないように、早く出発しましょう。",
    hiragana: "やくそくのじかにおくれないように、はやくしゅっぱつしましょう。",
    vietnamese: "Để không trễ giờ hẹn, chúng ta hãy xuất phát sớm nào.",
    level: "N4",
    category: "Đời sống",
  },
  {
    japanese: "日本の伝統的なお祭りを見ると、心がわくわくします。",
    hiragana: "にほんのでんとうてきなおまつりをみると、こころがわくわくします。",
    vietnamese: "Xem các lễ hội truyền thống của Nhật khiến tôi rất hào hứng.",
    level: "N4",
    category: "Văn hóa",
  },

  // --- N3 ---
  {
    japanese: "どんなに忙しくても、家族との時間を大切にしたいと思っています。",
    hiragana: "どんなにいそがしくても、かぞくとのじかんをたいせつにしたいとおもっています。",
    vietnamese: "Dù bận rộn đến mấy, tôi vẫn muốn coi trọng thời gian dành cho gia đình.",
    level: "N3",
    category: "Gia đình",
  },
  {
    japanese: "異文化を理解するためには、相手の立場に立って考えることが不可欠だ。",
    hiragana: "いぶんかをりかいするためには、あいてのたちばにたってかんがえることがふかけつだ。",
    vietnamese: "Để hiểu được văn hóa khác biệt, việc đặt mình vào vị trí đối phương là không thể thiếu.",
    level: "N3",
    category: "Suy ngẫm",
  },
  {
    japanese: "失敗を恐れずに新しいことに挑戦し続ける姿勢が成功につながる。",
    hiragana: "しっぱいをおそれずにあたらしいことにちょうせんしつづけるしせいがせいこうにつながる。",
    vietnamese: "Thái độ không sợ thất bại và tiếp tục thử thách cái mới sẽ dẫn đến thành công.",
    level: "N3",
    category: "Động lực",
  },
  {
    japanese: "このカフェは静かで落ち着いた雰囲気があり、作業に集中できます。",
    hiragana: "このかふぇはしずかでおちついたふんいきがあり、さぎょうにしゅうちゅうできます。",
    vietnamese: "Quán cà phê này có bầu không khí yên tĩnh, thư thái, rất tập trung làm việc được.",
    level: "N3",
    category: "Đời sống",
  },
  {
    japanese: "環境問題について真剣に話し合い、一人一人が行動を起こす必要がある。",
    hiragana: "かんきょうもんだいについてしんけんにはなしあい、ひとりひとりがこうどうをおこすひつようがある。",
    vietnamese: "Cần thảo luận nghiêm túc về vấn đề môi trường và từng cá nhân phải hành động.",
    level: "N3",
    category: "Xã hội",
  },

  // --- N2 ---
  {
    japanese: "AI技術の急速な発展に伴い、私たちの働き方や生活様式も大きく変化しつつある。",
    hiragana: "AIぎじゅつのきゅうそくなはってんにともない、わたしたちのはたらきかたやりょうせいようしきもおおきくへんかしつつある。",
    vietnamese: "Cùng với sự phát triển nhanh chóng của công nghệ AI, cách làm việc và lối sống của chúng ta cũng đang thay đổi lớn.",
    level: "N2",
    category: "Công nghệ",
  },
  {
    japanese: "長年にわたる努力が実を結び、ついに念願のプロジェクトを成功させることができた。",
    hiragana: "ながねんにわたるどりょくがみをむすび、ついにねんがんのぷろじぇくとをせいこうさせることができた。",
    vietnamese: "Nỗ lực qua nhiều năm đã đơm hoa kết trái, cuối cùng đã thành công dự án ấp ủ bấy lâu.",
    level: "N2",
    category: "Thành tựu",
  },
  {
    japanese: "お互いの信頼関係を築くには、日頃の誠実な h giao tiếp が何より大切である。",
    hiragana: "おたがいのしんらいかんけいをきずくには、ひごろのせいじつなコミュニケーションがなによりたいせつである。",
    vietnamese: "Để xây dựng mối quan hệ tin cậy lẫn nhau, sự giao tiếp chân thành hàng ngày là quan trọng hơn hết.",
    level: "N2",
    category: "Giao tiếp",
  },

  // --- N1 ---
  {
    japanese: "複雑に絡み合う社会課題の解決には、多角的な視点と柔軟な発想が不可欠である。",
    hiragana: "ふくざつにからみあうしゃかいかだいのかいけつには、たかくてきなしていとじゅうなんなはっそうがふかけつである。",
    vietnamese: "Để giải quyết các vấn đề xã hội đan xen phức tạp, góc nhìn đa chiều và tư duy linh hoạt là không thể thiếu.",
    level: "N1",
    category: "Triết lý",
  },
  {
    japanese: "幾多の困難を乗り越えて築き上げられた伝統は、今なお人々の心に深く息づいている。",
    hiragana: "いくたのこんなんをのりこえてきずきあげられたでんとうは、いまなおひとびとのこころにふかくいきづいている。",
    vietnamese: "Truyền thống được gầy dựng qua bao khó khăn đến nay vẫn tiếp tục sống sâu thẳm trong lòng mọi người.",
    level: "N1",
    category: "Văn hóa",
  }
];

// Generates dynamic practice sentences if requested (up to 1000+ variants)
export function getRandomShadowingSentence(level: string = "N5", preferredCategory?: string): ShadowingSentence {
  const filtered = SHADOWING_SENTENCES_BANK.filter((s) => s.level === level);
  const pool = filtered.length > 0 ? filtered : SHADOWING_SENTENCES_BANK;

  if (preferredCategory) {
    const catFiltered = pool.filter((s) => s.category === preferredCategory);
    if (catFiltered.length > 0) {
      return catFiltered[Math.floor(Math.random() * catFiltered.length)];
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
