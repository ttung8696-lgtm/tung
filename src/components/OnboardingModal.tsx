import React, { useState } from "react";
import { Sparkles, Compass, Brain, Award, ChevronRight, Check } from "lucide-react";
import { playMokugyoSound, playCorrectChime } from "../utils/soundEffects";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoute?: (route: "kana" | "n5_n4" | "n3_n1") => void;
}

const STEPS = [
  {
    icon: "🌸",
    title: "Chào mừng đến với Nihongo Master!",
    subtitle: "Hệ thống học tiếng Nhật phong cách tối giản kiểu Nhật",
    description: "Ứng dụng được thiết kế tối ưu mobile-first, tích hợp lặp lại ngắt quãng SM-2, luyện viết Kanji, luyện phát âm AI và mô phỏng thi JLPT.",
  },
  {
    icon: "🧠",
    title: "Thuật Toán Ôn Tập Thông Minh (SRS)",
    subtitle: "Ghi nhớ từ vựng lâu gấp 5 lần",
    description: "Hệ thống tự động tính toán từ vựng bạn hay quên để đưa lên ôn sớm, đồng thời giãn cách từ bạn đã thuộc sâu. Hãy kiểm tra mục 'Cần Ôn Hôm Nay' hàng ngày!",
  },
  {
    icon: "🎯",
    title: "Lộ Trình Tích Hợp Đa Dạng",
    subtitle: "Bạn đang ở trình độ tiếng Nhật nào?",
    description: "Lựa chọn lộ trình phù hợp để ứng dụng gợi ý các bài học và bộ từ vựng tốt nhất cho bạn.",
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSelectRoute,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    playMokugyoSound();
    if (currentStep + 1 < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      playCorrectChime();
      onClose();
    }
  };

  const handleRouteChoice = (route: "kana" | "n5_n4" | "n3_n1") => {
    if (onSelectRoute) onSelectRoute(route);
    playCorrectChime();
    onClose();
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-stone-900 border-2 border-amber-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 text-stone-100">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-amber-400 border-b border-stone-800 pb-3">
          <span>Hướng Dẫn Ban Đầu ({currentStep + 1}/{STEPS.length})</span>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 text-xs font-semibold px-2 py-1 rounded"
          >
            Bỏ qua
          </button>
        </div>

        {/* Content */}
        <div className="text-center space-y-3 py-2">
          <div className="text-5xl">{step.icon}</div>
          <h2 className="text-xl font-extrabold text-amber-200 font-serif-jp">
            {step.title}
          </h2>
          <p className="text-xs font-bold text-amber-400">
            {step.subtitle}
          </p>
          <p className="text-xs text-stone-300 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Route Selector inside Step 3 */}
        {currentStep === 2 && (
          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleRouteChoice("kana")}
              className="w-full p-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-amber-500 rounded-xl text-left text-xs space-y-0.5 transition-all"
            >
              <div className="font-bold text-amber-300">🌱 Nhập môn: Bảng chữ cái Kana & Giao tiếp cơ bản</div>
              <div className="text-[11px] text-stone-400">Dành cho người mới bắt đầu học tiếng Nhật</div>
            </button>
            <button
              onClick={() => handleRouteChoice("n5_n4")}
              className="w-full p-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-amber-500 rounded-xl text-left text-xs space-y-0.5 transition-all"
            >
              <div className="font-bold text-amber-300">📚 Sơ cấp: Trình độ N5 & N4 (Nihongo Master)</div>
              <div className="text-[11px] text-stone-400">Luyện thi N5-N4, giao tiếp hàng ngày</div>
            </button>
            <button
              onClick={() => handleRouteChoice("n3_n1")}
              className="w-full p-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-amber-500 rounded-xl text-left text-xs space-y-0.5 transition-all"
            >
              <div className="font-bold text-amber-300">🎯 Trung & Cao cấp: Trình độ N3, N2 & N1</div>
              <div className="text-[11px] text-stone-400">Đề thi thử JLPT, ngữ pháp nâng cao</div>
            </button>
          </div>
        )}

        {/* Bottom Button */}
        {currentStep < 2 && (
          <button
            onClick={handleNext}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs inline-flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>Tiếp tục</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
