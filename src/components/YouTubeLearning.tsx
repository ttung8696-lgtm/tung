import React, { useState } from "react";
import { Youtube, Search, Play, Sparkles, Plus, Volume2, BookOpen, Layers, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { apiUrl } from "../utils/api";
import { VocabItem } from "../types";
import { UserAccount } from "../lib/userAccount";
import { ScrollableHorizontalBar } from "./common/ScrollableHorizontalBar";

interface YouTubeLearningProps {
  onAddWordsToApp: (words: VocabItem[]) => void;
  currentAccount: UserAccount | null;
}

interface VideoPreset {
  id: string;
  title: string;
  youtubeId: string;
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  category: string;
  transcriptLines: Array<{
    start: number;
    text: string;
    translationVi: string;
  }>;
}

const FEATURED_VIDEOS: VideoPreset[] = [
  {
    id: "v1",
    title: "Giao tiếp cơ bản hàng ngày (日常会話)",
    youtubeId: "vB0jQjIn4J4",
    level: "N5",
    category: "Giao tiếp",
    transcriptLines: [
      { start: 0, text: "こんにちは。お元気ですか。", translationVi: "Xin chào. Bạn có khỏe không?" },
      { start: 3, text: "はい、元気です。ありがとうございます。", translationVi: "Vâng, tôi khỏe. Cảm ơn bạn." },
      { start: 7, text: "お名前は何ですか。", translationVi: "Tên bạn là gì?" },
      { start: 10, text: "私はツンと申します。よろしくお願いします。", translationVi: "Tôi tên là Tùng. Rất mong được giúp đỡ." }
    ]
  },
  {
    id: "v2",
    title: "Mẫu câu đặt phòng khách sạn tại Nhật (ホテル予約)",
    youtubeId: "J88rYc6vNf4",
    level: "N4",
    category: "Du lịch",
    transcriptLines: [
      { start: 0, text: "すみません、チェックインをお願いします。", translationVi: "Xin lỗi, cho tôi nhận phòng ạ." },
      { start: 4, text: "ご予約のお名前を教えていただけますか。", translationVi: "Anh/chị có thể cho biết tên đặt phòng được không ạ?" },
      { start: 9, text: "朝食は何時からですか。", translationVi: "Bữa sáng từ mấy giờ ạ?" }
    ]
  },
  {
    id: "v3",
    title: "Luyện nghe tin tức NHK Easy News (ニュースで学ぶ)",
    youtubeId: "kL9Y8N_P9k8",
    level: "N3",
    category: "Tin tức",
    transcriptLines: [
      { start: 0, text: "日本の新しい技術についてニュースをお伝えします。", translationVi: "Chúng tôi xin chuyển đến tin tức về công nghệ mới của Nhật Bản." },
      { start: 5, text: "AIを利用した言語学習ツールが人気を集めています。", translationVi: "Công cụ học ngôn ngữ sử dụng AI đang rất được ưa chuộng." }
    ]
  }
];

export const YouTubeLearning: React.FC<YouTubeLearningProps> = ({ onAddWordsToApp, currentAccount }) => {
  const [videoInput, setVideoInput] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoPreset>(FEATURED_VIDEOS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [analyzingLine, setAnalyzingLine] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Extract Youtube ID from input
  const getYoutubeId = (urlOrId: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return match && match[2].length === 11 ? match[2] : urlOrId.trim();
  };

  const handleLoadCustomVideo = async () => {
    if (!videoInput.trim()) return;
    const ytId = getYoutubeId(videoInput);
    setIsLoading(true);
    setStatusMessage("Đang trích xuất Subtitle tiếng Nhật từ YouTube...");

    try {
      const res = await fetch(apiUrl("/api/gemini/extract-words"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: videoInput.trim() })
      });
      const data = await res.json();

      if (data.success && data.words) {
        // Create custom preset from YouTube response
        const newPreset: VideoPreset = {
          id: `custom_${Date.now()}`,
          title: `Video YouTube (${ytId})`,
          youtubeId: ytId,
          level: "N3",
          category: "YouTube Custom",
          transcriptLines: data.words.map((w: any, idx: number) => ({
            start: idx * 5,
            text: w.example || w.kanji || w.hiragana,
            translationVi: w.vietnamese
          }))
        };

        setSelectedVideo(newPreset);
        setStatusMessage("Đã phân tích từ vựng & câu thoại tiếng Nhật cho video!");
      } else {
        // Fallback preset with user YouTube ID
        setSelectedVideo({
          id: `custom_${Date.now()}`,
          title: `Video Custom (${ytId})`,
          youtubeId: ytId,
          level: "N3",
          category: "YouTube Custom",
          transcriptLines: [
            { start: 0, text: "日本語の字幕を読み込んでいます...", translationVi: "Đang tải subtitle tiếng Nhật..." }
          ]
        });
        setStatusMessage(data.message || "Video đã sẵn sàng!");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Không thể tự động tải transcript, bạn vẫn có thể xem video!");
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze single line with AI Gemini
  const handleAnalyzeSentence = async (sentence: string) => {
    setAnalyzingLine(sentence);
    setAiAnalysisResult(null);

    try {
      const res = await fetch(apiUrl("/api/gemini/check-grammar-sentence"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence })
      });
      const data = await res.json();
      setAiAnalysisResult(data.result || data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingLine(null);
    }
  };

  // Extract word to flashcard list
  const handleSaveSentenceAsVocab = (line: { text: string; translationVi: string }) => {
    const newItem: VocabItem = {
      id: `yt_${Date.now()}`,
      kanji: line.text,
      hiragana: line.text,
      romaji: "YouTube Sample",
      vietnamese: line.translationVi,
      type: "phrase",
      jlpt: selectedVideo.level,
      category: "YouTube Learning",
      example: {
        japanese: line.text,
        hiragana: line.text,
        vietnamese: line.translationVi
      },
      custom: true
    };

    onAddWordsToApp([newItem]);
    setStatusMessage(`Đã lưu câu "${line.text.slice(0, 15)}..." vào danh sách học!`);
  };

  const speakJapanese = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5" />
                YOUTUBE LEARNING
              </span>
              <span className="text-xs text-stone-400">Học qua Subtitle Video</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-serif-jp">
              Luyện Phản Xạ Tiếng Nhật Qua Video YouTube
            </h2>
            <p className="text-xs text-stone-400 max-w-xl">
              Dán link YouTube hoặc chọn bài học mẫu. AI sẽ tự động phân tích câu, ngữ pháp và lưu từ vựng vào bộ thẻ học cá nhân.
            </p>
          </div>

          {/* Search/URL Input Box */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Youtube className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                placeholder="Dán link YouTube (URL/ID)..."
                className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <button
              onClick={handleLoadCustomVideo}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-semibold text-xs rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-md shrink-0 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isLoading ? "Đang tải..." : "Tải Video"}</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Preset Video Selector */}
        <div className="pt-3 border-t border-stone-800 flex items-center gap-2 w-full">
          <span className="text-xs font-semibold text-stone-400 shrink-0">Video đề xuất:</span>
          <ScrollableHorizontalBar className="gap-2">
            {FEATURED_VIDEOS.map((vid) => (
              <button
                key={vid.id}
                onClick={() => {
                  setSelectedVideo(vid);
                  setAiAnalysisResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border shrink-0 ${
                  selectedVideo.id === vid.id
                    ? "bg-red-600/30 text-red-300 border-red-500/50 shadow-sm"
                    : "bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700"
                }`}
              >
                <Play className="w-3 h-3 text-red-400 fill-current" />
                <span>{vid.title}</span>
                <span className="text-[10px] font-bold text-amber-300 font-mono">[{vid.level}]</span>
              </button>
            ))}
          </ScrollableHorizontalBar>
        </div>
      </div>

      {/* Main Player & Subtitle View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Embed Player */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=0&rel=0`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">{selectedVideo.title}</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Thể loại: {selectedVideo.category} • Trình độ: <strong className="text-amber-300">{selectedVideo.level}</strong>
              </p>
            </div>
            <a
              href={`https://youtube.com/watch?v=${selectedVideo.youtubeId}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Xem trên YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Column: Subtitle Transcript & AI Tool */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Subtitle & Phân Tích Câu</h3>
              </div>
              <span className="text-[10px] text-stone-500 uppercase font-mono">
                {selectedVideo.transcriptLines.length} dòng
              </span>
            </div>

            {/* Transcript Lines List */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
              {selectedVideo.transcriptLines.map((line, idx) => (
                <div
                  key={idx}
                  className="bg-stone-950 border border-stone-800 hover:border-amber-500/40 p-3.5 rounded-xl space-y-2 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-amber-200 font-serif-jp leading-relaxed">
                      {line.text}
                    </p>
                    <button
                      onClick={() => speakJapanese(line.text)}
                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-300 transition-colors shrink-0"
                      title="Nghe giọng đọc"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-400 leading-normal">
                    {line.translationVi}
                  </p>

                  <div className="pt-2 border-t border-stone-900 flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => handleAnalyzeSentence(line.text)}
                      className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{analyzingLine === line.text ? "Đang phân tích..." : "AI giải thích"}</span>
                    </button>

                    <button
                      onClick={() => handleSaveSentenceAsVocab(line)}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Lưu vào Flashcard</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Popup Box */}
          {aiAnalysisResult && (
            <div className="bg-stone-900 border border-amber-500/40 p-4 rounded-2xl space-y-2 animate-fade-in shadow-xl">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold border-b border-stone-800 pb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Kết quả AI phân tích chi tiết câu:</span>
              </div>
              <div className="text-xs text-stone-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {typeof aiAnalysisResult === "string" ? aiAnalysisResult : JSON.stringify(aiAnalysisResult, null, 2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
