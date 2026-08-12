import React, { useState } from "react";
import { 
  Sparkles, 
  Loader2, 
  Plus, 
  Check, 
  FileText, 
  Volume2, 
  BookOpen, 
  Layers, 
  AlertCircle,
  Video,
  Youtube,
  Subtitles,
  ExternalLink
} from "lucide-react";
import { VocabItem } from "../types";
import { playJapaneseSpeech } from "../utils/audio";
import { UserAccount, recordActivityLog } from "../lib/userAccount";
import { apiUrl } from "../utils/api";

interface AIExtractorProps {
  onAddWordsToApp: (newWords: VocabItem[]) => void;
  currentAccount?: UserAccount | null;
}

const SAMPLE_TEXTS = [
  {
    title: "🌸 Du lịch & Văn hóa",
    text: "昨日、友達と東京へ旅行に行きました。浅草で素晴らしい桜を鑑賞し、伝統的な和菓子や温かいラーメンを堪能しました。日本の文化はとても魅力的で印象深いです。",
  },
  {
    title: "💼 Bài báo Tin tức & Kinh tế N2",
    text: "少子高齢化の進展に伴い、日本企業では人手不足が深刻化しています。業務の効率化を図るため、AIやIT技術の導入が急速に進められており、柔軟な働き方が求められています。",
  },
  {
    title: "🍱 Giao tiếp Nhà hàng & Đời sống",
    text: "すみません、メニューをお願いします。この天ぷら定食と緑茶を注文します。居心地の良い雰囲気で、料理もとても美味しいですね。",
  },
];

const SAMPLE_YOUTUBE_LINKS = [
  {
    title: "📺 Tiếng Nhật công sở N2",
    url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
  },
  {
    title: "⛩️ Lịch sử & Văn hóa Nhật Bản",
    url: "https://www.youtube.com/watch?v=P4d6m5C3Q-0",
  },
];

export const AIExtractor: React.FC<AIExtractorProps> = ({ onAddWordsToApp, currentAccount }) => {
  const [activeTab, setActiveTab] = useState<"text" | "youtube">("youtube");
  const [inputStory, setInputStory] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("https://www.youtube.com/watch?v=5qap5aO4i9A");
  const [levelHint, setLevelHint] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [extractedResults, setExtractedResults] = useState<any[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [imported, setImported] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Extracted YouTube metadata
  const [isYoutubeMeta, setIsYoutubeMeta] = useState(false);
  const [subtitlePreviewText, setSubtitlePreviewText] = useState("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (!url) return "";
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (url.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0] || "";
      } else if (url.includes("embed/")) {
        videoId = url.split("embed/")[1]?.split("?")[0] || "";
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    } catch {
      return "";
    }
  };

  const handleAnalyze = async () => {
    const isYt = activeTab === "youtube";
    const payloadContent = isYt ? youtubeUrl : inputStory;

    if (!payloadContent.trim()) {
      setErrorMsg(isYt ? "Vui lòng nhập đường dẫn YouTube." : "Vui lòng nhập đoạn văn bản tiếng Nhật.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setExtractedResults([]);
    setSelectedIndices([]);
    setImported(false);
    setIsYoutubeMeta(false);
    setSubtitlePreviewText("");
    setCurrentVideoUrl("");

    try {
      const response = await fetch(apiUrl("/api/gemini/extract-words"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: isYt ? "" : inputStory,
          youtubeUrl: isYt ? youtubeUrl : (inputStory.includes("youtube.com") || inputStory.includes("youtu.be") ? inputStory : ""),
          levelHint: levelHint === "All" ? "" : levelHint,
        }),
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.words)) {
        setExtractedResults(data.words);
        setSelectedIndices(data.words.map((_: any, idx: number) => idx));

        if (data.isYoutube) {
          setIsYoutubeMeta(true);
          setSubtitlePreviewText(data.subtitlePreview || "");
          setCurrentVideoUrl(data.videoUrl || youtubeUrl);
        }
      } else {
        if (data.message) {
          setErrorMsg(data.message);
        } else {
          setErrorMsg(data.error || "Không thể phân tích từ mới. Vui lòng thử lại.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi khi kết nối với máy chủ AI.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (idx: number) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIndices.length === extractedResults.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(extractedResults.map((_, i) => i));
    }
  };

  const handleImport = () => {
    if (selectedIndices.length === 0) return;

    const wordsToAdd: VocabItem[] = selectedIndices.map((idx) => {
      const item = extractedResults[idx];
      return {
        id: `ai-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        kanji: item.kanji || item.hiragana,
        hiragana: item.hiragana,
        romaji: item.romaji || "",
        vietnamese: item.vietnamese || "",
        hanViet: item.hanViet || "",
        type: (item.type as any) || "noun",
        jlpt: (item.jlpt as any) || "N5",
        category: item.category || (isYoutubeMeta ? "YouTube / Subtitle" : "AI Extracted"),
        example: {
          japanese: item.example || `${item.kanji || item.hiragana}を使います。`,
          hiragana: item.hiragana || "",
          vietnamese: `Sử dụng từ ${item.vietnamese || item.kanji}`,
        },
        note: item.note || (isYoutubeMeta ? "Trích xuất trực tiếp từ Phụ đề YouTube" : "Trích xuất tự động bởi Gemini AI"),
        learned: false,
        bookmarked: true,
        custom: true,
      };
    });

    onAddWordsToApp(wordsToAdd);
    if (currentAccount && wordsToAdd.length > 0) {
      recordActivityLog(currentAccount.id, currentAccount.username, {
        action: "ai_extract",
        title: `Dùng AI Trích xuất ${wordsToAdd.length} từ mới`,
        details: isYoutubeMeta ? `Trích xuất từ phụ đề YouTube bằng Gemini AI` : `Trích xuất từ văn bản Tiếng Nhật bằng Gemini AI`,
        category: "Từ vựng",
      });
    }
    setImported(true);
    setTimeout(() => setImported(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner introduction */}
      <div className="bg-gradient-to-r from-red-950/80 via-stone-900 to-amber-950/80 border border-red-900/40 rounded-3xl p-6 md:p-8 text-stone-100 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-600/20 border border-red-500/30 rounded-2xl text-red-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent flex items-center gap-2">
              AI Trích Xuất Phụ Đề YouTube & Từ Vựng Tự Động
            </h2>
            <p className="text-sm text-stone-300 mt-1 leading-relaxed">
              Dán đường dẫn **YouTube** hoặc bất kỳ văn bản tiếng Nhật nào vào đây. 
              Thư viện hệ thống sẽ **trích xuất phụ đề gốc** của video và Gemini AI sẽ phân tích từ vựng, tự động chia động từ về dạng từ điển (辞書形), kèm Furigana, Hán Việt và Nghĩa tiếng Việt để bạn lưu trực tiếp vào ứng dụng!
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-800/80 pt-4">
          <button
            onClick={() => setActiveTab("youtube")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "youtube"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                : "bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800"
            }`}
          >
            <Youtube className="w-4 h-4 text-amber-400" />
            <span>Trích xuất từ Link YouTube</span>
          </button>

          <button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "text"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                : "bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800"
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Trích xuất từ Văn bản Tiếng Nhật</span>
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-sm space-y-4">
        {activeTab === "youtube" ? (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
              Nhập đường dẫn Video YouTube (Có phụ đề tiếng Nhật / Tự động):
            </label>
            <div className="relative">
              <Youtube className="w-5 h-5 absolute left-3.5 top-3.5 text-red-500" />
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-11 pr-4 py-3 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>

            {/* YouTube Samples */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-amber-400">Thử nhanh Link mẫu:</span>
              {SAMPLE_YOUTUBE_LINKS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setYoutubeUrl(sample.url)}
                  className="px-2.5 py-1 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-lg text-xs text-stone-300 flex items-center gap-1 transition-all"
                >
                  <Video className="w-3 h-3 text-red-400" />
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
              Nhập đoạn văn bản tiếng Nhật cần lọc từ:
            </label>
            <textarea
              value={inputStory}
              onChange={(e) => setInputStory(e.target.value)}
              rows={4}
              placeholder="Ví dụ: 昨日、友達と美味しいラーメンを食べました..."
              className="w-full p-4 bg-stone-950 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />

            {/* Text Samples */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-amber-400">Đoạn văn mẫu:</span>
              {SAMPLE_TEXTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputStory(sample.text)}
                  className="px-2.5 py-1 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-lg text-xs text-stone-300 flex items-center gap-1 transition-all"
                >
                  <FileText className="w-3 h-3 text-amber-400" />
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-stone-400">Ưu tiên JLPT:</span>
            <select
              value={levelHint}
              onChange={(e) => setLevelHint(e.target.value)}
              className="bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-200 px-3 py-2"
            >
              <option value="All">Tất cả trình độ</option>
              <option value="N5">N5 (Sơ cấp 1)</option>
              <option value="N4">N4 (Sơ cấp 2)</option>
              <option value="N3">N3 (Trung cấp)</option>
              <option value="N2">N2 (Cao cấp)</option>
              <option value="N1">N1 (Thượng cấp)</option>
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || (activeTab === "youtube" ? !youtubeUrl.trim() : !inputStory.trim())}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-red-950/50 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang trích xuất phụ đề & Phân tích từ vựng...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{activeTab === "youtube" ? "Trích xuất Phụ đề & Lọc từ mới" : "Bắt đầu Lọc Tất Cả Từ Mới"}</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* YouTube Video Player & Subtitle Preview when extracted */}
      {isYoutubeMeta && currentVideoUrl && (
        <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Subtitles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                Đã trích xuất Phụ đề Gốc từ Video YouTube thành công
              </h3>
            </div>
            <a
              href={currentVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Xem trên YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Embedded Player */}
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-stone-800 bg-black">
              <iframe
                src={getYouTubeEmbedUrl(currentVideoUrl)}
                title="YouTube Video Player"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Extracted Subtitle Transcript Snippet */}
            <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-3 flex flex-col justify-between max-h-[220px]">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wide border-b border-stone-800 pb-1 mb-2">
                Trích đoạn Phụ đề Tiếng Nhật thu được:
              </span>
              <p className="text-xs text-stone-300 font-serif leading-relaxed overflow-y-auto pr-1">
                {subtitlePreviewText || "Phụ đề đã được trích xuất và chuyển sang bộ lọc AI từ vựng."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Word Results */}
      {extractedResults.length > 0 && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Từ vựng trích xuất được: <span className="text-amber-400">{extractedResults.length} từ mới</span>
              </h3>
              <p className="text-xs text-stone-400">
                Tích chọn các từ bạn muốn lưu vào danh sách học tập của hệ thống.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={toggleSelectAll}
                className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-xs hover:bg-stone-700"
              >
                {selectedIndices.length === extractedResults.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button>

              <button
                onClick={handleImport}
                disabled={selectedIndices.length === 0}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow disabled:opacity-50 flex items-center gap-1.5"
              >
                {imported ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã thêm thành công!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Lưu ({selectedIndices.length}) từ vào Hệ thống</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* List of Extracted Vocabulary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {extractedResults.map((item, idx) => {
              const isSelected = selectedIndices.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleSelect(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? "bg-amber-950/20 border-amber-600/50"
                      : "bg-stone-950/60 border-stone-800 hover:border-stone-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Handled by div click
                    className="mt-1 rounded text-amber-500 focus:ring-amber-500"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-300">
                        {item.hiragana}
                      </span>
                      {item.jlpt && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-stone-300 font-bold border border-stone-700">
                          {item.jlpt}
                        </span>
                      )}
                    </div>

                    <h4 className="text-2xl font-bold font-serif text-stone-100 my-0.5">
                      {item.kanji}
                    </h4>

                    <p className="text-xs text-stone-400 italic mb-1">
                      {item.romaji} {item.hanViet ? `• [${item.hanViet}]` : ""}
                    </p>

                    <p className="text-xs font-semibold text-stone-200">
                      👉 {item.vietnamese}
                    </p>

                    {item.example && (
                      <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 italic bg-stone-900/60 p-1.5 rounded">
                        💬 {item.example}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playJapaneseSpeech(item.kanji || item.hiragana);
                    }}
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

