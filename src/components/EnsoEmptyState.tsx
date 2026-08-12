import React from "react";

interface EnsoEmptyStateProps {
  character?: string;
  title?: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export const EnsoEmptyState: React.FC<EnsoEmptyStateProps> = ({
  character = "無",
  title = "Không tìm thấy kết quả",
  description = "Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc cấp độ.",
  actionButton,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 animate-fade-in">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center group cursor-default">
        {/* Calligraphy Enso Ring SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-amber-500/40 animate-enso-slow group-hover:text-amber-400/60 transition-colors"
        >
          <path
            d="M 50,8 A 42,42 0 1,1 15,35"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeDasharray="210 25"
          />
        </svg>

        {/* Single Kanji in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-kanji text-4xl font-bold text-amber-400/90 drop-shadow-md select-none group-hover:scale-110 transition-transform">
            {character}
          </span>
        </div>
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="font-serif-jp text-base sm:text-lg font-bold text-stone-200">{title}</h3>
        <p className="text-xs text-stone-400 leading-relaxed">{description}</p>
      </div>

      {actionButton && <div className="pt-2">{actionButton}</div>}
    </div>
  );
};
