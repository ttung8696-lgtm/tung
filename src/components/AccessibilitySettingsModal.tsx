import React, { useState } from "react";
import { Settings, Volume2, VolumeX, Eye, Type, HelpCircle, Calendar, Sparkles } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, playMokugyoSound } from "../utils/soundEffects";

interface AccessibilitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSizeLevel: number; // 0: Normal, 1: Large, 2: Extra Large
  onChangeFontSize: (level: number) => void;
  isHighContrast: boolean;
  onToggleHighContrast: (enabled: boolean) => void;
  onOpenOnboarding: () => void;
}

export const AccessibilitySettingsModal: React.FC<AccessibilitySettingsModalProps> = ({
  isOpen,
  onClose,
  fontSizeLevel,
  onChangeFontSize,
  isHighContrast,
  onToggleHighContrast,
  onOpenOnboarding,
}) => {
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  if (!isOpen) return null;

  const handleToggleSound = (enabled: boolean) => {
    setSoundOn(enabled);
    setSoundEnabled(enabled);
    if (enabled) playMokugyoSound();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 text-stone-100">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-stone-100 font-serif-jp">
              Cài Đặt Tuỳ Biến & Trợ Năng
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 text-xs font-semibold px-2 py-1 rounded"
          >
            Đóng
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div className="flex items-center gap-2.5">
              {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
              <div>
                <div className="font-bold text-stone-200">Âm Thanh Mokugyo & Micro-interaction</div>
                <div className="text-[11px] text-stone-400">Tiếng gõ chuông gỗ, lật thẻ & âm báo đúng/sai</div>
              </div>
            </div>

            <button
              onClick={() => handleToggleSound(!soundOn)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                soundOn ? "bg-amber-500 text-stone-950" : "bg-stone-800 text-stone-400"
              }`}
            >
              {soundOn ? "BẬT" : "TẮT"}
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Type className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-stone-200">Kích Thước Chữ Kanji & Văn Bản</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { level: 0, label: "Mặc định (100%)" },
                { level: 1, label: "Lớn (115%)" },
                { level: 2, label: "Rất lớn (130%)" },
              ].map((item) => (
                <button
                  key={item.level}
                  onClick={() => onChangeFontSize(item.level)}
                  className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                    fontSizeLevel === item.level
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Theme Toggle */}
          <div className="flex items-center justify-between p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-amber-400" />
              <div>
                <div className="font-bold text-stone-200">Chế Độ Độ Tương Phản Cao</div>
                <div className="text-[11px] text-stone-400">Tối ưu cho mắt khi học ban đêm hoặc thị lực yếu</div>
              </div>
            </div>

            <button
              onClick={() => onToggleHighContrast(!isHighContrast)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isHighContrast ? "bg-amber-500 text-stone-950" : "bg-stone-800 text-stone-400"
              }`}
            >
              {isHighContrast ? "BẬT" : "TẮT"}
            </button>
          </div>

          {/* Re-open Onboarding Intro */}
          <button
            onClick={() => {
              onClose();
              onOpenOnboarding();
            }}
            className="w-full p-3 bg-stone-950 hover:bg-stone-800 rounded-xl border border-stone-800 text-left flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-stone-200">Xem lại Hướng Dẫn Ban Đầu (Onboarding)</span>
            </div>
            <span className="text-[11px] text-amber-400 font-bold">Mở lại ›</span>
          </button>
        </div>
      </div>
    </div>
  );
};
