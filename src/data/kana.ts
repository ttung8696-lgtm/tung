export interface KanaChar {
  hiragana: string;
  katakana: string;
  romaji: string;
}

export const KANA_DATA: KanaChar[] = [
  // Vowels
  { hiragana: "あ", katakana: "ア", romaji: "a" },
  { hiragana: "い", katakana: "イ", romaji: "i" },
  { hiragana: "う", katakana: "ウ", romaji: "u" },
  { hiragana: "え", katakana: "エ", romaji: "e" },
  { hiragana: "お", katakana: "オ", romaji: "o" },
  // K-row
  { hiragana: "か", katakana: "カ", romaji: "ka" },
  { hiragana: "き", katakana: "キ", romaji: "ki" },
  { hiragana: "く", katakana: "ク", romaji: "ku" },
  { hiragana: "け", katakana: "ケ", romaji: "ke" },
  { hiragana: "こ", katakana: "コ", romaji: "ko" },
  // S-row
  { hiragana: "さ", katakana: "サ", romaji: "sa" },
  { hiragana: "し", katakana: "シ", romaji: "shi" },
  { hiragana: "す", katakana: "ス", romaji: "su" },
  { hiragana: "せ", katakana: "セ", romaji: "se" },
  { hiragana: "そ", katakana: "ソ", romaji: "so" },
  // T-row
  { hiragana: "た", katakana: "タ", romaji: "ta" },
  { hiragana: "ち", katakana: "チ", romaji: "chi" },
  { hiragana: "つ", katakana: "ツ", romaji: "tsu" },
  { hiragana: "て", katakana: "テ", romaji: "te" },
  { hiragana: "と", katakana: "ト", romaji: "to" },
  // N-row
  { hiragana: "な", katakana: "ナ", romaji: "na" },
  { hiragana: "に", katakana: "ニ", romaji: "ni" },
  { hiragana: "ぬ", katakana: "ヌ", romaji: "nu" },
  { hiragana: "ね", katakana: "ネ", romaji: "ne" },
  { hiragana: "の", katakana: "ノ", romaji: "no" },
  // H-row
  { hiragana: "は", katakana: "ハ", romaji: "ha" },
  { hiragana: "ひ", katakana: "ヒ", romaji: "hi" },
  { hiragana: "ふ", katakana: "フ", romaji: "fu" },
  { hiragana: "へ", katakana: "ヘ", romaji: "he" },
  { hiragana: "ほ", katakana: "ホ", romaji: "ho" },
  // M-row
  { hiragana: "ま", katakana: "マ", romaji: "ma" },
  { hiragana: "み", katakana: "ミ", romaji: "mi" },
  { hiragana: "む", katakana: "ム", romaji: "mu" },
  { hiragana: "め", katakana: "メ", romaji: "me" },
  { hiragana: "も", katakana: "モ", romaji: "mo" },
  // Y-row
  { hiragana: "や", katakana: "ヤ", romaji: "ya" },
  { hiragana: "ゆ", katakana: "ユ", romaji: "yu" },
  { hiragana: "よ", katakana: "ヨ", romaji: "yo" },
  // R-row
  { hiragana: "ら", katakana: "ラ", romaji: "ra" },
  { hiragana: "り", katakana: "リ", romaji: "ri" },
  { hiragana: "る", katakana: "ル", romaji: "ru" },
  { hiragana: "れ", katakana: "レ", romaji: "re" },
  { hiragana: "ろ", katakana: "ロ", romaji: "ro" },
  // W-row & N
  { hiragana: "わ", katakana: "ワ", romaji: "wa" },
  { hiragana: "を", katakana: "ヲ", romaji: "wo" },
  { hiragana: "ん", katakana: "ン", romaji: "n" },
];
