import { cleanJapaneseOnlyText } from "./speech";

/**
 * Japanese Speech Synthesis helper
 */
export function playJapaneseSpeech(text: string): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Trình duyệt không hỗ trợ Web Speech Synthesis API.");
    return false;
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const targetText = cleanJapaneseOnlyText(text);
    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = "ja-JP";
    utterance.rate = 0.85; // Slightly slower for clear learning

    // Find Japanese voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find((v) => v.lang.startsWith("ja"));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("Lỗi khi phát âm tiếng Nhật:", err);
    return false;
  }
}
