import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollableHorizontalBarProps {
  children: React.ReactNode;
  className?: string;
  showScrollButtons?: boolean;
}

export const ScrollableHorizontalBar: React.FC<ScrollableHorizontalBarProps> = ({
  children,
  className = "",
  showScrollButtons = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 3);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 3);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScroll();
    window.addEventListener("resize", checkScroll);

    // Convert mouse wheel vertical scroll to horizontal scroll when hovering on PC
    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        if (e.deltaY !== 0) {
          e.preventDefault();
          el.scrollLeft += e.deltaY * 0.9;
          checkScroll();
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("scroll", checkScroll);

    return () => {
      window.removeEventListener("resize", checkScroll);
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftStart(el.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = containerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const distance = Math.abs(x - startX);
    if (distance > 3) {
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeftStart - walk;
      checkScroll();
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -220, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 220, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative flex items-center w-full group/scroll min-w-0">
      {/* Left Scroll Button on PC */}
      {showScrollButtons && canScrollLeft && (
        <button
          type="button"
          onClick={scrollLeft}
          className="flex absolute left-0 z-20 items-center justify-center w-7 h-7 -ml-2 rounded-full bg-stone-900/95 text-amber-400 border border-amber-500/50 shadow-lg hover:bg-amber-500 hover:text-stone-950 transition-all shrink-0"
          title="Cuộn sang trái (hoặc dùng con lăn chuột)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Main Scroll Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex items-center overflow-x-auto cursor-grab active:cursor-grabbing ${className}`}
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>

      {/* Right Scroll Button on PC */}
      {showScrollButtons && canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          className="flex absolute right-0 z-20 items-center justify-center w-7 h-7 -mr-2 rounded-full bg-stone-900/95 text-amber-400 border border-amber-500/50 shadow-lg hover:bg-amber-500 hover:text-stone-950 transition-all shrink-0"
          title="Cuộn sang phải (hoặc dùng con lăn chuột)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
