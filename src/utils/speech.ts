// Helper to filter out romaji and parenthetical text (e.g. "〜てから (Te kara)" -> "〜てから")
export function cleanJapaneseOnlyText(text: string): string {
  if (!text) return "";
  
  // 1. Remove text inside parentheses (parenthetical romaji/explanations)
  let cleaned = text.replace(/[\(\（][^\)\）]*[\)\）]/g, "");

  // 2. Remove any remaining Latin/Romaji letters (a-z, A-Z)
  const nonLatin = cleaned.replace(/[a-zA-Z]/g, "").trim();

  // 3. If there is Japanese text (kana/kanji/symbols) remaining, return it
  if (nonLatin.replace(/[\s\~\〜\-\–\—]/g, "").length > 0) {
    return nonLatin;
  }

  return cleaned.trim() || text;
}

// Text to Speech Utility for Japanese Pronunciation
export function speakJapanese(text: string, rate: number = 0.9) {
  if (!("speechSynthesis" in window)) {
    alert("Trình duyệt của bạn không hỗ trợ tính năng phát âm tự động.");
    return;
  }

  window.speechSynthesis.cancel(); // Stop ongoing speech

  const targetText = cleanJapaneseOnlyText(text);
  const utterance = new SpeechSynthesisUtterance(targetText);
  utterance.lang = "ja-JP";
  utterance.rate = rate;

  // Try to find a Japanese voice
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find((v) => v.lang.includes("ja") || v.lang.includes("JP"));
  if (jaVoice) {
    utterance.voice = jaVoice;
  }

  window.speechSynthesis.speak(utterance);
}
