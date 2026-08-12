import { GrammarItem } from "../types";

export const GRAMMAR_BATCH_101_150: GrammarItem[] = [
  {
    id: "g_batch_103",
    title: "〜せいか (Sei ka)",
    level: "N3",
    summary: "Có lẽ tại… / Có lẽ vì…",
    formula: "V / A-i / A-na(+な) / N(+の) + せいか",
    explanation: "Dùng để thể hiện nguyên nhân, lý do khiến kết quả không tốt (hoặc không chắc chắn), mang ý nghi vấn 'có lẽ là do…'.",
    category: "Nguyên nhân - Lý do",
    examples: [
      {
        japanese: "疲れのせいか、今日は頭が痛い。",
        hiragana: "つかれのせいか、きょうはあたまがいたい。",
        romaji: "Tsukare no sei ka, kyou wa atama ga itai.",
        vietnamese: "Có lẽ tại mệt nên hôm nay tôi bị đau đầu."
      },
      {
        japanese: "気のせいか、最近彼が冷たい気がする。",
        hiragana: "きのせいか、さいきんかれがつめたいきがする。",
        romaji: "Ki no sei ka, saikin kare ga tsumetai ki ga suru.",
        vietnamese: "Có lẽ do tôi tưởng tượng, gần đây cảm thấy anh ấy lạnh nhạt."
      }
    ]
  },
  {
    id: "g_batch_105",
    title: "〜ものだから / もので (Mono dakara / Mono de)",
    level: "N3",
    summary: "Vì… (giải thích lý do, phân trần)",
    formula: "V / A-i / A-na(+な) / N(+な) + ものだから",
    explanation: "Dùng khi phân trần, giải thích lý do khách quan cho một sự việc bất ngờ hoặc lỗi hỏng cá nhân.",
    category: "Nguyên nhân - Lý do",
    examples: [
      {
        japanese: "バスが遅れたものだから、遅刻してしまいました。",
        hiragana: "バスがおくれたものだから、ちこくしてしまいました。",
        romaji: "Basu ga okureta mono dakara, chikoku shite shimaimashita.",
        vietnamese: "Vì xe buýt bị trễ nên tôi đã đến muộn."
      },
      {
        japanese: "あまりにも可愛かったものだから、つい買ってしまった。",
        hiragana: "あまりにもかわいかったものだから、ついかってしまった。",
        romaji: "Amarini mo kawaiikatta mono dakara, tsui katte shimatta.",
        vietnamese: "Vì nó quá đáng yêu nên tôi đã lỡ mua mất."
      }
    ]
  },
  {
    id: "g_batch_106",
    title: "〜ことから (Koto kara)",
    level: "N3",
    summary: "Xét từ… / Do… (nguồn gốc, căn cứ)",
    formula: "V / A-i / A-na(+な/である) / N(+である) + ことから",
    explanation: "Diễn tả căn cứ, nguồn gốc dẫn đến một tên gọi, một sự phán đoán hoặc một kết quả.",
    category: "Nguyên nhân - Lý do",
    examples: [
      {
        japanese: "富士山が見えることから、この町は「富士見町」と呼ばれている。",
        hiragana: "ふじさんがみえることから、このまちは「ふじみちょう」とよばれている。",
        romaji: "Fujisan ga mieru koto kara, kono machi wa 'Fujimicho' to yobarete iru.",
        vietnamese: "Vì có thể nhìn thấy núi Phú Sĩ nên thành phố này được gọi là Fujimicho."
      },
      {
        japanese: "道が濡れていることから、夜の間に雨が降ったことがわかる。",
        hiragana: "みちがぬれていることから、よるのあいだにあめがふったことがわかる。",
        romaji: "Michi ga nurete iru koto kara, yoru no ida ni ame ga futta koto ga wakaru.",
        vietnamese: "Xét từ việc đường xá bị ướt, có thể biết đêm qua trời đã mưa."
      }
    ]
  },
  {
    id: "g_batch_107",
    title: "〜結果 / 〜た結果 (Kekka / Ta kekka)",
    level: "N3",
    summary: "Kết quả là… / Sau khi… thì…",
    formula: "V-た / Nの + 結果",
    explanation: "Diễn tả sau khi thực hiện một hành động hoặc trải qua quá trình nào đó thì nhận được kết quả.",
    category: "Nguyên nhân - Lý do",
    examples: [
      {
        japanese: "努力した結果、試験に合格することができた。",
        hiragana: "どりょくしたけっか、しけんにごうかくすることができた。",
        romaji: "Doryoku shita kekka, shiken ni goukaku suru koto ga dekita.",
        vietnamese: "Kết quả của sự nỗ lực là tôi đã đỗ kỳ thi."
      },
      {
        japanese: "調査の結果、新しい事実が明らかになった。",
        hiragana: "ちょうさのけっか、あたらしいじじつがあきらかになった。",
        romaji: "Chousa no kekka, atarashii jijitsu ga akiraka ni natta.",
        vietnamese: "Kết quả điều tra đã làm sáng tỏ một sự thật mới."
      }
    ]
  },
  {
    id: "g_batch_108",
    title: "〜あまり (Amari)",
    level: "N3",
    summary: "Vì quá… nên…",
    formula: "V-る/V-た / A-i / A-na(+な) / Nの + あまり",
    explanation: "Diễn tả cảm xúc hoặc trạng thái vượt quá mức bình thường, dẫn đến một hành động hay kết quả không mong muốn hoặc bất thường.",
    category: "Nguyên nhân - Lý do",
    examples: [
      {
        japanese: "嬉しさのあまり、涙が出てしまった。",
        hiragana: "うれしさのあまり、なみだがでてしまった。",
        romaji: "Ureshisa no amari, namida ga dete shimatta.",
        vietnamese: "Vì quá vui mừng nên nước mắt tôi đã rơi."
      },
      {
        japanese: "緊張するあまり、言いたいことを忘れてしまった。",
        hiragana: "きんちょうするあまり、いいたいことをわすれてしまった。",
        romaji: "Kinjou suru amari, iitai koto wo wasurete shimatta.",
        vietnamese: "Vì quá hồi hộp nên tôi đã quên mất những gì muốn nói."
      }
    ]
  },
  {
    id: "g_batch_113",
    title: "〜のに (No ni)",
    level: "N4",
    summary: "Mặc dù… thế mà…",
    formula: "V / A-i / A-na(+な) / N(+な) + のに",
    explanation: "Diễn tả sự trái ngược giữa thực tế và kỳ vọng, thường kèm theo cảm xúc ngạc nhiên, thất vọng hoặc trách móc.",
    category: "Nghịch lý - Đối lập",
    examples: [
      {
        japanese: "約束したのに、彼は来なかった。",
        hiragana: "やくそくしたのに、かれはこなかった。",
        romaji: "Yakusoku shita noni, kare wa konakatta.",
        vietnamese: "Mặc dù đã hứa thế mà anh ấy không đến."
      },
      {
        japanese: "一生懸命勉強したのに、不合格だった。",
        hiragana: "いっしょうけんめいべんきょうしたのに、ふごうかくだった。",
        romaji: "Isshoukenmei benkyou shita noni, fugoukaku datta.",
        vietnamese: "Mặc dù đã học hành chăm chỉ thế mà vẫn bị trượt."
      }
    ]
  },
  {
    id: "g_batch_115",
    title: "〜ながら（も） (Nagara mo)",
    level: "N3",
    summary: "Mặc dù… nhưng…",
    formula: "V-masu(bỏ masu) / A-i / A-na(+であり) / N(+であり) + ながら（も）",
    explanation: "Diễn tả sự đối lập giữa hai trạng thái hay sự việc: dù ở trạng thái A nhưng vẫn thực hiện/đạt được B.",
    category: "Nghịch lý - Đối lập",
    examples: [
      {
        japanese: "狭いながらも、楽しい我が家だ。",
        hiragana: "せまいながらも、たのしいわがやだ。",
        romaji: "Semai nagara mo, tanoshii waga ya da.",
        vietnamese: "Mặc dù chật hẹp nhưng đây là ngôi nhà ấm cúng của chúng tôi."
      },
      {
        japanese: "彼は子供ながらも、しっかりとした考えを持っている。",
        hiragana: "かれはこどもながらも、しっかりとしたかんがえをもっている。",
        romaji: "Kare wa kodomo nagara mo, shikkari to shita kangae wo motte iru.",
        vietnamese: "Mặc dù là trẻ con nhưng cậu ấy có suy nghĩ rất chín chắn."
      }
    ]
  },
  {
    id: "g_batch_116",
    title: "〜とはいえ (To wa ie)",
    level: "N3",
    summary: "Tuy nói là… / Dù vậy thì…",
    formula: "V / A-i / A-na / N + とはいえ",
    explanation: "Thừa nhận thực tế ở vế trước, nhưng vế sau bổ sung một nhận định trái ngược hoặc hạn chế ý của vế trước.",
    category: "Nghịch lý - Đối lập",
    examples: [
      {
        japanese: "4月とはいえ、まだ寒い日がある。",
        hiragana: "しがつとはいえ、まださむいひがある。",
        romaji: "Shigatsu to wa ie, mada samui hi ga aru.",
        vietnamese: "Tuy nói là tháng 4 rồi nhưng vẫn có những ngày lạnh."
      },
      {
        japanese: "プロとはいえ、失敗することもある。",
        hiragana: "プロとはいえ、しっぱいすることもある。",
        romaji: "Puro to wa ie, shippai suru koto mo aru.",
        vietnamese: "Tuy nói là chuyên nghiệp nhưng cũng có lúc thất bại."
      }
    ]
  },
  {
    id: "g_batch_117",
    title: "〜ものの (Mono no)",
    level: "N3",
    summary: "Mặc dù… nhưng…",
    formula: "V / A-i / A-na(+な/である) / N(+である) + ものの",
    explanation: "Chấp nhận sự thật ở vế 1, nhưng vế 2 lại diễn ra sự việc không như mong đợi hoặc không phù hợp với vế 1.",
    category: "Nghịch lý - Đối lập",
    examples: [
      {
        japanese: "高い上着を買ったものの、あまり着ていない。",
        hiragana: "たかいうわぎをかったものの、あまりきていない。",
        romaji: "Takai uwagi wo katta mono no, amari kite inai.",
        vietnamese: "Mặc dù đã mua chiếc áo khoác đắt tiền nhưng tôi lại không mấy khi mặc."
      },
      {
        japanese: "日本語の文法は理解できるものの、話すのは難しい。",
        hiragana: "にほんごのぶんぽうはりかいできるものの、はなすのはむずかしい。",
        romaji: "Nihongo no bunpou wa rikai dekiru mono no, hanasu no wa muzukashii.",
        vietnamese: "Mặc dù có thể hiểu ngữ pháp tiếng Nhật nhưng nói thì lại khó."
      }
    ]
  },
  {
    id: "g_batch_118",
    title: "〜一方で (Ippou de)",
    level: "N3",
    summary: "Mặt khác… / Vừa… mặt khác lại…",
    formula: "V / A-i / A-na(+な/である) / N(+である) + 一方で",
    explanation: "Diễn tả hai khía cạnh đối lập hoặc song song của cùng một sự việc, hoặc hai hành động diễn ra đồng thời.",
    category: "Nghịch lý - Đối lập",
    examples: [
      {
        japanese: "便利な一方で、環境破壊の問題もある。",
        hiragana: "べんりないっぽうで、かんきょうはかいのもんだいもある。",
        romaji: "Benri na ippou de, kankyou hakai no mondai mo aru.",
        vietnamese: "Tiện lợi nhưng mặt khác cũng có vấn đề phá hủy môi trường."
      },
      {
        japanese: "彼は仕事を頑張る一方で、趣味の時間も大切にしている。",
        hiragana: "かれはしごとをがんばるいっぽうで、しゅみのじかんもたいせつにしている。",
        romaji: "Kare wa shigoto wo ganbaru ippou de, shumi no jikan mo taisetsu ni shite iru.",
        vietnamese: "Anh ấy vừa cố gắng làm việc, mặt khác cũng coi trọng thời gian cho sở thích."
      }
    ]
  },
  {
    id: "g_batch_120",
    title: "〜かわりに (Kawarini)",
    level: "N3",
    summary: "Thay vì… / Bù lại…",
    formula: "V / Nの + かわりに",
    explanation: "Diễn tả việc thay thế hành động/người này bằng hành động/người khác, hoặc điều đổi lại làm bù trừ.",
    category: "Thay thế - Đổi lại",
    examples: [
      {
        japanese: "日曜日に働いたかわりに、月曜日に休みをとった。",
        hiragana: "にちようびにはたらいたかわりに、げつようびにやすみをとった。",
        romaji: "Nichiyoubi ni hataraita kawarini, getsuyoubi ni yasumi wo totta.",
        vietnamese: "Thay vì làm việc vào Chủ nhật, tôi đã nghỉ bù vào thứ Hai."
      },
      {
        japanese: "コーヒーの代わりに、お茶を飲みます。",
        hiragana: "コーヒーのかわりに、おちゃをのみます。",
        romaji: "Ko-hi- no kawarini, ocha wo nomimasu.",
        vietnamese: "Thay vì uống cà phê, tôi uống trà."
      }
    ]
  },
  {
    id: "g_batch_123",
    title: "〜にしては (Ni shite wa)",
    level: "N3",
    summary: "So với… thì…",
    formula: "V / N + にしては",
    explanation: "Diễn tả kết quả trái ngược với tiêu chuẩn thông thường mà người ta nghĩ đến từ đối tượng đó.",
    category: "So sánh",
    examples: [
      {
        japanese: "初めてにしては、すごく上手ですね。",
        hiragana: "はじめてにしては、すごくじょうずですね。",
        romaji: "Hajimete ni shite wa, sugoku jouzu desu ne.",
        vietnamese: "So với lần đầu tiên thì bạn làm rất giỏi đấy."
      },
      {
        japanese: "冬にしては、今日の気候は暖かい。",
        hiragana: "ふゆにしては、きょうのきこうはあたたかい。",
        romaji: "Fuyu ni shite wa, kyou no kikou wa atatakai.",
        vietnamese: "So với mùa đông thì thời tiết hôm nay ấm áp."
      }
    ]
  },
  {
    id: "g_batch_124",
    title: "〜と違って (To chigatte)",
    level: "N3",
    summary: "Khác với…",
    formula: "N + と違って",
    explanation: "So sánh hai đối tượng để làm nổi bật điểm khác biệt của đối tượng sau so với đối tượng trước.",
    category: "So sánh",
    examples: [
      {
        japanese: "兄と違って、弟はスポーツが得意だ。",
        hiragana: "あにとちがって、おとうとはスポーツがとくいだ。",
        romaji: "Ani to chigatte, otouto wa supo-tsu ga tokui da.",
        vietnamese: "Khác với anh trai, người em trai rất giỏi thể thao."
      },
      {
        japanese: "昔と違って、今はインターネットで何でも買える。",
        hiragana: "むかしとちがって、いまはインターネットでなんでもかえる。",
        romaji: "Mukashi to chigatte, ima wa inta-netto de nandemo kaeru.",
        vietnamese: "Khác với ngày xưa, bây giờ cái gì cũng có thể mua qua internet."
      }
    ]
  },
  {
    id: "g_batch_125",
    title: "〜どころか (Dokoroka)",
    level: "N3",
    summary: "Không những không… mà còn…",
    formula: "V / A-i / A-na / N + どころか",
    explanation: "Bác bỏ mức độ nhẹ ở vế trước để nhấn mạnh thực tế ở vế sau hoàn toàn trái ngược hoặc nghiêm trọng hơn nhiều.",
    category: "Mức độ - Phạm vi",
    examples: [
      {
        japanese: "独身どころか、子供が三人います。",
        hiragana: "どくしんどころか、こどもがさんにんいます。",
        romaji: "Dokushin dokoroka, kodomo ga sannin imasu.",
        vietnamese: "Không những không độc thân mà anh ấy còn có 3 con rồi."
      },
      {
        japanese: "咳が止まるどころか、ひどくなる一方だ。",
        hiragana: "せきがとまるどころか、ひどくなるいっぽうだ。",
        romaji: "Seki ga tomaru dokoroka, hidoku naru ippou da.",
        vietnamese: "Ho không những không giảm mà còn ngày càng nặng hơn."
      }
    ]
  },
  {
    id: "g_batch_126",
    title: "〜どころではない (Dokoro de wa nai)",
    level: "N3",
    summary: "Không phải lúc để… / Không thể…",
    formula: "V-る / N + どころではない",
    explanation: "Diễn tả vì tình cảnh hay lý do nghiêm trọng nào đó nên hoàn toàn không thể làm việc gì một cách thoải mái hay bình thường.",
    category: "Đánh giá - Nhận định",
    examples: [
      {
        japanese: "仕事が忙しくて、旅行どころではない。",
        hiragana: "しごとがいそがしくて、りょこうどころではない。",
        romaji: "Shigoto ga isogashikute, ryokou dokoro de wa nai.",
        vietnamese: "Công việc bận rộn nên không phải lúc để đi du lịch."
      },
      {
        japanese: "うるさくて勉強どころではない。",
        hiragana: "うるさくてべんきょうどころではない。",
        romaji: "Urusakute benkyou dokoro de wa nai.",
        vietnamese: "Ồn ào thế này thì không thể học hành gì được."
      }
    ]
  },
  {
    id: "g_batch_127",
    title: "〜どころではなく (Dokoro de wa naku)",
    level: "N3",
    summary: "Không thể… vì…",
    formula: "V-る / N + どころではなく",
    explanation: "Dạng liên kết của どころではない, dùng nối câu diễn tả hoàn cảnh khiến người nói không thể thực hiện hành động tiếp theo.",
    category: "Đánh giá - Nhận định",
    examples: [
      {
        japanese: "歯が痛くて食事どころではなく、すぐ病院へ行った。",
        hiragana: "はがいたくてしょくじどころではなく、すぐびょういんへいった。",
        romaji: "Ha ga itakute shokuji dokoro de wa naku, sugu byouin e itta.",
        vietnamese: "Đau răng không thể ăn uống gì được, tôi đã đi viện ngay."
      }
    ]
  },
  {
    id: "g_batch_128",
    title: "〜というより (To iu yori)",
    level: "N3",
    summary: "Nói đúng hơn là…",
    formula: "V / A-i / A-na / N + というより",
    explanation: "So sánh hai cách diễn đạt, chỉ ra rằng cách diễn đạt vế sau thích hợp và chính xác hơn vế trước.",
    category: "Đánh giá - Nhận định",
    examples: [
      {
        japanese: "涼しいというより、むしろ寒い。",
        hiragana: "すずしいというより、むしろさむい。",
        romaji: "Suzushii to iu yori, mushiro samui.",
        vietnamese: "Nói đúng hơn là lạnh chứ không phải mát."
      },
      {
        japanese: "彼は友達というより、家族のような存在だ。",
        hiragana: "かれはともだちというより、かぞくのようなそんざいだ。",
        romaji: "Kare wa tomodachi to iu yori, kazoku no you na sonzai da.",
        vietnamese: "Anh ấy đúng hơn là như người trong gia đình chứ không chỉ là bạn."
      }
    ]
  },
  {
    id: "g_batch_129",
    title: "〜というわけではない (To iu wake de wa nai)",
    level: "N3",
    summary: "Không hẳn là…",
    formula: "V / A-i / A-na(+な) / N(+だ/である) + というわけではない",
    explanation: "Phủ định một phần nhận định hay suy đoán của người khác, mang nghĩa 'không hoàn toàn là như vậy'.",
    category: "Phủ định - Phủ nhận",
    examples: [
      {
        japanese: "嫌いなわけではないが、食べる気になれない。",
        hiragana: "きらいなわけではないが、たべるきになれない。",
        romaji: "Kirai na wake de wa nai ga, taberu ki ni narenai.",
        vietnamese: "Không hẳn là ghét nhưng tôi không muốn ăn."
      },
      {
        japanese: "お金があれば幸せになれるというわけではない。",
        hiragana: "おかねがあればしあわせになれるというわけではない。",
        romaji: "Okane ga areba shiawase ni nareru to iu wake de wa nai.",
        vietnamese: "Không hẳn có tiền là sẽ hạnh phúc."
      }
    ]
  },
  {
    id: "g_batch_130",
    title: "〜ということは (To iu koto wa)",
    level: "N3",
    summary: "Điều đó có nghĩa là…",
    formula: "[Mệnh đề] + ということは",
    explanation: "Dùng khi rút ra kết luận, suy luận hoặc giải thích ý nghĩa từ thông tin vừa tiếp nhận.",
    category: "Giải thích - Căn cứ",
    examples: [
      {
        japanese: "電源が入らないということは、故障しているということだ。",
        hiragana: "でんげんがはいらないということは、こしょうしているということだ。",
        romaji: "Dengen ga hairanai to iu koto wa, koshou shite iru to iu koto da.",
        vietnamese: "Không bật được nguồn điều đó có nghĩa là máy đã bị hỏng."
      },
      {
        japanese: "彼が返事をしないということは、断られたということか。",
        hiragana: "かれがへんじをしないということは、ことわられたということか。",
        romaji: "Kare ga henji wo shinai to iu koto wa, kotowarareta to iu koto ka.",
        vietnamese: "Anh ấy không trả lời điều đó có nghĩa là đã từ chối rồi sao?"
      }
    ]
  },
  {
    id: "g_batch_137",
    title: "〜に対する (Ni taisuru)",
    level: "N3",
    summary: "Đối với… (bổ nghĩa danh từ)",
    formula: "N + に対する + N",
    explanation: "Dạng bổ nghĩa danh từ của に対し / に対して, dùng chỉ đối tượng của hành động, thái độ hay tình cảm.",
    category: "Đối tượng - Quan hệ",
    examples: [
      {
        japanese: "お客様に対する失礼な態度を謝罪した。",
        hiragana: "おきゃくさまにたいするしつれいなたいどをしゃざいした。",
        romaji: "Okyakusama ni taisuru shitsurei na taido wo shazai shita.",
        vietnamese: "Tôi đã xin lỗi vì thái độ thất lễ đối với khách hàng."
      },
      {
        japanese: "環境問題に対する関心が高まっている。",
        hiragana: "かんきょうもんだいにたいするかんしんがたかまっている。",
        romaji: "Kankyou mondai ni taisuru kanshin ga takamatte iru.",
        vietnamese: "Sự quan tâm đối với vấn đề môi trường đang tăng cao."
      }
    ]
  },
  {
    id: "g_batch_138",
    title: "〜に関する (Ni kansuru)",
    level: "N3",
    summary: "Liên quan đến… (bổ nghĩa danh từ)",
    formula: "N + に関する + N",
    explanation: "Dạng bổ nghĩa danh từ của に関して, diễn tả mối liên quan đến một chủ đề hay thông tin.",
    category: "Đối tượng - Quan hệ",
    examples: [
      {
        japanese: "新しい法律に関するニュースを聞いた。",
        hiragana: "あたらしいほうりつにかんするニュースをきいた。",
        romaji: "Atarashii houritsu ni kansuru nyu-su wo kiita.",
        vietnamese: "Tôi đã nghe tin tức liên quan đến đạo luật mới."
      },
      {
        japanese: "日本の文化に関する本を読んでいる。",
        hiragana: "にほんのぶんかにかんするほんをよんでいる。",
        romaji: "Nihon no bunka ni kansuru hon wo yonde iru.",
        vietnamese: "Tôi đang đọc sách liên quan đến văn hóa Nhật Bản."
      }
    ]
  },
  {
    id: "g_batch_140",
    title: "〜を通して / 〜を通じて (Wo tou shite / Wo tsuuji te)",
    level: "N3",
    summary: "Thông qua… / Suốt…",
    formula: "N + を通して / を通じて",
    explanation: "Diễn tả phương tiện, trung gian để thực hiện việc gì đó hoặc diễn tả quá trình kéo dài trong suốt một khoảng thời gian.",
    category: "Phương tiện - Trung gian",
    examples: [
      {
        japanese: "友人の紹介を通して、彼と知り合った。",
        hiragana: "ゆうじんのしょうかいをとおして、かれとしりあった。",
        romaji: "Yuujin no shoukai wo tou shite, kare to shiriatta.",
        vietnamese: "Tôi đã quen anh ấy thông qua sự giới thiệu của bạn bè."
      },
      {
        japanese: "この地域は一年を通して暖かい。",
        hiragana: "このちいきはいちねんをとおしてあたたかい。",
        romaji: "Kono chiiki wa ichinen wo tou shite atatakai.",
        vietnamese: "Khu vực này ấm áp suốt cả năm."
      }
    ]
  },
  {
    id: "g_batch_141",
    title: "〜を中心に (Wo chuushin ni)",
    level: "N3",
    summary: "Lấy… làm trung tâm",
    formula: "N + を中心に",
    explanation: "Diễn tả lấy một đối tượng, địa điểm làm trọng tâm để triển khai hành động hay sự việc.",
    category: "Phạm vi - Phạm trù",
    examples: [
      {
        japanese: "東京を中心に、関東地方で大きな地震があった。",
        hiragana: "とうきょうをちゅうしんに、かんとうちほうでおおきなじしんがあった。",
        romaji: "Toukyou wo chuushin ni, Kantou chihou de ookina jishin ga atta.",
        vietnamese: "Đã có trận động đất lớn ở vùng Kanto, lấy Tokyo làm trung tâm."
      },
      {
        japanese: "若者を中心に、そのゲームが流行している。",
        hiragana: "わかものをちゅうしんに、そのゲームがりゅうこうしている。",
        romaji: "Wakamono wo chuushin ni, sono ge-mu ga ryuukou shite iru.",
        vietnamese: "Trò chơi đó đang rất thịnh hành, chủ yếu trong giới trẻ."
      }
    ]
  },
  {
    id: "g_batch_143",
    title: "〜に限る (Ni kagiru)",
    level: "N3",
    summary: "Là tốt nhất / Chỉ giới hạn ở…",
    formula: "V-る / V-ない / N + に限る",
    explanation: "Đưa ra ý kiến chủ quan rằng lựa chọn này là tốt nhất, hoặc giới hạn đối tượng tham gia.",
    category: "Phạm vi - Giới hạn",
    examples: [
      {
        japanese: "暑い日は冷たいビールに限る。",
        hiragana: "あついひはつめたいビールにかぎる。",
        romaji: "Atsui hi wa tsumetai bi-ru ni kagiru.",
        vietnamese: "Ngày nóng thì uống bia lạnh là tuyệt nhất."
      },
      {
        japanese: "参加者は女性に限ります。",
        hiragana: "さんかしゃはじょせいにかぎります。",
        romaji: "Sankasha wa josei ni kagirimasu.",
        vietnamese: "Người tham gia chỉ giới hạn là nữ giới."
      }
    ]
  },
  {
    id: "g_batch_144",
    title: "〜に限らず (Ni kagirazu)",
    level: "N3",
    summary: "Không chỉ…",
    formula: "N + に限らず",
    explanation: "Diễn tả phạm vi không chỉ dừng lại ở đối tượng đó mà còn mở rộng ra các đối tượng khác.",
    category: "Phạm vi - Giới hạn",
    examples: [
      {
        japanese: "週末に限らず、この店はいつも混んでいる。",
        hiragana: "しゅうまつにかぎらず、このみせはいつもこんでいる。",
        romaji: "Shuumatsu ni kagirazu, kono mise wa itsumo konde iru.",
        vietnamese: "Không chỉ cuối tuần, cửa hàng này lúc nào cũng đông khách."
      },
      {
        japanese: "男性に限らず、女性もそのアニメが好きだ。",
        hiragana: "だんせいにかぎらず、じょせいもそのアニメがすきだ。",
        romaji: "Dansei ni kagirazu, josei mo sono anime ga suki da.",
        vietnamese: "Không chỉ nam giới, nữ giới cũng thích bộ anime đó."
      }
    ]
  },
  {
    id: "g_batch_145",
    title: "〜にすぎない (Ni suginai)",
    level: "N3",
    summary: "Chỉ là… / Chẳng qua chỉ là…",
    formula: "V / A-i / A-na(+である) / N(+である) + にすぎない",
    explanation: "Diễn tả sự việc hay đối tượng chỉ ở mức độ thấp, không có gì quan trọng hay đặc biệt.",
    category: "Phạm vi - Mức độ",
    examples: [
      {
        japanese: "私は自分の義務を果たしたにすぎない。",
        hiragana: "わたしはじぶんのぎむをはたしたにすぎない。",
        romaji: "Watashi wa jibun no gimu wo hatashita ni suginai.",
        vietnamese: "Tôi chỉ là làm tròn nghĩa vụ của mình thôi."
      },
      {
        japanese: "それは単なる噂にすぎない。",
        hiragana: "それはたんなるうわさにすぎない。",
        romaji: "Sore wa tannaru uwasa ni suginai.",
        vietnamese: "Đó chẳng qua chỉ là lời đồn suông."
      }
    ]
  },
  {
    id: "g_batch_146",
    title: "〜にほかならない (Ni hokanaranai)",
    level: "N2",
    summary: "Chính là… / Không gì khác ngoài…",
    formula: "N / Mệnh đề + にほかならない",
    explanation: "Dùng để khẳng định mạnh mẽ nguyên nhân, lý do duy nhất hoặc bản chất của sự việc.",
    category: "Đánh giá - Khẳng định",
    examples: [
      {
        japanese: "彼の成功は努力の結晶にほかならない。",
        hiragana: "かれのせいこうはどりょくのけっしょうにほかならない。",
        romaji: "Kare no seikou wa doryoku no kesshou ni hokanaranai.",
        vietnamese: "Thành công của anh ấy không gì khác chính là kết tinh của sự nỗ lực."
      },
      {
        japanese: "合格できたのは、先生のおかげにほかならない。",
        hiragana: "ごうかくできたのは、せんせいのおかげにほかならない。",
        romaji: "Goukaku dekita no wa, sensei no okage ni hokanaranai.",
        vietnamese: "Thi đỗ được chính là nhờ vào công ơn của thầy cô."
      }
    ]
  },
  {
    id: "g_batch_147",
    title: "〜に違いない (Ni chigainai)",
    level: "N3",
    summary: "Chắc chắn là…",
    formula: "V / A-i / A-na / N + に違いない",
    explanation: "Thể hiện phán đoán có căn cứ mạnh mẽ của người nói rằng chắc chắn sự việc là như vậy.",
    category: "Phán đoán - Suy đoán",
    examples: [
      {
        japanese: "鍵がない。どこかで落としたに違いない。",
        hiragana: "かぎがない。どこかでおとしたにちがいない。",
        romaji: "Kagi ga nai. Dokoka de otoshita ni chigainai.",
        vietnamese: "Không thấy chìa khóa đâu. Chắc chắn là đã làm rơi ở đâu đó rồi."
      },
      {
        japanese: "夜遅くに電話してくるなんて、緊急事態に違いない。",
        hiragana: "よるおそくにでんわしてくるなんて、きんきゅうじたいにちがいない。",
        romaji: "Yoru osoku ni denwa shite kuru nante, kinkyuu jitai ni chigainai.",
        vietnamese: "Gọi điện muộn thế này chắc chắn là có chuyện khẩn cấp."
      }
    ]
  }
];
