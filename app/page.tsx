"use client";

import { useEffect, useRef, useState } from "react";
import CircularGallery from "@/components/CircularGallery";
import { SplitText } from "@/components/ui/split-text";

const galleryItems = [
  { image: "/images/photo0.jpg", text: "" },
  { image: "/images/photo2.jpg", text: "" },
  { image: "/images/photo3.jpg", text: "" },
  { image: "/images/L1100431.jpg", text: "" },
  { image: "/images/L1090728.jpg", text: "" },
  { image: "/images/L1100236.jpg", text: "" },
];

export default function Home() {
  const smileyRef = useRef<HTMLSpanElement>(null);
  const [lineStyle, setLineStyle] = useState<{
    left: number;
    top: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const updateLine = () => {
      const smiley = smileyRef.current;
      const button = document.getElementById("agent-platform-button");

      if (smiley && button) {
        const smileyRect = smiley.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        const startX = smileyRect.right + 4;
        const startY = smileyRect.top + smileyRect.height / 2;
        const endX = buttonRect.left + buttonRect.width / 2;
        const endY = buttonRect.bottom + 8;

        setLineStyle({
          left: startX,
          top: startY,
          endX,
          endY,
        });
      }
    };

    checkMobile();
    updateLine();
    window.addEventListener("resize", updateLine);
    window.addEventListener("resize", checkMobile);

    const timer = setTimeout(() => setIsVisible(true), 500);
    const arrowTimer = setTimeout(() => setShowArrow(true), 2000);

    return () => {
      window.removeEventListener("resize", updateLine);
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timer);
      clearTimeout(arrowTimer);
    };
  }, []);

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden">
      {lineStyle && !isMobile && (
        <svg
          className="pointer-events-none fixed inset-0 z-40"
          style={{ width: "100%", height: "100%" }}
          aria-hidden="true"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
          <path
            d={`M ${lineStyle.left} ${lineStyle.top}
                Q ${lineStyle.left + (lineStyle.endX - lineStyle.left) * 0.6} ${lineStyle.top + 30},
                  ${lineStyle.endX} ${lineStyle.endY}`}
            stroke="#6b7280"
            strokeWidth="1"
            fill="none"
            markerEnd={showArrow ? "url(#arrowhead)" : undefined}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={isVisible ? 0 : 1}
            style={{
              transition: "stroke-dashoffset 1.5s ease-out",
            }}
          />
        </svg>
      )}
      <div className="px-4 pt-16 md:pt-6">
        <header className="text-center">
          <SplitText
            as="h1"
            text="Johann Hipp"
            className="font-[family-name:var(--font-noto-serif)] font-extrabold text-4xl text-gray-900 tracking-tight sm:text-5xl md:text-6xl"
          />
          <p className="mx-auto mt-6 max-w-xl text-gray-500">
            still trying to figure all of this out. love ultrarunning, trad climbing and alpine
            mountaineering. authenticity is all that matters.
          </p>
          <div className="mx-auto mt-4 mb-4 flex max-w-xl justify-center">
            <hr className="w-2/3 border-gray-200" />
          </div>
          <p className="mx-auto max-w-xl text-gray-500">
            We've pivoted -{" "}
            <a
              href="https://agentplatform.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:opacity-80"
            >
              Agent Platform
            </a>{" "}
            is our bet towards an AI ecosystem that needs better
            fundamentals. Would love to hear your feedback{" "}
            <span ref={smileyRef}>:)</span>
          </p>
        </header>
      </div>

      <div className="relative mt-3 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <CircularGallery items={galleryItems} bend={2} />
      </div>
    </div>
  );
}
