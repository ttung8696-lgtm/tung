export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1" | "All";

export type Category = 
  | "All"
  | "Giao tiếp"
  | "Ẩm thực"
  | "Trường học"
  | "Công việc"
  | "Du lịch"
  | "Cảm xúc"
  | "Thiên nhiên"
  | "Gia đình"
  | "Văn hóa"
  | "Thời gian"
  | "Khác";

export type WordType = "all" | "noun" | "verb" | "i-adj" | "na-adj" | "adverb" | "phrase";

export type MemoryStatus = "all" | "unlearned" | "learned" | "bookmarked";

export interface VocabItem {
  id: string;
  kanji: string;
  hiragana: string;
  romaji: string;
  vietnamese: string;
  hanViet?: string;
  type: "noun" | "verb" | "i-adj" | "na-adj" | "adverb" | "phrase";
  jlpt: "N5" | "N4" | "N3" | "N2" | "N1";
  category: string;
  example: {
    japanese: string;
    hiragana: string;
    vietnamese: string;
  };
  note?: string;
  learned?: boolean;
  bookmarked?: boolean;
  imageIcon?: string;
  custom?: boolean;
}

export interface FilterState {
  searchQuery: string;
  jlpt: JLPTLevel;
  category: Category;
  wordType: WordType;
  status: MemoryStatus;
}

export interface QuizQuestion {
  id: string;
  vocab: VocabItem;
  promptType: "kanji-to-meaning" | "hiragana-to-kanji" | "meaning-to-japanese";
  options: string[];
  correctAnswer: string;
}

export interface ExtractedWord {
  kanji: string;
  hiragana: string;
  romaji: string;
  vietnamese: string;
  hanViet?: string;
  type?: "noun" | "verb" | "i-adj" | "na-adj" | "adverb" | "phrase";
  jlpt?: "N5" | "N4" | "N3" | "N2" | "N1";
  example?: string;
  category?: string;
  note?: string;
}

// Japanese Grammar Types
export type GrammarLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export interface GrammarExample {
  japanese: string;
  hiragana: string;
  romaji: string;
  vietnamese: string;
}

export interface GrammarItem {
  id: string;
  title: string;           // E.g., "〜てから (Te kara)"
  level: GrammarLevel;     // "N5" | "N4" | "N3" | "N2" | "N1"
  summary: string;         // Short Vietnamese meaning
  formula: string;         // E.g., "V-て + から"
  explanation: string;     // Detailed usage & rules
  category: string;        // E.g., "Trật tự thời gian", "Điều kiện", "Nguyên nhân - Lý do", "So sánh", "Mục đích", "Phủ định - Phủ nhận"
  examples: GrammarExample[];
  comparison?: {
    similarPattern: string;
    difference: string;
  };
  mindMapGroup?: string;   // Grouping for visual Grammar Mind Map
}

export type GrammarStatus = "unlearned" | "studying" | "mastered";

export interface UserGrammarProgress {
  status: GrammarStatus;
  bookmarked: boolean;
  lastReviewedAt?: number;
  nextReviewAt?: number; // timestamp for SRS
  reviewCount: number;
}

